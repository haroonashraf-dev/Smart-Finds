import { create } from 'zustand';
import { MOCK_PRODUCTS, Product, CATEGORIES, Category } from '../data/mockProducts';
import { auth, db, isFirebaseConfigured, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  onSnapshot,
  getDocs,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  where
} from 'firebase/firestore';

interface ProductState {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string | null;
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: string, image?: string) => Promise<void>;
  deleteCategory: (category: string) => Promise<void>;
  updateCategory: (oldName: string, newName: string, newImage?: string) => Promise<void>;
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
            // Ensure category is always a string (prevents crashes if object is stored)
            const rawCategory = data.category;
            const categoryString = typeof rawCategory === 'string' 
              ? rawCategory 
              : (rawCategory && typeof rawCategory === 'object' && rawCategory.name)
                ? String(rawCategory.name)
                : 'General';

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
              category: categoryString,
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
          const fetchedCats = snapshot.docs.map(doc => {
            const data = doc.data();
            // Ensure name is always a string
            const rawName = data.name;
            const nameString = typeof rawName === 'string'
              ? rawName
              : (rawName && typeof rawName === 'object' && !Array.isArray(rawName))
                ? String((rawName as any).name || 'Category')
                : 'Category';

            return {
              name: nameString,
              image: data.image as string
            };
          }).filter(cat => cat.name);
          
          if (fetchedCats.length > 0) {
            // Deduplicate by name to prevent duplicates in UI
            const uniqueCats = Array.from(new Map(fetchedCats.map(c => [c.name, c])).values());
            set({ categories: uniqueCats });
          } else {
            // Infer from products if categories collection is empty
            const inferredNames = Array.from(new Set(get().products.map(p => String(p.category))));
            if (inferredNames.length > 0) {
              set({ categories: inferredNames.map(name => ({ name })) });
            }
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
    const previousProducts = get().products;
    const newProducts = [product, ...previousProducts];
    set({ products: newProducts });

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db!, 'products', product.id), product);
      } catch (error) {
        set({ products: previousProducts });
        handleFirestoreError(error, OperationType.WRITE, `products/${product.id}`);
        throw error;
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
    const previousProducts = get().products;
    const newProducts = previousProducts.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    set({ products: newProducts });

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db!, 'products', id), updatedFields);
      } catch (error) {
        set({ products: previousProducts });
        handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
        throw error;
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
    const previousProducts = get().products;
    const newProducts = previousProducts.filter(p => p.id !== id);
    set({ products: newProducts });

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db!, 'products', id));
      } catch (error) {
        set({ products: previousProducts });
        handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
        throw error;
      }
    } else {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: newProducts, categories: get().categories })
      });
    }
  },

  addCategory: async (category, image) => {
    if (get().categories.some(c => c.name === category)) return;
    const newCategory: Category = { name: category, image };
    const newCategories = [...get().categories, newCategory];
    set({ categories: newCategories });

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db!, 'categories'), { name: category, image: image || '' });
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
    if (category === 'General') return; // Cannot delete the default category

    const products = get().products;
    const newCategories = get().categories.filter(c => c.name !== category);
    
    // Ensure 'General' category exists
    if (!newCategories.some(c => c.name === 'General')) {
      newCategories.push({ name: 'General' });
    }

    const updatedProducts = products.map(p => 
      p.category === category ? { ...p, category: 'General' } : p
    );
    
    set({ categories: newCategories, products: updatedProducts });

    if (isFirebaseConfigured && db) {
      try {
        // 1. Delete from categories collection
        const q = query(collection(db!, 'categories'), where('name', '==', category));
        const snap = await getDocs(q);
        const deletePromises = snap.docs.map(d => deleteDoc(doc(db!, 'categories', d.id)));
        
        // 2. Ensure General category document exists in Firestore
        const genQ = query(collection(db!, 'categories'), where('name', '==', 'General'));
        const genSnap = await getDocs(genQ);
        if (genSnap.empty) {
          await addDoc(collection(db!, 'categories'), { name: 'General' });
        }

        // 3. Update products in this category to 'General' in Firestore
        const prodQ = query(collection(db!, 'products'), where('category', '==', category));
        const prodSnap = await getDocs(prodQ);
        const updateProdPromises = prodSnap.docs.map(d => updateDoc(doc(db!, 'products', d.id), { category: 'General' }));
        
        await Promise.all([...deletePromises, ...updateProdPromises]);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'categories-reassignment');
      }
    } else {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updatedProducts, categories: newCategories })
      });
    }
  },

  updateCategory: async (oldName, newName, newImage) => {
    const isNameChanging = newName !== oldName && newName.trim();
    if (!isNameChanging && newImage === undefined) return;
    
    const newCategories = get().categories.map(c => 
      c.name === oldName 
        ? { name: newName || oldName, image: newImage !== undefined ? newImage : c.image } 
        : c
    );
    
    let updatedProducts = get().products;
    if (isNameChanging) {
      updatedProducts = get().products.map(p => p.category === oldName ? { ...p, category: newName } : p);
    }
    
    set({ categories: newCategories, products: updatedProducts });

    if (isFirebaseConfigured && db) {
      try {
        // 1. Update in categories collection
        const q = query(collection(db!, 'categories'), where('name', '==', oldName));
        const snap = await getDocs(q);
        const updateFields: any = {};
        if (isNameChanging) updateFields.name = newName;
        if (newImage !== undefined) updateFields.image = newImage;

        const updateCatPromises = snap.docs.map(d => updateDoc(doc(db!, 'categories', d.id), updateFields));
        
        // 2. Update products in this category in Firestore if name changed
        let updateProdPromises: Promise<any>[] = [];
        if (isNameChanging) {
          const prodQ = query(collection(db!, 'products'), where('category', '==', oldName));
          const prodSnap = await getDocs(prodQ);
          updateProdPromises = prodSnap.docs.map(d => updateDoc(doc(db!, 'products', d.id), { category: newName }));
        }
        
        await Promise.all([...updateCatPromises, ...updateProdPromises]);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, 'categories/products-ref');
      }
    } else {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updatedProducts, categories: newCategories })
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


