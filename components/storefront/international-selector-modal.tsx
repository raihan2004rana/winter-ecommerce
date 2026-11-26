"use client";

import * as React from "react";
import {
  COUNTRIES_REGISTRY,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
  getCountryConfig,
} from "@/lib/international/countries";
import { useInternationalStore, SupportedLanguage } from "@/lib/international/i18n";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrencySettlementNotice } from "@/lib/international/formatters";
import {
  X,
  Globe,
  DollarSign,
  Languages,
  Check,
  Search,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InternationalSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InternationalSelectorModal({
  isOpen,
  onClose,
}: InternationalSelectorModalProps) {
  const {
    country,
    currency,
    language,
    rates,
    ratesLastUpdated,
    setCountry,
    setCurrency,
    setLanguage,
    fetchLiveRates,
  } = useInternationalStore();

  const { setShippingCountry, syncServerQuote } = useCartStore();

  const [selectedCountry, setSelectedCountry] = React.useState(country);
  const [selectedCurrency, setSelectedCurrency] = React.useState(currency);
  const [selectedLanguage, setSelectedLanguage] = React.useState<SupportedLanguage>(language);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      setSelectedCountry(country);
      setSelectedCurrency(currency);
      setSelectedLanguage(language);
      fetchLiveRates();
    }
  }, [isOpen, country, currency, language, fetchLiveRates]);

  if (!isOpen) return null;

  const countryList = Object.values(COUNTRIES_REGISTRY).filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentRate = rates[selectedCurrency] || 1.0;
  const targetConfig = getCountryConfig(selectedCountry);

  const handleCountrySelect = (code: string) => {
    setSelectedCountry(code);
    const config = getCountryConfig(code);
    // Suggest default currency and language
    setSelectedCurrency(config.defaultCurrency);
    setSelectedLanguage((config.defaultLocale.slice(0, 2) as SupportedLanguage) || "en");
  };

  const handleSave = () => {
    setCountry(selectedCountry);
    setCurrency(selectedCurrency);
    setLanguage(selectedLanguage);
    setShippingCountry(selectedCountry);
    syncServerQuote();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 text-[#111]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-normal text-black">
                Regional & Currency Preferences
              </h2>
              <p className="text-2xs font-mono text-gray-500 uppercase tracking-widest">
                Multi-currency delivery • Live exchange rates • Real-time VAT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Country Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>1. Shipping Destination Country</span>
              </label>
              <span className="text-2xs font-mono text-gray-400">
                Determines local VAT & transit
              </span>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search country or region (e.g. Switzerland, Germany, Japan)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-sans"
              />
            </div>

            {/* Country Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {countryList.map((c) => {
                const isSelected = selectedCountry === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountrySelect(c.code)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-all ${
                      isSelected
                        ? "border-black bg-gray-50 font-medium shadow-xs"
                        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-base shrink-0">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-black shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Currency Selection */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>2. Display Currency</span>
              </label>
              <span className="text-2xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Rates Updated: {ratesLastUpdated}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {SUPPORTED_CURRENCIES.map((curr) => {
                const isSelected = selectedCurrency === curr.code;
                const rate = rates[curr.code] || 1.0;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => setSelectedCurrency(curr.code)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-black bg-gray-50 font-medium shadow-xs"
                        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-black">
                        {curr.flag} {curr.code}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">
                      1 USD = {rate < 1 ? rate.toFixed(4) : rate.toFixed(2)} {curr.code}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Language Selection */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" />
              <span>3. Storefront Language</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.code as SupportedLanguage)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-black bg-gray-50 font-medium shadow-xs"
                        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-black">
                        {lang.flag} {lang.nativeName}
                      </span>
                      {isSelected && <Check className="w-3 h-3 text-black" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Currency Transparency Notice */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-black">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full Currency Transparency Guarantee</span>
            </div>
            <p className="text-[0.72rem] text-gray-600 leading-relaxed font-sans">
              {formatCurrencySettlementNotice(selectedCurrency, "USD", currentRate)}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-gray-500 hover:text-black uppercase tracking-wider"
          >
            Cancel
          </button>

          <Button
            onClick={handleSave}
            className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-2"
          >
            <span>Apply Preferences</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
