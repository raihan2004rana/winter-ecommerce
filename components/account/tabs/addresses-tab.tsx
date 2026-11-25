"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { CustomerAddress } from "@/lib/auth/types";
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, X } from "lucide-react";

export function AddressesTab() {
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultShippingAddress,
  } = useAuth();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Form states
  const [title, setTitle] = React.useState("Primary Residence");
  const [firstName, setFirstName] = React.useState("Julian");
  const [lastName, setLastName] = React.useState("Vallis");
  const [company, setCompany] = React.useState("");
  const [addressLine1, setAddressLine1] = React.useState("");
  const [addressLine2, setAddressLine2] = React.useState("");
  const [city, setCity] = React.useState("");
  const [stateProvince, setStateProvince] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("US");
  const [phone, setPhone] = React.useState("");
  const [isDefaultShipping, setIsDefaultShipping] = React.useState(false);

  const openAddModal = () => {
    setEditingId(null);
    setTitle("Delivery Address");
    setFirstName("Julian");
    setLastName("Vallis");
    setCompany("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setStateProvince("");
    setPostalCode("");
    setCountryCode("US");
    setPhone("+1 (415) 890-3419");
    setIsDefaultShipping(false);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: CustomerAddress) => {
    setEditingId(addr.id);
    setTitle(addr.title);
    setFirstName(addr.first_name);
    setLastName(addr.last_name);
    setCompany(addr.company || "");
    setAddressLine1(addr.address_line1);
    setAddressLine2(addr.address_line2 || "");
    setCity(addr.city);
    setStateProvince(addr.state_province);
    setPostalCode(addr.postal_code);
    setCountryCode(addr.country_code);
    setPhone(addr.phone);
    setIsDefaultShipping(addr.is_default_shipping);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine1 || !city || !postalCode) return;

    if (editingId) {
      await updateAddress(editingId, {
        title,
        first_name: firstName,
        last_name: lastName,
        company,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        state_province: stateProvince,
        postal_code: postalCode,
        country_code: countryCode,
        phone,
        is_default_shipping: isDefaultShipping,
      });
    } else {
      await addAddress({
        title,
        first_name: firstName,
        last_name: lastName,
        company,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        state_province: stateProvince,
        postal_code: postalCode,
        country_code: countryCode,
        phone,
        is_default_shipping: isDefaultShipping,
        is_default_billing: false,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
        <div>
          <h2 className="font-sans text-xl font-bold tracking-tight text-[#111] uppercase">
            Saved Delivery Destinations
          </h2>
          <p className="text-xs text-[#666]">
            Configure and default addresses for frictionless international dispatch.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-black hover:bg-[#222] text-white px-4 py-2.5 text-2xs uppercase tracking-widest font-mono transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white border p-6 space-y-4 relative ${
              addr.is_default_shipping ? "border-black shadow-xs" : "border-[#EAEAEA]"
            }`}
          >
            {/* Header / Badges */}
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono uppercase tracking-widest font-semibold text-black bg-[#F5F5F5] px-2 py-0.5 border border-[#DDD]">
                {addr.title}
              </span>

              {addr.is_default_shipping && (
                <span className="text-2xs font-mono uppercase tracking-wider text-[#16A34A] bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5">
                  Default Shipping
                </span>
              )}
            </div>

            {/* Address Details */}
            <div className="space-y-1 text-xs text-[#444]">
              <p className="font-semibold text-black text-sm">
                {addr.first_name} {addr.last_name}
              </p>
              {addr.company && <p className="text-[#666]">{addr.company}</p>}
              <p>{addr.address_line1}</p>
              {addr.address_line2 && <p>{addr.address_line2}</p>}
              <p>
                {addr.city}, {addr.state_province} {addr.postal_code}
              </p>
              <p className="font-medium text-black uppercase">{addr.country_code}</p>
              <p className="text-2xs font-mono text-[#777] pt-1">{addr.phone}</p>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-2xs font-mono">
              {!addr.is_default_shipping ? (
                <button
                  onClick={() => setDefaultShippingAddress(addr.id)}
                  className="text-black hover:underline uppercase tracking-wider"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-[#16A34A] flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Primary</span>
                </span>
              )}

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => openEditModal(addr)}
                  className="text-[#666] hover:text-black flex items-center space-x-1"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-[#B91C1C] hover:text-black flex items-center space-x-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#EAEAEA] w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
              <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-[#111]">
                {editingId ? "Edit Delivery Address" : "Add Delivery Address"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#888] hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                  Address Label
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Aspen Penthouse, London Residence"
                  required
                  className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                  Company / C/O (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Alpine Architecture Studio"
                  className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                  Street Address
                </label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="4820 Glacier Ridge Way"
                  required
                  className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                  Apartment / Suite (Optional)
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Suite 400"
                  className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={stateProvince}
                    onChange={(e) => setStateProvince(e.target.value)}
                    required
                    className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                    Country
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
                  >
                    <option value="US">United States (US)</option>
                    <option value="CH">Switzerland (CH)</option>
                    <option value="GB">United Kingdom (GB)</option>
                    <option value="CA">Canada (CA)</option>
                    <option value="DE">Germany (DE)</option>
                    <option value="FR">France (FR)</option>
                    <option value="NL">Netherlands (NL)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                    Telephone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (415) 890-3419"
                    required
                    className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefaultShipping}
                  onChange={(e) => setIsDefaultShipping(e.target.checked)}
                  className="rounded-none border-gray-300 text-black focus:ring-black"
                />
                <span className="text-xs text-[#444]">
                  Set as default shipping address for all future orders
                </span>
              </label>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#EAEAEA]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#DDD] text-xs uppercase font-mono tracking-wider hover:border-black text-[#555]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 text-xs uppercase font-mono tracking-widest hover:bg-[#222]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
