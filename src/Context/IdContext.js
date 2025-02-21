import React, { createContext, useState, useEffect } from "react";

// Create a Context for the ID
export const IdContext = createContext();

// Create a provider component
export const IdProvider = ({ children }) => {
  const [generatedId, setGeneratedId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [orderDate, setOrderDate] = useState(null);
  const [designerName, setDesignerName] = useState(null); // New state for designer name
  const [desginerID, setDesginerID] = useState(null);
  const [statusID, setStatusID] = useState(null);
  const [roleID, setRoleID] = useState(null);
  const [AdvanceAmount, setAdvanceAmount] = useState(null);
  const [TotalAmount, setTotalAmount] = useState(null);
  const[BalanceAmount,setBalanceAmount]=useState(null);
  const [storeId, setStoreId] = useState(null);

  // Log the designerName whenever it changes
  useEffect(() => {}, [designerName]);
  // Log the designerName whenever it changes
  useEffect(() => {}, [statusID]);

  useEffect(() => {}, [desginerID]);
  useEffect(() => {}, [storeId]);

  useEffect(() => {}, [BalanceAmount]);

  return (
    <IdContext.Provider
      value={{
        generatedId,
        setGeneratedId,
        customerId,
        setCustomerId,
        orderDate,
        setOrderDate,
        designerName, // Expose designerName
        setDesignerName,
        desginerID,
        setDesginerID, // Expose setDesignerName
        statusID,
        setStatusID,
        roleID,
        setRoleID,
        AdvanceAmount,
        setAdvanceAmount,
        storeId,
        setStoreId,
        BalanceAmount,
        setBalanceAmount,TotalAmount, setTotalAmount,
      }}
    >
      {children}
    </IdContext.Provider>
  );
};
