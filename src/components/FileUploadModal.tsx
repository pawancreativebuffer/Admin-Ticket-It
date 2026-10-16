"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

export type UploadSlot = {
  key: string;
  label: string;
  accept: string;
  hint: string;
};

// popup with one or more file slots (same slim drop row as elsewhere) and a submit button.
// requireAll: every slot needs a file; otherwise one picked file is enough (optional uploads)
export default function FileUploadModal({
  title,
  intro,
  slots,
  submitLabel,
  submitIcon = "fa-upload",
  requireAll = true,
  onSubmit,
  onClose,
}: {
  title: string;
  intro?: string;
  slots: UploadSlot[];
  submitLabel: string;
  submitIcon?: string;
  requireAll?: boolean;
  onSubmit: (files: Record<string, string>) => void;
  onClose: () => void;
}) {
  const [files, setFiles] = useState<Record<string, string>>({});
  const picked = slots.filter((slot) => files[slot.key]);
  const ready = requireAll ? picked.length === slots.length : picked.length > 0;

  return (
    <Modal title={title} onClose={onClose} width={680}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (ready) onSubmit(files);
        }}
      >
        {intro && <p className="modal-intro upload-intro">{intro}</p>}
        <div className="upload-slots">
          {slots.map((slot) => (
            <div key={slot.key} className="custom-field">
              <span className="field-label">{slot.label}</span>
              <div className="drop-row">
                <div className="drop-info">
                  <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
                  <div>
                    <span className="upload-label">Drag &amp; Drop File</span>
                    <span className="upload-hint">
                      {files[slot.key] || "No file selected"}
                    </span>
                  </div>
                </div>
                <div className="drop-actions">
                  <label className="blank_cta" htmlFor={`upload-${slot.key}`}>
                    <input
                      id={`upload-${slot.key}`}
                      type="file"
                      accept={slot.accept}
                      onChange={(event) => {
                        const name = event.target.files?.[0]?.name ?? "";
                        setFiles((current) => ({
                          ...current,
                          [slot.key]: name,
                        }));
                      }}
                    />
                    Browse File
                  </label>
                </div>
              </div>
              <p className="field-hint">{slot.hint}</p>
            </div>
          ))}
        </div>

        <div className="modal-actions end upload-actions">
          <button
            type="submit"
            className="cta_with_icon mint-bg"
            disabled={!ready}
          >
            <span>
              <i className={`fa-solid ${submitIcon}`}></i>
            </span>
            <p>{submitLabel}</p>
          </button>
        </div>
      </form>
    </Modal>
  );
}
