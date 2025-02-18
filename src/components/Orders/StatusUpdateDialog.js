import React, { useState } from 'react';
import order from '../../assests/Images/profile.png';
import Packing from '../../assests/Images/box.png';
import delivery from '../../assests/Images/transport.png';
import delivered from '../../assests/Images/delivered.png';
import shirtImage from "../../assests/Images/Tshrit2.jpg";

const statuses = [
  { label: 'Ordered', image: order },
  { label: 'Packing', image: Packing },
  { label: 'Out for Delivery', image: delivery },
  { label: 'Delivered', image: delivered },
];

const StatusUpdateDialog = ({ isOpen, onClose, item, onAdditionalAction }) => {
  const [status, setStatus] = useState(item.currentStatus);
  const [productName, setProductName] = useState(item.name);

  const handleUpdateStatus = () => {
    onClose();
  };

  const handleAdditionalAction = () => {
    onAdditionalAction();
  };

  const product = {
    name: 'T-Shirt',
    image: shirtImage,
    size: 'M',
    quantity: 10,
    cost: '599',
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-center">Update Status</h3>

          {/* Product Info */}
          <div className="bg-white rounded-lg p-6 mb-4">
            <div className="flex flex-col items-center">
              <img src={product.image} alt={product.name} className="h-32 w-32 rounded-md mb-4" />

              <div className="flex w-full justify-between space-x-4">
                <div className="flex flex-col space-y-2 w-1/2">
                  <div>
                    <span className="font-medium text-gray-700">Product Name:</span>
                    <p className="text-gray-600">{product.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Quantity:</span>
                    <p className="text-gray-600">{product.quantity}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 w-1/2">
                  <div>
                    <span className="font-medium text-gray-700">Size:</span>
                    <p className="text-gray-600">{product.size}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Cost:</span>
                    <p className="text-gray-600">{product.cost}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Select Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Select a status</option>
              {statuses.map((stat) => (
                <option key={stat.label} value={stat.label}>
                  {stat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Progress Indicator */}
          <h6 className="text-lg font-semibold mb-4">Status</h6>
          <div className="relative flex items-center mb-4">
            {statuses.map((stat, index) => (
              <React.Fragment key={stat.label}>
                <div className="flex flex-col items-center">
                  <img
                    src={stat.image}
                    alt={stat.label}
                    className={`h-14 w-14 rounded-full border-4 ${
                      index <= statuses.findIndex(s => s.label === status)
                        ? 'border-red-600'
                        : 'border-gray-300'
                    } transition duration-200`}
                  />
                </div>

                {/* Connecting Line */}
                {index < statuses.length - 1 && (
                  <div
                    className={`h-2 w-16 ${index < statuses.findIndex(s => s.label === status)
                      ? 'bg-red-600'
                      : 'bg-gray-300'} mx-auto`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-300 px-2 py-1 text-md rounded-md text-gray-700 hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-blue-500 px-2 py-1 text-md rounded-md text-white hover:bg-blue-600"
              onClick={handleAdditionalAction}
            >
              Additional Action
            </button>
            <button
              type="button"
              className="bg-[rgb(22,163,74)] px-2 py-1 text-md rounded-md text-white hover:bg-red-500"
              onClick={handleUpdateStatus}
              disabled={!status}
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default StatusUpdateDialog;
