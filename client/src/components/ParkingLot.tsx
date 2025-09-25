import { useState, useEffect } from "react";
import ParkingSpot from "./ParkingSpot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParkingData {
  id: string;
  number: string;
  status: "available" | "occupied";
  row: number;
}

const initialParkingData: ParkingData[] = [
  // Row 1
  { id: "A1", number: "A1", status: "occupied", row: 1 },
  { id: "A2", number: "A2", status: "available", row: 1 },
  { id: "A3", number: "A3", status: "available", row: 1 },
  { id: "A4", number: "A4", status: "occupied", row: 1 },
  { id: "A5", number: "A5", status: "available", row: 1 },
  { id: "A6", number: "A6", status: "occupied", row: 1 },
  
  // Row 2
  { id: "B1", number: "B1", status: "available", row: 2 },
  { id: "B2", number: "B2", status: "occupied", row: 2 },
  { id: "B3", number: "B3", status: "available", row: 2 },
  { id: "B4", number: "B4", status: "available", row: 2 },
  { id: "B5", number: "B5", status: "occupied", row: 2 },
  { id: "B6", number: "B6", status: "available", row: 2 },
  
  // Row 3
  { id: "C1", number: "C1", status: "occupied", row: 3 },
  { id: "C2", number: "C2", status: "available", row: 3 },
  { id: "C3", number: "C3", status: "occupied", row: 3 },
  { id: "C4", number: "C4", status: "available", row: 3 },
  { id: "C5", number: "C5", status: "available", row: 3 },
  { id: "C6", number: "C6", status: "occupied", row: 3 },
];

const ParkingLot = () => {
  const [parkingData, setParkingData] = useState<ParkingData[]>(initialParkingData);
  const [savedSpot, setSavedSpot] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParkingData(prev => {
        const updated = [...prev];
        // Randomly change 1-2 spots
        const randomSpots = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < randomSpots; i++) {
          const randomIndex = Math.floor(Math.random() * updated.length);
          const spot = updated[randomIndex];
          
          // Don't change saved spot
          if (spot.id === savedSpot) continue;
          
          updated[randomIndex] = {
            ...spot,
            status: spot.status === "available" ? "occupied" : "available"
          };
        }
        
        setLastUpdate(new Date());
        return updated;
      });
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [savedSpot]);

  const availableSpots = parkingData.filter(spot => spot.status === "available").length;
  const totalSpots = parkingData.length;

  const handleSpotSelect = (spotId: string) => {
    setSavedSpot(spotId);
    const spot = parkingData.find(s => s.id === spotId);
    toast({
      title: "Parking Spot Saved! 🚗",
      description: `Your car is parked at spot ${spot?.number}. We'll help you find it later!`
    });
  };

  const findMyCar = () => {
    if (!savedSpot) {
      toast({
        title: "No Saved Parking Spot",
        description: "Please park and save your spot first!"
      });
      return;
    }

    const spot = parkingData.find(s => s.id === savedSpot);
    toast({
      title: "🗺️ Navigating to Your Car",
      description: `Your car is at spot ${spot?.number}, Row ${spot?.row}. Follow the blue indicators!`
    });
  };

  const clearSavedSpot = () => {
    setSavedSpot(null);
    toast({
      title: "Spot Cleared",
      description: "Ready to save a new parking spot!"
    });
  };

  const getRowSpots = (row: number) => {
    return parkingData.filter(spot => spot.row === row);
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapPin className="h-6 w-6 text-primary" />
              Smart Parking Lot
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary" className="bg-available/20 text-available border-available">
                {availableSpots} Available
              </Badge>
              <Badge variant="secondary" className="bg-occupied/20 text-occupied border-occupied">
                {totalSpots - availableSpots} Occupied
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Updated {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={findMyCar}
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 hover:border-primary hover:text-primary"
              disabled={!savedSpot}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Find My Car
            </Button>
            {savedSpot && (
              <Button
                onClick={clearSavedSpot}
                variant="ghost"
                size="sm"
                className="text-xs hover:bg-destructive/10 hover:text-destructive"
              >
                Clear Spot
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-available/20 border-2 border-available rounded" />
            <span className="text-sm text-available">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-occupied/20 border-2 border-occupied rounded" />
            <span className="text-sm text-occupied">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary/20 border-2 border-primary rounded animate-pulse" />
            <span className="text-sm text-primary">Your Car</span>
          </div>
        </div>

        {/* Parking Grid */}
        <div className="space-y-6">
          {[1, 2, 3].map(row => (
            <div key={row} className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground px-2">
                Row {row}
              </div>
              <div className="flex justify-center gap-4 p-4 bg-secondary/30 rounded-lg">
                {getRowSpots(row).map(spot => (
                  <ParkingSpot
                    key={spot.id}
                    id={spot.id}
                    number={spot.number}
                    status={spot.status}
                    onClick={handleSpotSelect}
                    isSelected={spot.id === savedSpot}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Instructions */}
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Click on an <span className="text-available font-medium">available spot</span> to save your parking location.
            Use <span className="text-primary font-medium">"Find My Car"</span> to navigate back to your vehicle.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingLot;