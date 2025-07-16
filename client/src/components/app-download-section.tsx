import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Car } from "lucide-react";

export default function AppDownloadSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            It's easier in the apps
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rider App */}
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center">
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
                alt="Mobile app interface showing ride booking features"
                className="w-full h-48 object-cover rounded-lg mb-6"
                loading="lazy"
              />
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Download the Uber app</h3>
              <p className="text-muted-foreground mb-6">Book rides, track your trip, and pay seamlessly</p>
              <Button className="w-full">
                Download Rider App
              </Button>
            </CardContent>
          </Card>

          {/* Driver App */}
          <Card className="animate-slide-up">
            <CardContent className="p-8 text-center">
              <img
                src="https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
                alt="Mobile app interface showing driver dashboard and earnings"
                className="w-full h-48 object-cover rounded-lg mb-6"
                loading="lazy"
              />
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Download the Driver app</h3>
              <p className="text-muted-foreground mb-6">Start driving and earning on your schedule</p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                Download Driver App
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
