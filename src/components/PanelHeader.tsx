"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// pink portal header from New-Frontend (home icon, white logo, user info + logo, settings dropdown, logout)
export default function PanelHeader() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // close the settings menu when clicking anywhere else
  useEffect(() => {
    if (!settingsOpen) return;
    const close = (event: MouseEvent) => {
      if (!settingsRef.current?.contains(event.target as Node)) setSettingsOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [settingsOpen]);

  return (
    <header className="panel-header">
      <div>
        <a href="#" className="home-icon" aria-label="Home">
          <i className="fa-solid fa-house"></i>
        </a>
      </div>

      <div className="center-header">
        <img src="/h-logo.png" alt="Ticket-IT" />
      </div>

      <div className="right-header">
        <div className="client-logo">
          <div className="client-info">
            <p>Ticket-IT</p>
            <span>Admin</span>
          </div>
          <div className="client-img">
            <img src="/logo.png" alt="Client logo" />
          </div>
        </div>

        <div className="settings" ref={settingsRef}>
          <button
            type="button"
            className="header-btn"
            aria-label="Settings"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((open) => !open)}
          >
            <i className="fa-solid fa-gear"></i>
          </button>
          {settingsOpen && (
            <div className="all-settings">
              <Link href="/your-account" onClick={() => setSettingsOpen(false)}>
                <span>
                  <i className="fa-solid fa-user"></i>
                </span>
                Your Account
              </Link>
            </div>
          )}
        </div>

        <button type="button" className="header-btn" aria-label="Logout">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </header>
  );
}
