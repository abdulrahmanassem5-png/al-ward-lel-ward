import { createContext, useContext, useState } from 'react';
import QuickCheckoutDrawer from '../components/storefront/QuickCheckoutDrawer/QuickCheckoutDrawer.jsx';

const QuickCheckoutContext = createContext(null);

export function QuickCheckoutProvider({ children }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openQuickCheckout = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeQuickCheckout = () => {
    setIsOpen(false);
  };

  return (
    <QuickCheckoutContext.Provider value={{ openQuickCheckout, closeQuickCheckout }}>
      {children}
      <QuickCheckoutDrawer
        product={selectedProduct}
        isOpen={isOpen}
        onClose={closeQuickCheckout}
      />
    </QuickCheckoutContext.Provider>
  );
}

export function useQuickCheckout() {
  const context = useContext(QuickCheckoutContext);
  if (!context) {
    throw new Error('useQuickCheckout must be used within QuickCheckoutProvider');
  }
  return context;
}
