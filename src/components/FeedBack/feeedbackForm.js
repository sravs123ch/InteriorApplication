import React, { useEffect, useState, useContext } from "react";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { DataContext } from "../../Context/DataContext";
import Datepicker from "react-tailwindcss-datepicker";
import axios from "axios";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import { getAllFeedbacksAPI } from "../../Constants/apiRoutes";

const FeedbackComponent = () => {
  const [feedbacks, setFeedbacks] = useState([]); // Feedback data
  const [rating, setRating] = useState(0); // Rating state
  const [isChecked, setIsChecked] = useState(false); // Checkbox state
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 9; // Number of feedbacks per page

  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });
  const getStoreIDs = (stores) => {
    return stores.map((store) => store.StoreID); // Return an array of StoreIDs
  };

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
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const storeIDs = selectedStore
          ? [selectedStore.StoreID] // Wrap single StoreID in an array
          : getStoreIDs(stores); // Get array of StoreIDs

        // Debugging: Log storeIDs

        // Prevent API call if storeIDs is empty or invalid
        if (!storeIDs || storeIDs.length === 0) {
          console.warn("No StoreIDs provided. Skipping network call.");
          setLoading(false);
          return;
        }
        const startDate = value.startDate; // Fallback start date
        const endDate = value.endDate; // Fallback end date
        // const StoreID = selectedStore.StoreID; // Use dynamic store ID

        // Perform API call using axios
        const response = await axios.get(getAllFeedbacksAPI, {
          params: {
            StartDate: startDate,
            EndDate: endDate,
            storeIDs,
            pageNumber: currentPage,
            pageSize: pageSize,
          },
        });

        if (response.status === 200 && response.data.StatusCode === "SUCCESS") {
          setFeedbacks(response.data.Feedbacks); // Set feedback data
          setTotalPages(response.data.totalPages); // Set total pages
          setTotalItems(response.data.totalItems); // Set total items count
        } else {
          throw new Error(
            `Failed to fetch feedbacks. Status: ${response.status}`
          );
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false); // Set loading to false whether the request succeeded or failed
      }
    };

    fetchFeedbacks();
  }, [
    selectedStore,
    value.startDate,
    value.endDate,
    currentPage,
    pageSize,
    stores,
  ]);
  // Ensure useEffect is triggered when currentPage or pageSize changes
  // Fetch feedbacks when currentPage changes

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleRating = (star) => {
    setRating(star);
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="main-container">
      {loading && <LoadingAnimation />}
      <div className="body-container">
        <h2 className="heading">FeedBacks</h2>
      </div>
      <hr className="border-t border-gray-300 mt-4 mb-6" />
      <div className="flex flex-wrap justify-end gap-2 mt-2">
        {/* Container for Combo box */}
        {/* <div className="combobox-container flex items-center">
          <Combobox value={selectedStore} onChange={setSelectedStore}>
            <div className="combobox-wrapper h-[40px]">
              <Combobox.Input
                className="combobox-input w-full h-full"
                displayValue={(store) => store?.StoreName || "Select Store ID"}
                placeholder="Select Store Name"
              />
              <Combobox.Button className="combobox-button">
                <ChevronUpDownIcon
                  className="combobox-icon"
                  aria-hidden="true"
                />
              </Combobox.Button>
              <Combobox.Options className="combobox-options">
              
                <Combobox.Option
                  key="select-store-id"
                  className={({ active }) =>
                    active ? "combobox-option-active" : "combobox-option"
                  }
                  value={{ StoreID: null, StoreName: "Select Store ID" }}
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
                        Select Store ID
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

               
                {stores.map((store) => (
                  <Combobox.Option
                    key={store.StoreID}
                    className={({ active }) =>
                      active ? "combobox-option-active" : "combobox-option"
                    }
                    value={store}
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
                          {store.StoreName}
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
        </div> */}

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10">
          <Combobox value={selectedStore} onChange={setSelectedStore}>
            <div className="relative w-full md:w-64">
              <Combobox.Input
                className="p-2 w-full border rounded-md border-gray-300"
                displayValue={(store) =>
                  store?.StoreName || "Select Store Name"
                }
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
                        <span
                          className={selected ? "font-semibold" : "font-normal"}
                        >
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
                          <span
                            className={
                              selected ? "font-semibold" : "font-normal"
                            }
                          >
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

        {/* Container for Date Pickers */}
        <div className="flex justify-center items-center gap-4 w-full p-2 sm:w-auto md:w-80 text-sm leading-6">
          <div className="border-solid border-gray-400 w-full border-[1px] rounded-lg">
            <Datepicker
              popoverDirection="down"
              showShortcuts={true}
              showFooter={true}
              placeholder="Start Date and End Date"
              primaryColor={"purple"}
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 mt-5 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.FeedBackID}
            className="bg-white p-4 rounded-lg shadow mb-4"
          >
            <div className="flex mb-2">
              <h3 className="text-lg sm:text-base md:text-sm font-semibold">
                Order{feedback.OrderNumber}
              </h3>
            </div>
            <div className="flex mb-2">
              <span className="text-gray-500 w-1/2 whitespace-normal text-base sm:text-sm md:text-xs">
                Customer Name
              </span>
              <span className="text-gray-900 w-1/2 flex items-center whitespace-normal text-base sm:text-sm md:text-xs">
                <span className="pr-8">:</span>
                <span>{feedback.CustomerName}</span>
              </span>
            </div>

            <div className="flex mb-2">
              <span className="text-gray-500 w-1/2 text-base sm:text-sm md:text-xs">
                Project Type
              </span>
              <span className="text-gray-900 w-1/2 flex items-center text-base sm:text-sm md:text-xs">
                <span className="pr-8">:</span>
                <span>{feedback.ProjectType}</span>
              </span>
            </div>

            <div className="flex mb-2">
              <span className="text-gray-500 w-1/2 text-base sm:text-sm md:text-xs">
                Feedback Date
              </span>
              <span className="text-gray-900 w-1/2 text-base sm:text-sm md:text-xs">
                <span className="pr-8">:</span>
                {new Date(feedback.CreatedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex mb-2 items-center">
              <span className="text-gray-500 w-1/2 text-base sm:text-sm md:text-xs">
                Received Documents
              </span>
              <span className="text-gray-900 w-1/2 flex items-center text-base sm:text-sm md:text-xs">
                <span className="pr-8">:</span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    onChange={handleCheckboxChange}
                    checked={feedback.ReceivedDocuments}
                  />
                  <span
                    className={`w-4 h-4 border border-gray-400 rounded-md flex items-center justify-center
                                ${
                                  feedback.ReceivedDocuments
                                    ? "bg-green-500"
                                    : "bg-white"
                                } transition-colors duration-200`}
                  >
                    {feedback.ReceivedDocuments && (
                      <span className="text-white">✓</span>
                    )}
                  </span>
                </label>
              </span>
            </div>

            <div className="flex mb-2 items-center">
              <span className="text-gray-500 w-1/2 text-base sm:text-sm md:text-xs">
                Warranty Card
              </span>
              <span className="text-gray-900 w-1/2 flex items-center text-base sm:text-sm md:text-xs">
                <span className="pr-8">:</span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    onChange={handleCheckboxChange}
                    checked={feedback.ReceivedWarrantyCard}
                  />
                  <span
                    className={`w-4 h-4 border border-gray-400 rounded-md flex items-center justify-center
                                ${
                                  feedback.ReceivedWarrantyCard
                                    ? "bg-green-500"
                                    : "bg-white"
                                } transition-colors duration-200`}
                  >
                    {feedback.ReceivedWarrantyCard && (
                      <span className="text-white">✓</span>
                    )}
                  </span>
                </label>
              </span>
            </div>

            <div className="flex mb-2 items-center">
              <span className="text-gray-500 w-1/2 text-base sm:text-sm md:text-xs">
                Installation Successful
              </span>
              <span className="text-gray-900 w-1/2 flex items-center text-base sm:text-sm md:text-xs">
                <span className="pr-8">:</span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    onChange={handleCheckboxChange}
                    checked={feedback.InstallationSuccessful}
                  />
                  <span
                    className={`w-4 h-4 border border-gray-400 rounded-md flex items-center justify-center
                                ${
                                  feedback.InstallationSuccessful
                                    ? "bg-green-500"
                                    : "bg-white"
                                } transition-colors duration-200`}
                  >
                    {feedback.InstallationSuccessful && (
                      <span className="text-white">✓</span>
                    )}
                  </span>
                </label>
              </span>
            </div>

            <div className="flex mb-2 items-start">
              <span className="text-gray-500 w-1/2 text-base sm:text-sm md:text-xs">
                Comments
              </span>
              <span className="pl-1 ">:</span>
              <p className="text-gray-900  pl-8 py-2 rounded-md text-base sm:text-sm md:text-xs w-1/2 overflow-wrap break-words">
                {feedback.Remarks}
              </p>
            </div>

            <div className="flex mb-2 items-center">
              <span className="text-gray-500 w-1/2 text-base sm:text-sm md:text-xs">
                Rating
              </span>
              <span className="text-gray-900 w-1/2 flex items-center text-base sm:text-sm md:text-xs">
                <span className="pr-8">:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer text-2xl transition-colors duration-200 ${
                      star <= feedback.OverallRating
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                    onClick={() => handleRating(star)}
                  >
                    ★
                  </span>
                ))}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4 items-center">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-2 rounded ${
            currentPage === 1
              ? "bg-gray-200"
              : "inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-red-200"
          } transition-colors`}
        >
          Previous
        </button>

        {/* Displaying current page and total pages */}
        <span className="text-gray-500 mx-2">
          {`Page ${currentPage} of ${totalPages}`}
        </span>

        {/* Displaying total feedbacks count */}
        <span className="text-gray-500 mx-2">
          {`Total Feedbacks: ${totalItems}`}
        </span>

        {/* Displaying per page count */}
        <span className="text-gray-500 mx-2">
          {`Showing ${feedbacks.length} per page`}{" "}
          {/* Length of feedbacks array to show per page count */}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-200"
              : "inline-flex justify-center rounded-md border border-transparent bg-custom-darkblue py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-custom-lightblue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          } transition-colors`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeedbackComponent;
