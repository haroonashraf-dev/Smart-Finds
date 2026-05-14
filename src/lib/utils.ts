import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate WhatsApp deep link
export function getWhatsAppLink(productName: string, productUrl: string) {
  const phone = "923117968617"; 
  const text = `Hello SmartFinds! I am interested in the *${productName}*. Could you please provide more details?

Product Link: ${productUrl}

Thank you!`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// Format currency
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
