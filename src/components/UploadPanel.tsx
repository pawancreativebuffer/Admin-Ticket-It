"use client";

import { useState } from "react";

// slim drop row: drag & drop on the left, browse + upload on the right;
// upload stays disabled until a file is picked (design only, nothing is uploaded)
function DropRow({ title }: { title: string }) {
  const [fileName, setFileName] = useState("");

  return (
    <div className="upload-block">
      <h5>{title}</h5>
      <div className="drop-row">
        <div className="drop-info">
          <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
          <div>
            <span className="upload-label">Drag &amp; Drop File</span>
            <span className="upload-hint">{fileName || "No file selected"}</span>
          </div>
        </div>
        <div className="drop-actions">
          <label className="blank_cta">
            <input
              type="file"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
            />
            Browse File
          </label>
          <button type="button" className="cta_with_icon mint-bg" disabled={!fileName}>
            <span>
              <i className="fa-solid fa-upload"></i>
            </span>
            <p>Upload</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UploadPanel() {
  return (
    <section className="card">
      <div className="upload-grid">
        <DropRow title="Upload New Users Spreadsheet" />
        <DropRow title="Upload Users Update Spreadsheet" />
      </div>
    </section>
  );
}
