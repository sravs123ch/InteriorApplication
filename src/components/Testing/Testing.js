// import React, { useState, useContext, useEffect, useRef } from "react";
// import { CustomerContext } from "../../Context/customerContext";
// import Box from "@mui/material/Box";
// import Stepper from "@mui/material/Stepper";
// import Step from "@mui/material/Step";
// import StepLabel from "@mui/material/StepLabel";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import { IoIosCall, IoMdMail } from "react-icons/io";
// import { useNavigate, useLocation } from "react-router-dom";
// import { ADDRESS_API } from "../../Constants/apiRoutes";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import StatusBadge from "./Statuses";
// import {
//   // COUNTRIES_API,
//   GETALLUSERS_API,
//   // STATES_API,
//   // CITIES_API,
//   GETALLCUSTOMERS_API,
//   GETALLSTORES_API,
//   ORDERBYCUSTOMERID_API,
// } from "../../Constants/apiRoutes";
// import { MdArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md";
// import { IoIosSearch, IoMdAddCircleOutline } from "react-icons/io";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { RxCross1 } from "react-icons/rx";

// import { Combobox } from "@headlessui/react";
// import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
// import axios from "axios";
// import { OrderContext } from "../../Context/orderContext";
// import { IdContext } from "../../Context/IdContext";
// import Step3 from "./payment";
// import Step2 from "./orderStatus";
// import LoadingAnimation from "../../components/Loading/LoadingAnimation";
// import {
//   StyledTableCell,
//   StyledTableRow,
//   TablePaginationActions,
// } from "../CustomTablePagination";
// import {
//   Table,
//   TableHead,
//   TableRow,
//   TableBody,
//   TableCell,
// } from "@mui/material";
// import { TableContainer, Paper } from "@mui/material";
// import { IoMdCloseCircle } from "react-icons/io";
// import TableFooter from "@mui/material/TableFooter";
// import TablePagination from "@mui/material/TablePagination";
// import { useUpdatedStatusOrderContext } from "../../Context/UpdatedOrder";
// import { useParams } from "react-router-dom";
// import { DataContext } from "../../Context/DataContext";

// const categories = [
//   { id: 1, name: "Walk-in", subOptions: ["Newspaper ad"] },
//   {
//     id: 2,
//     name: "Social Media",
//     subOptions: ["Google", "Facebook", "Instagram"],
//   },
//   {
//     id: 3,
//     name: "Reference",
//     subOptions: ["Existing Client", "Directors", "Employee"],
//   },
// ];
// const steps = ["Order Details", "Order Status", "payments"];

// function AddOrders() {
//   const { customerDetails } = useContext(CustomerContext);
//   const handleCustomerSelect = async (customer) => {
//     const updatedOrderDetails = {
//       ...orderDetails,
//       CustomerID: customer.CustomerID || customer.customerId, // Handle both cases
//       CustomerFirstName: customer.CustomerFirstName,
//       CustomerLastName: customer.CustomerLastName,
//       CustomerEmail: customer.CustomerEmail,
//       customerPhone: customer.PhoneNumber || customer.customerPhone,
//     };

//     setOrderDetails(updatedOrderDetails);
//     setSelectedCustomer(customer);
//     setIsDialogOpen(true);
//     setIsFocused(false);
//     setSearchValue("");

//     // Fetch address data
//     const addressData = await fetchAddressData(
//       customer.CustomerID || customer.customerId
//     );
//     // Log the fetched address data

//     if (addressData) {
//       const finalOrderDetails = {
//         ...updatedOrderDetails,
//         AddressID: addressData.AddressID,
//         AddressLine1: addressData.AddressLine1,
//         AddressLine2: addressData.AddressLine2,
//         City: addressData.City,
//         State: addressData.State,
//         Country: addressData.Country,
//         ZipCode: addressData.ZipCode,
//       };

//       setOrderDetails(finalOrderDetails);
//     }
//   };

//   const handleStepClick = (index) => {
//     setActiveStep(index); // Set the active step to the clicked step
//     // Add your logic to change the page or navigate here
//   };
//   const [selectedCustomer, setSelectedCustomer] = useState(""); // State to manage selected customer
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   // const [rowsPerPage, setRowsPerPage] = useState(2);
//   // const [page, setPage] = useState(0);
//   const [orders, setOrders] = useState([]);
//   const [orders1, setOrders1] = useState([]);
//   const [results, setResults] = useState([]);
//   const [isFocused, setIsFocused] = useState(false);
//   const popupRef = useRef(null);
//   const [selectedAddress, setSelectedAddress] = useState("");
//   const location = useLocation();

//   const { citiesData, statesData, countriesData } = useContext(DataContext);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   useEffect(() => {
//     if (countriesData && statesData && citiesData) {
//       setCountries(countriesData.data || []);
//       setStates(statesData.data || []);
//       setCities(citiesData.data || []);
//     }
//   }, [countriesData, statesData, citiesData]);

//   // const { orderId } = location.state || {};
//   const [order, setOrder] = useState(null);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const {
//     generatedId,
//     setGeneratedId,
//     orderDate,
//     setOrderDate,
//     designerName,
//     setDesignerName,
//     desginerID,
//     setDesginerID,
//     statusID,
//     setStatusID,
//   } = useContext(IdContext);
//   const [selectedTab, setSelectedTab] = useState("address");

//   const handleTabChange = (tab) => setSelectedTab(tab);
//   const [addressData, setAddressData] = useState([]);
//   const { updatedStatusOrderDetails } = useUpdatedStatusOrderContext();
//   const { orderId } = useParams(); // Get orderId from URL

//   const fetchAddressData = async (customerId) => {
//     setIsLoading(true);

//     try {
//       const response = await axios.get(`${ADDRESS_API}/${customerId}`);

//       if (
//         response.data &&
//         response.data.StatusCode === "SUCCESS" &&
//         response.data.Addresses
//       ) {
//         const addresses = response.data.Addresses;
//         setAddressData(addresses);
//         return addresses;
//       } else {
//         setAddressData([]);
//       }
//     } catch (error) {
//       setAddressData([]);
//     } finally {
//       setIsLoading(false);
//     }
//     return null;
//   };

//   const getCountryNameById = (id, countries) => {
//     const country = countries.find((country) => country.CountryID === id);
//     return country ? country.CountryName : "";
//   };

//   const getStateNameById = (id, states) => {
//     const state = states.find((state) => state.StateID === id);
//     return state ? state.StateName : "";
//   };

//   const getCityNameById = (id, cities) => {
//     const city = cities.find((city) => city.CityID === id);
//     return city ? city.CityName : "";
//   };

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       if (orderId === "new") {
//         setOrderDetails({});
//         return;
//       }

//       try {
//         setIsLoading(true);
//         setError(null);

//         // Determine which orderId to use for fetching data (either from URL or state)
//         const orderIdToFetch = orderDetails.OrderID || orderId;

//         // Fetch order details based on the orderId
//         const response = await axios.get(
//           `https://imly-b2y.onrender.com/api/orders/getOrderById/${orderIdToFetch}`
//         );

//         const fetchedOrderData = response.data.order;
//         setStatusID(fetchedOrderData.StatusID);
//         if (fetchedOrderData) {
//           setOrderDetails(fetchedOrderData); // Set the fetched order details
//           setOrderIdDetails({ order: fetchedOrderData }); // Optionally store orderIdDetails
//         } else {
//           setError("Order not found."); // Handle no order found case
//         }
//       } catch (err) {
//         console.error("Error fetching order details:", err);
//         setError("Failed to fetch order details.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchOrderDetails(); // Call the function to fetch order details
//   }, [orderId]); // Trigger this effect when orderId changes (e.g., on page load or refresh)

//   useEffect(() => {
//     AOS.init({ duration: 1000 });

//     if (isDialogOpen) {
//       setSelectedCountry(selectedCustomer?.CountryID || "");
//       setSelectedState(selectedCustomer?.StateID || "");
//       setSelectedCity(selectedCustomer?.CityID || "");

//       AOS.refresh();
//     }
//   }, [isDialogOpen, selectedCustomer]);

//   const fetchData = async (value) => {
//     setIsLoading(true);
//     try {
//       if (isEditMode) {
//         return;
//       }

//       // Make a single API call without pagination logic
//       const response = await axios.get(GETALLCUSTOMERS_API, {
//         params: {
//           searchText: value, // Only pass the search text
//         },
//       });

//       const customers = response.data.customers;

//       // Filter the results
//       const filteredUsers = customers.filter((customer) => {
//         return (
//           (value &&
//             customer &&
//             customer.CustomerFirstName &&
//             customer.CustomerFirstName.toLowerCase().includes(
//               value.toLowerCase()
//             )) ||
//           (customer.CustomerLastName &&
//             customer.CustomerLastName.toLowerCase().includes(
//               value.toLowerCase()
//             )) ||
//           (customer.CustomerEmail &&
//             customer.CustomerEmail.toLowerCase().includes(
//               value.toLowerCase()
//             )) ||
//           (customer.PhoneNumber &&
//             customer.PhoneNumber.toLowerCase().includes(value.toLowerCase())) ||
//           (customer.AddressLine1 &&
//             customer.AddressLine1.toLowerCase().includes(
//               value.toLowerCase()
//             )) ||
//           (customer.AddressLine2 &&
//             customer.AddressLine2.toLowerCase().includes(
//               value.toLowerCase()
//             )) ||
//           (customer.City &&
//             customer.City.toLowerCase().includes(value.toLowerCase())) ||
//           (customer.State &&
//             customer.State.toLowerCase().includes(value.toLowerCase())) ||
//           (customer.Country &&
//             customer.Country.toLowerCase().includes(value.toLowerCase())) ||
//           (customer.Zipcode &&
//             customer.Zipcode.toLowerCase().includes(value.toLowerCase()))
//         );
//       });

//       setResults(filteredUsers); // Set the filtered users to the state
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAutoFill = (selectedAddressID) => {
//     if (!selectedCustomer) {
//       console.error("No customer selected.");
//       return;
//     }

//     const selectedAddress = addressData.find(
//       (address) => address.AddressID === selectedAddressID
//     );

//     if (!selectedAddress) {
//       console.error(
//         "No matching address found for the given AddressID:",
//         selectedAddressID
//       );
//       return;
//     }
//     console.log(selectedAddress.CityID);

//     setOrderDetails((prevDetails) => ({
//       ...prevDetails,
//       CustomerID: selectedCustomer.CustomerID || prevDetails.CustomerID || 0,
//       CustomerFirstName:
//         selectedCustomer.CustomerFirstName ||
//         prevDetails.CustomerFirstName ||
//         "",
//       CustomerLastName:
//         selectedCustomer.CustomerLastName || prevDetails.CustomerLastName || "",
//       CustomerEmail: selectedCustomer.CustomerEmail || "",
//       customerPhone:
//         selectedCustomer.PhoneNumber || prevDetails.PhoneNumber || "",
//       StoreCode: selectedCustomer.StoreCode || prevDetails.StoreCode || "",
//       StoreID: selectedCustomer.StoreID || prevDetails.StoreID || "",
//       AddressID: selectedAddress.AddressID || "",
//       AddressLine1: selectedAddress.AddressLine1 || "",
//       AddressLine2: selectedAddress.AddressLine2 || "",
//       ZipCode: selectedAddress.ZipCode || "",
//       Country: selectedAddress.CountryID || "",
//       State: selectedAddress.StateID || "",
//       City: selectedAddress.CityID || "",
//     }));

//     setIsDialogOpen(false);
//   };

//   const handleAddressChange = (address) => {
//     setSelectedAddress(address);
//   };
//   const handleClose = () => {
//     setIsDialogOpen(false);
//   };

//   const handleSearchInput = (e) => {
//     const { value } = e.target;
//     setSearchValue(value);
//     fetchData(value);
//   };

//   // Assuming 'selectedCustomer' is set when a customer is selected from the search
//   useEffect(() => {
//     if (selectedCustomer?.CustomerID) {
//       fetchOrdersByCustomerId(selectedCustomer.CustomerID);
//     }
//   }, [selectedCustomer]);

//   // Fetch orders based on selected customer ID
//   const fetchOrdersByCustomerId = async (customerId) => {
//     try {
//       setIsLoading(true);
//       if (!customerId) return; // Ensure customerId exists
//       const response = await axios.get(
//         `${ORDERBYCUSTOMERID_API}/${customerId}`
//       );
//       setOrders(response.data.orders || []); // Set fetched orders
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setError("Failed to fetch orders.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         setIsFocused(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const { orderIdDetails, setOrderIdDetails, getOrderById } =
//     useContext(OrderContext);
//   const [searchValue, setSearchValue] = useState("");

//   const [activeStep, setActiveStep] = useState(0);
//   const [skipped, setSkipped] = useState(new Set());
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [query, setQuery] = useState("");
//   const [selectedSubOption, setSelectedSubOption] = useState("");
//   const [isHovered, setIsHovered] = useState(false);
//   // const[desginerID,setDesginerID]=useState("");

//   const handleMouseEnter = () => setIsHovered(true);
//   const handleMouseLeave = () => setIsHovered(false);

//   const shouldShowResults = isFocused || isHovered;

//   const filteredCategories =
//     query === ""
//       ? categories
//       : categories.filter((category) =>
//           category.name.toLowerCase().includes(query.toLowerCase())
//         );

//   const subOptions = selectedCategory
//     ? categories.find((cat) => cat.id === selectedCategory.id)?.subOptions || []
//     : [];
//   const currentDate = new Date().toISOString().split("T")[0];

//   const [orderDetails, setOrderDetails] = useState({
//     Type: "",
//     StoreCode: "",
//     TenantID: 1,
//     CustomerID: selectedCustomer.CustomerID,

//     OrderDate: "",
//     TotalQuantity: 1,
//     AddressID: selectedAddress.AddressID,

//     TotalAmount: "",
//     OrderStatus: "",
//     TotalQuantity: 1,
//     OrderBy: "",
//     DeliveryDate: "",
//     DeliveryDate: "",
//     Comments: "",
//     ReferedBy: "",
//     PaymentComments: "",
//     assginto: "",
//     AdvanceAmount: "",
//     BalanceAmount: "",
//     ExpectedDurationDays: "",
//     DesginerName: "",
//     DesginerID: "",
//     UserID: "",
//     StatusID: "",
//     AssainTo: "",
//     StoreID: selectedCustomer.StoreID || "",
//     Country: "",
//     State: "",
//     City: "",
//   });

//   useEffect(() => {
//     if (customerDetails) {
//       setOrderDetails((prevDetails) => ({
//         ...prevDetails,
//         CustomerID: customerDetails.customerId,
//         AddressID: customerDetails.addressId,
//         TenantID: 1,
//       }));
//     }
//   }, [customerDetails]);

//   const handleCategoryChange = (category) => {
//     setQuery("");
//     setSelectedCategory(category);
//     setSelectedSubOption(""); // Reset sub-option when category changes
//     setOrderDetails((prevDetails) => ({
//       ...prevDetails,
//       categories: category ? category.name : "",
//     }));
//   };
//   const [errors, setErrors] = useState({});
//   const [showAlert, setShowAlert] = useState(false);
//   const [submittedDetails, setSubmittedDetails] = useState(null);
//   const [images, setImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const isStepOptional = (step) => step === 1;
//   const isStepSkipped = (step) => skipped.has(step);
//   const [orderID, setOrderID] = useState(null); // Or an initial value
//   const [IsEditMode, setIsEditMode] = useState(false);
//   const [statusUpdatedData, setStatusUpdatedData] = useState(false);
//   const [updatedsubStatusId, setUpdatedSubStatusId] = useState("");
//   const handleNext = () => {
//     let newSkipped = skipped;
//     if (isStepSkipped(activeStep)) {
//       newSkipped = new Set(newSkipped.values());
//       newSkipped.delete(activeStep);
//     }
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     setSkipped(newSkipped);
//   };

//   const handleBack = () =>
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);

//   const handleReset = () => setActiveStep(0);
//   const addDays = (date, days) => {
//     let result = new Date(date);
//     result.setDate(result.getDate() + days);
//     return result.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
//   };
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setOrderDetails({ ...orderDetails, [name]: value });
//   };
//   const handledate = (e) => {
//     const { name, value } = e.target;

//     setOrderDetails((prevDetails) => {
//       const updatedDetails = { ...prevDetails, [name]: value };

//       // If ExpectedDurationDays is changed, validate and update DeliveryDate automatically
//       if (name === "ExpectedDurationDays") {
//         const days = parseInt(value, 10); // Parse the value as an integer

//         if (!isNaN(days) && days >= 0) {
//           // Only update DeliveryDate if the value is a valid non-negative number
//           const today = new Date();
//           const deliveryDate = addDays(today, days + 1); // Add 1 extra day for a 5-day gap
//           updatedDetails.DeliveryDate = deliveryDate;

//           // Clear any previous error
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             ExpectedDurationDays: "",
//           }));
//         } else if (value === "") {
//           // Clear DeliveryDate if ExpectedDurationDays is cleared
//           updatedDetails.DeliveryDate = "";
//         } else {
//           // Set an error message if the value is not a valid number
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             ExpectedDurationDays: "Please enter a valid number of days.",
//           }));
//         }
//       }

//       return updatedDetails;
//     });
//   };
//   const handling = (e) => {
//     const { name, value } = e.target;

//     setOrderDetails((prevDetails) => {
//       const updatedDetails = { ...prevDetails, [name]: value };

//       // If ExpectedDurationDays is changed, validate and update DeliveryDate automatically
//       if (name === "ExpectedDurationDays") {
//         const days = parseInt(value, 10); // Parse the value as an integer

//         if (!isNaN(days) && days >= 0) {
//           // Only update DeliveryDate if the value is a valid non-negative number
//           const today = new Date();
//           const deliveryDate = addDays(today, days + 1); // Add 1 extra day for a 5-day gap
//           updatedDetails.DeliveryDate = deliveryDate;

//           // Clear any previous error
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             ExpectedDurationDays: "",
//           }));
//         } else if (value === "") {
//           // Clear DeliveryDate if ExpectedDurationDays is cleared
//           updatedDetails.DeliveryDate = "";
//         } else {
//           // Set an error message if the value is not a valid number
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             ExpectedDurationDays: "Please enter a valid number of days.",
//           }));
//         }
//       }

//       return updatedDetails;
//     });
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (images.length + files.length > 6) {
//       alert("You can only upload up to 6 images.");
//       return;
//     }
//     const newImages = files.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));
//     setImages([...images, ...newImages]);
//     setImagePreviews([
//       ...imagePreviews,
//       ...newImages.map((img) => img.preview),
//     ]);
//   };

//   const handleImageRemove = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     const newPreviews = imagePreviews.filter((_, i) => i !== index);
//     setImages(newImages);
//     setImagePreviews(newPreviews);
//   };

//   const isEditMode = Boolean(
//     orderDetails.OrderID ||
//       location.state?.orderIdDetails?.order ||
//       orderIdDetails?.order
//   );
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Update order details with the new status
//     setOrderDetails((prevDetails) => ({
//       ...prevDetails,
//       OrderStatus: updatedStatusOrderDetails.OrderStatus, // Update order status here
//       TenantID: 1,
//       CustomerID: selectedCustomer?.CustomerID || "",
//       AddressID: selectedCustomer?.AddressID || "",
//       StoreID: selectedCustomer?.StoreID || "",
//       StoreCode: selectedCustomer?.StoreCode || "",
//     }));

//     // Prepare data for API submission
//     const data = {
//       ...orderDetails,
//       UploadImages: imagePreviews,
//       category: selectedCategory?.name || "",
//       subOption: selectedSubOption || "",
//       pdfFile: pdfFile ? pdfFile.name : "", // Handle PDF file
//     };

//     try {
//       setIsLoading(true);
//       const response = await axios.post(
//         "https://imly-b2y.onrender.com/api/orders/createOrderOrUpdate",
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const generatedId = response.data.OrderID;
//       toast.success(
//         orderDetails.OrderID
//           ? "Order updated successfully!"
//           : "Order created successfully!"
//       );

//       if (generatedId) {
//         // Fetch updated order details using the generated ID
//         fetch(
//           `https://imly-b2y.onrender.com/api/orders/getOrderById/${generatedId}`
//         )
//           .then((response) => response.json())
//           .then((data) => {
//             if (data?.order) {
//               setOrderDetails(data.order); // Update order details from fetched data
//               setStatusID(data.order.StatusID);
//               setOrderIdDetails({ order: data.order });
//             }
//           })
//           .catch((error) => {
//             console.error("Error fetching order:", error);
//             toast.error("Failed to fetch the order details!");
//           });
//       }

//       // Reset form fields
//       setImages([]);
//       setImagePreviews([]);
//       setSelectedSubOption("");
//       setActiveStep(0);
//       setShowAlert(true);
//     } catch (error) {
//       console.error(
//         orderDetails.OrderID
//           ? "Error updating order:"
//           : "Error creating order:",
//         error
//       );
//       toast.error(
//         orderDetails.OrderID ? "Order update failed!" : "Order creation failed!"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setOrderDetails({
//       TenantID: 1,
//       CustomerID: selectedCustomer.CustomerID,
//       OrderDate: "",
//       TotalQuantity: 1,
//       AddressID: selectedAddress.AddressID,

//       StoreID: selectedCustomer.StoreID,
//       TotalAmount: "",
//       OrderStatus: "",
//       OrderBy: "",
//       Type: "",
//       DeliveryDate: "",

//       PaymentMethod: "",
//       PaymentStatus: "",
//       MaskedCardNumber: "",
//       DeliveryDate: "",
//       Comments: "",
//       ReferedBy: "walk-in",
//       PaymentComments: "",
//       assginto: "",
//       AdvanceAmount: "",
//       BalenceAmount: "",
//       ExpectedDurationDays: "",
//       DesginerName: "",
//       DesginerID: "",
//       StatusID: "",
//       UserID: "",
//       AssainTo: "",
//     });
//     setActiveStep(0); // Optional: Reset to the first step
//   };

//   const [countryMap, setCountryMap] = useState({});
//   const [setStateMap] = useState({});
//   const [setCityMap] = useState({});
//   const [addresses, setAddresses] = useState([]);
//   const amountToBePaid = orderDetails.TotalAmount - orderDetails.AdvanceAmount;
//   const remainder = amountToBePaid / orderDetails.installments;
//   const [showSearchCard, setShowSearchCard] = useState(false);
//   const [storeOptions, setStoreOptions] = useState([]);
//   const getFirstAddress = (addresses) => {
//     // Assuming addresses is a comma-separated string or array of addresses
//     if (Array.isArray(addresses)) {
//       return addresses[0]; // Return the first address if it's an array
//     }
//     return addresses.split(",")[0]; // Return the first address from a comma-separated string
//   };
//   const handleDateChanging = (e) => {
//     const { value } = e.target;
//     setOrderDetails((prevDetails) => ({
//       ...prevDetails,
//       DeliveryDate: value, // Manually update the DeliveryDate
//     }));
//   };
//   const handleDateChang = (e) => {
//     const { value } = e.target;
//     setOrderDetails((prevDetails) => ({
//       ...prevDetails,
//       DeliveryDate: value, // Manually update the DeliveryDate
//     }));
//   };
//   const handleAddOrder = () => {
//     // Validate the form fields
//     const newErrors = {};
//     if (!orderDetails.OrderStatus)
//       newErrors.OrderStatus = "Order Status is required";
//     if (!orderDetails.assginto) newErrors.assginto = "Assign To is required";
//     if (!orderDetails.ExpectedDurationDays)
//       newErrors.ExpectedDurationDays =
//         "Expected Duration (In Days) is required";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       // Add the order to the orders array
//       setOrders([...orders, orderDetails]);

//       // Clear the form fields
//       setOrderDetails({
//         OrderStatus: "",
//         assginto: "",
//         ExpectedDurationDays: "",
//       });
//     }
//   };

//   const handleExistingUserClick = () => {
//     setShowSearchCard(!showSearchCard);
//   };

//   const handleAddOrderes = () => {
//     const newErrors = {};
//     if (!orderDetails.PaymentMethod)
//       newErrors.PaymentMethod = "PaymentMethod is required";
//     if (!orderDetails.PaymentStatus)
//       newErrors.PaymentStatus = "PaymentStatus is required";
//     if (!orderDetails.MaskedCardNumber)
//       newErrors.MaskedCardNumber = "MaskedCardNumber Type is required";
//     if (!orderDetails.PaymentComments)
//       newErrors.PaymentComments = "PaymentComments  is required";
//     if (!orderDetails.AdvanceAmount)
//       newErrors.AdvanceAmount = "Amount is required";
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length === 0) {
//       // Add the order to the orders array
//       setOrders1([...orders1, orderDetails]);

//       // Clear the form fields
//       setOrderDetails({
//         PaymentMethod: "",
//         PaymentStatus: "",
//         MaskedCardNumber: "",
//         PaymentComments: "",
//         AdvanceAmount: "",
//       });
//     }
//   };
//   const [pdfFile, setPdfFile] = useState(null);
//   const [pdfPreview, setPdfPreview] = useState("");
//   const handlePdfChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setPdfFile(file);
//       setPdfPreview(URL.createObjectURL(file));
//     }
//   };

//   const handlePdfRemove = () => {
//     setPdfFile(null);
//     setPdfPreview("");
//   };
//   const [file, setFile] = useState(null);
//   const handleFileChange = (e) => {
//     const uploadedFile = e.target.files[0];
//     if (uploadedFile && uploadedFile.type === "application/pdf") {
//       setFile(uploadedFile);
//     } else {
//       alert("Please upload a PDF file.");
//     }
//   };
//   const handleDelete = () => {
//     setFile(null);
//   };
//   const [file1, setFile1] = useState(null);
//   const handleFileChange1 = (e) => {
//     const uploadedFile = e.target.files[0];
//     if (uploadedFile && uploadedFile.type === "application/pdf") {
//       setFile1(uploadedFile);
//     } else {
//       alert("Please upload a PDF file.");
//     }
//   };
//   const handleDelete1 = () => {
//     setFile1(null);
//   };
//   const [selectedReferralType, setSelectedReferralType] = useState("");
//   const [selectedReferenceSubOption, setSelectedReferenceSubOption] =
//     useState("");
//   const [selectedSocialMediaPlatform, setSelectedSocialMediaPlatform] =
//     useState("");
//   const [error, setError] = useState("");
//   const handleReferralTypeChange = (value) => {
//     setSelectedReferralType(value);
//     setOrderDetails({ ...orderDetails, ReferedBy: value });
//   };
//   const handleReferenceSubOptionChange = (value) => {
//     setSelectedReferenceSubOption(value);
//   };
//   const handleRefereeNameChange = (event) => {
//     setOrderDetails({ ...orderDetails, refereeName: event.target.value });
//   };
//   const handleSocialMediaPlatformChange = (value) => {
//     setSelectedSocialMediaPlatform(value);
//     setOrderDetails({ ...orderDetails, socialMediaPlatform: value });
//   };

//   useEffect(() => {
//     // If `isEditMode` is true, handle order details
//     if (isEditMode) {
//       // Use optional chaining to access order details safely
//       const order = orderIdDetails?.order || {};

//       setOrderDetails((prevDetails) => ({
//         ...prevDetails,
//         OrderID: order.OrderID || "",
//         OrderNumber: order.OrderNumber || "",
//         CustomerID: order.CustomerID || "",
//         AddressID: order.AddressID || "",
//         OrderDate: order.OrderDate || "",
//         Type: order.Type || "",
//         TotalQuantity: order.TotalQuantity || "",
//         TotalAmount: order.TotalAmount || "",
//         OrderStatus: order.OrderStatus || "",
//         subStatusId: order.SubStatusId || "",
//         DeliveryDate: order.DeliveryDate || "",
//         AdvanceAmount: order.AdvanceAmount || "",
//         Comments: order.Comments || "",
//         DesginerName: order.DesginerName || "",
//         DesginerID: order.DesginerID || "",
//         StatusID: order.StatusID || "",
//         UserID: order.UserID || "",
//         AssainTo: order.AssainTo || "",
//         ReferedBy: order.ReferedBy || "",
//         assginto: order.assginto || "",
//         UploadImages: order.UploadImages || [],
//         choosefiles: order.choosefiles || [],
//         startDate: order.startDate || "",
//         CreatedBy: order.CreatedBy || "",
//         ExpectedDurationDays: order.ExpectedDurationDays || "",
//         CustomerFirstName: order.CustomerFirstName || "",
//         CustomerLastName: order.CustomerLastName || "",
//         CustomerEmail: order.CustomerEmail || "",
//         customerPhone: order.PhoneNumber || order.customerPhone || "",
//         AddressLine1: order.AddressLine1 || "",
//         AddressLine2: order.AddressLine2 || "",
//         CityName: order.CityName || "",
//         State: order.State || "",
//         Country: order.Country || "",
//         StateID: order.StateID || "",
//         CountryID: order.CountryID || "",
//         ZipCode: order.ZipCode || "",
//         CreatedAt: order.CreatedAt || "",
//         UpdatedAt: order.UpdatedAt || "",
//         StoreID: order.StoreID || "",
//         StoreName: order.StoreName || "",
//         StoreCode: order.StoreCode || "",
//       }));

//       // Set status and designer-related data using optional chaining
//       setStatusUpdatedData(order?.OrderStatus || "");
//       setUpdatedSubStatusId(order?.SubStatusId || "");
//       setDesignerName(order?.DesginerName || "");
//       setDesginerID(order?.DesginerID || "");

//       // Fetch location data based on the country, state, and city

//       // Set selected country, state, and city using optional chaining
//       if (order?.CountryID && countries.length > 0) {
//         const selectedCountry = countries.find(
//           (country) => country.CountryID === order.CountryID
//         );
//         setSelectedCountry(selectedCountry || {});
//       }

//       if (order?.StateID && states.length > 0) {
//         const selectedState = states.find(
//           (state) => state.StateID === order.StateID
//         );
//         setSelectedState(selectedState || {});
//       }

//       if (order?.CityID && cities.length > 0) {
//         const selectedCity = cities.find(
//           (city) => city.CityID === order.CityID
//         );
//         setSelectedCity(selectedCity || {});
//       }

//       // Fetch states if the country is selected but states aren't available
//       if (order?.CountryID && !states.length) {
//         fetchStatesByCountry(order.CountryID).then((fetchedStates) => {
//           const state = fetchedStates?.find((s) => s.StateID === order.StateID);
//           setSelectedState(state || {});
//         });
//       }

//       // Fetch cities if the state is selected but cities aren't available
//       if (order?.StateID && !cities.length) {
//         fetchCitiesByState(order.StateID).then((fetchedCities) => {
//           const city = fetchedCities?.find((c) => c.CityID === order.CityID);
//           setSelectedCity(city || {});
//         });
//       }
//     }

//     // Handle customer details update if available
//     if (customerDetails) {
//       setOrderDetails((prevDetails) => ({
//         ...prevDetails,
//         CustomerID: customerDetails.customerId,
//         CustomerFirstName: customerDetails.CustomerFirstName,
//         CustomerLastName: customerDetails.CustomerLastName,
//         CustomerEmail: customerDetails.CustomerEmail,
//         customerPhone: customerDetails.customerPhone,
//       }));
//     }

//     // Update statusUpdatedData if necessary
//     if (
//       updatedStatusOrderDetails?.OrderStatus !== orderDetails.OrderStatus ||
//       updatedStatusOrderDetails?.OrderStatus !==
//         orderIdDetails?.order?.OrderStatus
//     ) {
//       setStatusUpdatedData(updatedStatusOrderDetails?.OrderStatus);
//     }
//   }, [
//     isEditMode,
//     orderIdDetails,
//     customerDetails,
//     updatedStatusOrderDetails,
//     countries,
//     states,
//     cities,
//   ]);
//   const handleCountryChange = (selectedCountry) => {
//     if (!selectedCountry) return;

//     const countryID =
//       countryMap[selectedCountry.CountryName] || selectedCountry.CountryID;

//     setSelectedCountry(selectedCountry);
//     setOrderDetails({
//       ...orderDetails,
//       CountryID: countryID,
//       CountryName: selectedCountry.CountryName,
//     });
//     fetchStatesByCountry(countryID);
//   };

//   const [selectedStore, setSelectedStore] = useState("");
//   const [storeNames, setStoreNames] = useState([]);

//   useEffect(() => {
//     const fetchStores = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(GETALLSTORES_API);

//         // Extract the Stores array from the API response
//         const storesData = response.data.Stores || [];
//         // Set the store options in state
//         setStoreOptions(Array.isArray(storesData) ? storesData : []);
//       } catch (error) {
//         console.error("Error fetching stores:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchStores();
//   }, []);

//   // Address Table Pagination States
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(2); // Default rows per page for addresses
//   const totalAddresses = addressData?.length || 0; // Total number of addresses

//   // Order Table Pagination States
//   const [orderPage, setOrderPage] = useState(0);
//   const [orderRowsPerPage, setOrderRowsPerPage] = useState(2); // Default rows per page for orders
//   const totalOrders = orders?.length || 0; // Total number of orders
//   const [hasSelected, setHasSelected] = useState(false);
//   const [hasUserSelected, setHasUserSelected] = useState(false);
//   // const [orderDetails, setOrderDetails] = useState({ Type: '' });
//   const [Type] = useState();
//   // Handle address pagination change
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0); // Reset to the first page
//   };

//   // Handle order pagination change
//   const handleOrderPageChange = (event, newPage) => {
//     setOrderPage(newPage);
//   };

//   const handleOrderRowsPerPageChange = (event) => {
//     setOrderRowsPerPage(parseInt(event.target.value, 10));
//     setOrderPage(0); // Reset to the first page
//   };
//   const [searchUserValue, setSearchUserValue] = useState();
//   const [isUserFocused, setIsUserFocused] = useState();

//   // Function to fetch users from API
//   const getAllUsers = async (pageNum, pageSize, search = "") => {
//     try {
//       setIsLoading(true);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get(
//         // "https://imlystudios-backend-mqg4.onrender.com/api/users/getAllUsers",
//         GETALLUSERS_API,
//         {
//           params: {
//             page: pageNum + 1,
//             limit: pageSize,
//             SearchText: search,
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       return {
//         users: response.data.users,
//         totalCount: response.data.totalItems,
//       };
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const handleUserChange = (e) => {
//     const value = e.target.value;
//     setSearchUserValue(value);
//     setOrderDetails((prevDetails) => ({
//       ...prevDetails,
//       DesginerName: value, // Update DesginerName as user types
//     }));
//     // Call the API to get users only if the input has more than 0 characters
//     if (value.trim().length > 0) {
//       getAllUsers(0, 10, value)
//         .then((response) => {
//           setResults(response.users || []); // Use empty array as fallback
//           // If the API returns users, set the designer details based on the first result
//           if (response.users && response.users.length > 0) {
//             const firstUser = response.users[0]; // Adjust based on your user object
//             const designerName = `${firstUser.FirstName} ${firstUser.LastName}`;
//             const designerId = firstUser.UserID;

//             // Set the designer ID and name
//             setDesginerID(designerId);

//             setDesignerName(designerName);
//           } else {
//             // Clear if no users are found
//             setDesignerName("");
//             setDesginerID("");
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching users:", error);
//           setResults([]); // Clear results on error
//         });
//     } else {
//       setResults([]); // Clear results if input is empty
//       setDesignerName(""); // Clear designer name if input is empty
//       setDesginerID(""); // Clear designer ID if input is empty
//     }
//   };

//   const handleUserSelect = (selectedUser) => {
//     // Set the Order Details with the selected user info
//     setOrderDetails((prevDetails) => ({
//       ...prevDetails,
//       DesginerName: `${selectedUser.FirstName} ${selectedUser.LastName}`,
//       UserID: selectedUser.UserID, // Set UserID
//       DesginerID: selectedUser.UserID,
//       AssainTo: selectedUser.UserID, // Set AssignTo field with UserID
//     }));

//     // Set the input field with the selected user's full name
//     setSearchUserValue(`${selectedUser.FirstName} ${selectedUser.LastName}`);

//     // Set Designer ID and close dropdown
//     // setDesginerID(selectedUser.UserID);
//     setIsUserFocused(false); // Close dropdown after selection
//   };

//   const setType = (newType) => {
//     setOrderDetails((prevDetails) => ({
//       ...prevDetails,
//       Type: newType,
//     }));
//   };

//   //   const getSubstatus = (status) => {
//   //     if (status.includes('R1')) return 'Initial Revision';
//   //     if (status.includes('R2')) return 'Second Revision';
//   //     // Add more conditions as needed
//   //     return 'Ongoing Revision'; // Default substatus
//   //   };
//   // // Check if statusUpdatedData is a valid string or array before calling includes
//   // const isValidStatus = typeof statusUpdatedData === 'string' || Array.isArray(statusUpdatedData);

//   return (
//     <>
//       <div className="main-container">
//         <ToastContainer />
//         <Box sx={{ width: "100%" }}>
//           <Stepper activeStep={activeStep} className="mb-1" alternativeLabel>
//             {steps.map((label, index) => {
//               const stepProps = {};
//               // const labelProps = {};
//               const labelProps = {
//                 onClick: () => handleStepClick(index), // Add onClick handler
//                 style: { cursor: "pointer" }, // Add cursor style for pointer
//               };

//               if (isStepOptional(index)) {
//                 // Optional step logic
//               }

//               if (isStepSkipped(index)) {
//                 stepProps.completed = false;
//               }

//               // labelProps.onClick = () => handleStepClick(index); // Add onClick handler

//               return (
//                 <Step key={label} {...stepProps}>
//                   <StepLabel {...labelProps}>
//                     {label} {/* Label for the step */}
//                   </StepLabel>
//                 </Step>
//               );
//             })}
//           </Stepper>
//           <React.Fragment>
//             {activeStep === 2 && (
//               <Step3 onBack={handleBack} orderId={orderId} />
//             )}
//             {activeStep === 1 && (
//               <Step2 onBack={handleBack} onNext={handleNext} />
//             )}

//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: { xs: "1fr", sm: "1fr " }, // 1 column for small screens, 2 columns for medium screens
//                 gap: 2,
//                 pt: 2,
//                 // Prevent the box from exceeding the screen width
//               }}
//             >
//               {activeStep === 0 && (
//                 <>
//                   <div className="flex justify-left items-center ">
//                     <div className="relative flex flex-col w-full  bg-white  space-y-2 border border-gray-300   rounded-md mx-auto">
//                       <div className="flex w-full flex-col justify-end  items-center">
//                         {isEditMode && (
//                           <>
//                             <div className=" w-full flex justify-between gap-1 sm:pt-2 space-y-1 border border-gray-300 rounded-md p-1  pt-3">
//                               <div className="flex w-1/3 text-sm sm:text-xs font-medium text-gray-800">
//                                 <span className="w-1/3 mt-3">
//                                   Order Number:
//                                 </span>
//                                 <span className="w-1/3  mt-3">
//                                   {orderDetails.OrderNumber}
//                                 </span>
//                               </div>

//                               <div className="flex w-1/3 text-sm sm:text-xs font-medium text-gray-700">
//                                 <span className="w-1/3 mt-2">
//                                   Order Status:
//                                 </span>

//                                 <span className="w-1/3">
//                                   <StatusBadge status={statusUpdatedData} />
//                                 </span>
//                                 {orderDetails.StatusID === 4 &&
//                                   orderDetails.subStatusId !== 0 && (
//                                     <div className="w-1/3 ml-2">
//                                       <div className="w-6 h-6 bg-green-500 text-white mt-1 flex items-center justify-center rounded-sm">
//                                         {`R${updatedsubStatusId}`}
//                                       </div>
//                                     </div>
//                                   )}
//                               </div>
//                               {/* <div className="flex w-1/3 text-sm sm:text-xs font-medium text-gray-700">
//   <span className="w-1/3 mt-2">Order Status:</span>

//   <span className="w-1/3">
//     <StatusBadge status={statusUpdatedData} />
//   </span> */}

//                               {/* Conditionally show substatus when StatusID is 4 or OrderStatus contains "Revised Design" */}
//                               {/* {(statusUpdatedData.StatusID === 4 || 
//     statusUpdatedData.OrderStatus?.includes("Revised Design")) && (
//     <span className="w-1/3 mt-2 ml-2">
     
//       <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-400 text-white">
//         Substatus: {statusUpdatedData.OrderStatus} 
//       </span>
//     </span>
//   )} */}
//                               {/* <div className="flex w-1/3 text-sm sm:text-xs font-medium text-gray-700">
//                                   <span className="w-1/3 mt-2">Order Status:</span>

//                                   <span className="w-1/3">
//                                     <div className="w-6 h-6 bg-green-500 text-white flex items-center justify-center rounded-sm">
//                                     <StatusBadge status={statusUpdatedData} />
//                                     </div>
//                                   </span>

                                  
//                                 </div> */}

//                               <div className="flex w-1/3 text-sm sm:text-xs font-medium text-gray-800">
//                                 <span className="w-1/3  mt-2">Store Name:</span>
//                                 <span className="w-1/3  mt-2">
//                                   {orderDetails.StoreName}
//                                 </span>
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                       {/* Render search input only if isEditMode is false */}
//                       {!isEditMode && (
//                         <>
//                           <div className="w-full flex justify-between sm:pt-1 space-y-1 p-1 relative">
//                             <input
//                               id="searchName"
//                               type="text"
//                               placeholder="Search by Name..."
//                               value={searchValue}
//                               onChange={handleSearchInput}
//                               onFocus={() => setIsFocused(true)}
//                               className="mt-0 h-8 pr-10 w-4/5 border border-gray-300 rounded-md text-sm md:text-base pl-2"
//                             />
//                             <div className="absolute right-[54%] top-3 flex items-center pr-3 pointer-events-none">
//                               <IoIosSearch aria-label="Search Icon" />
//                             </div>

//                             {/* Only show the dropdown when searchValue is not empty and input is focused */}
//                             <div
//                               className={`absolute flex-1 top-full mt-1 border-solid border-2 rounded-lg p-2 w-full bg-white z-10 ${
//                                 searchValue && isFocused ? "block" : "hidden"
//                               }`}
//                               style={{
//                                 maxHeight: "200px",
//                                 minHeight: "100px",
//                                 overflowY: "auto",
//                               }}
//                               onMouseEnter={handleMouseEnter}
//                               onMouseLeave={handleMouseLeave}
//                             >
//                               {results.length > 0 ? (
//                                 <>
//                                   <div className="mb-2 text-sm text-gray-600">
//                                     {results.length} Result
//                                     {results.length > 1 ? "s" : ""}
//                                   </div>

//                                   {/* Map over filtered results */}
//                                   {[
//                                     ...new Map(
//                                       results.map((result) => [
//                                         result.CustomerID,
//                                         result,
//                                       ])
//                                     ).values(),
//                                   ].map((result) => (
//                                     <div
//                                       className="relative cursor-pointer flex flex-col p-2 hover:bg-gray-100 group"
//                                       key={result.CustomerID}
//                                       onClick={() =>
//                                         handleCustomerSelect(result)
//                                       }
//                                     >
//                                       <span className="font-medium">
//                                         {result.CustomerFirstName}{" "}
//                                         {result.CustomerLastName}
//                                       </span>
//                                       <div className="flex items-center text-xs md:text-sm text-gray-500">
//                                         <IoIosCall
//                                           className="w-4 h-4 mr-1"
//                                           aria-label="Phone Icon"
//                                         />
//                                         <span>{result.PhoneNumber}</span>
//                                       </div>
//                                       <div className="flex items-center text-xs md:text-sm text-gray-500">
//                                         <IoMdMail
//                                           className="w-4 h-4 mr-1"
//                                           aria-label="Email Icon"
//                                         />
//                                         <span>
//                                           {result.CustomerEmail}
//                                           {result.AddressID}
//                                         </span>
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </>
//                               ) : (
//                                 <div className="p-2 overflow-clip text-gray-500">
//                                   No results found.
//                                 </div>
//                               )}
//                             </div>

//                             <div className="flex z-10 flex-wrap items-center justify-center w-full gap-2">
//                               {" "}
//                               {/* Reduced gap */}
//                               {/* Store Combobox */}
//                               <div className="-mt-2 p-0 w-full max-w-[84%] ml-16">
//                                 {" "}
//                                 {/* Reduced margin top, width adjusted to 90%, left margin added */}
//                                 <Combobox
//                                   value={selectedStore}
//                                   onChange={setSelectedStore}
//                                 >
//                                   <div className="relative w-full">
//                                     <Combobox.Input
//                                       className="w-full mt-1 mb-0.5 rounded-md border-0 bg-white py-1 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                                       displayValue={(store) =>
//                                         store?.StoreName || "Select Store ID"
//                                       }
//                                       placeholder="Select Store Name"
//                                     />
//                                     <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
//                                       <ChevronUpDownIcon
//                                         className="h-5 w-5 text-gray-400"
//                                         aria-hidden="true"
//                                       />
//                                     </Combobox.Button>
//                                     <Combobox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//                                       {/* Add "Select Store ID" option */}
//                                       <Combobox.Option
//                                         key="select-store-id"
//                                         value={{
//                                           StoreID: null,
//                                           StoreName: "Select Store ID",
//                                         }}
//                                         className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
//                                       >
//                                         Select Store ID
//                                       </Combobox.Option>
//                                       {/* Render all store options */}
//                                       {storeOptions.map((store) => (
//                                         <Combobox.Option
//                                           key={store.StoreID}
//                                           value={store}
//                                           className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
//                                         >
//                                           <span className="block truncate group-data-[selected]:font-semibold">
//                                             {store.StoreName}
//                                           </span>
//                                           {selectedStore?.StoreID ===
//                                             store.StoreID && (
//                                             <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
//                                               <CheckIcon
//                                                 className="h-5 w-5"
//                                                 aria-hidden="true"
//                                               />
//                                             </span>
//                                           )}
//                                         </Combobox.Option>
//                                       ))}
//                                     </Combobox.Options>
//                                   </div>
//                                 </Combobox>
//                               </div>
//                             </div>
//                           </div>
//                         </>
//                       )}
//                     </div>

//                     {isDialogOpen && selectedCustomer && (
//                       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
//                         <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 relative">
//                           {/* Dialog Header */}
//                           <div
//                             className="absolute top-0 left-0 right-0 bg-gray-600 p-4 rounded-t-2xl border-b border-gray-400 flex items-center justify-between z-10"
//                             data-aos="fade-up"
//                           >
//                             <h2 className="text-3xl font-bold text-white">
//                               Customer Details
//                             </h2>
//                             <button
//                               className="flex items-center justify-center text-white"
//                               onClick={handleClose}
//                             ></button>
//                           </div>

//                           <div className="flex flex-col items-left justify-left pt-20 space-y-2 ml-0">
//                             <div
//                               className="flex w-full max-w-md items-center justify-start gap-x-2"
//                               data-aos="fade-right"
//                             >
//                               <strong className="text-gray-700 text-lg leading-tight">
//                                 Name:
//                               </strong>
//                               <p className="text-gray-700 text-lg leading-tight">
//                                 {selectedCustomer.CustomerFirstName}{" "}
//                                 {selectedCustomer.CustomerLastName}
//                               </p>
//                             </div>
//                             <div
//                               className="flex w-full max-w-md items-center justify-start gap-x-2"
//                               data-aos="fade-right"
//                             >
//                               <strong className="text-gray-700 text-lg leading-tight">
//                                 Phone:
//                               </strong>
//                               <p className="text-gray-700 text-lg leading-tight">
//                                 {selectedCustomer.PhoneNumber}
//                               </p>
//                             </div>
//                             <div
//                               className="flex w-full max-w-md items-center justify-start gap-x-2"
//                               data-aos="fade-right"
//                             >
//                               <strong className="text-gray-700 text-lg leading-tight">
//                                 Email:
//                               </strong>
//                               <p className="text-gray-700 text-lg leading-tight">
//                                 {selectedCustomer.CustomerEmail}
//                               </p>
//                             </div>
//                           </div>

//                           {/* Tabs for Address and Orders */}
//                           <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mt-6">
//                             <ul className="flex flex-wrap -mb-px">
//                               <li className="me-2">
//                                 <button
//                                   className={`inline-block p-4 ${
//                                     selectedTab === "address"
//                                       ? "text-blue-600 border-b-2 border-blue-600"
//                                       : "hover:text-gray-600 hover:border-gray-300"
//                                   } rounded-t-lg`}
//                                   onClick={() => handleTabChange("address")}
//                                 >
//                                   Address
//                                 </button>
//                               </li>
//                               <li className="me-2">
//                                 <button
//                                   className={`inline-block p-4 ${
//                                     selectedTab === "order"
//                                       ? "text-blue-600 border-b-2 border-blue-600"
//                                       : "hover:text-gray-600 hover:border-gray-300"
//                                   } rounded-t-lg`}
//                                   onClick={() => handleTabChange("order")}
//                                 >
//                                   Order
//                                 </button>
//                               </li>
//                             </ul>
//                           </div>

//                           {/* Content based on selected tab */}
//                           <div className="pt-4">
//                             {selectedTab === "address" && (
//                               <div>
//                                 {/* <strong className="text-gray-800 text-lg">No Address</strong> */}
//                                 <div className="mt-2 space-y-2">
//                                   <TableContainer
//                                     component={Paper}
//                                     sx={{
//                                       width: "100%",
//                                       margin: "0 auto",
//                                       mt: 2,
//                                       maxHeight: 220, // Approximate height for 3 rows
//                                       overflowY: "auto",
//                                     }}
//                                   >
//                                     <Table stickyHeader>
//                                       <TableHead>
//                                         <TableRow>
//                                           <StyledTableCell
//                                             sx={{
//                                               whiteSpace: "nowrap",
//                                               padding: "12px 24px",
//                                               textAlign: "center",
//                                             }}
//                                           >
//                                             Address Line 1
//                                           </StyledTableCell>
//                                           <StyledTableCell
//                                             sx={{
//                                               whiteSpace: "nowrap",
//                                               padding: "12px 24px",
//                                               textAlign: "center",
//                                             }}
//                                           >
//                                             Address Line 2
//                                           </StyledTableCell>
//                                           <StyledTableCell
//                                             sx={{
//                                               whiteSpace: "nowrap",
//                                               padding: "12px 24px",
//                                               textAlign: "center",
//                                             }}
//                                           >
//                                             City Name
//                                           </StyledTableCell>
//                                           <StyledTableCell
//                                             sx={{
//                                               whiteSpace: "nowrap",
//                                               padding: "12px 24px",
//                                               textAlign: "center",
//                                             }}
//                                           >
//                                             State Name
//                                           </StyledTableCell>
//                                           <StyledTableCell
//                                             sx={{
//                                               whiteSpace: "nowrap",
//                                               padding: "12px 24px",
//                                               textAlign: "center",
//                                             }}
//                                           >
//                                             Zip Code
//                                           </StyledTableCell>
//                                           <StyledTableCell
//                                             sx={{
//                                               whiteSpace: "nowrap",
//                                               padding: "12px 24px",
//                                               textAlign: "center",
//                                             }}
//                                           >
//                                             Actions
//                                           </StyledTableCell>
//                                         </TableRow>
//                                       </TableHead>
//                                       <TableBody>
//                                         {addressData.length > 0 ? (
//                                           addressData
//                                             .slice(
//                                               page * rowsPerPage,
//                                               page * rowsPerPage + rowsPerPage
//                                             )
//                                             .map((address, index) => {
//                                               // Find the city and state names
//                                               const city = cities.find(
//                                                 (c) =>
//                                                   c.CityID === address.CityID
//                                               );
//                                               const state = states.find(
//                                                 (s) =>
//                                                   s.StateID === address.StateID
//                                               );

//                                               return (
//                                                 <TableRow
//                                                   key={address.AddressID}
//                                                 >
//                                                   <StyledTableCell>
//                                                     {address.AddressLine1 || ""}
//                                                   </StyledTableCell>
//                                                   <StyledTableCell>
//                                                     {address.AddressLine2 || ""}
//                                                   </StyledTableCell>
//                                                   <StyledTableCell>
//                                                     {city
//                                                       ? city.CityName
//                                                       : "N/A"}
//                                                   </StyledTableCell>
//                                                   <StyledTableCell>
//                                                     {state
//                                                       ? state.StateName
//                                                       : "N/A"}
//                                                   </StyledTableCell>
//                                                   <StyledTableCell>
//                                                     {address.ZipCode || ""}
//                                                   </StyledTableCell>
//                                                   <StyledTableCell>
//                                                     <div className="button-container">
//                                                       <button
//                                                         type="button"
//                                                         onClick={() => {
//                                                           handleAutoFill(
//                                                             address.AddressID
//                                                           );
//                                                           handleClose();
//                                                         }}
//                                                         className="button select-button"
//                                                       >
//                                                         Select
//                                                       </button>
//                                                     </div>
//                                                   </StyledTableCell>
//                                                 </TableRow>
//                                               );
//                                             })
//                                         ) : (
//                                           <TableRow>
//                                             <StyledTableCell
//                                               colSpan={6}
//                                               align="center"
//                                             >
//                                               No address data available
//                                             </StyledTableCell>
//                                           </TableRow>
//                                         )}
//                                       </TableBody>

//                                       <TableFooter>
//                                         <TableRow>
//                                           <TablePagination
//                                             rowsPerPageOptions={[2, 4, 6]}
//                                             colSpan={6}
//                                             count={totalAddresses}
//                                             rowsPerPage={rowsPerPage}
//                                             page={page}
//                                             onPageChange={handleChangePage}
//                                             onRowsPerPageChange={
//                                               handleChangeRowsPerPage
//                                             }
//                                             ActionsComponent={
//                                               TablePaginationActions
//                                             }
//                                           />
//                                         </TableRow>
//                                       </TableFooter>
//                                     </Table>
//                                   </TableContainer>
//                                 </div>
//                               </div>
//                             )}

//                             {selectedTab === "order" && (
//                               <div>
//                                 {/* <strong className="text-gray-800 text-lg">Orders:</strong> */}
//                                 <div className="mt-2">
//                                   <TableContainer
//                                     component={Paper}
//                                     sx={{
//                                       width: "100%",
//                                       margin: "0 auto",
//                                       mt: 2,
//                                     }}
//                                   >
//                                     <Table>
//                                       <TableHead>
//                                         <TableRow>
//                                           <StyledTableCell
//                                             sx={{ whiteSpace: "nowrap" }}
//                                           >
//                                             Order Number
//                                           </StyledTableCell>
//                                           <StyledTableCell
//                                             sx={{ whiteSpace: "nowrap" }}
//                                           >
//                                             Order Date
//                                           </StyledTableCell>
//                                           <StyledTableCell
//                                             sx={{ whiteSpace: "nowrap" }}
//                                           >
//                                             Amount
//                                           </StyledTableCell>
//                                           <StyledTableCell
//                                             sx={{
//                                               whiteSpace: "nowrap",
//                                               padding: "12px 24px",
//                                               textAlign: "center",
//                                             }}
//                                           >
//                                             Order Status
//                                           </StyledTableCell>
//                                           <StyledTableCell
//                                             sx={{ whiteSpace: "nowrap" }}
//                                           >
//                                             Store Name
//                                           </StyledTableCell>
//                                         </TableRow>
//                                       </TableHead>
//                                       <TableBody>
//                                         {orders &&
//                                           orders
//                                             .slice(
//                                               orderPage * orderRowsPerPage,
//                                               orderPage * orderRowsPerPage +
//                                                 orderRowsPerPage
//                                             )
//                                             .map((order) => (
//                                               <StyledTableRow
//                                                 key={order.OrderID}
//                                               >
//                                                 <StyledTableCell>
//                                                   {order.OrderNumber}
//                                                 </StyledTableCell>
//                                                 <StyledTableCell>
//                                                   {new Date(
//                                                     order.CreatedAt
//                                                   ).toLocaleDateString()}
//                                                 </StyledTableCell>{" "}
//                                                 {/* Adjusted to use CreatedAt */}
//                                                 <StyledTableCell>
//                                                   ${order.TotalAmount}
//                                                 </StyledTableCell>
//                                                 <StyledTableCell
//                                                   sx={{
//                                                     whiteSpace: "nowrap",
//                                                     padding: "12px 24px",
//                                                     textAlign: "center",
//                                                   }}
//                                                 >
//                                                   {order.OrderStatus}
//                                                 </StyledTableCell>
//                                                 <StyledTableCell>
//                                                   {order.Customer?.Store
//                                                     ?.StoreName || "N/A"}
//                                                 </StyledTableCell>{" "}
//                                                 {/* Access StoreName from Customer */}
//                                               </StyledTableRow>
//                                             ))}
//                                       </TableBody>
//                                       <TableFooter>
//                                         <TableRow>
//                                           <TablePagination
//                                             rowsPerPageOptions={[2, 4, 6]}
//                                             colSpan={6}
//                                             count={totalOrders}
//                                             rowsPerPage={orderRowsPerPage}
//                                             page={orderPage}
//                                             onPageChange={handleOrderPageChange}
//                                             onRowsPerPageChange={
//                                               handleOrderRowsPerPageChange
//                                             }
//                                             ActionsComponent={
//                                               TablePaginationActions
//                                             }
//                                           />
//                                         </TableRow>
//                                       </TableFooter>
//                                     </Table>
//                                   </TableContainer>
//                                 </div>
//                               </div>
//                             )}
//                           </div>

//                           {/* Next Button */}
//                           <div className="flex justify-end mt-6">
//                             <button
//                               className="py-3 px-8 bg-gray-600 text-white rounded-lg hover:bg-gray-600 transition-all shadow-lg transform hover:scale-105"
//                               // onClick={handleAutoFill}
//                               onClick={() => {
//                                 handleAutoFill(); // Call your autofill logic
//                                 handleClose(); // Close the dialog
//                               }}
//                             >
//                               Close
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex gap-10 border border-gray-300 rounded-md">
//                     <div className=" flex-1 pt-2 sm:pt-3 mt-2 w-full space-y-2  p-4">
//                       <div className="mt-0 p-0 w-full max-w-full ml-0">
//                         <label className="block text-xs font-medium text-gray-700 mb-1">
//                           Project Type
//                         </label>
//                         <Combobox value={orderDetails.Type} onChange={setType}>
//                           <div className="relative w-full">
//                             <Combobox.Input
//                               className="w-full mt-1 mb-0.5 rounded-md border-0 bg-white py-1 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                               displayValue={(type) =>
//                                 type || "Select Project Type"
//                               }
//                               placeholder="Select Project Type"
//                             />
//                             <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
//                               <ChevronUpDownIcon
//                                 className="h-5 w-5 text-gray-400"
//                                 aria-hidden="true"
//                               />
//                             </Combobox.Button>
//                             <Combobox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//                               {[
//                                 "Kitchen",
//                                 "Wardrobe",
//                                 "Living",
//                                 "2 BHK",
//                                 "3 BHK",
//                                 "TV unit",
//                                 "Crockery",
//                                 "Shoe rack",
//                                 "Vanities",
//                                 "Others",
//                               ].map((type) => (
//                                 <Combobox.Option
//                                   key={type}
//                                   value={type}
//                                   className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
//                                 >
//                                   <span className="block truncate group-data-[selected]:font-semibold">
//                                     {type}
//                                   </span>
//                                   {Type === type && (
//                                     <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
//                                       <CheckIcon
//                                         className="h-5 w-5"
//                                         aria-hidden="true"
//                                       />
//                                     </span>
//                                   )}
//                                 </Combobox.Option>
//                               ))}
//                             </Combobox.Options>
//                           </div>
//                         </Combobox>

//                         {/* Error Handling */}
//                         {errors.Type && (
//                           <p className="text-red-500 text-sm mt-1">
//                             {errors.Type}
//                           </p>
//                         )}
//                       </div>

//                       <div>
//                         <label className="block text-xs font-medium text-gray-700">
//                           Expected Duration (In Days)
//                         </label>
//                         <input
//                           type="number"
//                           name="ExpectedDurationDays"
//                           value={orderDetails.ExpectedDurationDays}
//                           onChange={handling}
//                           className={` p-1  mt-2 mb-1 w-full border rounded-md ${
//                             errors.ExpectedDurationDays
//                               ? "border-red-500"
//                               : "border-gray-300"
//                           }`}
//                         />
//                         {errors.Comments && (
//                           <p className="text-red-500 text-sm mt-1">
//                             {errors.ExpectedDurationDays}
//                           </p>
//                         )}
//                       </div>
//                       {isEditMode && (
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700">
//                             Order Date
//                           </label>
//                           <input
//                             type="date"
//                             name="OrderDate"
//                             value={
//                               orderDetails.OrderDate
//                                 ? new Date(orderDetails.OrderDate)
//                                     .toISOString()
//                                     .split("T")[0]
//                                 : ""
//                             }
//                             onChange={handleChange}
//                             className={`p-1 mt-2 mb-1 w-full border rounded-md ${
//                               errors.OrderDate
//                                 ? "border-red-500"
//                                 : "border-gray-300"
//                             }`}
//                           />
//                           {errors.OrderDate && (
//                             <p className="text-red-500 text-sm mt-1">
//                               {errors.OrderDate}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700">
//                           Expected Delivery Date
//                         </label>
//                         <input
//                           type="date"
//                           name="DeliveryDate"
//                           // value={orderDetails.DeliveryDate}
//                           value={
//                             orderDetails.DeliveryDate
//                               ? new Date(orderDetails.DeliveryDate)
//                                   .toISOString()
//                                   .split("T")[0]
//                               : ""
//                           }
//                           onChange={handleDateChang}
//                           className={` p-1  mt-2 mb-1 w-full border rounded-md ${
//                             errors.DeliveryDate
//                               ? "border-red-500"
//                               : "border-gray-300"
//                           }`}
//                         />
//                         {errors.DeliveryDate && (
//                           <p className="text-red-500 text-sm mt-1">
//                             {errors.DeliveryDate}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <label className="block mt-1 text-xs font-medium text-gray-700">
//                           Designer Name
//                         </label>

//                         <div className="relative">
//                           <input
//                             type="text"
//                             name="DesginerName"
//                             // value={searchUserValue}
//                             value={orderDetails.DesginerName || searchUserValue}
//                             onChange={handleUserChange}
//                             onFocus={() => setIsUserFocused(true)}
//                             // onBlur={() => setIsFocused(false)} // Uncomment if you want the dropdown to close on blur
//                             className={`p-1 mt-2 mb-1 w-full border rounded-md ${
//                               errors.DesginerName
//                                 ? "border-red-500"
//                                 : "border-gray-300"
//                             }`}
//                             placeholder="Search by User Name..."
//                           />
//                           {errors.DesginerName && (
//                             <p className="text-red-500 text-sm mt-1">
//                               {errors.DesginerName}
//                             </p>
//                           )}

//                           {/* Search Icon */}
//                           <div className="absolute right-3 top-5 flex items-center pointer-events-none">
//                             <IoIosSearch aria-label="Search Icon" />
//                           </div>

//                           {/* Dropdown for filtered users */}
//                           {isUserFocused &&
//                             searchUserValue &&
//                             searchUserValue.length >= 1 && (
//                               <div
//                                 className={`absolute flex flex-col top-full mt-1 border rounded-lg p-2 w-full bg-white z-10`}
//                                 style={{
//                                   maxHeight: "200px",
//                                   overflowY: "auto",
//                                 }}
//                               >
//                                 {results.length > 0 ? (
//                                   <>
//                                     <div className="mb-2 text-sm text-gray-600">
//                                       {results.length} Result
//                                       {results.length > 1 ? "s" : ""}
//                                     </div>

//                                     {/* Map over filtered results and show only user names */}
//                                     {results.map((result) => (
//                                       <div
//                                         className="relative cursor-pointer p-2 hover:bg-gray-100 group"
//                                         key={result.CustomerID}
//                                         onClick={() => handleUserSelect(result)} // Ensure this function is defined
//                                       >
//                                         <span className="font-medium">
//                                           {result.FirstName} {result.LastName}{" "}
//                                           {/* Display only user names */}
//                                         </span>
//                                       </div>
//                                     ))}
//                                   </>
//                                 ) : (
//                                   !hasUserSelected && ( // Only show if no selection has been made
//                                     <div className="p-2 overflow-clip text-gray-500">
//                                       No results found.
//                                     </div>
//                                   )
//                                 )}
//                               </div>
//                             )}
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700">
//                           Comments
//                         </label>
//                         <input
//                           type="text"
//                           name="Comments"
//                           value={orderDetails.Comments}
//                           onChange={handleChange}
//                           className={` p-1  mt-0 mb-5 w-full border rounded-md ${
//                             errors.Comments
//                               ? "border-red-500"
//                               : "border-gray-300"
//                           }`}
//                         />
//                         {errors.Comments && (
//                           <p className="text-red-500 text-sm mt-1">
//                             {errors.Comments}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="relative flex-1  pt-7  sm:pt-5   w-full space-y-2  p-4">
//                       <div className="-mt-2">
//                         <label className="block text-xs font-medium text-gray-700 mt-1">
//                           Total amount
//                         </label>
//                         <input
//                           type="number"
//                           name="TotalAmount"
//                           value={orderDetails.TotalAmount}
//                           onChange={handleChange}
//                           className={` p-1  mt-3 w-full border rounded-md ${
//                             errors.TotalAmount
//                               ? "border-red-500"
//                               : "border-gray-300"
//                           }`}
//                         />
//                         {errors.TotalAmount && (
//                           <p className="text-red-500 text-sm mt-1">
//                             {errors.TotalAmount}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mt-1">
//                           Advance amount
//                         </label>

//                         <input
//                           type="number"
//                           name="AdvanceAmount"
//                           value={orderDetails.AdvanceAmount}
//                           onChange={handleChange}
//                           className={` p-1  mt-3  w-full border rounded-md ${
//                             errors.AdvanceAmount
//                               ? "border-red-500"
//                               : "border-gray-300"
//                           }`}
//                         />
//                         {errors.AdvanceAmount && (
//                           <p className="text-red-500 text-sm mt-1">
//                             {errors.AdvanceAmount}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mt-1">
//                           Balance amount
//                         </label>
//                         <input
//                           type="number"
//                           name="AdvanceAmount"
//                           value={
//                             (orderDetails.BalenceAmount =
//                               orderDetails.TotalAmount -
//                               orderDetails.AdvanceAmount)
//                           }
//                           onChange={handleChange}
//                           className={`p-1  mt-3 mb-1 w-full border rounded-md`}
//                         />
//                       </div>
//                       <div className="mb-3 z-10 ">
//                         <label className="block mt-3 text-xs font-medium text-gray-700">
//                           Referred By
//                         </label>
//                         <Combobox
//                           as="div"
//                           value={orderDetails.ReferedBy}
//                           onChange={handleReferralTypeChange}
//                         >
//                           <div className="relative">
//                             <Combobox.Input
//                               className="w-full mt-2 mb-1 rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                               onChange={(event) => setQuery(event.target.value)}
//                               displayValue={(type) => type || ""}
//                             />
//                             <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
//                               <ChevronUpDownIcon
//                                 className="h-5 w-5  text-gray-400"
//                                 aria-hidden="true"
//                               />
//                             </Combobox.Button>

//                             <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//                               {["Social Media", "Walk-In", "Reference"].map(
//                                 (type, index) => (
//                                   <Combobox.Option
//                                     key={index}
//                                     value={type}
//                                     className="group z-30 relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
//                                   >
//                                     <span className="block truncate group-data-[selected]:font-semibold">
//                                       {type}
//                                     </span>
//                                     <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
//                                       <CheckIcon
//                                         className="h-5 w-5"
//                                         aria-hidden="true"
//                                       />
//                                     </span>
//                                   </Combobox.Option>
//                                 )
//                               )}
//                             </Combobox.Options>
//                           </div>
//                         </Combobox>
//                         {/* Conditionally render the additional input fields */}
//                         {selectedReferralType === "Reference" && (
//                           <div className="mt-4">
//                             <label className="block text-xs font-medium text-gray-700">
//                               Reference Sub-option
//                             </label>
//                             <Combobox
//                               as="div"
//                               value={selectedReferenceSubOption}
//                               onChange={handleReferenceSubOptionChange}
//                             >
//                               <div className="relative">
//                                 <Combobox.Input
//                                   className="w-full mt-2 mb-1 rounded-md border-0 bg-white py-1 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                                   onChange={(event) =>
//                                     setQuery(event.target.value)
//                                   }
//                                   displayValue={(option) => option || ""}
//                                 />
//                                 <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
//                                   <ChevronUpDownIcon
//                                     className="h-5 w-5 text-gray-400"
//                                     aria-hidden="true"
//                                   />
//                                 </Combobox.Button>

//                                 <Combobox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//                                   {["Director", "Employee", "Existing"].map(
//                                     (option, index) => (
//                                       <Combobox.Option
//                                         key={index}
//                                         value={option}
//                                         className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
//                                       >
//                                         <span className="block truncate group-data-[selected]:font-semibold">
//                                           {option}
//                                         </span>
//                                         <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
//                                           <CheckIcon
//                                             className="h-5 w-5"
//                                             aria-hidden="true"
//                                           />
//                                         </span>
//                                       </Combobox.Option>
//                                     )
//                                   )}
//                                 </Combobox.Options>
//                               </div>
//                             </Combobox>
//                           </div>
//                         )}
//                         {selectedReferralType === "Reference" &&
//                           selectedReferenceSubOption && (
//                             <div className="mt-4">
//                               <label className="block text-xs font-medium text-gray-700">
//                                 Referee Name
//                               </label>
//                               <input
//                                 type="text"
//                                 name="refereeName"
//                                 value={orderDetails.refereeName}
//                                 onChange={handleRefereeNameChange}
//                                 className="w-full mt-2 mb-1 rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                               />
//                             </div>
//                           )}
//                         {selectedReferralType === "Social Media" && (
//                           <div className="mt-4">
//                             <label className="block text-xs font-medium text-gray-700">
//                               Social Media Platform
//                             </label>
//                             <Combobox
//                               as="div"
//                               value={selectedSocialMediaPlatform}
//                               onChange={handleSocialMediaPlatformChange}
//                             >
//                               <div className="relative">
//                                 <Combobox.Input
//                                   className="w-full mt-2 mb-1 rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                                   onChange={(event) =>
//                                     setQuery(event.target.value)
//                                   }
//                                   displayValue={(platform) => platform || ""}
//                                 />
//                                 <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
//                                   <ChevronUpDownIcon
//                                     className="h-5 w-5 text-gray-400"
//                                     aria-hidden="true"
//                                   />
//                                 </Combobox.Button>

//                                 <Combobox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//                                   {["Facebook", "Instagram", "Twitter"].map(
//                                     (platform, index) => (
//                                       <Combobox.Option
//                                         key={index}
//                                         value={platform}
//                                         className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
//                                       >
//                                         <span className="block truncate group-data-[selected]:font-semibold">
//                                           {platform}
//                                         </span>
//                                         <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
//                                           <CheckIcon
//                                             className="h-5 w-5"
//                                             aria-hidden="true"
//                                           />
//                                         </span>
//                                       </Combobox.Option>
//                                     )
//                                   )}
//                                 </Combobox.Options>
//                               </div>
//                             </Combobox>
//                           </div>
//                         )}
//                         {error && (
//                           <p className="mt-0 text-red-600 text-xs">{error}</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-4 pt-1 sm:pt-2 w-full bg-white color-white space-y-1 border border-gray-300 rounded-md p-2">
//                     <div className="flex justify-left text-lg font-medium text-gray-700">
//                       <h2>Customer Information</h2>
//                     </div>

//                     <div className="flex gap-10">
//                       <div className="sm:pt-2 w-full space-y-2 p-4">
//                         <div className="flex text-sm sm:text-xs font-medium text-gray-700">
//                           <span className="w-1/2">First Name</span>
//                           <span className="mr-20">:</span>
//                           <span className="w-2/3">
//                             {orderDetails.CustomerFirstName}
//                           </span>
//                         </div>
//                         <div className="flex text-sm sm:text-xs font-medium text-gray-800">
//                           <span className="w-1/2">Last Name</span>
//                           <span className="mr-20">:</span>
//                           <span className="w-2/3">
//                             {orderDetails.CustomerLastName}
//                           </span>
//                         </div>
//                         <div className="flex text-sm sm:text-xs font-medium text-gray-800">
//                           <span className="w-1/2">Email</span>
//                           <span className="mr-20">:</span>
//                           <span className="w-2/3">
//                             {orderDetails.CustomerEmail}
//                           </span>
//                         </div>
//                         <div className="flex text-sm sm:text-xs font-medium text-gray-800">
//                           <span className="w-1/2">Phone</span>
//                           <span className="mr-20">:</span>
//                           <span className="w-2/3">
//                             {orderDetails.customerPhone}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="sm:pt-2 w-full space-y-2 p-4">
//                         <div className="flex text-sm sm:text-xs font-medium text-gray-700">
//                           <span className="w-1/2">Address Line 1</span>
//                           <span className="mr-20">:</span>
//                           <span className="w-1/2">
//                             {orderDetails.AddressLine1}
//                           </span>
//                         </div>
//                         <div className="flex text-sm sm:text-xs font-medium text-gray-700">
//                           <span className="w-1/2">Address Line 2</span>
//                           <span className="mr-20">:</span>
//                           <span className="w-1/2">
//                             {orderDetails.AddressLine2}
//                           </span>
//                         </div>
//                         <div className="flex text-sm sm:text-xs font-medium text-gray-700">
//                           <span className="w-1/2">Country</span>
//                           <span className="mr-20">:</span>
//                           <span className="w-1/2">
//                             {getCountryNameById(
//                               orderDetails.Country,
//                               countries
//                             )}
//                           </span>
//                         </div>

//                         <div className="flex text-sm sm:text-xs font-medium text-gray-700">
//                           <span className="w-1/2">State</span>
//                           <span className="mr-20">:</span>
//                           <span className="w-1/2">
//                             {getStateNameById(orderDetails.State, states)}
//                           </span>
//                         </div>

//                         <div className="flex text-sm sm:text-xs font-medium text-gray-700">
//                           <span className="w-1/2">City</span>
//                           <span className="mr-20">:</span>
//                           <span className="w-1/2">
//                             {getCityNameById(orderDetails.City, cities)}
//                           </span>
//                         </div>
//                         <div className="flex text-sm sm:text-xs font-medium text-gray-700">
//                           <span className="w-1/2">Zip Code</span>
//                           <span className="mr-20">:</span>
//                           <span className="w-1/2">{orderDetails.ZipCode}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </Box>

//             <div className="mt-6 flex right-0 justify-end gap-4">
//               {activeStep === 0 && (
//                 <>
//                   <button
//                     type="submit"
//                     className="inline-flex justify-center rounded-md border border-transparent bg-custom-darkblue py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-custom-lightblue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                     onClick={handleSubmit}
//                   >
//                     {orderDetails.OrderID ? "Update" : "Add"}{" "}
//                     {/* Conditional button text */}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleCancel}
//                     className="inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-red-200"
//                   >
//                     Cancel
//                   </button>
//                 </>
//               )}
//               {isLoading && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
//                   <LoadingAnimation />
//                 </div>
//               )}
//             </div>
//           </React.Fragment>

//           {submittedDetails && (
//             <div className="mt-4 bg-gray-100 p-4  rounded shadow-lg">
//               <h3 className="text-xl font-bold mb-4">
//                 Submitted Order Details:
//               </h3>
//               <p>
//                 <strong>Tenant ID:</strong> {submittedDetails.TenantID}
//               </p>
//               <p>
//                 <strong>Customer ID:</strong> {submittedDetails.CustomerID}
//               </p>
//               <p>
//                 <strong>Order Date:</strong> {submittedDetails.OrderDate}
//               </p>
//               <p>
//                 <strong>Total Quantity:</strong>{" "}
//                 {submittedDetails.TotalQuantity}
//               </p>
//               <p>
//                 <strong>Address Line 1:</strong> {submittedDetails.AddressLine1}
//               </p>
//               <p>
//                 <strong>Address Line 2:</strong> {submittedDetails.AddressLine2}
//               </p>
//               <p>
//                 <strong>City ID:</strong> {submittedDetails.CityID}
//               </p>
//               <p>
//                 <strong>State ID:</strong> {submittedDetails.StateID}
//               </p>
//               <p>
//                 <strong>Country ID:</strong> {submittedDetails.CountryID}
//               </p>
//               <p>
//                 <strong>Zip Code:</strong> {submittedDetails.ZipCode}
//               </p>
//               <p>
//                 <strong>Total Amount:</strong> {submittedDetails.TotalAmount}
//               </p>
//               <p>
//                 <strong>Order Status:</strong> {submittedDetails.OrderStatus}
//               </p>
//               <p>
//                 <strong>Order By:</strong> {submittedDetails.OrderBy}
//               </p>
//               <p>
//                 <strong>Type:</strong> {submittedDetails.Type}
//               </p>
//               <p>
//                 <strong>Delivery Date:</strong> {submittedDetails.DeliveryDate}
//               </p>
//               <p>
//                 <strong>Customer First Name:</strong>{" "}
//                 {submittedDetails.customerFirstName}
//               </p>
//               <p>
//                 <strong>Customer Last Name:</strong>{" "}
//                 {submittedDetails.customerLastName}
//               </p>
//               <p>
//                 <strong>Customer Email:</strong>{" "}
//                 {submittedDetails.customerEmail}
//               </p>
//               <p>
//                 <strong>Customer Phone:</strong>{" "}
//                 {submittedDetails.customerPhone}
//               </p>
//               <p>
//                 <strong>Payment Method:</strong>{" "}
//                 {submittedDetails.PaymentMethod}
//               </p>
//               <p>
//                 <strong>Payment Status:</strong>{" "}
//                 {submittedDetails.PaymentStatus}
//               </p>
//               <p>
//                 <strong>Masked Card Number:</strong>{" "}
//                 {submittedDetails.MaskedCardNumber}
//               </p>
//               <p>
//                 <strong>Expected Complete Date:</strong>{" "}
//                 {submittedDetails.DeliveryDate}
//               </p>
//               <p>
//                 <strong>Comments:</strong> {submittedDetails.Comments}
//               </p>
//               <p>
//                 <strong>Referred By:</strong> {submittedDetails.ReferedBy}
//               </p>
//               <p>
//                 <strong>Payment Comments:</strong>
//                 {submittedDetails.PaymentComments}
//               </p>
//               <p>
//                 <strong>Assigned To:</strong> {submittedDetails.assginto}
//               </p>
//               <p>
//                 <strong>Advance Amount:</strong>
//                 {submittedDetails.AdvanceAmount}
//               </p>
//               <p>
//                 <strong>Balance Amount:</strong>
//                 {submittedDetails.BalenceAmount}
//               </p>
//               <p>
//                 <strong>Expected Duration Days:</strong>
//                 {submittedDetails.ExpectedDurationDays}
//               </p>
//               <p>
//                 <strong>Designer Name:</strong> {submittedDetails.DesginerName}
//               </p>
//               <p>
//                 <strong>Upload Images:</strong> {submittedDetails.UploadImages}
//               </p>
//               <p>
//                 <strong>Choose Files:</strong> {submittedDetails.choosefiles}
//               </p>
//               <p>
//                 <strong>Balance Amount (calculated):</strong>
//                 {submittedDetails.TotalAmount - submittedDetails.AdvanceAmount}
//               </p>

//               <div className="grid grid-cols-3 gap-4 mt-4">
//                 {submittedDetails.images &&
//                   submittedDetails.images.map((img, index) => (
//                     <img
//                       key={index}
//                       src={img}
//                       alt={`Final ${index}`}
//                       className="w-full h-36 object-cover border rounded-md"
//                     />
//                   ))}
//               </div>
//               <div className="grid grid-cols-3 gap-4 mt-4">
//                 {submittedDetails.pdfPreview &&
//                   submittedDetails.pdfPreview.map((img, index) => (
//                     <img
//                       key={index}
//                       src={img}
//                       alt={`PDF Preview ${index}`}
//                       className="w-full h-36 object-cover border rounded-md"
//                     />
//                   ))}
//               </div>
//             </div>
//           )}
//         </Box>
//       </div>
//     </>
//   );
// }

// export default AddOrders;
