// import React from 'react';

// const StatusBadge = ({ status }) => {
//   const badgeColor = status === "Delivered" ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-red-50 text-red-700 ring-red-600/20";

//   return (
//     <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${badgeColor}`}>
//       {status}
//     </span>
//   );
// };

// export default StatusBadge;


import React from 'react';

const StatusBadge = ({ status }) => {
  const badgeColor = status === "Dispatched" ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-red-50 text-red-700 ring-red-600/20";

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${badgeColor}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
