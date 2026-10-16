"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

// "Edit <client> Zones" popup from the legacy page: one field with comma separated zone names
export default function EditZonesModal({
  client,
  zones: initial,
  onSave,
  onClose,
}: {
  client: string;
  zones: string[];
  onSave: (zones: string[]) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(initial.join(","));

  return (
    <Modal title={`Edit ${client} Zones`} onClose={onClose} width={600}>
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(
            value
              .split(",")
              .map((zone) => zone.trim())
              .filter((zone) => zone !== ""),
          );
        }}
      >
        <div className="custom-field">
          <label className="field-label" htmlFor="zone-names">
            Zone Names
          </label>
          <div className="field-type">
            <input
              id="zone-names"
              name="zone-names"
              type="text"
              value={value}
              placeholder="zone1,zone2,zone3"
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
          <p className="field-hint">
            Please enter each zone followed by a comma, EG:
            zone1,zone2,zone3,etc
          </p>
        </div>

        <div className="modal-actions end">
          <button type="submit" className="cta_with_icon mint-bg">
            <span>
              <i className="fa-solid fa-check"></i>
            </span>
            <p>Save Zones</p>
          </button>
        </div>
      </form>
    </Modal>
  );
}
