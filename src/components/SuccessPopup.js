import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const SuccessPopup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">

      <div className="relative bg-white p-4 rounded-lg shadow-lg w-64">
   
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Message */}
        <h3 className="text-lg font-semibold mb-4 text-center">{message}</h3>

        {/* Close button at the bottom */}
        <button
          onClick={onClose}
          className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 w-full"
        >
          Close
        </button>
      </div>

      {/* Background overlay */}
      <div className="fixed inset-0 bg-White bg-opacity-50" onClick={onClose}></div>
    </div>
  );
};

export default SuccessPopup;

