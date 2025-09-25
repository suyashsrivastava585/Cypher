import { cn } from "@/lib/utils";

interface ParkingSpotProps {
  id: string;
  status: "available" | "occupied";
  number: string;
  onClick?: (id: string) => void;
  isSelected?: boolean;
}

const ParkingSpot = ({ id, status, number, onClick, isSelected }: ParkingSpotProps) => {
  const handleClick = () => {
    if (onClick && status === "available") {
      onClick(id);
    }
  };

  return (
    <div
      className={cn(
        "relative w-16 h-20 rounded-lg border-2 transition-all duration-300 cursor-pointer",
        "flex items-center justify-center text-sm font-semibold",
        "hover:scale-105 active:scale-95",
        status === "available" && [
          "bg-available/20 border-available text-available",
          "hover:bg-available/30 hover:shadow-available",
          "animate-pulse-glow"
        ],
        status === "occupied" && [
          "bg-occupied/20 border-occupied text-occupied",
          "cursor-not-allowed opacity-75"
        ],
        isSelected && [
          "bg-primary/30 border-primary text-primary",
          "shadow-primary animate-pulse"
        ]
      )}
      onClick={handleClick}
    >
      <span className="relative z-10">{number}</span>
      
      {/* Glow effect for available spots */}
      {status === "available" && (
        <div className="absolute inset-0 bg-available/10 rounded-lg blur-sm animate-pulse" />
      )}
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
      )}
    </div>
  );
};

export default ParkingSpot;