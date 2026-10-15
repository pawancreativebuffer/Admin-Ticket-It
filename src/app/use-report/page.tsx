"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import FormField from "@/components/FormField";
import { clients } from "@/data/clients";
import { sessions } from "@/data/sessions";

const COLUMNS = [
  "User",
  "Address",
  "Client",
  "Region",
  "Session Start",
  "Session Ended",
  "Adhoc Created",
  "Adhoc Modified",
  "Adhoc Printed",
  "Your Account Viewed",
  "Batch Viewed",
  "Batch Printed",
  "Batch Modified",
];

const PAGE_SIZE = 10;

// Session Usage Report in the New-Frontend design; the client filter and paging work on the dummy rows,
// the date range is design only
export default function UseReportPage() {
  const [client, setClient] = useState("ALL");
  const [page, setPage] = useState(1);

  const rows = client === "ALL" ? sessions : sessions.filter((row) => row.client === client);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const from = rows.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
  const to = Math.min(current * PAGE_SIZE, rows.length);

  return (
    <AdminShell>
      <div className="detail-page-topbar">
        <h2 className="subpage-title">Session Usage Report</h2>
        <button type="button" className="cta_with_icon secondary-bg">
          <span>
            <i className="fa-solid fa-download"></i>
          </span>
          <p>Export Report</p>
        </button>
      </div>

      <main className="flex flex-col gap-4 p-4">
        <section className="report-filters">
          <form
            className="form-grid filter-grid"
            autoComplete="off"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
            }}
          >
            <div className="custom-field">
              <label className="field-label" htmlFor="client">
                Client
              </label>
              <div className="field-type field-stype-select">
                <select id="client" name="client" value={client} onChange={(e) => setClient(e.target.value)}>
                  <option value="ALL">ALL</option>
                  {clients.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
            <FormField label="From" name="from" type="date" defaultValue="2026-10-08" />
            <FormField label="To" name="to" type="date" defaultValue="2026-10-15" />
            <div className="custom-field filter-submit">
              <button type="submit" className="cta_with_icon mint-bg">
                <span>
                  <i className="fa-solid fa-check"></i>
                </span>
                <p>Submit</p>
              </button>
            </div>
          </form>
        </section>

        <section className="report-section">
          <div className="table-scroll">
            <table className="custom-table report-table">
              <thead>
                <tr>
                  {COLUMNS.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((row, index) => (
                  <tr key={`${row.user}-${row.start}-${index}`}>
                    <td>{row.user}</td>
                    <td>{row.address}</td>
                    <td>{row.client}</td>
                    <td>{row.region}</td>
                    <td>{row.start}</td>
                    <td>{row.end}</td>
                    <td className="num">{row.adhocCreated}</td>
                    <td className="num">{row.adhocModified}</td>
                    <td className="num">{row.adhocPrinted}</td>
                    <td className="num">{row.accountViewed}</td>
                    <td className="num">{row.batchViewed}</td>
                    <td className="num">{row.batchPrinted}</td>
                    <td className="num">{row.batchModified}</td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={COLUMNS.length} className="empty-row">
                      No sessions found for this client
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
