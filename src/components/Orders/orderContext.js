import React, { createContext, useState } from 'react';
import { GETORDERBYID_API } from "../../src/Constants/apiRoutes";

// Create the context
export const OrderContext = createContext();

// Provider component
export const OrderProvider = ({ children }) => {
  const [orderIdDetails, setOrderIdDetails] = useState(null);

  // Function to fetch order data by ID using the JWT token
  const getOrderById = async (orderId) => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      console.error('JWT token is missing');
      return;
    }

    try {
      const response = await fetch(
        `${GETORDERBYID_API}/${orderId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Include the JWT token in the Authorization header
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();

      setOrderIdDetails(data);  // Set fetched data into the context state
      return data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{ orderIdDetails, setOrderIdDetails, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};
