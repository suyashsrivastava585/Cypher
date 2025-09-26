import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  Smartphone,
  Navigation2,
  Bell,
  Car,
  Activity,
} from "lucide-react";
import { useParking } from "@/context/ParkingContext";
import ParkingMap from "../components/ParkingMap";

interface ParkingSpot {
  block: string;
  number: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { spots } = useParking();
  const [occupied, setOccupied] = useState<ParkingSpot[]>([]);
  const [mySpot, setMySpot] = useState<ParkingSpot | null>(null);

  // Fetch occupied slots
  useEffect(() => {
    async function fetchOccupied() {
      try {
        const res = await fetch("https://cypher-3bft.onrender.com/occupied");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: ParkingSpot[] = await res.json();
        setOccupied(data);
      } catch (err) {
        console.error("Failed to fetch occupied slots:", err);
      }
    }

    fetchOccupied();
    const interval = setInterval(fetchOccupied, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // Fetch my allocated slot (will call GET /allocate)
  useEffect(() => {
    async function fetchMySlot() {
      try {
        const res = await fetch("https://cypher-3bft.onrender.com/allocate");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: ParkingSpot = await res.json();
        setMySpot(data);
      } catch (err) {
        console.error("Failed to fetch my slot:", err);
      }
    }

    fetchMySlot();
  }, []);

  // compute summary counts without comparing to a non-existent 'unavailable' string type
  const availableCount = spots.filter((s) => s.status === "available").length;
  const occupiedCount = spots.filter((s) => s.status === "occupied").length;
  const unavailableCount = spots.length - availableCount - occupiedCount;

  const summary = {
    available: availableCount,
    occupied: occupiedCount,
    unavailable: unavailableCount,
  };

  const notifications = [
    { type: "alert", message: "Block D is nearly full" },
    { type: "info", message: "Camera 2 connection restored" },
    { type: "update", message: "New AR navigation update available" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero p-4 md:p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Parking Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Badge
            variant="secondary"
            className="bg-primary/20 text-primary border-primary flex items-center gap-2"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
            Live Monitoring
          </Badge>
          <button
      onClick={() => navigate("/findmycar")}
      className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg text-sm shadow hover:shadow-primary transition"
    >
      Find My Car
    </button>
  </div>
</header>


      {/* Parking Map Section */}
<section className="mb-6 md:mb-10">
  <Card className="bg-gradient-card border-border shadow-card p-4">
    <CardHeader>
      <CardTitle className="text-xl flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse border-white"></span>
        Live Parking Map
      </CardTitle>
    </CardHeader>
    <CardContent>
      {/* Mobile-first container */}
      <div
        id="map-container" // ✅ Added ID here
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-lg border border-border relative"
      >
        <div className="absolute inset-0 overflow-auto touch-pan-y touch-pan-x">
          <div className="min-w-[600px] md:min-w-full min-h-[300px]">
            <ParkingMap occupied={occupied} mySpot={mySpot} />
          </div>
        </div>
      </div>

      {/* Fullscreen button */}
      <div className="flex justify-end mt-2 md:hidden">
        <button
          onClick={() => {
            const el = document.getElementById("map-container");
            if (el?.requestFullscreen) {
              el.requestFullscreen();
            } else if ((el as any)?.webkitRequestFullscreen) {
              (el as any).webkitRequestFullscreen(); // Safari
            } else if ((el as any)?.msRequestFullscreen) {
              (el as any).msRequestFullscreen(); // IE11
            }
          }}
          className="px-3 py-1 text-xs rounded bg-primary text-white shadow"
        >
          Expand Map
        </button>
      </div>
    </CardContent>
  </Card>
</section>





      {/* Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-10">
        <Card className="bg-gradient-card border-border shadow-card backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-primary">{spots.length}+</CardTitle>
          </CardHeader>
          <CardContent>Spots Tracked</CardContent>
        </Card>
        <Card className="bg-gradient-card border-border shadow-card backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-green-500">&lt; 2s</CardTitle>
          </CardHeader>
          <CardContent>Update Speed</CardContent>
        </Card>
        <Card className="bg-gradient-card border-border shadow-card backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-yellow-500">24/7</CardTitle>
          </CardHeader>
          <CardContent>Monitoring</CardContent>
        </Card>
        <Card className="bg-gradient-card border-border shadow-card backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-primary">99.2%</CardTitle>
          </CardHeader>
          <CardContent>Detection Accuracy</CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
        <Card className="bg-gradient-card border-border shadow-card hover:shadow-primary/20 transition-all duration-300 backdrop-blur-xl">
          <CardHeader className="flex flex-col items-center">
            <Eye className="h-8 w-8 text-green-500 mb-2" />
            <CardTitle>Real-time Detection</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-center">
            AI-powered cameras update availability instantly
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border shadow-card hover:shadow-primary/20 transition-all duration-300 backdrop-blur-xl">
          <CardHeader className="flex flex-col items-center">
            <Smartphone className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Smart Location Saving</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-center">
            Auto-save your parking spot with GPS & landmarks
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border shadow-card hover:shadow-primary/20 transition-all duration-300 backdrop-blur-xl">
          <CardHeader className="flex flex-col items-center">
            <Navigation2 className="h-8 w-8 text-yellow-500 mb-2" />
            <CardTitle>AR Navigation</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-center">
            Navigate back to your car with AR guidance
          </CardContent>
        </Card>
      </section>

      {/* Availability Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-gray-500">Available</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.available} spots
            <Progress
              value={(summary.available / spots.length) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-red-500">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.occupied} spots
            <Progress
              value={(summary.occupied / spots.length) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-gray-500">Unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.unavailable} spots
            <Progress
              value={(summary.unavailable / spots.length) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </section>

      {/* User Parking Status + Notifications + System Health */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            <CardTitle>Your Car</CardTitle>
          </CardHeader>
          <CardContent>
            {mySpot ? (
              <>
                Parked at <strong>Block {mySpot.block}-{mySpot.number}</strong>{" "}
                <br />
              </>
            ) : (
              "No car allocated yet"
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-500" />
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 text-sm space-y-1">
              {notifications.map((note, i) => (
                <li key={i} className="flex items-center gap-2">
                  {note.type === "alert" && <span>⚠️</span>}
                  {note.type === "info" && <span>ℹ️</span>}
                  {note.type === "update" && <span>⬆️</span>}
                  {note.message}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            ✅ Cameras Online <br />
            ✅ Database Connected <br />✅ 99.9% Uptime
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
