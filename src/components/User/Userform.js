import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  CREATEORUPDATE_USERS_API,
  GETALLROLESS_API,
  GETALLUSERSBYID_API,
} from "../../Constants/apiRoutes";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import { DataContext } from "../../Context/DataContext";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const genderOptions = [
  { id: "M", name: "Male" },
  { id: "F", name: "Female" },
];

function Userform() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails, setUserDeatails } = useContext(UserContext);

  // const isEditMode = Boolean(
  //   location.state?.userDetails?.user || userDetails?.user
  // );

  const [formData, setFormData] = useState(
    location.state?.userDetails || {
      // TenantID: 1,
      FirstName: "",
      LastName: "",
      Email: "",
      Password: "",
      PhoneNumber: "",
      Gender: "",
      RoleID: "",
      AddressLine1: "",
      AddressLine2: "",
      CityID: "",
      StateID: "",
      CountryID: "",
      ZipCode: "",
      ProfileImage: null,
      Comments: "",
      StoreID: "",
    }
  );
  const [roles, setRoles] = useState([]);
  const [countryMap, setCountryMap] = useState({});
  const [StoreMap, setStoreMap] = useState({});
  const [stateMap, setStateMap] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [cityMap, setCityMap] = useState({});

  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  const { citiesData, statesData, countriesData } = useContext(DataContext);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    if (countriesData && statesData && citiesData) {
      setCountries(countriesData.data || []);
      setStates(statesData.data || []);
      setCities(citiesData.data || []);
    }
  }, [countriesData, statesData, citiesData]);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(GETALLROLESS_API);
      const data = await response.json();
      if (data.StatusCode === "SUCCESS") {
        setRoles(data.roles);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (storesData) {
      setStores(storesData || []);
    }
  }, [storesData]);

  // const isEditMode = Boolean(
  //   location.state?.userDetails?.user || userDetails?.user
  // );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        ProfileImage: file,
      });
    }
  };

  const [selectedGender, setSelectedGender] = useState(formData.Gender || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setFormData({
      ...formData,
      Gender: gender.id,
    });
  };

  const [selectedRole, setSelectedRole] = useState(formData.RoleID || "");

  // const handleRoleChange = (role) => {
  //   setSelectedRole(role);
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     RoleID: role.id,
  //   }));
  // };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateUserData();
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
      return; // Exit function if validation fails
    }

    try {
      const isEditMode = Boolean(formData.UserID);

      setIsLoading(true); // Show loading animation
      const formDataToSend = new FormData();
      if (!isEditMode) {
        formDataToSend.append("TenantID", 1);
      }
      Object.keys(formData).forEach((key) => {
        if (key === "ProfileImage" && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Log each key-value pair

      const apiUrl = CREATEORUPDATE_USERS_API; // API URL

      const method = isEditMode ? "post" : "post"; // Choose method based on whether it's an edit or create

      const response = await axios({
        method,
        url: apiUrl,
        data: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check the response status code and message
      if (response.data.StatusCode === "SUCCESS") {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/user");
        }, 5500); // Delay before navigation
      } else {
        // Handle other cases like errors or unexpected statuses
        toast.error(response.data.message || "An unexpected error occurred."); // Display backend message
      }
    } catch (error) {
      console.error("User  submission failed:", error);

      if (error.response) {
        const errorMessage =
          error.response.data.message || "An error occurred.";

        // if (error.response.data.StatusCode === "ERROR" && errorMessage) {
        //   toast.error(errorMessage); // Display specific error message from backend
        // } else {
        //   toast.error(
        //     `Failed to ${
        //       isEditMode ? "update" : "create"
        //     } user: ${errorMessage}`
        //   );
        // }
      } else if (error.request) {
        toast.error("No response received from server.");
      } else {
        console.error("Error in setting up request:", error.message);
        toast.error("Error: " + error.message);
      }
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  const handleCancel = () => {
    setIsLoading(true);

    // Add a small delay before navigating to show the loader
    setTimeout(() => {
      navigate("/user");
    }, 1500); // Delay by 500ms
  };

  const handleStoreChange = (selectedStore) => {
    if (!selectedStore) return;

    setSelectedStore(selectedStore);
    setFormData({
      ...formData,
      StoreID: selectedStore.StoreID, // Use StoreID directly from the store object
      StoreName: selectedStore.StoreName,
    });
  };

  const handleCountryChange = (selectedCountry) => {
    if (!selectedCountry) return;

    const countryID =
      countryMap[selectedCountry.CountryName] || selectedCountry.CountryID;

    setSelectedCountry(selectedCountry);
    setFormData({
      ...formData,
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
    setFormData({
      ...formData,
      StateID: stateID,
      StateName: state.StateName,
    });
    setFilteredCities(cities.filter((city) => city.StateID === state.StateID));
  };

  const handleCityChange = (city) => {
    if (!city) return;

    const cityID = cityMap[city.CityName] || city.CityID;

    setSelectedCity(city);
    setFormData({
      ...formData,
      CityID: cityID,
      CityName: city.CityName,
    });
  };

  const [dependenciesLoaded, setDependenciesLoaded] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
 
 // Initialize state based on localStorage value
   const [isExpanded, setIsExpanded] = useState(() => {
    const storedCollapsed = localStorage.getItem('navbar-collapsed');
    return storedCollapsed !== 'true'; // Default to expanded if not set
  });

  // Update state when localStorage value changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedCollapsed = localStorage.getItem('navbar-collapsed');
      setIsExpanded(storedCollapsed !== 'true'); // Set expanded if 'navbar-collapsed' is not 'true'
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  // Check if all dependencies (countries, states, cities, stores) are loaded
  useEffect(() => {
    if (
      countries?.length &&
      states?.length &&
      cities?.length &&
      stores?.length &&
      !dependenciesLoaded
    ) {
      setDependenciesLoaded(true); // Set to true only when all dependencies are available
    }
  }, [countries, states, cities, stores]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId === "new") {
        setFormData({});
        setUserDataLoaded(true);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage.");
          setError("Authentication token is missing.");
          return;
        }

        const response = await axios.get(`${GETALLUSERSBYID_API}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const fetchedUserData = response.data.user;

        if (!fetchedUserData) {
          setError("User not found.");
          return;
        }

        // Ensure dropdown selections are mapped correctly
        const selectedCountry = countries.find(
          (country) => country.CountryName === fetchedUserData.CountryName
        );
        const selectedState = states.find(
          (state) => state.StateName === fetchedUserData.StateName
        );
        const selectedCity = cities.find(
          (city) => city.CityName === fetchedUserData.CityName
        );
        const selectedGender = genderOptions.find(
          (g) => g.id === fetchedUserData.Gender
        );
        const selectedStore = stores.find(
          (store) => store.StoreID === fetchedUserData.StoreID
        );

        // Set form data and dropdown selections
        setFormData({
          ...fetchedUserData,
          CountryID: selectedCountry?.CountryID || null,
          StateID: selectedState?.StateID || null,
          CityID: selectedCity?.CityID || null,
          Gender: selectedGender?.id || null,
          StoreID: selectedStore?.StoreID || null,
        });

        // const selectedRole = roles.find(role => role.RoleID === fetchedUser=Data.RoleID);
        // setSelectedRole(selectedRole || null);

        setSelectedCountry(selectedCountry);
        setSelectedState(selectedState);
        setSelectedCity(selectedCity);
        setSelectedGender(selectedGender);
        setSelectedStore(selectedStore);
        setUserDataLoaded(true);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to fetch user details.");
      } finally {
        setIsLoading(false);
      }
    };

    // Trigger fetch only if dependencies are loaded and userId is not new
    if (dependenciesLoaded && !userDataLoaded) {
      fetchUserDetails();
    }
  }, [userId, dependenciesLoaded, userDataLoaded]);

  useEffect(() => {
    if (formData.RoleID && roles.length > 0) {
      const role = roles.find((r) => r.RoleID === formData.RoleID);
      if (role) {
        setSelectedRole(role);
      }
    }
  }, [formData.RoleID, roles]);

  // Wait for both user data and dependencies to load before rendering form
  if (!dependenciesLoaded || !userDataLoaded) {
    return <div>Loading...</div>;
  }

  // Validation
  const validateUserData = () => {
    const newErrors = {};
    if (!formData.StoreName) {
      newErrors.StoreNameError = "Store Name is required.";
    }

    if (!formData.RoleID) {
      newErrors.RoleIdError = "Role is required.";
    }
    if (!formData.FirstName) {
      newErrors.FirstNameError = "First Name is required.";
    }
    if (!formData.AddressLine1) {
      newErrors.AddressLine1Error = "Address Line 1 is required.";
    }
    // if (!formData.LastName) {
    //   newErrors.LastNameError = "Last Name is required.";
    // }
    // if (!formData.Email) {
    //   newErrors.EmailError = "Email is required.";
    // }
    if (!formData.Email) {
      newErrors.EmailError = "Email is required.";
    } 
    else {
      // Additional check to ensure email ends with @gmail.com
      if (!formData.Email.includes("@")) return "Email must include '@'.";
      if (!formData.Email.endsWith(".com")) {
        newErrors.EmailError = "Email must end with '.com'.";
      }
    }
    if (!formData.CountryID) {
      newErrors.CountryIdError = "Country is required.";
    }
    if (!formData.Password) {
      newErrors.PasswordError = "Password is required.";
    }
    if (!formData.StateID) {
      newErrors.StateIdError = "State is required.";
    }
    if (!formData.PhoneNumber) {
      newErrors.PhoneNumberError = "Phone Number is required.";
    }
    if (!formData.CityID) {
      newErrors.CityIdError = "City is required.";
    }
    if (!formData.ZipCode) {
      newErrors.ZipCodeError = "Zip Code is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length > 0;
  };

  const handleRoleChange = (selectedRole) => {
    setSelectedRole(selectedRole);
    setFormData((prevFormData) => ({
      ...prevFormData,
      RoleID: selectedRole?.RoleID || "",
    }));
    setQuery(""); // Reset the search query after selection
  };

  return (
    // <div className="main-container">
      <div
    className={`main-container ${isExpanded ? 'expanded' : 'collapsed'}`}
  >
      <ToastContainer />
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
          <LoadingAnimation />
        </div>
      )}
      <div className="body-container">
        <form className="w-full " onSubmit={handleFormSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="heading mb-4 px-24">Users</h2>
          </div>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 px-16 md:px-24">
            <div className="w-full xl:w-3/4">
              <label
                htmlFor="storeName"
                className="block text-sm font-medium text-gray-700"
              >
                Store Name <span className="text-red-500">*</span>
              </label>
              <Combobox value={selectedStore} onChange={handleStoreChange}>
                <div className="relative mt-1">
                  <Combobox.Input
                    id="storeName"
                    className={`block w-full rounded-md border  py-2 px-4 shadow-sm  sm:text-sm mt-2 mb-1 ${
                      !formData.StoreName && errors.StoreNameError
                        ? "border-red-400"
                        : "border-gray-400"
                    }`}
                    displayValue={(store) => store?.StoreName || ""}
                    placeholder="Select Store"
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                        value={store} // Pass the entire store object
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-semibold" : "font-normal"
                              }`}
                            >
                              {store.StoreName}
                            </span>
                            {selected && (
                              <span
                                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                  active ? "text-white" : "text-indigo-600"
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
              {!formData.StoreName && errors.StoreNameError && (
                <p className="text-red-500 text-sm mt-1 ">
                  {errors.StoreNameError}
                </p>
              )}
            </div>

            <div className="w-full xl:w-3/4">
              <label
                htmlFor="RoleID"
                className="block text-sm font-medium text-gray-700"
              >
                Role Name <span className="text-red-500">*</span>
              </label>
              <Combobox
                as="div"
                value={selectedRole}
                onChange={handleRoleChange}
              >
                <div className="relative">
                  <Combobox.Input
                    id="RoleID"
                    name="RoleID"
                    className={`block w-full rounded-md border  py-2 px-4 shadow-sm  sm:text-sm mt-2 mb-1 ${
                      !formData.RoleID && errors.RoleIdError ? "border-red-400" : "border-gray-400"
                    }`}
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(role) => role?.RoleName || ""}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>

                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
                    {roles
                      .filter((role) =>
                        role.RoleName.toLowerCase().includes(
                          query.toLowerCase()
                        )
                      )
                      .map((role) => (
                        <Combobox.Option
                          key={role.RoleID}
                          value={role}
                          className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                        >
                          <span className="block truncate font-normal group-data-[selected]:font-semibold">
                            {role.RoleName}
                          </span>
                          <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        </Combobox.Option>
                      ))}
                  </Combobox.Options>
                </div>
              </Combobox>
              {!formData.RoleID && errors.StoreNameError && (
                <p className="text-red-500 text-sm mt-1 ">
                  {errors.RoleIdError}
                </p>
              )}
            </div>

            {/* First Name */}
            <div className="flex items-center">
              <div className="w-full ">
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="FirstName"
                  name="FirstName"
                  value={formData.FirstName || ""}
                  onChange={handleFormChange}
                  required
                  className={`mt-2 mb-1 block w-full xl:w-3/4 rounded-md border  shadow-sm py-2 px-4  sm:text-sm ${
                    !formData.FirstName && errors.FirstNameError ? "border-red-400" : "border-gray-400"
                  }`}
                />
                {!formData.FirstName && errors.FirstNameError && (
                  <p className="text-red-500 text-sm mt-1 ">
                    {errors.FirstNameError}
                  </p>
                )}
              </div>
            </div>
            {/* Address Line 1 */}
            <div className="flex items-center">
              <div className="w-full ">
                <label
                  htmlFor="AddressLine1"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="AddressLine1"
                  name="AddressLine1"
                  value={formData.AddressLine1 || ""}
                  onChange={handleFormChange}
                  required
                  className={`mt-2 mb-1 block w-full xl:w-3/4 rounded-md border shadow-sm py-2 px-4  sm:text-sm"
                  ${!formData.AddressLine1 &&
                    errors.AddressLine1Error
                      ? "border-red-400"
                      : "border-gray-400"
                  }`}
                />
                {!formData.AddressLine1 && errors.AddressLine1Error && (
                  <p className="text-red-500 text-sm mt-1 ">
                    {errors.AddressLine1Error}
                  </p>
                )}
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="LastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="LastName"
                name="LastName"
                value={formData.LastName || ""}
                onChange={handleFormChange}
                required
             
                className={`mt-2 mb-1 block w-full xl:w-3/4 rounded-md border shadow-sm py-2 px-4  sm:text-sm border-gray-400
                `}
              />
              {/* {errors.LastNameError && (
                <p className="text-red-500 text-sm mt-1 ">
                  {errors.LastNameError}
                </p>
              )} */}
            </div>

            {/* Address Line 2 */}
            <div>
              <label
                htmlFor="AddressLine2"
                className="block text-sm font-medium text-gray-700"
              >
                Address Line 2
              </label>
              <input
                type="text"
                id="AddressLine2"
                name="AddressLine2"
                value={formData.AddressLine2 || ""}
                onChange={handleFormChange}
                className="mt-2 mb-1 block w-full xl:w-3/4 rounded-md border border-gray-400 shadow-sm py-2 px-4 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

             <div>
    <label
      htmlFor="Email"
      className="block text-sm font-medium text-gray-700"
    >
      Email <span className="text-red-500">*</span>
    </label>
    <input
      type="email"
      id="Email"
      name="Email"
      value={formData.Email || ""}
      onChange={handleFormChange}
      required
      className={`mt-2 mb-1 block w-full xl:w-3/4 rounded-md border shadow-sm py-2 px-4 sm:text-sm ${
        errors.EmailError ? "border-red-400" : "border-gray-400"
      }`}
    />
    {errors.EmailError && (
      <p className="text-red-500 text-sm mt-1">
        {errors.EmailError}
      </p>
    )}
  </div>

            <div className="flex items-center gap-4">
              <div className="w-full xl:w-3/4 ">
                <label
                  htmlFor="Country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country <span className="text-red-500">*</span>
                </label>
                <Combobox
                  as="div"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                >
                  <div className="relative">
                    <Combobox.Input
                      id="Country"
                      name="Country"
                      className={`block w-full rounded-md border  py-2 px-4 shadow-sm  sm:text-sm mt-2 mb-1 ${!formData.CountryID &&
                        errors.CountryIdError
                          ? "border-red-400"
                          : "border-gray-400"
                      }`}
                      onChange={(event) => setQuery(event.target.value)} // Set the query for filtering
                      displayValue={(country) => country?.CountryName || ""} // Display selected country name
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>

                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full xl:w-3/4 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                {!formData.CountryID && errors.CountryIdError && (
                  <p className="text-red-500 text-sm mt-1 ">
                    {errors.CountryIdError}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className=" xl:w-3/4">
              <label
                htmlFor="Password"
                className="block text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="Password"
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.Password || ""}
                  onChange={handleFormChange}
                  className={`mt-2 mb-1 block w-full  rounded-md border shadow-sm py-2 px-4  sm:text-sm ${ !formData.Password && 
                    errors.PasswordError ? "border-red-400" : "border-gray-400"
                  }`}
                />
                <span
                  className="absolute right-2 top-1/2 pb-1 transform -translate-y-1/2 cursor-pointer "
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <VisibilityOffIcon
                      fontSize="small"
                      className="opacity-75"
                    />
                  ) : (
                    <VisibilityIcon fontSize="small" className="opacity-75" />
                  )}
                </span>
              </div>
              {!formData.Password && errors.PasswordError && (
                <p className="text-red-500 text-sm mt-1 ">
                  {errors.PasswordError}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-full xl:w-3/4 ">
                <label
                  htmlFor="State"
                  className="block text-sm font-medium text-gray-700"
                >
                  State <span className="text-red-500">*</span>
                </label>
                <Combobox
                  as="div"
                  value={selectedState}
                  onChange={handleStateChange}
                >
                  <div className="relative">
                    <Combobox.Input
                      id="State"
                      name="State"
                      className={`block w-full rounded-md border  py-2 px-4 shadow-sm  sm:text-sm mt-2 mb-1 ${ !formData.StateID &&
                        errors.StateIdError
                          ? "border-red-400"
                          : "border-gray-400"
                      }`}
                      onChange={(event) => setQuery(event.target.value)} // Handle the search query
                      displayValue={(state) => state?.StateName || ""} // Show the selected state name
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>

                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full xl:w-3/4 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </div>
                </Combobox>
                {!formData.StateID && errors.StateIdError && (
                  <p className="text-red-500 text-sm mt-1 ">
                    {errors.StateIdError}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="PhoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="PhoneNumber"
                name="PhoneNumber"
                value={formData.PhoneNumber || ""}
                onChange={handleFormChange}
                required
                className={`mt-2 mb-1 block w-full xl:w-3/4 rounded-md border  shadow-sm py-2 px-4  sm:text-sm ${ !formData.PhoneNumber &&
                  errors.PhoneNumberError ? "border-red-400" : "border-gray-400"
                }`}
              />
              {!formData.PhoneNumber && errors.PhoneNumberError && (
                <p className="text-red-500 text-sm mt-1 ">
                  {errors.PhoneNumberError}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-full xl:w-3/4 ">
                <label
                  htmlFor="City"
                  className="block text-sm font-medium text-gray-700"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <Combobox
                  as="div"
                  value={selectedCity}
                  onChange={handleCityChange}
                >
                  <div className="relative">
                    <Combobox.Input
                      id="City"
                      name="City"
                      className={`block w-full rounded-md border  py-2 px-4 shadow-sm  sm:text-sm mt-2 mb-1 ${
                        !formData.CityID && errors.CityIdError
                          ? "border-red-400"
                          : "border-gray-400"
                      }`}
                      onChange={(event) => setQuery(event.target.value)} // Handle the search query
                      displayValue={(city) => city?.CityName || ""} // Show the selected city name
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>

                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full xl:w-3/4 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                {!formData.CityID && errors.CityIdError && (
                  <p className="text-red-500 text-sm mt-1 ">
                    {errors.CityIdError}
                  </p>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="w-full xl:w-3/4">
              <label
                htmlFor="Gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <Combobox
                value={selectedGender}
                onChange={handleGenderChange}
                as="div"
              >
                <div className="relative mt-1">
                  <Combobox.Input
                    className="block w-full rounded-md border border-gray-400 shadow-sm py-2 px-4 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    displayValue={(gender) => gender?.name || ""}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full xl:w-3/4 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {genderOptions.map((gender) => (
                      <Combobox.Option
                        key={gender.id}
                        value={gender}
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
                                selected ? "font-semibold" : "font-normal"
                              }`}
                            >
                              {gender.name}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                  active ? "text-white" : "text-indigo-600"
                                }`}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
              </Combobox>
            </div>

            <div>
              <label
                htmlFor="ZipCode"
                className="block text-sm font-medium text-gray-700"
              >
                Zip Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ZipCode"
                name="ZipCode"
                value={formData.ZipCode || ""}
                onChange={handleFormChange}
                required
                className={`mt-2 mb-1 block w-full xl:w-3/4 rounded-md border shadow-sm py-2 px-4  sm:text-sm ${!formData.ZipCode && 
                  errors.ZipCodeError ? "border-red-400" : "border-gray-400"
                }`}
              />
              {!formData.ZipCode && errors.ZipCodeError && (
                <p className="text-red-500 text-sm mt-1 ">
                  {errors.ZipCodeError}
                </p>
              )}
            </div>

            {/* Profile Image */}
            <div>
              <label
                htmlFor="ProfileImage"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Image
              </label>
              <input
                type="file"
                id="ProfileImage"
                name="ProfileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 mb-1 block w-full xl:w-3/4 rounded-md border border-gray-400 shadow-sm py-2 px-4 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            {/* Comments */}
            <div className="sm:col-span-1">
              <label
                htmlFor="Comments"
                className="block text-sm font-medium text-gray-700"
              >
                Comments
              </label>
              <textarea
                id="Comments"
                name="Comments"
                value={formData.Comments || ""}
                onChange={handleFormChange}
                rows={1}
                className="mt-2 mb-1 block w-full xl:w-3/4 rounded-md border border-gray-400 shadow-sm py-2 px-4 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="submit"
              className="button-base save-btn"
              onClick={handleFormSubmit}
            >
              {userId !== "new" ? "Update User" : "Create User"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="button-base cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      
      </div>
    </div>
  );
}
export default Userform;
