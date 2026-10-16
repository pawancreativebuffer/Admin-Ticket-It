"use client";

import { useRef, useState } from "react";
import Modal from "@/components/Modal";

type Drag = { from: "data" | "view"; field: string };

// "Ticket Mapping for <client>" popup (legacy Edit Fields page): copy the mapping of another
// ticket, or drag data fields into the view list, drag inside it to reorder, drag out to remove
export default function TicketMappingModal({
  client,
  ticket,
  title,
  viewName,
  fields,
  dataFields,
  otherTickets,
  mappingOf,
  onSave,
  onClose,
}: {
  client: string;
  ticket: string;
  title?: string;
  viewName: string;
  fields: string[];
  dataFields: string[];
  otherTickets: string[];
  mappingOf: (ticket: string) => string[];
  onSave: (fields: string[]) => void;
  onClose: () => void;
}) {
  const [view, setView] = useState<string[]>(fields);
  const [copyFrom, setCopyFrom] = useState(otherTickets[0] ?? "");
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const drag = useRef<Drag | null>(null);

  // put a field at a position in the view list (moving it if it is already there)
  const placeAt = (field: string, index: number) =>
    setView((current) => {
      const without = current.filter((f) => f !== field);
      const oldIndex = current.indexOf(field);
      const target = oldIndex !== -1 && oldIndex < index ? index - 1 : index;
      without.splice(Math.max(0, Math.min(target, without.length)), 0, field);
      return without;
    });
  const removeField = (field: string) =>
    setView((current) => current.filter((f) => f !== field));

  const dropOnView = (index: number) => {
    if (drag.current) placeAt(drag.current.field, index);
    drag.current = null;
    setOverIndex(null);
  };

  return (
    <Modal
      title={title ?? `Ticket Mapping for ${client}: ${ticket} (${viewName})`}
      onClose={onClose}
      width={1100}
    >
      <h4 className="ticket-form-title first">
        Copy from existing ticket mappings
      </h4>
      <div className="filter-add-row copy-row">
        <div className="custom-field">
          <label className="field-label" htmlFor="copy-from">
            Copy from existing
          </label>
          <div className="field-type field-stype-select">
            <select
              id="copy-from"
              value={copyFrom}
              onChange={(event) => setCopyFrom(event.target.value)}
            >
              {otherTickets.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
        </div>
        <button
          type="button"
          className="cta_with_icon secondary-bg"
          disabled={!copyFrom}
          onClick={() => setView(mappingOf(copyFrom))}
        >
          <span>
            <i className="fa-solid fa-copy"></i>
          </span>
          <p>Start Copy</p>
        </button>
      </div>

      <h4 className="ticket-form-title">Set up fields manually</h4>
      <ul className="mapping-help">
        <li>
          Drag the fields you want in the view from the Data Fields list on the
          right.
        </li>
        <li>Drag fields up and down to reorder them.</li>
        <li>Drag a field out of the list to remove it from the view.</li>
      </ul>

      <div className="mapping-cols">
        <div>
          <span className="field-label mapping-label">{viewName}</span>
          <div
            className={`mapping-view${overIndex !== null ? " over" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              if (overIndex === null) setOverIndex(view.length);
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node))
                setOverIndex(null);
            }}
            onDrop={(event) => {
              event.preventDefault();
              dropOnView(overIndex ?? view.length);
            }}
          >
            {view.map((field, index) => (
              <div
                key={field}
                className={`mapping-item${overIndex === index ? " drop-before" : ""}`}
                draggable
                onDragStart={(event) => {
                  drag.current = { from: "view", field };
                  event.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setOverIndex(index);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  dropOnView(index);
                }}
                onDragEnd={(event) => {
                  // dropped outside the view list: take it out of the view
                  if (
                    event.dataTransfer.dropEffect === "none" &&
                    drag.current
                  ) {
                    removeField(drag.current.field);
                  }
                  drag.current = null;
                  setOverIndex(null);
                }}
              >
                <i className="fa-solid fa-grip-vertical"></i>
                <span>{field}</span>
              </div>
            ))}
            {view.length === 0 && (
              <p className="muted mapping-empty">Drop data fields here.</p>
            )}
          </div>
        </div>

        <div>
          <span className="field-label mapping-label">Data Fields</span>
          <div
            className="mapping-data"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (drag.current?.from === "view")
                removeField(drag.current.field);
              drag.current = null;
              setOverIndex(null);
            }}
          >
            {dataFields.map((field) => (
              <span
                key={field}
                className={`chip mapping-chip${view.includes(field) ? " used" : ""}`}
                draggable
                onDragStart={(event) => {
                  drag.current = { from: "data", field };
                  event.dataTransfer.effectAllowed = "copyMove";
                }}
                onDragEnd={() => {
                  drag.current = null;
                  setOverIndex(null);
                }}
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="modal-actions end">
        <button
          type="button"
          className="cta_with_icon mint-bg"
          onClick={() => onSave(view)}
        >
          <span>
            <i className="fa-solid fa-check"></i>
          </span>
          <p>Save Mapping</p>
        </button>
      </div>
    </Modal>
  );
}
