// StatusBadge.js

import React from "react";
import { useStatusColors } from "../../Context/StatusColorsContext";

const StatusBadge = ({ status }) => {
  const statusColors = useStatusColors(); // Get colors from the context
console.log(" statusColors ", statusColors );
  // Extract the base status dynamically, ignoring the "Phase X" or "R<number>" part
  const getBaseStatus = (status) => {
    // Remove the phase or revision number (e.g., "Phase 3", "R4")
    const baseStatus = status.replace(/\sPhase\s\d+$/i, "").replace(/\sR\d+$/, "").trim();
    return baseStatus || status; // Fallback to the full status if no match
  };

  const baseStatus = getBaseStatus(status);

  // Retrieve the color for the base status
  const statusColor = statusColors[baseStatus] || "#000"; // Default to black if not found

  // Debugging logs
console.log(" useStatusColors",statusColor);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full w-36 h-8 text-xs font-semibold text-white ring-1 ring-inset`}
      style={{
        backgroundColor: statusColor,
        boxShadow: `0 0 0 1px ${statusColor}30`,
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;


