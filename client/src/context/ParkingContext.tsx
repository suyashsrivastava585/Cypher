import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type SpotStatus = "occupied" | "available" | "reserved";

export interface ParkingSpot {
  block: string;
  number: number;
  status?: SpotStatus;
}

interface ParkingContextType {
  spots: ParkingSpot[]; // all slots (available + occupied + reserved)
  mySlot: ParkingSpot | null; // user’s allocated slot
  allocateSlot: () => Promise<void>;
  freeSlot: () => Promise<void>;
}

export const ParkingContext = createContext<ParkingContextType>({
  spots: [],
  mySlot: null,
  allocateSlot: async () => {},
  freeSlot: async () => {},
});

export function ParkingProvider({ children }: { children: ReactNode }) {
  const blocks: Record<string, number> = {
    A: 20,
    B: 24,
    C: 24,
    D: 26,
    E: 26,
    F: 24,
    G: 24,
    H: 18,
    I: 20,
    J: 12,
  };

  const generateAllSpots = (): ParkingSpot[] => {
    const spots: ParkingSpot[] = [];
    Object.entries(blocks).forEach(([block, count]) => {
      for (let i = 1; i <= count; i++) {
        spots.push({ block, number: i, status: "available" });
      }
    });
    return spots;
  };

  const [spots, setSpots] = useState<ParkingSpot[]>(generateAllSpots());
  const [mySlot, setMySlot] = useState<ParkingSpot | null>(null);

  // Fetch backend occupied slots every 5s
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await fetch("/api/parking-spots"); // backend sends only occupied slots
        const data: { block: string; number: number }[] = await res.json();

        // Start all available
        let updated = generateAllSpots();

        // Mark occupied
        updated = updated.map((s) => {
          const occupied = data.some(
            (o) => o.block === s.block && o.number === s.number
          );
          return { ...s, status: occupied ? "occupied" : "available" };
        });

        // Mark user’s slot as reserved
        if (mySlot) {
          updated = updated.map((s) =>
            s.block === mySlot.block && s.number === mySlot.number
              ? { ...s, status: "reserved" }
              : s
          );
        }

        setSpots(updated);
      } catch (err) {
        console.error("Failed to fetch parking spots", err);
      }
    };

    fetchSpots();
    const interval = setInterval(fetchSpots, 5000);
    return () => clearInterval(interval);
  }, [mySlot]);

  // Allocate user slot
  const allocateSlot = async () => {
    try {
      const res = await fetch("/api/allocate-slot", { method: "POST" });
      const slot: { block: string; number: number } = await res.json();
      const reservedSlot: ParkingSpot = { ...slot, status: "reserved" };
      setMySlot(reservedSlot);

      setSpots((prev) =>
        prev.map((s) =>
          s.block === reservedSlot.block && s.number === reservedSlot.number
            ? reservedSlot
            : s
        )
      );
    } catch (err) {
      console.error("Failed to allocate slot", err);
    }
  };

  // Free user slot
  const freeSlot = async () => {
    try {
      if (!mySlot) return;

      await fetch("/api/free-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block: mySlot.block, number: mySlot.number }),
      });

      setSpots((prev) =>
        prev.map((s) =>
          s.block === mySlot.block && s.number === mySlot.number
            ? { ...s, status: "available" }
            : s
        )
      );
      setMySlot(null);
    } catch (err) {
      console.error("Failed to free slot", err);
    }
  };

  return (
    <ParkingContext.Provider value={{ spots, mySlot, allocateSlot, freeSlot }}>
      {children}
    </ParkingContext.Provider>
  );
}

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context)
    throw new Error("useParking must be used within ParkingProvider");
  return context;
};
