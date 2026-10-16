"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { useToast } from "@/components/Toast";
import MultiSelect from "@/components/MultiSelect";

const CORE_DEPARTMENT_OPTIONS = [
  "Bakery",
  "Dairy",
  "Deli",
  "Floral",
  "Frozen",
  "General Merchandise",
  "Grocery",
  "Health & Beauty",
  "Master",
  "Meat",
  "Produce",
  "Seafood",
];

interface StepConfig {
  id: string;
  title: string;
  subtitle: string;
}

const STEPS: StepConfig[] = [
  {
    id: "name-logo",
    title: "Name and Logo",
    subtitle: "Provide client display name and corporate brand logo.",
  },
  {
    id: "upload-data",
    title: "Upload Data",
    subtitle: "Upload product data XLSX file.",
  },
  {
    id: "upload-ticket",
    title: "Upload Ticket",
    subtitle: "Configure template files, paper size, margins and print flags.",
  },
  {
    id: "ticket-mappings",
    title: "Ticket Mappings",
    subtitle: "Select key product fields and configure column permission matrices.",
  },
  {
    id: "upload-patchers",
    title: "Upload Patchers",
    subtitle: "Upload optional C# batch patcher files (.cs) for loaded and rendered batches.",
  },
  {
    id: "upload-content",
    title: "Upload Content",
    subtitle: "Upload the ZIP archive containing fonts and images found in the ticket template.",
  },
  {
    id: "regions",
    title: "Regions",
    subtitle: "Define store regions with names and descriptions for store grouping.",
  },
  {
    id: "invoicing",
    title: "Invoicing",
    subtitle: "Configure billing parameters, client POS, currency, and invoice schedule.",
  },
  {
    id: "verify",
    title: "Verify Client Data",
    subtitle: "Review all client configurations before finalizing deployment.",
  },
];

const MAPPING_FIELDS = [
  "SKU",
  "Product Name",
  "Was Price",
  "Sale Price",
  "Clearance Price",
  "Savings",
  "UOM",
  "Ticket Template",
  "Brand",
  "QR Code",
  "Guid",
  "Id",
];

type MappingColumnKey =
  | "viewFields"
  | "editFields"
  | "adhocViewFields"
  | "adhocEditFields"
  | "summaryViewFields";

interface MappingRow {
  field: string;
  viewFields: boolean;
  editFields: boolean;
  adhocViewFields: boolean;
  adhocEditFields: boolean;
  summaryViewFields: boolean;
}

const DEFAULT_MAPPING_ROWS: MappingRow[] = [
  { field: "SKU", viewFields: true, editFields: false, adhocViewFields: true, adhocEditFields: false, summaryViewFields: true },
  { field: "Product Name", viewFields: true, editFields: true, adhocViewFields: true, adhocEditFields: true, summaryViewFields: true },
  { field: "Was Price", viewFields: true, editFields: true, adhocViewFields: true, adhocEditFields: false, summaryViewFields: false },
  { field: "Sale Price", viewFields: true, editFields: true, adhocViewFields: true, adhocEditFields: true, summaryViewFields: true },
  { field: "Clearance Price", viewFields: true, editFields: true, adhocViewFields: false, adhocEditFields: false, summaryViewFields: false },
  { field: "Savings", viewFields: true, editFields: false, adhocViewFields: true, adhocEditFields: false, summaryViewFields: true },
  { field: "UOM", viewFields: true, editFields: true, adhocViewFields: true, adhocEditFields: false, summaryViewFields: false },
  { field: "Ticket Template", viewFields: true, editFields: false, adhocViewFields: false, adhocEditFields: false, summaryViewFields: false },
  { field: "Brand", viewFields: true, editFields: true, adhocViewFields: true, adhocEditFields: false, summaryViewFields: false },
  { field: "QR Code", viewFields: false, editFields: false, adhocViewFields: false, adhocEditFields: false, summaryViewFields: false },
  { field: "Guid", viewFields: false, editFields: false, adhocViewFields: false, adhocEditFields: false, summaryViewFields: false },
  { field: "Id", viewFields: false, editFields: false, adhocViewFields: false, adhocEditFields: false, summaryViewFields: false },
];

function TicketFileRow({
  id,
  label,
  accept,
  hint,
  fileName,
  required = true,
  onPick,
  onClear,
}: {
  id: string;
  label: string;
  accept: string;
  hint: string;
  fileName: string;
  required?: boolean;
  onPick: (name: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="custom-field">
      <label className="field-label" htmlFor={id}>
        {label} {required && <span style={{ color: "var(--primary)" }}>*</span>}
      </label>
      <div className="drop-row">
        <div className="drop-info">
          <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
          <div>
            <span className="upload-label">
              {fileName || "Choose File"}
            </span>
            <span className="upload-hint">{hint}</span>
          </div>
        </div>
        <div className="drop-actions">
          <label className="blank_cta" htmlFor={id}>
            <input
              id={id}
              type="file"
              accept={accept}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPick(f.name);
              }}
            />
            Browse File
          </label>
        </div>
      </div>
      {fileName && (
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px",
            background: "var(--grey)",
            borderRadius: "5px",
            width: "fit-content",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--secondary)" }}>
            Selected:
          </span>
          <span style={{ fontSize: "13px", color: "var(--secondary)", fontWeight: 500 }}>
            {fileName}
          </span>
          <button
            type="button"
            className="fill-btn primary-bg"
            style={{ width: "28px", height: "28px", marginLeft: "6px" }}
            title="Remove File"
            onClick={onClear}
          >
            <i className="fa-solid fa-trash" style={{ fontSize: "12px" }}></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default function CreateClientPage() {
  const toast = useToast();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Step 1: Name and Logo
  const [clientName, setClientName] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  // Step 2: Upload Data
  const [dataFileName, setDataFileName] = useState("");

  // Step 3: Upload Ticket (Matching CreateTicketModal & Reference)
  const [ticketBackgroundFile, setTicketBackgroundFile] = useState("");
  const [ticketXmlFile, setTicketXmlFile] = useState("");
  const [paper, setPaper] = useState("A4");
  const [orientation, setOrientation] = useState("Portrait");
  const [rows, setRows] = useState("1");
  const [columns, setColumns] = useState("1");
  const [margins, setMargins] = useState({
    top: "0.00",
    right: "0.00",
    bottom: "0.00",
    left: "0.00",
  });
  const [originX, setOriginX] = useState("0.00");
  const [originY, setOriginY] = useState("0.00");
  const [ticketFlags, setTicketFlags] = useState({
    printBackground: true,
    cmyk: false,
    bleed: false,
    multiPage: false,
    allowNoPrice: true,
    pngOutput: false,
    franchiseeLookupOnly: false,
  });
  const [ordering, setOrdering] = useState("0");
  const [pngWidth, setPngWidth] = useState("");
  const [pngHeight, setPngHeight] = useState("");
  const [coreDepartments, setCoreDepartments] = useState<string[]>([
    "Bakery",
    "Dairy",
    "Grocery",
    "Meat",
    "Produce",
  ]);

  const flipTicketFlag = (key: keyof typeof ticketFlags) =>
    setTicketFlags((curr) => ({ ...curr, [key]: !curr[key] }));

  // Step 4: Ticket Mappings
  const [productNameField, setProductNameField] = useState("Product Name");
  const [productIdField, setProductIdField] = useState("SKU");
  const [productPriceField, setProductPriceField] = useState("Sale Price");
  const [mappingRows, setMappingRows] = useState<MappingRow[]>(DEFAULT_MAPPING_ROWS);

  const toggleMappingCell = (rowIndex: number, col: MappingColumnKey) => {
    setMappingRows((prev) =>
      prev.map((row, idx) => (idx === rowIndex ? { ...row, [col]: !row[col] } : row)),
    );
  };

  const toggleMappingColumn = (col: MappingColumnKey) => {
    setMappingRows((prev) => {
      const allChecked = prev.every((r) => r[col]);
      return prev.map((r) => ({ ...r, [col]: !allChecked }));
    });
  };

  // Step 5: Upload Patchers
  const [loadedBatchPatcherFile, setLoadedBatchPatcherFile] = useState("");
  const [renderedBatchPatcherFile, setRenderedBatchPatcherFile] = useState("");

  // Step 6: Upload Content
  const [contentZipFile, setContentZipFile] = useState("");
  const detectedFonts = [
    "ITCAvantGardePro-Bold.ttf",
    "ITCAvantGardeGothicPro-Bold.ttf",
    "Rockwell-Bold.ttf",
  ];
  const detectedImages = [
    "QRCode_Image.png",
    "line_Image.png",
    "afterpaylogo_Image.png",
  ];

  // Step 7: Regions
  interface RegionItem {
    id: string;
    name: string;
    description: string;
  }

  const [regionList, setRegionList] = useState<RegionItem[]>([
    {
      id: "1",
      name: "Head Office",
      description: "Corporate headquarters and central store network",
    },
  ]);

  const handleAddRegion = () => {
    const newId = String(Date.now());
    setRegionList((prev) => [
      ...prev,
      { id: newId, name: "", description: "" },
    ]);
    toast("New region card added");
  };

  const handleDeleteRegion = (id: string) => {
    if (regionList.length <= 1) {
      toast("At least one region is required.");
      return;
    }
    setRegionList((prev) => prev.filter((r) => r.id !== id));
    toast("Region removed");
  };

  const handleUpdateRegion = (
    id: string,
    field: "name" | "description",
    value: string,
  ) => {
    setRegionList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  // Step 8: Invoicing (Legacy fields matched to brand design)
  const [reportClientName, setReportClientName] = useState("");
  const [valuePerStore, setValuePerStore] = useState("1.00");
  const [numberOfIntegrations, setNumberOfIntegrations] = useState("1");
  const [discountPercentage, setDiscountPercentage] = useState("1.00");
  const [gstRate, setGstRate] = useState("0.00");
  const [totalIntegrations, setTotalIntegrations] = useState("1");
  const [resellerInvoice, setResellerInvoice] = useState("0.00");
  const [paymentType, setPaymentType] = useState("");

  const numVal = (v: string) => Number.parseFloat(v) || 0;
  const moneyVal = (v: number) => (Number.isFinite(v) ? v.toFixed(2) : "0.00");

  const calcStores = regionList.length || 1;
  const calcSubtotal = (calcStores + numVal(totalIntegrations)) * numVal(valuePerStore);
  const calcPerMonth =
    calcSubtotal * (1 - numVal(discountPercentage) / 100) * (1 + numVal(gstRate) / 100);
  const calcTotalInvoice = Math.max(0, calcPerMonth - numVal(resellerInvoice));

  // Step 9: Verify & Submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);

  const currentStep = STEPS[currentStepIndex];


  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      setLogoPreviewUrl(URL.createObjectURL(file));
      toast(`Logo "${file.name}" selected`);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCreatedSuccess(true);
      toast(`Client "${clientName || "New Client"}" created successfully!`);
    }, 800);
  };

  return (
    <AdminShell>
      {/* Detail Page Topbar in New-Frontend Design */}
      <div className="detail-page-topbar">
        <div>
          <ul className="breadcrumb-items">
            <li>
              <Link href="/client-administration">Client Administration</Link>
            </li>
            <li>Create Client</li>
          </ul>
          <div className="global-back-button">
            <Link href="/client-administration">
              <span>
                <i className="fa-solid fa-arrow-left"></i> Go Back
              </span>
            </Link>
            Create Client
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-4 p-4">
        {/* Two-Column Layout: Left Vertical Stepper, Right Form Card */}
        <div className="wizard-layout-grid">
          {/* LEFT SIDEBAR: Vertical Stepper with Continuous Line & Title Only */}
          <aside className="wizard-sidebar-card">
            <div className="wizard-sidebar-header">
              <h4 className="wizard-sidebar-title">Client Setup Steps</h4>
              <span className="wizard-sidebar-stepnum">
                Step {currentStepIndex + 1} of {STEPS.length}
              </span>
            </div>

            <nav className="vertical-stepper-list" aria-label="Wizard Steps">
              {STEPS.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isCompleted = idx < currentStepIndex;
                const isLast = idx === STEPS.length - 1;

                return (
                  <button
                    key={step.id}
                    type="button"
                    className={`vertical-step-row ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                    onClick={() => setCurrentStepIndex(idx)}
                    title={`Step ${idx + 1}: ${step.title}`}
                  >
                    <div className="vertical-step-marker">
                      <div className="vertical-step-circle">
                        {isCompleted ? (
                          <i className="fa-solid fa-check"></i>
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`vertical-step-connector ${isCompleted ? "completed" : ""}`}
                        ></div>
                      )}
                    </div>

                    <span className="vertical-step-title">{step.title}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* RIGHT SIDE: Active Form Content Card */}
          <div className="flex flex-col gap-4">
            {isCreatedSuccess ? (
              <section className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                <div style={{ fontSize: "52px", color: "var(--mint)", marginBottom: "16px" }}>
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h2 className="subpage-title" style={{ fontSize: "24px", marginBottom: "8px" }}>
                  Client Successfully Created!
                </h2>
                <p style={{ color: "var(--content-light)", maxWidth: "520px", margin: "0 auto 28px", fontSize: "15px" }}>
                  <strong>{clientName || "New Client"}</strong> has been set up with all templates, mappings,
                  regions, and billing configurations.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                  <Link href="/client-administration" className="cta_with_icon mint-bg">
                    <span>
                      <i className="fa-solid fa-arrow-left"></i>
                    </span>
                    <p>Back to Client Administration</p>
                  </Link>
                  <Link
                    href={`/client-administration/edit?client=${encodeURIComponent(clientName || "New Client")}`}
                    className="cta_with_icon secondary-bg"
                  >
                    <span>
                      <i className="fa-solid fa-gear"></i>
                    </span>
                    <p>Configure Client Details</p>
                  </Link>
                </div>
              </section>
            ) : (
              <section className="card">
                {/* Header inside card */}
                <div className="wizard-card-header">
                  <h3 className="subpage-title">{currentStep.title}</h3>
                  {currentStep.subtitle && (
                    <p className="wizard-card-subtitle">{currentStep.subtitle}</p>
                  )}
                </div>

                {/* STEP 1: NAME AND LOGO */}
                {currentStepIndex === 0 && (
                  <div className="flex flex-col gap-5">
                    <div className="custom-field">
                      <label className="field-label" htmlFor="client-name">
                        Name <span style={{ color: "var(--primary)" }}>*</span>
                      </label>
                      <div className="field-type">
                        <input
                          id="client-name"
                          type="text"
                          value={clientName}
                          placeholder="e.g. 7-Eleven Australia"
                          onChange={(e) => setClientName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="custom-field">
                      <label className="field-label">Logo</label>
                      <div className="drop-row">
                        <div className="drop-info">
                          <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
                          <div>
                            <span className="upload-label">
                              {logoFileName ? logoFileName : "Choose File"}
                            </span>
                            <span className="upload-hint">Please upload a file of type png or jpg</span>
                          </div>
                        </div>
                        <div className="drop-actions">
                          <label className="blank_cta">
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg"
                              onChange={handleLogoUpload}
                            />
                            Browse File
                          </label>
                        </div>
                      </div>

                      {logoPreviewUrl && (
                        <div
                          style={{
                            marginTop: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 14px",
                            background: "var(--grey)",
                            borderRadius: "5px",
                            width: "fit-content",
                          }}
                        >
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--secondary)" }}>
                            Selected Logo:
                          </span>
                          <div
                            style={{
                              height: "40px",
                              width: "90px",
                              background: "var(--white)",
                              border: "1px solid var(--border)",
                              borderRadius: "4px",
                              padding: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={logoPreviewUrl}
                              alt="Logo Preview"
                              style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                            />
                          </div>
                          <button
                            type="button"
                            className="fill-btn primary-bg"
                            style={{ width: "32px", height: "32px" }}
                            title="Remove Logo"
                            onClick={() => {
                              setLogoFileName("");
                              setLogoPreviewUrl(null);
                            }}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: UPLOAD DATA */}
                {currentStepIndex === 1 && (
                  <div className="flex flex-col gap-5">
                    <div className="custom-field">
                      <label className="field-label" htmlFor="data-file">
                        Data <span style={{ color: "var(--primary)" }}>*</span>
                      </label>
                      <div className="drop-row">
                        <div className="drop-info">
                          <i className="fa-solid fa-file-excel upload-icon" style={{ color: "var(--mint)" }}></i>
                          <div>
                            <span className="upload-label">
                              {dataFileName ? dataFileName : "Choose File"}
                            </span>
                            <span className="upload-hint">Please upload an XLSX file</span>
                          </div>
                        </div>
                        <div className="drop-actions">
                          <label className="blank_cta">
                            <input
                              id="data-file"
                              type="file"
                              accept=".xlsx,.xls"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  setDataFileName(f.name);
                                  toast(`Data file "${f.name}" selected`);
                                }
                              }}
                            />
                            Browse File
                          </label>
                        </div>
                      </div>

                      {dataFileName && (
                        <div
                          style={{
                            marginTop: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 14px",
                            background: "var(--grey)",
                            borderRadius: "5px",
                            width: "fit-content",
                          }}
                        >
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--secondary)" }}>
                            Selected File:
                          </span>
                          <span style={{ fontSize: "13px", color: "var(--secondary)", fontWeight: 500 }}>
                            {dataFileName}
                          </span>
                          <button
                            type="button"
                            className="fill-btn primary-bg"
                            style={{ width: "32px", height: "32px", marginLeft: "8px" }}
                            title="Remove File"
                            onClick={() => {
                              setDataFileName("");
                            }}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3: UPLOAD TICKET */}
                {currentStepIndex === 2 && (
                  <div className="flex flex-col gap-3">
                    {/* Two File Uploads in 2 cols */}
                    <div className="form-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                      <TicketFileRow
                        id="ticket-background"
                        label="Ticket Background"
                        accept=".png,.pdf,.ai"
                        hint="Please upload a PNG, PDF or AI file"
                        fileName={ticketBackgroundFile}
                        onPick={(name) => {
                          setTicketBackgroundFile(name);
                          toast(`Background file "${name}" selected`);
                        }}
                        onClear={() => setTicketBackgroundFile("")}
                      />
                      <TicketFileRow
                        id="ticket-xml"
                        label="Ticket"
                        accept=".xml"
                        hint="Please upload an XML file"
                        fileName={ticketXmlFile}
                        onPick={(name) => {
                          setTicketXmlFile(name);
                          toast(`Ticket XML "${name}" selected`);
                        }}
                        onClear={() => setTicketXmlFile("")}
                      />
                    </div>

                    {/* Section: Printing settings */}
                    <div>
                      <h4 className="ticket-form-title">Printing Settings</h4>
                      <div className="form-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                        <div className="custom-field">
                          <label className="field-label" htmlFor="paper-size">
                            Paper Size (custom takes size from XML)
                          </label>
                          <div className="field-type field-stype-select">
                            <select
                              id="paper-size"
                              value={paper}
                              onChange={(e) => setPaper(e.target.value)}
                            >
                              {["A3", "A4", "A5", "A6", "A7", "Custom"].map((sz) => (
                                <option key={sz} value={sz}>{sz}</option>
                              ))}
                            </select>
                            <i className="fa-solid fa-chevron-down"></i>
                          </div>
                        </div>

                        <div className="custom-field">
                          <label className="field-label" htmlFor="orientation">
                            Orientation
                          </label>
                          <div className="field-type field-stype-select">
                            <select
                              id="orientation"
                              value={orientation}
                              onChange={(e) => setOrientation(e.target.value)}
                            >
                              <option value="Portrait">Portrait</option>
                              <option value="Landscape">Landscape</option>
                            </select>
                            <i className="fa-solid fa-chevron-down"></i>
                          </div>
                        </div>

                        <div className="custom-field">
                          <label className="field-label" htmlFor="ticket-rows">
                            Rows
                          </label>
                          <div className="field-type">
                            <input
                              id="ticket-rows"
                              type="number"
                              value={rows}
                              onChange={(e) => setRows(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="custom-field">
                          <label className="field-label" htmlFor="ticket-cols">
                            Columns
                          </label>
                          <div className="field-type">
                            <input
                              id="ticket-cols"
                              type="number"
                              value={columns}
                              onChange={(e) => setColumns(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Print Margin Offset */}
                    <div className="ticket-note">
                      <i className="fa-solid fa-circle-info"></i>
                      <span>
                        The margins are for the whole page, not an individual ticket, they use the calculation MM×2.52 so 3mm margin would be 3×2.52
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--secondary)", display: "block", marginBottom: "8px" }}>
                        Print Margin Offset
                      </span>
                      <div className="form-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                        {(["top", "right", "bottom", "left"] as const).map((side) => (
                          <div key={side} className="custom-field">
                            <label className="field-label" htmlFor={`margin-${side}`}>
                              {side[0].toUpperCase() + side.slice(1)}
                            </label>
                            <div className="field-type">
                              <input
                                id={`margin-${side}`}
                                type="text"
                                value={margins[side]}
                                onChange={(e) =>
                                  setMargins((curr) => ({ ...curr, [side]: e.target.value }))
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Print Origins Offset */}
                    <div className="ticket-note">
                      <i className="fa-solid fa-circle-info"></i>
                      <span>
                        The calculation for the origins in mm is: MM×2.8346, EG for 2mm it would be: 2×2.8346
                      </span>
                    </div>
                    <div className="form-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                      <div className="custom-field">
                        <label className="field-label" htmlFor="origin-x">
                          Offset the printing origin X axis, this is per ticket
                        </label>
                        <div className="field-type">
                          <input
                            id="origin-x"
                            type="text"
                            value={originX}
                            onChange={(e) => setOriginX(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="custom-field">
                        <label className="field-label" htmlFor="origin-y">
                          Offset the printing origin Y axis, this is per ticket
                        </label>
                        <div className="field-type">
                          <input
                            id="origin-y"
                            type="text"
                            value={originY}
                            onChange={(e) => setOriginY(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Checkboxes for print flags */}
                    <div className="toggle-grid ticket-checks">
                      <label className="check-row">
                        <input
                          type="checkbox"
                          checked={ticketFlags.printBackground}
                          onChange={() => flipTicketFlag("printBackground")}
                        />
                        <span>Print Background?</span>
                      </label>
                      <label className="check-row">
                        <input
                          type="checkbox"
                          checked={ticketFlags.cmyk}
                          onChange={() => flipTicketFlag("cmyk")}
                        />
                        <span>Output print files as CMYK?</span>
                      </label>
                      <label className="check-row">
                        <input
                          type="checkbox"
                          checked={ticketFlags.bleed}
                          onChange={() => flipTicketFlag("bleed")}
                        />
                        <span>Use bleed and add crop marks? (can only be used with custom page sizes)</span>
                      </label>
                      <label className="check-row">
                        <input
                          type="checkbox"
                          checked={ticketFlags.multiPage}
                          onChange={() => flipTicketFlag("multiPage")}
                        />
                        <span>Is this a multi page PDF? (can only be used with custom page sizes)</span>
                      </label>
                    </div>

                    {/* Misc Settings & PNG Output Settings */}
                    <div className="ticket-two-col">
                      <div>
                        <h4 className="ticket-form-title">Misc Settings</h4>
                        <div className="flex flex-col gap-4">
                          <label className="check-row">
                            <input
                              type="checkbox"
                              checked={ticketFlags.allowNoPrice}
                              onChange={() => flipTicketFlag("allowNoPrice")}
                            />
                            <span>Allow Products Without Price?</span>
                          </label>
                          <div className="custom-field">
                            <label className="field-label" htmlFor="ticket-ordering">
                              Ordering of the ticket, orders in ascending order
                            </label>
                            <div className="field-type">
                              <input
                                id="ticket-ordering"
                                type="number"
                                value={ordering}
                                onChange={(e) => setOrdering(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="ticket-form-title">PNG Output Settings</h4>
                        <div className="flex flex-col gap-4">
                          <label className="check-row">
                            <input
                              type="checkbox"
                              checked={ticketFlags.pngOutput}
                              onChange={() => flipTicketFlag("pngOutput")}
                            />
                            <span>IsPngOutput</span>
                          </label>
                          <div className="form-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                            <div className="custom-field">
                              <label className="field-label" htmlFor="png-width">
                                PngWidth
                              </label>
                              <div className="field-type">
                                <input
                                  id="png-width"
                                  type="text"
                                  value={pngWidth}
                                  placeholder="e.g. 1200"
                                  onChange={(e) => setPngWidth(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="custom-field">
                              <label className="field-label" htmlFor="png-height">
                                PngHeight
                              </label>
                              <div className="field-type">
                                <input
                                  id="png-height"
                                  type="text"
                                  value={pngHeight}
                                  placeholder="e.g. 800"
                                  onChange={(e) => setPngHeight(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Core Settings */}
                    <div>
                      <h4 className="ticket-form-title">Core Settings</h4>
                      <div className="flex flex-col gap-4">
                        <label className="check-row">
                          <input
                            type="checkbox"
                            checked={ticketFlags.franchiseeLookupOnly}
                            onChange={() => flipTicketFlag("franchiseeLookupOnly")}
                          />
                          <span>Only allow franchisees to edit lookup fields?</span>
                        </label>
                        <MultiSelect
                          id="core-departments"
                          label="Core Departments"
                          options={CORE_DEPARTMENT_OPTIONS}
                          selected={coreDepartments}
                          onChange={setCoreDepartments}
                          placeholder="Select core departments..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: TICKET MAPPINGS */}
                {currentStepIndex === 3 && (
                  <div className="flex flex-col gap-4">
                    {/* Top 3 Core Identifier Dropdowns in 3 cols */}
                    <div>
                      <div className="form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                        <div className="custom-field">
                          <label className="field-label" htmlFor="product-name-field">
                            Product Name Field
                          </label>
                          <div className="field-type field-stype-select">
                            <select
                              id="product-name-field"
                              value={productNameField}
                              onChange={(e) => setProductNameField(e.target.value)}
                            >
                              {MAPPING_FIELDS.map((f) => (
                                <option key={f} value={f}>
                                  {f}
                                </option>
                              ))}
                            </select>
                            <i className="fa-solid fa-chevron-down"></i>
                          </div>
                        </div>

                        <div className="custom-field">
                          <label className="field-label" htmlFor="product-id-field">
                            Product ID Field
                          </label>
                          <div className="field-type field-stype-select">
                            <select
                              id="product-id-field"
                              value={productIdField}
                              onChange={(e) => setProductIdField(e.target.value)}
                            >
                              {MAPPING_FIELDS.map((f) => (
                                <option key={f} value={f}>
                                  {f}
                                </option>
                              ))}
                            </select>
                            <i className="fa-solid fa-chevron-down"></i>
                          </div>
                        </div>

                        <div className="custom-field">
                          <label className="field-label" htmlFor="product-price-field">
                            Product Price Field
                          </label>
                          <div className="field-type field-stype-select">
                            <select
                              id="product-price-field"
                              value={productPriceField}
                              onChange={(e) => setProductPriceField(e.target.value)}
                            >
                              {MAPPING_FIELDS.map((f) => (
                                <option key={f} value={f}>
                                  {f}
                                </option>
                              ))}
                            </select>
                            <i className="fa-solid fa-chevron-down"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section: Mappings Table */}
                    <div>
                      <h4 className="ticket-form-title">Mappings</h4>
                      <div
                        className="table-scroll"
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          overflow: "hidden",
                          background: "var(--white)",
                        }}
                      >
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th style={{ width: "24%", minWidth: "160px" }}>Field</th>
                              {(
                                [
                                  { key: "viewFields", label: "View Fields" },
                                  { key: "editFields", label: "Edit Fields" },
                                  { key: "adhocViewFields", label: "Adhoc View Fields" },
                                  { key: "adhocEditFields", label: "Adhoc Edit Fields" },
                                  { key: "summaryViewFields", label: "Summary View Fields" },
                                ] as const
                              ).map((col) => {
                                const allSelected =
                                  mappingRows.length > 0 &&
                                  mappingRows.every((r) => r[col.key]);
                                return (
                                  <th
                                    key={col.key}
                                    style={{
                                      textAlign: "center",
                                      minWidth: "140px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        cursor: "pointer",
                                        userSelect: "none",
                                      }}
                                      onClick={() => toggleMappingColumn(col.key)}
                                      title={`Click to toggle all ${col.label}`}
                                    >
                                      <span>{col.label}</span>
                                      <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={() => toggleMappingColumn(col.key)}
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label={`Toggle all ${col.label}`}
                                        style={{
                                          width: "16px",
                                          height: "16px",
                                          cursor: "pointer",
                                          accentColor: "var(--secondary)",
                                          margin: 0,
                                        }}
                                      />
                                    </div>
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {mappingRows.map((row, idx) => (
                              <tr
                                key={row.field}
                                style={{
                                  transition: "background 0.15s ease",
                                }}
                              >
                                <td
                                  style={{
                                    fontWeight: 600,
                                    color: "var(--secondary)",
                                  }}
                                >
                                  {row.field}
                                </td>
                                {(
                                  [
                                    "viewFields",
                                    "editFields",
                                    "adhocViewFields",
                                    "adhocEditFields",
                                    "summaryViewFields",
                                  ] as const
                                ).map((colKey) => (
                                  <td
                                    key={colKey}
                                    style={{ textAlign: "center" }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={row[colKey]}
                                      onChange={() =>
                                        toggleMappingCell(idx, colKey)
                                      }
                                      aria-label={`${row.field} ${colKey}`}
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        cursor: "pointer",
                                        accentColor: "var(--secondary)",
                                        margin: "0 auto",
                                        display: "block",
                                      }}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: UPLOAD PATCHERS */}
                {currentStepIndex === 4 && (
                  <div className="flex flex-col gap-4">
                    {/* Optional Banner Note */}
                    <div className="ticket-note" style={{ margin: 0 }}>
                      <i className="fa-solid fa-circle-info"></i>
                      <span>
                        The following files are optional - if one or both are not uploaded, the default patchers will be used.
                      </span>
                    </div>

                    {/* Two Patcher Upload Rows */}
                    <div className="flex flex-col gap-4">
                      <TicketFileRow
                        id="loaded-batch-patcher"
                        label="Loaded Batch Patcher"
                        required={false}
                        accept=".cs"
                        hint="Please upload a C# .CS file"
                        fileName={loadedBatchPatcherFile}
                        onPick={(name) => {
                          setLoadedBatchPatcherFile(name);
                          toast(`Loaded batch patcher "${name}" selected`);
                        }}
                        onClear={() => setLoadedBatchPatcherFile("")}
                      />
                      <TicketFileRow
                        id="rendered-batch-patcher"
                        label="Rendered Batch Patcher"
                        required={false}
                        accept=".cs"
                        hint="Please upload a C# .CS file"
                        fileName={renderedBatchPatcherFile}
                        onPick={(name) => {
                          setRenderedBatchPatcherFile(name);
                          toast(`Rendered batch patcher "${name}" selected`);
                        }}
                        onClear={() => setRenderedBatchPatcherFile("")}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 6: UPLOAD CONTENT */}
                {currentStepIndex === 5 && (
                  <div className="flex flex-col gap-5">
                    {/* Detected Assets in Ticket (2 cols) */}
                    <div className="form-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                      {/* Fonts Found */}
                      <div
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          padding: "16px",
                          background: "var(--white)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "12px",
                          }}
                        >
                          <i
                            className="fa-solid fa-font"
                            style={{ color: "var(--primary)", fontSize: "16px" }}
                          ></i>
                          <span
                            style={{
                              fontSize: "15px",
                              fontWeight: 700,
                              color: "var(--secondary)",
                            }}
                          >
                            Fonts found in ticket:
                          </span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {detectedFonts.map((font) => (
                            <span
                              key={font}
                              className="chip"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "#f3f4f7",
                                borderColor: "#e4e4eb",
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "var(--secondary)",
                              }}
                            >
                              <i
                                className="fa-solid fa-file-lines"
                                style={{ color: "var(--content-light)", fontSize: "11px" }}
                              ></i>
                              {font}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Images Found */}
                      <div
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          padding: "16px",
                          background: "var(--white)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "12px",
                          }}
                        >
                          <i
                            className="fa-solid fa-images"
                            style={{ color: "var(--mint)", fontSize: "16px" }}
                          ></i>
                          <span
                            style={{
                              fontSize: "15px",
                              fontWeight: 700,
                              color: "var(--secondary)",
                            }}
                          >
                            Images found in ticket:
                          </span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {detectedImages.map((img) => (
                            <span
                              key={img}
                              className="chip"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "#f3f4f7",
                                borderColor: "#e4e4eb",
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "var(--secondary)",
                              }}
                            >
                              <i
                                className="fa-solid fa-image"
                                style={{ color: "var(--content-light)", fontSize: "11px" }}
                              ></i>
                              {img}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Content Files ZIP Upload */}
                    <div>
                      <TicketFileRow
                        id="content-files-zip"
                        label="Content Files"
                        required={true}
                        accept=".zip"
                        hint="Please upload a ZIP file"
                        fileName={contentZipFile}
                        onPick={(name) => {
                          setContentZipFile(name);
                          toast(`Content archive "${name}" uploaded successfully`);
                        }}
                        onClear={() => setContentZipFile("")}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 7: REGIONS */}
                {currentStepIndex === 6 && (
                  <div className="flex flex-col gap-5">
                    {/* Region Cards (2 per row) */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
                      {regionList.map((reg, idx) => (
                        <div
                          key={reg.id}
                          style={{
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            background: "var(--white)",
                            padding: "20px",
                            boxShadow: "0 2px 8px rgba(43, 37, 62, 0.04)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              minHeight: "32px",
                              paddingBottom: "12px",
                              borderBottom: "1px solid var(--border)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                lineHeight: 1,
                              }}
                            >
                              <i
                                className="fa-solid fa-map-location-dot"
                                style={{
                                  color: "var(--primary)",
                                  fontSize: "16px",
                                  lineHeight: 1,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              ></i>
                              <h4
                                style={{
                                  margin: 0,
                                  fontSize: "16px",
                                  fontWeight: 700,
                                  color: "var(--secondary)",
                                  lineHeight: 1,
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                Region {reg.name ? `— ${reg.name}` : `#${idx + 1}`}
                              </h4>
                            </div>

                            {regionList.length > 1 && (
                              <button
                                type="button"
                                className="fill-btn primary-bg"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  fontSize: "13px",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  margin: 0,
                                  padding: 0,
                                }}
                                onClick={() => handleDeleteRegion(reg.id)}
                                title="Delete Region"
                                aria-label="Delete Region"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            )}
                          </div>

                          <div className="custom-field">
                            <label className="field-label" htmlFor={`region-name-${reg.id}`}>
                              Name <span style={{ color: "var(--primary)" }}>*</span>
                            </label>
                            <div className="field-type">
                              <input
                                id={`region-name-${reg.id}`}
                                type="text"
                                placeholder="e.g. Head Office"
                                value={reg.name}
                                onChange={(e) => handleUpdateRegion(reg.id, "name", e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="custom-field">
                            <label className="field-label" htmlFor={`region-desc-${reg.id}`}>
                              Description
                            </label>
                            <div className="field-type">
                              <input
                                id={`region-desc-${reg.id}`}
                                type="text"
                                placeholder="e.g. Corporate headquarters and central store network"
                                value={reg.description}
                                onChange={(e) => handleUpdateRegion(reg.id, "description", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Region Button */}
                    <div>
                      <button
                        type="button"
                        className="cta_with_icon mint-bg"
                        onClick={handleAddRegion}
                      >
                        <span>
                          <i className="fa-solid fa-plus"></i>
                        </span>
                        <p>Add Region</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 8: INVOICING */}
                {currentStepIndex === 7 && (
                  <div className="flex flex-col gap-5">
                    <div className="form-grid">
                      <div className="custom-field">
                        <label className="field-label" htmlFor="inv-report-name">
                          Client Name in Report
                        </label>
                        <div className="field-type">
                          <input
                            id="inv-report-name"
                            type="text"
                            placeholder={clientName || "e.g. Food Villa Retail Group"}
                            value={reportClientName}
                            onChange={(e) => setReportClientName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="custom-field">
                        <label className="field-label" htmlFor="inv-stores">
                          Number Of Stores
                        </label>
                        <div className="field-type">
                          <input
                            id="inv-stores"
                            type="text"
                            value={String(calcStores)}
                            disabled
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="custom-field">
                        <label className="field-label" htmlFor="inv-val-per-store">
                          Value per Store
                        </label>
                        <div className="field-type">
                          <input
                            id="inv-val-per-store"
                            type="number"
                            step="any"
                            value={valuePerStore}
                            onChange={(e) => setValuePerStore(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="custom-field">
                        <label className="field-label" htmlFor="inv-num-integrations">
                          Number Of Integrations
                        </label>
                        <div className="field-type">
                          <input
                            id="inv-num-integrations"
                            type="number"
                            step="1"
                            value={numberOfIntegrations}
                            onChange={(e) => setNumberOfIntegrations(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="custom-field">
                        <label className="field-label" htmlFor="inv-discount">
                          Discount Percentage
                        </label>
                        <div className="field-type">
                          <input
                            id="inv-discount"
                            type="number"
                            step="any"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="custom-field">
                        <label className="field-label" htmlFor="inv-gst">
                          GST
                        </label>
                        <div className="field-type">
                          <input
                            id="inv-gst"
                            type="number"
                            step="any"
                            value={gstRate}
                            onChange={(e) => setGstRate(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="custom-field">
                        <label className="field-label" htmlFor="inv-total-integrations">
                          Total Integrations
                        </label>
                        <div className="field-type">
                          <input
                            id="inv-total-integrations"
                            type="number"
                            step="1"
                            value={totalIntegrations}
                            onChange={(e) => setTotalIntegrations(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="custom-field">
                        <label className="field-label" htmlFor="inv-reseller">
                          Reseller Invoice
                        </label>
                        <div className="field-type">
                          <input
                            id="inv-reseller"
                            type="number"
                            step="any"
                            value={resellerInvoice}
                            onChange={(e) => setResellerInvoice(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="custom-field">
                        <label className="field-label" htmlFor="inv-payment-type">
                          Payment Type
                        </label>
                        <div className="field-type field-stype-select">
                          <select
                            id="inv-payment-type"
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="HeadOfficeManualInvoice">HeadOfficeManualInvoice</option>
                            <option value="HOCreditCard">HOCreditCard</option>
                            <option value="StoreCreditCard">StoreCreditCard</option>
                          </select>
                          <i className="fa-solid fa-chevron-down"></i>
                        </div>
                      </div>

                      <div className="custom-field">
                        <label className="field-label" htmlFor="inv-total-per-month">
                          Total per Month
                        </label>
                        <div className="field-type">
                          <input
                            id="inv-total-per-month"
                            type="text"
                            value={moneyVal(calcPerMonth)}
                            disabled
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="custom-field">
                        <label className="field-label" htmlFor="inv-total-invoice">
                          Total Invoice
                        </label>
                        <div className="field-type">
                          <input
                            id="inv-total-invoice"
                            type="text"
                            value={moneyVal(calcTotalInvoice)}
                            disabled
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 9: VERIFY CLIENT DATA */}
                {currentStepIndex === 8 && (
                  <div className="flex flex-col gap-3">
                    {/* Section 1: Name and Logo */}
                    <div
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        background: "var(--white)",
                        padding: "16px 20px",
                        boxShadow: "0 2px 8px rgba(43, 37, 62, 0.04)",
                      }}
                    >
                      <div style={{ paddingBottom: "10px", borderBottom: "1px solid #edf0f4", marginBottom: "14px" }}>
                        <h4 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--secondary)" }}>
                          Name and Logo
                        </h4>
                        <p style={{ margin: "4px 0 0", fontSize: "15px", color: "var(--content-light)" }}>
                          You can edit the display name and logo for this client at a later stage
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
                        <div>
                          <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--content-light)", display: "block", marginBottom: "4px" }}>
                            Display Name
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--secondary)" }}>
                            {clientName || "test-store"}
                          </span>
                        </div>

                        <div style={{ borderLeft: "1px solid #edf0f4", paddingLeft: "28px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--content-light)", display: "block", marginBottom: "6px" }}>
                            Corporate Logo
                          </span>
                          {logoPreviewUrl ? (
                            <img
                              src={logoPreviewUrl}
                              alt="Client Logo"
                              style={{
                                maxHeight: "50px",
                                maxWidth: "220px",
                                objectFit: "contain",
                                border: "1px solid #edf0f4",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                background: "#fafafa",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "8px 16px",
                                background: "#f8f9fc",
                                borderRadius: "4px",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <i className="fa-solid fa-image" style={{ color: "var(--primary)", fontSize: "18px" }}></i>
                              <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--secondary)" }}>
                                {logoFileName || "RACERS EDGE (Default Logo)"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Tickets and Data */}
                    <div
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        background: "var(--white)",
                        padding: "16px 20px",
                        boxShadow: "0 2px 8px rgba(43, 37, 62, 0.04)",
                      }}
                    >
                      <div style={{ paddingBottom: "10px", borderBottom: "1px solid #edf0f4", marginBottom: "14px" }}>
                        <h4 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--secondary)" }}>
                          Tickets and Data
                        </h4>
                        <p style={{ margin: "4px 0 0", fontSize: "15px", color: "var(--content-light)" }}>
                          Spreadsheet mapping validation against uploaded ticket template
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
                        {/* Matching Ticket Fields */}
                        <div>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "var(--mint)",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "8px",
                            }}
                          >
                            <i className="fa-solid fa-circle-check" style={{ fontSize: "18px" }}></i>
                            Matching Ticket Fields (found in data spreadsheet):
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {["Product Name", "Brand"].map((f) => (
                              <span
                                key={f}
                                style={{
                                  background: "rgba(88, 185, 125, 0.12)",
                                  color: "#237243",
                                  fontSize: "15px",
                                  fontWeight: 600,
                                  padding: "6px 14px",
                                  borderRadius: "4px",
                                  border: "1px solid rgba(88, 185, 125, 0.3)",
                                }}
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Missing Ticket Fields */}
                        <div>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "var(--primary)",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "8px",
                            }}
                          >
                            <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "18px" }}></i>
                            Missing Ticket Fields (missing from data spreadsheet):
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {[
                              "OFF_%",
                              "Savings_M",
                              "SavingsPercent_M",
                              "Savings_S",
                              "SavingsPercent_S",
                              "OFF_SalePrice_S",
                              "Was Price_Dollar Sign",
                              "Was Price_Dollars",
                              "Was Price_Cents",
                              "Was_Label",
                              "Sale Price_Dollar Sign",
                              "Sale Price_Dollars",
                              "Sale Price_Cents",
                              "New_Label",
                              "QRCode_Image",
                              "line_Image",
                              "ErrorMessage1",
                              "afterpaylogo_image",
                            ].map((f) => (
                              <span
                                key={f}
                                style={{
                                  background: "rgba(247, 53, 130, 0.08)",
                                  color: "var(--primary)",
                                  fontSize: "14.5px",
                                  fontWeight: 600,
                                  padding: "5px 12px",
                                  borderRadius: "4px",
                                  border: "1px solid rgba(247, 53, 130, 0.2)",
                                }}
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Re-upload Note & Drop Rows */}
                        <div style={{ marginTop: "4px", paddingTop: "14px", borderTop: "1px solid #edf0f4" }}>
                          <p style={{ margin: "0 0 12px", fontSize: "15px", color: "var(--content-light)", lineHeight: "1.5" }}>
                            If the fields matched as expected, you do not need to do anything. Otherwise, you may reupload either or both the data and ticket files:
                          </p>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                            <TicketFileRow
                              id="verify-data-file"
                              label="Data Spreadsheet"
                              accept=".xlsx,.xls,.csv"
                              hint="Upload updated data file"
                              fileName={dataFileName || "Catalogue_2026.xlsx"}
                              onPick={(name) => {
                                setDataFileName(name);
                                toast(`Data file "${name}" updated`);
                              }}
                              onClear={() => setDataFileName("")}
                            />
                            <TicketFileRow
                              id="verify-ticket-xml"
                              label="Ticket XML"
                              accept=".xml"
                              hint="Upload updated ticket XML"
                              fileName={ticketXmlFile || "FoodVilla_A4_Promo.xml"}
                              onPick={(name) => {
                                setTicketXmlFile(name);
                                toast(`Ticket XML "${name}" updated`);
                              }}
                              onClear={() => setTicketXmlFile("")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Ticket Settings */}
                    <div
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        background: "var(--white)",
                        padding: "16px 20px",
                        boxShadow: "0 2px 8px rgba(43, 37, 62, 0.04)",
                      }}
                    >
                      <div style={{ paddingBottom: "10px", borderBottom: "1px solid #edf0f4", marginBottom: "14px" }}>
                        <h4 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--secondary)" }}>
                          Ticket Settings
                        </h4>
                        <p style={{ margin: "4px 0 0", fontSize: "15px", color: "var(--content-light)" }}>
                          You can edit the settings for this ticket at a later stage
                        </p>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          gap: "12px",
                        }}
                      >
                        {[
                          { label: "Rows", value: rows || "1" },
                          { label: "Columns", value: columns || "1" },
                          { label: "Orientation", value: orientation || "Portrait" },
                          { label: "Paper Size", value: `${paper} (Takes size from XML if custom)` },
                          { label: "Allow Products Without Price?", value: ticketFlags.allowNoPrice ? "Yes" : "No" },
                          { label: "Print Background?", value: ticketFlags.printBackground ? "Yes" : "No" },
                          { label: "Output print files as CMYK?", value: ticketFlags.cmyk ? "Yes" : "No" },
                          { label: "Use bleed and add crop marks?", value: ticketFlags.bleed ? "Yes" : "No" },
                          { label: "Is this a multi page PDF?", value: ticketFlags.multiPage ? "Yes" : "No" },
                          { label: "PageCount", value: "1" },
                          { label: "Franchisees edit Lookup Only?", value: ticketFlags.franchiseeLookupOnly ? "Yes" : "No" },
                          { label: "Ordering of tickets", value: ordering === "0" ? "Ascending order" : "Descending order" },
                          { label: "Origin X Offset (per ticket)", value: `${originX} mm` },
                          { label: "Origin Y Offset (per ticket)", value: `${originY} mm` },
                          { label: "IsPngOutput", value: ticketFlags.pngOutput ? "Yes" : "No" },
                          { label: "PNG Resolution (W × H)", value: pngWidth && pngHeight ? `${pngWidth} × ${pngHeight}` : "Auto / Default" },
                        ].map((item, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "12px 14px",
                              background: "#f8f9fc",
                              borderRadius: "6px",
                              border: "1px solid #edf0f4",
                            }}
                          >
                            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--content-light)", display: "block", marginBottom: "4px" }}>
                              {item.label}
                            </span>
                            <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--secondary)" }}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 4: Content Files */}
                    <div
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        background: "var(--white)",
                        padding: "16px 20px",
                        boxShadow: "0 2px 8px rgba(43, 37, 62, 0.04)",
                      }}
                    >
                      <div style={{ paddingBottom: "10px", borderBottom: "1px solid #edf0f4", marginBottom: "14px" }}>
                        <h4 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--secondary)" }}>
                          Content Files
                        </h4>
                        <p style={{ margin: "4px 0 0", fontSize: "15px", color: "var(--content-light)" }}>
                          Font assets and embedded graphic resources extracted from ticket package
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
                        {/* Matching Fonts */}
                        <div>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "var(--mint)",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "8px",
                            }}
                          >
                            <i className="fa-solid fa-font" style={{ fontSize: "16px" }}></i>
                            Matching Ticket Fonts (found in content ZIP):
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {detectedFonts.map((font) => (
                              <span
                                key={font}
                                style={{
                                  background: "rgba(88, 185, 125, 0.12)",
                                  color: "#237243",
                                  fontSize: "15px",
                                  fontWeight: 600,
                                  padding: "6px 14px",
                                  borderRadius: "4px",
                                  border: "1px solid rgba(88, 185, 125, 0.3)",
                                }}
                              >
                                {font}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Missing Fonts */}
                        <div>
                          <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--content-light)", display: "flex", alignItems: "center", gap: "8px" }}>
                            <i className="fa-solid fa-circle-check" style={{ color: "var(--mint)", fontSize: "18px" }}></i>
                            Missing Ticket Fonts: <strong style={{ color: "var(--secondary)", marginLeft: "4px" }}>Nothing was missing.</strong>
                          </span>
                        </div>

                        {/* Matching Images */}
                        <div>
                          <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--content-light)", display: "flex", alignItems: "center", gap: "8px" }}>
                            <i className="fa-solid fa-circle-info" style={{ color: "#9f9f9f", fontSize: "18px" }}></i>
                            Matching Ticket Images: <span style={{ color: "var(--content-light)", marginLeft: "4px" }}>No matches were found.</span>
                          </span>
                        </div>

                        {/* Missing Images */}
                        <div>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "var(--primary)",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "8px",
                            }}
                          >
                            <i className="fa-solid fa-images" style={{ fontSize: "16px" }}></i>
                            Missing Ticket Images (missing from content ZIP):
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {detectedImages.map((img) => (
                              <span
                                key={img}
                                style={{
                                  background: "rgba(247, 53, 130, 0.08)",
                                  color: "var(--primary)",
                                  fontSize: "14.5px",
                                  fontWeight: 600,
                                  padding: "5px 12px",
                                  borderRadius: "4px",
                                  border: "1px solid rgba(247, 53, 130, 0.2)",
                                }}
                              >
                                {img}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Reupload Content ZIP */}
                        <div style={{ marginTop: "4px", paddingTop: "14px", borderTop: "1px solid #edf0f4" }}>
                          <p style={{ margin: "0 0 12px", fontSize: "15px", color: "var(--content-light)", lineHeight: "1.5" }}>
                            If the fonts and images matched as expected, you do not need to do anything. Otherwise, please reupload the content ZIP:
                          </p>
                          <TicketFileRow
                            id="verify-content-zip"
                            label="Content Archive (.zip)"
                            accept=".zip"
                            hint="Upload content files (.zip)"
                            fileName={contentZipFile || "FontsAndImages_bundle.zip"}
                            onPick={(name) => {
                              setContentZipFile(name);
                              toast(`Content archive "${name}" updated`);
                            }}
                            onClear={() => setContentZipFile("")}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Regions */}
                    <div
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        background: "var(--white)",
                        padding: "16px 20px",
                        boxShadow: "0 2px 8px rgba(43, 37, 62, 0.04)",
                      }}
                    >
                      <div style={{ paddingBottom: "10px", borderBottom: "1px solid #edf0f4", marginBottom: "14px" }}>
                        <h4 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--secondary)" }}>
                          Regions
                        </h4>
                        <p style={{ margin: "4px 0 0", fontSize: "15px", color: "var(--content-light)" }}>
                          You can edit the regions for this client at a later stage
                        </p>
                      </div>

                      <div>
                        <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--secondary)", display: "block", marginBottom: "10px" }}>
                          Configured Regions ({regionList.length})
                        </span>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                          {regionList.map((reg, idx) => (
                            <div
                              key={reg.id}
                              style={{
                                padding: "12px 14px",
                                background: "#f8f9fc",
                                borderRadius: "6px",
                                border: "1px solid #edf0f4",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                              }}
                            >
                              <i className="fa-solid fa-map-location-dot" style={{ color: "var(--primary)", fontSize: "20px" }}></i>
                              <div>
                                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--secondary)", display: "block" }}>
                                  {reg.name || `Region #${idx + 1}`}
                                </span>
                                {reg.description && (
                                  <span style={{ fontSize: "14px", color: "var(--content-light)", display: "block", marginTop: "2px" }}>
                                    {reg.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 6: Invoicing */}
                    <div
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        background: "var(--white)",
                        padding: "16px 20px",
                        boxShadow: "0 2px 8px rgba(43, 37, 62, 0.04)",
                      }}
                    >
                      <div style={{ paddingBottom: "10px", borderBottom: "1px solid #edf0f4", marginBottom: "14px" }}>
                        <h4 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--secondary)" }}>
                          Invoicing
                        </h4>
                        <p style={{ margin: "4px 0 0", fontSize: "15px", color: "var(--content-light)" }}>
                          You can edit the invoicing settings for this client at a later stage
                        </p>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          gap: "12px",
                        }}
                      >
                        {[
                          { label: "Client Name in report", value: reportClientName || clientName || "test-store" },
                          { label: "No of Stores", value: calcStores },
                          { label: "GST", value: `${gstRate}%` },
                          { label: "Discount %", value: `${discountPercentage}%` },
                          { label: "No. Of Integrations", value: totalIntegrations },
                          { label: "Value / Store", value: `$${valuePerStore}` },
                          { label: "Reseller Invoice", value: `$${resellerInvoice}` },
                          { label: "Total Invoice", value: `$${moneyVal(calcTotalInvoice)}`, isHighlight: true },
                        ].map((item, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "12px 14px",
                              background: "#f8f9fc",
                              borderRadius: "6px",
                              border: "1px solid #edf0f4",
                            }}
                          >
                            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--content-light)", display: "block", marginBottom: "4px" }}>
                              {item.label}
                            </span>
                            <span
                              style={{
                                fontSize: item.isHighlight ? "20px" : "16px",
                                fontWeight: item.isHighlight ? 800 : 700,
                                color: item.isHighlight ? "var(--primary)" : "var(--secondary)",
                              }}
                            >
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Actions Bar with New-Frontend Button System */}
                <div className="wizard-footer-actions">
                  {currentStepIndex > 0 ? (
                    <button
                      type="button"
                      className="cta_with_icon secondary-bg"
                      onClick={handlePrev}
                      disabled={isSubmitting}
                    >
                      <span>
                        <i className="fa-solid fa-arrow-left"></i>
                      </span>
                      <p>Previous: {STEPS[currentStepIndex - 1].title}</p>
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    className="cta_with_icon mint-bg"
                    onClick={handleNext}
                    disabled={isSubmitting}
                  >
                    <span>
                      <i
                        className={
                          isSubmitting
                            ? "fa-solid fa-spinner fa-spin"
                            : currentStepIndex === STEPS.length - 1
                              ? "fa-solid fa-check"
                              : "fa-solid fa-arrow-right"
                        }
                      ></i>
                    </span>
                    <p>
                      {isSubmitting
                        ? "Saving Client..."
                        : currentStepIndex === STEPS.length - 1
                          ? "Save Client"
                          : `Next: ${STEPS[currentStepIndex + 1]?.title}`}
                    </p>
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </AdminShell>
  );
}
