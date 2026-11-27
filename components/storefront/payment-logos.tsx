import * as React from "react";

export function VisaLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.16 0.72L12.56 15.28H8.24L5.04 3.76C4.84 3 4.6 2.72 4 2.36C3 1.84 1.44 1.36 0 1.04L0.08 0.72H6.96C7.84 0.72 8.64 1.32 8.84 2.32L10.52 11.28L14.72 0.72H19.16ZM36.16 10.4C36.2 6.56 30.8 6.32 30.84 4.56C30.88 4.04 31.4 3.48 32.52 3.32C33.08 3.24 34.6 3.2 36.24 3.96L36.88 1C36 0.68 34.88 0.36 33.44 0.36C29.36 0.36 26.52 2.52 26.48 5.6C26.44 7.88 28.52 9.16 30.08 9.92C31.68 10.72 32.24 11.2 32.24 11.92C32.2 13 30.88 13.48 29.68 13.52C27.6 13.56 26.4 13 25.44 12.56L24.76 15.6C25.68 16.04 27.4 16.4 29.16 16.44C33.48 16.44 36.16 14.32 36.16 10.4ZM47.88 15.28H44.04C42.84 15.28 41.96 14.6 41.52 13.56L35.48 0.72H39.84C40.64 0.72 41.36 1.28 41.56 2.08L42.56 7.4L45.48 15.28H47.88ZM24.48 0.72L21.08 15.28H17.04L20.44 0.72H24.48Z"
        fill="#1A1F71"
      />
    </svg>
  );
}

export function MastercardLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="20" rx="3" fill="#141414" />
      <circle cx="12" cy="10" r="6" fill="#EB001B" />
      <circle cx="20" cy="10" r="6" fill="#F79E1B" fillOpacity="0.88" />
    </svg>
  );
}

export function AmexLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="20" rx="3" fill="#006FCF" />
      <path
        d="M5 13.5L8.5 6.5H11.5L8.5 13.5H5ZM9.5 10H14.5L16 6.5H11L9.5 10ZM17.5 6.5L19 10.5L20.5 6.5H23.5L20.5 13.5H17.5L16 10L14.5 13.5H11.5L14.5 6.5H17.5ZM24 6.5H27V13.5H24V11H25.5V9.5H24V8H26.5V6.5H24Z"
        fill="white"
      />
    </svg>
  );
}

export function ApplePayLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 42 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="42" height="22" rx="4" fill="#000000" />
      <path
        d="M13.4 10.8c-.1-.7.3-1.4.7-1.8-.4-.6-1.1-.9-1.8-.9-.8 0-1.4.4-1.8.4-.4 0-1-.4-1.6-.4-.8 0-1.6.5-2 1.3-.9 1.5-.2 3.8.7 5 .4.6.9 1.3 1.6 1.3.6 0 .9-.4 1.6-.4.7 0 .9.4 1.6.4.7 0 1.1-.6 1.6-1.3.5-.7.7-1.4.7-1.5-.1 0-1.4-.5-1.5-2.1zM12.3 7.7c.3-.4.5-.9.5-1.5-.5 0-1.1.3-1.4.7-.3.3-.5.9-.4 1.4.5.1 1-.2 1.3-.6z"
        fill="#FFFFFF"
      />
      <path
        d="M19.6 7.8h2.3c1.3 0 2.2.9 2.2 2.1 0 1.3-.9 2.1-2.2 2.1h-1v2.8h-1.3V7.8zm2.2 3.1c.7 0 1.1-.4 1.1-1s-.4-1-1.1-1h-.9v2h.9zm6.6 2.7c0 .9-.7 1.5-1.7 1.5-.7 0-1.3-.3-1.5-.9h-.1v.8h-1.2V10.4h1.2v.9h.1c.3-.6.9-.9 1.6-.9 1 0 1.6.7 1.6 1.7v1.5zm-1.3-.1v-1.3c0-.6-.4-.9-.9-.9s-.9.4-.9.9v1.3c0 .5.4.9.9.9s.9-.4.9-.9zm5.3-.9l1.6 4.1h-1.3l-.5-1.3h-1.7l-.5 1.3h-1.3l1.7-4.1-1.6-3.8h1.4l.9 2.4.9-2.4h1.3l-1.9 3.8z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function GooglePayLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 42 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="42" height="22" rx="4" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
      <path
        d="M13.5 11c0-.3 0-.6-.1-.9H9.5v1.8h2.3c-.1.5-.4 1-.9 1.3v1.1h1.5c.9-.8 1.4-2 1.4-3.3z"
        fill="#4285F4"
      />
      <path
        d="M9.5 15.1c1.1 0 2-.4 2.8-1l-1.5-1.1c-.4.3-.9.4-1.3.4-1 0-1.9-.7-2.3-1.6H5.7v1.2C6.4 14.4 7.8 15.1 9.5 15.1z"
        fill="#34A853"
      />
      <path
        d="M7.2 11.8c-.1-.3-.2-.6-.2-.9s.1-.6.2-.9V8.8H5.7C5.3 9.7 5 10.3 5 11s.3 1.3.7 2.2l1.5-1.4z"
        fill="#FBBC04"
      />
      <path
        d="M9.5 8.4c.6 0 1.1.2 1.5.6l1.2-1.2C11.5 7.1 10.6 6.8 9.5 6.8c-1.7 0-3.1.8-3.8 2l1.5 1.2c.4-.9 1.3-1.6 2.3-1.6z"
        fill="#EA4335"
      />
      <path
        d="M17 8.5h2.1c1.1 0 1.9.7 1.9 1.7 0 1-.8 1.8-1.9 1.8h-.9v2.2H17V8.5zm2 2.4c.5 0 .9-.3.9-.8s-.4-.8-.9-.8h-.8v1.6h.8zm5.4 2.1c0 .7-.5 1.1-1.3 1.1-.5 0-1-.3-1.2-.7h-.1v.6h-1V9h1v.7h.1c.2-.4.7-.7 1.2-.7.8 0 1.3.5 1.3 1.3v2.7zm-1.1-.1v-2.1c0-.4-.3-.7-.7-.7s-.7.3-.7.7v2.1c0 .4.3.7.7.7s.7-.3.7-.7zm4.2-.7l1.3 3.1h-1.1l-.4-.9h-1.3l-.4.9h-1.1l1.3-3.1-1.3-2.9h1.1l.7 1.8.7-1.8h1.1l-1.4 2.9z"
        fill="#3C4043"
      />
    </svg>
  );
}

export function KlarnaLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 42 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="42" height="22" rx="4" fill="#FFB3C7" />
      <path
        d="M10 6h2.4v10H10V6zm4.6 0h2.3l3.4 5.2L16.9 16h-2.2l2.9-4.6-3-5.4zm7.4 3.7h2.2v1.2h.1c.3-.9 1.1-1.3 1.9-1.3.2 0 .4 0 .5.1v2.2c-.3-.1-.5-.1-.8-.1-1 0-1.7.7-1.7 1.8V16H22V9.7zm7.9 4.4c0 .9.7 1.6 1.6 1.6s1.6-.7 1.6-1.6c0-.9-.7-1.6-1.6-1.6s-1.6.7-1.6 1.6z"
        fill="#0A0A0A"
      />
    </svg>
  );
}

export function IdealLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="20" rx="3" fill="#CC0066" />
      <text x="5" y="14" fill="white" fontFamily="sans-serif" fontSize="10" fontWeight="bold">
        iDEAL
      </text>
    </svg>
  );
}

export function SepaLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="20" rx="3" fill="#003399" />
      <text x="4" y="14" fill="white" fontFamily="sans-serif" fontSize="9" fontWeight="bold">
        SEPA
      </text>
    </svg>
  );
}

export function PaymentIconsRow() {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div className="flex items-center px-1.5 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
        <VisaLogo className="h-3 w-auto" />
      </div>
      <div className="flex items-center px-1.5 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
        <MastercardLogo className="h-3.5 w-auto" />
      </div>
      <div className="flex items-center px-1.5 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
        <AmexLogo className="h-3.5 w-auto" />
      </div>
      <div className="flex items-center px-1 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
        <ApplePayLogo className="h-3.5 w-auto" />
      </div>
      <div className="flex items-center px-1 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
        <GooglePayLogo className="h-3.5 w-auto" />
      </div>
      <div className="flex items-center px-1 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
        <KlarnaLogo className="h-3.5 w-auto" />
      </div>
    </div>
  );
}
