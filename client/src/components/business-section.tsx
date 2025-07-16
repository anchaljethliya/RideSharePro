import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function BusinessSection() {
  const features = [
    {
      title: "Centralized billing",
      description: "Manage all your business transportation expenses in one place"
    },
    {
      title: "24/7 support",
      description: "Get help whenever you need it with dedicated business support"
    },
    {
      title: "Employee management",
      description: "Easy tools to manage employee rides and meal deliveries"
    },
    {
      title: "Detailed reporting",
      description: "Track spending and usage with comprehensive analytics"
    }
  ];

  return (
    <section id="business" className="py-16 lg:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
              The Uber you know, reimagined for business
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Uber for Business is a platform for managing global rides and meals, and local deliveries, for companies of any size.
            </p>
            
            {/* Business Features */}
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Business Actions */}
            <div className="space-y-4">
              <Button size="lg" className="w-full lg:w-auto">
                Get started
              </Button>
              <div className="lg:ml-4">
                <Button variant="link" className="text-primary">
                  Check out our solutions
                </Button>
              </div>
            </div>
          </div>

          {/* Business Image */}
          <div className="animate-slide-up">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
              alt="Business professionals using urban transportation solutions"
              className="w-full h-auto rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
