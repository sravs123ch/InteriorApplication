import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { TbListSearch } from "react-icons/tb";
import { GiConfirmed } from "react-icons/gi";
import { RiUserFollowLine } from "react-icons/ri";
import { MdProductionQuantityLimits } from "react-icons/md";
import { GrInstall } from "react-icons/gr";
import { BsBoxFill } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  GET_OVERALL_DATA_FOR_DASHBOARD,
  TRIGGER_MAIL,
  DashboardOrderStatus,CustomerStatusCount,
} from "../../Constants/apiRoutes";
import Datepicker from "react-tailwindcss-datepicker";
import { GET_SALES_AND_PAYMENT_REPORT_BY_MONTH } from "../../Constants/apiRoutes";
import axios from "axios";

import "chart.js/auto";
import LoadingAnimation from "../Loading/LoadingAnimation";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import AIChatBot from "../AI/Chatbox";
import { useNavigate } from "react-router-dom";

Chart.register(...registerables);

const Dashboard = () => {
  const lineChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const bigChartRef = useRef(null);
  // State to hold the API data
  const [salesAndPaymentData, setSalesAndPaymentData] = useState([]);
  const [overallData, setOverallData] = useState({});
  const [loading, setLoading] = useState(true);

  const [storeNames, setStoreNames] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [isStoreDataLoading, setIsStoreDataLoading] = useState(true);
  const[orderStatusData,setOrderStatusData]=useState({}); 
  const[customerStatusData,setCustomerStatusData]=useState({}); 
  const navigate = useNavigate();

  const tenantID = localStorage.getItem("TenantID");
  useEffect(() => {
    const loadStoreData = () => {
      const storedData = localStorage.getItem("storesData");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setStoreNames(parsedData);
          setIsStoreDataLoading(false);

          // Automatically set selectedStore if there's only one store
          if (parsedData.length === 1) {
            setSelectedStore(parsedData[0]); // Set to the first store
          }
        } catch (error) {
          console.error("Error parsing store data:", error);
          setIsStoreDataLoading(false);
        }
      } else {
        setIsStoreDataLoading(false);
      }
    };

    loadStoreData();

    // Listen for the storeDataReady event
    const handleStoreDataReady = () => {
      loadStoreData();
    };

    window.addEventListener("storeDataReady", handleStoreDataReady);

    return () => {
      window.removeEventListener("storeDataReady", handleStoreDataReady);
    };
  }, []);

  useEffect(() => {
    const loadData = () => {
      if (storeNames.length > 0) {
        fetchSalesAndPaymentData();
        fetchOverallData();
      }
    };

    loadData();
  }, [storeNames]);

  const getStoreIDs = () => {
    const storeIDs = storeNames.map((store) => store.StoreID);
    return storeIDs;
  };

  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });

  const fetchOverallData = async () => {
    try {
      let storeIDs;
      if (selectedStore.StoreID) {
        storeIDs = selectedStore.StoreID;
      } else {
        storeIDs = getStoreIDs();
      }

      if (!storeIDs || storeIDs.length === 0) {
        console.warn("No StoreIDs provided. Skipping network call.");
        setLoading(false);
        return;
      }
      setLoading(true);
      const response = await axios.post(GET_OVERALL_DATA_FOR_DASHBOARD, {
        StartDate: value.startDate,
        EndDate: value.endDate,
        StoreIDs: String(storeIDs),
      });
      if (response.data.StatusCode === "SUCCESS") {
        setOverallData(response.data);
      }
    } catch (error) {
      console.error("Error fetching overall dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for the storeDataReady event
 
const fetchOrderStatusData = async () => {
  try {
    let storeIDs = selectedStore?.StoreID || getStoreIDs();

    if (!storeIDs || storeIDs.length === 0) {
      console.warn("No StoreIDs provided. Skipping network call.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const response = await axios.get(DashboardOrderStatus, {
      params: {
        StartDate: value.startDate,
        EndDate: value.endDate,
        StoreIDs: Array.isArray(storeIDs) ? storeIDs : [storeIDs],
      },
    });

    if (response.data.success) {
      setOrderStatusData(response.data.data); // ✅ Store only the "data" part
    } else {
      console.warn("Unexpected API response:", response.data);
    }
  } catch (error) {
    console.error("Error fetching overall dashboard data:", error);
  } finally {
    setLoading(false);
  }
};

const fetchCustomerStatusData = async () => {
  try {
    let storeIDs = selectedStore?.StoreID || getStoreIDs();

    if (!storeIDs || storeIDs.length === 0) {
      console.warn("No StoreIDs provided. Skipping network call.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const response = await axios.get(CustomerStatusCount, {
      params: {
        StartDate: value.startDate,
        EndDate: value.endDate,
        StoreIDs: Array.isArray(storeIDs) ? storeIDs : [storeIDs],
      },
    });

    if (response.data.success) {
      setCustomerStatusData(response.data.data); // ✅ Store only the "data" part
    } else {
      console.warn("Unexpected API response:", response.data);
    }
  } catch (error) {
    console.error("Error fetching overall dashboard data:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const loadStoreData = () => {
      const storedData = localStorage.getItem("storesData");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setStoreNames(parsedData);
          setIsStoreDataLoading(false);

          if (parsedData.length === 1) {
            setSelectedStore(parsedData[0]); // Set to the first store
          }
        } catch (error) {
          console.error("Error parsing store data:", error);
          setIsStoreDataLoading(false);
        }
      } else {
        setIsStoreDataLoading(false);
      }
    };

    loadStoreData();

    // Listen for the storeDataReady event
    const handleStoreDataReady = () => {
      loadStoreData();
    };

    window.addEventListener("storeDataReady", handleStoreDataReady);

    return () => {
      window.removeEventListener("storeDataReady", handleStoreDataReady);
    };
  }, []);
  useEffect(() => {
    const loadData = () => {
      if (storeNames.length > 0) {
        fetchSalesAndPaymentData();
        fetchOverallData();
        fetchOrderStatusData();
        fetchCustomerStatusData();
      }
    };

    loadData();
  }, [storeNames]);

  useEffect(() => {
    if (selectedStore || (value.startDate && value.endDate)) {
      fetchOverallData();
    }
  }, [selectedStore, value.startDate, value.endDate]);

  useEffect(() => {
    if (selectedStore) {
      fetchSalesAndPaymentData();
    }
  }, [selectedStore]);

  const fetchSalesAndPaymentData = async () => {
    try {
      let storeIDs;
      if (selectedStore.StoreID) {
        storeIDs = selectedStore.StoreID;
      } else {
        storeIDs = getStoreIDs();
      }

      if (!storeIDs || storeIDs.length === 0) {
        console.warn("No StoreIDs provided. Skipping network call.");
        setLoading(false);
        return;
      }
      setLoading(true);
      const response = await axios.post(
        GET_SALES_AND_PAYMENT_REPORT_BY_MONTH,
        { StoreIDs: String(storeIDs) } // Pass selected store ID
      );
      if (response.data.StatusCode === "SUCCESS") {
        setSalesAndPaymentData(response.data.OrdersAndPayments);
      }
    } catch (error) {
      console.error("Error fetching sales and payment data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOverallData();
    fetchSalesAndPaymentData();
  }, []);
  useEffect(() => {
    if (selectedStore) {
      // Check if a store is selected
      fetchOverallData();
      fetchSalesAndPaymentData();
    }
  }, [selectedStore]);

  const lineData = {
    labels: salesAndPaymentData.map((item) => item.Month),
    datasets: [
      {
        label: "Orders Per Month",
        data: salesAndPaymentData.map((item) => parseInt(item.OrderCount)),
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Total Payments Per Month",
        data: salesAndPaymentData.map((item) => parseFloat(item.TotalPayments)),
        fill: false,
        backgroundColor: "rgba(255,99,132,1)",
        borderColor: "rgba(255,99,132,1)",
      },
    ],
  };

  const doughnutData = {
    labels: overallData.OrderStatusCounts
      ? overallData.OrderStatusCounts.map((item) => item.OrderStatus)
      : [],
    datasets: [
      {
        label: "Order Status",
        data: overallData.OrderStatusCounts
          ? overallData.OrderStatusCounts.map((item) => parseInt(item.Count))
          : [],
        backgroundColor: [
          "rgba( 255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const bigChartData = {
    labels: salesAndPaymentData.map((item) => item.Month),
    datasets: [
      {
        label: "Revenue Generated",
        data: salesAndPaymentData.map((item) => parseFloat(item.TotalPayments)),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Cleanup chart instances on component unmount

  useEffect(() => {
    const lineChartInstance = lineChartRef.current;
    const doughnutChartInstance = doughnutChartRef.current;
    const bigChartInstance = bigChartRef.current;
    return () => {
      if (lineChartInstance) {
        lineChartInstance.destroy();
      }

      if (doughnutChartInstance) {
        doughnutChartInstance.destroy();
      }

      if (bigChartInstance) {
        bigChartInstance.destroy();
      }
    };
  }, []);

  const handleMailTrigger = async () => {
    const token = localStorage.getItem("token"); // Adjust the key if necessary
    if (!token) {
      console.error("No token found in local storage.");
      return;
    }

    try {
      const response = await axios.post(
        TRIGGER_MAIL,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.StatusCode === "SUCCESS") {
        // You can add any additional success handling here
      } else {
        console.error("Failed to trigger mail:", response.data);
      }
    } catch (error) {
      console.error("Error triggering mail:", error);
    }
  };
  const [isExpanded, setIsExpanded] = useState(() => {
    const storedCollapsed = localStorage.getItem("navbar-collapsed");
    return storedCollapsed !== "true"; // Default to expanded if not set
  });

  // Update state when localStorage value changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedCollapsed = localStorage.getItem("navbar-collapsed");
      setIsExpanded(storedCollapsed !== "true"); // Set expanded if 'navbar-collapsed' is not 'true'
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  const goToCustomers = () => {
    navigate("/Customer", { state: { fromDashboard: true } });
  };
  const goToOrders = () => {
    navigate("/Orders");
  };
  const goToOrdersInstallation = () => {
    navigate("/Orders?filter=Installation"); // Pass filter as a query parameter
  };
  const goToOrdersCompleted = () => {
    navigate("/Orders?filter=Completion"); // Pass filter as a query parameter
  };
  const goToProduction = () => {
    navigate("/production");
  };
  return (
    // <div className="main-container">
    <div className={`main-container ${isExpanded ? "expanded" : "collapsed"}`}>
      {(loading || isStoreDataLoading) && <LoadingAnimation />}
      {/* Dashboard Header */}
      <AIChatBot />
      <div className="flex justify-end items-center space-x-4">
        <div className=" rounded-md px-2 py-2 bg-[#ffe4e6] flex justify-center items-center ring-1 ring-[#881337]">
          <button onClick={handleMailTrigger} className="flex">
            <h1 className="mr-2 text-[#881337] text-sm">Send Mail</h1>
            <span>
              <EnvelopeIcon className="text-[#881337] w-5 h-5" />
            </span>
          </button>
        </div>
        <div className="flex flex-col items-end">
          <div className="combobox-container flex items-center">
            <Combobox value={selectedStore} onChange={setSelectedStore}>
              <div className="combobox-wrapper h-[40px]">
                <Combobox.Input
                  className={`combobox-input w-full h-full ${selectedStore}`}
                  displayValue={(store) =>
                    store?.StoreName || "Select Store ID"
                  }
                  placeholder="Select Store Name"
                  readOnly={storeNames.length === 1}
                />

                {storeNames.length > 1 && (
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                )}
                {storeNames.length > 1 && (
                  <Combobox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {/* Add "Select Store ID" option */}
                    <Combobox.Option
                      key="select-store-id"
                      value={{ StoreID: null, StoreName: "Select Store ID" }}
                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                    >
                      Select Store ID
                    </Combobox.Option>
                    {/* Render all store options */}
                    {storeNames.map((store) => (
                      <Combobox.Option
                        key={store.StoreID}
                        value={store}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                      >
                        <span className="block truncate group-data-[selected]:font-semibold">
                          {store.StoreName}
                        </span>
                        {selectedStore?.StoreID === store.StoreID && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
          </div>
        </div>

        <div className="w-1/4">
          <div className="border-solid border-gray-400 border-[1px] rounded-lg w-full">
            <Datepicker
              popoverDirection="down"
              showShortcuts={true}
              showFooter={true}
              placeholder="Start Date and End Date"
              primaryColor={"purple"}
              value={value}
              onChange={(newValue) => setValue(newValue)}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 mb-8 mt-2">
        {/* ENQUIRY */}
        <div
          className="relative h-32 p-4 bg-blue-500 text-white rounded-2xl  overflow-hidden"
          onClick={goToCustomers}
        >
          {/* Icon & Text Container */}
          <div className="flex items-center justify-items-center p-6 py-3 w-full max-w-sm">
            {/* Icon */}
            <TbListSearch className="text-6xl text-white opacity-80 mr-4" />

            {/* Text Content */}
            <div>
              <p className="text-2xl font-bold">
                {overallData.CustomerCount || 0}
              </p>
              <p className="text-lg text-white opacity-80 ml-1 font-bold">
                ENQUIRY
              </p>
            </div>
          </div>
        </div>

        {/* FOLLOW UP'S */}

        {/* Icon & Text Container */}
        <div className="relative h-32 p-4 bg-green-500 text-white rounded-2xl  overflow-hidden">
          {/* Icon & Text Container */}
          <div
            className="flex items-center justify-items-center p-6 py-3 w-full max-w-sm"
            onClick={goToCustomers}
          >
            {/* Icon */}
            <RiUserFollowLine className="text-6xl text-white opacity-80 mr-4" />

            {/* Text Content */}
            <div>
              {/* <h1 className="text-2xl font-bold">100</h1> */}
              <p className="text-2xl">{customerStatusData?.otherCount || 0}</p>
              <p className="text-lg text-white opacity-80 font-bold ml-1">
                FOLLOW UP'S
              </p>
            </div>
            {/* <p className="text-2xl absolute bottom-4 right-5 font-bold">100</p> */}
            <p className="text-2xl absolute bottom-4 right-5 font-bold">{customerStatusData?.holdCount || 0}</p>
          </div>
          {/* Wave Effect */}
        </div>

        {/* CONFIRMATION */}
        <div className="relative h-32 p-4 bg-yellow-500 text-white rounded-2xl  overflow-hidden">
          {/* Icon & Text Container */}
          <div
            className="flex items-center justify-items-center p-6 py-3 w-full max-w-sm"
            onClick={goToOrders}
          >
            {/* Icon */}
            <GiConfirmed className="text-6xl text-white opacity-80 mr-4" />

            {/* Text Content */}
            <div>
              {/* <h2 className="text-2xl font-bold">100</h2> */}
              <p className="text-2xl">{overallData.TotalOrderCount || 0}</p>
              <p className="text-lg text-white opacity-80 font-bold ml-1">
                CONFIRMATION
              </p>
            </div>
          </div>
        </div>

        {/* PRODUCTION */}
        <div className="relative h-32 p-4 bg-red-500 text-white rounded-2xl   overflow-hidden">
          {/* Icon & Text Container */}
          <div
            className="flex items-center justify-items-center p-6 py-3 w-full max-w-sm"
            onClick={goToProduction}
          >
            {/* Icon */}
            <MdProductionQuantityLimits className="text-6xl text-white opacity-80 mr-4" />

            {/* Text Content */}
            <div>
              {/* <h2 className="text-2xl font-bold">100</h2> */}
              <p className="text-2xl">{orderStatusData?.productionCount || 0}</p>
              <p className="text-lg text-white opacity-80 ml-1 font-bold">
                PRODUCTION
              </p>
            </div>
            <p className="text-2xl absolute bottom-4 right-5 font-bold">100</p>
          </div>
        </div>

        {/* INSTALLATION */}
        <div className="relative h-32 p-4 bg-slate-500 text-white rounded-2xl   overflow-hidden">
          {/* Icon & Text Container */}
          <div
            className="flex items-center justify-items-center p-6 py-3 w-full max-w-sm"
            onClick={goToOrdersInstallation}
          >
            {/* Icon */}
            <GrInstall className="text-6xl text-white opacity-80 mr-4" />

            {/* Text Content */}
            <div>
            <p className="text-2xl">{orderStatusData?.installationCount || 0}</p>
              <p className="text-lg text-white opacity-80 font-bold ml-1">
                INSTALLATION
              </p>
            </div>
            <p className="text-2xl absolute bottom-4 right-5 font-bold">100</p>
          </div>
        </div>

        {/* HANDOVER */}
        <div className="relative  p-4 h-32 bg-indigo-500 text-white rounded-2xl  overflow-hidden">
          {/* Icon & Text Container */}
          <div
            className="flex items-center justify-items-center p-6 py-3 w-full max-w-sm"
            onClick={goToOrdersCompleted}
          >
            {/* Icon */}
            <BsBoxFill className="text-6xl text-white opacity-80 mr-4" />

            {/* Text Content */}
            <div>
            <p className="text-2xl">{orderStatusData?.completionCount || 0}</p>
              <p className="text-lg text-white opacity-80 font-bold ml-1">
                HANDOVER
              </p>
            </div>
            <p className="text-2xl absolute bottom-4 right-5 font-bold">100</p>
          </div>
        </div>
      </div>
      {/* Graph Section */}

      {/* <div className="container mx-auto"> */}
      {tenantID !== "1" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Sales</h2>

            <Line data={lineData} ref={lineChartRef} />
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>

            <div className="w-72 h-72 mx-auto">
              <Doughnut data={doughnutData} ref={doughnutChartRef} />
            </div>
          </div>
        </div>
      )}
      {/* Full-width Big Chart */}
      {tenantID !== "1" && (
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Revenue Generated</h2>

          <Bar data={bigChartData} ref={bigChartRef} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
