

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context
const OrderUpdatedContext = createContext();

// Provider component
export const UpdatedStatusOrderProvider = ({ children }) => {
  const [updatedStatusOrderDetails, setUpdatedStatusOrderDetails] = useState({});

  // Use useEffect to log the current state whenever it changes
  useEffect(() => {
  }, [updatedStatusOrderDetails]);

  return (
    <OrderUpdatedContext.Provider value={{ updatedStatusOrderDetails, setUpdatedStatusOrderDetails }}>
      {children}
    </OrderUpdatedContext.Provider>
  );
};

// Hook to consume the context
export const useUpdatedStatusOrderContext = () => useContext(OrderUpdatedContext);

