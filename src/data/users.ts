// dummy users shown in the prototype (same rows as the legacy screenshot)
export type UserRow = {
  username: string;
  email: string;
  name: string;
  region: string;
  storeCategory: string;
  group: string;
  invoicing: boolean;
  // head office only: the client's owner login (exactly one per client, doc section 6)
  isOwner?: boolean;
};

export const headOffice: UserRow[] = [
  {
    username: "HO.7eleven",
    email: "HO.7eleven@7eleven.com",
    name: "Head Office",
    region: ".",
    storeCategory: "",
    group: "",
    invoicing: false,
    isOwner: true,
  },
  {
    username: "HO2.7eleven",
    email: "HO2.7eleven@7eleven.com",
    name: "Head Office 2",
    region: ".",
    storeCategory: "",
    group: "",
    invoicing: false,
  },
  {
    username: "HO3.7eleven",
    email: "HO3.7eleven@7eleven.com",
    name: "Head Office 3",
    region: ".",
    storeCategory: "",
    group: "",
    invoicing: false,
  },
];

export const regionalManagers: UserRow[] = [
  {
    username: "RM.7eleven",
    email: "RM.7eleven@7eleven.com",
    name: "Regional Manager",
    region: ".",
    storeCategory: "",
    group: "",
    invoicing: false,
  },
];

export const franchisees: UserRow[] = ["ST", "ST1", "ST2", "ST3"].map((prefix) => ({
  username: `${prefix}.7eleven`,
  email: `${prefix}.7eleven@7eleven.com`,
  name: "Store User",
  region: ".",
  storeCategory: "",
  group: "",
  invoicing: true,
}));
