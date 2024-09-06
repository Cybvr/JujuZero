import React, { createContext, useState, useContext } from 'react';

interface PricingDialogContextType {
  isPricingOpen: boolean;
  setIsPricingOpen: (isOpen: boolean) => void;
}

const PricingDialogContext = createContext<PricingDialogContextType | undefined>(undefined);

export const PricingDialogProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  return (
    <PricingDialogContext.Provider value={{ isPricingOpen, setIsPricingOpen }}>
      {children}
    </PricingDialogContext.Provider>
  );
};

export const usePricingDialog = () => {
  const context = useContext(PricingDialogContext);
  if (context === undefined) {
    throw new Error('usePricingDialog must be used within a PricingDialogProvider');
  }
  return context;
};