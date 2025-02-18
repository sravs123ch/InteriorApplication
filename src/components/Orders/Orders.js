import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import StatusBadge from "./Statuses";
import FilterBar from "./FilterBar";
import * as XLSX from "xlsx";
import { AiOutlineEdit } from "react-icons/ai";
import { TableFooter } from "@mui/material";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";
import PropTypes from "prop-types";
import { GET_ALL_ORDERS, GET_ORDER_REPORT } from "../../Constants/apiRoutes";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import LoadingAnimation from "../Loading/LoadingAnimation";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { FaPlus, FaTable } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import Datepicker from "react-tailwindcss-datepicker";
import { OrderContext } from "../../Context/orderContext";
import { DataContext } from "../../Context/DataContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Orders = () => {
  const [products, setProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);

  const searchItems = (value) => {
    setSearchName(value);
  };

  const { setOrderIdDetails } = useContext(OrderContext);

  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
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

  const fetchOrders = async () => {
    setLoading(true);

    try {
      // Determine storeIDs as an array
      const storeIDs = selectedStore
        ? [selectedStore.StoreID] // Wrap single StoreID in an array
        : getStoreIDs(stores); // Get array of StoreIDs

      // Debugging: Log storeIDs

      // Prevent API call if storeIDs is empty or invalid
      if (!storeIDs || storeIDs.length === 0) {
        console.warn("No StoreIDs provided. Skipping network call.");
        setLoading(false);
        return;
      }

      // Make API call if storeIDs exist
      const { orders, totalCount } = await getAllOrders(
        page,
        rowsPerPage,
        searchName,
        storeIDs, // Pass StoreIDs as an array
        value.startDate,
        value.endDate
      );

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
    storeIDs = [], // Expect an array
    startDate = "",
    endDate = ""
  ) => {
    try {
      const response = await axios.get(`${GET_ALL_ORDERS}`, {
        params: {
          pageSize: pageSize,
          page: pageNum + 1,
          searchText: search,
          StoreIDs: storeIDs, // Pass array of StoreIDs directly
          StartDate: startDate,
          EndDate: endDate,
        },
      });
      return {
        orders: response.data.data,
        totalCount: response.data.totalItems,
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [
    page,
    rowsPerPage,
    searchName,
    selectedStore,
    stores, // Ensure this is included to update when stores change
    value.startDate,
    value.endDate,
  ]);

  const handleOrderUpdate = (orderId) => {
    navigate(`/OrdersAdd/${orderId}`);
  };
  const handleCancel = (id) => {
    const newStatus = "Cancelled";
    setProducts((prevItems) =>
      prevItems.map((item) =>
        item.OrderID === id ? { ...item, OrderStatus: newStatus } : item
      )
    );
  };

  const filteredOrders = products.filter(
    (product) =>
      selectedFilter === "All" ||
      product.OrderStatus === selectedFilter ||
      product.OntimeorDelay == selectedFilter
  );

  const paginatedData = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const handleCreateOrder = () => {
    navigate("/OrdersAdd/new");
  };
  const handleExportOrder = async () => {
    setLoading(true);
    const url = GET_ORDER_REPORT; // New API endpoint

    // Define the request body (JSON format)
    const data = {
      StartDate: value.startDate,
      EndDate: value.endDate,
      StoreID: null, // Use selected store for ID
      StatusID: null, // Ensure status is not undefined
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

      // Log the content type
      const contentType = response.headers.get("Content-Type");

      // Check if the response is okay
      if (
        response.ok &&
        contentType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        // Process response as a blob for the Excel file
        const blob = await response.blob();

        // Create a link element
        const link = document.createElement("a");
        // Set the blob URL as the href
        link.href = window.URL.createObjectURL(blob);
        // Set the download attribute with a filename
        link.download = "order_report.xlsx";
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
    setLoading(false);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
    // <div className="main-container">
    <div
    className={`main-container ${isExpanded ? 'expanded' : 'collapsed'}`}
    >
      <ToastContainer />
      {loading && <LoadingAnimation />}
      <div className="body-container">
        <h2 className="heading">Orders</h2>

        <div className="search-button-group">
          <ul className="button-list">
            <li>
              <button
                type="button"
                className="action-button"
                onClick={handleCreateOrder}
              >
                <FaPlus aria-hidden="true" className="icon" />
                Create Order
              </button>
            </li>
            <li>
              <button
                type="button"
                className="action-button"
                onClick={handleExportOrder}
              >
                <FaTable aria-hidden="true" className="icon" />
                Export Order
              </button>
            </li>
          </ul>
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
            placeholder="Search by Order Number / Customer Name "
            value={searchName}
            onChange={(e) => searchItems(e.target.value)}
            className="mt-1 p-1 pr-10 border border-gray-400 rounded-md w-full sm:w-64 text-sm leading-6 h-[40px] pl-4"
          />
          <div className="search-icon-container-c-u">
            <IoIosSearch />
          </div>
        </div>

        <div className="combobox-container flex items-center">
          <Combobox value={selectedStore} onChange={setSelectedStore}>
            <div className="combobox-wrapper h-[40px]">
              {/* Input Field */}
              <Combobox.Input
                className="combobox-input w-full h-full"
                displayValue={(store) => store?.StoreName || "Select Store ID"}
                placeholder="Select Store Name"
                readOnly={storesData.length === 1}
              />

              {/* Dropdown Button */}
              {storesData.length > 1 && (
                <Combobox.Button className="combobox-button">
                  <ChevronUpDownIcon
                    className="combobox-icon"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              )}

              {/* Dropdown Options */}
              {storesData.length > 1 && (
                <Combobox.Options className="combobox-options">
                  {/* Default Option */}
                  <Combobox.Option
                    key="select-store-id"
                    className={({ active }) =>
                      active ? "combobox-option-active" : "combobox-option"
                    }
                    value={{ StoreID: null, StoreName: "Select Store ID" }}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={
                            selected
                              ? "combobox-option-text font-semibold"
                              : "combobox-option-text font-normal"
                          }
                        >
                          Select Store ID
                        </span>
                        {selected && (
                          <span
                            className={
                              active
                                ? "combobox-option-selected-icon active-selected-icon"
                                : "combobox-option-selected-icon"
                            }
                          >
                            <CheckIcon
                              className="combobox-check-icon"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>

                  {/* Store Options */}
                  {stores.map((store) => (
                    <Combobox.Option
                      key={store.StoreID}
                      className={({ active }) =>
                        active ? "combobox-option-active" : "combobox-option"
                      }
                      value={store}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={
                              selected
                                ? "combobox-option-text font-semibold"
                                : "combobox-option-text font-normal"
                            }
                          >
                            {store.StoreName}
                          </span>
                          {selected && (
                            <span
                              className={
                                active
                                  ? "combobox-option-selected-icon active-selected-icon"
                                  : "combobox-option-selected-icon"
                              }
                            >
                              <CheckIcon
                                className="combobox-check-icon"
                                aria-hidden="true"
                              />
                            </span>
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

      <div className="flex justify-center md:justify-center mb-4 px-4 md:px-0 mt-4">
        <div className="flex flex-wrap justify-center space-x-2 md:space-x-2 md:justify-center lg:justify-end">
          <FilterBar
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Order Number</StyledTableCell>
              <StyledTableCell>Order Date</StyledTableCell>
              <StyledTableCell>Customer Info</StyledTableCell>
              <StyledTableCell>Delivery Info</StyledTableCell>
              <StyledTableCell align="center">Order Status</StyledTableCell>
              <StyledTableCell align="center">Updates</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Show loading animation while fetching
              <StyledTableRow></StyledTableRow>
            ) : (
              paginatedData.map((product) => (
                <StyledTableRow key={product.OrderID}>
                  <StyledTableCell>{product.OrderNumber}</StyledTableCell>
                  <StyledTableCell>
                    {product.OrderDate
                      ? (() => {
                          const date = new Date(product.OrderDate);
                          const month = date.toLocaleString("en-US", {
                            month: "short",
                          });
                          const day = String(date.getDate()).padStart(2, "0"); // Pad single-digit day
                          const year = date.getFullYear();

                          return `${month} ${day}, ${year}`;
                        })()
                      : "N/A"}{" "}
                    {/* Adding a space here */}
                    {new Date(product.OrderDate)
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .toUpperCase()}
                    <br />
                    {/* <br /> */}
                    <div className="mt-2">
                      <span className="text-gray-400">Project:</span>{" "}
                      <strong>{product.Type ? product.Type : "N/A"}</strong>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span>
                      <span className="text-gray-400">Name:</span>{" "}
                      <strong>
                        {product.CustomerName ? product.CustomerName : "N/A"}
                      </strong>
                    </span>
                    <br />
                    {/* <br /> */}
                    <div className="mt-2">
                      <span className="text-gray-400">Phone:</span>{" "}
                      {product.Phone ? product.Phone : "N/A"}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    {product.DeliveryDate
                      ? (() => {
                          const date = new Date(product.DeliveryDate);

                          // Get month name
                          const month = date.toLocaleString("en-US", {
                            month: "short",
                          }); // Use "short" to get abbreviated month
                          let day = date.getDate(); // Get the day
                          const year = date.getFullYear(); // Get the full year (yyyy)

                          // Add leading zero for single-digit day
                          day = String(day).padStart(2, "0");

                          return `${month} ${day}, ${year}`;
                        })()
                      : "N/A"}

                    <br />

                    {/* <br /> */}

                    <div className="mt-2">
                      <span className="text-gray-400 ">Amount:</span> &#8377;
                      {product.TotalAmount ? product.TotalAmount : "N/A"}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <StatusBadge
                      status={
                        product.OrderStatus === "Revised Design"
                          ? product.SubStatusId !== 0
                            ? `${product.OrderStatus} R${product.SubStatusId}`
                            : product.OrderStatus
                          : product.OrderStatus === "Installation"
                          ? product.SubStatusId !== 0
                            ? `${product.OrderStatus} Phase ${product.SubStatusId}`
                            : product.OrderStatus
                          : product.OrderStatus
                      }
                    />

                    <br />
                    {/* <br /> */}

                    <div className="inline-flex items-center mt-2">
                      {/* Using ternary operator to determine the status display */}
                      {product.OntimeorDelay == "1" ? (
                        <>
                          <span className="inline-flex items-center bg-green-100 px-2 py-2 rounded mr-2 motion-preset-pulse-sm motion-duration-2000">
                            <span className="w-2 h-2 rounded-full bg-green-600 motion-preset-pulse-sm motion-duration-1500"></span>
                          </span>
                          <span className="text-green-600 ">
                            <strong>On time</strong>
                          </span>
                        </>
                      ) : product.OntimeorDelay == "2" ? (
                        <>
                          <span className="inline-flex items-center bg-orange-100 px-2 py-2 rounded mr-2 motion-preset-pulse-sm motion-duration-2000">
                            <span className="w-2 h-2 rounded-full bg-orange-500 motion-preset-pulse-sm motion-duration-1500"></span>
                          </span>
                          <span className="text-orange-600">
                            <strong>&nbsp;Delay&nbsp;&nbsp;</strong>
                          </span>
                        </>
                      ) : null}{" "}
                      {/* Render nothing if neither condition is met */}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <div className="flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOrderUpdate(product.OrderID)}
                        className="button edit-button flex items-center"
                      >
                        <AiOutlineEdit aria-hidden="true" className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel(product.OrderID)}
                        className=" button delete-button flex items-center"
                      >
                        <MdOutlineCancel
                          aria-hidden="true"
                          className="h-4 w-4 font-small"
                        />
                        Cancel
                      </button>
                    </div>
                  </StyledTableCell>
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
  );
};

export default Orders;
