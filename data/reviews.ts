export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  verifiedPurchase: boolean;
  rating: number;
  productTitle: string;
  temperatureTestimony: string;
  reviewTitle: string;
  comment: string;
  date: string;
}

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    author: "Henrik Lindqvist",
    location: "Stockholm, Sweden",
    verifiedPurchase: true,
    rating: 5,
    productTitle: "Nordic Expedition Down Parka",
    temperatureTestimony: "Tested during -24°C blizzard in Kiruna",
    reviewTitle: "Absolute masterclass in thermal insulation.",
    comment:
      "I have worn expedition jackets from Canada Goose and Arc'teryx for a decade. The Nordic Expedition Parka surpasses them in wind resistance and quiet comfort. The fleece-lined pockets are a godsend when taking off gloves to operate camera gear.",
    date: "November 2026",
  },
  {
    id: "rev-2",
    author: "Elena Rostova",
    location: "Montreal, Canada",
    verifiedPurchase: true,
    rating: 5,
    productTitle: "Heavyweight Merino Cable Knit",
    temperatureTestimony: "Perfect mid-layer down to -18°C",
    reviewTitle: "Heaviest, most luxurious knit I own.",
    comment:
      "The wool weight is substantial without being itchy. You can immediately feel the natural loft of the fibers. The ecru color is stunning in person, exactly the natural unbleached tone I was seeking.",
    date: "October 2026",
  },
  {
    id: "rev-3",
    author: "Julian Sterling",
    location: "London & St. Moritz",
    verifiedPurchase: true,
    rating: 5,
    productTitle: "Alpine Shearling Lined Trekking Boot",
    temperatureTestimony: "No cold creep even standing in packed powder",
    reviewTitle: "Impeccable welted craftsmanship and grip.",
    comment:
      "The Vibram Arctic grip sole actually works on wet cobblestones and icy steps in the village. The shearling interior envelops your feet like a glove. True to European size.",
    date: "November 2026",
  },
];
