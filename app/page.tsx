import Link from "next/link";
import { NavigationBar } from "@/components/design-system/navigation-bar";
import { CampaignHeroBanner } from "@/components/design-system/editorial-banner";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal">
      <NavigationBar />
      
      <main className="flex-1">
        {/* Editorial Campaign Hero */}
        <CampaignHeroBanner
          title="HIGH COLD ARCHIVAL SERIES"
          subtitle="A study in thermal equilibrium. Hand-crafted down parkas, shearling outerwear, and cashmere mid-layers built for -30°C expeditions and quiet urban winters."
          eyebrow="Season 2026/27 Drop 01"
          ctaText="Explore Collection"
          imageUrl="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1920"
        />

        {/* Design System Access Banner */}
        <section className="max-w-7xl mx-auto px-6 py-16 sm:py-24 border-b border-canvas-muted">
          <div className="max-w-3xl space-y-6">
            <span className="editorial-caps text-forest font-semibold">
              Design System Foundation Active
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal tracking-tight">
              Quiet Luxury Editorial Design System
            </h2>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              We have established the complete, human-curated visual design architecture for VALLIS & ORE. 
              Review the color tokens, typography scale, spacing rhythm, button states, product card variations, 
              and promotional banners on our dedicated showcase.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <Link href="/design-system">
                <Button variant="forest" size="lg">
                  View Design System Showcase →
                </Button>
              </Link>
              <Link href="/design-system#cards">
                <Button variant="outline" size="lg">
                  Inspect Product Cards
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-canvas-muted bg-canvas-subtle py-12 px-6 text-center text-xs text-charcoal-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 VALLIS & ORE International. All rights reserved.</p>
          <div className="flex space-x-6 text-2xs uppercase tracking-widest text-charcoal-600">
            <span>New York</span>
            <span>London</span>
            <span>Paris</span>
            <span>Stockholm</span>
            <span>Zurich</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
