import React, { useEffect, useState } from "react";

type Props = {
  vehicleNumber?: string;
};

interface ParkingData {
  entryTime: string;
  exitTime: string;
}

export default function ThankYou({ vehicleNumber = "—" }: Props) {
  const [data, setData] = useState<ParkingData | null>(null);
  const [duration, setDuration] = useState<string>("—");

  useEffect(() => {
  // ✅ Hardcoded values instead of backend fetch
  const entryTime = new Date().toISOString(); // just now
  const exitTime = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // +2 hours

  const hours = 2;
  const minutes = 0;
  const formatted = `${hours}h ${minutes}m`; // ✅ fixed with backticks

  setData({ entryTime, exitTime });
  setDuration(formatted);
}, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 text-center w-full sm:max-w-lg">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100/80 flex items-center justify-center mb-6 shadow-lg">
          <svg
            className="w-12 h-12 text-emerald-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          Thank You!
        </h1>
        <p className="text-slate-200 mb-6">
          Thanks for stopping by — until next time!
        </p>

        {/* Receipt Summary */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 shadow-inner text-left border border-white/20">
          <div className="flex justify-between mb-2 text-slate-200">
            <span>Parking Duration</span>
            <span className="font-medium text-white">{duration}</span>
          </div>
          <div className="flex justify-between mb-2 text-slate-200">
            <span>Amount Paid</span>
            <span className="font-medium text-white">₹10.00</span>
          </div>
          <div className="flex justify-between text-slate-200">
            <span>Exit Time</span>
            <span className="font-medium text-white">
              {data?.exitTime
                ? new Date(data.exitTime).toLocaleTimeString()
                : "—"}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => window.close()}
          className="px-6 py-3 rounded-xl bg-indigo-600/90 text-white font-medium hover:bg-indigo-700 transition shadow-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}