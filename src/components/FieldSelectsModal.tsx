"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

// popup with a fixed number of dropdowns, each picking one data field ("" = Empty);
// used for core product name fields (2) and core search fields (5)
export default function FieldSelectsModal({
  title,
  labels,
  values,
  options,
  saveLabel,
  onSave,
  onClose,
}: {
  title: string;
  labels: string[];
  values: string[];
  options: string[];
  saveLabel: string;
  onSave: (values: string[]) => void;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState<string[]>(
    labels.map((_, i) => values[i] ?? ""),
  );

  return (
    <Modal title={title} onClose={onClose} width={600}>
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(current);
        }}
      >
        <div className="form-grid one">
          {labels.map((label, index) => (
            <div key={label} className="custom-field">
              <label className="field-label" htmlFor={`field-select-${index}`}>
                {label}
              </label>
              <div className="field-type field-stype-select">
                <select
                  id={`field-select-${index}`}
                  value={current[index]}
                  onChange={(event) =>
                    setCurrent((prev) =>
                      prev.map((v, i) =>
                        i === index ? event.target.value : v,
                      ),
                    )
                  }
                >
                  <option value="">Empty</option>
                  {options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-actions end">
          <button type="submit" className="cta_with_icon mint-bg">
            <span>
              <i className="fa-solid fa-check"></i>
            </span>
            <p>{saveLabel}</p>
          </button>
        </div>
      </form>
    </Modal>
  );
}
