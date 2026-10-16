"use client";

import React, { useState, useRef, useEffect } from "react";

export interface MultiSelectProps {
  id?: string;
  label?: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
}

export default function MultiSelect({
  id = "core-departments",
  label,
  options,
  selected,
  onChange,
  placeholder = "Select departments...",
  allowCustom = true,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((item) => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const removeChip = (opt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== opt));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const merged = Array.from(new Set([...selected, ...options]));
    onChange(merged);
  };

  // Combine options with any selected items (which could be custom)
  const allAvailableOptions = Array.from(new Set([...options, ...selected]));

  const filteredOptions = allAvailableOptions.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const canAddCustom =
    allowCustom &&
    search.trim() !== "" &&
    !allAvailableOptions.some(
      (opt) => opt.toLowerCase() === search.trim().toLowerCase(),
    );

  const handleAddCustom = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    const trimmed = search.trim();
    if (!trimmed) return;
    if (!selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (canAddCustom) {
        handleAddCustom();
      } else if (filteredOptions.length > 0) {
        toggleOption(filteredOptions[0]);
      }
    } else if (e.key === "Backspace" && search === "" && selected.length > 0) {
      // Backspace deletes last chip like Vuetify combobox
      onChange(selected.slice(0, -1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="custom-field" ref={containerRef}>
      {label && (
        <label
          className="field-label"
          htmlFor={id}
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          {label}
        </label>
      )}

      <div className="v-multiselect-wrapper" style={{ position: "relative" }}>
        <div
          id={id}
          className={`v-multiselect-control ${isOpen ? "focused" : ""}`}
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          <div className="v-multiselect-chips">
            {selected.map((item) => (
              <span key={item} className="v-chip">
                <span className="v-chip-text">{item}</span>
                <button
                  type="button"
                  className="v-chip-close"
                  onClick={(e) => removeChip(item, e)}
                  title={`Remove ${item}`}
                  aria-label={`Remove ${item}`}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            ))}

            <input
              ref={inputRef}
              type="text"
              className="v-multiselect-search-input"
              value={search}
              placeholder={selected.length === 0 ? placeholder : ""}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="v-multiselect-actions">
            {selected.length > 0 && (
              <button
                type="button"
                className="v-multiselect-clear-btn"
                onClick={handleClearAll}
                title="Clear all"
                aria-label="Clear all selections"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
            <span className={`v-multiselect-arrow ${isOpen ? "open" : ""}`}>
              <i className="fa-solid fa-chevron-down"></i>
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="v-multiselect-menu">
            <div className="v-multiselect-header">
              <span>
                {selected.length} of {allAvailableOptions.length} selected
              </span>
              <div className="v-multiselect-header-actions">
                {selected.length < allAvailableOptions.length ? (
                  <button type="button" onClick={handleSelectAll}>
                    Select All
                  </button>
                ) : (
                  <button type="button" onClick={handleClearAll}>
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="v-multiselect-list">
              {canAddCustom && (
                <div
                  className="v-multiselect-item add-custom"
                  onClick={() => handleAddCustom()}
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Add &quot;{search.trim()}&quot;</span>
                </div>
              )}

              {filteredOptions.length === 0 && !canAddCustom ? (
                <div className="v-multiselect-empty">No departments found</div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = selected.includes(opt);
                  return (
                    <div
                      key={opt}
                      className={`v-multiselect-item ${isSelected ? "is-selected" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(opt);
                      }}
                    >
                      <span
                        className={`v-multiselect-checkbox ${isSelected ? "checked" : ""}`}
                      >
                        {isSelected && <i className="fa-solid fa-check"></i>}
                      </span>
                      <span className="v-multiselect-item-label">{opt}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
