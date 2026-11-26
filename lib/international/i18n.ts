"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { COUNTRIES_REGISTRY, getCountryConfig } from "./countries";

export type SupportedLanguage = "en" | "de" | "fr" | "ja";

export const DICTIONARIES: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    "nav.women": "Women",
    "nav.men": "Men",
    "nav.journal": "Journal",
    "nav.about": "About",
    "nav.search": "Search",
    "nav.shoppingBag": "Shopping Bag",
    "announcement.express": "Complimentary Worldwide Express Transit on Orders Over $200",
    "announcement.useCode": "Enter Code {code} at checkout for {discount}% off",
    "hero.newDrop": "NEW DROP",
    "hero.headline": "Designed for colder days",
    "hero.subheadline": "Our winter pieces focus on comfort, form, and quiet confidence. Easy to wear. Easy to keep.",
    "hero.customers": "1M+ satisfied customers",
    "hero.shopNow": "Shop the Collection",
    "bestsellers.title": "Best sellers",
    "bestsellers.subtitle": "Curated winter down outerwear, insulated shells & weather protection.",
    "bestsellers.addToCart": "Add to Cart",
    "bestsellers.viewAll": "View all",
    "cart.title": "Your Shopping Bag",
    "cart.empty": "Your bag is currently empty",
    "cart.subtotal": "Items Subtotal",
    "cart.tax": "Estimated Duties & VAT",
    "cart.total": "Estimated Total",
    "cart.proceed": "Proceed to Checkout",
    "cart.freeShippingUnlocked": "You've unlocked Complimentary Express Transit!",
    "cart.freeShippingRemaining": "Add {amount} more for Free Express Shipping",
    "checkout.title": "Secure International Checkout",
    "checkout.shipping": "Shipping Destination",
    "checkout.speed": "Delivery Speed & Transit",
    "checkout.billing": "Billing Address",
    "checkout.payment": "Payment Authorization",
    "checkout.authorize": "Authorize Payment ({amount})",
    "currency.notice": "Displaying {displayCurrency} • Settling in {baseCurrency}",
  },
  de: {
    "nav.women": "Damen",
    "nav.men": "Herren",
    "nav.journal": "Magazin",
    "nav.about": "Über Uns",
    "nav.search": "Suchen",
    "nav.shoppingBag": "Warenkorb",
    "announcement.express": "Kostenloser weltweiter Expressversand ab 200 $ Bestellwert",
    "announcement.useCode": "Gutscheincode {code} an der Kasse für {discount}% Rabatt eingeben",
    "hero.newDrop": "NEUE KOLLEKTION",
    "hero.headline": "Entworfen für kältere Tage",
    "hero.subheadline": "Unsere Winterkollektion verbindet Komfort, funktionale Form und zeitlose Eleganz.",
    "hero.customers": "Über 1 Mio. zufriedene Kunden",
    "hero.shopNow": "Kollektion entdecken",
    "bestsellers.title": "Bestseller",
    "bestsellers.subtitle": "Ausgewählte Daunenmäntel, isolierende Shells und arktischer Wetterschutz.",
    "bestsellers.addToCart": "In den Warenkorb",
    "bestsellers.viewAll": "Alle ansehen",
    "cart.title": "Ihr Warenkorb",
    "cart.empty": "Ihr Warenkorb ist derzeit leer",
    "cart.subtotal": "Zwischensumme",
    "cart.tax": "Geschätzte MwSt. & Zölle",
    "cart.total": "Gesamtsumme",
    "cart.proceed": "Zur Kasse gehen",
    "cart.freeShippingUnlocked": "Sie haben kostenlosen Expressversand freigeschaltet!",
    "cart.freeShippingRemaining": "Noch {amount} bis zum kostenlosen Expressversand",
    "checkout.title": "Sichere internationale Kasse",
    "checkout.shipping": "Lieferadresse",
    "checkout.speed": "Versandart & Laufzeit",
    "checkout.billing": "Rechnungsadresse",
    "checkout.payment": "Zahlungsautorisierung",
    "checkout.authorize": "Zahlung autorisieren ({amount})",
    "currency.notice": "Preise in {displayCurrency} • Abrechnung in {baseCurrency}",
  },
  fr: {
    "nav.women": "Femme",
    "nav.men": "Homme",
    "nav.journal": "Éditions",
    "nav.about": "Maison",
    "nav.search": "Rechercher",
    "nav.shoppingBag": "Panier",
    "announcement.express": "Livraison Express Mondiale Offerte dès 200 $ d'achat",
    "announcement.useCode": "Code {code} à l'encaissement pour {discount}% de remise",
    "hero.newDrop": "NOUVELLE ÉDITION",
    "hero.headline": "Conçu pour les grands froids",
    "hero.subheadline": "Nos pièces hivernales allient confort absolu, coupe architecturale et pure élégance.",
    "hero.customers": "Plus de 1M de clients conquis",
    "hero.shopNow": "Découvrir la collection",
    "bestsellers.title": "Pièces Iconiques",
    "bestsellers.subtitle": "Parkas doudoune couture, vestes techniques et isolation grand froid.",
    "bestsellers.addToCart": "Ajouter au Panier",
    "bestsellers.viewAll": "Tout voir",
    "cart.title": "Votre Panier d'Achat",
    "cart.empty": "Votre panier est actuellement vide",
    "cart.subtotal": "Sous-total",
    "cart.tax": "TVA & Taxes d'importation",
    "cart.total": "Total Estimé",
    "cart.proceed": "Passer la commande",
    "cart.freeShippingUnlocked": "Livraison Express Internationale Offerte !",
    "cart.freeShippingRemaining": "Ajoutez {amount} pour la livraison express gratuite",
    "checkout.title": "Paiement International Sécurisé",
    "checkout.shipping": "Adresse de Livraison",
    "checkout.speed": "Mode d'expédition",
    "checkout.billing": "Adresse de Facturation",
    "checkout.payment": "Autorisation de Paiement",
    "checkout.authorize": "Valider le paiement ({amount})",
    "currency.notice": "Affichage en {displayCurrency} • Facturation en {baseCurrency}",
  },
  ja: {
    "nav.women": "レディース",
    "nav.men": "メンズ",
    "nav.journal": "ジャーナル",
    "nav.about": "ブランドについて",
    "nav.search": "検索",
    "nav.shoppingBag": "ショッピングバッグ",
    "announcement.express": "200ドル以上のご注文で世界中へエクスプレス送料無料",
    "announcement.useCode": "チェックアウト時にコード {code} 入力で {discount}% OFF",
    "hero.newDrop": "新作コレクション",
    "hero.headline": "厳冬のための美しい佇まい",
    "hero.subheadline": "上質な保温性と洗練されたシルエット。日常を格上げするウィンターワードローブ。",
    "hero.customers": "世界100万人以上のご愛用者様",
    "hero.shopNow": "コレクションを見る",
    "bestsellers.title": "ベストセラー",
    "bestsellers.subtitle": "厳選されたダウンアウター、高機能シェル、寒冷地仕様のウェア。",
    "bestsellers.addToCart": "バッグに追加",
    "bestsellers.viewAll": "すべて見る",
    "cart.title": "ショッピングバッグ",
    "cart.empty": "バッグは空です",
    "cart.subtotal": "小計",
    "cart.tax": "消費税・輸入関税",
    "cart.total": "合計（税込）",
    "cart.proceed": "レジへ進む",
    "cart.freeShippingUnlocked": "エクスプレス送料無料が適用されました！",
    "cart.freeShippingRemaining": "あと {amount} で送料無料",
    "checkout.title": "セキュア国際チェックアウト",
    "checkout.shipping": "配送先住所",
    "checkout.speed": "配送スピードと手段",
    "checkout.billing": "請求先住所",
    "checkout.payment": "お支払い方法",
    "checkout.authorize": "注文を確定する ({amount})",
    "currency.notice": "表示通貨: {displayCurrency} • 決済通貨: {baseCurrency}",
  },
};

interface InternationalState {
  country: string; // ISO-2 e.g. "US", "CH", "GB", "DE", "FR", "JP"
  currency: string; // e.g. "USD", "EUR", "GBP", "CHF", "CAD", "JPY"
  language: SupportedLanguage;
  rates: Record<string, number>;
  ratesLastUpdated: string;
  isRatesLoading: boolean;

  // Actions
  setCountry: (countryCode: string) => void;
  setCurrency: (currencyCode: string) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setRates: (rates: Record<string, number>, date: string) => void;
  fetchLiveRates: () => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const useInternationalStore = create<InternationalState>()(
  persist(
    (set, get) => ({
      country: "US",
      currency: "USD",
      language: "en",
      rates: {
        USD: 1.0,
        EUR: 0.92,
        GBP: 0.79,
        CHF: 0.88,
        CAD: 1.39,
        AUD: 1.54,
        JPY: 154.2,
        SEK: 10.75,
        NOK: 10.88,
      },
      ratesLastUpdated: new Date().toISOString().split("T")[0],
      isRatesLoading: false,

      setCountry: (countryCode) => {
        const code = countryCode.toUpperCase();
        const config = getCountryConfig(code);
        set((state) => ({
          country: code,
          currency: config.defaultCurrency || state.currency,
          language: (config.defaultLocale.slice(0, 2) as SupportedLanguage) || state.language,
        }));
      },

      setCurrency: (currencyCode) => set({ currency: currencyCode.toUpperCase() }),
      setLanguage: (lang) => set({ language: lang }),

      setRates: (rates, date) => set({ rates, ratesLastUpdated: date }),

      fetchLiveRates: async () => {
        try {
          set({ isRatesLoading: true });
          const res = await fetch("/api/international/rates");
          const data = await res.json();
          if (data?.status === "success" && data.rates) {
            set({
              rates: data.rates,
              ratesLastUpdated: data.date || new Date().toISOString().split("T")[0],
              isRatesLoading: false,
            });
          }
        } catch {
          set({ isRatesLoading: false });
        }
      },

      t: (key, params) => {
        const { language } = get();
        const dict = DICTIONARIES[language] || DICTIONARIES.en;
        let text = dict[key] || DICTIONARIES.en[key] || key;

        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
          });
        }

        return text;
      },
    }),
    {
      name: "kora_international_preferences_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        country: state.country,
        currency: state.currency,
        language: state.language,
      }),
    }
  )
);
