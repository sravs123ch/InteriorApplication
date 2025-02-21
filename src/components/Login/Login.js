import { useState} from "react";
import Logo from "../../assests/Images/imly-logo-new.jpg";
import image from "../../assests/Images/imly-two.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { jwtDecode } from "jwt-decode";
import {
  CITIES_API,
  COUNTRIES_API,
  GETALLSTORES_API,
  LOGIN,
  STATES_API,
 
} from "../../Constants/apiRoutes";

import LoadingAnimation from "../Loading/LoadingAnimation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [isStoreDataLoading, setIsStoreDataLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  // Fetch data from the APIs if not present in local storage
  const fetchApiData = async () => {
    const storedCitiesData = localStorage.getItem("citiesData");
    const storedStatesData = localStorage.getItem("statesData");
    const storedCountriesData = localStorage.getItem("countriesData");

    if (!storedCitiesData || !storedStatesData || !storedCountriesData) {
      try {
        const resCities = storedCitiesData
          ? JSON.parse(storedCitiesData)
          : await fetch(CITIES_API).then((res) => res.json());
        const resStates = storedStatesData
          ? JSON.parse(storedStatesData)
          : await fetch(STATES_API).then((res) => res.json());
        const resCountries = storedCountriesData
          ? JSON.parse(storedCountriesData)
          : await fetch(COUNTRIES_API).then((res) => res.json());

        // Store in localStorage
        localStorage.setItem("citiesData", JSON.stringify(resCities));
        localStorage.setItem("statesData", JSON.stringify(resStates));
        localStorage.setItem("countriesData", JSON.stringify(resCountries));
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    }
  };
  const fetchAndStoreStoresData = async () => {
    setIsStoreDataLoading(true);

    // Retrieve userID from local storage
    const userID = localStorage.getItem("UserID");

    if (!userID) {
      console.error("UserID not found in local storage");
      setIsStoreDataLoading(false);
      return [];
    }

    const params = {
      pageNumber: 1,
      pageSize: 1000,
    };

    try {
      const storeResponse = await fetch(
        `${GETALLSTORES_API}?UserID=${userID}&${new URLSearchParams(
          params
        ).toString()}`
      );
      const storesData = await storeResponse.json();
      const stores = storesData.Stores || [];
      localStorage.setItem("storesData", JSON.stringify(stores));

      // Dispatch an event to notify that store data is ready
      window.dispatchEvent(new Event("storeDataReady"));

      return stores;
    } catch (error) {
      console.error("Error fetching store data:", error);
      return [];
    } finally {
      setIsStoreDataLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: userName, Password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;

        const decodedToken = jwtDecode(token);
        const roleID = decodedToken.RoleID;
        const userID = decodedToken.UserID;
        const TenantID=decodedToken.TenantID;

        localStorage.setItem("UserID", userID);
        localStorage.setItem("TenantID", TenantID);

        console.log("login UserID", userID);
        console.log("login TenantID", TenantID);
        login(token, roleID, userID);

        // Wait for both data fetching operations to complete
        await Promise.all([
          fetchApiData(),
          fetchAndStoreStoresData(),
          // fetchUserDetails(),
        ]);

        // Now that all data is loaded, navigate to the dashboard
        // navigate("/dashboard");
          // Add a 5-second delay before navigation
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000); // 5 seconds delay
      } else {
        console.error("Login failed:", data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 10000); // 5 seconds delay
    }
    
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleForgotPassword = () => {
    setIsLoading(true); // Start loading
    setTimeout(() => {
      navigate("/forgot-password"); // Navigate after a delay
      setIsLoading(false); // Stop loading after navigation
    }, 500); // Simulate a small loading delay (500ms)
  };

  return (
    <>
      <div className="flex min-h-full p-0 m-0 flex-1 bg-gray-100">
        {(isLoading || isStoreDataLoading) && <LoadingAnimation />}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-28 h-[100vh]">
          <div className="mx-auto w-full max-w-sm lg:w-[350px] xl:w-[450px] rounded-md p-6 shadow-sm bg-white">
            <div className="flex justify-center rounded-md mb-8 ">
              <img
                alt="Your Company"
                src={Logo}
                className="h-20 w-auto x rounded-lg ml-6"
              />
            </div>
            <div>
              <div className="flex justify-center items-center h-8">
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-[#632e0f] items-center">
                  Login
                </h2>
              </div>
            </div>

            <div className="mt-10">
              <div>
                <form className="space-y-6">
                  <div>
                    <div className="mt-2 relative">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        placeholder="Email"
                        onChange={(e) => setUserName(e.target.value)}
                        className=" p-2 pl-12 w-full border-2 border-gray-300 bg-gray-100 shadow-sm hover:border-[#301607] focus:border-[#c95d1e] outline-none rounded-md border-w"
                      />
                      <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#301607] pointer-events-none">
                        <PersonIcon fontSize="small" />
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="mt-2 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className=" p-2 pl-12 w-full border-2 border-gray-300 bg-gray-100 shadow-sm hover:border-[#301607]  focus:border-[#c95d1e] outline-none rounded-md transition"
                      />
                      <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#301607] pointer-events-none">
                        <LockIcon fontSize="small" />
                      </span>
                      <span
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#301607]"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon
                            fontSize="small"
                            className="opacity-85"
                          />
                        ) : (
                          <VisibilityIcon
                            fontSize="small"
                            className="opacity-85"
                          />
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    {/* Remember Me */}
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>

                    <div>
                      <a
                        href="/forgot-password"
                        onClick={handleForgotPassword}
                        className="text-sm text-gray-700 hover:underline focus:outline-none focus:underline focus:text-[#301607] px-2"
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-center mb-4">
                      <button
                        type="submit"
                        className="button-login-colour flex w-full  justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={(e) => handleLogin(e)}
                        // Disable the button when loading
                      >
                        {isLoading || isStoreDataLoading
                          ? "Please wait..."
                          : "Sign in"}
                      </button>
                    </div>
                    <span className="flex justify-center">
                      {error && <p className="p-2 text-red-500">{error}</p>}
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block h-screen ">
          <img
            alt=""
            src={image}
            className="absolute inset-0 h-full w-full object-cover shadow-sm"
          />
        </div>
      </div>
    </>
  );
};

export default Login;
