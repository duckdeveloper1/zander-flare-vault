import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  description: string;
  isPromotion?: boolean;
  category?: string;
  sizes?: string[];
  colors?: string[];
  material?: string;
  care?: string;
  stock?: number;
}

const FAVORITES_KEY = 'zander-store-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: Product[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const addToFavorites = (product: Product) => {
    const newFavorites = [...favorites, product];
    saveFavorites(newFavorites);
  };

  const removeFromFavorites = (productId: string) => {
    const newFavorites = favorites.filter(p => p.id !== productId);
    saveFavorites(newFavorites);
  };

  const isFavorite = (productId: string) => {
    return favorites.some(p => p.id === productId);
  };

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite
  };
};