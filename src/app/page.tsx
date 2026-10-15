"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import UploadPanel from "@/components/UploadPanel";
import ClientTabs from "@/components/ClientTabs";
import UserTable from "@/components/UserTable";
import { clients } from "@/data/clients";
import { headOffice, regionalManagers, franchisees } from "@/data/users";

const ROLE_TABS = [
  { key: "headOffice", label: "Head Office", users: headOffice },
  { key: "regionalManagers", label: "Regional Managers", users: regionalManagers },
  { key: "franchisees", label: "Franchisees", users: franchisees },
];

// admin Users page in the New-Frontend design, design only
export default function UsersPage() {
  const [activeClient, setActiveClient] = useState(clients[0]);
  const [activeTab, setActiveTab] = useState(ROLE_TABS[0].key);
  const currentTab = ROLE_TABS.find((tab) => tab.key === activeTab) ?? ROLE_TABS[0];

  return (
    <AdminShell>
      <div className="detail-page-topbar">
        <h2 className="subpage-title">User Administration</h2>
        <button type="button" className="cta_with_icon secondary-bg">
          <span>
            <i className="fa-solid fa-download"></i>
          </span>
          <p>Download Invoice</p>
        </button>
      </div>

      <main className="flex flex-col gap-4 p-4">
        <UploadPanel />

        <section className="report-section">
          <ClientTabs clients={clients} active={activeClient} onSelect={setActiveClient} />

          <div className="tabs-navigation">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={tab.key === activeTab ? "active" : undefined}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <UserTable
            key={currentTab.key}
            users={currentTab.users}
            showOwner={currentTab.key === "headOffice"}
          />
          <div className="paginations">
            <span>
              Rows per page
              <select defaultValue="10" aria-label="Rows per page">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </span>
            <span>
              1-{currentTab.users.length} of {currentTab.users.length}
            </span>
            <span>
              <button type="button" className="arrow" aria-label="Previous page">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button type="button" className="arrow" aria-label="Next page">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </span>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
