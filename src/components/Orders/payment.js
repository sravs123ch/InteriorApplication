import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import StatusBadge from "./Statuses";
// Import StatusBadge component if it's a separate file
import { useNavigate } from "react-router-dom";
import {
  CREATEORUPDATE_PAYMENT_API,
  GET_PAYMENTSBY_ORDERID_API,
} from "../../Constants/apiRoutes";
import { IdContext } from "../../Context/IdContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { StyledTableCell } from "../CustomTablePagination";

import CashIcon from "../../assests/Images/Payments/note.png";
import CreditCardIcon from "../../assests/Images/Payments/credit-card.svg";
import UpiIcon from "../../assests/Images/Payments/UPI-Color.svg";
import DebitCardIcon from "../../assests/Images/Payments/debit-card.svg";
import PaypalIcon from "../../assests/Images/Payments/paypal.svg";
import AmazonPayIcon from "../../assests/Images/Payments/amazon-pay.svg";
import LoadingAnimation from "../Loading/LoadingAnimation";

const Payment = ({ orderId }) => {
  const { generatedId, orderDate,storeId,BalanceAmount} = useContext(IdContext);
  const [orderDetails, setOrderDetails] = useState({
    PaymentMethod: "",
    MaskedCardNumber: "",
    PaymentComments: "",
    Amount: "",
    StoreID:storeId ||"",
  });
  const { customerId} = useContext(IdContext);
  const [errors, setErrors] = useState({});
  const [orders1, setOrders1] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [file, setFile] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // Initialize editMode to false


  const savePayment = () => {
    // Validation messages
    const validatePaymentData = () => {
      const newErrors = {};
      if (!orderDetails.PaymentMethod) {
        newErrors.PaymentMethodError = "Payment method is required.";
      }
      if (!orderDetails.MaskedCardNumber) {
        newErrors.MaskedCardNumberError = "Masked card number is required.";
      }
      // if (!orderDetails.Amount) {
      //   newErrors.AmountError = "Amount is required.";
      // }
      //  Amount validation
   
   // Amount validation
   const amount = parseFloat(orderDetails.Amount); // Ensure it's a number
   const balanceAmount = parseFloat(BalanceAmount); // Ensure BalanceAmount is a number
   if (!orderDetails.Amount || isNaN(amount)) {
     newErrors.AmountError = "Amount is required";
  //  } else if (amount > balanceAmount) {
  //    newErrors.AmountError = "Please enter an amount equal to or less than your balance.";
  //  }
} else if (amount > balanceAmount) {
  newErrors.AmountErrors = "Please enter an amount equal to or less than your balance.";
  // Show toast for this specific error
  toast.error(newErrors.AmountErrors, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
   
    setErrors(newErrors);

    return Object.keys(newErrors).length > 0; // Returns true if there are errors
  };
      // if (!orderDetails.PaymentComments)
      //   return "Payment comments are required.";
      
    // Call validation function
    const validationError = validatePaymentData();

    // If validation fails, show an error toast and exit the function
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

    // Payment data object
    const paymentData = {
      TenantID: 1,
      PaymentID: 0,
      OrderID: orderId,
      CustomerID: customerId,
      Amount: orderDetails.Amount,
      PaymentComments: orderDetails.PaymentComments,
      PaymentMethod: orderDetails.PaymentMethod,
      MaskedCardNumber: orderDetails.MaskedCardNumber,
      StoreID: orderDetails.StoreID,
    };

    // Proceed with the fetch request if validation passes
    fetch(CREATEORUPDATE_PAYMENT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Log the response

        // Check if the response's StatusCode indicates success
        if (data.StatusCode === "SUCCESS") {
          toast.success("Payment created successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          // Call fetchOrderDetails after a successful payment
          fetchOrderDetails(); // This will refresh the payment details
          setTimeout(() => {
            window.location.reload();
          }, 30);
 

          // Reset the orderDetails state here
          setOrderDetails({
            Amount: "",
            PaymentMethod: "",
            MaskedCardNumber: "",
            PaymentComments: "",
          });
        } else {
          // Handle error from the API response
          toast.error(
            data.message || "Error occurred while creating the Payment.",
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
        }
      })
      .catch((error) => {
        // Handle network or other errors
        toast.error("❌ " + error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  // Function to fetch order details

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setOrderDetails({ ...orderDetails, [name]: value });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Set the orderDetails state
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  
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
  const handleCancel = () => {
    // Example: Reset form or navigate to a different page

    // If you want to navigate away from the form, for example:
    navigate("/Orders"); // This assumes you're using `react-router-dom` for navigation
  };

  const [activeStep, setActiveStep] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const fetchOrderDetails = async () => {
    try {
      if (orderId === "new") return;
      setIsLoading(true);
      const response = await fetch(`${GET_PAYMENTSBY_ORDERID_API}/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      // Log the entire response

      const payments = result.data || [];
      const paymentDetails = payments.map((payment) => ({
        PaymentID: payment.PaymentID || "",
        PaymentMethod: payment.PaymentMethod || "N/A",
        MaskedCardNumber: payment.MaskedCardNumber || "N/A",
        PaymentComments: payment.PaymentComments || "N/A",
        Amount: payment.Amount || "N/A",
        PaymentDate: payment.PaymentDate || "N/A",
        StoreID:payment.storeId||"N/A",
      }));
      // Log payment details
      setPaymentDetails(paymentDetails);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleEditPayment = (paymentId) => {
    const paymentData = paymentDetails.find(
      (payment) => payment.PaymentID === paymentId
    );
    if (paymentData) {
      setOrderDetails({
        PaymentID: paymentData.PaymentID || "",
        PaymentMethod: paymentData.PaymentMethod || "",
        MaskedCardNumber: paymentData.MaskedCardNumber || "",
        Amount: paymentData.Amount || "",

        PaymentComments: paymentData.PaymentComments || "",
      });
      setEditMode(true);
    } else {
      console.error(
        "No valid data found for the provided PaymentID:",
        paymentId
      );
    }
  };
  const getPaymentMethodIcon = (paymentMethod) => {
    switch (paymentMethod) {
      case "Cash":
        return (
          <div className="rounded-full ">
            <img className="w-10 h-10" src={CashIcon} alt="Cash Icon" />
          </div>
        );
      case "Credit Card":
        return (
          <div className="rounded-full pt-2">
            <img className="w-10 h-8" src={CreditCardIcon} alt="Cash Icon" />
          </div>
        );
      case "UPI" || "upi":
        return (
          <div className="rounded-full ">
            <img className="w-10 h-10" src={UpiIcon} alt="Cash Icon" />
          </div>
        );
      case "AmazonPay" || "Amazonpay":
        return (
          <div className=" rounded-full">
            <img className="w-10 h-8 " src={AmazonPayIcon} alt="Cash Icon" />
          </div>
        );
      case "PayPal":
        return (
          <div className="rounded-full ">
            <img className="w-10 h-10" src={PaypalIcon} alt="Cash Icon" />
          </div>
        );
      case "Paypal":
        return (
          <div className="rounded-full ">
            <img className="w-10 h-10" src={PaypalIcon} alt="Cash Icon" />
          </div>
        );
      case "Debit Card":
        return (
          <div className="rounded-full pt-2 ">
            <img className="w-10 h-8" src={DebitCardIcon} alt="Cash Icon" />
          </div>
        );

      default:
        return (
          <div>
            <strong>N/A</strong>
          </div>
        );
    }
  };
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr " }, // Ensure proper grid layout
        gap: 2, // Adjust spacing between items
        pt: 2,
      }}
    >
      {isLoading && <LoadingAnimation />}
      <>
        <div className="flex flex-col  justify-center items-center  w-full">
          <div className="flex-col sm:flex-row  flex justify-center items-center gap-4 w-full">
            <label className="w-full sm:w-1/4 text-xs font-medium text-gray-700">
              Payment Method: <span className="text-red-500">*</span>
            </label>
            <Combobox
              value={orderDetails.PaymentMethod}
              onChange={(value) =>
                handleChange({ target: { name: "PaymentMethod", value } })
              }
            >
              <div className="relative w-full sm:w-1/4">
                <Combobox.Input
                  className={`p-1 w-full border rounded-md ${
                    errors.PaymentMethodError &&  !orderDetails.PaymentMethod
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  displayValue={(option) => option || "Select a Type"}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {[
                    "AmazonPay",
                    "Cash",
                    "Credit Card",
                    "Debit Card",
                    "Paypal",
                    "UPI",
                  ].map((method) => (
                    <Combobox.Option
                      key={method}
                      value={method}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-blue-600 text-white" : "text-gray-900"
                        }`
                      }
                    >
                      {method}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>
          <div className="w-full sm:w-1/2 flex justify-start sm:justify-center sm:ml-[198px] ">
            {errors.PaymentMethodError &&  !orderDetails.PaymentMethod && (
              <p className="text-red-500 text-sm mt-1 ">
                {errors.PaymentMethodError}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col  justify-center items-center  w-full">
          <div className="flex-col sm:flex-row  flex justify-center items-center gap-4 w-full">
            <label className="text-xs w-full sm:w-1/4 text-left font-medium text-gray-700">
              Card Number: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="MaskedCardNumber"
              value={
                orderDetails.MaskedCardNumber
                  ? orderDetails.MaskedCardNumber.replace(/\d(?=\d{4})/g, "*")
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                if (value.length <= 16) {
                  handleChange({
                    target: { name: "MaskedCardNumber", value },
                  });
                }
              }}
              className={`p-1 w-full sm:w-1/4 border rounded-md ${
                errors.MaskedCardNumberError &&  !orderDetails.MaskedCardNumber
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </div>
          <div className="w-full sm:w-1/2 flex justify-start sm:justify-center sm:ml-[223px] ">
            {errors.MaskedCardNumberError &&  !orderDetails.MaskedCardNumber && (
              <p className="text-red-500 text-sm mt-1 ">
                {errors.MaskedCardNumberError}
              </p>
            )}
          </div>
        </div>

        {/* <div className="flex flex-col  justify-center items-center  w-full">
          <div className="flex-col sm:flex-row  flex justify-center items-center gap-4 w-full">
            <label className="text-xs w-full sm:w-1/4 text-left font-medium text-gray-700">
              Payment Amount: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="Amount"
              value={orderDetails.Amount}
              onChange={handleChange}
              className={`p-1 w-full sm:w-1/4 border rounded-md ${
                errors.AmountError &&  !orderDetails.Amount ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          <div className="w-full sm:w-1/2 flex justify-start sm:justify-center sm:ml-[148px] ">
            {errors.AmountError &&  !orderDetails.Amount && (
              <p className="text-red-500 text-sm mt-1 ">{errors.AmountError}</p>
            )}
          </div>
        </div> */}
     <div className="flex flex-col justify-center items-center w-full">
  <div className="flex-col sm:flex-row flex justify-center items-center gap-4 w-full">
    <label className="text-xs w-full sm:w-1/4 text-left font-medium text-gray-700">
      Payment Amount: <span className="text-red-500">*</span>
    </label>
    <input
      type="number"
      name="Amount"
      value={orderDetails.Amount}
      onChange={handleChange}
      className={`p-1 w-full sm:w-1/4 border rounded-md ${
        errors.AmountError ? "border-red-500" : "border-gray-300"
      }`}
    />
  </div>
  <div className="w-full sm:w-1/2 flex justify-start sm:justify-center sm:ml-[148px]">
    {errors.AmountError && (
      <p className="text-red-500 text-sm mt-1">{errors.AmountError}</p>
    )}
  </div>
</div>

        
        <div className="flex flex-col  justify-center items-center  w-full">
          <div className="flex-col sm:flex-row  flex justify-center items-center gap-4 w-full">
            <label className="text-xs w-full sm:w-1/4 text-left font-medium text-gray-700">
              Comments:
            </label>
            <input
              type="text"
              name="PaymentComments"
              value={orderDetails.PaymentComments}
              onChange={handleChange}
              className={`p-1 w-full sm:w-1/4 border rounded-md ${
                errors.PaymentComments ? "border-red-500" : "border-gray-300"
              }`}
            />
            
            {errors.PaymentComments && (
              <p className="text-red-500 text-sm mt-1 sm:ml-4">
                {errors.PaymentComments}
              </p>
            )}
          </div>
        </div>
        <div className="relative mt-10 flex justify-end gap-4">
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="submit"
              className="button-base save-btn"
              onClick={() => {
                savePayment();
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="button-base cancel-btn"
            >
              Cancel
            </button>
          </div>
          {showModal && (
            <div className="fixed ml-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-lg font-semibold">{popupMessage}</h2>
              </div>
            </div>
          )}
        </div>

        {orders1.length >= 0 && (
          <>
            <TableContainer component={Paper} className="mt-4 shadow-md">
              <Table className="min-w-full border-collapse border border-gray-300">
                <TableHead className="bg-custom-darkblue text-white">
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Payment Method
                    </StyledTableCell>

                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Card Number
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
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
                      Amount
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Payment Date
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Action
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentDetails.length > 0 ? (
                    paymentDetails.map((payment, index) => (
                      <TableRow
                        key={index}
                        className="text-center border-b border-gray-300 hover:bg-gray-100"
                      >
                        {/* Payment Method */}
                        <StyledTableCell align="center" className="border-r">
                          <div className="flex flex-col md:flex-col lg:flex-row items-center lg:space-x-2 space-y-2 lg:space-y-0 w-full">
                            {getPaymentMethodIcon(payment.PaymentMethod)}
                            <div className="flex flex-col  sm:flex-row sm:space-x-2  w-full md:pr-8 lg:pr-8">
                              {payment.PaymentMethod}
                            </div>
                          </div>
                        </StyledTableCell>

                        {/* Masked Card Number */}
                        <StyledTableCell
                          align="center"
                          className="border-r border-gray-300"
                        >
                          {payment.MaskedCardNumber}
                        </StyledTableCell>

                        {/* Payment Comments */}
                        <StyledTableCell align="center" className="border-r">
                          {payment.PaymentComments}
                        </StyledTableCell>

                        {/* Amount */}
                        <StyledTableCell align="center" className="border-r">
                          {payment.Amount}
                        </StyledTableCell>
                        <StyledTableCell align="center" className="border-r">
                          <span>
                            {new Date(payment.PaymentDate)
                              .toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                              .replace("17", "24")}
                          </span>
                        </StyledTableCell>

                        {/* Edit Button */}

                        {/* Delete Button */}
                        <StyledTableCell align="center">
                          <div className="button-container justify-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleEditPayment(payment.PaymentID)
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
                              onClick={() => handleDelete(payment.PaymentID)} // Pass the correct payment ID
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
                      <StyledTableCell align="center" colSpan={7}>
                        {isLoading
                          ? "Loading..."
                          : error
                          ? error
                          : "No Payment Found"}
                      </StyledTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orders1.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </>
    </Box>
  );
};

export default Payment;
