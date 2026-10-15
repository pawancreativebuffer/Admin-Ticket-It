// sample client setup content for the Edit Client page (taken from the legacy FoodVilla screenshot)

export const SETTINGS = [
  { key: "onTheGo", label: "On The Go", on: true },
  { key: "batchViewEdit", label: "Batch view edit of tickets", on: true },
  { key: "franchiseeBatches", label: "Franchisee creation of batches", on: true },
  { key: "franchiseeStock", label: "Franchisee stock control", on: false },
  { key: "headOfficeStock", label: "Head Office stock control", on: false },
  { key: "clientImages", label: "Client image management", on: true },
  { key: "storeImages", label: "Image management for franchisee / store users", on: true },
  { key: "newBatchView", label: "New batch view", on: true },
  { key: "batchSummaries", label: "Summaries in batch view", on: true },
  { key: "hideZeroQty", label: "Hide zero quantity tickets for franchisees", on: false },
  { key: "franchiseeCore", label: "Franchisee core", on: false },
  { key: "subCore", label: "Sub core", on: false },
  { key: "templateGroupingHo", label: "Ticket template grouping for Head Office", on: false },
  { key: "templateGroupingStore", label: "Ticket template grouping for store", on: false },
  { key: "savedTemplateStates", label: "Saved template states", on: false },
];

export const REGIONS = ["Head Office"];
export const DEPARTMENTS = ["Master"];

export const CORE = {
  tickets: ["Food Villa 1UP"],
  productName: { preferred: "Not set", secondary: "Not set" },
  lookupFields: ["SKU", "Product Description"],
  viewFields: ["SKU", "Product Description", "Promo Price"],
  searchFields: ["SKU", "Product Description"],
  changeReportFields: ["Product Description", "Promo Price", "RRP", "Savings", "Multibuy Offer"],
  batchFilterAttributes: ["SKU"],
};

export const FONTS = [
  "RobotoCondensed-Black.ttf",
  "RobotoCondensed-BlackItalic.ttf",
  "RobotoCondensed-Bold.ttf",
  "RobotoCondensed-BoldItalic.ttf",
  "RobotoCondensed-ExtraBold.ttf",
  "RobotoCondensed-ExtraBoldItalic.ttf",
  "RobotoCondensed-ExtraLight.ttf",
  "RobotoCondensed-ExtraLightItalic.ttf",
  "RobotoCondensed-Italic.ttf",
  "RobotoCondensed-Light.ttf",
  "RobotoCondensed-LightItalic.ttf",
  "RobotoCondensed-Medium.ttf",
  "RobotoCondensed-MediumItalic.ttf",
  "RobotoCondensed-Regular.ttf",
  "RobotoCondensed-SemiBold.ttf",
  "RobotoCondensed-SemiBoldItalic.ttf",
  "RobotoCondensed-Thin.ttf",
  "RobotoCondensed-ThinItalic.ttf",
];

export const IMAGE_COUNT = 212;

export const DATA_FIELDS = [
  "SKU",
  "Product Description",
  "Promo Price",
  "RRP",
  "Start Date",
  "UOM",
  "End Date",
  "Ticket Type",
  "Message",
  "Unit Price",
  "Unit Price Measurement",
  "Savings",
  "Multibuy Offer",
  "Guid",
  "Id",
  "Unit Price Measurement2",
  "Unit Price2",
  "Product_Image",
  "Error_Message_Label",
  "Members Price",
  "MultibuyQuantity",
  "Template Layer",
];

export const TICKETS = [
  "Food Villa A3",
  "Food Villa A4",
  "Food Villa A5",
  "Food Villa A6",
  "Food Villa A7",
  "200x200",
  "250x122",
  "296x152",
  "300x400",
  "528x880",
  "640x960",
  "1920x1080",
  "1080x1920",
  "152x152",
];

export const FONT_MAPS = [
  { template: "RobotoCondensed-Black, RobotoCondensed-Black", mapping: "RobotoCondensed-Black" },
  { template: "RobotoCondensed-Medium, RobotoCondensed-Medium", mapping: "RobotoCondensed-Medium" },
  { template: "RobotoCondensed-Bold, RobotoCondensed-Bold", mapping: "RobotoCondensed-Bold" },
  { template: "RobotoCondensed-Regular, RobotoCondensed-Regular", mapping: "RobotoCondensed-Regular" },
];

export const POS_OPTIONS = ["IdealPOS", "SwiftPOS", "Vend", "Lightspeed", "Surefire", "Metcash", "Other"];
export const CURRENCY_OPTIONS = ["AUD", "NZD", "GBP", "USD"];
