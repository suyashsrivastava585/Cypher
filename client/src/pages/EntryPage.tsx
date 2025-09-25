import React from "react";
import {
  FaRupeeSign,
  FaClock,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa";

export default function ParkingPayment() {
  const handlePayOnline = () => {
    // Replace with your actual payment portal route or external URL
    window.location.href = "/PaymentPortal";
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('../public/assets/bg-photo-4.jpg')",
      }}
    >
      <div className="bg-black/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-[400px] text-center text-white">
        <h1 className="text-2xl font-bold mb-2">Parking Payment</h1>
        <p className="text-sm text-gray-300 mb-6">
          Choose your preferred payment method
        </p>

        {/* Rate Section */}
        <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg mb-4">
          <div className="flex items-center space-x-2">
            <FaRupeeSign className="text-purple-300" />
            <span className="font-medium">Rate</span>
          </div>
          <span className="text-lg font-semibold">₹10</span>
        </div>

        {/* Hours Section */}
        <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-2">
            <FaClock className="text-purple-300" />
            <span className="font-medium">Hours</span>
          </div>
          <span className="text-lg font-semibold">8:30 AM - 11:30 PM</span>
        </div>

        {/* Buttons */}
        <button
          onClick={handlePayOnline}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center justify-center space-x-2 mb-4 hover:opacity-90 transition"
        >
          <FaCreditCard />
          <span>Pay Online</span>
        </button>

        <button className="w-full py-3 rounded-xl bg-black/40 text-white font-medium flex items-center justify-center space-x-2 hover:bg-black/60 transition">
          <FaMoneyBillWave />
          <span>Pay via Cash</span>
        </button>

        <p className="mt-6 text-xs text-gray-400">
          Secure parking management system
        </p>
      </div>
    </div>
  );
}