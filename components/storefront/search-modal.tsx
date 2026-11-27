"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Thermometer } from "lucide-react";
import { PRODUCTS_CATALOG, Product } from "@/data/products";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: "USD" | "EUR" | "GBP" | "CAD";
  onSelectProduct?: (product: Product) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  currency,
  onSelectProduct,
}: SearchModalProps) {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter products by query
  const filteredProducts = query.trim()
    ? PRODUCTS_CATALOG.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
          (p.materials && p.materials.some((m) => m.toLowerCase().includes(query.toLowerCase()))) ||
          (p.temperatureRating && p.temperatureRating.toLowerCase().includes(query.toLowerCase()))
      )
    : PRODUCTS_CATALOG.slice(0, 4);

  const quickSearches = [
    "850 Fill Goose Down",
    "-30°C Sub-Zero",
    "Cashmere Overcoat",
    "Shearling Boots",
    "GORE-TEX Shell",
    "Merino Cable Knit",
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas/98 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Top Bar with Input */}
      <div className="w-full border-b border-canvas-muted bg-canvas px-6 sm:px-12 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="relative flex-1 flex items-center">
            <Search className="h-5 w-5 text-charcoal-400 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by cold rating, garment, fill power, or material..."
              className="w-full bg-transparent text-charcoal text-base sm:text-lg placeholder:text-charcoal-400 focus:outline-none font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-charcoal-400 hover:text-charcoal text-xs uppercase font-mono px-2"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-charcoal hover:text-forest transition-colors border border-charcoal/20 hover:border-charcoal rounded-none"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search Body Container */}
      <div className="flex-1 overflow-y-auto max-w-5xl mx-auto w-full px-6 sm:px-12 py-8 space-y-8">
        {/* Quick Search Tags */}
        <div className="space-y-2">
          <span className="editorial-caps text-charcoal-500 block">Popular Thermal Inquiries</span>
          <div className="flex flex-wrap gap-2">
            {quickSearches.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-3 py-1.5 border border-canvas-muted bg-canvas-subtle hover:border-charcoal hover:bg-canvas text-xs text-charcoal transition-colors font-mono"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results / Recommended Garments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-canvas-muted pb-2">
            <span className="editorial-caps text-charcoal-600">
              {query ? `Results for "${query}" (${filteredProducts.length})` : "Curated Seasonal Recommendations"}
            </span>
            <span className="text-2xs font-mono text-charcoal-400">
              Prices displayed in {currency}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="font-serif text-xl text-charcoal">No garments matching &quot;{query}&quot;</p>
              <p className="text-xs text-charcoal-500">
                Try searching for broader terms such as &quot;Down&quot;, &quot;Cashmere&quot;, &quot;Parka&quot;, or &quot;Boot&quot;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  onClick={() => {
                    onClose();
                  }}
                  className="group cursor-pointer border border-canvas-muted bg-canvas-elevated p-3 space-y-2 transition-all duration-300 hover:border-charcoal hover:shadow-editorial block"
                >
                  <div className="relative aspect-editorial-tall w-full overflow-hidden bg-canvas-subtle">
                    <Image
                      src={p.primaryImage}
                      alt={p.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {p.temperatureRating && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="temp">{p.temperatureRating}</Badge>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="editorial-caps text-charcoal-400 block text-[0.65rem]">
                      {p.categoryLabel}
                    </span>
                    <h4 className="text-xs font-medium text-charcoal group-hover:text-forest transition-colors line-clamp-1">
                      {p.title}
                    </h4>
                    <p className="font-mono text-xs text-charcoal mt-1">
                      {formatCurrency(p.price, currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
