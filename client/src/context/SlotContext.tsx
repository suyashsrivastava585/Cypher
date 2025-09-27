import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Slot = { block: string; number: number } | null;

interface SlotContextType {
  mySlot: Slot;
  setMySlot: (slot: Slot) => void;
  clearSlot: () => void;
}

const SlotContext = createContext<SlotContextType | undefined>(undefined);

export function SlotProvider({ children }: { children: ReactNode }) {
  const [mySlot, setMySlotState] = useState<Slot>(null);

  // Load from localStorage on app start
  useEffect(() => {
    const stored = localStorage.getItem("mySlot");
    if (stored) {
      setMySlotState(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever mySlot changes
  const setMySlot = (slot: Slot) => {
    if (slot) {
      localStorage.setItem("mySlot", JSON.stringify(slot));
    } else {
      localStorage.removeItem("mySlot");
    }
    setMySlotState(slot);
  };

  const clearSlot = () => {
    localStorage.removeItem("mySlot");
    setMySlotState(null);
  };

  return (
    <SlotContext.Provider value={{ mySlot, setMySlot, clearSlot }}>
      {children}
    </SlotContext.Provider>
  );
}

export function useSlot() {
  const ctx = useContext(SlotContext);
  if (!ctx) throw new Error("useSlot must be used inside SlotProvider");
  return ctx;
}
