"use client";

import { Suspense, createContext, useContext, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import FormField from "@/components/FormField";
import { useToast } from "@/components/Toast";
import { clients } from "@/data/clients";
import {
  CORE,
  CURRENCY_OPTIONS,
  DATA_FIELDS,
  DEPARTMENTS,
  FONTS,
  FONT_MAPS,
  IMAGE_COUNT,
  POS_OPTIONS,
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
  return (
    <label className="toggle-row">
      <span className="switch-cta">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="switch-check"></span>
      </span>
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
  const [showAllFonts, setShowAllFonts] = useState(false);
  // nav item highlighted only when clicked; clicking it also expands that section
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0][0]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const accordion = {
    isOpen: (id: string) => Boolean(openSections[id]),
    toggle: (id: string) =>
      setOpenSections((current) => ({ ...current, [id]: !current[id] })),
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
              <label className="toggle-row expand-all">
                <span className="switch-cta peach">
                  <input
                    type="checkbox"
                    checked={allOpen}
                    onChange={toggleAll}
                  />
                  <span className="switch-check"></span>
                </span>
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
                  <ActionButton onClick={noop("Edit regions")}>
                    Edit Regions
                  </ActionButton>
                }
              >
                <Chips items={REGIONS} />
              </Section>

              <Section
                id="departments"
                title="Departments"
                actions={
                  <ActionButton onClick={noop("Edit departments")}>
                    Edit Departments
                  </ActionButton>
                }
              >
                <div className="dept-list">
                  {DEPARTMENTS.map((dept) => (
                    <div key={dept} className="dept-row">
                      <strong>{dept}</strong>
                      <ActionButton
                        tip="Edit Users"
                        onClick={noop(`Edit users of ${dept}`)}
                      >
                        Edit Users
                      </ActionButton>
                    </div>
                  ))}
                </div>
              </Section>

              <Section
                id="core-reference"
                title="Core Reference Fields"
                actions={
                  <ActionButton onClick={noop("Add core reference field")}>
                    Add Core Reference Field
                  </ActionButton>
                }
              >
                <p className="muted">
                  No core reference fields have been added for this client.
                </p>
              </Section>

              <Section id="zones" title="Zones">
                <div className="toggle-grid">
                  <Toggle
                    label="Zones"
                    checked={zonesOn}
                    onChange={() => setZonesOn(!zonesOn)}
                  />
                  <Toggle
                    label="Allow users changing batch zone"
                    checked={zoneChange}
                    onChange={() => setZoneChange(!zoneChange)}
                  />
                </div>
              </Section>

              <Section
                id="groups"
                title="Groups"
                actions={
                  <ActionButton onClick={noop("Add group")}>
                    Add Group
                  </ActionButton>
                }
              >
                <p className="muted">
                  No groups have been added for this client.
                </p>
              </Section>

              <Section
                id="store-owner-groups"
                title="Store Owner Groups"
                actions={
                  <ActionButton onClick={noop("Add store owner group")}>
                    Add Group
                  </ActionButton>
                }
              >
                <p className="muted">
                  There aren&apos;t any store groups in this client.
                </p>
              </Section>

              <Section id="core-settings" title="Core Settings">
                <div className="sub-grid">
                  <SubBlock title="Core tickets">
                    <Chips items={CORE.tickets} />
                  </SubBlock>
                  <SubBlock
                    title="Core product name fields"
                    actions={
                      <ActionButton
                        tip="Edit core product name fields"
                        onClick={noop("Edit core product name fields")}
                      >
                        Edit
                      </ActionButton>
                    }
                  >
                    <Chips
                      items={[
                        `Preferred: ${CORE.productName.preferred}`,
                        `Secondary: ${CORE.productName.secondary}`,
                      ]}
                    />
                  </SubBlock>
                  <SubBlock title="Core lookup fields">
                    <Chips items={CORE.lookupFields} />
                  </SubBlock>
                  <SubBlock
                    title="Core view fields"
                    actions={
                      <ActionButton onClick={noop("Edit core ticket setup")}>
                        Edit Core Ticket Setup
                      </ActionButton>
                    }
                  >
                    <Chips items={CORE.viewFields} />
                  </SubBlock>
                  <SubBlock
                    title="Core search fields"
                    actions={
                      <ActionButton
                        tip="Edit core search fields"
                        onClick={noop("Edit core search fields")}
                      >
                        Edit
                      </ActionButton>
                    }
                  >
                    <Chips items={CORE.searchFields} />
                  </SubBlock>
                  <SubBlock
                    title="Change report fields"
                    actions={
                      <ActionButton
                        tip="Edit change report fields"
                        onClick={noop("Edit change report fields")}
                      >
                        Edit
                      </ActionButton>
                    }
                  >
                    <Chips items={CORE.changeReportFields} />
                  </SubBlock>
                  <SubBlock
                    title="Batch filter attributes"
                    actions={
                      <ActionButton
                        tip="Edit batch filter attributes"
                        onClick={noop("Edit batch filter attributes")}
                      >
                        Edit
                      </ActionButton>
                    }
                  >
                    <Chips items={CORE.batchFilterAttributes} />
                  </SubBlock>
                </div>
              </Section>

              <Section
                id="content-files"
                title="Content Files"
                actions={
                  <>
                    <ActionButton
                      onClick={noop("Upload additional content files")}
                    >
                      Upload Additional Content Files
                    </ActionButton>
                    <ActionButton color="dark-bg" onClick={noop("Sync to cloud")}>
                      Sync To Cloud
                    </ActionButton>
                  </>
                }
              >
                <div className="sub-grid two-col">
                  <SubBlock
                    title={
                      <>
                        Fonts <small>({FONTS.length})</small>
                      </>
                    }
                  >
                    <ul className="file-list">
                      {(showAllFonts ? FONTS : FONTS.slice(0, 6)).map(
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
                        : `Show all ${FONTS.length} fonts`}
                    </button>
                  </SubBlock>
                  <SubBlock
                    title={
                      <>
                        Images <small>({IMAGE_COUNT})</small>
                      </>
                    }
                  >
                    <p className="muted">
                      {IMAGE_COUNT} product and template images synced for this
                      client.
                    </p>
                  </SubBlock>
                </div>
              </Section>

              <Section
                id="data-fields"
                title="Data Fields"
                actions={
                  <ActionButton onClick={noop("Edit data fields")}>
                    Edit Data Fields
                  </ActionButton>
                }
              >
                <Chips items={DATA_FIELDS} />
              </Section>

              <Section
                id="filter-profiles"
                title="Filter Profiles"
                actions={
                  <ActionButton onClick={noop("Create new profile")}>
                    Create New Profile
                  </ActionButton>
                }
              >
                <p className="muted">
                  No saved filter profiles for this client.
                </p>
              </Section>

              <Section
                id="tickets"
                title="Tickets"
                actions={
                  <ActionButton
                    color="mint-bg"
                    onClick={noop("Create new ticket")}
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
                      {TICKETS.map((ticket) => (
                        <tr key={ticket}>
                          <td>{ticket}</td>
                          <td>
                            <div className="row-actions wrap">
                              <ActionButton
                                color="mint-bg"
                                onClick={noop(`Edit ${ticket}`)}
                              >
                                Edit
                              </ActionButton>
                              <ActionButton
                                color="secondary-bg"
                                onClick={noop(`Edit fields of ${ticket}`)}
                              >
                                Edit Fields
                              </ActionButton>
                              <ActionButton
                                color="peach-bg"
                                onClick={noop(`Adhoc edit fields of ${ticket}`)}
                              >
                                Adhoc Edit Fields
                              </ActionButton>
                              <ActionButton
                                color="champagne-bg"
                                onClick={noop(`Custom kerning of ${ticket}`)}
                              >
                                Custom Kerning
                              </ActionButton>
                              <ActionButton
                                color="tea-bg"
                                onClick={noop(`Show fields of ${ticket}`)}
                              >
                                Show Fields
                              </ActionButton>
                              <button
                                type="button"
                                className="fill-btn primary-bg"
                                title="Delete"
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
                  <ActionButton onClick={noop("Edit font maps")}>
                    Edit Font Maps
                  </ActionButton>
                }
              >
                <div className="table-scroll">
                  <table className="custom-table compact">
                    <thead>
                      <tr>
                        <th>Font in Template</th>
                        <th>Mapping</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FONT_MAPS.map((map) => (
                        <tr key={map.template}>
                          <td>{map.template}</td>
                          <td>{map.mapping}</td>
                          <td>
                            <button
                              type="button"
                              className="fill-btn primary-bg"
                              title="Delete"
                              onClick={noop("Delete font map")}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section id="rules" title="Rules">
                <div className="sub-grid">
                  <SubBlock
                    title="Rendered ticket rules"
                    actions={
                      <>
                        <ActionButton onClick={noop("Test rules")}>
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
                      <ActionButton onClick={noop("Upload patchers")}>
                        Upload Patchers
                      </ActionButton>
                    }
                  >
                    <p className="muted">Default patcher.</p>
                  </SubBlock>
                </div>
              </Section>

              <Section
                id="ticket-mappings"
                title="Ticket Mappings"
                actions={
                  <>
                    <ActionButton color="mint-bg" onClick={noop("View fields")}>
                      View Fields
                    </ActionButton>
                    <ActionButton
                      color="peach-bg"
                      onClick={noop("Adhoc view fields")}
                    >
                      Adhoc View Fields
                    </ActionButton>
                    <ActionButton
                      color="champagne-bg"
                      onClick={noop("Summary view fields")}
                    >
                      Summary View Fields
                    </ActionButton>
                    <ActionButton
                      color="tea-bg"
                      onClick={noop("Core view fields")}
                    >
                      Core View Fields
                    </ActionButton>
                    <ActionButton
                      color="dark-bg"
                      onClick={noop("Core lookup fields")}
                    >
                      Core Lookup Fields
                    </ActionButton>
                  </>
                }
              >
                <p className="muted">
                  Field mappings used by the ticket, adhoc, summary and core
                  views.
                </p>
              </Section>

              <Section
                id="integrations"
                title="Integrations"
                actions={
                  <>
                    <ActionButton onClick={noop("Master integration")}>
                      Master Integration
                    </ActionButton>
                    <ActionButton color="dark-bg" onClick={noop("Store specific integration")}>
                      Store Specific Integration
                    </ActionButton>
                  </>
                }
              >
                <p className="muted">
                  Products are picked up for syncing for the client {client} and
                  user HO.{client}.
                </p>
              </Section>

              <Section
                id="stock-on-hand"
                title="Stock On Hand"
                actions={
                  <>
                    <ActionButton onClick={noop("Manage CSV mapping profiles")}>
                      Manage CSV Mapping Profiles
                    </ActionButton>
                    <ActionButton color="dark-bg" onClick={noop("View stock snapshot")}>
                      View Stock Snapshot
                    </ActionButton>
                  </>
                }
              >
                <p className="muted">
                  Stock on hand is synced from the client POS using the CSV
                  mapping profiles.
                </p>
              </Section>

              <Section id="invoice" title="Invoice">
                <form
                  className="form-grid"
                  autoComplete="off"
                  onSubmit={(event) => {
                    event.preventDefault();
                    toast(`Invoice settings saved for ${client}`);
                  }}
                >
                  <FormField
                    label="Client Name in Report"
                    name="reportName"
                    defaultValue={client}
                  />
                  <FormField
                    label="Value per Store"
                    name="valuePerStore"
                    type="number"
                    defaultValue="40"
                  />
                  <FormField
                    label="Reseller Margin (%)"
                    name="resellerMargin"
                    type="number"
                    defaultValue="0"
                  />
                  <div className="custom-field">
                    <label className="field-label" htmlFor="pos">
                      POS
                    </label>
                    <div className="field-type field-stype-select">
                      <select id="pos" name="pos" defaultValue={POS_OPTIONS[0]}>
                        {POS_OPTIONS.map((pos) => (
                          <option key={pos}>{pos}</option>
                        ))}
                      </select>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>
                  </div>
                  <div className="custom-field">
                    <label className="field-label" htmlFor="currency">
                      Invoice Currency
                    </label>
                    <div className="field-type field-stype-select">
                      <select id="currency" name="currency" defaultValue="AUD">
                        {CURRENCY_OPTIONS.map((currency) => (
                          <option key={currency}>{currency}</option>
                        ))}
                      </select>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>
                  </div>
                  <FormField
                    label="First Invoice Date"
                    name="firstInvoiceDate"
                    type="date"
                    defaultValue="2024-01-01"
                  />
                  <div className="form-actions">
                    <button type="submit" className="cta_with_icon mint-bg">
                      <span>
                        <i className="fa-solid fa-check"></i>
                      </span>
                      <p>Create / Update Invoice</p>
                    </button>
                  </div>
                </form>
              </Section>

              <Section
                id="api-logs"
                title="Download API Logs"
                actions={
                  <ActionButton onClick={noop("Download API logs")}>
                    Download
                  </ActionButton>
                }
              >
                <p className="muted">
                  Download the latest API request logs for this client.
                </p>
              </Section>
            </div>
          </AccordionContext.Provider>
        </div>
      </main>
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
