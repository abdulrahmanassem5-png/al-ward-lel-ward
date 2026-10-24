import { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'al_ward_cart_items_v1';

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload || [] };
    case 'ADD_ITEM': {
      const incomingQty = Number(action.payload.quantity) || 1;
      const targetSize = action.payload.size || action.payload.selectedSize || 'medium';

      const existingIndex = state.items.findIndex(
        (i) => String(i.id) === String(action.payload.id) && (i.size || i.selectedSize || 'medium') === targetSize
      );

      if (existingIndex >= 0) {
        return {
          ...state,
          items: state.items.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: item.quantity + incomingQty }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload,
            size: targetSize,
            selectedSize: targetSize,
            quantity: incomingQty,
          },
        ],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(String(i.id) === String(action.payload.id) && (i.size || i.selectedSize || 'medium') === (action.payload.size || 'medium'))
        ),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((i) =>
          String(i.id) === String(action.payload.id) && (i.size || i.selectedSize || 'medium') === (action.payload.size || 'medium')
            ? { ...i, quantity: Math.max(1, Number(action.payload.quantity) || 1) }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(CART_STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return { items: parsed };
      }
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
    }
    return { items: [] };
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (e) {
      console.error('Failed to save cart to storage:', e);
    }
  }, [state.items]);

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CART_STORAGE_KEY) {
        try {
          const parsed = JSON.parse(e.newValue || '[]');
          if (Array.isArray(parsed)) {
            dispatch({ type: 'SET_ITEMS', payload: parsed });
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addItem = useCallback((item, quantity = 1) => {
    const finalQty = Number(quantity) || Number(item?.quantity) || 1;
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...item, quantity: finalQty },
    });
  }, []);

  const removeItem = useCallback((id, size = 'medium') => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, size } });
  }, []);

  const updateQuantity = useCallback((id, size = 'medium', quantity = 1) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const totalItems = useMemo(() => {
    return state.items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  }, [state.items]);

  const totalPrice = useMemo(() => {
    return state.items.reduce((sum, i) => {
      const price = Number(i.sale_price) || Number(i.price) || 0;
      return sum + price * (Number(i.quantity) || 0);
    }, 0);
  }, [state.items]);

  const contextValue = useMemo(() => ({
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }), [state.items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
