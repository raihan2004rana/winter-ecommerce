"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { useInternationalStore } from "@/lib/international/i18n";
import { useAuth } from "@/lib/auth/auth-context";
import {
  VisaLogo,
  MastercardLogo,
  AmexLogo,
  ApplePayLogo,
  GooglePayLogo,
  KlarnaLogo,
  IdealLogo,
  SepaLogo,
  PaymentIconsRow,
} from "@/components/storefront/payment-logos";
import {
  COUNTRIES_REGISTRY,
  getCountryConfig,
  CountryConfig,
} from "@/lib/international/countries";
import {
  formatLocalizedCurrency,
  formatCurrencySettlementNotice,
} from "@/lib/international/formatters";
import { convertCurrency } from "@/lib/server/exchange-rates";
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag,
  ChevronLeft,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "CH", name: "Switzerland" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "AU", name: "Australia" },
  { code: "JP", name: "Japan" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    clearCart,
    couponCode,
    setCouponCode,
    shippingCountry,
    setShippingCountry,
    shippingMethod,
    setShippingMethod,
    serverQuote,
    isSyncing,
    syncServerQuote,
  } = useCartStore();

  const {
    currency,
    rates,
    country: internationalCountry,
    setCountry: setInternationalCountry,
  } = useInternationalStore();

  const { user, addresses } = useAuth();
  const targetCountryConfig = getCountryConfig(shippingCountry);

  // Customer Contact - synchronized with active user profile if logged in
  const [email, setEmail] = React.useState(user?.email || "julian.vance@geneva-capital.ch");
  const [isGuest, setIsGuest] = React.useState(!user);

  // Shipping Address Form
  const defaultAddr = addresses.find((a) => a.is_default_shipping) || addresses[0];
  const [shippingAddress, setShippingAddress] = React.useState({
    firstName: user?.first_name || "Julian",
    lastName: user?.last_name || "Vance",
    street: defaultAddr?.address_line1 || "Rue du Rhône 42",
    apartment: defaultAddr?.address_line2 || "Penthouse 6B",
    city: defaultAddr?.city || "Geneva",
    state: defaultAddr?.state_province || "Geneva",
    postalCode: defaultAddr?.postal_code || "1204",
    country: shippingCountry || defaultAddr?.country_code || "CH",
    phone: user?.phone || "+41 22 819 9000",
  });

  // Billing Address
  const [sameAsShipping, setSameAsShipping] = React.useState(true);
  const [billingAddress, setBillingAddress] = React.useState({
    firstName: user?.first_name || "Julian",
    lastName: user?.last_name || "Vance",
    street: defaultAddr?.address_line1 || "Rue du Rhône 42",
    apartment: defaultAddr?.address_line2 || "Penthouse 6B",
    city: defaultAddr?.city || "Geneva",
    state: defaultAddr?.state_province || "Geneva",
    postalCode: defaultAddr?.postal_code || "1204",
    country: shippingCountry || defaultAddr?.country_code || "CH",
  });

  // Payment Form (Stripe Card Fields)
  const [cardNumber, setCardNumber] = React.useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = React.useState("12/28");
  const [cardCvc, setCardCvc] = React.useState("789");
  const [nameOnCard, setNameOnCard] = React.useState("JULIAN VANCE");

  // State Management
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "klarna" | "ideal" | "sepa_debit">("card");
  const [idealBank, setIdealBank] = React.useState("ing");
  const [iban, setIban] = React.useState("NL91 ABNA 0417 1643 00");
  const [inputCoupon, setInputCoupon] = React.useState(couponCode || "");
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [simulateFailure, setSimulateFailure] = React.useState(false);

  // Sync server quote on mount & field changes
  React.useEffect(() => {
    syncServerQuote();
  }, [items, couponCode, shippingCountry, shippingMethod, syncServerQuote]);

  // Keep country synchronized
  const handleCountryChange = (code: string) => {
    setShippingCountry(code);
    setInternationalCountry(code);
    setShippingAddress((prev) => ({ ...prev, country: code }));
    if (sameAsShipping) {
      setBillingAddress((prev) => ({ ...prev, country: code }));
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponError(null);
    setCouponCode(inputCoupon.trim());
    const quote = await syncServerQuote();
    if (quote?.couponError) {
      setCouponError(quote.couponError);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode(null);
    setInputCoupon("");
    setCouponError(null);
  };

  const localSubtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const quotePricing = serverQuote?.pricing;
  const subtotal = quotePricing ? quotePricing.subtotal : localSubtotal;
  const discountAmount = quotePricing ? quotePricing.discountAmount : 0;
  const shippingFee = quotePricing
    ? quotePricing.shippingFee
    : shippingMethod === "express"
    ? 45
    : subtotal >= 200
    ? 0
    : 25;
  const taxAmount = quotePricing
    ? quotePricing.taxAmount
    : Math.round((subtotal - discountAmount) * 0.08 * 100) / 100;
  const total = quotePricing ? quotePricing.total : subtotal - discountAmount + shippingFee + taxAmount;

  // Primary Order & Payment Submission Handler
  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // 1. Create Checkout Intent on Server
      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const res = await fetch("/api/checkout/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
          customerEmail: email,
          items: items.map((it) => ({
            productId: it.id,
            productSlug: it.slug,
            size: it.size,
            color: it.color,
            quantity: it.quantity,
          })),
          shippingAddress,
          billingAddress: sameAsShipping ? shippingAddress : billingAddress,
          shippingMethod,
          couponCode: couponCode || undefined,
          idempotencyKey,
        }),
      });

      const intentData = await res.json();

      if (!res.ok || intentData.status !== "success") {
        throw new Error(intentData.message || intentData.errors?.join(", ") || "Failed to initialize payment");
      }

      const { orderNumber, paymentIntentId, isSimulated } = intentData;

      // 2. Process Stripe Webhook Confirmation
      // In Test Simulator mode or when using test card, trigger the verified server webhook event
      if (simulateFailure) {
        // Trigger simulated decline event to demonstrate failed payment handling
        await fetch("/api/checkout/simulate-webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderNumber,
            paymentIntentId,
            event: "payment_intent.payment_failed",
            reason: "Your card was declined by the issuing bank (Test Simulator Mode).",
          }),
        });
        throw new Error("Payment Authorization Declined: Insufficient funds or invalid card details.");
      }

      // Simulate the instant verified Stripe webhook event
      const webhookRes = await fetch("/api/checkout/simulate-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          paymentIntentId,
          event: "payment_intent.succeeded",
        }),
      });

      const webhookData = await webhookRes.json();
      if (!webhookRes.ok || webhookData.status !== "success") {
        throw new Error(webhookData.message || "Failed to confirm payment with webhook handler.");
      }

      // 3. Clear cart store on successful order completion
      clearCart();

      // 4. Save order to customer placed orders storage for profile sync
      try {
        const stored = JSON.parse(localStorage.getItem("winter_placed_orders") || "[]");
        if (!stored.includes(orderNumber)) {
          stored.unshift(orderNumber);
          localStorage.setItem("winter_placed_orders", JSON.stringify(stored));
        }
      } catch {}

      // 5. Navigate to Verified Order Confirmation View
      router.push(`/orders/${orderNumber}`);
    } catch (err: any) {
      console.error("Checkout submission failed:", err);
      setErrorMessage(err.message || "An unexpected error occurred during payment processing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#111] font-sans pb-16">
      {/* Top Checkout Header */}
      <header className="border-b border-gray-200 bg-white py-4 px-6 sm:px-12 lg:px-16 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-black">
            <ChevronLeft className="w-4 h-4" />
            <span>Return to bag</span>
          </Link>

          <Link href="/" className="inline-block">
            <span className="font-sans text-lg sm:text-xl font-bold tracking-[0.14em] text-[#111] uppercase">
              WARDROBE
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 py-8 sm:py-12">
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200 p-8 space-y-4 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
            <h2 className="font-editorial text-2xl">Your bag is empty</h2>
            <p className="text-xs text-gray-500 font-sans">
              There are no items to checkout. Please add items to your shopping bag.
            </p>
            <div className="pt-2">
              <Link href="/products">
                <Button className="bg-[#111] hover:bg-black text-white px-6 py-2.5 text-xs font-mono uppercase">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            {/* Left 7 Columns: Checkout Steps */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              {/* Step 1: Customer Contact */}
              <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#111] text-white flex items-center justify-center text-xs font-mono font-bold">
                      1
                    </span>
                    <h2 className="font-editorial text-xl font-normal text-black">Customer Contact</h2>
                  </div>
                  <span className="text-xs font-mono text-gray-400">Guest Checkout</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-mono text-gray-600">Email Address (for order tracking & receipts)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black font-sans"
                    placeholder="you@domain.com"
                  />
                  <p className="text-[0.68rem] text-gray-500 font-sans">
                    We will send the verified Stripe receipt and tracking notifications to this email.
                  </p>
                </div>
              </div>

              {/* Step 2: International Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#111] text-white flex items-center justify-center text-xs font-mono font-bold">
                    2
                  </span>
                  <h2 className="font-editorial text-xl font-normal text-black">Shipping Destination</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="sm:col-span-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-gray-600">Destination Country / Region</label>
                      <span className="text-2xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {targetCountryConfig.isTaxInclusive ? "VAT Included in Pricing" : "Tax Calculated at Checkout"}
                      </span>
                    </div>
                    <select
                      value={shippingAddress.country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black font-sans font-medium"
                    >
                      {Object.values(COUNTRIES_REGISTRY).map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name} ({c.code}) • {c.defaultCurrency}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-600">First Name</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-600">Last Name</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-gray-600">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rue du Rhône 42 / 123 Main St"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-gray-600">Apartment, Suite, Unit (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Penthouse 6B"
                      value={shippingAddress.apartment}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, apartment: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-600">City</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-600">
                      {targetCountryConfig.addressFormat.regionLabel}
                      {!targetCountryConfig.addressFormat.regionRequired && " (Optional)"}
                    </label>
                    <input
                      type="text"
                      required={targetCountryConfig.addressFormat.regionRequired}
                      placeholder={`e.g. ${targetCountryConfig.addressFormat.regionLabel}`}
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-600">
                      {targetCountryConfig.addressFormat.postalCodeLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={`e.g. ${targetCountryConfig.addressFormat.postalCodePlaceholder}`}
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-600">Phone (for Courier Tracking)</label>
                    <input
                      type="tel"
                      required={targetCountryConfig.addressFormat.requirePhone}
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Shipping Method Selection */}
              <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#111] text-white flex items-center justify-center text-xs font-mono font-bold">
                    3
                  </span>
                  <h2 className="font-editorial text-xl font-normal text-black">Delivery Speed & Transit</h2>
                </div>

                <div className="space-y-3 pt-2">
                  <label
                    onClick={() => setShippingMethod("standard")}
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                      shippingMethod === "standard"
                        ? "border-black bg-gray-50/70"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="accent-black"
                      />
                      <div>
                        <div className="font-semibold text-xs text-black">
                          Standard Delivery ({targetCountryConfig.flag} {targetCountryConfig.name})
                        </div>
                        <div className="text-2xs text-gray-500 font-mono">
                          Delivered Duty Paid (DDP) • 5–7 business days via National Postal / DHL Global
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-black">
                      {subtotal >= 200 ? "FREE" : "$25.00"}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod("express")}
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                      shippingMethod === "express"
                        ? "border-black bg-gray-50/70"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="accent-black"
                      />
                      <div>
                        <div className="font-semibold text-xs text-black">
                          Alpine Express Priority Courier
                        </div>
                        <div className="text-2xs text-gray-500 font-mono">
                          2–3 business days insured air courier with direct signature
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-black">$45.00</span>
                  </label>
                </div>
              </div>

              {/* Step 4: Billing Address */}
              <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#111] text-white flex items-center justify-center text-xs font-mono font-bold">
                    4
                  </span>
                  <h2 className="font-editorial text-xl font-normal text-black">Billing Address</h2>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-sans text-black">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="accent-black w-4 h-4 rounded"
                    />
                    <span>Billing address is identical to shipping address</span>
                  </label>
                </div>

                {!sameAsShipping && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-mono text-gray-600">Billing Street Address</label>
                      <input
                        type="text"
                        required
                        value={billingAddress.street}
                        onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-gray-600">City</label>
                      <input
                        type="text"
                        required
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-gray-600">
                        {targetCountryConfig.addressFormat.regionLabel}
                      </label>
                      <input
                        type="text"
                        required={targetCountryConfig.addressFormat.regionRequired}
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-gray-600">
                        {targetCountryConfig.addressFormat.postalCodeLabel}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={`e.g. ${targetCountryConfig.addressFormat.postalCodePlaceholder}`}
                        value={billingAddress.postalCode}
                        onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 5: International Payment Authorization & Stripe Integration */}
              <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#111] text-white flex items-center justify-center text-xs font-mono font-bold">
                      5
                    </span>
                    <h2 className="font-editorial text-xl font-normal text-black">Payment Authorization</h2>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xs font-mono bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200">
                      {targetCountryConfig.flag} {targetCountryConfig.code} Available
                    </span>
                    <div className="flex items-center gap-1 text-2xs font-mono text-gray-500">
                      <CreditCard className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Stripe Test Mode</span>
                    </div>
                  </div>
                </div>

                {/* Country-Specific Available Payment Badges with Real Visual Logos */}
                <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-gray-100">
                  <span className="text-2xs font-mono text-gray-500 mr-0.5">Accepted:</span>
                  <PaymentIconsRow />
                  {targetCountryConfig.supportedPaymentMethods.includes("ideal") && (
                    <div className="flex items-center px-1.5 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
                      <IdealLogo className="h-3.5 w-auto" />
                    </div>
                  )}
                  {targetCountryConfig.supportedPaymentMethods.includes("sepa_debit") && (
                    <div className="flex items-center px-1.5 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
                      <SepaLogo className="h-3.5 w-auto" />
                    </div>
                  )}
                </div>

                {/* Payment Method Selector with Visual Icons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      paymentMethod === "card"
                        ? "border-black bg-gray-50/80 shadow-xs ring-1 ring-black"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-semibold text-black">Credit Card</div>
                      <div className="flex items-center gap-1">
                        <VisaLogo className="h-2.5 w-auto" />
                        <MastercardLogo className="h-2.5 w-auto" />
                      </div>
                    </div>
                    <div className="text-2xs text-gray-500 font-mono">Global Visa/MC/Amex</div>
                  </button>

                  {targetCountryConfig.supportedPaymentMethods.includes("klarna") && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("klarna")}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        paymentMethod === "klarna"
                          ? "border-black bg-rose-50/50 shadow-xs ring-1 ring-black"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-semibold text-rose-950">Klarna</div>
                        <KlarnaLogo className="h-3 w-auto" />
                      </div>
                      <div className="text-2xs text-rose-700 font-mono">Pay in 30d / 3x</div>
                    </button>
                  )}

                  {targetCountryConfig.supportedPaymentMethods.includes("ideal") && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("ideal")}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        paymentMethod === "ideal"
                          ? "border-black bg-pink-50/50 shadow-xs ring-1 ring-black"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-semibold text-pink-950">iDEAL</div>
                        <IdealLogo className="h-3 w-auto" />
                      </div>
                      <div className="text-2xs text-pink-700 font-mono">Dutch Bank</div>
                    </button>
                  )}

                  {targetCountryConfig.supportedPaymentMethods.includes("sepa_debit") && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("sepa_debit")}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        paymentMethod === "sepa_debit"
                          ? "border-black bg-blue-50/50 shadow-xs ring-1 ring-black"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-semibold text-blue-950">SEPA Debit</div>
                        <SepaLogo className="h-3 w-auto" />
                      </div>
                      <div className="text-2xs text-blue-700 font-mono">EUR IBAN</div>
                    </button>
                  )}
                </div>

                {/* Conditional Method Content */}
                {paymentMethod === "card" && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-gray-50/50 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-600">Card Number (Stripe Simulator Ready)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-black pr-24"
                        />
                        <div className="absolute right-3 top-2.5 flex items-center gap-1.5 bg-white pl-1 pointer-events-none">
                          <VisaLogo className="h-3 w-auto" />
                          <MastercardLogo className="h-3.5 w-auto" />
                          <AmexLogo className="h-3.5 w-auto" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-600">Expiration Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-black"
                          placeholder="MM/YY"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-600">Security CVC</label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-black"
                          placeholder="CVC"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-600">Cardholder Name</label>
                      <input
                        type="text"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value.toUpperCase())}
                        className="w-full bg-white border border-gray-200 rounded px-3.5 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "klarna" && (
                  <div className="border border-rose-200 rounded-lg p-5 bg-rose-50/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-editorial text-sm font-semibold text-rose-950">Klarna Flexible Financing</span>
                      <span className="text-2xs font-mono text-rose-700 bg-rose-100 px-2 py-0.5 rounded">0% APR</span>
                    </div>
                    <p className="text-xs text-rose-900 leading-relaxed font-sans">
                      Pay after delivery in 30 days, or split into 3 interest-free installments of{" "}
                      <strong>
                        {formatLocalizedCurrency(
                          convertCurrency(total / 3, currency, rates).amount,
                          currency
                        )}
                      </strong>{" "}
                      per month. Klarna handles the direct bank settlement automatically.
                    </p>
                  </div>
                )}

                {paymentMethod === "ideal" && (
                  <div className="border border-pink-200 rounded-lg p-5 bg-pink-50/30 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-pink-950">Select Netherlands Banking Partner</label>
                      <select
                        value={idealBank}
                        onChange={(e) => setIdealBank(e.target.value)}
                        className="w-full bg-white border border-pink-200 rounded px-3 py-2 text-xs font-sans focus:outline-none focus:border-pink-500"
                      >
                        <option value="ing">ING Bank</option>
                        <option value="abn_amro">ABN AMRO</option>
                        <option value="rabobank">Rabobank</option>
                        <option value="asn">ASN Bank</option>
                        <option value="bunq">bunq</option>
                        <option value="sns">SNS Bank</option>
                      </select>
                    </div>
                    <p className="text-2xs text-pink-800 font-sans">
                      You will authorize this order through your bank app using secure iDEAL instant transfer.
                    </p>
                  </div>
                )}

                {paymentMethod === "sepa_debit" && (
                  <div className="border border-blue-200 rounded-lg p-5 bg-blue-50/30 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-blue-950">Eurozone IBAN Account</label>
                      <input
                        type="text"
                        value={iban}
                        onChange={(e) => setIban(e.target.value.toUpperCase())}
                        className="w-full bg-white border border-blue-200 rounded px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                        placeholder="e.g. DE89 3704 0044 0532 0130 00"
                      />
                    </div>
                    <p className="text-2xs text-blue-800 font-sans">
                      By authorizing this payment, you authorize KØRA and Stripe to send instructions to your bank to debit your account in EUR.
                    </p>
                  </div>
                )}

                {/* Developer Mode & Webhook Simulator Toggle */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Stripe Webhook Verification Simulation</span>
                  </div>
                  <p className="text-[0.72rem] text-amber-800 leading-relaxed font-sans">
                    All payment authorizations are verified server-side through real webhook events. Orders are never marked as paid based purely on a browser redirect.
                  </p>
                  <label className="flex items-center gap-2 text-xs font-mono text-amber-950 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulateFailure}
                      onChange={(e) => setSimulateFailure(e.target.checked)}
                      className="accent-amber-600 w-3.5 h-3.5 rounded"
                    />
                    <span>Simulate Payment Decline (tests failure error handling)</span>
                  </label>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-start gap-2.5 text-xs text-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Payment Failed</div>
                      <div>{errorMessage}</div>
                    </div>
                  </div>
                )}

                {/* Submit Order Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || (serverQuote?.errors && serverQuote.errors.length > 0)}
                  className="w-full bg-[#111] hover:bg-black text-white h-14 rounded-full flex items-center justify-center space-x-2 text-xs font-mono uppercase tracking-widest shadow-lg transition-transform hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing & Verifying Webhook...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Authorize Payment ($
                        {total.toFixed(2)} USD
                        {currency !== "USD" &&
                          ` • ~${formatLocalizedCurrency(
                            convertCurrency(total, currency, rates).amount,
                            currency
                          )}`}
                        )
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right 5 Columns: Sticky Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-5 sticky top-24">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-editorial text-xl font-normal text-black">Order Summary</h3>
                  <span className="text-xs font-mono text-gray-500">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Item List */}
                <div className="divide-y divide-gray-100 max-h-[340px] overflow-y-auto pr-1 space-y-2">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 py-2.5 items-center">
                      <div className="relative w-14 h-16 bg-gray-100 rounded-sm overflow-hidden shrink-0 border border-gray-200">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          sizes="56px"
                          className="object-cover object-center"
                        />
                        <span className="absolute -top-1 -right-1 bg-black text-white text-[0.62rem] font-mono font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-black truncate">{item.title}</h4>
                        <p className="text-[0.68rem] text-gray-500 font-mono">
                          {item.size} • {item.color}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-black shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <label className="text-[0.7rem] uppercase tracking-wider font-mono text-gray-500 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Apply Promotion</span>
                  </label>
                  {serverQuote?.appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded px-3 py-2 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-mono font-semibold">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{serverQuote.appliedCoupon.code}</span>
                        <span className="text-emerald-600 font-normal">
                          (-${discountAmount.toFixed(2)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-gray-400 hover:text-rose-600 text-xs font-mono"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. ARCTIC25"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-black"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        className="text-xs font-mono uppercase tracking-wider px-3.5"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                  {couponError && <p className="text-2xs text-rose-600 font-mono">{couponError}</p>}
                </div>

                {/* Final Recalculated Breakdown with Dual Currency Display */}
                <div className="space-y-2.5 text-xs pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Items Subtotal</span>
                    <div className="text-right">
                      <div className="font-mono text-black">${subtotal.toFixed(2)} USD</div>
                      {currency !== "USD" && (
                        <div className="text-2xs font-mono text-gray-500">
                          ~{formatLocalizedCurrency(convertCurrency(subtotal, currency, rates).amount, currency)}
                        </div>
                      )}
                    </div>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-700 font-medium">
                      <span>Promotional Discount</span>
                      <div className="text-right">
                        <span className="font-mono">-${discountAmount.toFixed(2)} USD</span>
                        {currency !== "USD" && (
                          <div className="text-2xs font-mono text-emerald-600">
                            ~-{formatLocalizedCurrency(convertCurrency(discountAmount, currency, rates).amount, currency)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-gray-600">
                    <div>
                      <span>Shipping ({shippingMethod === "express" ? "Express" : "Standard"})</span>
                      <div className="text-2xs text-gray-400 font-mono">DDP Insured Transit</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-black">
                        {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)} USD`}
                      </span>
                      {shippingFee > 0 && currency !== "USD" && (
                        <div className="text-2xs font-mono text-gray-500">
                          ~{formatLocalizedCurrency(convertCurrency(shippingFee, currency, rates).amount, currency)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <div>
                      <span>
                        Import Duties & {targetCountryConfig.taxType.toUpperCase()} ({targetCountryConfig.code})
                      </span>
                      <div className="text-2xs text-gray-400 font-mono">
                        {targetCountryConfig.isTaxInclusive ? "Price includes local VAT" : "Calculated country rate"}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-black">${taxAmount.toFixed(2)} USD</span>
                      {currency !== "USD" && (
                        <div className="text-2xs font-mono text-gray-500">
                          ~{formatLocalizedCurrency(convertCurrency(taxAmount, currency, rates).amount, currency)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-gray-200">
                    <div>
                      <span className="font-editorial text-lg text-black font-semibold block">Total to Pay</span>
                      <span className="text-2xs font-mono text-gray-500">
                        Authorized & charged in USD
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xl font-bold text-black">
                        ${total.toFixed(2)} USD
                      </div>
                      {currency !== "USD" && (
                        <div className="text-xs font-mono font-semibold text-emerald-700">
                          ~{formatLocalizedCurrency(convertCurrency(total, currency, rates).amount, currency)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Guaranteed Settlement Notice */}
                  {currency !== "USD" && (
                    <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-2xs font-sans text-neutral-600 space-y-1">
                      <div className="font-semibold text-neutral-900 flex items-center gap-1">
                        <Info className="w-3 h-3 text-neutral-700" />
                        <span>Currency Conversion Transparency</span>
                      </div>
                      <p>
                        {formatCurrencySettlementNotice(currency, "USD", rates[currency] || 1.0)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Guarantee Note */}
                <div className="bg-gray-50 p-3 rounded text-[0.68rem] text-gray-500 space-y-1 font-sans">
                  <div className="font-semibold text-black flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official Winter E-Commerce Guarantee</span>
                  </div>
                  <p>
                    30-Day complimentary return window. All orders ship insured with tracking number provided immediately after verified payment.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
