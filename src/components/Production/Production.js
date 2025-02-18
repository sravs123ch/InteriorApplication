import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import StatusBadge from "./Satus";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { TableFooter } from "@mui/material";
import axios from "axios";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterBar from "./FilterBar";
import StatusUpdateDialog from "../Orders/StatusUpdateDialog";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { OrderContext } from "../../Context/orderContext";
import { DataContext } from "../../Context/DataContext";

import { FaPlus, FaTable } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import Datepicker from "react-tailwindcss-datepicker";
import {
  GET_ALL_ORDERS,
  GETALLSTORES_API,
  GETORDERBYID_API,
  UPDATESUBORDERSTATUSAPI,GETALLUSERS_API,
} from "../../Constants/apiRoutes";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import TablePagination from "@mui/material/TablePagination";
export default function Orders() {
  const [products, setProducts] = useState([]);
  const { setOrderIdDetails } = useContext(OrderContext);

  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState({
    label: "All",
    subStatusId: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [selectedStore, setSelectedStore] = useState({
    StoreID: "",
    StoreName: "Select Store",
  });
  // useEffect(() => {
  //   if (storesData) {
  //     setStores(storesData);
  //     // Automatically set selectedStore if there's only one store
  //     if (storesData.length === 1) {
  //       setSelectedStore(storesData[0]);
  //     }
  //   }
  // }, [storesData]);

  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });
  const handleOrderNumberChange = (e) => {
    setDetails({
      ...details,
      OrderNumber: e.target.value, // Update only the OrderNumber in the state
    });
  };
  const searchItems = (value) => {
    setSearchName(value);
  };
  const handleFilterChange = (filter) => {
    // Default filter: If the filter is not provided, default to 'All'
    const defaultFilter = { label: "All", subStatusId: "" };

    // Use the provided filter or fallback to default 'All' filter
    const selectedFilter = filter || defaultFilter;

    // Set selected filter state
    setSelectedFilter({
      label: selectedFilter.label,
      subStatusId: selectedFilter.subStatusId,
      status: selectedFilter.status,
    });

    // Log selected filter before making API call (optional)

    // Get subStatusId or default to empty string if it's not provided
    const subStatusId = selectedFilter.subStatusId || "";
  };
  useEffect(() => {
    if (selectedFilter) {
        fetchOrders(1, 10, "", "", "", "", selectedFilter.subStatusId || "");
    }
}, [selectedFilter]);
  const [totalCount, setTotalCount] = useState(0);
  const statuses = [
    { label: "All" }, // Added All label
    { label: "In Progress", count: "", status: "InProgress", subStatusId: 2 },
    { label: "Completed", count: "", status: "Completed", subStatusId: 3 },
    { label: "Cancelled", count: "", status: "Cancelled", subStatusId: 4 },
    { label: "Yet to Start", count: "", status: "YetToStart", subStatusId: 1 },
  ];
  const getStoreIDs = () => {
    const storeIDs = storesData.map((store) => store.StoreID);
    return storeIDs;
  };


  const fetchOrders = async () => {
    setLoading(true);

    try {
      // Determine storeIDs
      let storeId;
      if (selectedStore.StoreID) {
        storeId = selectedStore.StoreID;
      } else {
        storeId = getStoreIDs();
      }

      // Call the API with parameters
      const { orders, totalCount } = await getAllOrders(
        page,
        rowsPerPage,
        searchName,
        storeId,
        value.startDate,
        value.endDate,
        selectedFilter?.subStatusId || "" // Pass selectedFilter if available
      );


      // Update state with the API response
      setProducts(orders);
      setTotalOrders(totalCount);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllOrders = async (
    pageNum,
    pageSize,
    search = "",
    storeIds = [],
    startDate = "",
    endDate = "",
    subStatusId = "",
    selectedFilter = null // Added selectedFilter parameter
  ) => {
    try {
      const response = await axios.get(`${GET_ALL_ORDERS}`, {
        params: {
          page: pageNum + 1,
          pageSize: pageSize,
          searchText: search,
          StoreIDs: storeIds,
          StartDate: startDate,
          EndDate: endDate,
          SubStatusId: subStatusId,
        },
      });

      const products = response.data.data;
      // Apply the selected filter logic
      const filteredOrders = products.filter((product) => {
        return (
          (!selectedFilter ||
            selectedFilter.label === "All" ||
            product.SubStatusId === selectedFilter.subStatusId) &&
          (!subStatusId || product.SubStatusId === subStatusId) &&
          product.OrderStatus === "Production"
        );
      });

      // Map the filtered orders to include the status label based on SubStatusId
      const ordersWithStatus = filteredOrders.map((order) => {
        const status = statuses.find(
          (s) => s.subStatusId === order.SubStatusId
        );
        return {
          ...order,
          statusLabel: status ? status.label : "Unknown", // Assign status label or 'Unknown' if not found
        };
      });
      return {
        orders: ordersWithStatus,
        totalCount: ordersWithStatus.length, // Total count of filtered orders
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (refresh) {
        // Call fetchOrders when refresh state is true
        fetchOrders(1, 10, "", "", "", "", selectedFilter?.subStatusId || "");

        // Reset refresh state to false after calling fetchOrders
        setRefresh(false);
    }
}, [refresh]); // This will re-run every time `refresh` changes

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
      if (selectedStore) {
        await fetchOrders(); // Fetch customers after setting stores
      }
    };

    fetchData(); // Call the fetchData function
  }, [storesData, page, rowsPerPage, searchName, selectedStore]); //

  const handleStatusChange = (id, newStatus) => {
    setProducts((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
        // Call API to update sub-order status
        await axios.post(UPDATESUBORDERSTATUSAPI, {
            OrderID: details.OrderID,
            SubStatusId: details.SubStatusId,
            SubUserID:details.UserID,
        });

        // Show success toast notification
        toast.success("Order status updated successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        // Close the dialog
        setOpenDialog(false);

        // Toggle the refresh state to trigger the fetch
        setRefresh(prev => !prev);
    } catch (error) {
        console.error("API Call Error:", error);
        toast.error("Failed to update order status. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } finally {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }
};
  const filteredOrders1 = products.filter(
    (product) =>
      !selectedFilter ||
      selectedFilter.label === "All" ||
      product.SubStatusId === selectedFilter.subStatusId
  );
  const paginatedData = filteredOrders1.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleCancel = (id) => {
    const newStatus = "Canceled";
    handleStatusChange(id, newStatus);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOrderUpdate = (event, order) => {
    event.preventDefault();
    navigate("/update-order", { state: { order } });
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [details, setDetails] = useState({});

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setDetails(order); // Initialize details for editing
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

   const [searchUserValue, setSearchUserValue]=useState();
   const [isUserFocused, setIsUserFocused] = useState();
   const [hasUserSelected, setHasUserSelected] = useState(false);
   const[desginerID,setDesginerID]=useState();
const [results, setResults] = useState([]);
const [errors, setErrors] = useState(null);

   // Function to fetch users from API
   const getAllUsers = async (pageNum, pageSize, search = "") => {
     try {
       const token = localStorage.getItem("token");
       if (!token) {
         throw new Error("No authentication token found");
       }
 
       const response = await axios.get(
         // "https://imlystudios-backend-mqg4.onrender.com/api/users/getAllUsers",
         GETALLUSERS_API,
         {
           params: {
             page: pageNum + 1,
             limit: pageSize,
             SearchText: search,
           },
           headers: {
             Authorization: `Bearer ${token}`,
             "Content-Type": "application/json",
           },
         }
       );
 
       return {
         users: response.data.users,
         totalCount: response.data.totalItems,
       };
     } catch (error) {
       console.error("Error fetching users:", error);
       throw error;
     }
   };
 
  //  const handleUserChange = (e) => {
  //    const value = e.target.value;
  //    setSearchUserValue(value);
 
  //    // Call the API to get users only if the input has more than 0 characters
  //    if (value.trim().length > 0) {
  //      getAllUsers(0, 10, value)
  //        .then((response) => {
  //          setResults(response.users || []); // Use empty array as fallback
  //          // If the API returns users, set the designer details based on the first result
  //          if (response.users && response.users.length > 0) {
  //            const firstUser = response.users[0]; // Adjust based on your user object
  //            const designerName = `${firstUser.FirstName} ${firstUser.LastName}`;
  //            const designerId = firstUser.UserID;
 
  //            // Set the designer ID and name
  //            setDesginerID(designerId);
  //           //  setDesignerName(designerName);
  //          } else {
  //            // Clear if no users are found
  //           //  setDesignerName("");
  //            setDesginerID("");
  //          }
  //        })
  //        .catch((error) => {
  //          console.error("Error fetching users:", error);
  //          setResults([]); // Clear results on error
  //        });
  //    } else {
  //      setResults([]); // Clear results if input is empty
  //     //  setDesignerName(""); // Clear designer name if input is empty
  //      setDesginerID(""); // Clear designer ID if input is empty
  //    }
  //  };
 
  //  const handleUserSelect = (selectedUser) => {
  //    // Set the Order Details with the selected user info
  //    setDetails((prevDetails) => ({
  //      ...prevDetails,
  //      DesginerName: `${selectedUser.FirstName} ${selectedUser.LastName}`, // Set Designer Name
  //      UserID: selectedUser.UserID, // Set UserID
  //      DesignerID: selectedUser.UserID,
  //      SubUserID: selectedUser.UserID, // Set AssignTo field with UserID
  //    }));
 
  //    // Set the input field with the selected user's full name
  //    setSearchUserValue(`${selectedUser.FirstName} ${selectedUser.LastName}`);
  //    setSearchUserValue(details.SubUserName);
   
 
  //    // Set Designer ID and close dropdown
  //   //  setDesginerID(selectedUser.UserID); // Correctly set Designer ID on selection
  //    setIsUserFocused(false); // Close dropdown after selection
  //  };
 
  // Set SubUserName as the initial value when the component mounts or updates
  useEffect(() => {
    if (details?.SubUserName) {
      setSearchUserValue(details.SubUserName);
    }
  }, [details?.SubUserName]);

  // Handle user input change
  const handleUserChange = (e) => {
    const value = e.target.value;
    setSearchUserValue(value);

    // Call the API to get users only if the input has more than 0 characters
    if (value.trim().length > 0) {
      getAllUsers(0, 10, value)
        .then((response) => {
          setResults(response.users || []); // Set API results
          if (response.users && response.users.length > 0) {
            const firstUser = response.users[0];
            setDesginerID(firstUser.UserID); // Set first user's ID
          } else {
            setDesginerID(""); // Clear if no users are found
          }
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setResults([]); // Clear results on error
        });
    } else {
      setResults([]); // Clear results if input is empty
      setDesginerID(""); // Clear designer ID
    }
  };

  // Handle user selection
  const handleUserSelect = (selectedUser) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      DesginerName: `${selectedUser.FirstName} ${selectedUser.LastName}`,
      UserID: selectedUser.UserID,
      DesignerID: selectedUser.UserID,
      SubUserID: selectedUser.UserID,
    }));

    setSearchUserValue(`${selectedUser.FirstName} ${selectedUser.LastName}`);
    setIsUserFocused(false); // Close dropdown
  };

  return (
    <div className="main-container">
      <ToastContainer />
      {loading && <LoadingAnimation />}
      <div>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="heading">Production Orders</h2>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2 mt-2">
          {/* Container for centering search box */}
          <div className="search-container-c-u">
            <label htmlFor="searchName" className="sr-only">
              Search
            </label>
            <input
              id="searchName"
              type="text"
              placeholder=" Search by Order Number / Customer Name "
              value={searchName}
              onChange={(e) => searchItems(e.target.value)}
              className="mt-1 p-1 pr-10 border border-gray-400 rounded-md w-full sm:w-64 text-sm leading-6 h-[40px]"
            />
            <div className="search-icon-container-c-u">
              <IoIosSearch />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10">
            <Combobox value={selectedStore} onChange={setSelectedStore}>
              <div className="combobox-wrapper h-[40px]">
                <Combobox.Input
                  className={`combobox-input w-full h-full ${
                    selectedStore
                  }`}
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
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                    {/* Add "Select Store ID" option */}
                    <Combobox.Option
                      key="select-store-id"
                      value={{ StoreID: null, StoreName: "Select Store ID" }}
                      className={({ active }) =>
                        `cursor-pointer select-none relative p-2 ${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={
                              selected ? "font-semibold" : "font-normal"
                            }
                          >
                            Select Store ID
                          </span>
                          {selected && (
                            <CheckIcon
                              className="h-5 w-5 text-white absolute right-2"
                              aria-hidden="true"
                            />
                          )}
                        </>
                      )}
                    </Combobox.Option>
                    {/* Render all store options */}
                    {storesData.map((store) => (
                      <Combobox.Option
                        key={store.StoreID}
                        value={store}
                        className={({ active }) =>
                          `cursor-pointer select-none relative p-2 ${
                            active ? "bg-blue-500 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={
                                selected ? "font-semibold" : "font-normal"
                              }
                            >
                              {store.StoreName}
                            </span>
                            {selected && (
                              <CheckIcon
                                className="h-5 w-5 text-white absolute right-2"
                                aria-hidden="true"
                              />
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
          </div>

          {/* Container for Date Pickers */}
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
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap">
          {/* Left Column (25%) */}
          <FilterBar
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
            totalCount={totalCount}
          />
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-3/4 p-4">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: "4px",
                        whiteSpace: "nowrap",
                      }}
                      className="font-semibold"
                    >
                      Order Number
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: "4px",
                        whiteSpace: "nowrap",
                      }}
                      className="font-semibold"
                    >
                      Order Date
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: "4px",
                        whiteSpace: "nowrap",
                      }}
                      className="font-semibold"
                    >
                      Customer Info
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: "4px",
                        whiteSpace: "nowrap",
                      }}
                      className="font-semibold"
                    >
                      Delivery Info
                    </StyledTableCell>

                    <StyledTableCell
                      align="center"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: "4px",
                        whiteSpace: "nowrap",
                      }}
                      className="font-semibold"
                    >
                      Order Status
                    </StyledTableCell>

                    <StyledTableCell
                      align="center"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: "4px",
                        whiteSpace: "nowrap",
                      }}
                      className="font-semibold"
                    >
                      Updates
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={6} align="center">
                        {/* Display loading animation */}
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    paginatedData.map((product) => (
                      <StyledTableRow key={product.OrderID}>
                        <StyledTableCell className="text-xs text-center">
                          {product.OrderNumber}
                        </StyledTableCell>
                        <StyledTableCell className="text-xxs text-center">
                          {" "}
                          {/* Adjust size here */}
                          {product.OrderDate
                            ? (() => {
                                const date = new Date(product.OrderDate);
                                const month = date.toLocaleString("en-US", {
                                  month: "short",
                                });
                                const day = String(date.getDate()).padStart(
                                  2,
                                  "0"
                                );
                                const year = date.getFullYear();
                                return `${month} ${day}, ${year}`;
                              })()
                            : "N/A"}{" "}
                          <span className="text-[10px] whitespace-nowrap">
                            {new Date(product.OrderDate)
                              .toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                              .toUpperCase()}
                          </span>
                          <br />
                          <div className="mt-1 text-gray-500 text-[10px] whitespace-nowrap">
                            Project: <strong>{product.Type || "N/A"}</strong>
                          </div>
                        </StyledTableCell>

                        <StyledTableCell align="left" className="text-xs">
                          <div className="text-[14px] whitespace-nowrap">
                            <span className="text-gray-500">Name: </span>
                            <strong>{product.CustomerName || "N/A"}</strong>
                          </div>

                          <div className="mt-1">
                            <span className="text-gray-500 text-xs">
                              Phone:{" "}
                            </span>
                            <span className="text-[10px]">
                              {product.Phone || "N/A"}
                            </span>{" "}
                            {/* Decreased font size here */}
                          </div>
                        </StyledTableCell>
                        <StyledTableCell className="text-xs text-center">
                          {product.DeliveryDate
                            ? (() => {
                                const date = new Date(product.DeliveryDate);
                                const month = date.toLocaleString("en-US", {
                                  month: "short",
                                });
                                const day = String(date.getDate()).padStart(
                                  2,
                                  "0"
                                );
                                const year = date.getFullYear();
                                return `${month} ${day}, ${year}`;
                              })()
                            : "N/A"}
                          <br />
                          <div className="mt-1 text-gray-500 text-xs">
                            {/* Amount: &#8377;{product.TotalAmount || "N/A"} */}
                            Sub User:{product.SubUserName||"N/A"}
                          </div>
                        </StyledTableCell>
                    
<StyledTableCell align="center" className="text-xs">
  <StatusBadge status={product.statusLabel} />
  <br />
  <div className="inline-flex items-center justify-center mt-1">
    {product.OntimeorDelay === "1" ? (
      <span className="inline-flex items-center bg-green-100 px-1 py-1 rounded">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span className="text-green-600 text-xs ml-1">
          <strong>On time</strong>
        </span>
      </span>
    ) : product.OntimeorDelay === "2" ? (
      <span className="inline-flex items-center bg-orange-100 px-1 py-1 rounded">
        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
        <span className="text-orange-600 text-xs ml-1">
          <strong>Delay</strong>
        </span>
      </span>
    ) : null}
  </div>
</StyledTableCell>
<StyledTableCell align="center">
  {product.statusLabel !== "Completed" && (
    <div className="flex justify-center space-x-1">
      <button
        type="button"
        onClick={() => handleEditClick(product)}
        className="text-xs button edit-button flex items-center"
      >
        <AiOutlineEdit
          aria-hidden="true"
          className="h-4 w-4"
        />
        Edit
      </button>
    </div>
  )}
</StyledTableCell>
{/* <StyledTableCell align="center">
  {product.statusLabel !== "Completed" ? (
    <div className="flex justify-center space-x-1">
      <button
        type="button"
        onClick={() => handleEditClick(product)}
        className="text-xs button edit-button flex items-center"
      >
        <AiOutlineEdit aria-hidden="true" className="h-4 w-4" />
        Edit
      </button>
    </div>
  ) : (
   
    <div className="flex justify-center space-x-1">
    <button
      type="button"
      className=" gap-1 rounded-md py-1 px-2 text-xs font-semibold shadow-md h-7 
                 bg-gray-200 text-gray-600 w-[75px] flex justify-center items-center
                 hover:bg-gray-400 hover:text-gray-800"
    >
      <AiOutlineEdit aria-hidden="true" className="h-4 w-4" />
      Edit
    </button>
  </div>
  

  )}
</StyledTableCell> */}

                      </StyledTableRow>
                    ))
                  )}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[10, 20, 25]}
                      colSpan={6}
                      count={totalOrders}
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
        </div>
  
<Dialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  maxWidth="xs"
  fullWidth={false}
  sx={{
    zIndex: 30,
    ml: "auto",
    "& .MuiDialog-paper": {
      width: "500px",
      height: "400px",  // Increased height to suit your need
      borderRadius: "10px",
      // overflow: "hidden", 
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: "bold",
      fontSize: "1.2rem",
      textAlign: "center",
      color: "#333",
      pb: 2,
    }}
  >
    Edit Production Details
  </DialogTitle>

  <DialogContent
    sx={{
      overflowY: "auto",  // Enable scrolling inside content if needed
      height: "calc(100% - 60px)", // Adjust height for content section (leave room for title & actions)
      paddingBottom: "16px",  // Optional for padding at the bottom
    }}
  >
    <TextField
      margin="dense"
      name="OrderNumber"
      label="Order Number"
      type="text"
      variant="outlined"
      value={details.OrderNumber || ""}
      onChange={(e) => handleOrderNumberChange(e)}
      fullWidth
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          height: "48px",
          fontSize: "0.95rem",
          borderRadius: "8px",
        },
      }}
    />

    <input type="hidden" name="OrderID" value={details.OrderID || ""} />

    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
      <InputLabel sx={{ fontSize: "0.95rem" }}>Production Status</InputLabel>
      <Select
        name="SubStatusId"
        value={details.SubStatusId || ""}
        onChange={handleChange}
        label="Production Status"
        sx={{
          height: "48px",
          fontSize: "0.95rem",
          borderRadius: "8px",
        }}
      >
        <MenuItem value="" disabled>
          Select Production Status
        </MenuItem>
        <MenuItem value="1">Yet to Start</MenuItem>
        <MenuItem value="2">In Progress</MenuItem>
        <MenuItem value="3">Completed</MenuItem>
        <MenuItem value="4">Cancelled</MenuItem>
      </Select>
    </FormControl>

    {/* <FormControl fullWidth variant="outlined" margin="dense">
      {!searchUserValue && (
        <InputLabel
          htmlFor="assigned-to-pdi"
          sx={{
            fontSize: "0.95rem",
            position: "absolute",
            top: "50%", // Center vertically when visible
            left: "16px",
            transform: "translateY(-50%)",
            transformOrigin: "top left",
            transition: "all 0.2s ease-in-out",
            pointerEvents: "none",
            color: isUserFocused ? "primary.main" : "text.secondary",
          }}
        >
          Search Assigned to PDI
        </InputLabel>
      )}
      <div className="relative">
        <input
          type="text"
          name="AssignedTo"
          value={searchUserValue}
          // value={details.SubUserName || ""}
          onChange={handleUserChange}
          onFocus={() => setIsUserFocused(true)}
          className={`p-2 pr-10 w-full border rounded-md text-sm ${
            errors?.AssignToError && !desginerID
              ? "border-red-500"
              : "border-gray-300"
          }`}
          style={{
            height: "48px",
            fontSize: "0.95rem",
            borderRadius: "8px",
            paddingRight: "2.5rem", // Space for the search icon
            paddingLeft: "16px", // Align with label
          }}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
          <IoIosSearch aria-label="Search Icon" />
        </div>
        {isUserFocused && searchUserValue && searchUserValue.length >= 1 && results.length > 0 && (
          <div
            className="absolute flex flex-col top-full mt-1 border rounded-lg p-2 w-full bg-white z-10"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            <div className="mb-2 text-sm text-gray-600">
              {results.length} Result{results.length > 1 ? "s" : ""}
            </div>
            {results.map((result) => (
              <div
                className="relative cursor-pointer p-2 hover:bg-gray-100 group"
                key={result.CustomerID}
                onClick={() => handleUserSelect(result)}
              >
                <span className="font-medium">
                  {result.FirstName} {result.LastName}
                </span>
              </div>
            ))}
          </div>
        )}

        {isUserFocused && searchUserValue && results.length === 0 && (
          <div className="p-2 overflow-clip text-gray-500">
            No results found.
          </div>
        )}
      </div>
    </FormControl> */}

<FormControl fullWidth variant="outlined" margin="dense">
      {!searchUserValue && (
        <InputLabel
          htmlFor="assigned-to-pdi"
          sx={{
            fontSize: "0.95rem",
            position: "absolute",
            top: "50%",
            left: "16px",
            transform: "translateY(-50%)",
            transition: "all 0.2s ease-in-out",
            pointerEvents: "none",
            color: isUserFocused ? "primary.main" : "text.secondary",
          }}
        >
          Search Assigned to PDI
        </InputLabel>
      )}

      <div className="relative">
        {/* Input Field */}
        <input
          type="text"
          name="AssignedTo"
          value={searchUserValue}
          onChange={handleUserChange}
          onFocus={() => setIsUserFocused(true)}
          className={`p-2 pr-10 w-full border rounded-md text-sm ${
            errors?.AssignToError && !desginerID
              ? "border-red-500"
              : "border-gray-300"
          }`}
          style={{
            height: "48px",
            fontSize: "0.95rem",
            borderRadius: "8px",
            paddingRight: "2.5rem",
            paddingLeft: "16px",
          }}
        />
        {/* Search Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
          <IoIosSearch aria-label="Search Icon" />
        </div>

        {/* Dropdown Results */}
        {isUserFocused && searchUserValue && results.length > 0 && (
          <div
            className="absolute flex flex-col top-full mt-1 border rounded-lg p-2 w-full bg-white z-10"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            <div className="mb-2 text-sm text-gray-600">
              {results.length} Result{results.length > 1 ? "s" : ""}
            </div>
            {results.map((result) => (
              <div
                className="relative cursor-pointer p-2 hover:bg-gray-100"
                key={result.CustomerID}
                onClick={() => handleUserSelect(result)}
              >
                <span className="font-medium">
                  {result.FirstName} {result.LastName}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {isUserFocused && searchUserValue && results.length === 0 && (
          <div className="p-2 text-gray-500">No results found.</div>
        )}
      </div>
    </FormControl>
  </DialogContent>

  <DialogActions>
    <button
      type="submit"
      onClick={() => {
        handleSubmit();
        setSearchUserValue("");
      }}
      className="inline-flex justify-center rounded-md bg-custom-darkblue py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-custom-lightblue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Update
    </button>
    <button
      type="button"
      onClick={() => {
        setOpenDialog(false);
        setSearchUserValue("");
      }}
      className="inline-flex justify-center rounded-md bg-red-500 py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-red-200"
    >
      Cancel
    </button>
  </DialogActions>
</Dialog>

      </div>
    </div>
  );
}
