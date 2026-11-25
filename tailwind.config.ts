import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // Warm Off-White Background Palette (Editorial, linen, chalk, raw ecru)
        canvas: {
          DEFAULT: "#FAF9F5", // Warm gallery off-white
          subtle: "#F4F2EC",  // Soft linen card/surface background
          muted: "#EDE9E1",   // Warm neutral divider/border
          elevated: "#FFFFFF",// Pristine card fill
          dark: "#141514",    // Inverted editorial dark background
        },
        // Charcoal Typography & Deep Accents (High contrast, never harsh jet black)
        charcoal: {
          DEFAULT: "#18191A", // Deep charcoal primary body & headings
          900: "#111213",     // Maximum contrast headings
          800: "#18191A",     // Primary text
          700: "#2B2D2F",     // Subtle secondary text
          600: "#494C50",     // Muted labels & captions
          500: "#70747A",     // Secondary metadata
          400: "#9BA0A8",     // Placeholder & subtle icons
          200: "#DCDFE4",     // Crisp architectural borders
          100: "#EFEFEF",     // Very light hair-line dividers
        },
        // Muted Forest Green Accents (Pine needle, deep moss, spruce)
        forest: {
          DEFAULT: "#2B3D2E", // Signature muted forest green
          deep: "#1C281F",    // Deep evergreen hover state
          moss: "#3B5240",    // Mid-tone spruce
          mist: "#E8ECE9",    // Ultra-soft forest wash for badges/highlights
          tint: "#F0F4F1",    // Pale pine tint
        },
        // Subtle Icy-Blue Secondary Tones (Glacial mist, frost veil)
        ice: {
          DEFAULT: "#768C9E", // Subtle glacier grey-blue
          deep: "#3D5263",    // Deep alpine dusk
          soft: "#DDE7EE",    // Light frost accent
          mist: "#F0F5F8",    // Subtle winter ice wash
          frost: "#E4EDF3",   // Temperature badge background
        },
        // Warm Alpine Earth Accents (Subtle secondary signals)
        alpine: {
          amber: "#9E6D38",  // Down fill power & warmth indicator
          clay: "#A35C4A",   // Editorial sub-zero callout
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Didot", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.08em" }],
        xs: ["0.75rem", { lineHeight: "1.125rem", letterSpacing: "0.04em" }],
        sm: ["0.84375rem", { lineHeight: "1.35rem", letterSpacing: "0.01em" }],
        base: ["0.9375rem", { lineHeight: "1.55rem", letterSpacing: "-0.01em" }],
        lg: ["1.0625rem", { lineHeight: "1.65rem", letterSpacing: "-0.015em" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.02em" }],
        "2xl": ["1.625rem", { lineHeight: "2rem", letterSpacing: "-0.025em" }],
        "3xl": ["2.125rem", { lineHeight: "2.5rem", letterSpacing: "-0.03em" }],
        "4xl": ["2.875rem", { lineHeight: "3.25rem", letterSpacing: "-0.035em" }],
        "5xl": ["3.75rem", { lineHeight: "4rem", letterSpacing: "-0.04em" }],
        "display-sm": ["2.25rem", { lineHeight: "2.75rem", letterSpacing: "-0.02em" }],
        "display-lg": ["4.5rem", { lineHeight: "4.75rem", letterSpacing: "-0.03em" }],
      },
      letterSpacing: {
        widest: "0.22em",
        editorial: "0.14em",
        tightest: "-0.035em",
      },
      borderRadius: {
        none: "0px",
        subtle: "1px",
        sm: "2px",
        DEFAULT: "3px",
        md: "4px",
      },
      aspectRatio: {
        "editorial-tall": "3 / 4",
        "editorial-portrait": "4 / 5",
        "editorial-square": "1 / 1",
        "editorial-wide": "16 / 9",
        "editorial-banner": "21 / 9",
      },
      transitionDuration: {
        "400": "400ms",
        "700": "700ms",
        "1000": "1000ms",
      },
      transitionTimingFunction: {
        "editorial-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      boxShadow: {
        editorial: "0 1px 3px 0 rgba(24, 25, 26, 0.03), 0 4px 12px 0 rgba(24, 25, 26, 0.02)",
        "editorial-hover": "0 8px 24px -4px rgba(24, 25, 26, 0.06)",
        "editorial-dropdown": "0 10px 30px -4px rgba(24, 25, 26, 0.08)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
