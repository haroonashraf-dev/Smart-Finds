import { create } from 'zustand';

export interface ClickData {
  productId: string;
  productName: string;
  timestamp: number;
  type: 'view' | 'affiliate_click';
}

interface AnalyticsState {
  clicks: ClickData[];
  logClick: (productId: string, productName: string, type: 'view' | 'affiliate_click') => void;
  getClicksForLastDays: (days: number) => ClickData[];
  getTopProducts: () => { name: string; views: number; clicks: number }[];
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => {
  // Load initial data from localStorage
  const savedData = localStorage.getItem('smart-living-analytics');
  const initialClicks: ClickData[] = savedData ? JSON.parse(savedData) : [];

  return {
    clicks: initialClicks,
    logClick: (productId, productName, type) => {
      set((state) => {
        const newClicks = [...state.clicks, { productId, productName, timestamp: Date.now(), type }];
        localStorage.setItem('smart-living-analytics', JSON.stringify(newClicks));
        return { clicks: newClicks };
      });
    },
    getClicksForLastDays: (days: number) => {
      const msInDay = 24 * 60 * 60 * 1000;
      const cutoffTime = Date.now() - days * msInDay;
      return get().clicks.filter(c => c.timestamp >= cutoffTime);
    },
    getTopProducts: () => {
      const stats: Record<string, { name: string; views: number; clicks: number }> = {};
      get().clicks.forEach(click => {
        if (!stats[click.productId]) {
          stats[click.productId] = { name: click.productName, views: 0, clicks: 0 };
        }
        if (click.type === 'view') {
          stats[click.productId].views++;
        } else {
          stats[click.productId].clicks++;
        }
      });
      return Object.values(stats).sort((a, b) => b.clicks - a.clicks).slice(0, 5);
    }
  };
});
