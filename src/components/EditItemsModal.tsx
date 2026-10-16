"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import FormField from "@/components/FormField";

export type Item = Record<string, string>;
export type ItemField = {
  key: string;
  label: string;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
};

// generic "Edit <client> <Things>" popup (legacy edit regions / departments pages):
// one bordered block per item with its fields and a delete, Add <Thing>, and Save <Things>.
// Saving hands the list back; items whose first field is empty are dropped.
export default function EditItemsModal({
  client,
  title,
  intro,
  noun,
  plural,
  fields,
  items: initial,
  onSave,
  onClose,
}: {
  client: string;
  // optional overrides: popup title and a note shown above the list
  title?: string;
  intro?: React.ReactNode;
  noun: string;
  plural: string;
  fields: ItemField[];
  items: Item[];
  onSave: (items: Item[]) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<Item[]>(initial);
  const primaryKey = fields[0].key;

  const update = (index: number, key: string, value: string) =>
    setItems((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    );
  const remove = (index: number) =>
    setItems((current) => current.filter((_, i) => i !== index));
  const add = () =>
    setItems((current) => [
      ...current,
      Object.fromEntries(
        fields.map((field) => [field.key, field.defaultValue ?? ""]),
      ),
    ]);

  return (
    <Modal title={title ?? `Edit ${client} ${plural}`} onClose={onClose}>
      {intro && <p className="modal-intro">{intro}</p>}
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(
            items.filter((item) => (item[primaryKey] ?? "").trim() !== ""),
          );
        }}
      >
        <div className="region-list">
          {items.map((item, index) => (
            <div key={index} className="region-block">
              <div className="region-head">
                <h4 className="sub-title">
                  {noun} {index + 1}
                </h4>
                <button
                  type="button"
                  className="fill-btn primary-bg"
                  title={`Delete ${noun.toLowerCase()}`}
                  onClick={() => remove(index)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
              <div
                className={`form-grid ${fields.length === 1 ? "one" : "two"}`}
              >
                {fields.map((field) => (
                  <FormField
                    key={`${field.key}-${index}`}
                    label={field.label}
                    name={`${field.key}-${index}`}
                    defaultValue={item[field.key]}
                    placeholder={field.placeholder}
                    type={field.type}
                    onChange={(value) => update(index, field.key, value)}
                  />
                ))}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="muted">
              No {plural.toLowerCase()} yet. Add the first one below.
            </p>
          )}
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
            <p>Add {noun}</p>
          </button>
          <button type="submit" className="cta_with_icon mint-bg">
            <span>
              <i className="fa-solid fa-check"></i>
            </span>
            <p>Save {plural}</p>
          </button>
        </div>
      </form>
    </Modal>
  );
}
