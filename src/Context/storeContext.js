import React, { createContext, useState } from 'react';
import {GETALLSTORESBYID_API } from "../../src/Constants/apiRoutes";
// Create the context
export const StoreContext = createContext();

// Provider component
export const StoreProvider = ({ children }) => {
  const [storeDetails, setStoreDetails] = useState(null);

  // Function to fetch store data by ID
  const getStoreById = async (storeId) => {
    try {
      const response = await fetch(
        // `https://imlystudios-backend-mqg4.onrender.com/api/stores/getStoreById/${storeId}`
         `${GETALLSTORESBYID_API}/${storeId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch store details');
      }
      const data = await response.json();
      setStoreDetails(data);  // Set fetched data into the context state
      return data;
    } catch (error) {
      console.error('Error fetching store details:', error);
      throw error;
    }
  };

  return (
    <StoreContext.Provider value={{ storeDetails, setStoreDetails, getStoreById }}>
      {children}
    </StoreContext.Provider>
  );
};


// import React, { createContext, useState } from 'react';

// // Create the context
// export const StoreContext = createContext();

// // Provider component
// export const StoreProvider = ({ children }) => {
//   const [storeDetails, setStoreDetails] = useState(null);

//   // Function to fetch store data by ID
//   const getStoreById = async (storeId) => {
//     try {
//       const response = await fetch(`https://imlystudios-backend-mqg4.onrender.com/api/getStoreById/${storeId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch store details');
//       }
//       const data = await response.json();
//       setStoreDetails(data);  // Set fetched data into the context state
//       return data;
//     } catch (error) {
//       console.error('Error fetching store details:', error);
//       throw error;
//     }
//   };

//   return (
//     <StoreContext.Provider value={{ storeDetails, setStoreDetails, getStoreById }}>
//       {children}
//     </StoreContext.Provider>
//   );
// };
