export interface AnnouncementItem {
  id: string;
  message: string;
  highlightText: string;
  linkText?: string;
  linkHref?: string;
  badge?: string;
}

export const ANNOUNCEMENT_MESSAGES: AnnouncementItem[] = [
  {
    id: "ann-1",
    message: "Complimentary Worldwide Express Delivery on orders over",
    highlightText: "$200 / €190 / £175",
    linkText: "Shipping Guidelines",
    linkHref: "#shipping",
    badge: "GLOBAL TRANSIT",
  },
  {
    id: "ann-2",
    message: "Archival Drop 01 Now Live • Limited production run of",
    highlightText: "150 Hand-Numbered Down Parkas",
    linkText: "View Drop",
    linkHref: "#drop",
    badge: "NEW SEASON",
  },
  {
    id: "ann-3",
    message: "European Union & United Kingdom:",
    highlightText: "All Customs Duties & VAT Included at Checkout",
    linkText: "Tax Policy",
    linkHref: "#customs",
    badge: "DDP GUARANTEED",
  },
];
