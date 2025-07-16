import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Star, Shield, Download, Apple, Play, ArrowRight, Zap } from "lucide-react";

export default function AppDownloadSection() {
  const appFeatures = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Seamlessly designed for mobile with intuitive navigation and premium UX"
    },
    {
      icon: Star,
      title: "Premium Experience",
      description: "Enhanced features with real-time tracking and exclusive rewards program"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-level security with encrypted transactions and verified drivers"
    }
  ];

  const stats = [
    { number: "4.9", label: "App Store Rating", icon: Star },
    { number: "50M+", label: "Downloads", icon: Download },
    { number: "1M+", label: "Active Users", icon: Smartphone }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-32 w-96 h-96 gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 gradient-secondary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="gradient-primary text-white px-6 py-3 text-sm font-medium mb-6">
            <Download className="w-4 h-4 mr-2" />
            Download Our App
          </Badge>
          <h2 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-gray-900">Get the</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Full Experience
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Download our premium app for the ultimate ride-booking experience with enhanced features, 
            real-time tracking, and exclusive rewards that make every journey extraordinary.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* App Preview */}
          <div className="animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-3xl opacity-20 blur-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800"
                alt="RideFlow mobile app interface showing premium features"
                className="relative w-full max-w-md mx-auto h-auto rounded-3xl shadow-2xl hover-lift"
                loading="lazy"
              />
              
              {/* Floating Elements */}
              <div className="absolute top-10 right-10 glass-morphism rounded-2xl p-4 animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 gradient-success rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Rating</div>
                    <div className="text-lg font-bold text-yellow-600">4.9★</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-10 left-10 glass-morphism rounded-2xl p-4 animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Secure</div>
                    <div className="text-lg font-bold text-green-600">100%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="animate-slide-up space-y-8">
            {/* Features */}
            <div className="space-y-4">
              {appFeatures.map((feature, index) => (
                <Card key={index} className="glass-morphism hover-lift border-white/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gradient-primary hover:opacity-90 transition-opacity duration-300 rounded-xl px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center space-x-2">
                  <Apple className="w-5 h-5" />
                  <span>Download for iOS</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-purple-200 hover:border-purple-300 rounded-xl px-8 py-4 font-semibold transition-all duration-300"
              >
                <div className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Download for Android</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}