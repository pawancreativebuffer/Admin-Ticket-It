"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

// popup with a checkbox list (legacy pages used Ctrl-click multi-selects):
// used for zonal fields and for the users of a group / department
export default function CheckListModal({
  title,
  subtitle,
  intro,
  hint,
  options,
  selected: initial,
  saveLabel,
  onSave,
  onClose,
  columns = 2,
}: {
  title: string;
  subtitle?: string;
  intro?: React.ReactNode;
  hint?: React.ReactNode;
  options: string[];
  selected: string[];
  saveLabel: string;
  onSave: (selected: string[]) => void;
  onClose: () => void;
  columns?: 1 | 2;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initial));

  const toggle = (option: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });

  return (
    <Modal title={title} onClose={onClose} width={760}>
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(options.filter((option) => selected.has(option)));
        }}
      >
        {subtitle && <h4 className="modal-subtitle">{subtitle}</h4>}
        {intro && <p className="modal-intro">{intro}</p>}

        <div className={`zonal-list${columns === 1 ? " one" : ""}`}>
          {options.map((option) => (
            <label key={option} className="check-row">
              <input
                type="checkbox"
                checked={selected.has(option)}
                onChange={() => toggle(option)}
              />
              <span>{option}</span>
            </label>
          ))}
          {options.length === 0 && <p className="muted">Nothing to select.</p>}
        </div>

        {hint && <p className="field-hint">{hint}</p>}

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
