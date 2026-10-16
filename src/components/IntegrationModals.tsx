"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

export const POS_INTEGRATIONS = [
  "RetailExpress",
  "Vend",
  "Shopfront",
  "Countr",
  "Dear",
  "Netsuite",
  "EziManager",
  "Worldsmart",
  "EzyVet",
  "Shopify",
  "SwiftPOS",
];

// "Edit Master Integration" popup: pick the client's POS, connect, then mapping / re-sync / sync
export function MasterIntegrationModal({
  client,
  pos: initialPos,
  connected: initialConnected,
  onChange,
  onAction,
  onClose,
}: {
  client: string;
  pos: string;
  connected: boolean;
  onChange: (pos: string, connected: boolean) => void;
  onAction: (action: string) => void;
  onClose: () => void;
}) {
  const [pos, setPos] = useState(initialPos);
  const [connected, setConnected] = useState(initialConnected);
  const ready = pos !== "" && connected;

  return (
    <Modal
      title={`Edit ${client} Master Integration`}
      onClose={onClose}
      width={720}
    >
      <div className="integration-block">
        <div className="custom-field">
          <label className="field-label" htmlFor="master-pos">
            Select POS Integration
          </label>
          <div className="field-type field-stype-select">
            <select
              id="master-pos"
              value={pos}
              onChange={(event) => {
                setPos(event.target.value);
                setConnected(false);
                onChange(event.target.value, false);
              }}
            >
              <option value="">Empty</option>
              {POS_INTEGRATIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
        </div>
      </div>

      <div className="integration-block">
        <div className="integration-status">
          <span className={`status-dot${connected ? " on" : ""}`}></span>
          {pos === ""
            ? "No POS selected"
            : connected
              ? `Connected to ${pos}`
              : `Not connected to ${pos}`}
        </div>
        <button
          type="button"
          className="cta_with_icon mint-bg"
          disabled={pos === "" || connected}
          onClick={() => {
            setConnected(true);
            onChange(pos, true);
            onAction(`Connected to ${pos}`);
          }}
        >
          <span>
            <i className="fa-solid fa-plug"></i>
          </span>
          <p>Connect To POS</p>
        </button>
      </div>

      <div className="integration-block">
        <div className="section-actions flush">
          <button
            type="button"
            className="cta_with_icon secondary-bg"
            disabled={!ready}
            onClick={() => onAction("Data fields mapping (design only)")}
          >
            <span>
              <i className="fa-solid fa-list"></i>
            </span>
            <p>Data Fields Mapping</p>
          </button>
          <button
            type="button"
            className="cta_with_icon secondary-bg"
            disabled={!ready}
            onClick={() =>
              onAction("Full update re-sync started (design only)")
            }
          >
            <span>
              <i className="fa-solid fa-rotate"></i>
            </span>
            <p>Full Update Re-Sync</p>
          </button>
          <button
            type="button"
            className="cta_with_icon mint-bg"
            disabled={!ready}
            onClick={() => onAction("Sync started (design only)")}
          >
            <span>
              <i className="fa-solid fa-arrows-rotate"></i>
            </span>
            <p>Sync</p>
          </button>
        </div>
      </div>
    </Modal>
  );
}

export type StoreIntegration = {
  username: string;
  pos: string;
  enabled: boolean;
};

// "User Specific POS selection" popup: each store user can use the master POS or its own,
// pencil to change it, switch to turn the store specific integration on or off
export function StoreIntegrationModal({
  rows: initial,
  onSave,
  onClose,
}: {
  rows: StoreIntegration[];
  onSave: (rows: StoreIntegration[]) => void;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<StoreIntegration[]>(initial);
  const [editing, setEditing] = useState<string | null>(null);

  const update = (username: string, patch: Partial<StoreIntegration>) =>
    setRows((current) =>
      current.map((row) =>
        row.username === username ? { ...row, ...patch } : row,
      ),
    );

  return (
    <Modal title="User Specific POS Selection" onClose={onClose} width={900}>
      <div className="table-scroll filter-table">
        <table className="custom-table compact">
          <thead>
            <tr>
              <th>Username</th>
              <th>POS Selector</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.username}>
                <td>{row.username}</td>
                <td>
                  {editing === row.username ? (
                    <div className="field-type field-stype-select inline-select">
                      <select
                        value={row.pos}
                        aria-label={`POS for ${row.username}`}
                        autoFocus
                        onChange={(event) => {
                          update(row.username, { pos: event.target.value });
                          setEditing(null);
                        }}
                        onBlur={() => setEditing(null)}
                      >
                        <option>Master</option>
                        {POS_INTEGRATIONS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>
                  ) : (
                    row.pos
                  )}
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="fill-btn secondary-bg has-tip"
                      data-tip="Change POS"
                      aria-label="Change POS"
                      onClick={() => setEditing(row.username)}
                    >
                      <i className="fa-solid fa-pencil"></i>
                    </button>
                    <label
                      className="switch-cta tool-switch"
                      aria-label={`Store specific integration for ${row.username}`}
                    >
                      <input
                        type="checkbox"
                        checked={row.enabled}
                        onChange={() =>
                          update(row.username, { enabled: !row.enabled })
                        }
                      />
                      <span className="switch-check"></span>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="modal-actions end">
        <button
          type="button"
          className="cta_with_icon mint-bg"
          onClick={() => onSave(rows)}
        >
          <span>
            <i className="fa-solid fa-check"></i>
          </span>
          <p>Save</p>
        </button>
      </div>
    </Modal>
  );
}
