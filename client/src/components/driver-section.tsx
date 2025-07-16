import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Car, DollarSign, Clock, TrendingUp, Users, Shield, Star, ArrowRight } from "lucide-react";

export default function DriverSection() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Flexible Earnings",
      description: "Earn on your schedule with guaranteed minimum rates"
    },
    {
      icon: Clock,
      title: "Time Freedom",
      description: "Work when you want, take breaks when you need"
    },
    {
      icon: Shield,
      title: "Insurance Coverage",
      description: "Comprehensive coverage while you're driving"
    },
    {
      icon: Star,
      title: "Top Rated Platform",
      description: "Join the highest-rated rideshare platform"
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-10 w-96 h-96 gradient-secondary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in space-y-8">
            <Badge className="gradient-accent text-white px-4 py-2 text-sm font-medium">
              <Car className="w-4 h-4 mr-2" />
              Driver Partnership Program
            </Badge>

            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900">Drive with</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Purpose
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Transform your vehicle into a source of income. Join thousands of drivers 
                earning premium rates with flexible schedules and comprehensive support.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <Card key={index} className="glass-morphism hover-lift border-white/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Driver Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/driver-signup">
                <Button size="lg" className="gradient-primary hover:opacity-90 transition-opacity duration-300 rounded-xl px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl">
                  <div className="flex items-center space-x-2">
                    <span>Start Driving</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="rounded-xl px-8 py-4 border-2 border-purple-200 hover:border-purple-300 transition-colors">
                  Already driving? Sign in
                </Button>
              </Link>
            </div>
          </div>

          {/* Driver Visual */}
          <div className="animate-slide-up">
            <div className="relative">
              <div className="absolute inset-0 gradient-accent rounded-3xl opacity-20 blur-3xl transform -rotate-6"></div>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
                alt="Professional driver ready to earn premium income"
                className="relative w-full h-auto rounded-3xl shadow-2xl hover-lift"
                loading="lazy"
              />
              
              {/* Floating Stats */}
              <div className="absolute top-6 left-6 glass-morphism rounded-2xl p-6 animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-success rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Monthly Earnings</div>
                    <div className="text-2xl font-bold text-green-600">₹35,000</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-6 right-6 glass-morphism rounded-2xl p-6 animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Active Drivers</div>
                    <div className="text-2xl font-bold text-purple-600">1.2M+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
