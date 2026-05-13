import { create } from 'zustand';
import { MOCK_PRODUCTS, Product, CATEGORIES } from '../data/mockProducts';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { 
  collection, 
  onSnapshot,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  where
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    providerInfo?: {
      providerId: string;
      email: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      providerInfo: auth?.currentUser?.providerData.map(p => ({
        providerId: p.providerId,
        email: p.email
      })) || []
    }
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  if (errInfo.error.includes('permission-denied') || errInfo.error.includes('Missing or insufficient permissions')) {
    console.error('❌ SEVERE: Permission Denied. Verify your Firestore Security Rules.');
  }
}

interface ProductState {
  products: Product[];
  categories: string[];
  searchQuery: string;
  selectedCategory: string | null;
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: string) => Promise<void>;
  deleteCategory: (category: string) => Promise<void>;
  initialize: () => Promise<void>;
  filteredProducts: () => Product[];
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  categories: [],
  searchQuery: '',
  selectedCategory: null,
  isLoading: true,
  
  initialize: async () => {
    // Prevent double initialization if already listening
    if ((get() as any)._prodUnsubscribe) return;

    console.log('🔄 Initializing Real-time Product Store...');
    set({ isLoading: true });
    
    if (isFirebaseConfigured && db) {
      try {
        // Listen to Products
        const prodUnsubscribe = onSnapshot(collection(db!, 'products'), (snapshot) => {
          const fetchedProducts = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || 'Untitled Product',
              slug: data.slug || doc.id,
              description: data.description || '',
              price: Number(data.price) || 0,
              originalPrice: Number(data.originalPrice) || 0,
              rating: Number(data.rating) || 4.5,
              reviewsCount: Number(data.reviewsCount) || 0,
              image: data.image || '',
              gallery: data.gallery || [],
              category: data.category || 'General',
              affiliateLink: data.affiliateLink || '#',
              features: data.features || [],
              trending: !!data.trending
            } as Product;
          });

          // Seed if empty and first load
          if (fetchedProducts.length === 0 && get().isLoading) {
            console.warn('⚠️ Firestore Products empty! Seeding...');
            MOCK_PRODUCTS.forEach(p => setDoc(doc(db!, 'products', p.id), p));
          } else {
            set({ products: fetchedProducts, isLoading: false });
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'products');
          set({ isLoading: false });
        });

        // Listen to Categories
        const catUnsubscribe = onSnapshot(collection(db!, 'categories'), (snapshot) => {
          const fetchedCats = snapshot.docs.map(doc => doc.data().name as string).filter(Boolean);
          if (fetchedCats.length > 0) {
            set({ categories: Array.from(new Set(fetchedCats)) });
          } else {
           // Infer from products if categories collection is empty
           const inferred = Array.from(new Set(get().products.map(p => p.category)));
           if (inferred.length > 0) set({ categories: inferred });
          }
        });

        // Store unsubscribe functions in the state (using any to avoid type noise for internal refs)
        (set as any)({ _prodUnsubscribe: prodUnsubscribe, _catUnsubscribe: catUnsubscribe });

      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'init-listeners');
        set({ products: MOCK_PRODUCTS, categories: CATEGORIES, isLoading: false });
      }
    } else {
      console.log('📦 Using Local Mock Data Fallback');
      set({ products: MOCK_PRODUCTS, categories: CATEGORIES, isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  addProduct: async (product) => {
    const newProducts = [product, ...get().products];
    set({ products: newProducts });

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db!, 'products', product.id), product);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `products/${product.id}`);
      }
    } else {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: newProducts, categories: get().categories })
      });
    }
  },

  updateProduct: async (id, updatedFields) => {
    const newProducts = get().products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    set({ products: newProducts });

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db!, 'products', id), updatedFields);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
      }
    } else {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: newProducts, categories: get().categories })
      });
    }
  },

  deleteProduct: async (id) => {
    const newProducts = get().products.filter(p => p.id !== id);
    set({ products: newProducts });

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db!, 'products', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      }
    } else {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: newProducts, categories: get().categories })
      });
    }
  },

  addCategory: async (category) => {
    if (get().categories.includes(category)) return;
    const newCategories = [...get().categories, category];
    set({ categories: newCategories });

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db!, 'categories'), { name: category });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'categories');
      }
    } else {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: get().products, categories: newCategories })
      });
    }
  },

  deleteCategory: async (category) => {
    const newCategories = get().categories.filter(c => c !== category);
    set({ categories: newCategories });

    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db!, 'categories'), where('name', '==', category));
        const snap = await getDocs(q);
        const deletePromises = snap.docs.map(d => deleteDoc(doc(db!, 'categories', d.id)));
        await Promise.all(deletePromises);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'categories');
      }
    } else {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: get().products, categories: newCategories })
      });
    }
  },

  filteredProducts: () => {
    const { products, searchQuery, selectedCategory } = get();
    return products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }
}));


