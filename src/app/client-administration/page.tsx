"use client";

import { useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { clientSummaries } from "@/data/clientSummaries";

const PAGE_SIZE = 10;

// Client Administration: client list with Create / Edit / Delete in the New-Frontend design (design only)
export default function ClientAdministrationPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const rows = clientSummaries.filter((client) =>
    client.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const from = rows.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
  const to = Math.min(current * PAGE_SIZE, rows.length);

  return (
    <AdminShell>
      <div className="detail-page-topbar">
        <h2 className="subpage-title">Client Administration</h2>
        <button type="button" className="cta_with_icon mint-bg">
          <span>
            <i className="fa-solid fa-plus"></i>
          </span>
          <p>Create Client</p>
        </button>
      </div>

      <main className="flex flex-col gap-4 p-4">
        <section className="report-filters">
          <div className="search-field">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              value={query}
              placeholder="Search client..."
              aria-label="Search client"
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
        </section>

        <section className="report-section">
          <div className="table-scroll">
            <table className="custom-table clients-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Owner</th>
                  <th>Owner Email</th>
                  <th>Head Office</th>
                  <th>Regional Managers</th>
                  <th>Franchisees</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((client) => (
                  <tr key={client.name}>
                    <td>{client.name}</td>
                    <td>{client.ownerName}</td>
                    <td>{client.ownerEmail}</td>
                    <td>{client.headOffice}</td>
                    <td>{client.regionalManagers}</td>
                    <td>{client.franchisees}</td>
                    <td>
                      <div className="row-actions">
                        <Link
                          href={`/client-administration/edit?client=${encodeURIComponent(client.name)}`}
                          className="fill-btn mint-bg"
                          title="Edit"
                        >
                          <i className="fa-solid fa-pencil"></i>
                        </Link>
                        <button type="button" className="fill-btn primary-bg" title="Delete">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={7} className="empty-row">
                      No client found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="paginations">
            <span>
              Rows per page
              <select defaultValue={String(PAGE_SIZE)} aria-label="Rows per page">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </span>
            <span>
              {from}-{to} of {rows.length}
            </span>
            <span>
              <button
                type="button"
                className="arrow"
                aria-label="Previous page"
                disabled={current <= 1}
                onClick={() => setPage(current - 1)}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                type="button"
                className="arrow"
                aria-label="Next page"
                disabled={current >= pageCount}
                onClick={() => setPage(current + 1)}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </span>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
