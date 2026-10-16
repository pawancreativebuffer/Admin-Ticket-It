"use client";

import { Suspense, createContext, useContext, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { useToast } from "@/components/Toast";
import EditItemsModal, { type Item } from "@/components/EditItemsModal";
import EditZonesModal from "@/components/EditZonesModal";
import CheckListModal from "@/components/CheckListModal";

import FieldSelectsModal from "@/components/FieldSelectsModal";
import UploadContentModal from "@/components/UploadContentModal";
import CreateTicketModal from "@/components/CreateTicketModal";
import TicketMappingModal from "@/components/TicketMappingModal";
import ShowFieldsModal from "@/components/ShowFieldsModal";
import FileUploadModal from "@/components/FileUploadModal";
import InvoiceForm from "@/components/InvoiceForm";
import {
  StockProfilesModal,
  StockSnapshotModal,
  type StockProfile,
  type StockRow,
} from "@/components/StockModals";

// dummy stock on hand rows: a few SKUs across the store users and two locations
const STOCK_ROWS: StockRow[] = [
  "10001",
  "10002",
  "10003",
  "10004",
  "10005",
  "10006",
].flatMap((sku, i) =>
  ["ST.7eleven", "ST1.7eleven", "ST2.7eleven"].map((storeUser, j) => ({
    sku,
    quantity: ((i + 3) * (j + 5)) % 40,
    storeUser,
    location: j % 2 === 0 ? "Front Store" : "Back Room",
    updated: `1${(i + j) % 6}/10/2026 0${(i + 8) % 10}:30`,
  })),
);
import {
  MasterIntegrationModal,
  StoreIntegrationModal,
  type StoreIntegration,
} from "@/components/IntegrationModals";
import FontMapsModal, {
  FontMapTable,
  type FontMap,
} from "@/components/FontMapsModal";

// fonts used inside the ticket templates, and the uploaded font files they can map onto
const TEMPLATE_FONTS = [
  "Arial",
  "RobotoCondensed-Black",
  "RobotoCondensed-Bold",
  "RobotoCondensed-Medium",
  "RobotoCondensed-Regular",
];
const DIRECTORY_FONTS = [
  "Arial",
  ...Array.from(new Set(FONTS.map((font) => font.replace(/\.[^.]+$/, "")))),
];
import FilterProfileModal, {
  FilterNameModal,
  type FilterProfile,
} from "@/components/FilterProfileModal";
import EditDataFieldsModal, {
  type DataField,
  type KeyFields,
} from "@/components/EditDataFieldsModal";
import StoreOwnerGroupModal, {
  type StoreOwnerGroup,
} from "@/components/StoreOwnerGroupModal";

// ticket templates that can be marked as core tickets (legacy list)
const CORE_TICKET_OPTIONS = [
  "2.9_BWRY_Landscape_296x128",
  "A3_Portrait_1UP",
  "A4_A5_Portrait_2UP",
  "A4_A7_Portrait_8UP",
  "A4_Portrait_1UP",
];

// head office users can manage a store owner group; store (franchisee) users belong to one
const MANAGER_USERS = headOffice.map((user) => user.username);
const STORE_USERS = franchisees.map((user) => user.username);
import { headOffice, regionalManagers, franchisees } from "@/data/users";

// client users that can be put into a group or department (dummy users from the Users page)
const CLIENT_USERS = [...headOffice, ...regionalManagers, ...franchisees].map(
  (user) => user.username,
);

// fields that can be made zonal (legacy list: data fields plus Normal Price), alphabetical
const ZONAL_FIELD_OPTIONS = [...DATA_FIELDS, "Normal Price"].sort((a, b) =>
  a.localeCompare(b),
);
import { clients } from "@/data/clients";
import {
  CORE,
  DATA_FIELDS,
  DEPARTMENTS,
  FONTS,
  FONT_MAPS,
  IMAGE_COUNT,
  IMAGES,
  REGIONS,
  SETTINGS,
  TICKETS,
} from "@/data/clientSetup";

// section list for the side navigation (same order as the legacy page), with a short tagline for each title bar
const SECTIONS = [
  ["settings", "Settings", "Feature switches for this client"],
  ["regions", "Regions", "Store regions used for grouping and reporting"],
  ["departments", "Departments", "Departments and their users"],
  [
    "core-reference",
    "Core Reference Fields",
    "Reference fields linked to the core product database",
  ],
  ["zones", "Zones", "Zone setup for batches"],
  ["groups", "Groups", "Template permission groups"],
  ["store-owner-groups", "Store Owner Groups", "Multi-store owner groups"],
  [
    "core-settings",
    "Core Settings",
    "Core tickets, lookup, view and search fields",
  ],
  ["content-files", "Content Files", "Fonts and images synced for this client"],
  ["data-fields", "Data Fields", "Product data fields available on tickets"],
  ["filter-profiles", "Filter Profiles", "Saved filter profiles"],
  ["tickets", "Tickets", "Ticket templates and their field setup"],
  ["font-maps", "Font Maps", "Template fonts mapped to uploaded fonts"],
  ["rules", "Rules", "Rendering and sorting rules for tickets"],
  ["ticket-mappings", "Ticket Mappings", "Field mappings for ticket views"],
  ["integrations", "Integrations", "POS and product sync integrations"],
  [
    "stock-on-hand",
    "Stock On Hand",
    "Stock snapshots and CSV mapping profiles",
  ],
  ["invoice", "Invoice", "Billing setup used by the admin invoice report"],
  ["api-logs", "Download API Logs", "Export the latest API request logs"],
] as const;

// section with a grey title bar; the section's edit/add buttons sit on the right of that bar
// which sections are expanded; shared with every Section through context
const AccordionContext = createContext<{
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
}>({ isOpen: () => false, toggle: () => {} });

// accordion section: grey title bar toggles the content; the section's buttons sit on the right of that bar
function Section({
  id,
  title,
  actions,
  children,
}: {
  id: string;
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { isOpen, toggle } = useContext(AccordionContext);
  const open = isOpen(id);
  const tagline = SECTIONS.find(([sectionId]) => sectionId === id)?.[2] ?? "";
  return (
    <section id={id} className={`setup-section${open ? " open" : ""}`}>
      <div
        className="setup-title-bar"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => toggle(id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle(id);
          }
        }}
      >
        <h3 className="setup-title">{title}</h3>
        <div className="setup-title-right">
          <span className="setup-tagline">{tagline}</span>
          <i
            className={`fa-solid fa-chevron-${open ? "up" : "down"} accordion-caret`}
          ></i>
        </div>
      </div>
      {open && (
        <div className="setup-body">
          {actions && <div className="setup-body-actions">{actions}</div>}
          {children}
        </div>
      )}
    </section>
  );
}

// sub block inside a section (Core Settings, Content Files, Rules): small title with its button on the right
function SubBlock({
  title,
  actions,
  children,
}: {
  title: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="sub-block">
      <div className="sub-head">
        <h4 className="sub-title">{title}</h4>
        {actions}
      </div>
      {children}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="client-chips">
      {items.map((item) => (
        <span key={item} className="chip">
          {item}
        </span>
      ))}
    </div>
  );
}

// icon for an action button, picked from its label (Edit -> pencil, Add/Create -> plus, ...)
function iconFor(label: string) {
  const text = label.toLowerCase();
  if (text.startsWith("upload")) return "fa-upload";
  if (text.startsWith("download")) return "fa-download";
  if (text.startsWith("sync")) return "fa-cloud-arrow-up";
  if (text.startsWith("add") || text.startsWith("create")) return "fa-plus";
  if (text.startsWith("view") || text.startsWith("show")) return "fa-eye";
  if (text.startsWith("edit")) return "fa-pencil";
  if (text.startsWith("manage")) return "fa-list-check";
  if (text.startsWith("test")) return "fa-vial";
  if (text.includes("integration")) return "fa-plug";
  if (text.includes("kerning")) return "fa-text-width";
  if (text.includes("fields")) return "fa-list";
  return "fa-gear";
}

// icon button in the cta_with_icon style (icon segment + label)
function ActionButton({
  children,
  onClick,
  color = "secondary-bg",
  size = "sm",
  tip,
}: {
  children: string;
  onClick?: () => void;
  color?:
    | "secondary-bg"
    | "dark-bg"
    | "mint-bg"
    | "primary-bg"
    | "peach-bg"
    | "champagne-bg"
    | "tea-bg";
  size?: "sm" | "md";
  // tooltip text; inside sub blocks the button shows only its icon and this text on hover
  tip?: string;
}) {
  return (
    <button
      type="button"
      className={`cta_with_icon ${size === "sm" ? "btn-sm" : ""} ${color}`}
      data-tip={tip ?? children}
      aria-label={tip ?? children}
      onClick={onClick}
    >
      <span>
        <i className={`fa-solid ${iconFor(children)}`}></i>
      </span>
      <p>{children}</p>
    </button>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  // plain checkbox like the rest of the real app (no switches)
  return (
    <label className="check-row">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

function EditClientForm() {
  const toast = useToast();
  const requested = useSearchParams().get("client");
  const [client, setClient] = useState(
    requested && clients.includes(requested) ? requested : clients[0],
  );
  const [settings, setSettings] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SETTINGS.map((setting) => [setting.key, setting.on])),
  );
  const [zonesOn, setZonesOn] = useState(false);
  const [zoneChange, setZoneChange] = useState(false);
  const [zones, setZones] = useState<string[]>([]);
  const [zonalFields, setZonalFields] = useState<string[]>([]);
  const [showAllFonts, setShowAllFonts] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const fonts = FONTS;
  const images = IMAGES;
  const imageCount = IMAGE_COUNT;
  const [uploadOpen, setUploadOpen] = useState(false);
  // data fields with their settings, plus the product name / id / price key fields
  const [dataFields, setDataFields] = useState<DataField[]>(() =>
    [...DATA_FIELDS, "Normal Price"].map((name) => ({
      name,
      type: /date/i.test(name) ? "Date" : "Text",
      hideWhenPrinting: false,
      nonEditableInAdhoc: false,
    })),
  );
  const [keyFields, setKeyFields] = useState<KeyFields>({
    name: "Product Description",
    id: "SKU",
    price: "Promo Price",
  });
  const [dataFieldsOpen, setDataFieldsOpen] = useState(false);
  // ticket templates; Create New Ticket adds to this list
  const [tickets, setTickets] = useState<string[]>(TICKETS);
  // "new" opens the form empty, a ticket name opens it for editing
  const [ticketForm, setTicketForm] = useState<string | null>(null);
  // edit-field mapping per ticket (ordered field list) and the ticket whose mapping is open
  const [ticketMappings, setTicketMappings] = useState<
    Record<string, string[]>
  >({
    "Food Villa A3": ["Product Description", "Promo Price", "RRP"],
    "Food Villa A4": ["Product Description", "Promo Price"],
  });
  const [mappingFor, setMappingFor] = useState<string | null>(null);
  // client level view mappings opened from the Ticket Mappings buttons
  const [viewMappings, setViewMappings] = useState<Record<string, string[]>>({
    "View Fields": [
      "SKU",
      "Product Description",
      "Promo Price",
      "Normal Price",
      "RRP",
    ],
    "Adhoc View Fields": [
      "SKU",
      "Product Description",
      "Promo Price",
      "Normal Price",
      "RRP",
    ],
    "Summary View Fields": [
      "Product Description",
      "Promo Price",
      "Normal Price",
      "RRP",
    ],
    "Core View Fields": [
      "SKU",
      "Product Description",
      "Promo Price",
      "RRP",
      "Start Date",
      "UOM",
      "End Date",
    ],
    "Core Lookup Fields": [
      "SKU",
      "Product Description",
      "Promo Price",
      "RRP",
      "Start Date",
      "UOM",
      "End Date",
      "Ticket Type",
      "Message",
    ],
  });
  const [viewMappingFor, setViewMappingFor] = useState<string | null>(null);
  // integrations: the client's master POS and the store users' own POS selection
  const [masterPos, setMasterPos] = useState({ pos: "", connected: false });
  const [storeIntegrations, setStoreIntegrations] = useState<
    StoreIntegration[]
  >(() =>
    STORE_USERS.map((username) => ({
      username,
      pos: "Master",
      enabled: false,
    })),
  );
  const [stockProfiles, setStockProfiles] = useState<StockProfile[]>([]);
  const [stockModal, setStockModal] = useState<"profiles" | "snapshot" | null>(
    null,
  );
  const [integrationModal, setIntegrationModal] = useState<
    "master" | "store" | null
  >(null);
  // adhoc edit field mapping per ticket, custom kerning per ticket, and which popup is open
  const [adhocMappings, setAdhocMappings] = useState<Record<string, string[]>>({
    "Food Villa A3": [
      "Ticket Type",
      "SKU",
      "Product Description",
      "Promo Price",
    ],
  });
  const [adhocFor, setAdhocFor] = useState<string | null>(null);
  const [kerning, setKerning] = useState<Record<string, Item[]>>({});
  const [kerningFor, setKerningFor] = useState<string | null>(null);
  const [showFieldsFor, setShowFieldsFor] = useState<string | null>(null);
  const [fontMaps, setFontMaps] = useState<FontMap[]>(FONT_MAPS);
  // rules: "test" opens the rules file test, "patchers" the sorting patcher upload
  const [rulesModal, setRulesModal] = useState<"test" | "patchers" | null>(
    null,
  );
  const [sortingPatcher, setSortingPatcher] = useState("Default patcher.");
  const [fontMapsOpen, setFontMapsOpen] = useState(false);
  const deleteFontMap = (index: number) => {
    const removed = fontMaps[index];
    setFontMaps((current) => current.filter((_, i) => i !== index));
    if (removed) toast(`Font map ${removed.template} deleted`);
  };
  // saved filter profiles; which one is being edited ("new" for create) or renamed
  const [filterProfiles, setFilterProfiles] = useState<FilterProfile[]>([]);
  const [filterEdit, setFilterEdit] = useState<number | "new" | null>(null);
  const [filterRename, setFilterRename] = useState<number | null>(null);
  // regions and departments edited through their popups
  const [regions, setRegions] = useState<Item[]>(() =>
    REGIONS.map((name) => ({ name, description: "" })),
  );
  const [departments, setDepartments] = useState<Item[]>(() =>
    DEPARTMENTS.map((name) => ({ name })),
  );
  const [coreRefs, setCoreRefs] = useState<Item[]>([]);
  const [groups, setGroups] = useState<Item[]>([]);
  // "Edit Users" popup for a group or department, and the users picked for each
  const [usersFor, setUsersFor] = useState<{
    kind: "Group" | "Department";
    name: string;
  } | null>(null);
  const [members, setMembers] = useState<Record<string, string[]>>({});
  // store owner groups and which one the popup is editing ("new" for a fresh one)
  const [storeGroups, setStoreGroups] = useState<StoreOwnerGroup[]>([]);
  // core product name fields ("" = Empty / not set)
  const [productName, setProductName] = useState({
    preferred: "",
    secondary: "",
  });
  const [productNameOpen, setProductNameOpen] = useState(false);
  // core search fields: five slots, each one data field or "" (Empty)
  const [searchFields, setSearchFields] = useState<string[]>([
    ...CORE.searchFields,
    "",
    "",
    "",
  ]);
  const [searchFieldsOpen, setSearchFieldsOpen] = useState(false);
  // core change report fields: five slots like the search fields
  const [reportFields, setReportFields] = useState<string[]>(
    [0, 1, 2, 3, 4].map((i) => CORE.changeReportFields[i] ?? ""),
  );
  const [reportFieldsOpen, setReportFieldsOpen] = useState(false);
  // batch filter attributes: five attribute search field slots
  const [filterFields, setFilterFields] = useState<string[]>(
    [0, 1, 2, 3, 4].map((i) => CORE.batchFilterAttributes[i] ?? ""),
  );
  const [filterFieldsOpen, setFilterFieldsOpen] = useState(false);
  // core tickets, lookup keys and view keys, each with its own edit popup
  const [coreSetup, setCoreSetup] = useState({
    tickets: ["A4_A5_Portrait_2UP", "A4_A7_Portrait_8UP", "A4_Portrait_1UP"],
    lookupKeys: [...CORE.lookupFields],
    viewKeys: [...CORE.viewFields],
  });
  const [coreEdit, setCoreEdit] = useState<
    "tickets" | "lookupKeys" | "viewKeys" | null
  >(null);
  const [storeGroupEdit, setStoreGroupEdit] = useState<number | "new" | null>(
    null,
  );
  const [editing, setEditing] = useState<
    | "regions"
    | "departments"
    | "core-reference"
    | "zones"
    | "zonal-fields"
    | "groups"
    | null
  >(null);
  // nav item highlighted only when clicked; clicking it also expands that section
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0][0]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const accordion = {
    isOpen: (id: string) => Boolean(openSections[id]),
    // opening a section from its title bar also highlights it in the left nav
    toggle: (id: string) => {
      if (!openSections[id]) setActiveSection(id);
      setOpenSections((current) => ({ ...current, [id]: !current[id] }));
    },
  };
  const openFromNav = (id: string) => {
    setActiveSection(id);
    setOpenSections((current) => ({ ...current, [id]: true }));
  };
  // every accordion section (all but the logo row)
  const accordionIds = SECTIONS.map(([id]) => id);
  const allOpen = accordionIds.every((id) => openSections[id]);
  const toggleAll = () =>
    setOpenSections(
      Object.fromEntries(accordionIds.map((id) => [id, !allOpen])),
    );

  const flip = (key: string, label: string) => {
    const next = !settings[key];
    setSettings((current) => ({ ...current, [key]: next }));
    toast(`${label} ${next ? "enabled" : "disabled"}`);
  };
  const noop = (what: string) => () => toast(`${what} (design only)`);

  return (
    <>
      <div className="detail-page-topbar">
        <div>
          <ul className="breadcrumb-items">
            <li>
              <Link href="/client-administration">Client Administration</Link>
            </li>
            <li>Edit Client</li>
          </ul>
          <div className="global-back-button">
            <Link href="/client-administration">
              <span>
                <i className="fa-solid fa-arrow-left"></i> Go Back
              </span>
            </Link>
            Edit {client}
          </div>
        </div>
        <div className="topbar-client">
          {/* client logo; hover shows an upload overlay, picking a file only shows a toast (design only) */}
          <label className="logo-preview logo-upload" title="Upload new logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/client-logo.png" alt={`${client} logo`} />
            <span className="logo-upload-badge" aria-hidden="true">
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const name = event.target.files?.[0]?.name;
                if (name) toast(`New logo selected: ${name} (design only)`);
              }}
            />
          </label>
          <div className="custom-field change-client">
            <label className="field-label" htmlFor="change-client">
              Change Client
            </label>
            <div className="field-type field-stype-select">
              <select
                id="change-client"
                value={client}
                onChange={(event) => setClient(event.target.value)}
              >
                {clients.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down"></i>
            </div>
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-4 p-4">
        <div className="setup-layout">
          <nav className="setup-nav">
            <div className="expand-row">
              <label className="check-row expand-all">
                <input type="checkbox" checked={allOpen} onChange={toggleAll} />
                <span>{allOpen ? "Collapse All" : "Expand All"}</span>
              </label>
            </div>
            <ul>
              {SECTIONS.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={id === activeSection ? "active" : undefined}
                    onClick={() => openFromNav(id)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <AccordionContext.Provider value={accordion}>
            <div className="setup-content">
              <Section id="settings" title="Settings">
                <div className="toggle-grid">
                  {SETTINGS.map((setting) => (
                    <Toggle
                      key={setting.key}
                      label={setting.label}
                      checked={settings[setting.key]}
                      onChange={() => flip(setting.key, setting.label)}
                    />
                  ))}
                </div>
              </Section>

              <Section
                id="regions"
                title="Regions"
                actions={
                  <ActionButton onClick={() => setEditing("regions")}>
                    Edit Regions
                  </ActionButton>
                }
              >
                {regions.length > 0 ? (
                  <Chips items={regions.map((region) => region.name)} />
                ) : (
                  <p className="muted">
                    No regions have been added for this client.
                  </p>
                )}
              </Section>

              <Section
                id="departments"
                title="Departments"
                actions={
                  <ActionButton onClick={() => setEditing("departments")}>
                    Edit Departments
                  </ActionButton>
                }
              >
                {departments.length > 0 ? (
                  <div className="dept-list">
                    {departments.map((dept) => (
                      <div key={dept.name} className="dept-row">
                        <strong>{dept.name}</strong>
                        <ActionButton
                          tip="Edit Users"
                          onClick={() =>
                            setUsersFor({ kind: "Department", name: dept.name })
                          }
                        >
                          Edit Users
                        </ActionButton>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="muted">
                    No departments have been added for this client.
                  </p>
                )}
              </Section>

              <Section
                id="core-reference"
                title="Core Reference Fields"
                actions={
                  <ActionButton onClick={() => setEditing("core-reference")}>
                    Add Core Reference Field
                  </ActionButton>
                }
              >
                {coreRefs.length > 0 ? (
                  <Chips items={coreRefs.map((field) => field.name)} />
                ) : (
                  <p className="muted">
                    No core reference fields have been added for this client.
                  </p>
                )}
              </Section>

              <Section id="zones" title="Zones">
                <div className="toggle-grid">
                  <Toggle
                    label="Enable zones"
                    checked={zonesOn}
                    onChange={() => {
                      setZonesOn(!zonesOn);
                      toast(`Zones ${zonesOn ? "disabled" : "enabled"}`);
                    }}
                  />
                  <Toggle
                    label="Allow users changing batch zone"
                    checked={zoneChange}
                    onChange={() => {
                      setZoneChange(!zoneChange);
                      toast(
                        zoneChange
                          ? "Users can no longer change the batch zone"
                          : "Users can now change the batch zone",
                      );
                    }}
                  />
                </div>

                {zonesOn && (
                  <div className="zones-detail">
                    {zones.length === 0 ? (
                      <p className="muted">
                        There aren&apos;t currently any zones setup,{" "}
                        <button
                          type="button"
                          className="link-btn inline"
                          onClick={() => setEditing("zones")}
                        >
                          you can create them by tapping here
                        </button>
                        .
                      </p>
                    ) : (
                      <>
                        <Chips items={zones} />
                        <div className="section-actions">
                          <ActionButton onClick={() => setEditing("zones")}>
                            Edit Zones
                          </ActionButton>
                        </div>
                      </>
                    )}

                    <h4 className="sub-title zonal-title">Zonal Fields</h4>
                    {zonalFields.length === 0 ? (
                      <p className="muted">
                        No additional zonal fields configured.{" "}
                        <button
                          type="button"
                          className="link-btn inline"
                          onClick={() => setEditing("zonal-fields")}
                        >
                          Configure zonal fields
                        </button>
                        .
                      </p>
                    ) : (
                      <>
                        <Chips items={zonalFields} />
                        <div className="section-actions">
                          <ActionButton
                            onClick={() => setEditing("zonal-fields")}
                          >
                            Edit Zonal Fields
                          </ActionButton>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Section>

              <Section
                id="groups"
                title="Groups"
                actions={
                  <ActionButton onClick={() => setEditing("groups")}>
                    Add Group
                  </ActionButton>
                }
              >
                {groups.length > 0 ? (
                  <div className="table-scroll">
                    <table className="custom-table compact">
                      <thead>
                        <tr>
                          <th>Group Name</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groups.map((group, index) => (
                          <tr key={`${group.name}-${index}`}>
                            <td>{group.name}</td>
                            <td>
                              <div className="row-actions">
                                <button
                                  type="button"
                                  className="fill-btn mint-bg has-tip"
                                  data-tip="Edit Users"
                                  aria-label="Edit Users"
                                  onClick={() =>
                                    setUsersFor({
                                      kind: "Group",
                                      name: group.name,
                                    })
                                  }
                                >
                                  <i className="fa-solid fa-users"></i>
                                </button>
                                <button
                                  type="button"
                                  className="fill-btn primary-bg has-tip"
                                  data-tip="Delete"
                                  aria-label="Delete"
                                  onClick={() => {
                                    setGroups((current) =>
                                      current.filter((_, i) => i !== index),
                                    );
                                    toast(`Group ${group.name} deleted`);
                                  }}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="muted">
                    No groups have been added for this client.
                  </p>
                )}
              </Section>

              <Section
                id="store-owner-groups"
                title="Store Owner Groups"
                actions={
                  <ActionButton onClick={() => setStoreGroupEdit("new")}>
                    Add Group
                  </ActionButton>
                }
              >
                {storeGroups.length > 0 ? (
                  <div className="table-scroll">
                    <table className="custom-table compact">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Store Group Manager</th>
                          <th>Store Group Users</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {storeGroups.map((group, index) => (
                          <tr key={`${group.name}-${index}`}>
                            <td>{group.name}</td>
                            <td>{group.manager}</td>
                            <td>
                              {group.users.length > 0
                                ? group.users.join(", ")
                                : "-"}
                            </td>
                            <td>
                              <div className="row-actions">
                                <button
                                  type="button"
                                  className="fill-btn mint-bg has-tip"
                                  data-tip="Edit"
                                  aria-label="Edit"
                                  onClick={() => setStoreGroupEdit(index)}
                                >
                                  <i className="fa-solid fa-pencil"></i>
                                </button>
                                <button
                                  type="button"
                                  className="fill-btn primary-bg has-tip"
                                  data-tip="Delete"
                                  aria-label="Delete"
                                  onClick={() => {
                                    setStoreGroups((current) =>
                                      current.filter((_, i) => i !== index),
                                    );
                                    toast(
                                      `Store owner group ${group.name} deleted`,
                                    );
                                  }}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="muted">
                    There aren&apos;t any store groups in this client.
                  </p>
                )}
              </Section>

              <Section id="core-settings" title="Core Settings">
                <div className="sub-grid">
                  <SubBlock
                    title="Core tickets"
                    actions={
                      <ActionButton
                        tip="Edit core tickets"
                        onClick={() => setCoreEdit("tickets")}
                      >
                        Edit
                      </ActionButton>
                    }
                  >
                    <Chips items={coreSetup.tickets} />
                  </SubBlock>
                  <SubBlock
                    title="Core product name fields"
                    actions={
                      <ActionButton
                        tip="Edit core product name fields"
                        onClick={() => setProductNameOpen(true)}
                      >
                        Edit
                      </ActionButton>
                    }
                  >
                    <Chips
                      items={[
                        `Preferred: ${productName.preferred || "Not set"}`,
                        `Secondary: ${productName.secondary || "Not set"}`,
                      ]}
                    />
                  </SubBlock>
                  <SubBlock
                    title="Core lookup fields"
                    actions={
                      <ActionButton
                        tip="Edit core lookup fields"
                        onClick={() => setCoreEdit("lookupKeys")}
                      >
                        Edit
                      </ActionButton>
                    }
                  >
                    <Chips items={coreSetup.lookupKeys} />
                  </SubBlock>
                  <SubBlock
                    title="Core view fields"
                    actions={
                      <ActionButton
                        tip="Edit core view fields"
                        onClick={() => setCoreEdit("viewKeys")}
                      >
                        Edit
                      </ActionButton>
                    }
                  >
                    <Chips items={coreSetup.viewKeys} />
                  </SubBlock>
                  <SubBlock
                    title="Core search fields"
                    actions={
                      <ActionButton
                        tip="Edit core search fields"
                        onClick={() => setSearchFieldsOpen(true)}
                      >
                        Edit
                      </ActionButton>
                    }
                  >
                    {searchFields.some((field) => field) ? (
                      <Chips items={searchFields.filter((field) => field)} />
                    ) : (
                      <p className="muted">No core search fields set.</p>
                    )}
                  </SubBlock>
                  <SubBlock
                    title="Change report fields"
                    actions={
                      <ActionButton
                        tip="Edit change report fields"
                        onClick={() => setReportFieldsOpen(true)}
                      >
                        Edit
                      </ActionButton>
                    }
                  >
                    {reportFields.some((field) => field) ? (
                      <Chips items={reportFields.filter((field) => field)} />
                    ) : (
                      <p className="muted">No change report fields set.</p>
                    )}
                  </SubBlock>
                  <SubBlock
                    title="Batch filter attributes"
                    actions={
                      <ActionButton
                        tip="Edit batch filter attributes"
                        onClick={() => setFilterFieldsOpen(true)}
                      >
                        Edit
                      </ActionButton>
                    }
                  >
                    {filterFields.some((field) => field) ? (
                      <Chips items={filterFields.filter((field) => field)} />
                    ) : (
                      <p className="muted">No batch filter attributes set.</p>
                    )}
                  </SubBlock>
                </div>
              </Section>

              <Section
                id="content-files"
                title="Content Files"
                actions={
                  <>
                    <ActionButton onClick={() => setUploadOpen(true)}>
                      Upload Additional Content Files
                    </ActionButton>
                    <ActionButton
                      color="dark-bg"
                      onClick={noop("Sync to cloud")}
                    >
                      Sync To Cloud
                    </ActionButton>
                  </>
                }
              >
                <div className="sub-grid two-col">
                  <SubBlock
                    title={
                      <>
                        Fonts <small>({fonts.length})</small>
                      </>
                    }
                  >
                    <ul className="file-list">
                      {(showAllFonts ? fonts : fonts.slice(0, 6)).map(
                        (font) => (
                          <li key={font}>
                            <i className="fa-solid fa-font"></i> {font}
                          </li>
                        ),
                      )}
                    </ul>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => setShowAllFonts(!showAllFonts)}
                    >
                      {showAllFonts
                        ? "Show less"
                        : `Show all ${fonts.length} fonts`}
                    </button>
                  </SubBlock>
                  <SubBlock
                    title={
                      <>
                        Images <small>({imageCount})</small>
                      </>
                    }
                  >
                    <ul className="file-list">
                      {(showAllImages ? images : images.slice(0, 6)).map(
                        (image) => (
                          <li key={image}>
                            <i
                              className={`fa-solid ${image.endsWith(".pdf") ? "fa-file-pdf" : "fa-image"}`}
                            ></i>{" "}
                            {image}
                          </li>
                        ),
                      )}
                    </ul>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => setShowAllImages(!showAllImages)}
                    >
                      {showAllImages
                        ? "Show less"
                        : `Show more (${imageCount} images in total)`}
                    </button>
                  </SubBlock>
                </div>
              </Section>

              <Section
                id="data-fields"
                title="Data Fields"
                actions={
                  <ActionButton onClick={() => setDataFieldsOpen(true)}>
                    Edit Data Fields
                  </ActionButton>
                }
              >
                <Chips items={dataFields.map((field) => field.name)} />
              </Section>

              <Section
                id="filter-profiles"
                title="Filter Profiles"
                actions={
                  <ActionButton onClick={() => setFilterEdit("new")}>
                    Create New Profile
                  </ActionButton>
                }
              >
                {filterProfiles.length > 0 ? (
                  <div className="table-scroll">
                    <table className="custom-table compact">
                      <thead>
                        <tr>
                          <th>Filter Name</th>
                          <th>Filters</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterProfiles.map((profile, index) => (
                          <tr key={`${profile.name}-${index}`}>
                            <td>{profile.name}</td>
                            <td>
                              {profile.rules
                                .map(
                                  (rule) =>
                                    `${rule.include ? "" : "NOT "}${rule.field} ${rule.exact ? "=" : "contains"} ${rule.value}`,
                                )
                                .join(", ")}
                            </td>
                            <td>
                              <div className="row-actions">
                                <button
                                  type="button"
                                  className="fill-btn mint-bg has-tip"
                                  data-tip="Edit"
                                  aria-label="Edit"
                                  onClick={() => setFilterEdit(index)}
                                >
                                  <i className="fa-solid fa-pencil"></i>
                                </button>
                                <button
                                  type="button"
                                  className="fill-btn secondary-bg has-tip"
                                  data-tip="Rename"
                                  aria-label="Rename"
                                  onClick={() => setFilterRename(index)}
                                >
                                  <i className="fa-solid fa-i-cursor"></i>
                                </button>
                                <button
                                  type="button"
                                  className="fill-btn primary-bg has-tip"
                                  data-tip="Delete"
                                  aria-label="Delete"
                                  onClick={() => {
                                    setFilterProfiles((current) =>
                                      current.filter((_, i) => i !== index),
                                    );
                                    toast(`Filter ${profile.name} deleted`);
                                  }}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="muted">
                    No saved filter profiles for this client.
                  </p>
                )}
              </Section>

              <Section
                id="tickets"
                title="Tickets"
                actions={
                  <ActionButton
                    color="mint-bg"
                    onClick={() => setTicketForm("new")}
                  >
                    Create New Ticket
                  </ActionButton>
                }
              >
                <div className="table-scroll">
                  <table className="custom-table compact">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <tr key={ticket}>
                          <td>{ticket}</td>
                          <td>
                            <div className="row-actions wrap">
                              <ActionButton
                                color="mint-bg"
                                onClick={() => setTicketForm(ticket)}
                              >
                                Edit
                              </ActionButton>
                              <ActionButton
                                color="secondary-bg"
                                onClick={() => setMappingFor(ticket)}
                              >
                                Edit Fields
                              </ActionButton>
                              <ActionButton
                                color="peach-bg"
                                onClick={() => setAdhocFor(ticket)}
                              >
                                Adhoc Edit Fields
                              </ActionButton>
                              <ActionButton
                                color="champagne-bg"
                                onClick={() => setKerningFor(ticket)}
                              >
                                Custom Kerning
                              </ActionButton>
                              <ActionButton
                                color="tea-bg"
                                onClick={() => setShowFieldsFor(ticket)}
                              >
                                Show Fields
                              </ActionButton>
                              <button
                                type="button"
                                className="fill-btn primary-bg has-tip"
                                data-tip="Delete"
                                aria-label="Delete"
                                onClick={noop(`Delete ${ticket}`)}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section
                id="font-maps"
                title="Font Maps"
                actions={
                  <ActionButton onClick={() => setFontMapsOpen(true)}>
                    Edit Font Maps
                  </ActionButton>
                }
              >
                <FontMapTable maps={fontMaps} onDelete={deleteFontMap} />
              </Section>

              <Section id="rules" title="Rules">
                <div className="sub-grid">
                  <SubBlock
                    title="Rendered ticket rules"
                    actions={
                      <>
                        <ActionButton onClick={() => setRulesModal("test")}>
                          Test
                        </ActionButton>
                        <ActionButton onClick={noop("Download rules")}>
                          Download
                        </ActionButton>
                      </>
                    }
                  >
                    <p className="muted">
                      Custom patcher module has been uploaded.
                    </p>
                  </SubBlock>
                  <SubBlock
                    title="Sorting ticket rules"
                    actions={
                      <ActionButton onClick={() => setRulesModal("patchers")}>
                        Upload Patchers
                      </ActionButton>
                    }
                  >
                    <p className="muted">{sortingPatcher}</p>
                  </SubBlock>
                </div>
              </Section>

              <Section id="ticket-mappings" title="Ticket Mappings">
                <div className="section-actions flush">
                  {(
                    [
                      ["View Fields", "mint-bg"],
                      ["Adhoc View Fields", "peach-bg"],
                      ["Summary View Fields", "champagne-bg"],
                      ["Core View Fields", "tea-bg"],
                      ["Core Lookup Fields", "dark-bg"],
                    ] as const
                  ).map(([view, color]) => (
                    <ActionButton
                      key={view}
                      color={color}
                      onClick={() => setViewMappingFor(view)}
                    >
                      {view}
                    </ActionButton>
                  ))}
                </div>
              </Section>

              <Section id="integrations" title="Integrations">
                <div className="section-actions flush">
                  <ActionButton
                    color="mint-bg"
                    onClick={() => setIntegrationModal("master")}
                  >
                    Master Integration
                  </ActionButton>
                  <ActionButton
                    color="dark-bg"
                    onClick={() => setIntegrationModal("store")}
                  >
                    Store Specific Integration
                  </ActionButton>
                </div>
              </Section>

              <Section id="stock-on-hand" title="Stock On Hand">
                <div className="section-actions flush">
                  <ActionButton
                    color="mint-bg"
                    onClick={() => setStockModal("profiles")}
                  >
                    Manage CSV Mapping Profiles
                  </ActionButton>
                  <ActionButton
                    color="dark-bg"
                    onClick={() => setStockModal("snapshot")}
                  >
                    View Stock Snapshot
                  </ActionButton>
                </div>
              </Section>

              <Section id="invoice" title="Invoice">
                <InvoiceForm
                  key={client}
                  client={client}
                  stores={
                    [...headOffice, ...regionalManagers, ...franchisees].filter(
                      (user) => user.invoicing,
                    ).length
                  }
                  onSaved={(total) =>
                    toast(`Invoice calculated for ${client}: ${total}`)
                  }
                />
              </Section>

              <Section id="api-logs" title="Download API Logs">
                <div className="section-actions flush">
                  <ActionButton
                    color="mint-bg"
                    onClick={noop("Download API logs")}
                  >
                    Download
                  </ActionButton>
                </div>
              </Section>
            </div>
          </AccordionContext.Provider>
        </div>
      </main>

      {editing === "regions" && (
        <EditItemsModal
          client={client}
          noun="Region"
          plural="Regions"
          fields={[
            { key: "name", label: "Name", placeholder: "Region name" },
            {
              key: "description",
              label: "Description",
              placeholder: "Optional description",
            },
          ]}
          items={regions}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            setRegions(next);
            setEditing(null);
            toast(`Regions saved for ${client}`);
          }}
        />
      )}
      {editing === "departments" && (
        <EditItemsModal
          client={client}
          noun="Department"
          plural="Departments"
          fields={[
            { key: "name", label: "Name", placeholder: "Department name" },
          ]}
          items={departments}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            setDepartments(next);
            setEditing(null);
            toast(`Departments saved for ${client}`);
          }}
        />
      )}
      {editing === "zonal-fields" && (
        <CheckListModal
          title={`Edit ${client} Zonal Fields`}
          intro={
            <>
              These fields switch with the selected zone (same as Price). Each
              selected field is resolved per the viewing user&apos;s zone, using
              the same column-matching convention as the primary price field.
              Upload data columns must exist as{" "}
              <strong>[Field Name] [Zone Name]</strong>, e.g.{" "}
              <em>ITEM DESCRIPTION Z1</em>.
            </>
          }
          hint={
            <>
              Selected fields become zonal; de-selected fields stop being zonal
              when you save. Data columns for a zonal field must be named{" "}
              <strong>[Field Name] [Zone Name]</strong>, e.g.{" "}
              <em>ITEM DESCRIPTION Z1</em> or <em>WAS PRICE Z2</em>.
            </>
          }
          options={ZONAL_FIELD_OPTIONS}
          selected={zonalFields}
          saveLabel="Save Zonal Fields"
          onClose={() => setEditing(null)}
          onSave={(next) => {
            setZonalFields(next);
            setEditing(null);
            toast(`Zonal fields saved for ${client}`);
          }}
        />
      )}
      {coreEdit && (
        <CheckListModal
          title={
            {
              tickets: "Edit Core Tickets",
              lookupKeys: "Edit Core Lookup Fields",
              viewKeys: "Edit Core View Fields",
            }[coreEdit]
          }
          options={coreEdit === "tickets" ? CORE_TICKET_OPTIONS : DATA_FIELDS}
          selected={coreSetup[coreEdit]}
          saveLabel={
            {
              tickets: "Save Core Tickets",
              lookupKeys: "Save Core Lookup Fields",
              viewKeys: "Save Core View Fields",
            }[coreEdit]
          }
          onClose={() => setCoreEdit(null)}
          onSave={(next) => {
            setCoreSetup((current) => ({ ...current, [coreEdit]: next }));
            setCoreEdit(null);
            toast(
              {
                tickets: "Core tickets saved",
                lookupKeys: "Core lookup fields saved",
                viewKeys: "Core view fields saved",
              }[coreEdit],
            );
          }}
        />
      )}
      {productNameOpen && (
        <FieldSelectsModal
          title="Edit Core Product Name Fields"
          labels={["Preferred Product Name", "Secondary Product Name"]}
          values={[productName.preferred, productName.secondary]}
          options={ZONAL_FIELD_OPTIONS}
          saveLabel="Save Core Product Name Fields"
          onClose={() => setProductNameOpen(false)}
          onSave={([preferred, secondary]) => {
            setProductName({ preferred, secondary });
            setProductNameOpen(false);
            toast("Core product name fields saved");
          }}
        />
      )}
      {filterEdit !== null && (
        <FilterProfileModal
          profile={
            filterEdit === "new" ? undefined : filterProfiles[filterEdit]
          }
          onClose={() => setFilterEdit(null)}
          onSave={(saved) => {
            setFilterProfiles((current) =>
              filterEdit === "new"
                ? [...current, saved]
                : current.map((profile, i) =>
                    i === filterEdit ? saved : profile,
                  ),
            );
            setFilterEdit(null);
            toast(`Filter ${saved.name} saved`);
          }}
        />
      )}
      {filterRename !== null && (
        <FilterNameModal
          title="Rename Filter"
          initial={filterProfiles[filterRename]?.name ?? ""}
          onClose={() => setFilterRename(null)}
          onSave={(name) => {
            setFilterProfiles((current) =>
              current.map((profile, i) =>
                i === filterRename ? { ...profile, name } : profile,
              ),
            );
            setFilterRename(null);
            toast(`Filter renamed to ${name}`);
          }}
        />
      )}
      {adhocFor !== null && (
        <TicketMappingModal
          client={client}
          ticket={adhocFor}
          viewName="Adhoc Edit Fields"
          fields={adhocMappings[adhocFor] ?? []}
          dataFields={dataFields.map((field) => field.name)}
          otherTickets={tickets.filter((t) => t !== adhocFor)}
          mappingOf={(t) => adhocMappings[t] ?? []}
          onClose={() => setAdhocFor(null)}
          onSave={(fields) => {
            setAdhocMappings((current) => ({ ...current, [adhocFor]: fields }));
            setAdhocFor(null);
            toast(`Adhoc mapping saved for ${adhocFor}`);
          }}
        />
      )}
      {kerningFor !== null && (
        <EditItemsModal
          client={client}
          title={`${client} ${kerningFor} Custom Kerning`}
          intro="Kerning values are in pointsize units and are added (if positive) or subtracted (if negative) from the default kerning. If the text's pointsize is scaled up or down to fit the field on the ticket, the custom kerning is scaled proportionally too."
          noun="Kerning"
          plural="Kerning"
          fields={[
            { key: "name", label: "Name", placeholder: "Field name" },
            {
              key: "kerning",
              label: "Kerning",
              type: "number",
              defaultValue: "0",
            },
          ]}
          items={kerning[kerningFor] ?? []}
          onClose={() => setKerningFor(null)}
          onSave={(next) => {
            setKerning((current) => ({ ...current, [kerningFor]: next }));
            setKerningFor(null);
            toast(`Kerning saved for ${kerningFor}`);
          }}
        />
      )}
      {rulesModal === "test" && (
        <FileUploadModal
          title="Rules File Test"
          slots={[
            {
              key: "spreadsheet",
              label: "Spreadsheet file",
              accept: ".xls,.xlsx",
              hint: "Upload an Excel spreadsheet.",
            },
          ]}
          submitLabel="Run Test"
          submitIcon="fa-vial"
          onClose={() => setRulesModal(null)}
          onSubmit={(files) => {
            setRulesModal(null);
            toast(`Rules test run with ${files.spreadsheet} (design only)`);
          }}
        />
      )}
      {rulesModal === "patchers" && (
        <FileUploadModal
          title={`Edit ${client} Patchers`}
          intro="These files are optional. If one or both are not uploaded, the default patchers will be used."
          slots={[
            {
              key: "loaded",
              label: "Loaded Batch Patcher",
              accept: ".cs",
              hint: "Please upload a C# .cs file.",
            },
            {
              key: "rendered",
              label: "Rendered Batch Patcher",
              accept: ".cs",
              hint: "Please upload a C# .cs file.",
            },
          ]}
          submitLabel="Upload Patchers"
          requireAll={false}
          onClose={() => setRulesModal(null)}
          onSubmit={(files) => {
            const names = [files.loaded, files.rendered].filter(Boolean);
            setSortingPatcher(`Custom patcher uploaded: ${names.join(", ")}.`);
            setRulesModal(null);
            toast("Patchers uploaded");
          }}
        />
      )}
      {fontMapsOpen && (
        <FontMapsModal
          maps={fontMaps}
          templateFonts={TEMPLATE_FONTS}
          directoryFonts={DIRECTORY_FONTS}
          onAdd={(map) => {
            setFontMaps((current) => [...current, map]);
            toast(`${map.template} mapped to ${map.mapping}`);
          }}
          onDelete={deleteFontMap}
          onClose={() => setFontMapsOpen(false)}
        />
      )}
      {showFieldsFor !== null && (
        <ShowFieldsModal
          client={client}
          ticket={showFieldsFor}
          onClose={() => setShowFieldsFor(null)}
        />
      )}
      {stockModal === "profiles" && (
        <StockProfilesModal
          profiles={stockProfiles}
          onClose={() => setStockModal(null)}
          onCreate={(profile) => {
            setStockProfiles((current) => [...current, profile]);
            toast(`Profile ${profile.name} created`);
          }}
        />
      )}
      {stockModal === "snapshot" && (
        <StockSnapshotModal
          rows={STOCK_ROWS}
          onClose={() => setStockModal(null)}
        />
      )}
      {integrationModal === "master" && (
        <MasterIntegrationModal
          client={client}
          pos={masterPos.pos}
          connected={masterPos.connected}
          onChange={(pos, connected) => setMasterPos({ pos, connected })}
          onAction={(message) => toast(message)}
          onClose={() => setIntegrationModal(null)}
        />
      )}
      {integrationModal === "store" && (
        <StoreIntegrationModal
          rows={storeIntegrations}
          onClose={() => setIntegrationModal(null)}
          onSave={(rows) => {
            setStoreIntegrations(rows);
            setIntegrationModal(null);
            toast("Store specific POS selection saved");
          }}
        />
      )}
      {viewMappingFor !== null && (
        <TicketMappingModal
          client={client}
          ticket={viewMappingFor}
          title={`Ticket Mapping for ${client}: ${viewMappingFor}`}
          viewName={viewMappingFor}
          fields={viewMappings[viewMappingFor] ?? []}
          dataFields={dataFields.map((field) => field.name)}
          otherTickets={tickets}
          mappingOf={(t) => ticketMappings[t] ?? []}
          onClose={() => setViewMappingFor(null)}
          onSave={(fields) => {
            setViewMappings((current) => ({
              ...current,
              [viewMappingFor]: fields,
            }));
            setViewMappingFor(null);
            toast(`${viewMappingFor} saved`);
          }}
        />
      )}
      {mappingFor !== null && (
        <TicketMappingModal
          client={client}
          ticket={mappingFor}
          viewName="Edit Fields"
          fields={ticketMappings[mappingFor] ?? []}
          dataFields={dataFields.map((field) => field.name)}
          otherTickets={tickets.filter((t) => t !== mappingFor)}
          mappingOf={(t) => ticketMappings[t] ?? []}
          onClose={() => setMappingFor(null)}
          onSave={(fields) => {
            setTicketMappings((current) => ({
              ...current,
              [mappingFor]: fields,
            }));
            setMappingFor(null);
            toast(`Mapping saved for ${mappingFor}`);
          }}
        />
      )}
      {ticketForm !== null && (
        <CreateTicketModal
          client={client}
          ticket={ticketForm === "new" ? undefined : ticketForm}
          departments={departments.map((dept) => dept.name)}
          groups={groups.map((group) => group.name)}
          onClose={() => setTicketForm(null)}
          onSave={(name) => {
            if (ticketForm === "new") {
              const ticketName = name || `New Ticket ${tickets.length + 1}`;
              setTickets((current) => [...current, ticketName]);
              toast(`Ticket ${ticketName} created`);
            } else {
              const ticketName = name || ticketForm;
              setTickets((current) =>
                current.map((t) => (t === ticketForm ? ticketName : t)),
              );
              toast(`Ticket ${ticketName} updated`);
            }
            setTicketForm(null);
          }}
        />
      )}
      {dataFieldsOpen && (
        <EditDataFieldsModal
          client={client}
          fields={dataFields}
          keyFields={keyFields}
          onClose={() => setDataFieldsOpen(false)}
          onSave={(nextFields, nextKeys) => {
            setDataFields(nextFields);
            setKeyFields(nextKeys);
            setDataFieldsOpen(false);
            toast(`Data fields saved for ${client}`);
          }}
        />
      )}
      {uploadOpen && (
        <UploadContentModal
          client={client}
          onClose={() => setUploadOpen(false)}
          onUpload={(fileName) => {
            setUploadOpen(false);
            toast(`${fileName} uploaded for ${client} (design only)`);
          }}
        />
      )}
      {filterFieldsOpen && (
        <FieldSelectsModal
          title="Edit Filter Attribute Search Fields"
          labels={[1, 2, 3, 4, 5].map((n) => `AttributeSearchField${n}`)}
          values={filterFields}
          options={ZONAL_FIELD_OPTIONS}
          saveLabel="Save Filter Attribute Search Fields"
          onClose={() => setFilterFieldsOpen(false)}
          onSave={(next) => {
            setFilterFields(next);
            setFilterFieldsOpen(false);
            toast("Batch filter attributes saved");
          }}
        />
      )}
      {reportFieldsOpen && (
        <FieldSelectsModal
          title="Edit Core Change Report Fields"
          labels={[1, 2, 3, 4, 5].map((n) => `ReportField${n}`)}
          values={reportFields}
          options={ZONAL_FIELD_OPTIONS}
          saveLabel="Save Core Change Report Fields"
          onClose={() => setReportFieldsOpen(false)}
          onSave={(next) => {
            setReportFields(next);
            setReportFieldsOpen(false);
            toast("Core change report fields saved");
          }}
        />
      )}
      {searchFieldsOpen && (
        <FieldSelectsModal
          title="Edit Core Search Fields"
          labels={[1, 2, 3, 4, 5].map((n) => `SearchField${n}`)}
          values={searchFields}
          options={ZONAL_FIELD_OPTIONS}
          saveLabel="Save Core Search Fields"
          onClose={() => setSearchFieldsOpen(false)}
          onSave={(next) => {
            setSearchFields(next);
            setSearchFieldsOpen(false);
            toast("Core search fields saved");
          }}
        />
      )}
      {storeGroupEdit !== null && (
        <StoreOwnerGroupModal
          group={
            storeGroupEdit === "new" ? undefined : storeGroups[storeGroupEdit]
          }
          managers={MANAGER_USERS}
          storeUsers={STORE_USERS}
          onClose={() => setStoreGroupEdit(null)}
          onSave={(saved) => {
            setStoreGroups((current) =>
              storeGroupEdit === "new"
                ? [...current, saved]
                : current.map((group, i) =>
                    i === storeGroupEdit ? saved : group,
                  ),
            );
            setStoreGroupEdit(null);
            toast(`Store owner group ${saved.name} saved`);
          }}
        />
      )}
      {usersFor && (
        <CheckListModal
          title={`Edit ${usersFor.kind} Users`}
          subtitle={usersFor.name}
          options={CLIENT_USERS}
          selected={members[`${usersFor.kind}:${usersFor.name}`] ?? []}
          saveLabel={`Update Users For ${usersFor.name}`}
          columns={1}
          onClose={() => setUsersFor(null)}
          onSave={(next) => {
            setMembers((current) => ({
              ...current,
              [`${usersFor.kind}:${usersFor.name}`]: next,
            }));
            setUsersFor(null);
            toast(`Users updated for ${usersFor.name}`);
          }}
        />
      )}
      {editing === "zones" && (
        <EditZonesModal
          client={client}
          zones={zones}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            setZones(next);
            setEditing(null);
            toast(`Zones saved for ${client}`);
          }}
        />
      )}
      {editing === "groups" && (
        <EditItemsModal
          client={client}
          noun="Group"
          plural="Groups"
          fields={[{ key: "name", label: "Name", placeholder: "Group name" }]}
          items={groups}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            setGroups(next);
            setEditing(null);
            toast(`Groups saved for ${client}`);
          }}
        />
      )}
      {editing === "core-reference" && (
        <EditItemsModal
          client={client}
          noun="Core Reference"
          plural="Core Reference Fields"
          fields={[
            {
              key: "name",
              label: "Name",
              placeholder: "Core reference field name",
            },
          ]}
          items={coreRefs}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            setCoreRefs(next);
            setEditing(null);
            toast(`Core reference fields saved for ${client}`);
          }}
        />
      )}
    </>
  );
}

export default function EditClientPage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <EditClientForm />
      </Suspense>
    </AdminShell>
  );
}
