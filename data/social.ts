export interface SocialPost {
  id: string;
  image: string;
  handle: string;
  location: string;
  taggedProduct: {
    title: string;
    price: number;
  };
}

export const SOCIAL_GALLERY: SocialPost[] = [
  {
    id: "soc-1",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    handle: "@vallis_archive",
    location: "Lofoten Islands, Norway",
    taggedProduct: {
      title: "Nordic Expedition Down Parka",
      price: 685,
    },
  },
  {
    id: "soc-2",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800",
    handle: "@studio_cold",
    location: "Zurich, Switzerland",
    taggedProduct: {
      title: "Tailored Cashmere Overcoat",
      price: 890,
    },
  },
  {
    id: "soc-3",
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=800",
    handle: "@nordic_walk",
    location: "Whistler, Canada",
    taggedProduct: {
      title: "Alpine Shearling Boot",
      price: 495,
    },
  },
  {
    id: "soc-4",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
    handle: "@alpine_transit",
    location: "Chamonix, France",
    taggedProduct: {
      title: "Merino Cable Knit",
      price: 345,
    },
  },
];
