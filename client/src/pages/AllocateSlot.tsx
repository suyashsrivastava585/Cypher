import { useEffect, useState } from "react";
import { ParkingSpot } from "@/context/ParkingContext";

interface AllocateSlotProps {
  onComplete?: () => void; // callback to show Parking Map after allocation
}

export default function AllocateSlot({ onComplete }: AllocateSlotProps) {
  const [mySlot, setMySlot] = useState<ParkingSpot | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch allocated slot from backend
  useEffect(() => {
    async function fetchAllocatedSlot() {
      try {
        const response = await fetch(`https://cypher-3bft.onrender.com/allocate?userId=currentUserId`);
        const data = await response.json();
        setMySlot(data); // expects { block: "B", number: 5, status: "reserved" }
      } catch (err) {
        console.error("Slot allocation failed:", err);
        setMySlot(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAllocatedSlot();
  }, []);

  // Automatically call onComplete (to show Parking Map) after 3 seconds
  useEffect(() => {
  if (mySlot) {
    const navTimeout = setTimeout(() => {
      window.location.href = "https://intermalar-kaylen-corticate.ngrok-free.dev/dashboard";
    }, 3000); // 3 seconds
    return () => clearTimeout(navTimeout);
  }
}, [mySlot]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <img
        src="/assets/bg-photo-3.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 -z-5"></div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center text-white p-6 z-10">
        <h1 className="text-4xl text-green-500 font-extrabold mb-8 text-center drop-shadow-lg">
          Payment Successful!
        </h1>
        <div className="flex flex-col items-center gap-6">
          {loading ? (
            <div className="text-xl animate-pulse bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg border border-white/20">
              Allocating your slot...
            </div>
          ) : mySlot ? (
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/30 text-center">
              <p className="text-xl mb-4 font-semibold animate-pulse text-yellow-300">
                🎉 Your parking slot has been reserved! 🎉
              </p>
              <div className="text-3xl font-bold bg-gray-600 text-white inline-block px-6 py-4 rounded-xl shadow-lg">
                Block {mySlot.block} - {mySlot.number}
              </div>
            </div>
          ) : (
            <div className="text-xl bg-red-600/20 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg border border-red-400/30 text-center">
              ❌ Failed to allocate slot. Please try again.
            </div>
          )}
        </div>
        <p className="mt-12 text-sm text-white/70">
          You will be redirected to the parking map shortly...
        </p>
      </div>
    </div>
  );
}
