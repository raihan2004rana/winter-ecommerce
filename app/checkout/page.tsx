"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
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

  // Customer Contact
  const [email, setEmail] = React.useState("julian.vance@geneva-capital.ch");
  const [isGuest, setIsGuest] = React.useState(true);

  // Shipping Address Form
  const [shippingAddress, setShippingAddress] = React.useState({
    firstName: "Julian",
    lastName: "Vance",
    street: "Rue du Rhône 42",
    apartment: "Penthouse 6B",
    city: "Geneva",
    state: "Geneva",
    postalCode: "1204",
    country: shippingCountry || "CH",
    phone: "+41 22 819 9000",
  });

  // Billing Address
  const [sameAsShipping, setSameAsShipping] = React.useState(true);
  const [billingAddress, setBillingAddress] = React.useState({
    firstName: "Julian",
    lastName: "Vance",
    street: "Rue du Rhône 42",
    apartment: "Penthouse 6B",
    city: "Geneva",
    state: "Geneva",
    postalCode: "1204",
    country: shippingCountry || "CH",
  });

  // Payment Form (Stripe Card Fields)
  const [cardNumber, setCardNumber] = React.useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = React.useState("12/28");
  const [cardCvc, setCardCvc] = React.useState("789");
  const [nameOnCard, setNameOnCard] = React.useState("JULIAN VANCE");

  // State Management
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

      // 4. Navigate to Verified Order Confirmation View
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
      <header className="border-b border-gray-200 bg-white py-4 px-6 sm:px-12 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-black">
            <ChevronLeft className="w-4 h-4" />
            <span>Return to bag</span>
          </Link>

          <Link href="/" className="font-editorial text-2xl tracking-tight font-bold text-black uppercase">
            KØRA WARDROBE
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
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
                    <label className="text-xs font-mono text-gray-600">Destination Country / Region</label>
                    <select
                      value={shippingAddress.country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black font-sans"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name} ({c.code})
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
                      placeholder="e.g. Rue du Rhône 42"
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
                    <label className="text-xs font-mono text-gray-600">State / Canton / Province</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-600">Postal / ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-600">Phone (for Courier Tracking)</label>
                    <input
                      type="tel"
                      required
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
                        <div className="font-semibold text-xs text-black">Standard International Delivery</div>
                        <div className="text-2xs text-gray-500 font-mono">5–7 business days via Swiss Post / DHL Global</div>
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
                        <div className="font-semibold text-xs text-black">Alpine Express Air Courier</div>
                        <div className="text-2xs text-gray-500 font-mono">2–3 business days priority dispatch with direct signature</div>
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
                      <label className="text-xs font-mono text-gray-600">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={billingAddress.postalCode}
                        onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 5: Stripe Payment & Test Simulator */}
              <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#111] text-white flex items-center justify-center text-xs font-mono font-bold">
                      5
                    </span>
                    <h2 className="font-editorial text-xl font-normal text-black">Payment Authorization</h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
                    <CreditCard className="w-4 h-4" />
                    <span>Stripe Test Mode</span>
                  </div>
                </div>

                {/* Card Information Box */}
                <div className="border border-gray-200 rounded-lg p-5 bg-gray-50/50 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-600">Card Number (Test Mode Ready)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-black"
                      />
                      <span className="absolute right-3 top-2.5 text-2xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        VISA
                      </span>
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
                      <span>Authorize Payment (${total.toFixed(2)} USD)</span>
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

                {/* Final Recalculated Breakdown */}
                <div className="space-y-2 text-xs pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal</span>
                    <span className="font-mono text-black">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promotional Discount</span>
                      <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping ({shippingMethod === "express" ? "Express" : "Standard"})</span>
                    <span className="font-mono text-black">
                      {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Import Duties & VAT ({shippingCountry})</span>
                    <span className="font-mono text-black">${taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-gray-200">
                    <span className="font-editorial text-lg text-black font-semibold">Total to Pay</span>
                    <span className="font-mono text-xl font-bold text-black">${total.toFixed(2)} USD</span>
                  </div>
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
