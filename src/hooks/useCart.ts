import { useState, useEffect } from 'react';
import { Product } from './useFavorites';

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

const CART_KEY = 'zander-store-cart';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

  const addToCart = (product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: string) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product.id && 
               item.selectedSize === selectedSize && 
               item.selectedColor === selectedColor
    );

    if (existingItemIndex >= 0) {
      const newCart = [...cartItems];
      newCart[existingItemIndex].quantity += quantity;
      saveCart(newCart);
    } else {
      const newItem: CartItem = {
        ...product,
        quantity,
        selectedSize,
        selectedColor
      };
      saveCart([...cartItems, newItem]);
    }
  };

  const removeFromCart = (itemId: string, selectedSize?: string, selectedColor?: string) => {
    const newCart = cartItems.filter(
      item => !(item.id === itemId && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor)
    );
    saveCart(newCart);
  };

  const updateQuantity = (itemId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    const newCart = cartItems.map(item => {
      if (item.id === itemId && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };
};