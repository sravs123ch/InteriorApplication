import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UpdateOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || {}; // Get orderId from location state
  const [order, setOrder] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [activeStep, setActiveStep] = useState(0); // Stepper state

  const steps = ['Personal Details', 'Order Details'];

  // Fetch order details on component load
  useEffect(() => {
    if (orderId) {
      fetch(`https://imlystudios-backend-mqg4.onrender.com/api/orders/getOrderById/${orderId}`)
        .then((response) => response.json())
        .then((data) => {
          setOrder(data.order); // Set order data
        })
        .catch((error) => {
          console.error('Error fetching order:', error);
          setAlertMessage('Failed to load order details');
          setAlertType('error');
        });
    }
  }, [orderId]);

  // Handle form submission and send PUT request to update the order
  const handleSubmit = (event) => {
    event.preventDefault();

// First, validate that the CustomerID and AddressID are related
const customerID = order.Customer.CustomerID;
const addressID = order.Customer.Address[0]?.AddressID;
const tenantID = order.TenantID;


if (!customerID || !addressID) {
    setAlertMessage('CustomerID or AddressID not found.');
    setAlertType('error');
    return;
 }

//     // Perform validation to ensure CustomerID matches its corresponding AddressID
const customerAddressMatch = order.Customer.Address.some(address => address.AddressID === addressID);

if (!customerAddressMatch) {
     setAlertMessage('CustomerID and AddressID do not match.');
     setAlertType('error');
     return;
}

// If validation passes, prepare the form data
 const formData = new FormData(event.target);
 formData.append('CustomerID', customerID);   // Append CustomerID
formData.append('AddressID', addressID);     // Append AddressID
 formData.append('OrderID', orderId);         // Append OrderID
formData.append('TenantID', tenantID); // Append TenantID


    fetch(`https://imlystudios-backend-mqg4.onrender.com/api/orders/updateOrder/${orderId}`, {
      method: 'PUT',
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        setAlertMessage('Order updated successfully');
        setAlertType('success');
        setTimeout(() => navigate('/orders'), 2000); // Navigate to orders page after success
      })
      .catch((error) => {
        console.error('Error updating order:', error);
        setAlertMessage('Failed to update order');
        setAlertType('error');
      });
  };

  // Handle change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  // Stepper change handler
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="p-6 mr-10 mb-7 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-80 w-1/8 mt-8 bg-white shadow-lg rounded-lg">
      <div className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl font-semibold mb-4">Update Order</h2>

        {alertMessage && (
          <div
            className={`mb-4 p-4 text-white ${
              alertType === 'success' ? 'bg-green-500' : 'bg-red-500'
            } rounded`}
          >
            {alertMessage}
          </div>
        )}

        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 text-center border-b-2 pb-2 ${
                activeStep === index ? 'border-blue-500' : 'border-gray-300'
              }`}
            >
              <span className={`${activeStep === index ? 'text-blue-500' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {activeStep === 0 && order && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="FirstName"
                name="FirstName"
                value={order.Customer.FirstName || ''}
                onChange={handleChange}
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="LastName"
                name="LastName"
                value={order.Customer.LastName || ''}
                onChange={handleChange}
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="PhoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="PhoneNumber"
                name="PhoneNumber"
                value={order.Customer.PhoneNumber || ''}
                onChange={handleChange}
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="Email"
                name="Email"
                value={order.Customer.Email || ''}
                onChange={handleChange}
                type="email"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="AddressLine1" className="block text-sm font-medium text-gray-700">
                Address Line 1
              </label>
              <input
                id="AddressLine1"
                name="AddressLine1"
                value={order.Customer.Address[0]?.AddressLine1 || ''}
                onChange={handleChange}
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="AddressLine2" className="block text-sm font-medium text-gray-700">
                Address Line 2
              </label>
              <input
                id="AddressLine2"
                name="AddressLine2"
                value={order.Customer.Address[0]?.AddressLine2 || ''}
                onChange={handleChange}
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {activeStep === 1 && order && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="OrderDate" className="block text-sm font-medium text-gray-700">
                Order Date
              </label>
              <input
                id="OrderDate"
                name="OrderDate"
                value={order.OrderDate || ''}
                onChange={handleChange}
                type="date"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="TotalAmount" className="block text-sm font-medium text-gray-700">
                Total Amount
              </label>
              <input
                id="TotalAmount"
                name="TotalAmount"
                value={order.TotalAmount || ''}
                onChange={handleChange}
                type="number"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="TotalQuantity" className="block text-sm font-medium text-gray-700">
                Total Quantity
              </label>
              <input
                id="TotalQuantity"
                name="TotalQuantity"
                value={order.TotalQuantity || ''}
                onChange={handleChange}
                type="number"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="OrderStatus" className="block text-sm font-medium text-gray-700">
                Order Status
              </label>
              <input
                id="OrderStatus"
                name="OrderStatus"
                value={order.OrderStatus || ''}
                onChange={handleChange}
                type=""
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Back
              </button>
              <button type="submit" className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
                Update Order
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateOrder;
