export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  category: string;
  affiliateLink: string;
  features: string[];
  trending: boolean;
}

export const CATEGORIES = [
  "Smart Gadgets",
  "Home Essentials",
  "Kitchen Tools",
  "Car Accessories",
  "Mobile Accessories",
  "Fitness Products",
  "Tech Finds",
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Smart LED Desk Lamp with Wireless Charger",
    slug: "smart-led-desk-lamp-wireless-charger",
    description: "Multi-functional smart LED desk lamp with 15W fast wireless charging, adjustable color temperature, and touch controls. Perfect for modern home offices.",
    price: 34.99,
    originalPrice: 59.99,
    rating: 4.8,
    reviewsCount: 1245,
    image: "https://images.unsplash.com/photo-1542728929-1b7782637b3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    gallery: [
      "https://images.unsplash.com/photo-1542728929-1b7782637b3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Smart Gadgets",
    affiliateLink: "https://s.click.aliexpress.com/e/_test_link_1",
    features: ["15W Wireless Charging", "3 Color Modes", "Touch Dimming", "Eye-Care LED"],
    trending: true,
  },
  {
    id: "p2",
    title: "Minimalist Magnetic Car Phone Mount",
    slug: "minimalist-magnetic-car-phone-mount",
    description: "Ultra-strong magnetic car phone holder that seamlessly blends with your dashboard. Fits all modern smartphones.",
    price: 12.50,
    originalPrice: 24.99,
    rating: 4.6,
    reviewsCount: 3892,
    image: "https://images.unsplash.com/photo-1585295982846-9b57bc7cb4d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    gallery: [
      "https://images.unsplash.com/photo-1585295982846-9b57bc7cb4d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Car Accessories",
    affiliateLink: "https://s.click.aliexpress.com/e/_test_link_2",
    features: ["N52 Magnets", "360° Rotation", "Minimalist Design", "Universal Fit"],
    trending: true,
  },
  {
    id: "p3",
    title: "Automatic Smart Trash Can",
    slug: "automatic-smart-trash-can",
    description: "Touchless automatic motion sensor garbage bin. Keeps your kitchen clean and modern-looking with odor control.",
    price: 45.00,
    originalPrice: 80.00,
    rating: 4.9,
    reviewsCount: 823,
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    gallery: [
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Home Essentials",
    affiliateLink: "https://s.click.aliexpress.com/e/_test_link_3",
    features: ["Motion Sensor", "Odor Seal", "Stainless Steel", "Rechargeable Battery"],
    trending: true,
  },
  {
    id: "p4",
    title: "Multi-functional Vegetable Chopper",
    slug: "multi-functional-vegetable-chopper",
    description: "12-in-1 vegetable chopper and slicer with container. The ultimate time-saver for your kitchen prep.",
    price: 19.99,
    originalPrice: 35.00,
    rating: 4.7,
    reviewsCount: 5621,
    image: "https://images.unsplash.com/photo-1593618167382-7729de172e25?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    gallery: [
      "https://images.unsplash.com/photo-1593618167382-7729de172e25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Kitchen Tools",
    affiliateLink: "https://s.click.aliexpress.com/e/_test_link_4",
    features: ["12 Blades", "Finger Guard", "BPA Free", "Dishwasher Safe"],
    trending: false,
  },
  {
    id: "p5",
    title: "Ergonomic Laptop Stand with Cooling Fans",
    slug: "ergonomic-laptop-stand-cooling-fans",
    description: "Adjustable aluminum laptop stand featuring dual ultra-quiet cooling fans to keep your device performing at its best.",
    price: 28.50,
    originalPrice: 49.99,
    rating: 4.5,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    gallery: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Tech Finds",
    affiliateLink: "https://s.click.aliexpress.com/e/_test_link_5",
    features: ["Dual Fans", "6 Height Levels", "Aluminum Build", "Foldable"],
    trending: true,
  },
  {
    id: "p6",
    title: "Smart Posture Corrector",
    slug: "smart-posture-corrector",
    description: "Vibrating posture reminder that trains your back muscles and improves your posture over time.",
    price: 15.99,
    originalPrice: 30.00,
    rating: 4.2,
    reviewsCount: 890,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    gallery: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Fitness Products",
    affiliateLink: "https://s.click.aliexpress.com/e/_test_link_6",
    features: ["Vibration Alert", "Adjustable Strap", "USB Charging", "Lightweight"],
    trending: false,
  }
];
