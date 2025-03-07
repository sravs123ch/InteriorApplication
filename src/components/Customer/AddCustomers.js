import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CustomerContext } from "../../Context/customerContext";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Combobox } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CloseIcon from "@mui/icons-material/Close";
import Step2 from "./customerStatus";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import {
  CREATEORUPDATE_CUSTOMERS_API,
  CREATEORUPDATE_CUSTOMERS_ADDRESS_API,
  DELETE_CUSTOMERS_ADDRESS_API,
  ORDERBYCUSTOMERID_API,
  ADDRESS_API,
  CUSTOMERID_API,
  GetAllParentReference,
  GetAllChildrenByParentId,
} from "../../Constants/apiRoutes";
import { MdOutlineCancel } from "react-icons/md";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import SuccessPopup from "../SuccessPopup";
import { showSuccessToast, showErrorToast } from "../../toastNotifications";
import { DataContext } from "../../Context/DataContext";
import { useParams } from "react-router-dom";

// const steps = ["Customer Details", "Address", "Assigned Department", "Orders"];
// Define steps normally
const allSteps = ["Customer Details", "Address", "Assigned Department", "Orders"];


const genderOptions = [
  { id: "M", name: "Male" },
  { id: "F", name: "Female" },
];
const customerStatusOptions = [
  { id: 1, name: "Positive" },
  { id: 2, name: "Gone" },
  { id: 3, name: "Hold" },
  { id: 4, name: "On Process" },
];
const followUpOptions = [
  { id: 2, name: "Enquiry" },
  { id: 1, name: "Follow Up" },
];
// const referralOptions = ["Social Media", "Walk-In", "Reference"];

function AddCustomers() {
  const navigate = useNavigate();
  const location = useLocation();
  // const { customerDetails } = useContext(CustomerContext);
  const { customerDetails, addressDetails } = useContext(CustomerContext);

  const [ReferedBy, setReferedBy] = useState(null);

  const [SubReference, setSubReference] = useState(null);
  const [selectedSocialMediaPlatform, setSelectedSocialMediaPlatform] =
    useState(null);

  const [query, setQuery] = useState("");

  const [referralOptions, setReferralOptions] = useState("");

  // const handleSubReferenceChange = (option) => {
  //   setSubReference(option);
  //   setCustomerFormData({ ...customerFormData, SubReference: option });
  // };

  const handleSocialMediaPlatformChange = (platform) =>
    setSelectedSocialMediaPlatform(platform);
  const handleRefereeNameChange = (e) =>
    setCustomerFormData({ ...customerFormData, refereeName: e.target.value });

  // Customer form data state
  const [customerFormData, setCustomerFormData] = useState({
    TenantID: 1,
    CustomerID: 0,
    StoreID: "",
    FirstName: "",
    LastName: "",
    Email: "",
    // Password: "",
    ConfirmPassword: "",
    PhoneNumber: "",
    Gender: "",
    Comments: "",
    Alternative_PhoneNumber: "",
    ReferedBy: "",
    SubReference: "",
    ReferredByID: "",
    CustomerStatus: "",
    ReferedByName:"", 
    FollowUp:"",
  });

  const [addressFormData, setAddressFormData] = useState({
    AddressID: 0,
    CustomerID: "",
    TenantID: 1,
    AddressLine1: "",
    AddressLine2: "",
    CityID: "",
    StateID: "",
    CountryID: "",
    ZipCode: "",
    Addresses: [],
  });
  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedGender, setSelectedGender] = useState(
    customerFormData.Gender || ""
  );

  const [selectedFollowUp, setSelectedFollowUp] = useState(
     customerFormData.FollowUp || ""
  );

  const [activeStep, setActiveStep] = useState(0);

  const [countryMap, setCountryMap] = useState({});
  const [setStateMap] = useState({});
  const [setCityMap] = useState({});
  const [Addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [addressTableData, setAddressTableData] = useState([]);

  const [popupMessage, setPopupMessage] = useState(""); // For pop-up message
  const [showPopup, setShowPopup] = useState(false);

  const { citiesData, statesData, countriesData } = useContext(DataContext);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const { customerId } = useParams();
  const [customerReference, setCustomerReference] = useState("");
  const [ReferredByID, setReferredByID] = useState(null);
  const [SubReferredByID, setSubReferredByID] = useState(null);
  const [CustomerId, setCustomerId] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [dependenciesLoaded, setDependenciesLoaded] = useState(false);
  const fromFollowups = location.state?.fromFollowups || false; // ✅ Get navigation state

  // State to hold selected status
  const [selectedStatus, setSelectedStatus] = useState(
    customerFormData.CustomerStatus || ""
  );

  //  const handleStatusChange = (status) => {
  //   setSelectedStatus(status);
  //   setCustomerFormData((prevData) => ({
  //     ...prevData,
  //     CustomerStatus: status.name, // Store only the name
  //   }));
  // };
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCustomerFormData((prevData) => ({
      ...prevData,
      CustomerStatus: status.name, // Store only the name
    }));
  };

  useEffect(() => {
    if (countriesData && statesData && citiesData) {
      setCountries(countriesData.data || []);
      setStates(statesData.data || []);
      setCities(citiesData.data || []);
    }
  }, [countriesData, statesData, citiesData]);

  useEffect(() => {
    if (storesData) {
      setStores(storesData);
      // Automatically set selectedStore if there's only one store
      if (storesData.length === 1) {
        setSelectedStore(storesData[0]);
      }
    }
  }, [storesData]);

  useEffect(() => {
    // Check if dependencies are loaded
    if (stores?.length && genderOptions?.length && referralOptions?.length) {
      setDependenciesLoaded(true);
    }
  }, [stores, genderOptions, referralOptions]);

  useEffect(() => {
    const fetchCustomerDetailsAndAddress = async () => {
      if (customerId === "new") {
        setCustomerFormData({});
        setAddressTableData([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch customer details and address based on the customerId
        const [customerResponse, addressResponse] = await Promise.all([
          axios.get(`${CUSTOMERID_API}/${customerId}`, {
            headers: {
              Authorization: `Bearer`,
              "Content-Type": "application/json",
            },
          }),
          axios.get(`${ADDRESS_API}/${customerId}`, {
            headers: {
              Authorization: `Bearer`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        // Ensure that the customer and address data are correctly fetched
        const fetchedCustomerData = customerResponse.data.customer;
        const fetchedAddressData = addressResponse.data?.Addresses;

        // Map data to dropdown selections
        const selectedGender = genderOptions.find(
          (g) => g.id === fetchedCustomerData.Gender
        );
        // const selectedFollowUp = followUpOptions.find(
        //   (f) => f.id === fetchedCustomerData.FollowUp
        // );
        const selectedFollowUp = followUpOptions.find(
  (f) => f.id === Number(fetchedCustomerData.FollowUp) // Ensure type match
);

        const selectedStatus = customerStatusOptions.find(
          (s) => s.name === fetchedCustomerData.CustomerStatus
        );
        const selectedStore = stores.find(
          (store) => store.StoreID === fetchedCustomerData.StoreID
        );
        const selectedReferral = referralOptions.find(
          (referral) => referral === fetchedCustomerData?.ReferedBy
        );

        if (fetchedCustomerData) {
          setCustomerFormData({
            ...fetchedCustomerData,
          });
          setSelectedStatus(selectedStatus || null);
          setSelectedGender(selectedGender || null);
          setSelectedFollowUp(selectedFollowUp|| null);
          setSelectedStore(selectedStore || null);
          setReferedBy(selectedReferral || "");
          setCustomerReference(
            fetchedCustomerData.CustomerNumber
              ? fetchedCustomerData.CustomerNumber
              : "N/A"
          );
        } else {
          setError("Customer not found.");
        }

        if (fetchedAddressData) {
          setAddressTableData(fetchedAddressData || []);
        }
      } catch (err) {
        console.error("Error fetching customer details or address:", err);
        setError("Failed to fetch customer details or address.");
      } finally {
        setIsLoading(false);
      }
    };

    if (dependenciesLoaded) {
      fetchCustomerDetailsAndAddress();
    }
  }, [customerId, dependenciesLoaded]);

  
// Conditionally modify steps
const steps = fromFollowups && selectedFollowUp?.id === 1
? allSteps.filter((_, index) => index !== 2) // Hide step 2
: allSteps;
//  console.log(steps);
//  console.log(fromFollowups);
//  console.log(selectedFollowUp?.id );
  const handleReferralTypeChange = (type) => {
    setReferedBy(type); // Set the selected referral type
    setCustomerFormData({ ...customerFormData, ReferedBy: type });
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setCustomerFormData({ ...customerFormData, Gender: gender.id });
  };
  const handleFollowUpChange = (followUp) => {
    setSelectedFollowUp(followUp);
    setCustomerFormData({ ...customerFormData, FollowUp: followUp.id }); // Set FollowUp ID in customerFormData
  };
  const handleCustomerFormChange = (e) => {
    const { name, value } = e.target;
    setCustomerFormData({
      ...customerFormData,
      [name]: value,
    });
  };

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData({
      ...addressFormData,
      [name]: value,
    });
  };

  const handleCustomerFormSubmit = async () => {
    setIsLoading(true); // Show loading animation

    // New validation logic
    const validationError = validateCustomerData();
    if (validationError) {
      toast.error(validationError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false); // Hide loading animation
      return; // Exit function if validation fails
    }

    const customerApiUrl = CREATEORUPDATE_CUSTOMERS_API;

    try {
      // Ensure TenantID is included in the request data
      const customerData = {
        ...customerFormData,
        TenantID: 1, // Set TenantID to 1
        StoreID:
          stores.length === 1 ? stores[0].StoreID : customerFormData.StoreID,
      };
      // Create or update the customer
      const customerResponse = await axios.post(customerApiUrl, customerData);

      const newCustomerId = customerResponse.data.CustomerID;

      if (!newCustomerId) {
        throw new Error("Failed to retrieve CustomerID from response.");
      }

      setCustomerId(customerResponse.data.CustomerID);

      navigate(`/Customerform/${newCustomerId}`);

      // Show success toast notification
      if (customerFormData.CustomerID) {
        toast.success("Customer Details Updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success("Customer Details Added successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      handleNext();
      setCustomerId(newCustomerId);
      return newCustomerId;
    } catch (error) {
      console.error("Error submitting address:", error);

      // Show error toast notification
      if (error.response) {
        console.error("Response data:", error.response.data);
        const errorMessage =
          error.response.data.error || "Failed to submit address.";
        toast.error("Failed to submit address: " + errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response received from server.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.error("Error in setting up request:", error.message);
        toast.error("Error: " + error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };
  const handleFinish = () => {
    navigate("/Customer");
  };

  const handleAddressFormSubmit = async (customerId) => {
    setIsLoading(true); // Show loading animation

    const validationError = validateAddressData();
    if (validationError) {
      toast.error(validationError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false); // Hide loading animation
      return; // Exit function if validation fails
    }

    const addressesApiUrl = CREATEORUPDATE_CUSTOMERS_ADDRESS_API;

    try {
      const newAddress = {
        AddressID: addressFormData.AddressID || 0, // Default to 0 for new addresses
        AddressLine1: addressFormData.AddressLine1 || "",
        AddressLine2: addressFormData.AddressLine2 || "",
        CityID: addressFormData.CityID || "",
        StateID: addressFormData.StateID || "",
        CountryID: addressFormData.CountryID || "",
        ZipCode: addressFormData.ZipCode || "",
      };

      // Create updated addresses array
      const updatedAddresses = addressFormData.Addresses
        ? [...addressFormData.Addresses, newAddress]
        : [newAddress];

      // Update addressFormData with the new addresses
      setAddressFormData((prevState) => ({
        ...prevState,
        Addresses: updatedAddresses,
      }));

      const addressData = {
        Addresses: updatedAddresses,
        AddressID: newAddress.AddressID,
        CustomerID: customerId,
        TenantID: 1,
        AddressLine1: newAddress.AddressLine1,
        AddressLine2: newAddress.AddressLine2,
        CityID: newAddress.CityID,
        StateID: newAddress.StateID,
        CountryID: newAddress.CountryID,
        ZipCode: newAddress.ZipCode,
      };

      // Send the address data to the API
      const addressResponse = await axios.post(addressesApiUrl, addressData);

      // Show success toast notification
      const isUpdating = Boolean(addressFormData.AddressID); // Check if updating an existing address
      const successMessage = isUpdating
        ? "Address Updated successfully!"
        : "Address Added successfully!";

      toast.success(successMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Fetch updated customer data after successful submission
      const updatedCustomer = await getCustomerAddressById(customerId);

      if (updatedCustomer && Array.isArray(updatedCustomer)) {
        setAddressTableData(updatedCustomer); // Set updated addresses in the table
      }

      // Set the selected country, state, and city
      setSelectedCountry(updatedCustomer?.Addresses?.[0]?.CountryID || null);
      setSelectedState(updatedCustomer?.Addresses?.[0]?.StateID || null);
      setSelectedCity(updatedCustomer?.Addresses?.[0]?.CityID || null);

      // Reset form fields
      setAddressFormData({
        AddressID: 0,
        AddressLine1: "",
        AddressLine2: "",
        CityID: "",
        StateID: "",
        CountryID: "",
        ZipCode: "",
        Addresses: [],
      });
    } catch (error) {
      console.error("Customer submission failed:", error);

      // Show error toast notification
      if (error.response) {
        console.error("Response data:", error.response.data);
        const errorMessage =
          error.response.data.error || "Failed to submit customer.";
        toast.error(
          `Failed to ${
            customerFormData.CustomerID ? "update" : "create"
          } customer: ${errorMessage}`,
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
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response received from server.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.error("Error in setting up request:", error.message);
        toast.error("Error: " + error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  useEffect(() => {}, [addressTableData]);

  const getCustomerAddressById = async (customerId) => {
    try {
      const response = await axios.get(`${ADDRESS_API}/${customerId}`);

      // Assuming the response contains an array of addresses
      const addressData = response.data?.Addresses || []; // Adjust based on your API response structure

      // Set address data in state
      setAddressTableData({
        Addresses: addressData,
      });

      return addressData; // Optionally return the addresses if needed
    } catch (error) {
      console.error("Error fetching customer addresses:", error);
      throw error; // Re-throw the error for further handling if necessary
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customerId = customerFormData.CustomerID;

        if (!customerId) return; // Ensure customerId exists

        const response = await axios.get(
          `${ORDERBYCUSTOMERID_API}/${customerId}`
        );
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    // Only call fetchOrders if customerId exists
    if (customerFormData.CustomerID) {
      fetchOrders();
    }
  }, [customerFormData.CustomerID]);

  const handleCountryChange = (selectedCountry) => {
    if (!selectedCountry) return;

    const countryID =
      countryMap[selectedCountry.CountryName] || selectedCountry.CountryID;

    setSelectedCountry(selectedCountry);
    setAddressFormData({
      ...addressFormData,
      CountryID: countryID,
      CountryName: selectedCountry.CountryName,
    });
    setSelectedState("");
    setSelectedCity("");
    setFilteredStates(
      states.filter((state) => state.CountryID === selectedCountry.CountryID)
    );
  };

  const handleStateChange = (state) => {
    if (!state) return;

    const stateID = stateMap[state.StateName] || state.StateID;

    setSelectedState(state);
    setSelectedCity("");
    setAddressFormData({
      ...addressFormData,
      StateID: stateID,
      StateName: state.StateName,
    });
    setFilteredCities(cities.filter((city) => city.StateID === state.StateID));
  };

  const handleCityChange = (city) => {
    if (!city) return;

    const cityID = cityMap[city.CityName] || city.CityID;

    setSelectedCity(city);
    setAddressFormData({
      ...addressFormData,
      CityID: cityID,
      CityName: city.CityName,
    });
  };

  const handleReset = () => {
    setActiveStep(0);

    // Reset customer form data
    setCustomerFormData({
      TenantID: 1,
      CustomerID: null,
      CustomerFirstName: "",
      CustomerLastName: "",
      CustomerEmail: "",
      // Password: "",
      ConfirmPassword: "",
      PhoneNumber: "",
      Gender: "",
      Comments: "",
      Alternative_PhoneNumber: "",
      ReferedBy: "",
      ReferredByID: "",
      ReferedByName :"",
      CustomerStatus: "",
    });

    // Reset address form data
    setAddressFormData({
      AddressLine1: "",
      AddressLine2: "",
      CityID: "",
      StateID: "",
      CountryID: "",
      ZipCode: "",
    });
  };

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => false;

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleEdit = async (addressId) => {
    // Find the selected address using the AddressID directly from the array
    const selectedAddress = addressTableData.find(
      (address) => address.AddressID === addressId
    );

    if (selectedAddress) {
      // Find the corresponding country, state, and city based on their IDs
      const selectedCountry =
        countries.find(
          (country) => country.CountryID === selectedAddress.CountryID
        ) || {};
      const selectedState =
        states.find((state) => state.StateID === selectedAddress.StateID) || {};
      const selectedCity =
        cities.find((city) => city.CityID === selectedAddress.CityID) || {};

      // Populate the form fields with the selected address details
      setAddressFormData((prevState) => ({
        ...prevState,
        AddressID: selectedAddress.AddressID || 0,
        CustomerID: prevState.CustomerID, // Keep the same customer ID
        AddressLine1: selectedAddress.AddressLine1 || "",
        AddressLine2: selectedAddress.AddressLine2 || "",
        CityID: selectedAddress.CityID || "",
        StateID: selectedAddress.StateID || "",
        CountryID: selectedAddress.CountryID || "",
        ZipCode: selectedAddress.ZipCode || "",
        Addresses: prevState.Addresses, // Keep the existing array of addresses
      }));

      // Set the country, state, and city dropdowns
      setSelectedCountry(selectedCountry);
      setSelectedState(selectedState);
      setSelectedCity(selectedCity);
    } else {
      console.error("Address with the specified AddressID not found.");
    }
  };

  const handleDelete = async (addressId, customerId) => {
    if (!addressId) {
      console.error("No AddressID provided.");
      return;
    }

    const deleteApiUrl = `${DELETE_CUSTOMERS_ADDRESS_API}/${addressId}`;

    try {
      // Make a DELETE request to the API
      const response = await axios.delete(deleteApiUrl);

      // Remove the deleted address from the addressFormData state
      setAddressFormData((prevState) => ({
        ...prevState,
        Addresses: prevState.Addresses.filter(
          (address) => address.AddressID !== addressId
        ),
      }));

      // Show success toast notification
      toast.success("Address deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      const updatedCustomer = await getCustomerAddressById(customerId);

      if (updatedCustomer && Array.isArray(updatedCustomer)) {
        setAddressTableData(updatedCustomer); // Set updated addresses in the table
      }
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleCancel = () => {
    setIsLoading(true);

    // Add a small delay before navigating to show the loader
    setTimeout(() => {
      navigate("/Customer");
    }, 1500); // Delay by 500ms
  };

  const handleStoreChange = (store) => {
    if (!store || !store.StoreID) {
      console.error("Invalid store selected:", store);
      return;
    }

    setSelectedStore(store);

    // Update formData with selected store ID and name
    setCustomerFormData({
      ...customerFormData,
      StoreID: store.StoreID, // Store ID to send to the backend
    });
  };
  useEffect(() => {
    // Check if there's state passed to this component
    if (location.state) {
      setActiveStep(location.state.activeStep || 0); // Set the active step from location state
      setOrders(location.state.orders || []); // Set orders if available from location state
    }
  }, [location.state]);

  const cityMap = cities.reduce((acc, city) => {
    acc[city.CityID] = city.CityName;
    return acc;
  }, {});

  const stateMap = states.reduce((acc, state) => {
    acc[state.StateID] = state.StateName;
    return acc;
  }, {});

  // Validation

  const validateCustomerData = () => {
    const newErrors = {};
    // if (!customerFormData.StoreID) {
    //   newErrors.StoreIDError = "Store is required.";
    // }
    if (!customerFormData.FirstName) {
      newErrors.FirstNameError = "First name is required.";
    }
    // if (!customerFormData.LastName) {
    //   newErrors.LastNameError = "Last name is required.";
    // }
    if (
      !customerFormData.PhoneNumber ||
      !validatePhoneNumber(customerFormData.PhoneNumber)
    ) {
      newErrors.PhoneNumberError = "Please enter a valid phone number.";
    }
    // if (!customerFormData.Email || !validateEmail(customerFormData.Email)) {
    //   newErrors.EmailError = "Please enter a valid email.";
    // }
    if (!customerFormData.Email || validateEmail(customerFormData.Email)) {
      // If email is invalid or empty, set error message
      newErrors.EmailError =
        validateEmail(customerFormData.Email) || "Please enter a valid email.";
    }
    if (!selectedGender) {
      newErrors.GenderError = "Gender is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length > 0;
  };

  const validatePhoneNumber = (number) => {
    // Check if the number is defined and is a string
    if (!number || typeof number !== "string") return false;
    // Regular expression to match 10 to 15 digits
    const phoneRegex = /^\d{10,13}$/;
    return phoneRegex.test(number);
  };
  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
  //   return emailRegex.test(email);
  // };

  const validateEmail = (email) => {
    if (!email) return "Email is required.";
    if (/\s/.test(email)) return "Email should not contain spaces.";
    if (!email.includes("@")) return "Email must include '@'.";
    if (!email.includes(".")) return "Email domain must include a '.'.";
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return "Invalid email format.";
    }
    if (!email.endsWith(".com")) {
      return "Email must end with '.com'.";
    }
    return null;
  };

  const validateAddressData = () => {
    setErrors({});
    const newErrors = {};
    if (!addressFormData.AddressLine1) {
      newErrors.AddressLine1Error = "Address is required.";
    }
    if (!selectedCountry) {
      newErrors.CountryError = "Country is required.";
    }
    if (!selectedState) {
      newErrors.StateError = "State is required.";
    }
    if (!selectedCity) {
      newErrors.CityError = "City is required.";
    }
    if (!addressFormData.ZipCode || !validateZipCode(addressFormData.ZipCode)) {
      newErrors.ZipCodeError = "Please enter a valid 6-digit Zip Code.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length > 0;
  };

  const validateZipCode = (zipCode) => {
    // Check if the zip code is defined and matches the desired format (e.g., 5 digits)
    const zipCodeRegex = /^\d{6}(-\d{5})?$/; // US ZIP code format (5 digits or 5-4 digits)
    return zipCode && zipCodeRegex.test(zipCode); // Ensure zip code is valid
  };

  const [subReferences, setSubReferences] = useState([]); // State for sub-references
  const [selectedParentId, setSelectedParentId] = useState(null); // Selected parent ID
  const [subReferenceQuery, setSubReferenceQuery] = useState("");
  const [selectedSubReference, setSelectedSubReference] = useState(null); // Selected sub-reference
  const [childQuery, setChildQuery] = useState("");
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const response = await axios.get(GetAllParentReference);
        const referenceData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        // Map to extract id and name
        const referralNames = referenceData.map((item) => ({
          id: item.id,
          name: item.name,
        }));

        setReferralOptions(referralNames);
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    };

    fetchReferences();
  }, []);
  const customer =
    location.state?.customerDetails?.customer || customerDetails?.customer;

  useEffect(() => {
    if (customer?.ReferredByID) {
      // Fetch sub-references and set ReferedBy in form data
      fetchSubReferences(customer.ReferredByID).then(() => {
        setCustomerFormData((prevDetails) => ({
          ...prevDetails,
          ReferedBy: customer.ReferedBy || "", // Set parent reference name
          ReferredByID: customer.ReferredByID || "", // Set parent reference ID
        }));
      });
    }
  }, [customer?.ReferredByID]);

  useEffect(() => {
    // Set SubReference and SubReferenceID in form data
    if (customer?.SubReferenceID) {
      setCustomerFormData((prevDetails) => ({
        ...prevDetails,
        SubReference: customer.SubReference || "", // Set sub-reference name
        SubReferenceID: customer.SubReferenceID || "", // Set sub-reference ID
      }));
    }
  }, [customer?.SubReferenceID]);

  useEffect(() => {
    // Fetch sub-references if ReferredByID exists in edit mode
    if (customerFormData.ReferredByID) {
      fetchSubReferences(customerFormData.ReferredByID).then(() => {
        setCustomerFormData((prevDetails) => ({
          ...prevDetails,
          SubReference: customerFormData.SubReference || "",
          SubReferenceID: customerFormData.SubReferenceID || "",
        }));
      });
    }
  }, [customerFormData.ReferredByID]);

  const fetchSubReferences = async (parentId) => {
    try {
      const response = await axios.get(
        `${GetAllChildrenByParentId}/${parentId}`
      );

      // Filter active items only
      const subReferenceData = Array.isArray(response.data.data)
        ? response.data.data.filter((item) => item.isActive) // Exclude inactive items
        : [];

      setSubReferences(subReferenceData); // Set filtered sub-references
      return subReferenceData; // Return filtered data if needed
    } catch (error) {
      console.error("Error fetching sub-references:", error);
      return [];
    }
  };

  const handleParentChange = (selectedParent) => {
    const selectedId = selectedParent?.id || null;
    const selectedName = selectedParent?.name || "";

    // Fetch sub-references for the selected parent
    if (selectedId) fetchSubReferences(selectedId);

    setCustomerFormData((prevDetails) => ({
      ...prevDetails,
      ReferedBy: selectedName,
      ReferredByID: selectedId,
      SubReference: "", // Reset sub-reference on parent change
      SubReferenceID: "",
    }));
  };

  const handleSubReferenceChange = (selectedSub) => {
    const selectedSubId = selectedSub?.id || "";
    const selectedSubName = selectedSub?.name || "";

    setCustomerFormData((prevDetails) => ({
      ...prevDetails,
      SubReference: selectedSubName,
      SubReferenceID: selectedSubId,
    }));
  };
  // Retrieve the navbar-collapsed value from localStorage
  const storedCollapsed = localStorage.getItem("navbar-collapsed") === "true";

  // Set the initial state based on the stored value
  const [isExpanded, setIsExpanded] = useState(!storedCollapsed);

  useEffect(() => {
    // Set the initial state based on the localStorage value
    const storedCollapsed = localStorage.getItem("navbar-collapsed");
    if (storedCollapsed !== null) {
      setIsExpanded(storedCollapsed === "false");
    }
  }, []); // Only run this once on component mount
  return (
    <>
      {/* <div className="main-container"> */}
      <div
        className={`main-container ${isExpanded ? "expanded" : "collapsed"}`}
      >
        <ToastContainer />
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} className="mb-6" alternativeLabel>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {
                onClick: () => handleStepClick(index), // Add onClick handler
                style: { cursor: "pointer" }, // Add cursor style for pointer
              };

              if (isStepOptional(index)) {
                // Optional step logic
              }

              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {activeStep === steps.length ? (
            <React.Fragment></React.Fragment>
          ) : (
            <React.Fragment>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr" },
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  pt: 2,
                }}
              >
                {activeStep === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                        <label
                          htmlFor="storeName"
                          className="w-1/3 text-xs  font-medium text-gray-700"
                        >
                          Store Name <span className="text-red-500">*</span>
                        </label>
                        <Combobox
                          value={selectedStore}
                          onChange={handleStoreChange}
                          className="w-full"
                        >
                          <div className="relative">
                            {/* Input Field */}
                            <Combobox.Input
                              id="storeName"
                              className={`p-1 w-full border rounded-md ${
                                !customerFormData.StoreID && errors.StoreIDError
                                  ? "border-red-400"
                                  : "border-gray-400"
                              }`}
                              displayValue={(store) => store?.StoreName || ""}
                              placeholder="Select Store"
                              readOnly={stores.length === 1} // Set readonly if only one store
                            />

                            {/* Dropdown Button */}
                            {stores.length > 1 && (
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </Combobox.Button>
                            )}

                            {/* Dropdown Options */}
                            {stores.length > 1 && (
                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {/* Default Option */}
                                <Combobox.Option
                                  key="select-store-id"
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                      active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={{
                                    StoreID: null,
                                    StoreName: "Select Store",
                                  }}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-semibold"
                                            : "font-normal"
                                        }`}
                                      >
                                        Select Store
                                      </span>
                                      {selected && (
                                        <span
                                          className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                            active
                                              ? "text-white"
                                              : "text-indigo-600"
                                          }`}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>

                                {/* Render Store Options */}
                                {stores.map((store) => (
                                  <Combobox.Option
                                    key={store.StoreID}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900"
                                      }`
                                    }
                                    value={store}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-semibold"
                                              : "font-normal"
                                          }`}
                                        >
                                          {store.StoreName}
                                        </span>
                                        {selected && (
                                          <span
                                            className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                              active
                                                ? "text-white"
                                                : "text-indigo-600"
                                            }`}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
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
                      <div className="w-full flex sm:pr-44 justify-start sm:justify-center sm:mr-4">
                        {!customerFormData.StoreID && errors.StoreIDError && (
                          <p className="text-red-500 text-sm mt-1 ">
                            {errors.StoreIDError}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className=" flex items-center gap-4  w-full">
                      {/* <div className="flex items-center w-full text-sm sm:text-xs font-medium text-gray-800 h-full"> */}
                      {customerReference && (
                        <>
                          <div className="w-1/4 text-xs font-semibold text-gray-700 ">
                            Reference No:
                          </div>

                          <div className="p-1 w-[76%] rounded-md font-medium bg-gray-100 border border-gray-400">
                            {customerReference}
                          </div>

                          {/* </div> */}
                        </>
                      )}
                    </div>
                    {/* First Name */}
                    <div className="">
                      <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          First name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="FirstName"
                          value={customerFormData.FirstName}
                          onChange={handleCustomerFormChange}
                          className={`p-1 w-full border rounded-md ${
                            !customerFormData.FirstName && errors.FirstNameError
                              ? "border-red-500"
                              : "border-gray-400"
                          }`}
                        />
                      </div>
                      <div className="w-full flex sm:pr-36 justify-start sm:justify-center sm:mr-4">
                        {!customerFormData.FirstName &&
                          errors.FirstNameError && (
                            <p className="text-red-500 text-sm mt-1 ">
                              {errors.FirstNameError}
                            </p>
                          )}
                      </div>
                    </div>
                    {/* Last Name */}
                    <div>
                      <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          Last name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="LastName"
                          value={customerFormData.LastName}
                          onChange={handleCustomerFormChange}
                          className={`p-1 w-full border rounded-md ${
                            errors.LastNameError
                              ? "border-red-500"
                              : "border-gray-400"
                          }`}
                        />
                      </div>
                      <div className="w-full flex sm:pr-36 justify-start sm:justify-center sm:mr-4">
                        {errors.LastNameError && (
                          <p className="text-red-500 text-sm mt-1 ">
                            {errors.LastNameError}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Phone Number */}
                    <div>
                      <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="PhoneNumber"
                          value={customerFormData.PhoneNumber}
                          onChange={handleCustomerFormChange}
                          className={`p-1 w-full border rounded-md ${
                            !customerFormData.PhoneNumber &&
                            errors.PhoneNumberError
                              ? "border-red-500"
                              : "border-gray-400"
                          }`}
                        />
                      </div>
                      <div className="w-full flex sm:pr-16 justify-start sm:justify-center sm:mr-4">
                        {!customerFormData.PhoneNumber &&
                          errors.PhoneNumberError && (
                            <p className="text-red-500 text-sm mt-1 ">
                              {errors.PhoneNumberError}
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                      <label className="w-1/3 text-xs font-medium text-gray-700">
                        Alternate Phone Number
                      </label>
                      <input
                        type="text"
                        name="Alternative_PhoneNumber"
                        value={customerFormData.Alternative_PhoneNumber}
                        onChange={handleCustomerFormChange}
                        className={`p-1 w-full border rounded-md ${
                          error ? "border-red-500" : "border-gray-400"
                        }`}
                      />
                    </div>
                  
                    <div>
                      <div className="flex sm:items-center gap-4 w-full flex-col sm:flex-row">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="Email"
                          value={customerFormData.Email}
                          onChange={handleCustomerFormChange}
                          className={`p-1 w-full border rounded-md ${
                            errors.EmailError
                              ? "border-red-500"
                              : "border-gray-400"
                          }`}
                        />
                      </div>
                      {errors.EmailError && (
                        <div className="w-full flex sm:pr-[122px] justify-start sm:justify-center sm:mr-4">
                          <p className="text-red-500 text-sm mt-1">
                            {errors.EmailError}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Gender */}
                    <div>
                      <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <Combobox
                          value={selectedGender}
                          onChange={handleGenderChange}
                        >
                          <div className="relative w-full">
                            <Combobox.Input
                              className={`w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1    sm:text-sm ${
                                errors.GenderError && !selectedGender
                                  ? "ring-red-400"
                                  : "ring-gray-400"
                              }`}
                              displayValue={(type) => (type ? type.name : "")}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </Combobox.Button>
                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
                              {genderOptions.map((gender) => (
                                <Combobox.Option
                                  key={gender.id}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                      active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={gender}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-semibold"
                                            : "font-normal"
                                        }`}
                                      >
                                        {gender.name}
                                      </span>
                                      {selected && (
                                        <span
                                          className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                            active
                                              ? "text-white"
                                              : "text-indigo-600"
                                          }`}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))}
                            </Combobox.Options>
                          </div>
                        </Combobox>
                      </div>
                      <div className="w-full flex sm:pr-[158px] justify-start sm:justify-center sm:mr-4">
                        {errors.GenderError && !selectedGender && (
                          <p className="text-red-500 text-sm mt-1 ">
                            {errors.GenderError}
                          </p>
                        )}
                      </div>
                    </div>

                                        {/* Referred By Name */}
                                        <div>
  <div className="flex sm:items-center gap-4 w-full flex-col sm:flex-row mt-2">
    <label className="w-1/3 text-xs font-medium text-gray-700">
      Referred By Name
    </label>
    <input
      type="text"
      name="ReferedByName"
     
      value={customerFormData?.ReferedByName || ""}
      onChange={handleCustomerFormChange}
      className={`p-1 w-full border rounded-md ${
        error ? "border-red-500" : "border-gray-400"
      }`}
    />
  </div>
  </div>   <div>  
             <div className="flex flex-col gap-4 w-full">
                      {/* Reference Dropdown */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          Reference <span className="text-red-500">*</span>
                        </label>

                        <Combobox
                          value={customerFormData.ReferedBy || ""}
                          onChange={(selectedOption) => {
                            const selectedId = selectedOption?.id;
                            const selectedName = selectedOption?.name;

                            if (selectedId) {
                              fetchSubReferences(selectedId);
                            }
                            setSubReferences([]); // Reset child dropdown on parent change
                            setCustomerFormData((prevDetails) => ({
                              ...prevDetails,
                              ReferedBy: selectedName || "",
                              ReferredByID: selectedId || "",
                            }));
                            setSubReferredByID(selectedId);
                          }}
                        >
                          <div className="relative w-full">
                            <Combobox.Input
                              className={`w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 sm:text-sm ${
                                errors.ReferedBy
                                  ? "ring-red-400"
                                  : "ring-gray-400"
                              }`}
                              onChange={(event) => setQuery(event.target.value)}
                              displayValue={(option) =>
                                option || "Select Reference"
                              }
                              placeholder="Select Reference"
                              aria-label="Reference"
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </Combobox.Button>
                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {referralOptions.length > 0 ? (
                                referralOptions.map((option) => (
                                  <Combobox.Option
                                    key={option.id}
                                    value={option}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900"
                                      }`
                                    }
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-semibold"
                                              : "font-normal"
                                          }`}
                                        >
                                          {option.name}
                                        </span>
                                        {selected && (
                                          <span
                                            className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                              active
                                                ? "text-white"
                                                : "text-indigo-600"
                                            }`}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))
                              ) : (
                                <p className="py-2 pl-3 pr-9 text-gray-500">
                                  No options available
                                </p>
                              )}
                            </Combobox.Options>
                          </div>
                        </Combobox>
                        {errors.ReferedBy && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.ReferedBy}
                          </p>
                        )}
                      </div>

                      {/* Sub-Reference Dropdown */}
                      {subReferences.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                          <label className="w-1/3 text-xs font-medium text-gray-700">
                            Sub-Reference
                          </label>

                          <Combobox
                            value={
                              subReferences.find(
                                (item) =>
                                  item.id === customerFormData.SubReferenceID
                              ) || null
                            }
                            onChange={(selectedOption) => {
                              const selectedSubId = selectedOption?.id;
                              const selectedSubName = selectedOption?.name;

                              setCustomerFormData((prevDetails) => ({
                                ...prevDetails,
                                SubReference: selectedSubName || "",
                                SubReferenceID: selectedSubId || "",
                              }));
                            }}
                          >
                            <div className="relative w-full">
                              <Combobox.Input
                                className={`w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 sm:text-sm ${
                                  errors.SubReference
                                    ? "ring-red-400"
                                    : "ring-gray-400"
                                }`}
                                onChange={(event) =>
                                  setChildQuery(event.target.value)
                                }
                                displayValue={(option) => option?.name || ""}
                                placeholder="Select Sub-Reference"
                                aria-label="Sub-Reference"
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </Combobox.Button>
                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {subReferences.length > 0 ? (
                                  subReferences.map((option) => (
                                    <Combobox.Option
                                      key={option.id}
                                      value={option}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                          active
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-900"
                                        }`
                                      }
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-semibold"
                                                : "font-normal"
                                            }`}
                                          >
                                            {option.name}
                                          </span>
                                          {selected && (
                                            <span
                                              className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                                active
                                                  ? "text-white"
                                                  : "text-indigo-600"
                                              }`}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </Combobox.Option>
                                  ))
                                ) : (
                                  <p className="py-2 pl-3 pr-9 text-gray-500">
                                    No options available
                                  </p>
                                )}
                              </Combobox.Options>
                            </div>
                          </Combobox>

                          {errors.SubReference && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.SubReference}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    </div>  
                   
                    <div>   
                    <div className="flex sm:items-center gap-4 w-full flex-col sm:flex-row">
                      <label className="w-1/3 text-xs font-medium text-gray-700">
                        Customer Status <span className="text-red-500">*</span>
                      </label>
                      <Combobox
                        value={selectedStatus}
                        onChange={handleStatusChange}
                      >
                        <div className="relative w-full">
                          <Combobox.Input
                            className={`w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 sm:text-sm ${
                              errors.statusError && !selectedStatus
                                ? "ring-red-400"
                                : "ring-gray-400"
                            }`}
                            displayValue={(status) =>
                              status ? status.name : ""
                            }
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Combobox.Button>
                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {customerStatusOptions.map((status) => (
                              <Combobox.Option
                                key={status.id}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                    active
                                      ? "bg-indigo-600 text-white"
                                      : "text-gray-900"
                                  }`
                                }
                                value={status}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected
                                          ? "font-semibold"
                                          : "font-normal"
                                      }`}
                                    >
                                      {status.name}
                                    </span>
                                    {selected && (
                                      <span
                                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                          active
                                            ? "text-white"
                                            : "text-indigo-600"
                                        }`}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    )}
                                  </>
                                )}
                              </Combobox.Option>
                            ))}
                          </Combobox.Options>
                        </div>
                      </Combobox>
                    </div>
                    <div className="w-full flex sm:pr-[158px] justify-start sm:justify-center sm:mr-4">
                      {errors.statusError && !selectedStatus && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.statusError}
                        </p>
                      )}
                    </div>
                    </div>  
     
                    <div>
  <div className="flex sm:items-center gap-4 w-full flex-col sm:flex-row mt-4">
    <label className="w-1/3 text-xs font-medium text-gray-700">
      Assign Follow Up <span className="text-red-500">*</span>
    </label>
    <Combobox value={selectedFollowUp} onChange={handleFollowUpChange}>
      <div className="relative w-full">
        <Combobox.Input
          className={`w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 sm:text-sm ${
            errors?.FollowUpError && !selectedFollowUp
              ? "ring-red-400"
              : "ring-gray-400"
          }`}
          displayValue={(followUp) => followUp?.name || ""}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {followUpOptions.map((followUp) => (
            <Combobox.Option
              key={followUp.id}
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-3 pr-9 ${
                  active ? "bg-indigo-600 text-white" : "text-gray-900"
                }`
              }
              value={followUp}
            >
              {({ selected, active }) => (
                <>
                  <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                    {followUp.name}
                  </span>
                  {selected && (
                    <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                      active ? "text-white" : "text-indigo-600"
                    }`}>
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  </div>
  <div className="w-full flex sm:pr-[158px] justify-start sm:justify-center sm:mr-4">
    {errors?.FollowUpError && !selectedFollowUp && (
      <p className="text-red-500 text-sm mt-1">{errors.FollowUpError}</p>
    )}
  </div>
</div>

                     {/* Comments */}
                     <div>  
                    <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                      <label className="w-1/3 text-xs font-medium text-gray-700">
                        Comments
                      </label>
                      <textarea
                        name="Comments"
                        value={customerFormData?.Comments || ""}
                        onChange={handleCustomerFormChange}
                        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                        rows="3"
                      />
                    </div>
                    </div> 
              
                    {/* <div></div> */}
                    <div></div>{" "}
                    <div className=" flex items-center gap-4  w-full"></div>
                    <div className="mt-6 flex justify-end gap-4 ">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-custom-darkblue py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-custom-lightblue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={handleCustomerFormSubmit}
                      >
                        {customerFormData.CustomerID ? "Update" : "Save"}{" "}
                        {/* Conditional button text */}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-red-200"
                      >
                        Cancel
                      </button>
                    </div>
                    {showPopup && (
                      <SuccessPopup
                        message={popupMessage}
                        onClose={() => setShowPopup(false)}
                      />
                    )}
                    {isLoading && <LoadingAnimation />}
                  </div>
                )}
                {activeStep === 1 && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                          <label className="w-1/3 text-xs font-medium text-gray-700">
                            Address Line 1{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="AddressLine1"
                            value={addressFormData.AddressLine1}
                            onChange={handleAddressFormChange}
                            className={`p-1 w-full border rounded-md ${
                              errors.AddressLine1Error &&
                              !addressFormData.AddressLine1
                                ? "border-red-500"
                                : "border-gray-400"
                            }`}
                          />
                        </div>
                        <div className="w-full flex sm:pr-[154px] justify-start sm:justify-center sm:mr-4">
                          {errors.AddressLine1Error &&
                            !addressFormData.AddressLine1 && (
                              <p className="text-red-500 text-sm mt-1 ">
                                {errors.AddressLine1Error}
                              </p>
                            )}
                        </div>
                      </div>

                      <div>
                        <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                          <label className="w-1/3 text-xs font-medium text-gray-700">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            name="AddressLine2"
                            value={addressFormData.AddressLine2}
                            onChange={handleAddressFormChange}
                            className={`p-1 w-full border rounded-md ${
                              error ? "border-red-500" : "border-gray-400"
                            }`}
                          />
                        </div>
                        <div className="w-full flex sm:pr-36 justify-start sm:justify-center sm:mr-4">
                          {/* {errors.AddressLine1Error && (
                            <p className="text-red-500 text-sm mt-1 ">
                              {errors.AddressLine1Error}
                            </p>
                          )} */}
                        </div>
                      </div>

                      <div>
                        <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                          <label className="w-1/3 text-xs font-medium text-gray-700">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <div className="w-full">
                            <Combobox
                              as="div"
                              value={selectedCountry}
                              onChange={handleCountryChange}
                            >
                              <div className="relative">
                                <Combobox.Input
                                  className={`w-full rounded-md border bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm    sm:text-sm ${
                                    errors.CountryError && !selectedCountry
                                      ? "border-red-500"
                                      : "border-gray-400"
                                  }`}
                                  onChange={(event) =>
                                    setQuery(event.target.value)
                                  } // Set the query for filtering
                                  displayValue={(country) =>
                                    country?.CountryName || ""
                                  } // Display selected country name
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </Combobox.Button>

                                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {countries
                                    .filter((country) =>
                                      country.CountryName.toLowerCase().includes(
                                        query.toLowerCase()
                                      )
                                    )
                                    .map((country) => (
                                      <Combobox.Option
                                        key={country.CountryID}
                                        value={country} // Pass the full country object to onChange
                                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                      >
                                        <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                          {country.CountryName}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      </Combobox.Option>
                                    ))}
                                </Combobox.Options>
                              </div>
                            </Combobox>
                          </div>
                        </div>
                        <div className="w-full flex sm:pr-[150px] justify-start sm:justify-center sm:mr-4">
                          {errors.CountryError && !selectedCountry && (
                            <p className="text-red-500 text-sm mt-1 ">
                              {errors.CountryError}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                          <label className="w-1/3 text-xs font-medium text-gray-700">
                            State <span className="text-red-500">*</span>
                          </label>
                          <div className="w-full">
                            <Combobox
                              as="div"
                              value={selectedState}
                              onChange={handleStateChange}
                            >
                              <div className="relative">
                                <Combobox.Input
                                  className={`w-full rounded-md border bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm  sm:text-sm ${
                                    errors.StateError && !selectedState
                                      ? "border-red-500"
                                      : "border-gray-400"
                                  }`}
                                  onChange={(event) =>
                                    setQuery(event.target.value)
                                  } // Handle the search query
                                  displayValue={(state) =>
                                    state?.StateName || ""
                                  } // Show the selected state name
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </Combobox.Button>

                                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {filteredStates.map((state) => (
                                    <Combobox.Option
                                      key={state.StateID}
                                      value={state}
                                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                    >
                                      <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                        {state.StateName}
                                      </span>
                                      <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Combobox.Option>
                                  ))}
                                </Combobox.Options>
                              </div>
                            </Combobox>
                          </div>
                        </div>
                        <div className="w-full flex sm:pr-[168px] justify-start sm:justify-center sm:mr-4">
                          {errors.StateError && !selectedState && (
                            <p className="text-red-500 text-sm mt-1 ">
                              {errors.StateError}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                          <label className="w-1/3 text-xs font-medium text-gray-700">
                            City <span className="text-red-500">*</span>
                          </label>
                          <div className="w-full">
                            <Combobox
                              as="div"
                              value={selectedCity}
                              onChange={handleCityChange}
                            >
                              <div className="relative">
                                <Combobox.Input
                                  className={`w-full rounded-md border bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm   sm:text-sm ${
                                    errors.CityError && !selectedCity
                                      ? "border-red-500"
                                      : "border-gray-400"
                                  }`}
                                  onChange={(event) =>
                                    setQuery(event.target.value)
                                  } // Handle the search query
                                  displayValue={(city) => city?.CityName || ""} // Show the selected city name
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </Combobox.Button>

                                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {filteredCities
                                    .filter((city) =>
                                      city.CityName.toLowerCase().includes(
                                        query.toLowerCase()
                                      )
                                    ) // Filter based on query
                                    .map((city) => (
                                      <Combobox.Option
                                        key={city.CityID}
                                        value={city}
                                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                      >
                                        <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                          {city.CityName}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      </Combobox.Option>
                                    ))}
                                </Combobox.Options>
                              </div>
                            </Combobox>
                          </div>
                        </div>
                        <div className="w-full flex sm:pr-[179px] justify-start sm:justify-center sm:mr-4">
                          {errors.CityError && !selectedCity && (
                            <p className="text-red-500 text-sm mt-1 ">
                              {errors.CityError}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex  sm:items-center gap-4 w-full flex-col sm:flex-row">
                          <label className="w-1/3 text-xs font-medium text-gray-700">
                            Zip Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="ZipCode"
                            value={addressFormData.ZipCode}
                            onChange={handleAddressFormChange}
                            className={`p-1 mt-2 mb-1 w-full border rounded-md ${
                              errors.ZipCodeError && !addressFormData.ZipCode
                                ? "border-red-500"
                                : "border-gray-400"
                            }`}
                          />
                        </div>
                        <div className="w-full flex sm:pr-12 justify-start sm:justify-center sm:mr-4">
                          {errors.ZipCodeError && !addressFormData.ZipCode && (
                            <p className="text-red-500 text-sm mt-1 ">
                              {errors.ZipCodeError}
                            </p>
                          )}
                        </div>
                      </div>

                      <div></div>

                      <div className="mt-6 flex justify-end gap-4">
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-custom-darkblue py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-custom-lightblue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => {
                            handleAddressFormSubmit(customerId);
                          }}
                        >
                          {addressFormData.AddressID ? "Update" : "Save"}{" "}
                          {/* Conditional button text */}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-red-200"
                        >
                          Cancel
                        </button>
                      </div>
                      {isLoading && <LoadingAnimation />}
                    </div>
                    <TableContainer
                      component={Paper}
                      sx={{ width: "90%", margin: "0 auto", mt: 4 }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Address 1</StyledTableCell>
                            <StyledTableCell>Address 2</StyledTableCell>
                            <StyledTableCell>City</StyledTableCell>
                            <StyledTableCell>State</StyledTableCell>
                            <StyledTableCell>Zip Code</StyledTableCell>
                            <StyledTableCell>Actions</StyledTableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {addressTableData && addressTableData.length > 0 ? (
                            addressTableData.map((address, index) => (
                              <TableRow key={index}>
                                <StyledTableCell>
                                  {address.AddressLine1 || ""}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {address.AddressLine2 || ""}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {cityMap[address.CityID] || "N/A"}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {stateMap[address.StateID] || "N/A"}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {address.ZipCode || ""}
                                </StyledTableCell>
                                <StyledTableCell>
                                  <div className="button-container">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEdit(address.AddressID)
                                      }
                                      className="button edit-button"
                                    >
                                      <AiOutlineEdit
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                      />
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDelete(
                                          address.AddressID,
                                          customerId
                                        )
                                      }
                                      className="button delete-button"
                                    >
                                      <MdOutlineCancel
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                      />
                                      Delete
                                    </button>
                                  </div>
                                </StyledTableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <StyledTableCell
                                colSpan={6}
                                style={{ textAlign: "center" }}
                              >
                                No addresses found
                              </StyledTableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
                {/* {activeStep === 2 && <Step2 onBack={handleBack} />} */}
                {activeStep === 2 &&
      (!fromFollowups || selectedFollowUp?.id === 2) && (
        <Step2 onBack={handleBack} />
      )}
                {activeStep === 3 && (
                  <>
                    <TableContainer
                      component={Paper}
                      sx={{ width: "90%", margin: "0 auto", mt: 4 }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Order Name</StyledTableCell>
                            <StyledTableCell>Order Date</StyledTableCell>
                            <StyledTableCell>Total Amount</StyledTableCell>
                            <StyledTableCell>Order Status</StyledTableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {Array.isArray(orders) && orders.length > 0 ? (
                            orders.map((order) => (
                              <StyledTableRow key={order.OrderID}>
                                <StyledTableCell>
                                  {order.OrderNumber}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {new Date(
                                    order.OrderDate
                                  ).toLocaleDateString()}
                                </StyledTableCell>
                                <StyledTableCell>
                                  &#8377;{order.TotalAmount}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {order.OrderStatus}
                                </StyledTableCell>
                              </StyledTableRow>
                            ))
                          ) : (
                            <TableRow>
                              <StyledTableCell
                                colSpan={6}
                                style={{ textAlign: "center" }}
                              >
                                No orders found
                              </StyledTableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Cancel Button aligned to the left */}
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="button-base cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                    {isLoading && <LoadingAnimation />}
                  </>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 2,
                  gap: 2,
                  borderTop: "2px solid #E5E7EB",
                  marginTop: 2,
                }}
              >
                {/* Back Button */}
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{
                    backgroundColor: activeStep === 0 ? "#E5E7EB" : "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "around",
                    // gap: "8px",
                    color: "#374151",
                    padding: "8px",
                    paddingRight: "20px",
                    borderRadius: "8px",
                    border: "1px solid #9ca3af",
                    "&:hover": {
                      backgroundColor: activeStep === 0 ? "#E5E7EB" : "#D1D5DB",
                    },
                    "&:disabled": {
                      backgroundColor: "#F3F4F6",
                      color: "#9CA3AF",
                    },
                  }}
                >
                  <NavigateBeforeIcon />
                  Back
                </Button>

                {/* Next/Exit Button */}
                <Button
                  onClick={
                    activeStep === steps.length - 1 ? handleFinish : handleNext
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "around",
                    // gap: "8px",
                    color: "#374151",
                    padding: "8px",
                    paddingLeft: "20px",
                    borderRadius: "8px",
                    transition: "none",
                    backgroundColor:
                      activeStep === steps.length - 1 ? "#EF4444" : "#3B82F6",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor:
                        activeStep === steps.length - 1 ? "#DC2626" : "#2563EB",
                    },
                    "&:active": {
                      backgroundColor:
                        activeStep === steps.length - 1 ? "#B91C1C" : "#1D4ED8",
                    },
                  }}
                >
                  <span>
                    {activeStep === steps.length - 1 ? "Exit" : "Next"}
                  </span>
                  {activeStep === steps.length - 1 ? (
                    <CloseIcon />
                  ) : (
                    <NavigateNextIcon />
                  )}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </div>
    </>
  );
}

export default AddCustomers;
