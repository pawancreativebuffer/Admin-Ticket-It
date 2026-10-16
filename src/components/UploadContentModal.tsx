"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

// "Upload New Content Files for <client>" popup: one ZIP file, upload stays disabled
// until a file is picked (design only, nothing is sent)
export default function UploadContentModal({
  client,
  onUpload,
  onClose,
}: {
  client: string;
  onUpload: (fileName: string) => void;
  onClose: () => void;
}) {
  const [fileName, setFileName] = useState("");

  return (
    <Modal
      title={`Upload New Content Files for ${client}`}
      onClose={onClose}
      width={640}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (fileName) onUpload(fileName);
        }}
      >
        <div className="custom-field">
          <span className="field-label">Content Files</span>
          <div className="drop-row">
            <div className="drop-info">
              <i className="fa-solid fa-file-zipper upload-icon"></i>
              <div>
                <span className="upload-label">Drag &amp; Drop ZIP</span>
                <span className="upload-hint">
                  {fileName || "No file selected"}
                </span>
              </div>
            </div>
            <div className="drop-actions">
              <label className="blank_cta">
                <input
                  type="file"
                  accept=".zip,application/zip"
                  onChange={(event) =>
                    setFileName(event.target.files?.[0]?.name ?? "")
                  }
                />
                Browse File
              </label>
            </div>
          </div>
          <p className="field-hint">Please upload a ZIP file.</p>
        </div>

        <div className="modal-actions end">
          <button
            type="submit"
            className="cta_with_icon mint-bg"
            disabled={!fileName}
          >
            <span>
              <i className="fa-solid fa-upload"></i>
            </span>
            <p>Upload New Content Files</p>
          </button>
        </div>
      </form>
    </Modal>
  );
}
