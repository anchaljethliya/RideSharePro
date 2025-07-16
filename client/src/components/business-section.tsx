import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CreditCard, Users, BarChart3, Clock, Shield, ArrowRight, CheckCircle } from "lucide-react";

export default function BusinessSection() {
  const features = [
    {
      icon: CreditCard,
      title: "Centralized Billing",
      description: "Unified payment system for all business transportation needs"
    },
    {
      icon: Clock,
      title: "24/7 Premium Support",
      description: "Dedicated business support team available around the clock"
    },
    {
      icon: Users,
      title: "Employee Management",
      description: "Streamlined tools for managing team rides and deliveries"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and spending insights"
    }
  ];

  const stats = [
    { value: "500K+", label: "Companies Trust Us" },
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "60%", label: "Average Cost Savings" }
  ];

  return (
    <section id="business" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 gradient-secondary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Business Visual */}
          <div className="animate-fade-in lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-3xl opacity-20 blur-3xl transform rotate-6"></div>
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
                alt="Business professionals using premium transportation solutions"
                className="relative w-full h-auto rounded-3xl shadow-2xl hover-lift"
                loading="lazy"
              />
              
              {/* Floating Business Stats */}
              <div className="absolute top-6 right-6 glass-morphism rounded-2xl p-6 animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-success rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Monthly Savings</div>
                    <div className="text-2xl font-bold text-green-600">₹2.5L</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 glass-morphism rounded-2xl p-6 animate-float" style={{ animationDelay: '3s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Enterprise Grade</div>
                    <div className="text-lg font-bold text-purple-600">Security</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="animate-slide-up space-y-8 lg:order-1">
            <Badge className="gradient-secondary text-white px-4 py-2 text-sm font-medium">
              <Building2 className="w-4 h-4 mr-2" />
              Enterprise Solutions
            </Badge>

            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900">Business</span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Transformed
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Enterprise-grade transportation management with advanced analytics, 
                centralized billing, and dedicated support for businesses of all sizes.
              </p>
            </div>

            {/* Business Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="glass-morphism hover-lift border-white/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Business Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Business Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gradient-primary hover:opacity-90 transition-opacity duration-300 rounded-xl px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl">
                <div className="flex items-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>
              <Button variant="outline" size="lg" className="rounded-xl px-8 py-4 border-2 border-purple-200 hover:border-purple-300 transition-colors">
                View Solutions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
