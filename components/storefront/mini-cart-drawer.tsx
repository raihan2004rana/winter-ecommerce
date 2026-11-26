"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export interface CartItem {
  id: string;
  slug?: string;
  title: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
}

interface MiniCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currency: "USD" | "EUR" | "GBP" | "CAD";
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export function MiniCartDrawer({
  isOpen,
  onClose,
  currency,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: MiniCartDrawerProps) {
  if (!isOpen) return null;

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} aria-label="Close cart drawer" />

      {/* Main Drawer Body */}
      <div className="w-full max-w-[440px] sm:max-w-[480px] bg-white border-l border-neutral-200 flex flex-col h-full text-neutral-900 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* =========================================================================
            HEADER: Brand + Count + Close
           ========================================================================= */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4 text-neutral-900" />
              <h2 className="font-editorial text-2xl font-normal text-neutral-900 tracking-tight">
                Shopping Bag
              </h2>
            </div>
            <p className="text-[0.68rem] uppercase tracking-widest text-neutral-500 font-mono">
              {totalCount} {totalCount === 1 ? "Item" : "Items"} Selected
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
            aria-label="Close bag"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =========================================================================
            FREE WORLDWIDE EXPRESS SHIPPING PROGRESS BAR
           ========================================================================= */}
        <div className="bg-neutral-50 p-4 border-b border-neutral-200 text-xs space-y-2">
          <div className="flex items-center justify-between text-[0.68rem] uppercase font-mono tracking-wider">
            <span className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <Truck className="h-3.5 w-3.5 text-neutral-900" />
              <span>Worldwide Express Shipping</span>
            </span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full text-[0.62rem] ${
                remainingForFreeShipping === 0
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-neutral-200 text-neutral-800"
              }`}
            >
              {remainingForFreeShipping === 0
                ? "Qualified Free Transit"
                : `$${remainingForFreeShipping.toFixed(0)} Away`}
            </span>
          </div>

          {/* Meter Bar */}
          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                remainingForFreeShipping === 0 ? "bg-emerald-600" : "bg-neutral-900"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[0.68rem] text-neutral-500 leading-tight">
            {remainingForFreeShipping === 0 ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                You unlocked complimentary expedited worldwide express air delivery!
              </span>
            ) : (
              `Add ${formatCurrency(remainingForFreeShipping, currency)} more to qualify for complimentary express courier transit.`
            )}
          </p>
        </div>

        {/* =========================================================================
            ITEMS LIST (With Prominent High-Def Product Thumbnails)
           ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-thin">
          {items.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="font-editorial text-2xl text-neutral-900">Your bag is empty</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                Discover our curated technical outerwear, merino knitwear, and winter essentials.
              </p>
              <button
                onClick={onClose}
                className="inline-block mt-2 px-6 py-2.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-widest hover:bg-black transition-colors"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex items-start gap-4 p-3.5 bg-white border border-neutral-200 rounded-xs shadow-2xs hover:border-neutral-300 transition-colors"
              >
                {/* Product Photo Thumbnail (Proper aspect ratio, never collapsed) */}
                <div className="relative w-20 h-26 sm:w-22 sm:h-28 aspect-[3/4] shrink-0 bg-[#F4F4F6] border border-neutral-200 overflow-hidden rounded-xs">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    sizes="100px"
                    className="object-cover object-center"
                  />
                </div>

                {/* Product Content Details */}
                <div className="flex-1 flex flex-col justify-between min-h-[104px] space-y-2">
                  <div>
                    <h4 className="text-xs sm:text-[0.81rem] font-medium text-neutral-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    {/* Variant Pills: Size & Color */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[0.62rem] font-mono uppercase tracking-wider text-neutral-500">
                      <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded-2xs font-medium">
                        Size: {item.size}
                      </span>
                      <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded-2xs font-medium">
                        Color: {item.color}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                    {/* Stepper */}
                    <div className="inline-flex items-center border border-neutral-300 bg-neutral-50/80 rounded-2xs">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="h-6 w-6 flex items-center justify-center text-xs text-neutral-600 hover:bg-neutral-200 hover:text-black transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="h-6 w-7 flex items-center justify-center text-xs font-mono font-bold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="h-6 w-6 flex items-center justify-center text-xs text-neutral-600 hover:bg-neutral-200 hover:text-black transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total & Remove */}
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900">
                        {formatCurrency(item.price * item.quantity, currency)}
                      </span>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove item from bag"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* =========================================================================
            FOOTER: Summary, Checkout CTA & Trust Badges
           ========================================================================= */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-neutral-200 bg-neutral-50 space-y-4">
            {/* Financial Rows */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({totalCount} items)</span>
                <span className="font-bold text-neutral-900">
                  {formatCurrency(subtotal, currency)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Worldwide Shipping</span>
                <span className={remainingForFreeShipping === 0 ? "text-emerald-700 font-semibold" : "text-neutral-700"}>
                  {remainingForFreeShipping === 0 ? "FREE EXPRESS" : "Standard Rate"}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500 text-[0.68rem]">
                <span>Taxes & Customs Duties</span>
                <span>Calculated at Checkout (DDP)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
              <span className="font-sans text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                Estimated Total
              </span>
              <span className="font-mono text-lg font-bold text-neutral-900">
                {formatCurrency(subtotal, currency)}
              </span>
            </div>

            {/* High-Impact Checkout Button */}
            <Link href="/checkout" onClick={onClose} className="block w-full">
              <button className="w-full h-12 sm:h-13 bg-neutral-900 hover:bg-black text-white px-5 flex items-center justify-between text-xs font-mono uppercase tracking-widest font-semibold transition-all shadow-md hover:shadow-lg group">
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <Link
              href="/cart"
              onClick={onClose}
              className="block text-center text-xs text-neutral-600 hover:text-black font-mono underline underline-offset-4"
            >
              View Full Shopping Bag & Manage Items
            </Link>

            {/* Trust Footer Badges */}
            <div className="pt-2 border-t border-neutral-200 grid grid-cols-3 gap-2 text-[0.62rem] font-mono text-neutral-500 text-center">
              <div className="flex flex-col items-center">
                <Lock className="h-3.5 w-3.5 text-neutral-700 mb-0.5" />
                <span>256-Bit SSL</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="h-3.5 w-3.5 text-neutral-700 mb-0.5" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 mb-0.5" />
                <span>Buyer Protection</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
