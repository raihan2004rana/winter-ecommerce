"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { WardrobeExactHeader } from "@/components/storefront/wardrobe-exact-header";
import { WardrobeExactFooter } from "@/components/storefront/wardrobe-exact-footer";
import { MiniCartDrawer } from "@/components/storefront/mini-cart-drawer";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Check,
  AlertCircle,
  Loader2,
  ChevronRight,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const COUNTRIES = [
  { code: "US", name: "United States (USD)", vat: "8% Est. Tax" },
  { code: "GB", name: "United Kingdom (GBP)", vat: "20% VAT" },
  { code: "DE", name: "Germany (EUR)", vat: "19% MwSt" },
  { code: "FR", name: "France (EUR)", vat: "20% TVA" },
  { code: "CH", name: "Switzerland (CHF)", vat: "8.1% MWST" },
  { code: "CA", name: "Canada (CAD)", vat: "13% HST/GST" },
  { code: "AU", name: "Australia (AUD)", vat: "10% GST" },
  { code: "JP", name: "Japan (JPY)", vat: "10% JCT" },
];

export default function ShoppingCartPage() {
  const {
    items,
    isOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeItem,
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

  const [inputCoupon, setInputCoupon] = React.useState(couponCode || "");
  const [couponError, setCouponError] = React.useState<string | null>(null);

  React.useEffect(() => {
    syncServerQuote();
  }, [items, couponCode, shippingCountry, shippingMethod, syncServerQuote]);

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
  const shippingFee = quotePricing ? quotePricing.shippingFee : shippingMethod === "express" ? 45 : subtotal >= 200 ? 0 : 25;
  const taxAmount = quotePricing ? quotePricing.taxAmount : Math.round((subtotal - discountAmount) * 0.08 * 100) / 100;
  const total = quotePricing ? quotePricing.total : subtotal - discountAmount + shippingFee + taxAmount;

  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111] font-sans">
      <WardrobeExactHeader
        cartCount={items.reduce((acc, it) => acc + it.quantity, 0)}
        onOpenCart={openCart}
        onOpenSearch={() => {}}
      />

      <MiniCartDrawer
        isOpen={isOpen}
        onClose={closeCart}
        currency="USD"
        items={items}
        onUpdateQuantity={(id, delta) => updateQuantity(id, delta)}
        onRemoveItem={(id) => removeItem(id)}
      />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-mono text-charcoal-400 mb-6">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold uppercase">Shopping Bag</span>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-baseline mb-8 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-black tracking-tight">
              Your Shopping Bag
            </h1>
            <p className="text-xs text-gray-500 font-mono mt-1">
              {items.length} {items.length === 1 ? "line item" : "line items"} • Server-validated inventory & tax rates
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-800 font-mono underline underline-offset-2 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Empty Shopping Bag</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200 p-8 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <Truck className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="font-editorial text-2xl text-black">Your bag is currently empty</h2>
            <p className="text-xs text-gray-500 font-sans leading-relaxed">
              Explore our architectural down coats, heavyweight merino knits, and alpine accessories.
            </p>
            <div className="pt-2">
              <Link href="/products">
                <Button className="bg-[#111] hover:bg-black text-white px-8 py-3 rounded-full text-xs font-mono uppercase tracking-wider">
                  Explore Winter Collection
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {/* Free Shipping Tier Meter */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-black">
                      {remainingForFreeShipping === 0
                        ? "You've unlocked Complimentary Express Transit!"
                        : `Add $${remainingForFreeShipping.toFixed(2)} more to unlock Free Express Shipping`}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-gray-500">{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 shadow-xs overflow-hidden">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="p-5 sm:p-6 flex gap-4 sm:gap-6 items-start">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-32 sm:w-28 sm:h-36 bg-gray-100 rounded-sm overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        sizes="112px"
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-h-[128px]">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-editorial text-lg text-black font-medium leading-snug">
                            {item.title}
                          </h3>
                          <span className="font-mono font-semibold text-sm text-black">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono">
                          Unit: ${item.price.toFixed(2)} USD
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono text-gray-600">
                          <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                            Size: {item.size}
                          </span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                            Color: {item.color}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Actions Bar */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-3">
                        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.id, -1, item.size, item.color)}
                            className="p-2 hover:bg-gray-200 transition-colors text-gray-600"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-mono text-xs font-semibold text-black select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1, item.size, item.color)}
                            className="p-2 hover:bg-gray-200 transition-colors text-gray-600"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id, item.size, item.color)}
                          className="text-gray-400 hover:text-rose-600 p-1.5 transition-colors text-xs flex items-center gap-1 font-mono"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stock or Validation Warnings */}
              {serverQuote?.errors && serverQuote.errors.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 space-y-2 text-xs text-rose-800">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Inventory Alert:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    {serverQuote.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary & Checkout Trigger */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-5 sticky top-24">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h2 className="font-editorial text-xl font-normal text-black">Summary</h2>
                  {isSyncing && (
                    <div className="flex items-center gap-1.5 text-[0.7rem] font-mono text-gray-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Validating...</span>
                    </div>
                  )}
                </div>

                {/* Country Selector for Real VAT Calculation */}
                <div className="space-y-1.5">
                  <label className="text-[0.7rem] uppercase tracking-wider font-mono text-gray-500 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Destination Country (Duties & VAT)</span>
                  </label>
                  <select
                    value={shippingCountry}
                    onChange={(e) => setShippingCountry(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-md px-3 py-2 text-black font-sans focus:outline-none focus:border-black"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} — {c.vat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shipping Method Selector */}
                <div className="space-y-2">
                  <label className="text-[0.7rem] uppercase tracking-wider font-mono text-gray-500">
                    Shipping Method
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setShippingMethod("standard")}
                      className={`p-2.5 rounded border text-left transition-all ${
                        shippingMethod === "standard"
                          ? "border-black bg-gray-50 font-medium"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-semibold text-black">Standard</div>
                      <div className="text-[0.7rem] text-gray-500 font-mono">
                        {subtotal >= 200 ? "FREE" : "$25.00"}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShippingMethod("express")}
                      className={`p-2.5 rounded border text-left transition-all ${
                        shippingMethod === "express"
                          ? "border-black bg-gray-50 font-medium"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-semibold text-black">Express Courier</div>
                      <div className="text-[0.7rem] text-gray-500 font-mono">$45.00 (2-3 d)</div>
                    </button>
                  </div>
                </div>

                {/* Coupon Input Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-2 pt-1">
                  <label className="text-[0.7rem] uppercase tracking-wider font-mono text-gray-500 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Promotional Code</span>
                  </label>
                  {serverQuote?.appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded px-3 py-2 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-mono font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{serverQuote.appliedCoupon.code}</span>
                        <span className="text-emerald-600 font-normal">
                          ({serverQuote.appliedCoupon.discountType === "percentage"
                            ? `${serverQuote.appliedCoupon.value}% OFF`
                            : `$${serverQuote.appliedCoupon.value} OFF`})
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
                        type="submit"
                        variant="outline"
                        className="text-xs font-mono uppercase tracking-wider px-4"
                      >
                        Apply
                      </Button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-2xs text-rose-600 font-mono">{couponError}</p>
                  )}
                </form>

                {/* Breakdown Table */}
                <div className="space-y-2 text-xs pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal</span>
                    <span className="font-mono text-black">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({serverQuote?.appliedCoupon?.code})</span>
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
                    <span>Estimated Duties & Taxes</span>
                    <span className="font-mono text-black">${taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-gray-200">
                    <span className="font-editorial text-lg text-black font-semibold">Total</span>
                    <span className="font-mono text-xl font-bold text-black">${total.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Primary Checkout CTA */}
                <Link href="/checkout" className="block w-full">
                  <Button
                    disabled={serverQuote?.errors && serverQuote.errors.length > 0}
                    className="w-full bg-[#111] hover:bg-black text-white h-12 rounded-full flex items-center justify-center space-x-2 text-xs font-mono uppercase tracking-widest shadow-md transition-all hover:scale-[1.01]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                {/* Security Trust Badges */}
                <div className="pt-2 flex items-center justify-center space-x-2 text-[0.68rem] text-gray-500 font-sans">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Stripe 256-Bit SSL Encrypted • PCI-DSS Compliant</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <WardrobeExactFooter />
    </div>
  );
}
