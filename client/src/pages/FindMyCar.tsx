import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ParkingSpot {
  block: string;
  number: number;
}

type ParkingMapProps = {
  occupied: ParkingSpot[];
  mySpot?: ParkingSpot | null;
  className?: string;
};

// ParkingMap component
function ParkingMap({ occupied, mySpot, className }: ParkingMapProps) {
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
      <div
        key={block}
        className="bg-white/5 p-3 rounded-lg border border-white/10 flex flex-col"
      >
        <div className="font-semibold mb-2 text-center">Block {block}</div>
        <div
          className="grid gap-2 flex-1"
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
                    mySpot &&
                    mySpot.block === block &&
                    mySpot.number === slotNumber
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
    <div
      id="map-container"
      className={`grid grid-cols-[100px_1fr_100px] gap-6 ${className}`}
    >
      {/* Left column */}
      <div className="flex flex-col gap-6">{renderBlock("A", 1)}</div>

      {/* Middle section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top row */}
        {renderBlock("B", 8)}
        {renderBlock("C", 8)}

        {/* Middle row */}
        {renderBlock("D", 8)}
        {renderBlock("E", 8)}

        {/* Bottom row */}
        {renderBlock("F", 8)}
        {renderBlock("G", 8)}
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-6">{renderBlock("I", 1)}</div>
    </div>
  );
}

// Main wrapper
export default function ParkingSection({
  occupied,
  mySpot,
}: {
  occupied: ParkingSpot[];
  mySpot?: ParkingSpot | null;
}) {
  const handleExpand = () => {
    const el = document.getElementById("map-container");
    if (el?.requestFullscreen) el.requestFullscreen();
  };

  return (
    <section className="mb-6 md:mb-10">
      <Card className="bg-gradient-card border-border shadow-card p-4">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse border-white"></span>
            Live Parking Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-lg border border-border relative">
            <div className="absolute inset-0 overflow-auto touch-pan-y touch-pan-x p-4">
              <div className="min-w-[700px] md:min-w-full min-h-[300px]">
                <ParkingMap occupied={occupied} mySpot={mySpot} />
              </div>
            </div>
          </div>

          {/* Expand Map Button */}
          <div className="flex justify-end mt-2 md:hidden">
            <button
              onClick={handleExpand}
              className="px-3 py-1 text-xs rounded bg-primary text-white shadow"
            >
              Expand Map
            </button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
