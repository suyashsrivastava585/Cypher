import React from "react";

interface ParkingSpot {
  block: string;
  number: number;
}

type ParkingMapProps = {
  occupied: ParkingSpot[];
  mySpot?: ParkingSpot | null;
  className?: string;
};



export default function ParkingMap({ occupied, mySpot, className }: ParkingMapProps) {
 {
  const blockSizes: Record<string, number> = {
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

  // Helper to render a block
  const renderBlock = (block: string, columns: number = 8) => {
    const size = blockSizes[block] ?? 0;
    return (
      <div
        key={block}
        className="bg-white/5 p-3 rounded-lg border border-white/10"
      >
        <div className="font-semibold mb-2">Block {block}</div>
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
          }}
        >
          {Array.from({ length: size }).map((_, idx) => {
            const slotNumber = idx + 1;
            const isOccupied = occupied.some(
              (s) => s.block === block && s.number === slotNumber
            );
            return (
              <div
  key={idx}
  className={`flex items-center justify-center text-xs font-medium text-white rounded-md h-8
    ${
      mySpot && mySpot.block === block && mySpot.number === slotNumber
        ? "bg-blue-500" // User's spot (priority)
        : isOccupied
        ? "bg-red-500"  // Other occupied
        : "bg-gray-600" // Available
    }`}
>
  {block}-{slotNumber}
</div>


            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`grid grid-cols-[80px_1fr_80px] gap-6 ${className}`}>
      {/* Left column: Block A */}
      <div>{renderBlock("A", 1)}</div>

      {/* Middle grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top row */}
        {renderBlock("B", 8)}
        {renderBlock("C", 8)}

        {/* Middle row with D, E and lift/stairs */}
        <div className="relative col-span-2 grid grid-cols-2 gap-6">
          {renderBlock("D", 8)}
          {renderBlock("E", 8)}

          {/* Lift & Stairs */}
          <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex gap-4">
          </div>
        </div>

        {/* Bottom row */}
        {renderBlock("F", 8)}
        {renderBlock("G", 8)}
      </div>

      {/* Right column: Block I */}
      <div>{renderBlock("I", 1)}</div>
    </div>
  );
}
}