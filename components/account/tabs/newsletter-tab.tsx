"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Bell, Mail, CheckCircle2 } from "lucide-react";

export function NewsletterTab() {
  const { user, updateProfile } = useAuth();

  const [subscribed, setSubscribed] = React.useState(user?.newsletter_subscribed ?? true);
  const [frequency, setFrequency] = React.useState(user?.newsletter_frequency || "drops_only");
  const [notifyDrops, setNotifyDrops] = React.useState(user?.notify_drops ?? true);
  const [notifySales, setNotifySales] = React.useState(user?.notify_sales ?? true);
  const [notifyOrders, setNotifyOrders] = React.useState(user?.notify_orders ?? true);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      newsletter_subscribed: subscribed,
      newsletter_frequency: frequency as any,
      notify_drops: notifyDrops,
      notify_sales: notifySales,
      notify_orders: notifyOrders,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-[#EAEAEA] pb-4">
        <h2 className="font-sans text-xl font-bold tracking-tight text-[#111] uppercase">
          Communications & Newsletter Preferences
        </h2>
        <p className="text-xs text-[#666]">
          Tailor notifications for seasonal drops, private runway sales, and dispatch tracking.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#16A34A] flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Communication preferences updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] p-6 sm:p-8 space-y-6">
        {/* Master Subscription Toggle */}
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
          <div className="space-y-0.5">
            <span className="font-sans text-sm font-bold uppercase text-[#111] block">
              Alpine Journal & Editorial Dispatch
            </span>
            <p className="text-xs text-[#666]">
              Master subscription to all cold-weather fashion narratives and collections.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={subscribed}
              onChange={(e) => setSubscribed(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
          </label>
        </div>

        {/* Detailed Channel Checkboxes */}
        <div className="space-y-4 pt-2">
          <h4 className="text-2xs uppercase tracking-widest font-mono text-[#555]">
            Notification Channels
          </h4>

          <div className="space-y-3 text-xs">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyDrops}
                onChange={(e) => setNotifyDrops(e.target.checked)}
                className="mt-0.5 rounded-none border-gray-300 text-black focus:ring-black"
              />
              <div>
                <span className="font-semibold text-black block">Archival Drops & Limited Allocations</span>
                <span className="text-[#666] text-[0.72rem]">
                  Immediate priority alert 1 hour before seasonal jackets, parkas, and knitwear drops go public.
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifySales}
                onChange={(e) => setNotifySales(e.target.checked)}
                className="mt-0.5 rounded-none border-gray-300 text-black focus:ring-black"
              />
              <div>
                <span className="font-semibold text-black block">Private Archive Sales & Promotions</span>
                <span className="text-[#666] text-[0.72rem]">
                  Invitations to end-of-winter archival events and VIP tier private pricing.
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOrders}
                onChange={(e) => setNotifyOrders(e.target.checked)}
                className="mt-0.5 rounded-none border-gray-300 text-black focus:ring-black"
              />
              <div>
                <span className="font-semibold text-black block">Order Milestones & Courier Updates</span>
                <span className="text-[#666] text-[0.72rem]">
                  Critical updates regarding payment capture, dispatch flights, customs clearance, and delivery.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Frequency Choice */}
        <div className="space-y-3 pt-4 border-t border-[#EAEAEA]">
          <h4 className="text-2xs uppercase tracking-widest font-mono text-[#555]">
            Dispatch Frequency
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "drops_only", label: "Real-time Drops", desc: "Only urgent release announcements" },
              { id: "weekly", label: "Weekly Journal", desc: "Curated winter lookbooks every Monday" },
              { id: "monthly", label: "Monthly Digest", desc: "Single monthly overview of the collection" },
            ].map((f) => (
              <label
                key={f.id}
                className={`p-3 border cursor-pointer transition-all ${
                  frequency === f.id
                    ? "border-black bg-[#FAFBFD]"
                    : "border-[#EAEAEA] hover:border-black"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="frequency"
                    value={f.id}
                    checked={frequency === f.id}
                    onChange={(e) => setFrequency(e.target.value as "weekly" | "monthly" | "drops_only")}
                    className="text-black focus:ring-black"
                  />
                  <span className="font-semibold text-xs text-black">{f.label}</span>
                </div>
                <p className="text-[0.68rem] text-[#666] pl-5 pt-1">{f.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-end">
          <button
            type="submit"
            className="bg-black hover:bg-[#222] text-white px-8 py-3 text-xs uppercase tracking-widest font-mono transition-colors shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
