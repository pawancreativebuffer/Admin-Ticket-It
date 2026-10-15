import { clients } from "@/data/clients";

// per-client setup overview for the Client Administration list (dummy values);
// billing config fields from the doc (per-store value, reseller margin, POS, first invoice date)
// belong to the client edit form, not this list
export type ClientSummary = {
  name: string;
  ownerName: string;
  ownerEmail: string;
  headOffice: number;
  regionalManagers: number;
  franchisees: number;
  currency: string;
};

const CURRENCIES = ["AUD", "AUD", "AUD", "NZD", "NZD", "GBP", "USD"];
const FIRST_NAMES = ["Luke", "Sarah", "James", "Emma", "Daniel", "Olivia", "Michael", "Chloe", "Ben", "Grace"];
const LAST_NAMES = ["Senior", "Walker", "Nguyen", "Taylor", "Patel", "Brown", "Wilson", "Clarke", "Hall", "Reid"];

// small deterministic hash so every client always gets the same dummy values
function hash(text: string) {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}

export const clientSummaries: ClientSummary[] = clients.map((name) => {
  const seed = hash(name);
  const first = FIRST_NAMES[seed % FIRST_NAMES.length];
  const last = LAST_NAMES[(seed >>> 4) % LAST_NAMES.length];
  return {
    name,
    ownerName: `${first} ${last}`,
    ownerEmail: `${first}.${last}@${name.toLowerCase()}.com`,
    headOffice: 1 + (seed % 3),
    regionalManagers: seed % 6,
    franchisees: 1 + (seed % 60),
    currency: /NZ|Kiwi|Countdown|Briscoes|Farmlands|Paperplus/i.test(name)
      ? "NZD"
      : CURRENCIES[(seed + 2) % CURRENCIES.length],
  };
});
