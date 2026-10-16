"use client";

import Modal from "@/components/Modal";

export type TicketField = { name: string; type: "Image" | "Text" };

// sample fields read from a ticket's XML (legacy "Showing fields for <client> - <ticket>"):
// barcode / image layers per variant, then the text layers per variant
export function sampleTicketFields(ticket: string): TicketField[] {
  const size = ticket.match(/A\d/)?.[0] ?? "A4";
  const variants = ["SP", "BMS", "CLR", "SALE", "NEW"].map(
    (v) => `${size}_${v}`,
  );
  const images: TicketField[] = [
    ...variants.map((v) => ({
      name: `Barcode_Image_${v}`,
      type: "Image" as const,
    })),
    { name: "Barcode_Image_VCD", type: "Image" },
    { name: "Ticket Type", type: "Image" },
  ];
  const textParts = [
    "Promo Price_Dollar Sign",
    "Promo Price_Dollars",
    "Promo Price_Cents",
    "Savings",
    "Unit Price_Dollars",
    "Unit Price Measurement",
    "Product Description",
    "Message",
    "Date",
    "SKU",
  ];
  const texts: TicketField[] = variants.flatMap((v) =>
    textParts.map((part) => ({ name: `${part}_${v}`, type: "Text" as const })),
  );
  return [...images, ...texts];
}

// read-only list of the fields found in a ticket template
export default function ShowFieldsModal({
  client,
  ticket,
  onClose,
}: {
  client: string;
  ticket: string;
  onClose: () => void;
}) {
  const fields = sampleTicketFields(ticket);
  return (
    <Modal
      title={`Showing fields for ${client} - ${ticket}`}
      onClose={onClose}
      width={900}
    >
      <p className="field-hint show-fields-count">
        {fields.length} fields in this ticket
      </p>
      <div className="table-scroll show-fields-table">
        <table className="custom-table compact">
          <thead>
            <tr>
              <th>Field Name</th>
              <th>Field Type</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field.name}>
                <td>{field.name}</td>
                <td>
                  <span
                    className={`chip type-chip ${field.type.toLowerCase()}`}
                  >
                    <i
                      className={`fa-solid ${field.type === "Image" ? "fa-image" : "fa-font"}`}
                    ></i>{" "}
                    {field.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
