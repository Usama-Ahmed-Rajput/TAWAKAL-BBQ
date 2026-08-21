'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Toast } from '@/components/Toast';

export interface CartItem {
  id: string; // Unique cart item ID (e.g. item-{id} or deal-{id})
  type: 'ITEM' | 'DEAL';
  productId?: string;
  dealId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  includesCompulsoryRaita?: boolean;
  itemsSummary?: string;
  addons?: { name: string; price: number }[];
}

interface CartContextType {
  cart: CartItem[];
  isDrawerOpen: boolean;
  addItem: (item: { id: string; name: string; price: number; image?: string; description?: string; addons?: { name: string; price: number }[] }, quantity?: number) => void;
  addDeal: (deal: { id: string; dealNumber?: string; title: string; price: number; image?: string; itemsSummary?: string }, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  getItemQuantity: (rawId: string, type?: 'ITEM' | 'DEAL') => number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  totalItemsCount: number;
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tawakal_cart_v1';
const DEFAULT_DELIVERY_FEE = 150;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.error('Failed to save cart to storage', e);
      }
    }
  }, [cart, isHydrated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const addItem = (
    item: { id: string; name: string; price: number; image?: string; description?: string; addons?: { name: string; price: number }[] },
    qty = 1
  ) => {
    const cartItemId = `item-${item.id}`;
    const addonsPrice = item.addons ? item.addons.reduce((sum, a) => sum + a.price, 0) : 0;
    const finalPrice = item.price + addonsPrice;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartItemId ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          type: 'ITEM',
          productId: item.id,
          name: item.name,
          price: finalPrice,
          quantity: qty,
          image: item.image,
          description: item.description,
          addons: item.addons,
        },
      ];
    });

    showToast(`Added ${item.name} to cart`);
  };

  const addDeal = (
    deal: { id: string; dealNumber?: string; title: string; price: number; image?: string; itemsSummary?: string },
    qty = 1
  ) => {
    const cartItemId = `deal-${deal.id}`;
    const displayName = deal.dealNumber ? `${deal.dealNumber} — ${deal.title}` : deal.title;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartItemId ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          type: 'DEAL',
          dealId: deal.id,
          name: displayName,
          price: deal.price,
          quantity: qty,
          image: deal.image,
          includesCompulsoryRaita: true,
          itemsSummary: deal.itemsSummary,
        },
      ];
    });

    showToast(`Added ${displayName} to cart`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id || i.productId === id || i.dealId === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    const targetItem = cart.find((i) => i.id === id || i.productId === id || i.dealId === id);
    if (targetItem) {
      showToast(`Removed ${targetItem.name} from cart`);
    }
    setCart((prev) => prev.filter((i) => i.id !== id && i.productId !== id && i.dealId !== id));
  };

  const clearCart = () => {
    setCart([]);
    showToast('Cart cleared');
  };

  const getItemQuantity = (rawId: string, type: 'ITEM' | 'DEAL' = 'ITEM') => {
    const targetId = type === 'DEAL' ? `deal-${rawId}` : `item-${rawId}`;
    const found = cart.find((i) => i.id === targetId || i.productId === rawId || i.dealId === rawId);
    return found ? found.quantity : 0;
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Math.round(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const deliveryFee = subtotal > 0 ? DEFAULT_DELIVERY_FEE : 0;
  const totalPrice = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        isDrawerOpen,
        addItem,
        addDeal,
        updateQuantity,
        removeItem,
        clearCart,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        getItemQuantity,
        toastMessage,
        showToast,
        totalItemsCount,
        subtotal,
        deliveryFee,
        totalPrice,
      }}
    >
      {children}
      <Toast message={toastMessage} />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
