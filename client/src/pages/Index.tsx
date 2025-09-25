import { useState } from "react";
import ParkingLot from "@/components/ParkingLot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, Smartphone, Zap, Eye, Navigation2 } from "lucide-react";
import heroImage from "@/assets/parking-hero.jpg";

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-transparent z-10" />
        <img 
          src={heroImage} 
          alt="Smart parking lot with digital monitoring system"
          className="w-full h-[60vh] object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
            <Badge 
              variant="secondary" 
              className="mb-4 bg-primary/20 text-primary border-primary animate-float"
            >
              🚀 Smart City Technology
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Smart Parking
              <br />
              <span className="text-primary">Assistant</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Never lose your car again. Find available spots instantly with real-time monitoring and AI-powered assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                onClick={() => setShowDemo(true)}
                className="bg-gradient-primary hover:shadow-primary text-primary-foreground font-semibold px-8 py-6 text-lg"
              >
                <Car className="mr-2 h-5 w-5" />
                Try Live Demo
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-border hover:bg-secondary/50 px-8 py-6 text-lg"
              >
                <Eye className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Features Section */}
        <section className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced computer vision and real-time data processing for seamless parking experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-border shadow-card hover:shadow-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-available/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Eye className="h-6 w-6 text-available" />
                </div>
                <CardTitle>Real-time Detection</CardTitle>
                <CardDescription>
                  AI-powered cameras monitor parking spots 24/7, instantly updating availability status
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-border shadow-card hover:shadow-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Location Saving</CardTitle>
                <CardDescription>
                  Automatically save your parking spot with GPS precision and visual landmarks
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-border shadow-card hover:shadow-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Navigation2 className="h-6 w-6 text-warning" />
                </div>
                <CardTitle>AR Navigation</CardTitle>
                <CardDescription>
                  Augmented reality guidance helps you navigate back to your car with ease
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Demo Section */}
        {showDemo && (
          <section className="space-y-8" id="demo">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Interactive Demo</h2>
              <p className="text-xl text-muted-foreground">
                Try the parking assistant with live simulation data
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <ParkingLot />
            </div>
          </section>
        )}

        {/* Tech Stats */}
        <section className="grid md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">99.2%</div>
            <div className="text-muted-foreground">Detection Accuracy</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-available">&lt; 2s</div>
            <div className="text-muted-foreground">Update Speed</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-warning">24/7</div>
            <div className="text-muted-foreground">Monitoring</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-muted-foreground">Spots Tracked</div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-8 py-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Parking?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the smart city revolution and never waste time looking for parking again
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-primary hover:shadow-primary text-primary-foreground font-semibold px-8"
            >
              <Zap className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-border hover:bg-secondary/50 px-8"
            >
              Learn More
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
