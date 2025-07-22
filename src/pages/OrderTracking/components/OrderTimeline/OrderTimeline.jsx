import React from "react";
import {
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaClock,
  FaHourglassHalf,
} from "react-icons/fa";

const getIcon = (status) => {
  if (status.includes("Delivered")) return <FaCheckCircle className="text-green-600" />;
  if (status.includes("Driver")) return <FaTruck className="text-blue-500" />;
  if (status.includes("Bag") || status.includes("Parcel")) return <FaBoxOpen className="text-yellow-500" />;
  return <FaHourglassHalf className="text-gray-400" />;
};

const OrderTimeline = ({ orderHistory }) => {
  return (
    <div className="max-w-4xl mx-auto px-4  py-10" dir="rtl">
      <h2 className="text-3xl my-4! font-bold text-center text-indigo-700 mb-12">
        🛒 تتبع الطلب
      </h2>

      <div className="flex flex-col space-y-6">
        {orderHistory.map((item, index) => (
          <div
          style={{marginBottom:"15px"}}
            key={index}
            className="relative  bg-white  shadow-md rounded-lg px-8!  py-6! border border-gray-200 animate-slide-up  transition-all duration-300 ease-in-out hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="text-2xl mt-1">{getIcon(item.status)}</div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.status}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {item.statusTime}
                  </span>
                </div>
                {item.remarks && (
                  <p className="text-sm text-gray-700 mt-2">{item.remarks}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-in-out both;
        }
      `}</style>
    </div>
  );
};

export default OrderTimeline;
