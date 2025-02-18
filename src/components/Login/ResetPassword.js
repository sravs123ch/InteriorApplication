import { useState, useEffect } from "react";
import Logo from "../../assests/Images/imly-logo-new.jpg";
import image from "../../assests/Images/imly-two.png";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useLocation, useNavigate } from "react-router-dom";
import { ResetPassword } from "../../Constants/apiRoutes";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import { toast, ToastContainer } from "react-toastify";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";

const Login = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  // const email = location.state?.email || "";
  // Set the email state from location.state or an empty string
  const [email, setEmail] = useState(location.state?.email || "");

  useEffect(() => {
    // If the email is updated in location.state, you can update the state here if needed
    setEmail(location.state?.email || "");
  }, [location.state?.email]);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = async () => {
    // Form validation
    if (!newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    } else if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    } else if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError(""); // Reset password error

    // Set loading state before API call
    setIsLoading(true);

    try {
      const response = await axios.post(ResetPassword, {
        Email: email,
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword,
      });

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.StatusCode === "SUCCESS"
      ) {
        // Show success toast
        toast.success("Password reset successfully!", {
          position: "top-right",
          autoClose: 3000, // 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        navigate("/"); // Navigate to login page
      } else {
        setPasswordError("Failed to reset password. Try again.");

        // Show error toast for API failure
        toast.error("Failed to reset password. Try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setPasswordError("Something went wrong. Please try again.");

      // Show error toast for catch block (API error)
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
      {/* Main Section */}
      <div className="flex min-h-full p-0 m-0 flex-1 bg-gray-100">
        <ToastContainer />
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-28 h-[100vh]">
          <div className="mx-auto w-full max-w-sm lg:w-[350px] xl:w-[450px] rounded-md p-6 shadow-sm bg-white">
            {/* Logo */}
            <div className="flex justify-center rounded-md mb-8">
              <img
                alt="Your Company"
                src={Logo}
                className="h-20 w-auto rounded-lg ml-6"
              />
            </div>

            {/* Reset Password Form */}
            <div>
              <h4 className="text-xl font-bold leading-9 tracking-tight text-[#632e0f] text-center">
                Reset Your Password
              </h4>
            </div>

            <div className="mt-10">
              {/* <form className="space-y-6"> */}
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault(); // Prevents the default form submission
                  handleResetPassword(); // Call the API function
                }}
              >
                <div>
                  <div className="mt-2 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email"
                      required
                      value={email} // Display the email value
                      onChange={(e) => setEmail(e.target.value)} // This updates the internal email state if editable
                      readOnly // Make the input field non-editable
                      className="p-2 pl-12 w-full border-2 border-gray-300 bg-gray-100 shadow-sm hover:border-[#301607] focus:border-[#c95d1e] outline-none rounded-md"
                    />
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#301607] pointer-events-none">
                      <PersonIcon fontSize="small" />
                    </span>
                  </div>
                </div>

                {/* New Password Input */}
                <div className="mt-2 relative">
                  <input
                    id="new-password"
                    name="new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="p-2 pl-12 w-full border-2 border-gray-300 bg-gray-100 shadow-sm hover:border-[#301607] focus:border-[#c95d1e] outline-none rounded-md"
                  />
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#301607] pointer-events-none">
                    <LockIcon fontSize="small" />
                  </span>
                </div>

                {/* Confirm New Password Input */}
                <div className="mt-2 relative">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-2 pl-12 w-full border-2 border-gray-300 bg-gray-100 shadow-sm hover:border-[#301607] focus:border-[#c95d1e] outline-none rounded-md"
                  />
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#301607] pointer-events-none">
                    <LockIcon fontSize="small" />
                  </span>
                </div>

                {passwordError && (
                  <p className="mt-2 text-sm text-red-500 text-start">
                    {passwordError}
                  </p>
                )}

                <div className="flex justify-center mt-8">
                  <button
                    className="button-login-colour w-full mt-6 mb-10 justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm"

                    // onClick={handleResetPassword}
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative hidden w-0 flex-1 lg:block h-screen">
          <img
            alt=""
            src={image}
            className="absolute inset-0 h-full w-full object-cover shadow-sm"
          />
        </div>
      </div>
      {isLoading && <LoadingAnimation />}
    </>
  );
};

export default Login;
