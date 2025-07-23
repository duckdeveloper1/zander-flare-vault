import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  status: 'active' | 'inactive';
  featured: boolean;
  images: string[];
  description: string;
  colors?: { name: string; image?: string }[];
  sizes: string[];
  promotion?: { active: boolean; discount: number };
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  type: 'percentage' | 'fixed';
  status: 'active' | 'inactive' | 'scheduled';
  applicableProducts?: string[];
}

export interface ProductSet {
  id: string;
  name: string;
  description: string;
  products: string[];
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  status: 'active' | 'inactive';
}

interface StoreContextType {
  products: Product[];
  promotions: Promotion[];
  sets: ProductSet[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  addPromotion: (promotion: Omit<Promotion, 'id'>) => void;
  addSet: (set: Omit<ProductSet, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => void;
  updateSet: (id: string, set: Partial<ProductSet>) => void;
  deleteProduct: (id: string) => void;
  deletePromotion: (id: string) => void;
  deleteSet: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [sets, setSets] = useState<ProductSet[]>([]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const addPromotion = (promotion: Omit<Promotion, 'id'>) => {
    const newPromotion: Promotion = {
      ...promotion,
      id: `PROMO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setPromotions(prev => [...prev, newPromotion]);
  };

  const addSet = (set: Omit<ProductSet, 'id'>) => {
    const newSet: ProductSet = {
      ...set,
      id: `SET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setSets(prev => [...prev, newSet]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));
  };

  const updatePromotion = (id: string, updatedPromotion: Partial<Promotion>) => {
    setPromotions(prev => prev.map(promotion => 
      promotion.id === id ? { ...promotion, ...updatedPromotion } : promotion
    ));
  };

  const updateSet = (id: string, updatedSet: Partial<ProductSet>) => {
    setSets(prev => prev.map(set => 
      set.id === id ? { ...set, ...updatedSet } : set
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const deletePromotion = (id: string) => {
    setPromotions(prev => prev.filter(promotion => promotion.id !== id));
  };

  const deleteSet = (id: string) => {
    setSets(prev => prev.filter(set => set.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      products,
      promotions,
      sets,
      addProduct,
      addPromotion,
      addSet,
      updateProduct,
      updatePromotion,
      updateSet,
      deleteProduct,
      deletePromotion,
      deleteSet,
    }}>
      {children}
    </StoreContext.Provider>
  );
};