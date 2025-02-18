
import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
} from "@mui/material";
import { GrInProgress } from "react-icons/gr";
import { AiOutlineHistory } from "react-icons/ai";
// import OrderHistory from "./OrderHistory"; // Static import
import { FaUpload, FaEdit, FaTrashAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineEye } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
// import StatusBadge from "./Statuses"; // Make sure you have this component
// import Step2 from "./payment";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineAppstore, AiOutlineUnorderedList } from "react-icons/ai";
import {
  CreateEnquirydepartment,
  UpdateEnquirydepartment,
  GETALLUSERS_API,
  ORDERBYCUSTOMERID_API,
  HolidaysList,
  GetbyidEnquirydepartment,
  GetAllEnquirydepartment,
  GetEnquirydepartmentbyCustomer,
} from "../../Constants/apiRoutes";
import LoadingAnimation from "../Loading/LoadingAnimation";
import { IdContext } from "../../Context/IdContext";
import { GETORDERBYID_API } from "../../Constants/apiRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import Typography from "@mui/material/Typography";
import { OrderContext } from "../../Context/orderContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";

import { useUpdatedStatusOrderContext } from "../../Context/UpdatedOrder";
// import { useFormData } from "../../Context/statusFormContext";

const YourComponent = ({ onBack, onNext, orderId }) => {
  const location = useLocation();

  const { customerId } = useParams();

  const [desginerID, setDesginerID] = useState(null); // Initialize as null or default value
  const [designerName, setDesignerName] = useState(""); // Initialize with empty string

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [images, setImages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [totalRecords, setTotalRecords] = useState("");
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Error state
  const [pdfPreviews, setPdfPreviews] = useState([]);
  const [docPreviews, setDocPreviews] = useState([]);
  const [orderStatusList, setOrderStatusList] = useState([]);
  const [results, setResults] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filteredRolesList, setFilteredRolesList] = useState([]);
  const [searchUserValue, setSearchUserValue] = useState(designerName || "");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAdvancePopup, setShowAdvancePopup] = useState(false);

  const { updatedStatusOrderDetails, setUpdatedStatusOrderDetails } =
    useUpdatedStatusOrderContext();
  const [formOrderDetails, setFormOrderDetails] = useState({
    ExpectedDays: "",
    DeliveryDate: "",
    Comments: "",
    AssignTo: desginerID,
    // RoleID: roleID,
    UploadDocument: "",
    StartDate: new Date().toISOString().split("T")[0], // Set StartDate to today's date in YYYY-MM-DD format
  });

  // console.log(formOrderDetails,"FOD")
  const validateOrderData = () => {
    const newErrors = {};

    if (!desginerID) {
      newErrors.AssignToError = "Assigned to is required.";
    }

    if (!formOrderDetails.DeliveryDate) {
      newErrors.DeliveryDateError = "Delivery Date is required.";
    }

    // Set the errors in state
    setErrors(newErrors);

    // Return true if there are any errors, otherwise return false
    return Object.keys(newErrors).length > 0;
  };

  const saveOrderHistory = async () => {
    const { DeliveryDate, Comments, EnquiryDepaermentID, UserID } =
      formOrderDetails; // Extract required details

    // Validate the form data
    const hasErrors = validateOrderData();
    if (hasErrors) {
      return; // Stop if validation fails
    }

    // Prepare the data to be sent as JSON
    const orderData = {
      UserID: desginerID || UserID,
      EndDate: DeliveryDate,
      Comments: Comments || "", // Default empty if null
      CustomerID: customerId,
    };

    // Define the API URL and method based on edit mode
    let apiUrl = CreateEnquirydepartment; // Default to the create API
    let method = "POST"; // Default to POST for creating a new record

    if (editMode && EnquiryDepaermentID) {
      // If in edit mode and EnquiryDepaermentID exists, set for update
      apiUrl = `${UpdateEnquirydepartment}/${EnquiryDepaermentID}`;
      method = "PUT";
      orderData.EnquiryDepaermentID = EnquiryDepaermentID; // Include the ID for updating

      if (!customerId) {
        toast.error("CustomerID is required for update.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      orderData.CustomerID = customerId; // Include CustomerID for update
    } else if (editMode && !EnquiryDepaermentID) {
      toast.error("EnquiryDepartmentID is missing for update.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    // Start loading spinner
    setIsLoading(true);
    try {
      // Make the API call (use the base URL without customerId in the path)
      const response = await fetch(apiUrl, {
        // Use only the base URL
        method,
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(orderData), // Send the data as JSON
      });

      const data = await response.json(); // Parse JSON response

      // Handle error in the response
      if (data.StatusCode === "FAILURE" || data.error) {
        console.error("API error:", data); // Log the response for debugging
        toast.error(
          data.error || "Error occurred while processing the request.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        return;
      }

      // Success message
      toast.success(data.message || "Order history saved successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Close the modal after success and reset form
      closeModalAndMoveToNextStep();
      setFormOrderDetails({ ...formOrderDetails, Comments: "" }); // Reset form
      fetchDepartmentDetails();
      setFormOrderDetails({
        ExpectedDays: "",
        DeliveryDate: "",
        Comments: "",
        AssignTo: "",
        UploadDocument: "",
        StartDate: new Date().toISOString().split("T")[0], // Reset StartDate to today's date
        UserID: "",
      });
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error); // Log the error for debugging
      toast.error(error.message || "An unexpected error occurred.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      // Stop loading spinner
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Log the updated order details or perform any side effects here
  }, [updatedStatusOrderDetails]);
  const closeModalAndMoveToNextStep = () => {
    setTimeout(() => {
      setShowModal(false);
      // onNext();
    }, 3000); // Delay of 4 seconds
  };

  // Close the modal after a delay (for error cases)
  const closeModalAfterDelay = () => {
    setTimeout(() => {
      setShowModal(false); // Close the modal after a delay
    }, 3000); // Delay of 4 seconds
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormOrderDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handledate = (e) => {
    const { name, value } = e.target;
    setFormOrderDetails((prevDetails) => {
      const updatedDetails = { ...prevDetails, [name]: value };
      if (name === "ExpectedDurationDays") {
        const days = parseInt(value, 10);
        if (!isNaN(days) && days >= 0) {
          const today = new Date();
          updatedDetails.DeliveryDate = addDays(today, days);
        } else {
          updatedDetails.DeliveryDate = ""; // Reset if invalid
        }
      }
      return updatedDetails;
    });
  };

  // Utility function to calculate the delivery date based on StartDate and ExpectedDays
  const calculateExpectedDeliveryDate = (startDate, daysToAdd) => {
    if (!startDate || isNaN(new Date(startDate))) {
      return ""; // Return an empty string if the startDate is invalid
    }
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysToAdd); // Add the number of days
    return formatDate(date); // Return in YYYY-MM-DD format
  };

  const handleFileChange = (event) => {
    const files = event.target.files; // Get the FileList object from the input
    const selectedFiles = Array.from(files); // Convert the FileList to an array

    const UploadDocuments = {}; // Object to store document names
    const previews = []; // Array to store image previews
    const pdfPreviews = []; // Array to store PDF previews
    const docPreviews = []; // Array to store other document previews
    const binaryFiles = []; // Array to store binary files for all file types

    // Create an array of promises for reading each file asynchronously
    const fileReadPromises = selectedFiles.map((file, index) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Handle file load event
        reader.onload = () => {
          const binaryData = reader.result; // Get binary data

          // Create a preview URL for images or PDFs
          if (file.type.startsWith("image/")) {
            const previewUrl = URL.createObjectURL(file);
            previews.push(previewUrl); // Add image preview URL
          }

          if (file.type === "application/pdf") {
            const pdfPreviewUrl = URL.createObjectURL(file);
            pdfPreviews.push(pdfPreviewUrl); // Add PDF preview URL
          }

          // Handle other document types
          if (
            file.type === "application/msword" || // .doc
            file.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // .docx
            file.type === "text/plain" || // .txt
            file.type === "application/vnd.ms-excel" || // .xls
            file.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
          ) {
            const docPreviewUrl = URL.createObjectURL(file);
            docPreviews.push({
              name: file.name,
              url: docPreviewUrl,
              type: file.type, // Store the file type for proper handling
            });
          }

          // Store document names as key-value pairs
          UploadDocuments[`Document_${index + 1}`] = file.name;

          // Add binary data to the array
          binaryFiles.push({
            name: file.name,
            type: file.type,
            data: binaryData, // Binary data for backend upload
          });

          resolve(); // Resolve the promise after the file is read
        };

        // Handle errors
        reader.onerror = () => {
          reject(new Error(`Error reading file: ${file.name}`));
        };

        // Read the file as ArrayBuffer
        reader.readAsArrayBuffer(file);
      });
    });

    // Wait for all file reads to complete before updating the state
    Promise.all(fileReadPromises)
      .then(() => {
        setImagePreviews(previews); // Set image previews in state
        setPdfPreviews(pdfPreviews); // Set PDF previews in state
        setDocPreviews(docPreviews); // Set document previews in state
        setImages(binaryFiles); // Store all binary files (any type)
        setFormOrderDetails((prev) => ({
          ...prev,
          UploadDocument: UploadDocuments, // Store document names
        }));
      })
      .catch((error) => {
        console.error("Error processing files:", error);
      });
  };

  useEffect(() => {
    return () => {
      // Ensure imagePreviews is an array before calling forEach
      if (Array.isArray(imagePreviews)) {
        imagePreviews.forEach((url) => URL.revokeObjectURL(url)); // Release object URLs created
      }
      // Ensure pdfPreviews is an array before calling forEach
      if (Array.isArray(pdfPreviews)) {
        pdfPreviews.forEach((url) => URL.revokeObjectURL(url)); // Release PDF preview URLs
      }
      // Ensure docPreviews is an array before calling forEach
      if (Array.isArray(docPreviews)) {
        docPreviews.forEach((doc) => URL.revokeObjectURL(doc.url)); // Release document URLs
      }
    };
  }, [imagePreviews, pdfPreviews, docPreviews]);
  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handlePdfRemove = (index) => {
    const newPdfPreviews = pdfPreviews.filter((_, i) => i !== index);
    setPdfPreviews(newPdfPreviews); // Update PDF previews
  };

  const [file, setFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const handleDelete = () => {
    setFile(null);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const addDays = (date, days) => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
  };
  const handleCancel = () => {
    // Example: Reset form or navigate to a different page
    // If you want to navigate away from the form, for example:
    navigate("/Orders"); // This assumes you're using `react-router-dom` for navigation
  };
  const [selectedStatus, setSelectedStatus] = useState(
    formOrderDetails.StatusID || ""
  );

  const [query, setQuery] = useState("");

  const filteredStatusList =
    query === ""
      ? orderStatusList
      : orderStatusList.filter((status) =>
          status.OrderStatus.toLowerCase().includes(query.toLowerCase())
        );
  // Helper function to calculate the duration between two dates
  const calculateDurationDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Difference in days
    return duration;
  };
  const [statusDetails, setStatusDetails] = useState([]);
  const [subStatusId, setSubStatusId] = useState("");

  const fetchDepartmentDetails = async () => {
    try {
      if (customerId === "new") return;

      setIsLoading(true);
      const response = await fetch(
        `${GetEnquirydepartmentbyCustomer}/${customerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();

      // Ensure response format consistency
      const enquiry = result?.enquiry || {};

      setStatusDetails(enquiry);

      // If there's a status array, handle sub-status ID logic
      const statuses = Array.isArray(result) ? result : [result];
      const getSubStatusId = (statusDetails, status) => {
        const foundItem = statusDetails.find(
          (item) => item.StatusID === status.StatusID
        );
        return foundItem ? foundItem.SubStatusId ?? "" : "";
      };

      if (statuses.length > 0) {
        const firstRecordStatus = statuses[0]?.OrderStatus;
        const newSubStatusId = getSubStatusId(statuses, statuses[0]);
        setSubStatusId(newSubStatusId);
      }
    } catch (err) {
      setError(err.message);
      console.error("Fetch Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentDetails();
  }, [customerId]);
  const statusArray = Array.isArray(statusDetails)
    ? statusDetails
    : [statusDetails];

  const handleCancel2 = () => {
    setSelectedStatus("");
    setImagePreviews([]);
    setImages([]);
    setPdfPreviews([]);
    setDocPreviews([]);
    setEditMode(false);
    setFormOrderDetails({
      ...formOrderDetails, // Preserve other fields
      DeliveryDate: "", // Clear Delivery Date
      Comments: "",
      ExpectedDays: "", // Clear Comments
      UserID: "",
    });
  };

  useEffect(() => {}, [formOrderDetails]);

  const selectedStatusText =
    orderStatusList.find((status) => status.StatusID === selectedStatus)
      ?.OrderStatus || "";

  useEffect(() => {}, [selectedStatus]);
  const [visibleSteps, setVisibleSteps] = useState(5); // Initially show 5 steps
  const [completedSteps, setCompletedSteps] = useState({});
  // const [activeStep, setActiveStep] = useState(null);

  const handleCompleteStep = (statusID) => {
    const newCompletedSteps = { ...completedSteps };
    // Mark the selected StatusID and all previous steps as completed
    filteredStatusList.forEach((status) => {
      if (status.StatusID <= statusID) {
        newCompletedSteps[status.StatusID] = true;
      }
    });
    setCompletedSteps(newCompletedSteps);
    setActiveStep(statusID); // Set the current StatusID as active
  };

  const handleStepClick = (statusID) => {
    handleCompleteStep(statusID); // Complete the step and all before it
    const currentIndex = filteredStatusList.findIndex(
      (status) => status.StatusID === statusID
    );

    // Show more steps if the current step is within visible range
    if (currentIndex < visibleSteps) {
      setVisibleSteps((prevSteps) =>
        Math.min(prevSteps + 1, filteredStatusList.length)
      );
    }
  };

  const handleScroll = (e) => {
    const bottom =
      Math.ceil(e.target.scrollHeight - e.target.scrollTop) <=
      e.target.clientHeight;
    if (bottom && visibleSteps < filteredStatusList.length) {
      setVisibleSteps((prevSteps) =>
        Math.min(prevSteps + 5, filteredStatusList.length)
      );
    }
  };

  const handleReset = () => {
    setActiveStep(null); // Reset the active step
    setCompletedSteps({}); // Clear all completed steps
    setVisibleSteps(5); // Reset visible steps to initial value
  };

  // const [searchUserValue, setSearchUserValue]=useState();
  const [isUserFocused, setIsUserFocused] = useState();
  const [hasUserSelected, setHasUserSelected] = useState(false);
  // const[desginerID,setDesginerID]=useState();

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

  const handleUserChange = (e) => {
    const value = e.target.value;
    setSearchUserValue(value);

    // Call the API to get users only if the input has more than 0 characters
    if (value.trim().length > 0) {
      getAllUsers(0, 10, value)
        .then((response) => {
          setResults(response.users || []); // Use empty array as fallback
          // If the API returns users, set the designer details based on the first result
          if (response.users && response.users.length > 0) {
            const firstUser = response.users[0]; // Adjust based on your user object
            const designerName = `${firstUser.FirstName} ${firstUser.LastName}`;
            const designerId = firstUser.UserID;

            // Set the designer ID and name
            setDesginerID(designerId);
            setDesignerName(designerName);
          } else {
            // Clear if no users are found
            setDesignerName("");
            setDesginerID("");
          }
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setResults([]); // Clear results on error
        });
    } else {
      setResults([]); // Clear results if input is empty
      setDesignerName(""); // Clear designer name if input is empty
      setDesginerID(""); // Clear designer ID if input is empty
    }
  };

  const handleUserSelect = (selectedUser) => {
    // Set the Order Details with the selected user info
    setFormOrderDetails((prevDetails) => ({
      ...prevDetails,
      DesginerName: `${selectedUser.FirstName} ${selectedUser.LastName}`, // Set Designer Name
      UserID: selectedUser.UserID, // Set UserID
      DesignerID: selectedUser.UserID,
      AssainTo: selectedUser.UserID, // Set AssignTo field with UserID
    }));

    // Set the input field with the selected user's full name
    setSearchUserValue(`${selectedUser.FirstName} ${selectedUser.LastName}`);

    // Set Designer ID and close dropdown
    setDesginerID(selectedUser.UserID); // Correctly set Designer ID on selection
    setIsUserFocused(false); // Close dropdown after selection
  };

  const [isGridView, setIsGridView] = useState(false); // State to toggle views

  const handleToggleView = () => {
    setIsGridView((prev) => !prev); // Toggle the view
  };
  const [statusData, setStatusData] = useState(false);

  // Toggle the mode based on certain conditions
  useEffect(() => {
    if (statusData) {
      setStatusData(true);
    }
  }, [statusData]);

  const handleViewDocuments = (event) => {
    event.preventDefault();
    // Logic to handle viewing documents
    if (imagePreviews.length > 0) {
      // Open the first image preview
      window.open(imagePreviews[0], "_blank");
    } else if (pdfPreviews.length > 0) {
      // Open the first PDF preview
      window.open(pdfPreviews[0], "_blank");
    } else if (docPreviews.length > 0) {
      // Open the first document preview (e.g., .doc, .xls, .txt)
      window.open(docPreviews[0].url, "_blank");
    }
  };
  const handleCancelDocuments = () => {
    // Clear both image and PDF previews
    setImagePreviews([]); // Clear image previews
    setPdfPreviews([]);
    setDocPreviews([]);

    // You can also reset the file input if needed
    document.getElementById("UploadFiles").value = "";
  };

  const handleEditstatus = (EnquiryDepaermentID, CustomerID, UserID) => {
    let statusData = null;

    // Check if statusDetails is an array or an object
    if (Array.isArray(statusDetails)) {
      statusData = statusDetails.find(
        (status) =>
          status.EnquiryDepaermentID === EnquiryDepaermentID &&
          status.CustomerID === CustomerID
      );
    } else if (typeof statusDetails === "object" && statusDetails !== null) {
      if (
        statusDetails.EnquiryDepaermentID === EnquiryDepaermentID &&
        statusDetails.CustomerID === CustomerID
      ) {
        statusData = statusDetails;
      }
    }

    if (statusData) {
      setFormOrderDetails({
        EnquiryDepaermentID: statusData.EnquiryDepaermentID || "",
        ExpectedDays: statusData.ExpectedDays || "",
        DeliveryDate: statusData.EndDate || "",
        Comments: statusData.Comments || "",
        AssignTo: searchUserValue || "", // Set UserName instead of ID
        // RoleID: statusData.RoleID || roleID, // Fallback to default
        UserID: statusData.UserID || "",
        UploadDocument: statusData.UploadDocument || "",
        StartDate: statusData.StartDate
          ? statusData.StartDate.split("T")[0]
          : new Date().toISOString().split("T")[0], // Default to today's date
      });
      setSearchUserValue(statusData.UserName);

      setEditMode(true);
    } else {
      console.error(
        "No valid data found for the provided EnquiryDepaermentID:",
        EnquiryDepaermentID
      );
    }
  };

  const [holidays, setHolidays] = useState([]);
  const fetchHolidays = async () => {
    try {
      const response = await axios.get(HolidaysList);

      const holidayDates = response.data.holidays.map(
        (holiday) => new Date(holiday.Date).toISOString().split("T")[0]
      );

      if (holidayDates) {
        setHolidays(holidayDates);
      } else {
        console.error("No holidays found in response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  // Call this when the component mounts
  useEffect(() => {
    fetchHolidays();
  }, []);
  const calculateDeliveryDate = (startDate, daysToAdd) => {
    const holidaySet = new Set(holidays); // Ensure holidays are correctly set

    let date = new Date(startDate);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      date.setDate(date.getDate() + 1); // Move to the next day
      const isoDate = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
      const isSunday = date.getDay() === 0; // Check for Sunday
      const isHoliday = holidaySet.has(isoDate); // Check for holiday

      if (!isSunday && !isHoliday) {
        addedDays++; // Increment only if it's not Sunday or a holiday
      }
    }

    return date.toISOString().split("T")[0]; // Return final date
  };

  const handleExpectedDaysChange = (e) => {
    const days = parseInt(e.target.value, 10) || 0;
    const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

    const calculatedDate = calculateDeliveryDate(today, days);

    setFormOrderDetails({
      ...formOrderDetails,
      ExpectedDays: days,
      DeliveryDate: calculatedDate,
    });
  };

  // Handle manual DeliveryDate changes
  const handleDateChanging = (e) => {
    setFormOrderDetails({
      ...formOrderDetails,
      DeliveryDate: e.target.value,
    });
  };
  // const handleViewAll = () => {
  //   navigate(`/OrderHistory/${OrderID}`); // Navigate to the YearView component
  // };
  // Helper to format date
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: " 1fr" }, // Ensure proper grid layout
        gap: 2, // Adjust spacing between items
        justifyContent: "center",
        alignItems: "center",
        pt: 2,
      }}
    >
      {isLoading && <LoadingAnimation />}

      <div>
        <div className="flex">
          <div className="flex flex-col items-center flex-1 sm:ml-0 lg:ml-5 gap-6">
            <div className="flex flex-col  justify-center items-center  w-full">
              <div className="flex-col sm:flex-row  flex justify-center items-center gap-4 w-full">
                <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
                  Assigned To: <span className="text-red-500">*</span>
                </label>
                <div className=" w-full sm:w-1/4">
                  <div className="relative">
                    <input
                      type="text"
                      name="AssignedTo"
                      value={searchUserValue}
                      onChange={handleUserChange}
                      onFocus={() => setIsUserFocused(true)}
                      className={` p-1 pr-10 w-full border rounded-md ${
                        errors.AssignToError && !desginerID
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Search by User Name..."
                    />

                    {/* Search Icon */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                      <IoIosSearch aria-label="Search Icon" />
                    </div>

                    {/* Dropdown for filtered users */}
                    {isUserFocused &&
                      searchUserValue &&
                      searchUserValue.length >= 1 &&
                      results.length > 0 && (
                        <div
                          className="absolute flex flex-col top-full mt-1 border rounded-lg p-2 w-full bg-white z-10"
                          style={{
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                        >
                          <div className="mb-2 text-sm text-gray-600">
                            {results.length} Result
                            {results.length > 1 ? "s" : ""}
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

                    {/* Display No Results Message */}
                    {isUserFocused &&
                      searchUserValue &&
                      results.length === 0 && (
                        <div className="p-2 overflow-clip text-gray-500">
                          No results found.
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-1/2 flex justify-start sm:justify-center sm:ml-[170px] ">
                {errors.AssignToError && !desginerID && (
                  <p className="text-red-500 text-sm ">
                    {errors.AssignToError}
                  </p>
                )}
              </div>
            </div>

            {!editMode && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
                  Expected Delivery in Days:
                </label>
                <input
                  type="number"
                  name="ExpectedDays"
                  value={formOrderDetails.ExpectedDays}
                  onChange={handleExpectedDaysChange}
                  className={`p-1 w-full sm:w-1/4 border rounded-md ${
                    errors.ExpectedDays ? "border-red-500" : "border-gray-300"
                  }`}
                  min="0" // Ensure the user can't select a negative number of days
                />
              </div>
            )}

            <div className="flex flex-col  justify-center items-center  w-full">
              <div className="flex-col sm:flex-row  flex justify-center items-center gap-4 w-full">
                <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
                  Delivery Date: <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="DeliveryDate"
                  value={formatDate(formOrderDetails.DeliveryDate)}
                  onChange={handleDateChanging} // Manually change if needed
                  className={`p-1 w-full sm:w-1/4 border rounded-md ${
                    errors.DeliveryDateError && !formOrderDetails.DeliveryDate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              <div className="w-full sm:w-1/2 flex justify-start sm:justify-center sm:ml-[178px] ">
                {errors.DeliveryDateError && !formOrderDetails.DeliveryDate && (
                  <p className="text-red-500 text-sm ">
                    {errors.DeliveryDateError}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
              <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
                Upload Document:
              </label>

              {/* Main container for Upload and View/Cancel fields */}
              <div className="flex items-center sm:w-1/4 w-full border rounded-md bg-white p-2 gap-2">
                {/* Upload Button */}
                <div className="flex flex-1 items-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="UploadFiles"
                  />
                  <label
                    htmlFor="UploadFiles"
                    className="flex items-center justify-center text-black-500 cursor-pointer bg-gray-200 rounded-md px-3 py-1"
                  >
                    <FaUpload className="mr-2" />
                    <span>Upload</span>
                  </label>
                </div>

                {/* View and Cancel Buttons */}
                <div className="flex flex-1 items-center gap-2">
                  {(imagePreviews.length > 0 ||
                    pdfPreviews.length > 0 ||
                    docPreviews.length > 0) && (
                    <>
                      {/* View Button */}
                      <button
                        onClick={handleViewDocuments} // This function will handle the view action
                        className="flex items-center justify-center bg-blue-500 text-white rounded-md px-3 py-1"
                      >
                        <FaEye className="mr-2" />
                        View
                      </button>

                      {/* Cancel Button */}
                      <button
                        onClick={handleCancelDocuments} // This function will handle the cancel action (removal of files)
                        className="flex items-center justify-center bg-red-500 text-white rounded-md px-1 py-0.2"
                      >
                        *
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
              <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
                Comments:
              </label>
              <textarea
                name="Comments"
                value={formOrderDetails.Comments}
                onChange={(e) =>
                  setFormOrderDetails({
                    ...formOrderDetails,
                    Comments: e.target.value,
                  })
                }
                className={`p-2 w-full sm:w-1/4 border rounded-md ${
                  errors.Comments ? "border-red-500" : "border-gray-300"
                }`}
                rows={3} // Set the number of visible rows
              />
              {errors.Comments && (
                <p className="text-red-500 text-sm ml-2">{errors.Comments}</p>
              )}
            </div>
          </div>
          <div onScroll={handleScroll} className="overflow-y-auto pl-4 pr-14">
            <nav aria-label="Progress">
              <ol role="list">
                {filteredStatusList.map((status, index) => (
                  <li
                    key={status.StatusID}
                    className={`relative pb-5 cursor-pointer ${
                      completedSteps[index] ? "completed" : ""
                    }`}
                  >
                    {/* Step rendering logic with lines */}
                    <div
                      className={`step-indicator flex items-center ${
                        completedSteps[index]
                          ? "text-gray-800"
                          : "text-gray-800"
                      } ${activeStep === index ? "text-orange-500" : ""}`}
                    >
                      {/* Step Circle */}
                      <span
                        className={`mr-2 h-6 w-6 rounded-full flex items-center justify-center ${
                          completedSteps[index]
                            ? "bg-green-400 text-white"
                            : "bg-gray-300"
                        } ${
                          activeStep === index
                            ? "bg-orange-400 text-white"
                            : "bg-gray-300"
                        }`}
                      >
                        {activeStep === index ? (
                          <GrInProgress />
                        ) : completedSteps[index] ? (
                          "✓"
                        ) : (
                          <FaRegUserCircle />
                        )}
                      </span>
                      {/* Status Text */}
                      <span>
                        {status.OrderStatus === "Revised Design" &&
                        subStatusId &&
                        subStatusId !== 0 &&
                        subStatusId !== "N/A"
                          ? `${status.OrderStatus} R${subStatusId}`
                          : status?.OrderStatus}
                      </span>
                    </div>

                    {/* Line between steps */}
                    {index < filteredStatusList.length - 1 && (
                      <div
                        className={`absolute top-6 left-3 w-0.5 h-8 bg-gray-300 ${
                          completedSteps[index] ? "bg-green-400" : ""
                        }`}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
        <div className="relative flex justify-between items-center mt-6">
          <div className="flex justify-center gap-4 mx-auto">
            <button
              type="button"
              onClick={handleCancel2}
              className="inline-flex justify-center rounded-md border border-transparent text-blue-500 bg-white py-2 px-4 text-sm font-medium hover:text-black shadow-sm hover:bg-blue-200"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={saveOrderHistory}
              className="button-base save-btn"
            >
              {editMode ? "Update" : "Save"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="button-base cancel-btn"
            >
              Cancel
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-4 py-2 bg-custom-darkblue text-white rounded-md flex items-center"
              onClick={handleToggleView}
            >
              {isGridView ? <AiOutlineAppstore /> : <AiOutlineUnorderedList />}
              {/* <span className="ml-2">{showTable ? "Grid View" : "Table View"}</span> */}
            </button>
          </div>
        </div>
      </div>
      <div>
        {isGridView ? (
          <div>
            {/* <OrderHistory OrderID={OrderID} handleEditstatus={handleEditstatus}/> */}
          </div>
        ) : (
          <>
            <TableContainer component={Paper} className="mt-4 shadow-md">
              <Table
                aria-label="orders table"
                className="min-w-full border-collapse border border-gray-300"
              >
                <TableHead className="bg-custom-darkblue">
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Assigned To
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Delivery Date
                    </StyledTableCell>

                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                        width: "200px", // Set a fixed width for the comments column
                        overflow: "hidden", // Hide overflow text
                        whiteSpace: "nowrap", // Prevent text from wrapping to the next line
                        textOverflow: "ellipsis", // Show ellipsis (...) for overflowing text
                      }}
                    >
                      Comments
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Document
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      Actions
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statusArray.length > 0 ? (
                    statusArray.map((status, index) => (
                      <TableRow key={index} className="hover:bg-gray-100">
                        {/* Assigned To & Department */}
                        <StyledTableCell
                          align="center"
                          className="border-r border-gray-300"
                        >
                          <p className="font-thin">
                            Assigned To: {status?.UserName || "N/A"} <br />
                            {/* Department: {status?.EnquiryDepaermentID || "N/A"} */}
                          </p>
                        </StyledTableCell>

                        {/* Start Date & End Date */}
                        <StyledTableCell
                          align="center"
                          className="border-r border-gray-300"
                        >
                          <p className="font-thin">
                            {/* Start Date: N/A <br /> */}
                            End Date:{" "}
                            {status.EndDate
                              ? new Date(status.EndDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                  }
                                )
                              : "N/A"}
                          </p>
                        </StyledTableCell>

                        {/* Comments */}
                        <StyledTableCell
                          align="center"
                          className="border-r border-gray-300"
                        >
                          {status.Comments || "N/A"}
                        </StyledTableCell>

                        {/* Document Links */}
                        <StyledTableCell
                          align="center"
                          className="border-r border-gray-300"
                        >
                          <span>No Documents to View</span>
                        </StyledTableCell>

                        {/* Actions - Edit and Delete */}
                        <StyledTableCell
                          align="center"
                          className="border-r border-gray-300"
                        >
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleEditstatus(
                                  status.EnquiryDepaermentID,
                                  status.CustomerID,
                                  status.UserID
                                )
                              }
                              className="button edit-button"
                            >
                              <AiOutlineEdit className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              className="button delete-button"
                            >
                              <MdOutlineCancel className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </StyledTableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <StyledTableCell align="center" colSpan={7}>
                        {isLoading
                          ? "Loading..."
                          : error
                          ? error
                          : "No Order Found"}
                      </StyledTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalRecords}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </div>
    </Box>
  );
};

export default YourComponent;
