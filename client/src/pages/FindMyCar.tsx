import { useEffect, useState } from "react";
import { FaArrowRight, FaFireExtinguisher, FaStar } from "react-icons/fa";
import { MdElevator, MdDoorFront } from "react-icons/md";

export default function FindMyCar() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-yellow-500 my-4">Find Your Car</h1>

      <div
        className="relative w-full max-w-[1000px] border-4 border-yellow-600 rounded-xl shadow-lg"
        style={{ aspectRatio: "1000/1400" }}
      >
        {/* Background map */}
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-contain rounded-xl"
          style={{ backgroundImage: "url('/parking-map.png')" }} // make sure image is in /public
        ></div>

        {/* Parking blocks */}
        {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((block) => (
          <BlockOverlay
            key={block}
            block={block}
            style={blockStyle(block)}
            cols={blockCols(block)}
          />
        ))}

        {/* Features */}
        <Feature
          label="Entrance"
          icon={<MdDoorFront />}
          style={{ bottom: "40px", left: "50%", transform: "translateX(-50%)" }}
        />
        <Feature
          label="Exit"
          icon={<FaArrowRight />}
          style={{ top: "40px", right: "50px" }}
        />

        {/* Fire extinguishers */}
        <Feature
          icon={<FaFireExtinguisher />}
          style={{ top: "100px", left: "100px" }}
        />
        <Feature
          icon={<FaFireExtinguisher />}
          style={{ top: "100px", right: "100px" }}
        />
        <Feature
          icon={<FaFireExtinguisher />}
          style={{ bottom: "100px", left: "120px" }}
        />
        <Feature
          icon={<FaFireExtinguisher />}
          style={{ bottom: "100px", right: "120px" }}
        />

        {/* Vertical circulation */}
        <Feature
          label="Lift"
          icon={<MdElevator />}
          style={{ top: "600px", left: "480px" }}
        />
        <Feature
          label="Stairs"
          icon={<FaStar />}
          style={{ top: "600px", left: "540px" }}
        />

        {/* Service rooms */}
        <Feature label="Pump Room" style={{ bottom: "300px", left: "100px" }} />
        <Feature label="Store" style={{ bottom: "500px", right: "150px" }} />
      </div>
    </div>
  );
}

/* ================== Block Overlay ================== */
function BlockOverlay({
  block,
  style,
  cols,
}: {
  block: string;
  style: React.CSSProperties;
  cols: number;
}) {
  const blockCapacities: Record<string, number> = {
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
  const totalSlots = blockCapacities[block] || 0;

  return (
    <div
      className="absolute border-2 border-gray-400 rounded-lg p-2 bg-black/20"
      style={style}
    >
      <h3 className="text-sm font-bold mb-1">Block {block}</h3>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: totalSlots }, (_, i) => {
          const number = i + 1;
          // 👇 Hardcode highlight for A-1
          const isMySlot = block === "A" && number === 1;
          return (
            <ParkingSpotBox
              key={`${block}-${number}`}
              block={block}
              number={number}
              isMySlot={isMySlot}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ================== Parking Spot ================== */
function ParkingSpotBox({
  block,
  number,
  isMySlot,
}: {
  block: string;
  number: number;
  isMySlot: boolean;
}) {
  const colorClasses = isMySlot
    ? "bg-blue-600 border-4 border-yellow-300 text-white animate-bounce shadow-xl shadow-blue-500 scale-110 z-50"
    : "bg-gray-700 border-gray-600 text-gray-300";

  return (
    <div
      className={`h-8 w-8 flex items-center justify-center rounded border text-[10px] font-medium shadow transition-transform ${colorClasses}`}
    >
      {block}-{number}
    </div>
  );
}

/* ================== Feature Icons ================== */
function Feature({
  label,
  icon,
  style,
}: {
  label?: string;
  icon?: React.ReactNode;
  style: React.CSSProperties;
}) {
  return (
    <div
      className="absolute flex flex-col items-center text-xs text-white bg-black/70 px-2 py-1 rounded-md border border-gray-500 shadow-lg"
      style={style}
    >
      {icon && <div className="mb-1">{icon}</div>}
      {label}
    </div>
  );
}

/* ================== Helpers ================== */
const blockStyle = (block: string): React.CSSProperties => {
  const positions: Record<string, React.CSSProperties> = {
    A: { top: "150px", left: "40px", width: "100px", height: "800px" },
    B: { top: "150px", left: "180px", width: "300px", height: "200px" },
    C: { top: "150px", left: "520px", width: "300px", height: "200px" },
    D: { top: "400px", left: "180px", width: "300px", height: "220px" },
    E: { top: "400px", left: "520px", width: "300px", height: "220px" },
    F: { top: "650px", left: "180px", width: "300px", height: "220px" },
    G: { top: "650px", left: "520px", width: "300px", height: "220px" },
    H: { bottom: "100px", left: "200px", width: "600px", height: "120px" },
    I: { top: "150px", right: "40px", width: "100px", height: "800px" },
    J: { bottom: "250px", right: "50px", width: "160px", height: "140px" },
  };
  return positions[block];
};

const blockCols = (block: string): number => {
  const cols: Record<string, number> = {
    A: 1,
    B: 8,
    C: 8,
    D: 8,
    E: 8,
    F: 8,
    G: 8,
    H: 9,
    I: 1,
    J: 4,
  };
  return cols[block] || 1;
};
