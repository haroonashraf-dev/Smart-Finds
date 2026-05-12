import { create } from 'zustand';

interface UserState {
  favorites: string[];
  recentlyViewed: string[];
  toggleFavorite: (productId: string) => void;
  addRecentlyViewed: (productId: string) => void;
}

export const useUserStore = create<UserState>((set) => {
  const savedFavs = localStorage.getItem('user-favorites');
  const savedViews = localStorage.getItem('user-recently-viewed');

  return {
    favorites: savedFavs ? JSON.parse(savedFavs) : [],
    recentlyViewed: savedViews ? JSON.parse(savedViews) : [],
    toggleFavorite: (id) => set((state) => {
      const newFavs = state.favorites.includes(id) 
        ? state.favorites.filter(f => f !== id) 
        : [...state.favorites, id];
      localStorage.setItem('user-favorites', JSON.stringify(newFavs));
      return { favorites: newFavs };
    }),
    addRecentlyViewed: (id) => set((state) => {
      const newViews = [id, ...state.recentlyViewed.filter(v => v !== id)].slice(0, 10);
      localStorage.setItem('user-recently-viewed', JSON.stringify(newViews));
      return { recentlyViewed: newViews };
    })
  };
});
