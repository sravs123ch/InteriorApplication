import { useState, useEffect } from "react";
import Logo from "../../assests/Images/imly-logo-new.jpg";
import image from "../../assests/Images/imly-two.png";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { ForgotPassword, VerifyOTP } from "../../Constants/apiRoutes";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 OTP boxes
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Handle OTP input changes
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSendOtp = async () => {
    // Start loading
    setIsLoading(true);

    // Validate the email
    if (!email) {
      setError("Please enter your email");
      setIsLoading(false); // Ensure loading is stopped if validation fails
      return;
    }

    // Reset any previous error messages
    setError("");

    try {
      // Make the API call to send OTP
      const response = await axios.post(ForgotPassword, { Email: email });

      if (response.status === 200 || response.status === 201) {
        console.log("OTP sent successfully", response);
        setIsLoading(true);
        // Show success toast
        toast.success("OTP sent successfully!", {
          position: "top-right",
          autoClose: 3000, // 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Show the OTP modal and start countdown timer
        setShowOtpModal(true);
        setTimer(300); // Start countdown
      } else {
        // Handle unexpected status codes
        toast.error("Unexpected response. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      console.error("Error sending OTP:", err);

      // Show error toast
      toast.error("Failed to send OTP. Please try again later.", {
        position: "top-right",
        autoClose: 3000, // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const enteredOtp = otp.join(""); // Combine OTP digits
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }
    setOtpError("");

    try {
      const response = await axios.post(VerifyOTP, {
        Email: email,
        OTP: enteredOtp,
      });

      console.log("OTP Response:", response); // Log response for debugging

      if (response.status === 200 || response.status === 201) {
        console.log("OTP verified successfully", response);

        // Show success toast
        toast.success("OTP verified successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Navigate to reset password page
        navigate("/reset-password", { state: { email: email } });
      } else {
        setOtpError("Invalid OTP. Please try again.");

        // Show error toast
        toast.error("Invalid OTP. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setOtpError("Invalid OTP. Please try again.");

      // Show error toast for API error
      toast.error("Failed to verify OTP. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendOtp = () => {
    setTimer(300);
    handleSendOtp();
  };

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <>
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

            {/* Login Form */}
            <div>
              <h4 className="text-xl font-bold leading-9 tracking-tight text-[#632e0f] text-center">
                Forgot Your Password?
              </h4>
            </div>

            <div className="mt-10">
              <form className="space-y-6">
                {/* Email Input */}
                <div>
                  <div className="mt-2 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="p-2 pl-12 w-full border-2 border-gray-300 bg-gray-100 shadow-sm hover:border-[#301607] focus:border-[#c95d1e] outline-none rounded-md"
                    />
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#301607] pointer-events-none">
                      <PersonIcon fontSize="small" />
                    </span>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-500 text-start">
                      {error}
                    </p>
                  )}
                </div>

                {/* Send OTP Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="button-login-colour w-full mt-6 mb-10 justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm"
                  >
                    Send OTP
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

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowOtpModal(false)}
            >
              <CloseIcon />
            </button>

            <h3 className="text-lg font-semibold text-center mb-4 text-[#632e0f] mt-6">
              OTP has been sent to
              <div className="text-gray-600 mt-1 mb-8">{email}</div>
            </h3>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  className="w-10 h-10 text-center border-2 border-gray-300 rounded-md text-lg focus:outline-none focus:border-[#c95d1e]"
                />
              ))}
            </div>

            {/* Timer and Resend OTP */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                Time left:{" "}
                <span className="font-semibold">
                  {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                </span>
              </span>

              <button
                className={`text-sm font-semibold ${
                  timer === 0
                    ? "text-[#c95d1e] hover:underline"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                onClick={handleResendOtp}
                disabled={timer > 0}
              >
                Resend OTP
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                className="button-login-colour w-3/4 rounded-md px-4 py-2 text-sm font-semibold"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
          {isLoading && <LoadingAnimation />}
        </div>
      )}
    </>
  );
};

export default Login;
