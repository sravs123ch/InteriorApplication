
import React from 'react'; // Ensure React is imported
import { FaList, FaTools, FaSearch, FaCheck, FaTimes } from 'react-icons/fa';
const FilterBar = ({ selectedFilter, onFilterChange }) => {
  const statuses = [
    { label: 'All', icon: <FaList />, color: 'text-gray-500' },
    { label: 'Yet to Start', count: '', status: 'Yet to Start', icon: <FaTools />, subStatusId: 1, color: 'text-orange-400' }, // Changed to orange
    { label: 'In Progress', count: '', status: 'In Progress', icon: <FaSearch />, subStatusId: 2, color: 'text-blue-500' },
    { label: 'Completed', count: '', status: 'Completed', icon: <FaCheck />, subStatusId: 3, color: 'text-green-500' },
    { label: 'Cancelled', count: '', status: 'Cancelled', icon: <FaTimes />, subStatusId: 4, color: 'text-red-500' },
  ];

  return (
    <div className="flex flex-col w-full sm:w-1/4 md:w-1/3 lg:w-1/4 p-4 bg-gray-100 rounded-md">
      <div className="p-5 bg-white">
        <h2 className="font-semibold text-lg mb-3">Status Overview</h2>
        <div className="flex flex-col space-y-2">
          {statuses.map((status, index) => {
            const isSelected = selectedFilter.label === status.label;

            // Determine the icon color and button background based on selection
            const iconColor = isSelected ? 'text-white' : status.color;
            const buttonBgColor = isSelected ? `${status.color.replace('text-', 'bg-')} text-white` : 'bg-white text-gray-700 hover:bg-gray-100';

            return (
              <button
                key={index}
                className={`flex items-center justify-between p-2 border-b border-gray-200 w-full text-left transition duration-150 ease-in-out ${buttonBgColor}`} // Use dynamic background color
                onClick={() => onFilterChange(status)} // Pass the whole status object
              >
                <span className="flex items-center">
                  <span className={`mr-2 ${iconColor}`}>
                    {React.cloneElement(status.icon, { className: iconColor })} {/* Adjust icon color */}
                  </span>
                  <span className="font-medium">{status.label}</span>
                </span>
                <span className="font-semibold">{status.count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterBar; // Ensure to export the component
