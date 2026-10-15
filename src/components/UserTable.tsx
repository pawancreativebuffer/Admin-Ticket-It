"use client";

import { useState } from "react";
import Link from "next/link";
import type { UserRow } from "@/data/users";
import { useToast } from "@/components/Toast";

const COLUMNS = ["Username", "Email Address", "Name", "Region", "Store Category", "Group"];

// user table in the New-Frontend UserTableData style; buttons do nothing,
// the invoicing switch only flips on screen.
// showOwner adds the Owner badge + Owner switch (head office tab only): exactly one owner per client,
// switching another user on transfers ownership to them (doc section 6 / US-017)
export default function UserTable({ users, showOwner = false }: { users: UserRow[]; showOwner?: boolean }) {
  const [invoicing, setInvoicing] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(users.map((user) => [user.username, user.invoicing]))
  );
  const [owner, setOwner] = useState(() => users.find((user) => user.isOwner)?.username ?? "");
  const toast = useToast();

  const makeOwner = (username: string) => {
    setOwner(username);
    toast(`${username} is now the Owner`);
  };

  const toggleInvoicing = (username: string) => {
    const next = !invoicing[username];
    setInvoicing((current) => ({ ...current, [username]: next }));
    toast(next ? `Invoicing enabled for ${username}` : `Invoicing disabled for ${username}`);
  };

  return (
    <div className="table-scroll">
      <table className="custom-table">
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column}>{column}</th>
            ))}
            <th>Actions</th>
            {showOwner && <th>Owner</th>}
            <th>Invoicing</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username}>
              <td>
                {user.username}
                {showOwner && user.username === owner && (
                  <span className="owner-badge">Owner</span>
                )}
              </td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.region}</td>
              <td>{user.storeCategory || "-"}</td>
              <td>{user.group || "-"}</td>
              <td>
                <div className="row-actions">
                  <Link
                    href={`/edit-user?user=${encodeURIComponent(user.username)}`}
                    className="fill-btn mint-bg"
                    title="Edit"
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </Link>
                  <button type="button" className="fill-btn secondary-bg" title="Log in">
                    <i className="fa-solid fa-right-to-bracket"></i>
                  </button>
                  <button type="button" className="fill-btn primary-bg" title="Delete">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
              {showOwner && (
                <td>
                  <label
                    className={`switch-cta${user.username === owner ? " disabled" : ""}`}
                    aria-label={`Make ${user.username} the owner`}
                    title={
                      user.username === owner
                        ? "Current owner. Switch another user on to transfer ownership"
                        : "Make this user the owner"
                    }
                  >
                    <input
                      type="checkbox"
                      checked={user.username === owner}
                      disabled={user.username === owner}
                      onChange={() => makeOwner(user.username)}
                    />
                    <span className="switch-check"></span>
                  </label>
                </td>
              )}
              <td>
                <label className="switch-cta" aria-label={`Invoicing for ${user.username}`}>
                  <input
                    type="checkbox"
                    checked={invoicing[user.username]}
                    onChange={() => toggleInvoicing(user.username)}
                  />
                  <span className="switch-check"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
