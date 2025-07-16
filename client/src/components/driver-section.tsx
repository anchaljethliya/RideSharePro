import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function DriverSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Driver Image */}
          <div className="animate-fade-in">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
              alt="Professional driver in urban setting ready to earn money"
              className="w-full h-auto rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="animate-slide-up">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
              Drive when you want, make what you need
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Make money on your schedule with deliveries or rides—or both. You can use your own car or choose a rental through Uber.
            </p>
            
            {/* Driver Actions */}
            <div className="space-y-4">
              <Link href="/driver-signup">
                <Button size="lg" className="w-full lg:w-auto">
                  Get started
                </Button>
              </Link>
              <div className="lg:ml-4">
                <Link href="/login">
                  <Button variant="link" className="text-primary">
                    Already have an account? Sign in
                  </Button>
                </Link>
              </div>
            </div>

            {/* Driver Stats */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">1M+</div>
                  <div className="text-muted-foreground">Active drivers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">₹25,000</div>
                  <div className="text-muted-foreground">Avg monthly earnings</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
