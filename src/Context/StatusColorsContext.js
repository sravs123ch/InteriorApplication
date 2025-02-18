import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { ORDER_STATUS_API } from "../../src/Constants/apiRoutes";

// Create the context
const StatusColorsContext = createContext(null);

// Provider component
export const StatusColorsProvider = ({ children }) => {
  const [statusColors, setStatusColors] = useState(() => {
    // Initialize state from localStorage if available
    const storedColors = localStorage.getItem("statusColors");
    return storedColors ? JSON.parse(storedColors) : {};
  });

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const { data } = await axios.get(ORDER_STATUS_API);
        if (data.StatusCode === "SUCCESS") {
          const fetchedStatuses = data.data || [];
          const colors = fetchedStatuses.reduce((acc, item) => {
            acc[item.OrderStatus] = item.HexColorCode || "#808080"; // Default to gray
            return acc;
          }, {});
          setStatusColors(colors);
          console.log("Fetched status colors:", colors);
          // Save to localStorage
          localStorage.setItem("statusColors", JSON.stringify(colors));
        } else {
          console.warn("Failed to fetch statuses:", data.Message);
        }
      } catch (error) {
        console.error("Error fetching statuses:", error.message);
      }
    };

    // Check if data already exists in localStorage, otherwise fetch
    if (!Object.keys(statusColors).length) {
      fetchStatuses();
    }
  }, [statusColors]);

  return (
    <StatusColorsContext.Provider value={statusColors}>
      {children}
    </StatusColorsContext.Provider>
  );
};

// Custom hook to use the context
export const useStatusColors = () => {
  const context = useContext(StatusColorsContext);
  if (!context) {
    throw new Error("useStatusColors must be used within a StatusColorsProvider");
  }
  return context;
};



// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { ORDER_STATUS_API } from "../../src/Constants/apiRoutes";

// // Create the context
// const StatusColorsContext = createContext(null);

// // Provider component
// export const StatusColorsProvider = ({ children }) => {
//   const [statusColors, setStatusColors] = useState(() => {
//     // Initialize state from localStorage if available
//     const storedColors = localStorage.getItem("statusColors");
//     return storedColors ? JSON.parse(storedColors) : {};
//   });

//   useEffect(() => {
//     console.log("useEffect triggered");
  
//     const fetchStatuses = async () => {
//       try {
//         const { data } = await axios.get(ORDER_STATUS_API);
//         console.log("API data:", data);
//         if (data.StatusCode === "SUCCESS") {
//           const fetchedStatuses = data.data || [];
//           const colors = fetchedStatuses.reduce((acc, item) => {
//             acc[item.OrderStatus] = item.HexColorCode || "#808080";
//             return acc;
//           }, {});
//           setStatusColors(colors);
//           localStorage.setItem("statusColors", JSON.stringify(colors));
//         } else {
//           console.warn("Failed to fetch statuses:", data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching statuses:", error.message);
//       }
//     };
  
//     if (!Object.keys(statusColors).length) {
//       fetchStatuses();
//     }
//   }, [statusColors]);
  
//   return (
//     <StatusColorsContext.Provider value={statusColors}>
//       {children}
//     </StatusColorsContext.Provider>
//   );
// };

// // Custom hook to use the context
// export const useStatusColors = () => {
//   const context = useContext(StatusColorsContext);
//   if (!context) {
//     throw new Error("useStatusColors must be used within a StatusColorsProvider");
//   }
//   return context;
// };
