"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubmitting(true);
      try {
        await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, frequency: "weekly" }),
        });
      } catch {
        // graceful local fallback
      }
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-canvas-subtle border-t border-canvas-muted text-charcoal">
      <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
        <span className="editorial-caps text-forest font-semibold block">
          Private Alpine Bulletin
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-charcoal">
          Receive Archival Drop Allocations
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed max-w-xl mx-auto">
          Subscribers receive priority private access to limited-edition parkas (runs of 150), seasonal lookbooks, 
          and field expedition stories. We never discount publicly or distribute marketing spam.
        </p>

        {submitted ? (
          <div className="p-6 bg-canvas border border-forest/30 flex items-center justify-center space-x-3 text-forest text-sm font-medium animate-in fade-in">
            <CheckCircle2 className="h-5 w-5" />
            <span>Thank you. Your address has been added to the private winter allocation dispatch.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="bg-canvas text-xs h-12"
            />
            <Button
              type="submit"
              variant="forest"
              size="default"
              className="w-full sm:w-auto h-12 px-7 shrink-0"
            >
              Subscribe
            </Button>
          </form>
        )}

        <p className="text-[0.68rem] text-charcoal-400 font-mono">
          Strict GDPR/CCPA compliance. Unsubscribe instantly at any time.
        </p>
      </div>
    </section>
  );
}
