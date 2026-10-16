"use client";

import { useState } from "react";

const PAYMENT_TYPES = [
  "HeadOfficeManualInvoice",
  "HOCreditCard",
  "StoreCreditCard",
];
// only "Empty" is known from the legacy page; the real partner list comes from the backend
const PARTNERS: string[] = [];

const money = (value: number) =>
  Number.isFinite(value) ? value.toFixed(2) : "0.00";
const num = (value: string) => Number.parseFloat(value) || 0;

// legacy "Edit Invoice Details" fields. Totals are worked out on Calculate (assumed formula,
// it reproduces the legacy example: 3 stores + 1 integration at 1.00, 1% discount = 3.96):
//   subtotal = (stores + total integrations) × value per store
//   total per month = subtotal − discount %, then + GST %
//   total invoice = total per month − reseller invoice
export default function InvoiceForm({
  client,
  stores,
  onSaved,
}: {
  client: string;
  stores: number;
  onSaved: (totalInvoice: string) => void;
}) {
  const [values, setValues] = useState({
    reportName: client,
    valuePerStore: "1.00",
    integrations: "1",
    discount: "1.00",
    gst: "0.00",
    totalIntegrations: "1",
    resellerInvoice: "0.00",
    partner: "",
    paymentType: "HeadOfficeManualInvoice",
  });
  const [totals, setTotals] = useState({ perMonth: "", invoice: "" });

  const set = (key: keyof typeof values) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  const calculate = () => {
    const subtotal =
      (stores + num(values.totalIntegrations)) * num(values.valuePerStore);
    const perMonth =
      subtotal * (1 - num(values.discount) / 100) * (1 + num(values.gst) / 100);
    const invoice = Math.max(0, perMonth - num(values.resellerInvoice));
    const next = { perMonth: money(perMonth), invoice: money(invoice) };
    setTotals(next);
    onSaved(next.invoice);
  };

  const input = (
    key: keyof typeof values,
    label: string,
    type: "text" | "number" = "number",
  ) => (
    <div className="custom-field">
      <label className="field-label" htmlFor={`invoice-${key}`}>
        {label}
      </label>
      <div className="field-type">
        <input
          id={`invoice-${key}`}
          type={type}
          step={type === "number" ? "any" : undefined}
          value={values[key]}
          onChange={(event) => set(key)(event.target.value)}
        />
      </div>
    </div>
  );

  const readOnly = (label: string, value: string) => (
    <div className="custom-field">
      <span className="field-label">{label}</span>
      <div className="field-type">
        <input
          type="text"
          value={value}
          placeholder="Press Calculate"
          disabled
          readOnly
        />
      </div>
    </div>
  );

  const select = (
    key: "partner" | "paymentType",
    label: string,
    options: string[],
    emptyLabel: string,
  ) => (
    <div className="custom-field">
      <label className="field-label" htmlFor={`invoice-${key}`}>
        {label}
      </label>
      <div className="field-type field-stype-select">
        <select
          id={`invoice-${key}`}
          value={values[key]}
          onChange={(event) => set(key)(event.target.value)}
        >
          <option value="">{emptyLabel}</option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down"></i>
      </div>
    </div>
  );

  return (
    <form
      className="form-grid invoice-form"
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        calculate();
      }}
    >
      {input("reportName", "Client Name in Report", "text")}
      {readOnly("Number Of Stores", String(stores))}
      {input("valuePerStore", "Value per Store")}
      {input("integrations", "Number Of Integrations")}
      {input("discount", "Discount Percentage")}
      {input("gst", "GST")}
      {input("totalIntegrations", "Total Integrations")}
      {input("resellerInvoice", "Reseller Invoice")}
      {select("partner", "Partner", PARTNERS, "Empty")}
      {select("paymentType", "Payment Type", PAYMENT_TYPES, "Select")}
      {readOnly("Total per Month", totals.perMonth)}
      {readOnly("Total Invoice", totals.invoice)}

      <div className="form-actions">
        <button type="submit" className="cta_with_icon mint-bg">
          <span>
            <i className="fa-solid fa-calculator"></i>
          </span>
          <p>Calculate</p>
        </button>
      </div>
    </form>
  );
}
