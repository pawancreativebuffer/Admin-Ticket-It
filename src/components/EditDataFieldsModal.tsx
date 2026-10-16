"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

export type DataField = {
  name: string;
  type: string;
  hideWhenPrinting: boolean;
  nonEditableInAdhoc: boolean;
};
export type KeyFields = { name: string; id: string; price: string };

export const DATA_TYPES = [
  "Text",
  "MultilineText",
  "Date",
  "List",
  "JSON",
  "Generated",
  "JSONMultiline",
  "DropDown",
];

// "Edit <client> Data Fields" popup: the three key field pickers, every data field as a row
// that expands to its settings, Add Field for a new one, and Save Data Fields
export default function EditDataFieldsModal({
  client,
  fields: initial,
  keyFields: initialKeys,
  onSave,
  onClose,
}: {
  client: string;
  fields: DataField[];
  keyFields: KeyFields;
  onSave: (fields: DataField[], keyFields: KeyFields) => void;
  onClose: () => void;
}) {
  const [fields, setFields] = useState<DataField[]>(initial);
  const [keys, setKeys] = useState<KeyFields>(initialKeys);
  const [open, setOpen] = useState<Set<number>>(new Set());

  const names = fields.map((field) => field.name).filter((name) => name.trim());

  const update = (index: number, patch: Partial<DataField>) =>
    setFields((current) =>
      current.map((field, i) => (i === index ? { ...field, ...patch } : field)),
    );
  const toggleOpen = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  const remove = (index: number) => {
    setFields((current) => current.filter((_, i) => i !== index));
    // keep the expanded rows pointing at the same fields after the removal
    setOpen(
      (current) =>
        new Set(
          [...current]
            .filter((i) => i !== index)
            .map((i) => (i > index ? i - 1 : i)),
        ),
    );
  };
  const add = () => {
    setFields((current) => [
      ...current,
      {
        name: "",
        type: "Text",
        hideWhenPrinting: false,
        nonEditableInAdhoc: false,
      },
    ]);
    setOpen((current) => new Set([...current, fields.length]));
  };

  const keySelect = (id: keyof KeyFields, label: string) => (
    <div className="custom-field">
      <label className="field-label" htmlFor={`key-${id}`}>
        {label}
      </label>
      <div className="field-type field-stype-select">
        <select
          id={`key-${id}`}
          value={keys[id]}
          onChange={(event) =>
            setKeys((current) => ({ ...current, [id]: event.target.value }))
          }
        >
          {names.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down"></i>
      </div>
    </div>
  );

  return (
    <Modal title={`Edit ${client} Data Fields`} onClose={onClose} width={1100}>
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(
            fields.filter((field) => field.name.trim() !== ""),
            keys,
          );
        }}
      >
        <div className="form-grid three">
          {keySelect("name", "Product Name Field")}
          {keySelect("id", "Product ID Field")}
          {keySelect("price", "Product Price Field")}
        </div>

        <div className="data-field-list">
          {fields.map((field, index) => {
            const expanded = open.has(index);
            return (
              <div
                key={index}
                className={`data-field${expanded ? " open" : ""}`}
              >
                <div
                  className="data-field-head"
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleOpen(index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleOpen(index);
                    }
                  }}
                >
                  <strong>{field.name || "New data field"}</strong>
                  <span className="data-field-meta">
                    <span className="chip">{field.type}</span>
                    {field.hideWhenPrinting && (
                      <span className="chip">Hidden on print</span>
                    )}
                    {field.nonEditableInAdhoc && (
                      <span className="chip">Locked in Adhoc</span>
                    )}
                    <i
                      className={`fa-solid fa-chevron-${expanded ? "up" : "down"} accordion-caret`}
                    ></i>
                  </span>
                </div>

                {expanded && (
                  <div className="data-field-body">
                    <div className="form-grid two">
                      <div className="custom-field">
                        <label
                          className="field-label"
                          htmlFor={`df-name-${index}`}
                        >
                          Name
                        </label>
                        <div className="field-type">
                          <input
                            id={`df-name-${index}`}
                            type="text"
                            value={field.name}
                            placeholder="Field name"
                            onChange={(event) =>
                              update(index, { name: event.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="custom-field">
                        <label
                          className="field-label"
                          htmlFor={`df-type-${index}`}
                        >
                          Data Type
                        </label>
                        <div className="field-type field-stype-select">
                          <select
                            id={`df-type-${index}`}
                            value={field.type}
                            onChange={(event) =>
                              update(index, { type: event.target.value })
                            }
                          >
                            {DATA_TYPES.map((type) => (
                              <option key={type}>{type}</option>
                            ))}
                          </select>
                          <i className="fa-solid fa-chevron-down"></i>
                        </div>
                      </div>
                    </div>
                    <div className="data-field-foot">
                      <div className="data-field-checks">
                        <label className="check-row">
                          <input
                            type="checkbox"
                            checked={field.hideWhenPrinting}
                            onChange={() =>
                              update(index, {
                                hideWhenPrinting: !field.hideWhenPrinting,
                              })
                            }
                          />
                          <span>Hide this field when printing?</span>
                        </label>
                        <label className="check-row">
                          <input
                            type="checkbox"
                            checked={field.nonEditableInAdhoc}
                            onChange={() =>
                              update(index, {
                                nonEditableInAdhoc: !field.nonEditableInAdhoc,
                              })
                            }
                          />
                          <span>Make this field non-editable in Adhoc?</span>
                        </label>
                      </div>
                      <button
                        type="button"
                        className="fill-btn primary-bg has-tip"
                        data-tip="Delete Field"
                        aria-label="Delete Field"
                        onClick={() => remove(index)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="cta_with_icon secondary-bg"
            onClick={add}
          >
            <span>
              <i className="fa-solid fa-plus"></i>
            </span>
            <p>Add Field</p>
          </button>
          <button type="submit" className="cta_with_icon mint-bg">
            <span>
              <i className="fa-solid fa-check"></i>
            </span>
            <p>Save Data Fields</p>
          </button>
        </div>
      </form>
    </Modal>
  );
}
