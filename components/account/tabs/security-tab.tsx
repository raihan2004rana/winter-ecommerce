"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Lock, Shield, KeyRound, Smartphone, CheckCircle2, AlertCircle } from "lucide-react";

export function SecurityTab() {
  const { updatePassword, user } = useAuth();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword.length < 8) {
      setErrorMessage("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    setSubmitting(true);
    const res = await updatePassword(newPassword);
    setSubmitting(false);

    if (res.success) {
      setSuccessMessage("Security credentials updated. New password is now active.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setErrorMessage(res.error || "Unable to update password.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="border-b border-[#EAEAEA] pb-4">
        <h2 className="font-sans text-xl font-bold tracking-tight text-[#111] uppercase">
          Password & Account Security
        </h2>
        <p className="text-xs text-[#666]">
          Manage credentials, multi-factor authentication, and monitor active sessions.
        </p>
      </div>

      {successMessage && (
        <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#16A34A] flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-[#FEF2F2] border border-[#F87171] text-xs text-[#B91C1C] flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Password Update Form */}
      <div className="bg-white border border-[#EAEAEA] p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2 border-b border-[#EAEAEA] pb-3">
          <KeyRound className="h-4 w-4 text-[#111]" />
          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#111]">
            Change Password
          </h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div className="space-y-1.5">
            <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
              New Password (min. 8 characters)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-black hover:bg-[#222] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-mono transition-colors disabled:opacity-50 mt-2"
          >
            {submitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication Toggle */}
      <div className="bg-white border border-[#EAEAEA] p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-[#111]" />
              <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#111]">
                Two-Factor Authentication (2FA)
              </h3>
            </div>
            <p className="text-xs text-[#666] max-w-xl">
              Require a time-based one-time authentication code (TOTP) from Google Authenticator or 1Password when signing in from unrecognized locations.
            </p>
          </div>

          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`px-4 py-2 text-2xs uppercase font-mono tracking-wider font-semibold border transition-all ${
              twoFactorEnabled
                ? "bg-[#16A34A] text-white border-[#16A34A]"
                : "bg-white text-[#111] border-[#111] hover:bg-[#111] hover:text-white"
            }`}
          >
            {twoFactorEnabled ? "2FA Enabled" : "Enable 2FA"}
          </button>
        </div>
      </div>

      {/* Active Device Sessions */}
      <div className="bg-white border border-[#EAEAEA] p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
          <div className="space-y-0.5">
            <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#111]">
              Active Login Sessions
            </h3>
            <p className="text-2xs text-[#777] font-mono">
              Devices currently authorized on your customer account
            </p>
          </div>

          <button
            onClick={() => alert("All other active device sessions have been terminated.")}
            className="text-2xs uppercase font-mono tracking-widest text-[#B91C1C] hover:underline"
          >
            Sign Out All Other Devices
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#FAFBFD] border border-[#EAEAEA] text-xs">
            <div className="space-y-0.5">
              <p className="font-semibold text-black">Windows 11 • Google Chrome</p>
              <p className="text-2xs font-mono text-[#777]">St. Moritz, Switzerland • IP: 185.122.90.14</p>
            </div>
            <span className="text-2xs uppercase font-mono font-semibold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 border border-[#BBF7D0]">
              Active Now
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#FAFBFD] border border-[#EAEAEA] text-xs">
            <div className="space-y-0.5">
              <p className="font-semibold text-black">iPhone 16 Pro • Safari Mobile</p>
              <p className="text-2xs font-mono text-[#777]">London, United Kingdom • IP: 82.41.10.88</p>
            </div>
            <span className="text-2xs font-mono text-[#777]">
              2 days ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
