"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-canvas border-b border-canvas-muted shadow-editorial-dropdown transition-all duration-300 z-50 animate-in fade-in slide-in-from-top-2"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 grid grid-cols-12 gap-8 text-charcoal">
        {/* Column 1: Outerwear & Coats */}
        <div className="col-span-3 space-y-4">
          <Link
            href="/category/jackets-coats"
            onClick={onClose}
            className="editorial-caps text-forest font-semibold block border-b border-canvas-muted pb-2 hover:text-black transition-colors"
          >
            Outerwear & Down →
          </Link>
          <ul className="space-y-2.5 text-xs text-charcoal-700">
            <li>
              <Link href="/products/nordic-expedition-down-parka" onClick={onClose} className="hover:text-forest transition-colors block">
                Sub-Zero Expedition Parkas (-30°C)
              </Link>
            </li>
            <li>
              <Link href="/products/classic-winter-down-coat" onClick={onClose} className="hover:text-forest transition-colors block">
                Tailored Double-Faced Wool Coats
              </Link>
            </li>
            <li>
              <Link href="/products/thermal-insulated-shell-coat" onClick={onClose} className="hover:text-forest transition-colors block">
                3-Layer GORE Alpine Hard Shells
              </Link>
            </li>
            <li>
              <Link href="/products/ultra-lightweight-down-jacket" onClick={onClose} className="hover:text-forest transition-colors block">
                Lightweight Quilted Down Vests
              </Link>
            </li>
            <li>
              <Link href="/products/belted-longline-down-coat" onClick={onClose} className="hover:text-forest transition-colors block">
                Belted Longline Down Parkas
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Knitwear & Mid-Layers */}
        <div className="col-span-3 space-y-4">
          <Link
            href="/category/sweaters-hoodies"
            onClick={onClose}
            className="editorial-caps text-forest font-semibold block border-b border-canvas-muted pb-2 hover:text-black transition-colors"
          >
            Knitwear & Layers →
          </Link>
          <ul className="space-y-2.5 text-xs text-charcoal-700">
            <li>
              <Link href="/products/pure-cashmere-crewneck-sweater" onClick={onClose} className="hover:text-forest transition-colors block">
                100% Mongolian Cashmere Sweaters
              </Link>
            </li>
            <li>
              <Link href="/products/heavyweight-merino-cable-knit" onClick={onClose} className="hover:text-forest transition-colors block">
                Heavyweight 450 GSM Merino Knits
              </Link>
            </li>
            <li>
              <Link href="/products/thermal-cashmere-turtleneck" onClick={onClose} className="hover:text-forest transition-colors block">
                Thermal Cashmere Turtlenecks
              </Link>
            </li>
            <li>
              <Link href="/category/sweaters-hoodies" onClick={onClose} className="hover:text-forest transition-colors block">
                Polartec High-Pile Sherpa Fleece
              </Link>
            </li>
            <li>
              <Link href="/category/sweaters-hoodies" onClick={onClose} className="hover:text-forest transition-colors block">
                Hydrophobic Base Layer Tops
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Footwear & Accessories */}
        <div className="col-span-3 space-y-4">
          <Link
            href="/category/boots-accessories"
            onClick={onClose}
            className="editorial-caps text-forest font-semibold block border-b border-canvas-muted pb-2 hover:text-black transition-colors"
          >
            Footwear & Gear →
          </Link>
          <ul className="space-y-2.5 text-xs text-charcoal-700">
            <li>
              <Link href="/products/shearling-lined-alpine-boots" onClick={onClose} className="hover:text-forest transition-colors block">
                Shearling-Lined Alpine Boots
              </Link>
            </li>
            <li>
              <Link href="/products/merino-ribbed-balaclava-beanie" onClick={onClose} className="hover:text-forest transition-colors block">
                Merino Ribbed Beanies & Balaclavas
              </Link>
            </li>
            <li>
              <Link href="/products/thistle-brushed-cashmere-scarf" onClick={onClose} className="hover:text-forest transition-colors block">
                Thistle-Brushed Cashmere Scarves
              </Link>
            </li>
            <li>
              <Link href="/category/boots-accessories" onClick={onClose} className="hover:text-forest transition-colors block">
                Deerskin PrimaLoft Gold Gloves
              </Link>
            </li>
            <li>
              <Link href="/category/boots-accessories" onClick={onClose} className="hover:text-forest transition-colors block">
                Vibram Arctic Grip Ice Walkers
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Curated Editorial Visual Drop */}
        <div className="col-span-3 bg-canvas-subtle border border-canvas-muted p-4 flex flex-col justify-between">
          <div className="relative aspect-editorial-tall w-full overflow-hidden bg-canvas mb-3">
            <Image
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600"
              alt="Archival winter drop campaign"
              fill
              className="object-cover object-center"
            />
            <div className="absolute top-2 left-2">
              <Badge variant="temp">-30°C RATED</Badge>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[0.65rem] uppercase tracking-widest text-charcoal-500 font-mono">
              Editorial Drop 01
            </span>
            <h4 className="font-serif text-sm text-charcoal font-normal">
              Sub-Zero Expedition Parkas
            </h4>
            <Link
              href="/category/jackets-coats"
              onClick={onClose}
              className="text-2xs uppercase tracking-widest text-forest font-medium hover:underline block pt-1"
            >
              Explore Collection →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
