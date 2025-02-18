import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HolidaysList } from "../../Constants/apiRoutes";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { FaCalendarAlt } from "react-icons/fa";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarScreen = () => {
  const [year, setYear] = useState(new Date().getFullYear()); // Initialize year with current year
  const [noOfDays, setNoOfDays] = useState([]);
  const [blankDays, setBlankDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [holidays, setHolidays] = useState([]); // Store holidays data
  const [month, setMonth] = useState(new Date().getMonth()); // Initialize month with current month
  const [filteredMonths, setFilteredMonths] = useState(MONTH_NAMES);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
 const [isLoading, setIsLoading] = useState(false);

  // Fetch holidays from the API
  const fetchHolidays = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(HolidaysList);
      setHolidays(response.data.holidays); // Adjust key based on API response structure
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch holidays. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
    getNoOfDays();
  }, [month, year]); // Fetch holidays and calculate days when month or year changes

  const getNoOfDays = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get days of the selected month
    const firstDayOfMonth = new Date(year, month).getDay(); // Get the first day of the month
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i); // Empty slots before the first day
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Days of the month
    setBlankDays(blanks);
    setNoOfDays(days);
  };

  const handleMonthChange = (selectedOption) => {
    setMonth(MONTH_NAMES.indexOf(selectedOption)); // Update month based on the selected option
    setQuery(""); // Reset the query to show all months in the dropdown
  };

  const filteredOptions =
    query === ""
      ? MONTH_NAMES
      : MONTH_NAMES.filter((monthName) =>
          monthName.toLowerCase().includes(query.toLowerCase())
        );

  const isToday = (date) => {
    const today = new Date();
    const d = new Date(year, month, date);
    return today.toDateString() === d.toDateString();
  };

  const isWeekend = (date) => {
    const d = new Date(year, month, date);
    return d.getDay() === 0 || d.getDay() === 6; // Sunday or Saturday
  };

  const getHolidayForDate = (date) => {
    return holidays.find(
      (holiday) =>
        new Date(holiday.Date).toDateString() ===
        new Date(year, month, date).toDateString()
    );
  };

  const handleViewMonths = () => {
    navigate(`/Calender`); // Navigate to the YearView component
  };

  const handleViewAll = () => {
    navigate(`/Calender/${year}`); // Navigate to the YearView component
  };

  const [yearQuery, setYearQuery] = useState(""); // State for filtering years

  // Generate an array of 50 years, from 25 years ago to 25 years in the future
  const filteredYearOptions =
    yearQuery === ""
      ? Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - 25 + i)
      : Array.from(
          { length: 50 },
          (_, i) => new Date().getFullYear() - 25 + i
        ).filter((yearOption) => yearOption.toString().includes(yearQuery));

  const handleYearChange = (selectedYear) => {
    setYear(selectedYear); // Update the actual year state
    setYearQuery(""); // Reset query when selecting a year
  };

  return (
    <div className="main-container">
      <div className="body-container">
        <h2 className="heading">Calendar</h2>
        <div className="flex items-center space-x-2 ml-auto">
          <button
            className="px-4 py-2 ml-4 bg-custom-darkblue text-white rounded-md flex items-center"
            onClick={handleViewAll}
          >
            <FaCalendarAlt />
          </button>
        </div>
      </div>

      {/* Calendar Table */}
      <div className="bg-white rounded-lg overflow-hidden md:mt-4">
        <div className="flex items-center justify-between py-2 px-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-start">
            <button
              className={`leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center ${
                month === 0 && "cursor-not-allowed opacity-25"
              }`}
              disabled={month === 0}
              onClick={() => setMonth(month - 1)} // Decrease month
            >
              <svg
                className="h-6 w-6 text-gray-500 inline-flex leading-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center gap-10">
            <div className="relative">
              <Combobox value={MONTH_NAMES[month]} onChange={handleMonthChange}>
                <div className="relative">
                  <Combobox.Input
                    className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(value) => value}
                    placeholder="Select a month"
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>

                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((monthName, index) => (
                      <Combobox.Option
                        key={index}
                        value={monthName}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                      >
                        {({ active }) => (
                          <span
                            className={`block truncate ${
                              active ? "font-semibold" : ""
                            }`}
                          >
                            {monthName}
                          </span>
                        )}
                      </Combobox.Option>
                    ))
                  ) : (
                    <p className="py-2 pl-3 pr-9 text-gray-500">
                      No options available
                    </p>
                  )}
                </Combobox.Options>
              </Combobox>
            </div>

            <div className="relative">
              <Combobox value={year} onChange={handleYearChange}>
                <div className="relative">
                  <Combobox.Input
                    className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    onChange={(event) => setYearQuery(event.target.value)}
                    displayValue={(value) => value} // Display the selected year
                    placeholder="Select a year"
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>

                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredYearOptions.length > 0 ? (
                    filteredYearOptions.map((yearOption, index) => (
                      <Combobox.Option
                        key={index}
                        value={yearOption}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                      >
                        {({ active }) => (
                          <span
                            className={`block truncate ${
                              active ? "font-semibold" : ""
                            }`}
                          >
                            {yearOption}
                          </span>
                        )}
                      </Combobox.Option>
                    ))
                  ) : (
                    <p className="py-2 pl-3 pr-9 text-gray-500">
                      No options available
                    </p>
                  )}
                </Combobox.Options>
              </Combobox>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              className={`leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1 ${
                month === 11 && "cursor-not-allowed opacity-25"
              }`}
              disabled={month === 11}
              onClick={() => setMonth(month + 1)} // Increase month
            >
              <svg
                className="h-6 w-6 text-gray-500 inline-flex leading-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="flex flex-wrap bg-custom-darkblue">
          {DAYS.map((day, index) => (
            <div key={index} style={{ width: "14.28%" }} className="px-2 py-2">
              <div className="text-white text-sm uppercase tracking-wide font-bold text-center">
                {day}
              </div>
            </div>
          ))}
        </div>

        {/* Days Grid */}

        <div className="flex flex-wrap border-t border-l">
          {blankDays.map((_, index) => (
            <div
              key={index}
              style={{ width: "14.28%", height: "100px" }}
              className="text-center border-r border-b px-4 pt-2"
            ></div>
          ))}
          {noOfDays.map((date, index) => {
            const holiday = getHolidayForDate(date);
            return (
              <div
                key={index}
                style={{ width: "14.28%", height: "100px" }}
                className="px-4 pt-2 border-r border-b relative"
              >
                <div
                  className={`inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100 ${
                    isToday(date)
                      ? "text-blue-700"
                      : isWeekend(date)
                      ? "text-red-700"
                      : "text-gray-700"
                  }`}
                >
                  {date}
                </div>
                {holiday && (
                  <div
                    className={`text-xs mt-2 px-2 py-1 rounded-md`}
                    style={{
                      backgroundColor: holiday.ColourCode,
                      color: "black",
                    }}
                  >
                    {holiday.FestivalName}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {isLoading && <LoadingAnimation />}
    </div>
  );
};

export default CalendarScreen;
