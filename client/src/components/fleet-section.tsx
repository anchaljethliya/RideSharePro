import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FleetSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Fleet Image */}
          <div className="animate-fade-in">
            <img
              src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
              alt="Modern vehicle fleet for urban transportation management"
              className="w-full h-auto rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="animate-slide-up">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
              Make money by renting out your car
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with thousands of drivers and earn more per week with Uber's free fleet management tools.
            </p>
            
            {/* Fleet Benefits */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">₹8,000</div>
                    <div className="text-sm text-muted-foreground">Weekly earnings potential</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">500+</div>
                    <div className="text-sm text-muted-foreground">Active fleet partners</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button size="lg" className="w-full lg:w-auto">
              Get started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
