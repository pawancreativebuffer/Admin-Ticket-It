"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

const PAPER_SIZES = ["A3", "A4", "A5", "A6", "A7", "Custom"];
const ORIENTATIONS = ["Portrait", "Landscape"];

// slim file picker row (same look as the Users page upload boxes)
function FileRow({
  id,
  label,
  accept,
  hint,
  fileName,
  onPick,
}: {
  id: string;
  label: string;
  accept: string;
  hint?: string;
  fileName: string;
  onPick: (name: string) => void;
}) {
  return (
    <div className="custom-field">
      <span className="field-label">{label}</span>
      <div className="drop-row">
        <div className="drop-info">
          <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
          <div>
            <span className="upload-label">Drag &amp; Drop File</span>
            <span className="upload-hint">
              {fileName || "No file selected"}
            </span>
          </div>
        </div>
        <div className="drop-actions">
          <label className="blank_cta" htmlFor={id}>
            <input
              id={id}
              type="file"
              accept={accept}
              onChange={(event) => onPick(event.target.files?.[0]?.name ?? "")}
            />
            Browse File
          </label>
        </div>
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

function Input({
  id,
  label,
  value,
  onChange,
  type = "number",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="custom-field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="field-type">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}

function Select({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="custom-field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="field-type field-stype-select">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down"></i>
      </div>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="check-row">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

// checkbox list used for core departments and denied groups
function CheckGrid({
  options,
  selected,
  onChange,
  empty,
}: {
  options: string[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  empty: string;
}) {
  return (
    <div className="zonal-list cols-2">
      {options.map((option) => (
        <label key={option} className="check-row">
          <input
            type="checkbox"
            checked={selected.has(option)}
            onChange={() => {
              const next = new Set(selected);
              if (next.has(option)) next.delete(option);
              else next.add(option);
              onChange(next);
            }}
          />
          <span>{option}</span>
        </label>
      ))}
      {options.length === 0 && <p className="muted">{empty}</p>}
    </div>
  );
}

// "Create Ticket for <client>" popup from the legacy page: background + XML upload, printing,
// misc, PNG and core settings, and up to six preview images. Saving hands back the ticket name.
export default function CreateTicketModal({
  client,
  ticket,
  departments,
  groups,
  onSave,
  onClose,
}: {
  client: string;
  // set when editing an existing ticket: same form, title changes and the XML stays optional
  ticket?: string;
  departments: string[];
  groups: string[];
  onSave: (ticketName: string) => void;
  onClose: () => void;
}) {
  const [background, setBackground] = useState("");
  const [ticketXml, setTicketXml] = useState(ticket ? `${ticket}.xml` : "");
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
  const [flags, setFlags] = useState({
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
  const [coreDepartments, setCoreDepartments] = useState<Set<string>>(
    new Set(),
  );
  const [deniedGroups, setDeniedGroups] = useState<Set<string>>(new Set());
  const [previews, setPreviews] = useState(
    Array.from({ length: 6 }, () => ({ name: "", file: "" })),
  );

  const flip = (key: keyof typeof flags) =>
    setFlags((current) => ({ ...current, [key]: !current[key] }));
  const setPreview = (
    index: number,
    patch: Partial<{ name: string; file: string }>,
  ) =>
    setPreviews((current) =>
      current.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    );

  return (
    <Modal
      title={ticket ? `Edit Ticket ${ticket}` : `Create Ticket for ${client}`}
      onClose={onClose}
      width={1100}
    >
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(ticketXml.replace(/\.xml$/i, ""));
        }}
      >
        <div className="form-grid two">
          <FileRow
            id="ticket-background"
            label="Ticket Background"
            accept=".pdf,.ai,.png"
            hint="Please upload a PDF, AI or PNG file."
            fileName={background}
            onPick={setBackground}
          />
          <FileRow
            id="ticket-xml"
            label="Ticket"
            accept=".xml"
            hint="Please upload an XML file."
            fileName={ticketXml}
            onPick={setTicketXml}
          />
        </div>

        <h4 className="ticket-form-title">Printing Settings</h4>
        <div className="form-grid">
          <Select
            id="paper-size"
            label="Paper Size (custom takes the size from the XML file)"
            value={paper}
            options={PAPER_SIZES}
            onChange={setPaper}
          />
          <Select
            id="orientation"
            label="Orientation"
            value={orientation}
            options={ORIENTATIONS}
            onChange={setOrientation}
          />
          <Input id="rows" label="Rows" value={rows} onChange={setRows} />
          <Input
            id="columns"
            label="Columns"
            value={columns}
            onChange={setColumns}
          />
        </div>

        <div className="ticket-note">
          <i className="fa-solid fa-circle-info"></i>
          <span>
            Print margins are for the whole page, not an individual ticket. They
            use the calculation MM × 2.52, so a 3mm margin would be 3 × 2.52.
          </span>
        </div>
        <div className="form-grid">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Input
              key={side}
              id={`margin-${side}`}
              label={`Margin ${side[0].toUpperCase()}${side.slice(1)}`}
              value={margins[side]}
              onChange={(value) =>
                setMargins((current) => ({ ...current, [side]: value }))
              }
            />
          ))}
        </div>

        <div className="ticket-note">
          <i className="fa-solid fa-circle-info"></i>
          <span>
            The printing origin is per ticket and uses MM × 2.8346, e.g. for 2mm
            it would be 2 × 2.8346.
          </span>
        </div>
        <div className="form-grid two">
          <Input
            id="origin-x"
            label="Offset printing origin X axis"
            value={originX}
            onChange={setOriginX}
          />
          <Input
            id="origin-y"
            label="Offset printing origin Y axis"
            value={originY}
            onChange={setOriginY}
          />
        </div>

        <div className="toggle-grid ticket-checks">
          <Check
            label="Print background?"
            checked={flags.printBackground}
            onChange={() => flip("printBackground")}
          />
          <Check
            label="Output print files as CMYK?"
            checked={flags.cmyk}
            onChange={() => flip("cmyk")}
          />
          <Check
            label="Use bleed and add crop marks? (custom page sizes only)"
            checked={flags.bleed}
            onChange={() => flip("bleed")}
          />
          <Check
            label="Is this a multi page PDF? (custom page sizes only)"
            checked={flags.multiPage}
            onChange={() => flip("multiPage")}
          />
        </div>

        <div className="ticket-two-col">
          <div>
            <h4 className="ticket-form-title">Misc Settings</h4>
            <div className="form-grid one">
              <Check
                label="Allow products without price?"
                checked={flags.allowNoPrice}
                onChange={() => flip("allowNoPrice")}
              />
              <Input
                id="ordering"
                label="Ordering of the ticket (ascending)"
                value={ordering}
                onChange={setOrdering}
              />
            </div>
          </div>
          <div>
            <h4 className="ticket-form-title">PNG Output Settings</h4>
            <div className="form-grid one">
              <Check
                label="PNG output"
                checked={flags.pngOutput}
                onChange={() => flip("pngOutput")}
              />
              <div className="form-grid two">
                <Input
                  id="png-width"
                  label="PNG Width"
                  value={pngWidth}
                  onChange={setPngWidth}
                />
                <Input
                  id="png-height"
                  label="PNG Height"
                  value={pngHeight}
                  onChange={setPngHeight}
                />
              </div>
            </div>
          </div>
        </div>

        <h4 className="ticket-form-title">Core Settings</h4>
        <Check
          label="Only allow franchisees to edit lookup fields?"
          checked={flags.franchiseeLookupOnly}
          onChange={() => flip("franchiseeLookupOnly")}
        />
        <div className="ticket-two-col">
          <div>
            <span className="field-label ticket-sub-label">
              Core Departments
            </span>
            <CheckGrid
              options={departments}
              selected={coreDepartments}
              onChange={setCoreDepartments}
              empty="No departments set up for this client."
            />
          </div>
          <div>
            <span className="field-label ticket-sub-label">
              Deny Permission for Groups
            </span>
            <CheckGrid
              options={groups}
              selected={deniedGroups}
              onChange={setDeniedGroups}
              empty="No groups set up for this client."
            />
          </div>
        </div>

        <h4 className="ticket-form-title">Upload Ticket Previews</h4>
        <p className="field-hint ticket-preview-hint">
          Upload a .PNG preview of the ticket. The name is displayed under the
          ticket preview.
        </p>
        <div className="preview-grid">
          {previews.map((preview, index) => (
            <div key={index} className="preview-card">
              <div className="custom-field">
                <label
                  className="field-label"
                  htmlFor={`preview-name-${index}`}
                >
                  Preview {index + 1}
                </label>
                <div className="field-type">
                  <input
                    id={`preview-name-${index}`}
                    type="text"
                    value={preview.name}
                    placeholder="Preview name"
                    onChange={(event) =>
                      setPreview(index, { name: event.target.value })
                    }
                  />
                </div>
              </div>
              <div className="preview-file">
                <span className="upload-hint">
                  {preview.file || "No file selected"}
                </span>
                <label
                  className="blank_cta btn-xs"
                  htmlFor={`preview-file-${index}`}
                >
                  <input
                    id={`preview-file-${index}`}
                    type="file"
                    accept=".png"
                    onChange={(event) =>
                      setPreview(index, {
                        file: event.target.files?.[0]?.name ?? "",
                      })
                    }
                  />
                  Browse
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-actions end">
          <button
            type="submit"
            className="cta_with_icon mint-bg"
            disabled={!ticketXml}
          >
            <span>
              <i className="fa-solid fa-check"></i>
            </span>
            <p>Save Ticket</p>
          </button>
        </div>
      </form>
    </Modal>
  );
}
