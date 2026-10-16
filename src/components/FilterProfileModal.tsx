"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

export type FilterRule = {
  field: string;
  value: string;
  exact: boolean;
  include: boolean;
};
export type FilterProfile = { name: string; rules: FilterRule[] };

export const FILTER_FIELDS = [
  "SKU",
  "Product Description",
  "Promo Price",
  "Normal Price",
  "RRP",
];

// small "Save filter" popup that only asks for a name (also used for Rename)
export function FilterNameModal({
  title,
  initial,
  onSave,
  onClose,
}: {
  title: string;
  initial: string;
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial);
  return (
    <Modal title={title} onClose={onClose} width={520}>
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim()) onSave(name.trim());
        }}
      >
        <div className="custom-field">
          <label className="field-label" htmlFor="filter-name">
            Filter Name
          </label>
          <div className="field-type">
            <input
              id="filter-name"
              type="text"
              value={name}
              placeholder="e.g. Final"
              autoFocus
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </div>
        <div className="modal-actions end">
          <button
            type="submit"
            className="cta_with_icon mint-bg"
            disabled={!name.trim()}
          >
            <span>
              <i className="fa-solid fa-check"></i>
            </span>
            <p>Save</p>
          </button>
        </div>
      </form>
    </Modal>
  );
}

// filter rules popup (legacy "All Saved filters"): pick a field + text, Add Filter, then each rule
// has Exact? and Include / Exclude; Save Filter asks for a name in a second small popup
export default function FilterProfileModal({
  profile,
  onSave,
  onClose,
}: {
  profile?: FilterProfile;
  onSave: (profile: FilterProfile) => void;
  onClose: () => void;
}) {
  const [rules, setRules] = useState<FilterRule[]>(profile?.rules ?? []);
  const [field, setField] = useState(FILTER_FIELDS[0]);
  const [text, setText] = useState("");
  const [naming, setNaming] = useState(false);

  const addRule = () => {
    if (!text.trim()) return;
    setRules((current) => [
      ...current,
      { field, value: text.trim(), exact: false, include: true },
    ]);
    setText("");
  };
  const update = (index: number, patch: Partial<FilterRule>) =>
    setRules((current) =>
      current.map((rule, i) => (i === index ? { ...rule, ...patch } : rule)),
    );

  if (naming) {
    return (
      <FilterNameModal
        title="Save Filter"
        initial={profile?.name ?? ""}
        onClose={() => setNaming(false)}
        onSave={(name) => onSave({ name, rules })}
      />
    );
  }

  return (
    <Modal
      title={profile ? `Edit Filter: ${profile.name}` : "Create Filter Profile"}
      onClose={onClose}
      width={960}
    >
      <div className="filter-add-row">
        <div className="custom-field">
          <label className="field-label" htmlFor="filter-field">
            Field
          </label>
          <div className="field-type field-stype-select">
            <select
              id="filter-field"
              value={field}
              onChange={(event) => setField(event.target.value)}
            >
              {FILTER_FIELDS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
        </div>
        <div className="custom-field">
          <label className="field-label" htmlFor="filter-text">
            Filter Text
          </label>
          <div className="field-type">
            <input
              id="filter-text"
              type="text"
              value={text}
              placeholder="Filter text"
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addRule();
                }
              }}
            />
          </div>
        </div>
        <button
          type="button"
          className="cta_with_icon secondary-bg"
          disabled={!text.trim()}
          onClick={addRule}
        >
          <span>
            <i className="fa-solid fa-plus"></i>
          </span>
          <p>Add Filter</p>
        </button>
      </div>

      <div className="table-scroll filter-table">
        <table className="custom-table compact">
          <thead>
            <tr>
              <th>Field</th>
              <th>Filter Value</th>
              <th>Exact?</th>
              <th>Include / Exclude</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, index) => (
              <tr key={index}>
                <td>{rule.field}</td>
                <td>{rule.value}</td>
                <td>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={rule.exact}
                      aria-label="Exact match"
                      onChange={() => update(index, { exact: !rule.exact })}
                    />
                  </label>
                </td>
                <td>
                  <button
                    type="button"
                    className={`pill-toggle ${rule.include ? "include" : "exclude"}`}
                    onClick={() => update(index, { include: !rule.include })}
                  >
                    {rule.include ? "Include" : "Exclude"}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="fill-btn primary-bg has-tip"
                    data-tip="Delete"
                    aria-label="Delete"
                    onClick={() =>
                      setRules((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-row">
                  No filters yet. Pick a field, type a value and press Add
                  Filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="modal-actions end">
        <button
          type="button"
          className="cta_with_icon mint-bg"
          disabled={rules.length === 0}
          onClick={() => setNaming(true)}
        >
          <span>
            <i className="fa-solid fa-check"></i>
          </span>
          <p>Save Filter</p>
        </button>
      </div>
    </Modal>
  );
}
