import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import { FaPlus } from "react-icons/fa";
// import * as XLSX from "xlsx";
import { AiOutlineEdit } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import { FaTable } from "react-icons/fa";
import axios from "axios";
import { CustomerContext } from "../../Context/customerContext"; // Import CustomerContext
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { MdOutlineCancel } from "react-icons/md";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Datepicker from "react-tailwindcss-datepicker";
import {
  GETALLCUSTOMERS_API,
  DELETECUSTOMERSBYID_API,
  CUSTOMER_REPORT_API,
} from "../../Constants/apiRoutes";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import { GrFormView } from "react-icons/gr";
import { DataContext } from "../../Context/DataContext";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
const statusColors = {
  Positive: "bg-green-500",
  Gone: "bg-red-500",
  Hold: "bg-yellow-500",
  "On Process": "bg-blue-500",
};

function Customers() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  // const [Customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const navigate = useNavigate();
  const [paginatedPeople, setPaginatedPeople] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  // const { setCustomerDetails } = useContext(CustomerContext);
  const {  setCustomerDetails} =
    useContext(CustomerContext);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const fromDashboard = location.state?.fromDashboard || false;

  const { id } = useParams();

  // const [storeNames, setStoreNames] = useState([]);

  // const [customers] = useState([]);
  // const [activeStep, setActiveStep] = useState(0);
  // const [orders, setOrders] = useState([]); // State to hold the fetched orders
  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

const [ordersMap, setOrdersMap] = useState({});
// const [loading, setLoading] = useState(false);
// const [error, setError] = useState(null);
  // useEffect(() => {
  //   if (storesData) {
  //     setStores(storesData || []);
  //   }
  // }, [storesData]);

  const getStoreIDs = (stores) => {
    return stores.map((store) => store.StoreID); // Return an array of StoreIDs
  };

  useEffect(() => {
    if (storesData) {
      setStores(storesData);
      // Automatically set selectedStore if there's only one store
      if (storesData.length === 1) {
        setSelectedStore(storesData[0]);
      }
    }
  }, [storesData]);

  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });

//   const getAllCustomers = async (
//     pageNum,
//     pageSize,
//     searchName,
//     storeId,
//     startDate,
//     endDate
//   ) => {
//     try {
//       const response = await axios.get(GETALLCUSTOMERS_API, {
//         params: {
//           page: pageNum + 1,
//           pageSize: pageSize,
//           limit: pageSize,
//           SearchText: searchName,
//           StoreID: storeId,
//           FollowUps:id,
//           StartDate: startDate,
//           EndDate: endDate,
//         },
//       });

//       return {
//         customers: response.data.customers,
//         totalCount: response.data.totalItems,
//       };
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//       throw error;
//     }
//   };
// // Fetch customers and orders on component mount
// useEffect(() => {
//   fetchCustomers();
// }, []);

//   const fetchCustomers = async () => {
//     setIsLoading(true); // Set loading state to true before fetching data
//     try {
//       const storeIDs = selectedStore
//         ? [selectedStore.StoreID] // Wrap single StoreID in an array
//         : getStoreIDs(stores); // Get array of StoreIDs
  
//       if (!storeIDs || storeIDs.length === 0) {
//         console.warn("No StoreIDs provided. Skipping network call.");
//         setIsLoading(false);
//         return;
//       }
  
//       const { customers, totalCount } = await getAllCustomers(
//         page,
//         rowsPerPage,
//         searchName,
//         storeIDs,
//         value.startDate,
//         value.endDate
//       );
  
//       // setCustomers(customers);
//       setPaginatedPeople(customers);
  
//       if (!isSearching) {
//         setFilteredCustomers(customers); // Set initial filtered customers to all fetched data
//       }
//       const ordersData = customers.reduce((acc, customer) => { 
//         acc[customer.CustomerID] = customer.OrderCount;
//         return acc;
//       }, {});
  
//       setOrdersMap(ordersData); // Save in state
//       setTotalCustomers(totalCount);
//     } catch (error) {
//       console.error("Failed to fetch customers", error);
//     } finally {
//       setIsLoading(false); // Set loading state to false after fetching data
//     }
//   };
  
//   useEffect(() => {
//     fetchCustomers(); // Fetch customers on component mount or whenever page/rowsPerPage changes
//   }, [page, rowsPerPage, searchName, selectedStore,stores, value]);


const getAllCustomers = async (
  pageNum,
  pageSize,
  searchName,
  storeId,
  followUpId, // Renaming id for clarity
  startDate,
  endDate
) => {
  try {
    const params = {
      page: pageNum + 1,
      pageSize: pageSize,
      limit: pageSize,
      SearchText: searchName || "",
      StoreID: storeId, // Ensure this is an array if multiple StoreIDs exist
      FollowUp: followUpId, // Ensure it's being passed
      StartDate: startDate || "",
      EndDate: endDate || "",
    };

    console.log("API Request Params:", params); // Debugging log

    const response = await axios.get(GETALLCUSTOMERS_API, { params });

    return {
      customers: response.data.customers,
      totalCount: response.data.totalItems,
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

const fetchCustomers = async () => {
  setIsLoading(true);
  try {
    const storeIDs = selectedStore
      ? [selectedStore.StoreID] // Ensure it's an array
      : getStoreIDs(stores);

    if (!storeIDs || storeIDs.length === 0) {
      console.warn("No StoreIDs provided. Skipping network call.");
      setIsLoading(false);
      return;
    }

    console.log("Fetching customers with FollowUps ID:", id); // Debugging log

    const { customers, totalCount } = await getAllCustomers(
      page,
      rowsPerPage,
      searchName,
      storeIDs,
      id, // Ensure id is passed correctly
      value.startDate,
      value.endDate
    );

    setPaginatedPeople(customers);

    if (!isSearching) {
      setFilteredCustomers(customers);
    }

    const ordersData = customers.reduce((acc, customer) => {
      acc[customer.CustomerID] = customer.OrderCount;
      return acc;
    }, {});

    setOrdersMap(ordersData);
    setTotalCustomers(totalCount);
  } catch (error) {
    console.error("Failed to fetch customers", error);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchCustomers();
}, [page, rowsPerPage, searchName, selectedStore, stores, value, id]);
 

const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  const deleteCustomerById = async (customerId) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(

        `${DELETECUSTOMERSBYID_API}/${customerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (customerId) => {
    // navigate(`/Customerform/${customerId}`);
    navigate(`/Customerform/${customerId}`, { state: { fromFollowup: true } });

  };
  // Handle delete button click
  const handleDeleteClick = async (customerId) => {
    setIsLoading(true); // Set loading state to true before deleting data
    try {
      await deleteCustomerById(customerId);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after deleting data
    }
  };
  const searchItems = (value) => {
    setSearchName(value);
  };

  const handleExportCustomersData = async () => {
    setIsLoading(true);
    const url = CUSTOMER_REPORT_API; // New API endpoint

    // Define the request body (JSON format)
    const data = {
      StartDate: value.startDate,
      EndDate: value.endDate,
      StoreID: null, // Use selected store for ID
      ReferredBy: null,
    };

    try {
      // Make the POST request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Check if the response is okay
      if (response.ok) {
        // Process response as a blob for the Excel file
        const blob = await response.blob();

        // Create a link element
        const link = document.createElement("a");
        // Set the blob URL as the href
        link.href = window.URL.createObjectURL(blob);
        // Set the download attribute with a filename
        link.download = "customer_report.xlsx"; // Adjust the filename as needed
        // Append the link to the body
        document.body.appendChild(link);
        // Programmatically click the link to trigger the download
        link.click();
        // Remove the link from the document
        link.remove();

        // Show success toast
        toast.success("Excel file downloaded successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const errorText = await response.text(); // Get the error message from the response
        console.error(
          "Failed to download the file:",
          response.status,
          response.statusText,
          errorText
        );

        // Parse the error text as JSON and extract the error message
        let errorMessage = "";
        try {
          const parsedError = JSON.parse(errorText);
          errorMessage = parsedError.error; // Access the error message
        } catch (e) {
          errorMessage = "An unexpected error occurred"; // Fallback error message
        }

        // Show error toast with backend message
        toast.error(`Failed to download the file: ${errorMessage}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error while fetching the report:", error);
      // Show error toast with error message
      toast.error(`Error while fetching the report: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setIsLoading(false);
  };

  const handleAddCustomerClick = () => {
    setCustomerDetails(null);
    navigate("/Customerform/new");
  };
  const handleViewOrdersClick = (customerId) => {
    navigate(`/Customerform/${customerId}`, {
      state: { activeStep: 3 },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (storesData) {
        setStores(storesData);
        // Automatically set selectedStore if there's only one store
        if (storesData.length === 1) {
          setSelectedStore(storesData[0]);
        }
      }
      // Only fetch customers if a store is selected
      if (selectedStore || storesData.length>1) {
        await fetchCustomers(); // Fetch customers after setting stores
      }
    };
  
    fetchData(); // Call the fetchData function
  }, [storesData, page, rowsPerPage, searchName, selectedStore, value]); 
   // Retrieve the navbar-collapsed value from localStorage
   const storedCollapsed = localStorage.getItem('navbar-collapsed') === 'true';

   // Set the initial state based on the stored value
   const [isExpanded, setIsExpanded] = useState(!storedCollapsed);
 
   useEffect(() => {
     // Set the initial state based on the localStorage value
     const storedCollapsed = localStorage.getItem('navbar-collapsed');
     if (storedCollapsed !== null) {
       setIsExpanded(storedCollapsed === 'false');
     }
   }, []); // Only run this once on component mount
  
  return (
 
    <div
    className={`main-container ${isExpanded ? 'expanded' : 'collapsed'}`}
  >
      <ToastContainer />
      <div className="body-container">
        <h2 className="heading">Customers</h2>
        <div className="search-button-group">
          <ul className="button-list">
            <li>
              <button
                type="button"
                className="action-button"
                onClick={handleAddCustomerClick}
              >
                <FaPlus aria-hidden="true" className="icon" />
                Add Customers
              </button>
            </li>
            <li>
              <button
                type="button"
                className="action-button"
                onClick={handleExportCustomersData}
              >
                <FaTable aria-hidden="true" className="icon" />
                Export Customers
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 mt-2">
        {/* Search input in the center with equal width */}
        <div className="search-container-c-u w-1/4">
          <div className="relative">
            <input
              id="searchName"
              type="text"
              placeholder="Search by Name or Email"
              value={searchName}
              onChange={(e) => searchItems(e.target.value)}
              className="search-input w-full pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <IoIosSearch className="text-gray-500" />
            </div>
          </div>
        </div>
     
        <div className="combobox-container flex items-center">
          <Combobox value={selectedStore} onChange={setSelectedStore}>
            <div className="combobox-wrapper h-[40px]">
              <Combobox.Input
                className={`combobox-input w-full h-full ${selectedStore}`}
                displayValue={(store) => store?.StoreName || "Select Store ID"}
                placeholder="Select Store Name"
                readOnly={storesData.length === 1}
              />
              {storesData.length > 1 && (
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              )}
              {storesData.length > 1 && (
                <Combobox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {/* Add "Select Store ID" option */}
                  <Combobox.Option
                    key="select-store-id"
                    value={{ StoreID: null, StoreName: "Select Store ID" }}
                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                  >
                    Select Store ID
                  </Combobox.Option>
                  {/* Render all store options */}
                  {storesData.map((store) => (
                    <Combobox.Option
                      key={store.StoreID}
                      value={store}
                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                    >
                      <span className="block truncate group-data-[selected]:font-semibold">
                        {store.StoreName}
                      </span>
                      {selectedStore?.StoreID === store.StoreID && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}
            </div>
          </Combobox>
        </div>

        {/* Date picker on the right with equal width */}
        <div className="flex justify-center items-center gap-4 w-full p-2 sm:w-auto md:w-80 text-sm leading-6">
          <div className="border-solid border-gray-400 w-full border-[1px] rounded-lg">
            <Datepicker
              popoverDirection="down"
              showShortcuts={true}
              showFooter={true}
              placeholder="Start Date and End Date"
              primaryColor={"purple"}
              value={value}
              onChange={(newValue) => setValue(newValue)}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto">
      <TableContainer component={Paper} className="mt-4">
  <Table>
    <TableHead>
      <TableRow>
        <StyledTableCell style={{ width: "20%" }} align="center">Ref No</StyledTableCell>
        <StyledTableCell style={{ width: "20%" }} align="center">Contact Details</StyledTableCell>    
        <StyledTableCell style={{ width: "20%" }} align="center">
          Actions
        </StyledTableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {isLoading ? (
        <StyledTableRow>
          <StyledTableCell colSpan={3} align="center">
            Loading...
          </StyledTableCell>
        </StyledTableRow>
      ) : filteredCustomers.length > 0 ? (
        filteredCustomers.map((person, index) => (
          <StyledTableRow key={index}>
            {/* Reference Number */}
            <StyledTableCell style={{ width: "10%" }} align="center">
              {person.CustomerNumber ? person.CustomerNumber : "N/A"}
            </StyledTableCell>

            {/* Name & Contact Details */}
            <StyledTableCell style={{ width: "20%" }} align="center">
  <div className="flex flex-col items-start justify-center text-center ml-0 md:ml-32">
    <div className="flex items-center gap-1">
      <span className="text-gray-400">Name:</span> 
      <strong>{person.CustomerFirstName} {person.CustomerLastName}</strong>
    </div>
    <div className="mt-1 flex items-center gap-1">
      <span className="text-gray-400">Phone:</span> 
      {person.PhoneNumber ? person.PhoneNumber : "N/A"}
    </div>
  </div> 
</StyledTableCell>

            {/* Actions */}
            <StyledTableCell align="center" style={{ width: "20%" }}>
                <div className="button-container justify-center">
                      <button
                        type="button"
                        onClick={() => handleEditClick(person.CustomerID)}
                        className="button edit-button  items-center"
                      >
                        <AiOutlineEdit aria-hidden="true" className="h-4 w-4" />
                        Edit
                      </button>
                     
                    </div>
            </StyledTableCell>
          </StyledTableRow>
        ))
      ) : (
        <StyledTableRow>
          <StyledTableCell colSpan={3} align="center">
            No customers found.
          </StyledTableCell>
        </StyledTableRow>
      )}
    </TableBody>

    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[10, 20, 25]}
          colSpan={3}
          count={totalCustomers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </TableRow>
    </TableFooter>
  </Table>
</TableContainer>

     </div>
      {isLoading && <LoadingAnimation />}
    </div>
  );
}

export default Customers;
