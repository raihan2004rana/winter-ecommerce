"use client";

import * as React from "react";

interface FlyingItem {
  id: number;
  imageUrl: string;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  endX: number;
  endY: number;
}

interface FlyToCartContextType {
  triggerFlyToCart: (imageUrl: string, sourceElement?: HTMLElement | null) => void;
  isCartBouncing: boolean;
  triggerCartBounce: () => void;
}

const FlyToCartContext = React.createContext<FlyToCartContextType>({
  triggerFlyToCart: () => {},
  isCartBouncing: false,
  triggerCartBounce: () => {},
});

export function useFlyToCart() {
  return React.useContext(FlyToCartContext);
}

function FlyingThumbnail({
  item,
  onComplete,
}: {
  item: FlyingItem;
  onComplete: (id: number) => void;
}) {
  const [phase, setPhase] = React.useState<"initial" | "flying">("initial");

  React.useEffect(() => {
    // Start animation on next frame
    const raf = requestAnimationFrame(() => {
      setPhase("flying");
    });

    // Complete after flight duration
    const timer = setTimeout(() => {
      onComplete(item.id);
    }, 720);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [item.id, onComplete]);

  const targetDeltaX = item.endX - item.startX - item.startW / 2;
  const targetDeltaY = item.endY - item.startY - item.startH / 2;

  return (
    <div
      className="pointer-events-none fixed z-[9999] overflow-hidden bg-neutral-900 shadow-2xl ring-2 ring-white/90"
      style={{
        left: `${item.startX}px`,
        top: `${item.startY}px`,
        width: `${item.startW}px`,
        height: `${item.startH}px`,
        transform:
          phase === "initial"
            ? "translate3d(0, 0, 0) scale(1) rotate(0deg)"
            : `translate3d(${targetDeltaX}px, ${targetDeltaY}px, 0) scale(0.12) rotate(12deg)`,
        opacity: phase === "initial" ? 1 : 0.1,
        borderRadius: phase === "initial" ? "6px" : "9999px",
        transition:
          phase === "initial"
            ? "none"
            : "transform 0.68s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.68s ease-in, border-radius 0.68s ease-out",
        willChange: "transform, opacity, border-radius",
      }}
    >
      <img
        src={item.imageUrl}
        alt=""
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

export function FlyToCartProvider({ children }: { children: React.ReactNode }) {
  const [flyingItems, setFlyingItems] = React.useState<FlyingItem[]>([]);
  const [isCartBouncing, setIsCartBouncing] = React.useState(false);

  const triggerCartBounce = React.useCallback(() => {
    setIsCartBouncing(true);
    setTimeout(() => {
      setIsCartBouncing(false);
    }, 550);
  }, []);

  const triggerFlyToCart = React.useCallback(
    (imageUrl: string, sourceElement?: HTMLElement | null) => {
      // Find destination Cart Button
      const cartBtn = document.getElementById("storefront-cart-button");
      let endX = window.innerWidth - 80;
      let endY = 32;

      if (cartBtn) {
        const cartRect = cartBtn.getBoundingClientRect();
        endX = cartRect.left + cartRect.width / 2;
        endY = cartRect.top + cartRect.height / 2;
      }

      // Find source geometry
      let startX = window.innerWidth / 2 - 70;
      let startY = window.innerHeight / 2 - 90;
      let startW = 140;
      let startH = 180;

      if (sourceElement) {
        const rect = sourceElement.getBoundingClientRect();
        startX = rect.left;
        startY = rect.top;
        startW = rect.width;
        startH = rect.height;
      }

      const newItem: FlyingItem = {
        id: Date.now() + Math.random(),
        imageUrl,
        startX,
        startY,
        startW,
        startH,
        endX,
        endY,
      };

      setFlyingItems((prev) => [...prev, newItem]);
    },
    []
  );

  const handleFlightComplete = React.useCallback(
    (id: number) => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== id));
      triggerCartBounce();
    },
    [triggerCartBounce]
  );

  return (
    <FlyToCartContext.Provider
      value={{
        triggerFlyToCart,
        isCartBouncing,
        triggerCartBounce,
      }}
    >
      {children}
      {/* Floating flying items portal container */}
      {flyingItems.map((item) => (
        <FlyingThumbnail
          key={item.id}
          item={item}
          onComplete={handleFlightComplete}
        />
      ))}
    </FlyToCartContext.Provider>
  );
}
