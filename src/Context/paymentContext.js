import React, { createContext, useState } from 'react';
import {  GETPAYMENTSBY_PAYMETID_API} from "../../src/Constants/apiRoutes";
// Create the context
export const PaymentContext = createContext();
 
// Provider component
export const PaymentProvider = ({ children }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);
 
  // Function to fetch payment data by ID
  const getPaymentById = async (OrderId) => {
    try {
      const response = await fetch(
        // `https://imlystudios-backend-mqg4.onrender.com/api/payments/getPaymentById/${OrderId}`
      
         `${GETPAYMENTSBY_PAYMETID_API}/${OrderId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch payment details');
      }
      const data = await response.json();
      setPaymentDetails(data); // Set fetched data into the context state
      return data;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  };
 
  return (
    <PaymentContext.Provider value={{ paymentDetails, setPaymentDetails, getPaymentById }}>
      {children}
    </PaymentContext.Provider>
  );
};
 