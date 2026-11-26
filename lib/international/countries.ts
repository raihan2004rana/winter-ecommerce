/**
 * Extensible International Countries, Regions & Payment Registry
 * 
 * Designed so new countries and currencies can be added via simple configuration
 * without rewriting the application or hardcoding rules.
 */

export interface CountryConfig {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  flag: string;
  continent: "Europe" | "North America" | "Asia-Pacific" | "Oceania" | "Other";
  defaultCurrency: string;
  supportedCurrencies: string[];
  defaultLocale: string;
  supportedLocales: string[];
  timezone: string;
  taxType: "vat" | "gst" | "sales_tax" | "custom";
  defaultTaxRate: number; // e.g. 0.20 for 20%
  isTaxInclusive: boolean; // true for EU/UK where prices include VAT
  shippingZone: "domestic_us" | "europe_west" | "north_america" | "asia_pacific" | "nordic" | "rest_of_world";
  supportedPaymentMethods: Array<
    "card" | "apple_pay" | "google_pay" | "klarna" | "ideal" | "bancontact" | "sepa_debit" | "swish"
  >;
  addressFormat: {
    postalCodeLabel: string;
    postalCodePlaceholder: string;
    postalCodePattern?: string;
    regionLabel: string; // State / Province / Canton / Prefecture / County
    regionRequired: boolean;
    requirePhone: boolean;
  };
}

export const COUNTRIES_REGISTRY: Record<string, CountryConfig> = {
  US: {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    continent: "North America",
    defaultCurrency: "USD",
    supportedCurrencies: ["USD", "EUR", "CAD"],
    defaultLocale: "en-US",
    supportedLocales: ["en-US", "es-US"],
    timezone: "America/New_York",
    taxType: "sales_tax",
    defaultTaxRate: 0.085,
    isTaxInclusive: false,
    shippingZone: "domestic_us",
    supportedPaymentMethods: ["card", "apple_pay", "google_pay", "klarna"],
    addressFormat: {
      postalCodeLabel: "ZIP Code",
      postalCodePlaceholder: "10001",
      regionLabel: "State",
      regionRequired: true,
      requirePhone: true,
    },
  },
  GB: {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    continent: "Europe",
    defaultCurrency: "GBP",
    supportedCurrencies: ["GBP", "EUR", "USD"],
    defaultLocale: "en-GB",
    supportedLocales: ["en-GB"],
    timezone: "Europe/London",
    taxType: "vat",
    defaultTaxRate: 0.20,
    isTaxInclusive: true,
    shippingZone: "europe_west",
    supportedPaymentMethods: ["card", "apple_pay", "google_pay", "klarna"],
    addressFormat: {
      postalCodeLabel: "Postcode",
      postalCodePlaceholder: "SW1A 1AA",
      regionLabel: "County",
      regionRequired: false,
      requirePhone: true,
    },
  },
  CH: {
    code: "CH",
    name: "Switzerland",
    flag: "🇨🇭",
    continent: "Europe",
    defaultCurrency: "CHF",
    supportedCurrencies: ["CHF", "EUR", "USD"],
    defaultLocale: "fr-CH",
    supportedLocales: ["de-CH", "fr-CH", "it-CH", "en-CH"],
    timezone: "Europe/Zurich",
    taxType: "vat",
    defaultTaxRate: 0.081, // 8.1% Swiss VAT
    isTaxInclusive: true,
    shippingZone: "europe_west",
    supportedPaymentMethods: ["card", "apple_pay", "google_pay"],
    addressFormat: {
      postalCodeLabel: "Postal Code",
      postalCodePlaceholder: "1204",
      regionLabel: "Canton",
      regionRequired: true,
      requirePhone: true,
    },
  },
  DE: {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    continent: "Europe",
    defaultCurrency: "EUR",
    supportedCurrencies: ["EUR", "USD"],
    defaultLocale: "de-DE",
    supportedLocales: ["de-DE", "en-DE"],
    timezone: "Europe/Berlin",
    taxType: "vat",
    defaultTaxRate: 0.19, // 19% MwSt
    isTaxInclusive: true,
    shippingZone: "europe_west",
    supportedPaymentMethods: ["card", "apple_pay", "google_pay", "klarna", "sepa_debit"],
    addressFormat: {
      postalCodeLabel: "Postleitzahl",
      postalCodePlaceholder: "10115",
      regionLabel: "Bundesland",
      regionRequired: false,
      requirePhone: true,
    },
  },
  FR: {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    continent: "Europe",
    defaultCurrency: "EUR",
    supportedCurrencies: ["EUR", "USD"],
    defaultLocale: "fr-FR",
    supportedLocales: ["fr-FR", "en-FR"],
    timezone: "Europe/Paris",
    taxType: "vat",
    defaultTaxRate: 0.20, // 20% TVA
    isTaxInclusive: true,
    shippingZone: "europe_west",
    supportedPaymentMethods: ["card", "apple_pay", "google_pay"],
    addressFormat: {
      postalCodeLabel: "Code Postal",
      postalCodePlaceholder: "75001",
      regionLabel: "Région",
      regionRequired: false,
      requirePhone: true,
    },
  },
  NL: {
    code: "NL",
    name: "Netherlands",
    flag: "🇳🇱",
    continent: "Europe",
    defaultCurrency: "EUR",
    supportedCurrencies: ["EUR", "USD"],
    defaultLocale: "nl-NL",
    supportedLocales: ["nl-NL", "en-NL"],
    timezone: "Europe/Amsterdam",
    taxType: "vat",
    defaultTaxRate: 0.21, // 21% BTW
    isTaxInclusive: true,
    shippingZone: "europe_west",
    supportedPaymentMethods: ["ideal", "card", "apple_pay", "google_pay", "klarna"],
    addressFormat: {
      postalCodeLabel: "Postcode",
      postalCodePlaceholder: "1012 AB",
      regionLabel: "Provincie",
      regionRequired: false,
      requirePhone: true,
    },
  },
  CA: {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    continent: "North America",
    defaultCurrency: "CAD",
    supportedCurrencies: ["CAD", "USD"],
    defaultLocale: "en-CA",
    supportedLocales: ["en-CA", "fr-CA"],
    timezone: "America/Toronto",
    taxType: "gst",
    defaultTaxRate: 0.13, // 13% HST/GST
    isTaxInclusive: false,
    shippingZone: "north_america",
    supportedPaymentMethods: ["card", "apple_pay", "google_pay"],
    addressFormat: {
      postalCodeLabel: "Postal Code",
      postalCodePlaceholder: "M5V 2T6",
      regionLabel: "Province / Territory",
      regionRequired: true,
      requirePhone: true,
    },
  },
  AU: {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    continent: "Oceania",
    defaultCurrency: "AUD",
    supportedCurrencies: ["AUD", "USD"],
    defaultLocale: "en-AU",
    supportedLocales: ["en-AU"],
    timezone: "Australia/Sydney",
    taxType: "gst",
    defaultTaxRate: 0.10, // 10% GST
    isTaxInclusive: true,
    shippingZone: "asia_pacific",
    supportedPaymentMethods: ["card", "apple_pay", "google_pay"],
    addressFormat: {
      postalCodeLabel: "Postcode",
      postalCodePlaceholder: "2000",
      regionLabel: "State",
      regionRequired: true,
      requirePhone: true,
    },
  },
  JP: {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    continent: "Asia-Pacific",
    defaultCurrency: "JPY",
    supportedCurrencies: ["JPY", "USD"],
    defaultLocale: "ja-JP",
    supportedLocales: ["ja-JP", "en-JP"],
    timezone: "Asia/Tokyo",
    taxType: "gst",
    defaultTaxRate: 0.10, // 10% Japanese Consumption Tax
    isTaxInclusive: true,
    shippingZone: "asia_pacific",
    supportedPaymentMethods: ["card", "apple_pay", "google_pay"],
    addressFormat: {
      postalCodeLabel: "Postal Code (郵便番号)",
      postalCodePlaceholder: "100-0001",
      regionLabel: "Prefecture (都道府県)",
      regionRequired: true,
      requirePhone: true,
    },
  },
  SE: {
    code: "SE",
    name: "Sweden",
    flag: "🇸🇪",
    continent: "Europe",
    defaultCurrency: "SEK",
    supportedCurrencies: ["SEK", "EUR", "USD"],
    defaultLocale: "sv-SE",
    supportedLocales: ["sv-SE", "en-SE"],
    timezone: "Europe/Stockholm",
    taxType: "vat",
    defaultTaxRate: 0.25, // 25% Moms
    isTaxInclusive: true,
    shippingZone: "nordic",
    supportedPaymentMethods: ["klarna", "card", "apple_pay", "google_pay"],
    addressFormat: {
      postalCodeLabel: "Postnummer",
      postalCodePlaceholder: "111 22",
      regionLabel: "Län",
      regionRequired: false,
      requirePhone: true,
    },
  },
  NO: {
    code: "NO",
    name: "Norway",
    flag: "🇳🇴",
    continent: "Europe",
    defaultCurrency: "NOK",
    supportedCurrencies: ["NOK", "EUR", "USD"],
    defaultLocale: "nb-NO",
    supportedLocales: ["nb-NO", "en-NO"],
    timezone: "Europe/Oslo",
    taxType: "vat",
    defaultTaxRate: 0.25, // 25% MVA
    isTaxInclusive: true,
    shippingZone: "nordic",
    supportedPaymentMethods: ["klarna", "card", "apple_pay", "google_pay"],
    addressFormat: {
      postalCodeLabel: "Postnummer",
      postalCodePlaceholder: "0150",
      regionLabel: "Fylke",
      regionRequired: false,
      requirePhone: true,
    },
  },
};

export const SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", symbol: "AU$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", flag: "🇳🇴" },
];

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
];

export function getCountryConfig(code?: string): CountryConfig {
  const upper = (code || "US").toUpperCase();
  return COUNTRIES_REGISTRY[upper] || COUNTRIES_REGISTRY["US"];
}
