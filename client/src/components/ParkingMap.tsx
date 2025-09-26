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

  const renderBlock = (block: string, columns: number = 8) => {
    const size = blockSizes[block] ?? 0;
    return (
      <div key={block} className="bg-white/5 p-3 rounded-lg border border-white/10">
        <div className="font-semibold mb-2">Block {block}</div>
        <div
          className="grid gap-2 justify-items-center"
          style={{
            gridTemplateColumns: `repeat(${columns}, 48px)`, // fixed-size slots
          }}
        >
          {Array.from({ length: size }).map((_, idx) => {
            const slotNumber = idx + 1;
            const isOccupied = occupied.some(
              (s) => s.block === block && s.number === slotNumber
            );

            return (
              <div
                key={slotNumber}
                className={`flex items-center justify-center text-xs font-medium text-white rounded-md h-8 w-12
                  ${
                    mySpot && mySpot.block === block && mySpot.number === slotNumber
                      ? "bg-blue-500"
                      : isOccupied
                      ? "bg-red-500"
                      : "bg-gray-600"
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
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Object.keys(blockSizes).map((block) => renderBlock(block, 8))}
    </div>
  );
}
