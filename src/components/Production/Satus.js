
import React from "react";

const Statuses = ({ status }) => {
  const badgeColor =
    status === "Dispatch"
      ? "bg-teal-100 text-teal-800 ring-teal-700/30" // Teal background and text for Dispatch
      : status === "Completed"
        ? "bg-green-400 text-white  ring-green-700/30"
        : status === "Yet to Start"
          ? "bg-orange-400 text-white ring-yellow-700/30" // Updated for Orange
          : status === "In Progress"
            ? "bg-blue-400 text-white ring-blue-600/30" // Lighter blue background, darker blue text

            : status === "Cancelled"
              ? "bg-red-400 text-white ring-red-700/30" // Red background and text for Cancelled
              : "bg-gray-400 text-gray-800 ring-gray-700/30"; // Default color for any undefined status

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full 
              w-full max-w-[8rem] min-w-[5rem] h-8 text-xs font-semibold 
              ring-1 ring-inset ${badgeColor}`}
    >
      {status}
    </span>
  );
};

export default Statuses;
