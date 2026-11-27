"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ChevronDown,
  Clock,
  ShieldCheck,
  CheckCheck,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "advisor" | "user";
  text: string;
  time: string;
  link?: { href: string; label: string };
}

const QUICK_INQUIRIES = [
  {
    id: "size",
    label: "📏 Sizing & Fit Guide",
    query: "What is your sizing guidance for coats and knitwear?",
    response:
      "Our outerwear and tailored coats follow true-to-size European luxury sizing. If you plan to layer over heavy 450 GSM knitwear, we recommend taking your regular size as our shoulder cuts already incorporate subtle ease for layering.",
    link: { href: "/products", label: "Browse Outerwear" },
  },
  {
    id: "track",
    label: "📦 Track My Order",
    query: "How do I track my active shipment?",
    response:
      "You can view live courier dossiers, DHL tracking numbers, and delivery status directly inside your Private Client Area under Orders & Tracking.",
    link: { href: "/account", label: "Open Orders & Tracking" },
  },
  {
    id: "shipping",
    label: "✈️ International Duties & Tax",
    query: "Are import duties included in international shipping?",
    response:
      "Yes, every parcel dispatched by MAULI FASHION is sent DDP (Delivered Duty Paid). All national import taxes and customs clearance fees are pre-calculated. You will never receive an unexpected bill upon doorstep arrival.",
    link: { href: "/checkout", label: "View Shipping Zones" },
  },
  {
    id: "stylist",
    label: "✨ Speak with Live Stylist",
    query: "Can you help me curate a winter capsule wardrobe?",
    response:
      "With pleasure! Our signature winter capsule centers on three core layers: a 100% Mongolian Cashmere Turtleneck, a Tailored Double-Faced Overcoat, and shearling-lined Vibram boots for seamless city-to-chalet transitions.",
    link: { href: "/collections/women", label: "Explore Winter Capsule" },
  },
];

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(1);
  const [inputText, setInputText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "advisor",
      text: "Bonjour & Welcome to MAULI FASHION. I am Elena, your dedicated atelier concierge today. How may I assist you with garment specifications, sizing, or international shipping?",
      time: "Just now",
    },
  ]);

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Listen for manual open trigger (e.g. from footer)
  React.useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setUnreadCount(0);
    };
    window.addEventListener("open-live-chat", handleOpen);
    return () => window.removeEventListener("open-live-chat", handleOpen);
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    // Simulate concierge typing
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      // Check if it matches quick inquiry
      const matched = QUICK_INQUIRIES.find(
        (q) => q.query.toLowerCase() === text.toLowerCase()
      );

      let replyText = "";
      let replyLink = undefined;

      if (matched) {
        replyText = matched.response;
        replyLink = matched.link;
      } else {
        const lower = text.toLowerCase();
        if (lower.includes("price") || lower.includes("cost") || lower.includes("discount")) {
          replyText =
            "We offer complimentary worldwide courier shipping on all orders over $250. You can also use code WINTER20 at checkout for preferential promotional pricing.";
          replyLink = { href: "/checkout", label: "Proceed to Checkout" };
        } else if (lower.includes("return") || lower.includes("exchange")) {
          replyText =
            "We offer a 30-day complimentary return window on all unworn items with original archival tags intact. Return pickups are arranged directly with our courier partners.";
        } else if (lower.includes("size") || lower.includes("fit") || lower.includes("large") || lower.includes("small")) {
          replyText =
            "Our outerwear is engineered to accommodate luxury mid-layers comfortably. If you share your usual height and weight, I will be glad to advise the ideal size.";
        } else {
          replyText =
            "Thank you for contacting our atelier concierge. Your inquiry has been noted and our senior client team will assist you with tailored care. Is there anything specific regarding materials or shipping I can answer right now?";
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `advisor-${Date.now()}`,
          sender: "advisor",
          text: replyText,
          time: "Just now",
          link: replyLink,
        },
      ]);
    }, 1100);
  };

  return (
    <>
      {/* =========================================================================
          1. FLOATING CHAT TRIGGER BUTTON
          Placed at bottom-20 right-4 on mobile (above bottom nav) and bottom-6 right-6 on desktop
         ========================================================================= */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={handleToggle}
            aria-label="Open Atelier Concierge Chat"
            className="group relative flex items-center space-x-2.5 bg-[#121418] hover:bg-black text-white px-3.5 py-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-[#2B303C] transition-all duration-300 hover:scale-104 select-none"
          >
            {/* Live Green Beacon */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>

            <MessageSquare className="w-4 h-4 text-white" />

            <span className="hidden sm:inline-block font-sans text-xs font-semibold tracking-wider uppercase text-neutral-200">
              Concierge
            </span>

            {/* Unread Message Pill */}
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* =========================================================================
            2. INTERACTIVE LIVE CHAT MODAL
           ========================================================================= */}
        {isOpen && (
          <div className="w-[calc(100vw-32px)] sm:w-[380px] h-[520px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.22)] border border-neutral-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-neutral-900 font-sans">
            {/* Top Luxury Header */}
            <div className="bg-[#121418] text-white p-4 flex items-center justify-between border-b border-[#2B303C] shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-xs tracking-tight border border-neutral-700">
                    MF
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#121418] rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-sans font-bold text-xs tracking-wider uppercase text-white leading-tight">
                    MAULI FASHION Concierge
                  </h3>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-[10px] text-neutral-400 font-mono tracking-wide">
                      Elena • Senior Advisor
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-[10px] text-emerald-400 font-mono tracking-tight font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggle}
                aria-label="Close Concierge Chat"
                className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF9F6] text-xs scrollbar-thin">
              {/* Security & Authenticity Trust Pill */}
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center space-x-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-white border border-neutral-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-neutral-600" />
                  <span>Private Atelier Channel • Encrypted</span>
                </span>
              </div>

              {messages.map((msg) => {
                const isAdvisor = msg.sender === "advisor";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAdvisor ? "items-start" : "items-end"} space-y-1`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                        isAdvisor
                          ? "bg-white text-neutral-900 border border-neutral-200/80 rounded-tl-xs shadow-xs"
                          : "bg-neutral-900 text-white rounded-tr-xs shadow-xs"
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.link && (
                        <div className="mt-2.5 pt-2 border-t border-neutral-100">
                          <Link
                            href={msg.link.href}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center space-x-1 text-[11px] font-mono font-semibold text-neutral-900 hover:underline"
                          >
                            <span>{msg.link.label}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-neutral-400 px-1">
                      {msg.time}
                    </span>
                  </div>
                );
              })}

              {/* Typing Dots Simulator */}
              {isTyping && (
                <div className="flex items-center space-x-1.5 bg-white border border-neutral-200/80 px-3.5 py-2.5 rounded-2xl rounded-tl-xs w-20 shadow-xs">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Inquiries Carousel (One-click suggestions) */}
            <div className="px-3.5 py-2 bg-white border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {QUICK_INQUIRIES.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSend(q.query)}
                  className="whitespace-nowrap text-[11px] font-sans font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 hover:text-black px-2.5 py-1.5 rounded-full border border-neutral-200 transition-colors shrink-0"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Message Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-neutral-200 flex items-center space-x-2 shrink-0"
            >
              <input
                type="text"
                placeholder="Ask about sizing, styles, or tracking..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-neutral-100 border border-neutral-200 px-3.5 py-2 rounded-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                aria-label="Send Message"
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-black text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
