import React, { useEffect, useState, useRef } from "react";
import { useSlot } from "@/context/SlotContext";

type Props = {
  vehicleNumber?: string;
};

type Slot = { block: string; number: number } | null;

export default function ThankYou({ vehicleNumber = "—" }: Props) {
  const { mySlot, clearSlot } = useSlot();
  const [releasedSlot, setReleasedSlot] = useState<Slot>(null); // <- new
  const [duration, setDuration] = useState<string>("—");
  const [loading, setLoading] = useState(true);
  const didReleaseRef = useRef(false); // <- guard for double-run

  useEffect(() => {
    async function releaseSlot() {
      if (!mySlot) {
        setLoading(false);
        return;
      }

      if (didReleaseRef.current) return; // already released once
      didReleaseRef.current = true;

      // capture slot info locally before clearing it
      setReleasedSlot(mySlot);

      try {
        const response = await fetch("http://localhost:3000/release", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ block: mySlot.block, number: mySlot.number }),
        });

        if (!response.ok) throw new Error("Failed to release slot");

        const data = await response.json(); // { duration: "01:23" }
        setDuration(data.duration);

        // safe to clear context now that we have a local copy
        clearSlot();
      } catch (err) {
        console.error("Release failed:", err);
        setDuration("—");
      } finally {
        setLoading(false);
      }
    }

    releaseSlot();
  }, [mySlot, clearSlot]);

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
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
            <span className="font-medium text-white">
              {loading ? "Calculating..." : duration}
            </span>
          </div>
          <div className="flex justify-between mb-2 text-slate-200">
            <span>Amount Paid</span>
            <span className="font-medium text-white">₹10.00</span>
          </div>

          {/* Replaced Exit Time with Block Parked (uses releasedSlot) */}
          <div className="flex justify-between text-slate-200">
            <span>Block Parked</span>
            <span className="font-medium text-white">
              {releasedSlot ? `${releasedSlot.block}${releasedSlot.number}` : "—"}
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
