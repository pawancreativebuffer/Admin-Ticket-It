"use client";

import { useEffect } from "react";

// popup in the New-Frontend popup-area style: blurred white backdrop, dark title bar with close icon, white body
export default function Modal({
  title,
  onClose,
  children,
  width = 720,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}) {
  // close on Escape
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="modal_parent"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal_content" style={{ width: "100%", maxWidth: width }}>
        <div className="modal_title">
          <h3>{title}</h3>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modal_content_area">{children}</div>
      </div>
    </div>
  );
}
