import React, { useContext, useEffect, useState } from "react";
import LoadingAnimation from "../Loading/LoadingAnimation";
import { IoIosSearch } from "react-icons/io";
import { Combobox } from "@headlessui/react";
import { DataContext } from "../../Context/DataContext";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { GET_TASKS, GETALLUSERS_API,getTasksForUser,TaskStatusUpdate } from "../../Constants/apiRoutes";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const Tasks = () => {
  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (storesData) {
      setStores(storesData);
      // Automatically set selectedStore if there's only one store
      if (storesData.length === 1) {
        setSelectedStore(storesData[0]);
      }
    }
  }, [storesData]);

  const [orderNumber, setOrderNumber] = useState(""); 
  const [orderHistoryID, setOrderHistoryID] = useState(""); 
  const [orderID, setOrderID] = useState(""); // State to store OrderID (if needed)
  

  const [taskData, setTaskData] = useState({
    toDo: [],
    inProgress: [],
    inReview: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userID, setUserID] = useState(() => {
    const storedUserID = localStorage.getItem("userID");
    return storedUserID || "1";
  });
  const [searchName, setSearchName] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(GETALLUSERS_API, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // if (!response.ok) {
      //   throw new Error("Failed to fetch users");
      // }

      const data = await response.json();
      if (data.StatusCode === "SUCCESS" && data.users) {
        const formattedUsers = data.users.map((user) => ({
          id: user.UserID.toString(),
          name: `${user.FirstName} ${user.LastName}`,
          email: user.Email,
          employeeId: user.EmployeeID,
          storeId: user.StoreID,
          storeName: user.StoreName,
        }));
        setUserOptions(formattedUsers);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  useEffect(() => {
    console.log("Refresh triggered:", refresh); // Confirm refresh changes
    if (refresh) {
        fetchTasks(1, 10, "", "", "", "", selectedStatus || "");
        setRefresh(false); // Reset refresh state
    }
}, [refresh, selectedStatus]);


const handleStatusSubmit = async () => {
    const payload = {
        OrderHistoryID: orderHistoryID,
        ProgressId: selectedStatus,
    };

    setLoading(true);

    try {
        // Call API to update task status
        const response = await axios.post(TaskStatusUpdate, payload);
        console.log("API Response:", response); // Log for debugging

        // Show success toast notification
        toast.success("Sub Status updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setRefresh((prev) => !prev); // Toggle refresh state
        setOpenDialog(false);
    } catch (error) {
        console.error("Error updating status:", error);

        // Show error toast notification
        toast.error("Failed to update task status. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
    } finally {
        setLoading(false);
        setOpenDialog(false);
    }
};


const fetchTasks = async (userId, searchTerm, selectedStore, OntimeorDelay) => {
  try {
    setLoading(true);

    let url = `${getTasksForUser}/${userId}`;
    if (selectedStore && selectedStore.StoreID) {
      url += `&StoreID=${selectedStore.StoreID}`;
    }
    const response = await fetch(url);
    const responseData = await response.json();
    console.log("Response data:", responseData);

    if (responseData.success && Array.isArray(responseData.data)) {
      const tasks = responseData.data;

      const transformedData = {
        toDo: tasks.filter((task) => task.ProgressId === null),
        inProgress: tasks.filter((task) => task.ProgressId === 1),
        inReview: tasks.filter((task) => task.ProgressId === 2),
      };

      setTaskData(transformedData);
    } else {
      console.error("No tasks found or invalid response format:", responseData);
      setTaskData({ toDo: [], inProgress: [], inReview: [] });
    }

    setError(null);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    setError("Failed to fetch tasks");
  } finally {
    setLoading(false);
  }
};
 
const searchItems = (value) => {
    setSearchName(value);
    fetchTasks(userID, value);
  };
  useEffect(() => {
    const fetchInitialTasks = async () => {
      const storedUserID = localStorage.getItem("userID") || "1"; // Provide default userID if none in localStorage
      setUserID(storedUserID);
      await fetchTasks(storedUserID, searchName, selectedStore);
    };

    fetchInitialTasks();
  }, []);
  useEffect(() => {
    if (userID) {
      fetchTasks(userID, searchName, selectedStore);
    }
  }, [selectedStore]);

  if (error) return <p className="main-container">{error}</p>; // Apply error class

  const handleEditClick = (orderID, orderNumber,OrderHistoryID) => {
    setOrderID(orderID); // Set OrderID if needed
    setOrderNumber(orderNumber); // Set OrderNumber
    setOrderHistoryID(OrderHistoryID)
    setOpenDialog(true); // Open the dialog
  };

//   useEffect(() => {
//     if (refresh) {
//         // Call fetchOrders when refresh state is true
//         fetchTasks(1, 10, "", "", "", "",task.ProgressId|| "");

//         // Reset refresh state to false after calling fetchOrders
//         setRefresh(false);
//     }
// }, [refresh]);
//   // Handle submit and API call
//   const handleStatusSubmit = async () => {
//     const payload = {
//       OrderHistoryID: orderHistoryID, // Ensure OrderID is passed correctly
//       ProgressId: selectedStatus, // Pass selected status
//     };

//     setLoading(true);
    
//     try {
//       const response = await axios.post( TaskStatusUpdate, payload);
//       if (response.data.success) {
//         setOpenDialog(false); // Close dialog after success
//       } 
//     } catch (error) {
//       console.error("Error updating status:", error);
//     } finally {
//       setLoading(false);
//       setOpenDialog(false);
//       setTimeout(() => {
//         window.location.reload();
//       }, 30);
//     }
//   };
  

// Handle submit and API call
// const handleStatusSubmit = async () => {
//   const payload = {
//       OrderHistoryID: orderHistoryID, // Ensure OrderID is passed correctly
//       ProgressId: selectedStatus, // Pass selected status
//   };

//   setLoading(true);

//   try {
//       const response = await axios.post(TaskStatusUpdate, payload);
//       if (response.data.success) {
//           setOpenDialog(false); // Close dialog after success
//           setRefresh(true); // Trigger refresh state
//       }
//   } catch (error) {
//       console.error("Error updating status:", error);
//   } finally {
//       setLoading(false);
//       setOpenDialog(false);
//   }
// };

  return (
    <div className="main-container">
         <ToastContainer />
      {loading && <LoadingAnimation />}
      {error && <p className="text-red-500">{error}</p>}
    <div className="fixed w-[83%] z-10 p-2 mb-10 bg-white -mt-2">
      <h2 className="heading fixed w-full z-10 p-2 mb-10 bg-white">
  User Tasks
</h2>

      <div className="flex flex-wrap justify-end gap-2 mt-10">
        {/* Container for centering search box */}
        <div className="combobox-container flex items-center">
          <label className="mr-2">Select User:</label>

          <Combobox
            value={userID}
            onChange={(value) => {
              setUserID(value);
              searchItems(searchName);
            }}
          >
            <div className="combobox-wrapper h-[40px]">
              <Combobox.Input
                className="combobox-input w-full h-full -z-10"
                displayValue={(userId) => {
                  const user = userOptions.find((user) => user.id === userId);
                  return user ? user.name : "Select a user";
                }}
                placeholder="Select User"
              />
              <Combobox.Button className="combobox-button">
                <ChevronUpDownIcon
                  className="combobox-icon"
                  aria-hidden="true"
                />
              </Combobox.Button>
              <Combobox.Options className="combobox-options">
                {/* Add "Select User" option */}
                <Combobox.Option
                  key="select-user"
                  className={({ active }) =>
                    active ? "combobox-option-active" : "combobox-option"
                  }
                  value={null}
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
                        Select User
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

                {/* Render all user options */}
                {userOptions.map((user) => (
                  <Combobox.Option
                    key={user.id}
                    className={({ active }) =>
                      active ? "combobox-option-active" : "combobox-option"
                    }
                    value={user.id}
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
                          {user.name} - {user.id}
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
            </div>
          </Combobox>
        </div>
        <div className="search-container-c-u">
          <label htmlFor="searchName" className="sr-only">
            Search
          </label>
          <input
            id="searchName"
            type="text"
            placeholder=" Search by Order Number / Customer Name "
            value={searchName}
            onChange={(e) => searchItems(e.target.value)}
            className="mt-1 p-1 pr-10 border border-gray-400 rounded-md w-full sm:w-64 text-sm leading-6 h-[40px]"
          />
          <div className="search-icon-container-c-u">
            <IoIosSearch />
          </div>
        </div>

                   
<div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10">
  <Combobox value={selectedStore} onChange={setSelectedStore}>
    <div className="relative w-full md:w-64">
      <Combobox.Input
        className="p-2 w-full border rounded-md border-gray-300"
        displayValue={(store) => store?.StoreName || "Select Store Name"}
        placeholder="Select Store Name"
        readOnly={storesData.length === 1}
      />
      {storesData.length > 1 && (
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>
      )}
      {storesData.length > 1 && (
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Add "Select Store ID" option */}
          <Combobox.Option
            key="select-store-id"
            value={{ StoreID: null, StoreName: "Select Store ID" }}
            className={({ active }) =>
              `cursor-pointer select-none relative p-2 ${
                active ? "bg-blue-500 text-white" : "text-gray-900"
              }`
            }
          >
            {({ selected }) => (
              <>
                <span className={selected ? "font-semibold" : "font-normal"}>
                  Select Store ID
                </span>
                {selected && (
                  <CheckIcon
                    className="h-5 w-5 text-white absolute right-2"
                    aria-hidden="true"
                  />
                )}
              </>
            )}
          </Combobox.Option>
          {/* Render all store options */}
          {storesData.map((store) => (
            <Combobox.Option
              key={store.StoreID}
              value={store}
              className={({ active }) =>
                `cursor-pointer select-none relative p-2 ${
                  active ? "bg-blue-500 text-white" : "text-gray-900"
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className={selected ? "font-semibold" : "font-normal"}>
                    {store.StoreName}
                  </span>
                  {selected && (
                    <CheckIcon
                      className="h-5 w-5 text-white absolute right-2"
                      aria-hidden="true"
                    />
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
</div>

<div className="w-full bg-white z-20 flex justify-evenly items-center px-4 py-2 border-b border-gray-300">
<h2 className="text-xl font-medium relative -left-20">
  To Do ({taskData.toDo.length})
</h2>

  <h2 className="text-xl font-medium text-center">
    In Progress ({taskData.inProgress.length})
  </h2>
  <h2 className="text-xl font-medium relative left-20">
    In Review ({taskData.inReview.length})
  </h2>
</div>


      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-32">
          {/* To Do Column */}
          <div className="relative">
            {/* <h2 className="text-xl font-medium mb-4 z-20 fixed bg-white">
              To Do ({taskData.toDo.length})
            </h2> */}
            {taskData.toDo.length > 0 ? (
              taskData.toDo.map((task, index) => (
                <div
                  className="bg-white p-4 rounded-lg shadow mb-4 mt-10"
                  key={index}
                >
                  <h3 className="text-lg font-semibold">
                    {/* Order {task["task.OrderNumber"]} */}
                    Order {task.OrderNumber}
                  </h3>

                  {/* Flex container for Start Date */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Start Date</span>
                    <span className="text-gray-900 w-2/3">
                      <span className="pr-8">:</span>
                      {new Date(task.StartDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Flex container for End Date */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">End Date</span>
                    <span className="text-gray-900 w-2/3">
                      <span className="pr-8">:</span>
                      {new Date(task.EndDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Flex container for Status */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Status</span>
                    <span className="text-green-400 w-2/3">
                      <span className="pr-8">:</span>
                      {task.OrderHistoryStatus || "To Do"}
                    </span>
                  </div>

                  {/* Flex container for Comments */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Comments</span>
                    <p className="text-orange-500 w-2/3">
                      <span className="pr-8">:</span>
                      {task.Comments}
                    </p>
                  </div>

                  <div className="flex mb-2">
                  
                  <p className="text-orange-500 w-full">
                  
                    <div className="inline-flex items-center mt-2 w-full justify-between">
                    
                      <div>
                        {task.OntimeorDelay == "1" ? (
                          <>
                            <span className="inline-flex items-center bg-green-100 px-2 py-2 rounded mr-2 motion-preset-pulse-sm motion-duration-2000">
                              <span className="w-2 h-2 rounded-full bg-green-500 motion-preset-pulse-sm motion-duration-1500"></span>
                            </span>
                            <span className="text-green-600">
                              <strong>On time</strong>
                            </span>
                          </>
                        ) : task.OntimeorDelay == "2" ? (
                          <>
                            <span className="inline-flex items-center bg-orange-100 px-2 py-2 rounded mr-2 motion-preset-pulse-sm motion-duration-2000">
                              <span className="w-2 h-2 rounded-full bg-orange-500 motion-preset-pulse-sm motion-duration-1500"></span>
                            </span>
                            <span className="text-orange-600">
                              <strong>&nbsp;Delay&nbsp;&nbsp;</strong>
                            </span>
                          </>
                        ) : null}{" "}
                     
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(
                            task.OrderID,
                            task["OrdersTable.OrderNumber"],
                            task.OrderHistoryID
                          )
                        }
                        className="text-xs flex items-center justify-center"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536M9 13l-3 3v3h3l3-3M15.232 5.232a2.5 2.5 0 113.536 3.536L9 21H5v-4L15.232 5.232z"
                            />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </p>
                </div>

                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-10">No tasks to do</p>
            )}
            <div className="absolute top-0 -right-3 h-full border-r border-gray-300"></div>{" "}
            {/* Vertical line */}
          </div>

          {/* In Progress Column */}
          <div className="relative">
            {/* <h2 className="text-xl font-medium mb-4 z-20 fixed bg-white">
              In Progress ({taskData.inProgress.length})
            </h2> */}
            {taskData.inProgress.length > 0 ? (
              taskData.inProgress.map((task, index) => (
                <div
                  className="bg-white p-4 rounded-lg shadow mb-4 mt-10"
                  key={index}
                >
                  <h3 className="text-lg font-semibold">
                    {/* Order {task["task.OrderNumber"]} */}
                    Order {task.OrderNumber} 
                  </h3>

                  {/* Flex container for Start Date */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Start Date</span>
                    <span className="text-gray-900 w-2/3">
                      <span className="pr-8">:</span>
                      {new Date(task.StartDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Flex container for End Date */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">End Date</span>
                    <span className="text-gray-900 w-2/3">
                      <span className="pr-8">:</span>
                      {new Date(task.EndDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Flex container for Status */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Status</span>
                    <span className="text-violet-800 w-2/3">
                      <span className="pr-8">:</span>
                      {task.OrderHistoryStatus || "In Progress"}
                    </span>
                  </div>

                  {/* Flex container for Comments */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Comments</span>
                    <span className="text-green-500 w-2/3">
                      <span className="pr-8">:</span>
                      {task.Comments}
                    </span>
                  </div>
                  <div className="flex mb-2">
                  
                  <p className="text-orange-500 w-full">
                  
                    <div className="inline-flex items-center mt-2 w-full justify-between">
                    
                      <div>
                        {task.OntimeorDelay == "1" ? (
                          <>
                            <span className="inline-flex items-center bg-green-100 px-2 py-2 rounded mr-2 motion-preset-pulse-sm motion-duration-2000">
                              <span className="w-2 h-2 rounded-full bg-green-500 motion-preset-pulse-sm motion-duration-1500"></span>
                            </span>
                            <span className="text-green-600">
                              <strong>On time</strong>
                            </span>
                          </>
                        ) : task.OntimeorDelay == "2" ? (
                          <>
                            <span className="inline-flex items-center bg-orange-100 px-2 py-2 rounded mr-2 motion-preset-pulse-sm motion-duration-2000">
                              <span className="w-2 h-2 rounded-full bg-orange-500 motion-preset-pulse-sm motion-duration-1500"></span>
                            </span>
                            <span className="text-orange-600">
                              <strong>&nbsp;Delay&nbsp;&nbsp;</strong>
                            </span>
                          </>
                        ) : null}{" "}
                     
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(
                            task.OrderID,
                            task["OrdersTable.OrderNumber"],
                            task.OrderHistoryID
                          )
                        }
                        className="text-xs flex items-center justify-center"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536M9 13l-3 3v3h3l3-3M15.232 5.232a2.5 2.5 0 113.536 3.536L9 21H5v-4L15.232 5.232z"
                            />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </p>
                </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-8">No tasks in progress</p>
            )}
            <div className="absolute top-0 -right-3 h-full border-r border-gray-300"></div>{" "}
            {/* Vertical line */}
          </div>

          {/* In Review Column */}
          <div className="relative">
            {/* <h2 className="text-xl font-medium mb-4 z-20 fixed bg-white">
              In Review ({taskData.inReview.length})
            </h2> */}
            {taskData.inReview.length > 0 ? (
              taskData.inReview.map((task, index) => (
                <div
                  className="bg-white p-4 rounded-lg shadow mb-4 mt-10"
                  key={index}
                >
                  <h3 className="text-lg font-semibold">
                    {/* Order {task["task.OrderNumber"]} */}
                    Order {task.OrderNumber}
                  </h3>

                  {/* Flex container for Start Date */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Start Date</span>
                    <span className="text-gray-900 w-2/3">
                      <span className="pr-8">:</span>
                      {new Date(task.StartDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Flex container for End Date */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">End Date</span>
                    <span className="text-gray-900 w-2/3">
                      <span className="pr-8">:</span>
                      {new Date(task.EndDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Flex container for Status */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Status</span>
                    <span className="text-red-500 w-2/3">
                      <span className="pr-8">:</span>
                      {task.OrderHistoryStatus || "In Review"}
                    </span>
                  </div>

                  {/* Flex container for Comments */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Comments</span>
                    <span className="text-blue-500 w-2/3">
                      <span className="pr-8">:</span>
                      {task.Comments}
                    </span>
                  </div>

                  <div className="flex mb-2">
                  
                  <p className="text-orange-500 w-full">
                  
                    <div className="inline-flex items-center mt-2 w-full justify-between">
                    
                      <div>
                        {task.OntimeorDelay == "1" ? (
                          <>
                            <span className="inline-flex items-center bg-green-100 px-2 py-2 rounded mr-2 motion-preset-pulse-sm motion-duration-2000">
                              <span className="w-2 h-2 rounded-full bg-green-500 motion-preset-pulse-sm motion-duration-1500"></span>
                            </span>
                            <span className="text-green-600">
                              <strong>On time</strong>
                            </span>
                          </>
                        ) : task.OntimeorDelay == "2" ? (
                          <>
                            <span className="inline-flex items-center bg-orange-100 px-2 py-2 rounded mr-2 motion-preset-pulse-sm motion-duration-2000">
                              <span className="w-2 h-2 rounded-full bg-orange-500 motion-preset-pulse-sm motion-duration-1500"></span>
                            </span>
                            <span className="text-orange-600">
                              <strong>&nbsp;Delay&nbsp;&nbsp;</strong>
                            </span>
                          </>
                        ) : null}{" "}
                     
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(
                            task.OrderID,
                            task["OrdersTable.OrderNumber"],
                            task.OrderHistoryID
                          )
                        }
                        className="text-xs flex items-center justify-center"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536M9 13l-3 3v3h3l3-3M15.232 5.232a2.5 2.5 0 113.536 3.536L9 21H5v-4L15.232 5.232z"
                            />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </p>
                </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-10">No tasks in review</p>
            )}
          </div>
        </div>
      )}
         <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      maxWidth="xs"
      fullWidth={false}
      sx={{
        zIndex: 30,
        ml: "auto",
        "& .MuiDialog-paper": { width: "500px", maxHeight: "90vh" },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>
        Update Status
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="orderHistoryID"
          label="Order History Number"
          type="text"
          fullWidth
          variant="outlined"
          value={orderHistoryID}
          onChange={(e) =>  setOrderHistoryID(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        {/* Hidden input to pass OrderID to the backend */}
        <input type="hidden" name="OrderID" value={orderID} />

        <FormControl fullWidth variant="outlined" margin="dense">
          <InputLabel id="substatus-id-label">Select Status</InputLabel>
          <Select
            labelId="substatus-id-label"
            name="SubStatusId"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Production Status"
          >
            <MenuItem value="" disabled>Select Status</MenuItem>
            <MenuItem value="1">In Progress</MenuItem>
            <MenuItem value="2">Completed</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <button
          type="button"
          onClick={handleStatusSubmit}
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-custom-darkblue py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-custom-lightblue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <button
          type="button"
          onClick={() => setOpenDialog(false)}
          className="inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-red-200"
        >
          Cancel
        </button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default Tasks;
