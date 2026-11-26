"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export interface CartItem {
  id: string;
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

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-charcoal-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Body */}
      <div className="w-full max-w-md bg-canvas border-l border-canvas-muted flex flex-col h-full text-charcoal shadow-editorial-dropdown animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-canvas-muted flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="font-serif text-xl font-normal text-charcoal">Shopping Bag</h2>
            <p className="text-2xs uppercase tracking-widest text-charcoal-500 font-mono">
              {items.length} {items.length === 1 ? "Item" : "Items"} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-charcoal-600 hover:text-charcoal transition-colors"
            aria-label="Close bag"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Express Shipping Meter */}
        <div className="bg-canvas-subtle p-4 border-b border-canvas-muted text-xs space-y-2">
          <div className="flex items-center justify-between text-2xs uppercase tracking-editorial">
            <span className="text-charcoal-600">Worldwide Express Shipping</span>
            <span className="font-medium text-forest">
              {remainingForFreeShipping === 0 ? "Qualified" : `$${remainingForFreeShipping} Away`}
            </span>
          </div>
          <div className="w-full bg-canvas-muted h-1 rounded-none overflow-hidden">
            <div
              className="bg-forest h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[0.68rem] text-charcoal-500 leading-tight">
            {remainingForFreeShipping === 0
              ? "You have unlocked complimentary expedited international air delivery."
              : `Add ${formatCurrency(remainingForFreeShipping, currency)} more to unlock free express courier shipping.`}
          </p>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="font-serif text-lg text-charcoal">Your bag is currently empty.</p>
              <p className="text-xs text-charcoal-500 max-w-xs mx-auto">
                Explore our winter collection drops to discover high-performance outerwear and cashmere mid-layers.
              </p>
              <Button variant="outline" size="sm" onClick={onClose}>
                Continue Browsing
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex items-start space-x-4 border-b border-canvas-muted pb-6"
              >
                <div className="relative h-24 w-18 shrink-0 bg-canvas-subtle border border-canvas-muted overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-medium text-charcoal line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="text-2xs text-charcoal-500 uppercase font-mono space-x-2">
                    <span>Size: {item.size}</span>
                    <span>•</span>
                    <span>Color: {item.color}</span>
                  </div>
                  <p className="font-mono text-xs text-charcoal font-medium pt-1">
                    {formatCurrency(item.price, currency)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-canvas-muted">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="h-6 w-6 flex items-center justify-center text-xs hover:bg-canvas-muted"
                      >
                        -
                      </button>
                      <span className="h-6 w-8 flex items-center justify-center text-2xs font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="h-6 w-6 flex items-center justify-center text-xs hover:bg-canvas-muted"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-charcoal-400 hover:text-alpine-clay text-2xs flex items-center space-x-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {items.length > 0 && (
          <div className="p-6 border-t border-canvas-muted bg-canvas-subtle space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-charcoal">
                  {formatCurrency(subtotal, currency)}
                </span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>International Duties & VAT</span>
                <span className="text-2xs font-medium text-forest">Calculated at Step 2</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-baseline">
              <span className="font-serif text-sm font-medium">Estimated Total</span>
              <span className="font-mono text-base font-semibold text-charcoal">
                {formatCurrency(subtotal, currency)}
              </span>
            </div>

            <Link href="/checkout" onClick={onClose} className="block w-full">
              <Button
                variant="forest"
                className="w-full flex items-center justify-center space-x-2 h-12 bg-[#111] hover:bg-black text-white"
              >
                <span>Proceed to International Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link
              href="/cart"
              onClick={onClose}
              className="block text-center text-xs text-charcoal-600 hover:text-black font-mono underline underline-offset-4 pt-1"
            >
              View Full Shopping Bag & Estimate Duties
            </Link>

            <div className="flex items-center justify-center space-x-1.5 text-[0.68rem] text-charcoal-500 pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-forest" />
              <span>PCI-DSS SAQ A 256-Bit Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
