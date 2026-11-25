"use client";

import * as React from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth/auth-context";
import { Camera, CheckCircle2 } from "lucide-react";

export function PersonalInfoTab() {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = React.useState(user?.first_name || "");
  const [lastName, setLastName] = React.useState(user?.last_name || "");
  const [phone, setPhone] = React.useState(user?.phone || "");
  const [birthdate, setBirthdate] = React.useState(user?.birthdate || "1992-11-14");
  const [genderPreference, setGenderPreference] = React.useState<"all" | "men" | "women">(
    user?.gender_preference || "all"
  );
  const [preferredCurrency, setPreferredCurrency] = React.useState<"USD" | "EUR" | "GBP" | "CAD">(
    user?.preferred_currency || "USD"
  );
  const [avatarUrl, setAvatarUrl] = React.useState(
    user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  );
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const avatarOptions = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      first_name: firstName,
      last_name: lastName,
      phone,
      birthdate,
      gender_preference: genderPreference,
      preferred_currency: preferredCurrency,
      avatar_url: avatarUrl,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-[#EAEAEA] pb-4">
        <h2 className="font-sans text-xl font-bold tracking-tight text-[#111] uppercase">
          Personal Information & Profile
        </h2>
        <p className="text-xs text-[#666]">
          Manage your personal details, bespoke sizing profile, and client avatar.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#16A34A] flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Personal information updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] p-6 sm:p-8 space-y-8">
        {/* Profile Avatar Selection */}
        <div className="space-y-3">
          <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
            Profile Portrait / Avatar
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-black shrink-0">
              <Image
                src={avatarUrl}
                alt={firstName}
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-[#444] block">Select an editorial avatar or enter image URL:</span>
              <div className="flex items-center space-x-2">
                {avatarOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(opt)}
                    className={`relative h-10 w-10 rounded-full overflow-hidden border-2 transition-all ${
                      avatarUrl === opt ? "border-black scale-110" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={opt} alt="Avatar option" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Identity Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
            />
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
              Registered Email (Primary Authentication)
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full bg-[#F3F4F6] border border-[#E5E7EB] px-3.5 py-2.5 text-xs text-[#888] cursor-not-allowed font-sans"
            />
            <span className="text-[0.65rem] text-[#999] font-mono">
              Managed via Supabase Identity Provider
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
              Mobile Telephone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (415) 890-3419"
              className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
            />
          </div>
        </div>

        {/* Tailoring & Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
              Birthdate
            </label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
              Wardrobe Focus
            </label>
            <select
              value={genderPreference}
              onChange={(e) => setGenderPreference(e.target.value as any)}
              className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
            >
              <option value="all">Universal / All Garments</option>
              <option value="men">Men&apos;s Collection Focus</option>
              <option value="women">Women&apos;s Collection Focus</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
              Preferred Currency
            </label>
            <select
              value={preferredCurrency}
              onChange={(e) => setPreferredCurrency(e.target.value as any)}
              className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
            >
              <option value="USD">USD ($) United States</option>
              <option value="EUR">EUR (€) Eurozone</option>
              <option value="GBP">GBP (£) United Kingdom</option>
              <option value="CAD">CAD ($) Canada</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-end">
          <button
            type="submit"
            className="bg-black hover:bg-[#222] text-white px-8 py-3 text-xs uppercase tracking-widest font-mono transition-colors shadow-sm"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
