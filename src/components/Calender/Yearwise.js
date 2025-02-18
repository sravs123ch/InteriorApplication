
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { HolidaysList } from "../../Constants/apiRoutes"; 
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YearView = () => {
  const { year } = useParams(); // Extract year from URL
  const navigate = useNavigate();
  // State to store holidays, loading status, and any errors
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to calculate days and blank spaces
  const getNoOfDays = (month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month).getDay();
    const blankDays = Array.from({ length: firstDayOfMonth });
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { blankDays, days };
  };

  const getDayOfWeek = (date, month) => {
    return new Date(year, month, date).getDay();
  };

  // Helper function to convert holiday date to a month and day
  const formatHolidayDate = (holidayDate) => {
    const date = new Date(holidayDate);
    const month = date.getMonth(); // 0-indexed month
    const day = date.getDate();
    const holidayYear = date.getFullYear(); // Get the year
    return { month, day, year: holidayYear };
  };

  // Fetch holidays from API
  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await axios.get(HolidaysList);
      const holidayData = response.data.holidays.map(holiday => ({
        ...holiday,
        ...formatHolidayDate(holiday.Date) // Add month, day, and year to holiday object
      }));

      // Filter holidays to match the selected year
      const filteredHolidays = holidayData.filter(holiday => holiday.year === parseInt(year));

      setHolidays(filteredHolidays);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch holidays. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays(); // Fetch holidays when the component mounts
  }, [year]);

  // Function to check if the current date is a holiday
  const isHoliday = (date, month) => {
    return holidays.find(holiday => holiday.day === date && holiday.month === month);
  };
  // const handleViewMonths = () => {
  //   navigate(`/Calender`); // Navigate to the YearView component
  // };

  const handleViewAll = () => {
    navigate(`/Calender`); // Navigate to the YearView component
  };
   // Retrieve the navbar-collapsed value from localStorage
   const storedCollapsed = localStorage.getItem('navbar-collapsed') === 'true';
  
   // Set the initial state based on the stored value
   const [isExpanded, setIsExpanded] = useState(!storedCollapsed);
  
   // Toggle the expanded/collapsed state and update localStorage
   const toggleExpandCollapse = () => {
     setIsExpanded(!isExpanded);
     // Save the state to localStorage
     localStorage.setItem('navbar-collapsed', !isExpanded);
   };
  
   useEffect(() => {
     // Set the initial state based on the localStorage value
     const storedCollapsed = localStorage.getItem('navbar-collapsed');
     if (storedCollapsed !== null) {
       setIsExpanded(storedCollapsed === 'false');
     }
   }, []); // Only run this once on component mount
  return (
    // <div className="main-container">
    <div
    className={`main-container ${isExpanded ? 'expanded' : 'collapsed'}`}
  >
      <div className="flex flex-col lg:flex-row w-full ml-0">
        
        {/* Calendar View (85%) */}
        <div className="w-full lg:w-9/12">
          <h2 className="text-2xl font-bold text-center mb-4">Calender: {year}</h2>
        
          {/* Loading and Error Handling */}
          {loading && <p>Loading holidays...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONTH_NAMES.map((monthName, index) => {
              const { blankDays, days } = getNoOfDays(index);
              return (
                <div key={index} className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-bold text-center mb-2">{monthName}</h3>
                  <div className="flex flex-wrap bg-gray-200">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} style={{ width: "14.28%" }} className="px-1 py-1 text-center">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap border-t border-l">
                    {blankDays.map((_, i) => (
                      <div key={i} style={{ width: "14.28%", height: "36px" }} className=""></div>
                    ))}
                    {days.map((date, i) => {
                      const dayOfWeek = getDayOfWeek(date, index);
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
                      const holiday = isHoliday(date, index);

                      return (
                        <div
                          key={i}
                          className={`border-b border-r px-2 py-1 text-center rounded-full ${isWeekend ? "text-red-500 font-bold" : ""} ${holiday ? "bg-opacity-75" : ""}`}
                          style={{ 
                            backgroundColor: holiday ? holiday.ColourCode : "",
                            width: "14.28%", 
                            height: "36px",
                          }}
                        >
                          {date}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events List (15%) */}
        <div className="w-full lg:w-3/12 bg-gray-100 rounded-lg p-4 lg:order-last mt-4 lg:mt-0">
        <div className="flex space-x-2">
      {/* <button
        className="px-4 py-2 bg-custom-darkblue text-white rounded-md flex items-center"
        onClick={handleViewMonths}
      >
        Months
      </button> */}
      <button
        className="px-4 py-2 bg-custom-darkblue text-white rounded-md flex ml-44"
        onClick={handleViewAll}
      >
        <FaCalendarAlt className="mr-1" />
      </button>
    </div>
          <h2 className="text-lg font-bold">Events</h2>
          <ul className="space-y-2 mt-0">
            {/* {holidays.map((holiday, i) => (
              <li key={i} className="p-3 rounded-lg shadow hover:bg-opacity-75 transition duration-200" style={{ backgroundColor: holiday.ColourCode }}>
                <p className="font-bold">{holiday.FestivalName}</p>
                <p className="text-sm text-gray-500">{`${MONTH_NAMES[holiday.month]} ${holiday.day}`}</p>
              </li>
            ))} */}
          {holidays.map((holiday, i) => (
              <li key={i} className={`${holiday.ColourCode} p-3 rounded-lg shadow hover:bg-opacity-75 transition duration-200`} style={{ backgroundColor: holiday.ColourCode }}>
                  <p className="font-bold">{holiday.FestivalName}</p>
                  <p className="text-sm text-gray-500">{`${MONTH_NAMES[holiday.month]} ${holiday.day}`}</p>
              </li>
            ))}
          </ul>

        </div>
        
      </div>
      {loading && <LoadingAnimation />}
    </div>
  );
};

export default YearView;
