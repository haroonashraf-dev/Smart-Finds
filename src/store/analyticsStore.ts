import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface ClickData {
  productId: string;
  productName: string;
  timestamp: number;
  type: 'view' | 'affiliate_click';
}

interface AnalyticsState {
  clicks: ClickData[];
  loading: boolean;
  logInteraction: (productId: string, productName: string, type: 'view' | 'affiliate_click') => Promise<void>;
  fetchInteractions: (days?: number) => Promise<void>;
  subscribeToInteractions: (days?: number) => () => void;
  getTopProducts: () => { name: string; views: number; clicks: number }[];
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => {
  return {
    clicks: [],
    loading: false,

    logInteraction: async (productId, productName, type) => {
      try {
        if (!db) return;
        
        // Add a small delay to avoid race conditions with auth if needed
        // but serverTimestamp() already handles most stuff
        await addDoc(collection(db, 'interactions'), {
          productId,
          productName,
          type,
          timestamp: serverTimestamp()
        });
        console.log(`✅ Interaction logged: ${type} for ${productName}`);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'interactions');
      }
    },

    fetchInteractions: async (days = 30) => {
      if (!db) return;
      set({ loading: true });
      try {
        const msInDay = 24 * 60 * 60 * 1000;
        const cutoffDate = Timestamp.fromDate(new Date(Date.now() - days * msInDay));
        
        const q = query(
          collection(db, 'interactions'),
          where('timestamp', '>=', cutoffDate),
          orderBy('timestamp', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const clicks = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            productId: data.productId,
            productName: data.productName,
            type: data.type,
            timestamp: (data.timestamp as Timestamp)?.toMillis() || Date.now()
          };
        }) as ClickData[];
        
        set({ clicks, loading: false });
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'interactions');
        set({ loading: false });
      }
    },

    subscribeToInteractions: (days = 30) => {
      if (!db) return () => {};
      set({ loading: true });
      
      const msInDay = 24 * 60 * 60 * 1000;
      const cutoffDate = Timestamp.fromDate(new Date(Date.now() - days * msInDay));
      
      const q = query(
        collection(db, 'interactions'),
        where('timestamp', '>=', cutoffDate),
        orderBy('timestamp', 'desc')
      );
      
      return onSnapshot(q, (snapshot) => {
        const clicks = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            productId: data.productId,
            productName: data.productName,
            type: data.type,
            timestamp: (data.timestamp as Timestamp)?.toMillis() || Date.now()
          };
        }) as ClickData[];
        set({ clicks, loading: false });
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'interactions-snapshot');
        set({ loading: false });
      });
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
