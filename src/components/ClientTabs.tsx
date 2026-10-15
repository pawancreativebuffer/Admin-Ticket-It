"use client";

import { useState } from "react";

const LETTERS = ["0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

// first letter of a client name as a tab key; digits fall under "0-9"
function letterOf(client: string) {
  const first = client.charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "0-9";
}

// A-Z tabs: click a letter to list the clients starting with it, then click a client to select it (design only)
export default function ClientTabs({
  clients,
  active,
  onSelect,
}: {
  clients: string[];
  active: string;
  onSelect: (client: string) => void;
}) {
  const [letter, setLetter] = useState(() => letterOf(active));

  const counts = clients.reduce<Record<string, number>>((acc, client) => {
    const key = letterOf(client);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const visible = clients.filter((client) => letterOf(client) === letter);

  return (
    <div className="client-picker">
      <div className="card-head">
        <h4>Select Client</h4>
        <span className="client-count">
          Selected: <strong>{active}</strong>
        </span>
      </div>

      <div className="letter-tabs">
        {LETTERS.map((key) => (
          <button
            key={key}
            type="button"
            className={key === letter ? "active" : undefined}
            disabled={!counts[key]}
            onClick={() => setLetter(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="client-chips">
        {visible.map((client) => (
          <button
            key={client}
            type="button"
            className={client === active ? "active" : undefined}
            onClick={() => onSelect(client)}
          >
            {client}
          </button>
        ))}
      </div>
    </div>
  );
}
