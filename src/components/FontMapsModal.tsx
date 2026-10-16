"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

export type FontMap = { template: string; mapping: string };

// table of font maps with a delete per row (used in the section and in the popup)
export function FontMapTable({
  maps,
  onDelete,
}: {
  maps: FontMap[];
  onDelete: (index: number) => void;
}) {
  return (
    <div className="table-scroll">
      <table className="custom-table compact">
        <thead>
          <tr>
            <th>Font in Template</th>
            <th>Mapped To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {maps.map((map, index) => (
            <tr key={`${map.template}-${index}`}>
              <td>{map.template}</td>
              <td>{map.mapping}</td>
              <td>
                <button
                  type="button"
                  className="fill-btn primary-bg has-tip"
                  data-tip="Delete"
                  aria-label="Delete"
                  onClick={() => onDelete(index)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
          {maps.length === 0 && (
            <tr>
              <td colSpan={3} className="empty-row">
                No font maps yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// "Create Font Map" popup: a template font mapped onto an uploaded (directory) font
function CreateFontMapModal({
  templateFonts,
  directoryFonts,
  onSave,
  onClose,
}: {
  templateFonts: string[];
  directoryFonts: string[];
  onSave: (map: FontMap) => void;
  onClose: () => void;
}) {
  const [template, setTemplate] = useState(templateFonts[0] ?? "");
  const [mapping, setMapping] = useState(directoryFonts[0] ?? "");

  const select = (
    id: string,
    label: string,
    value: string,
    options: string[],
    onChange: (value: string) => void,
  ) => (
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

  return (
    <Modal title="Create Font Map" onClose={onClose} width={560}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave({ template, mapping });
        }}
      >
        <div className="form-grid one">
          {select(
            "font-map-font",
            "Font Map Font",
            template,
            templateFonts,
            setTemplate,
          )}
          {select(
            "directory-font",
            "Directory Font",
            mapping,
            directoryFonts,
            setMapping,
          )}
        </div>
        <div className="modal-actions end">
          <button type="submit" className="cta_with_icon mint-bg">
            <span>
              <i className="fa-solid fa-check"></i>
            </span>
            <p>Submit</p>
          </button>
        </div>
      </form>
    </Modal>
  );
}

// "Font Maps" popup (legacy Edit Font Maps page): create a mapping, the fonts found in the
// templates, and the existing maps. Changes apply straight away, like the legacy page.
export default function FontMapsModal({
  maps,
  templateFonts,
  directoryFonts,
  onAdd,
  onDelete,
  onClose,
}: {
  maps: FontMap[];
  templateFonts: string[];
  directoryFonts: string[];
  onAdd: (map: FontMap) => void;
  onDelete: (index: number) => void;
  onClose: () => void;
}) {
  const [creating, setCreating] = useState(false);

  if (creating) {
    return (
      <CreateFontMapModal
        templateFonts={templateFonts}
        directoryFonts={directoryFonts}
        onClose={() => setCreating(false)}
        onSave={(map) => {
          onAdd(map);
          setCreating(false);
        }}
      />
    );
  }

  return (
    <Modal title="Font Maps" onClose={onClose} width={960}>
      <button
        type="button"
        className="cta_with_icon mint-bg"
        onClick={() => setCreating(true)}
      >
        <span>
          <i className="fa-solid fa-plus"></i>
        </span>
        <p>Create New Mapping</p>
      </button>

      <h4 className="ticket-form-title">Fonts Defined in Templates</h4>
      <div className="client-chips">
        {templateFonts.map((font) => (
          <span key={font} className="chip">
            {font}
          </span>
        ))}
      </div>

      <h4 className="ticket-form-title">Existing Font Maps</h4>
      <FontMapTable maps={maps} onDelete={onDelete} />
    </Modal>
  );
}
