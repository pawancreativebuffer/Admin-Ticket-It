"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

export type StockAliases = {
  sku: string;
  quantity: string;
  userTag: string;
  location: string;
};
export type StockProfile = {
  name: string;
  active: boolean;
  created: string;
  aliases: StockAliases;
};

// CSV header alias fields of a profile, with the example shown under each field
const ALIAS_FIELDS: {
  key: keyof StockAliases;
  label: string;
  example: string;
}[] = [
  {
    key: "sku",
    label: "SKU Aliases",
    example: "SKU, Sku, Product Code",
  },
  {
    key: "quantity",
    label: "Quantity Aliases",
    example: "Quantity, Qty, QTY, Stock",
  },
  {
    key: "userTag",
    label: "User Tag Aliases",
    example: "UserTag, User, Tag",
  },
  {
    key: "location",
    label: "Location Aliases",
    example: "Location, Loc, Warehouse",
  },
];
const EMPTY_ALIASES: StockAliases = {
  sku: "",
  quantity: "",
  userTag: "",
  location: "",
};

// "Stock Mapping Profiles" popup: Create New plus the list of CSV mapping profiles.
// Create New opens the profile form: name, active flag and the CSV header aliases.
export function StockProfilesModal({
  profiles,
  onCreate,
  onClose,
}: {
  profiles: StockProfile[];
  onCreate: (profile: StockProfile) => void;
  onClose: () => void;
}) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [aliases, setAliases] = useState<StockAliases>(EMPTY_ALIASES);
  const reset = () => {
    setName("");
    setActive(true);
    setAliases(EMPTY_ALIASES);
    setCreating(false);
  };

  if (creating) {
    return (
      <Modal title="Create Stock Mapping Profile" onClose={reset} width={760}>
        <form
          className="stock-profile-form"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            const today = new Date();
            const created = `${String(today.getDate()).padStart(2, "0")}/${String(
              today.getMonth() + 1,
            ).padStart(2, "0")}/${today.getFullYear()}`;
            onCreate({ name: name.trim(), active, created, aliases });
            reset();
          }}
        >
          <div className="form-grid one">
            <div className="custom-field">
              <label className="field-label" htmlFor="stock-profile-name">
                Profile Name
              </label>
              <div className="field-type">
                <input
                  id="stock-profile-name"
                  type="text"
                  value={name}
                  autoFocus
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </div>
            <label className="check-row">
              <input
                type="checkbox"
                checked={active}
                onChange={() => setActive(!active)}
              />
              <span>Is Active</span>
            </label>
          </div>

          <h4 className="ticket-form-title">CSV Header Mapping</h4>
          <p className="modal-intro">
            Specify possible header names (comma or pipe separated) that should
            map to each field. Matching is case-insensitive and column order
            doesn&apos;t matter.
          </p>
          <div className="form-grid two">
            {ALIAS_FIELDS.map((field) => (
              <div key={field.key} className="custom-field">
                <label className="field-label" htmlFor={`alias-${field.key}`}>
                  {field.label}
                </label>
                <div className="field-type">
                  <input
                    id={`alias-${field.key}`}
                    type="text"
                    value={aliases[field.key]}
                    onChange={(event) =>
                      setAliases((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                  />
                </div>
                <p className="field-hint">Example: {field.example}</p>
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cta_with_icon secondary-bg"
              onClick={reset}
            >
              <span>
                <i className="fa-solid fa-arrow-left"></i>
              </span>
              <p>Back To List</p>
            </button>
            <button
              type="submit"
              className="cta_with_icon mint-bg"
              disabled={!name.trim()}
            >
              <span>
                <i className="fa-solid fa-check"></i>
              </span>
              <p>Create</p>
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  return (
    <Modal title="Stock Mapping Profiles" onClose={onClose} width={900}>
      <button
        type="button"
        className="cta_with_icon mint-bg"
        onClick={() => setCreating(true)}
      >
        <span>
          <i className="fa-solid fa-plus"></i>
        </span>
        <p>Create New</p>
      </button>
      <div className="table-scroll filter-table stock-table">
        <table className="custom-table compact">
          <thead>
            <tr>
              <th>Profile Name</th>
              <th>Is Active</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <tr key={`${profile.name}-${index}`}>
                <td>{profile.name}</td>
                <td>
                  <span
                    className={`chip type-chip ${profile.active ? "text" : "image"}`}
                  >
                    {profile.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{profile.created}</td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td colSpan={3} className="empty-row">
                  No stock mapping profiles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

export type StockRow = {
  sku: string;
  quantity: number;
  storeUser: string;
  location: string;
  updated: string;
};

const PAGE_SIZE = 10;

// "Stock On Hand" snapshot popup: find by SKU and location, results table with paging
export function StockSnapshotModal({
  rows,
  onClose,
}: {
  rows: StockRow[];
  onClose: () => void;
}) {
  const [sku, setSku] = useState("");
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState({ sku: "", location: "" });
  const [page, setPage] = useState(1);

  const results = rows.filter(
    (row) =>
      row.sku.toLowerCase().includes(query.sku.trim().toLowerCase()) &&
      row.location.toLowerCase().includes(query.location.trim().toLowerCase()),
  );
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <Modal title="Stock On Hand" onClose={onClose} width={1000}>
      <form
        className="filter-grid"
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          setQuery({ sku, location });
          setPage(1);
        }}
      >
        <div className="custom-field">
          <label className="field-label" htmlFor="stock-sku">
            Find by SKU
          </label>
          <div className="field-type">
            <input
              id="stock-sku"
              type="text"
              value={sku}
              placeholder="SKU"
              onChange={(event) => setSku(event.target.value)}
            />
          </div>
        </div>
        <div className="custom-field">
          <label className="field-label" htmlFor="stock-location">
            Location
          </label>
          <div className="field-type">
            <input
              id="stock-location"
              type="text"
              value={location}
              placeholder="Location"
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
        </div>
        <div className="custom-field filter-submit">
          <button type="submit" className="cta_with_icon mint-bg">
            <span>
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <p>Search</p>
          </button>
        </div>
      </form>

      <div className="table-scroll filter-table stock-table">
        <table className="custom-table compact">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Store User ID</th>
              <th>Location</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row, index) => (
              <tr key={`${row.sku}-${row.storeUser}-${index}`}>
                <td>{row.sku}</td>
                <td>{row.quantity}</td>
                <td>{row.storeUser}</td>
                <td>{row.location}</td>
                <td>{row.updated}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-row">
                  No stock found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="paginations">
        <span>
          Page {results.length === 0 ? 0 : current} of{" "}
          {results.length === 0 ? 0 : pageCount}
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
    </Modal>
  );
}
