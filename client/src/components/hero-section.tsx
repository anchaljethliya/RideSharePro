import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { rideBookingSchema, type RideBooking } from "@shared/schema";
import { Link } from "wouter";
import { MapPin, Navigation, Clock, Star, Zap, ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const { toast } = useToast();
  const [priceData, setPriceData] = useState<any>(null);

  const form = useForm<RideBooking>({
    resolver: zodResolver(rideBookingSchema),
    defaultValues: {
      pickupLocation: "",
      dropoffLocation: "",
      rideType: "standard",
    },
  });

  const calculatePriceMutation = useMutation({
    mutationFn: async (data: RideBooking) => {
      const response = await apiRequest(
        "GET",
        `/api/rides/calculate-price?pickupLocation=${encodeURIComponent(data.pickupLocation)}&dropoffLocation=${encodeURIComponent(data.dropoffLocation)}&rideType=${data.rideType}`
      );
      return response.json();
    },
    onSuccess: (data) => {
      setPriceData(data);
      toast({
        title: "Price calculated successfully",
        description: `Estimated fare: ₹${data.totalFare}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error calculating price",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RideBooking) => {
    calculatePriceMutation.mutate(data);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 gradient-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 gradient-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in space-y-8">
            {/* Hero Badge */}
            <Badge className="gradient-primary text-white px-4 py-2 text-sm font-medium animate-pulse-slow">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Transportation Experience
            </Badge>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Elevate
                </span>
                <br />
                <span className="text-gray-900">Your Journey</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Experience premium transportation with cutting-edge technology, 
                real-time tracking, and unparalleled comfort at your fingertips.
              </p>
            </div>

            {/* Ride Booking Form */}
            <Card className="glass-morphism hover-lift border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Book Your Ride</h3>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Pickup Location */}
                    <FormField
                      control={form.control}
                      name="pickupLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MapPin className="w-5 h-5 text-green-500" />
                              </div>
                              <Input
                                placeholder="Pickup location"
                                className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-purple-500 transition-colors"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Dropoff Location */}
                    <FormField
                      control={form.control}
                      name="dropoffLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Navigation className="w-5 h-5 text-red-500" />
                              </div>
                              <Input
                                placeholder="Dropoff location"
                                className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-purple-500 transition-colors"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* See Prices Button */}
                    <Button 
                      type="submit" 
                      className="w-full h-14 gradient-primary hover:opacity-90 transition-opacity duration-300 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl"
                      disabled={calculatePriceMutation.isPending}
                    >
                      {calculatePriceMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Calculating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>See Prices</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>

                {/* Price Display */}
                {priceData && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <Star className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Estimated Fare</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Base fare:</span>
                        <span className="font-medium">₹{priceData.baseFare}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Distance ({priceData.distance} km):</span>
                        <span className="font-medium">₹{(parseFloat(priceData.distance) * parseFloat(priceData.perKmRate)).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total:</span>
                          <span className="text-2xl font-bold text-green-600">₹{priceData.totalFare}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1M+</div>
                <div className="text-sm text-gray-600">Happy Riders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4.9★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="animate-slide-up">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-3xl opacity-20 blur-3xl transform rotate-6"></div>
              <img
                src="https://images.unsplash.com/photo-1551474082-96b037e3ca5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Modern premium transportation interface"
                className="relative w-full h-auto rounded-3xl shadow-2xl hover-lift"
                loading="lazy"
              />
              
              {/* Floating Elements */}
              <div className="absolute top-6 right-6 glass-morphism rounded-2xl p-4 animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 gradient-success rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">ETA</div>
                    <div className="text-xs text-gray-600">5 mins</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 glass-morphism rounded-2xl p-4 animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Driver</div>
                    <div className="text-xs text-gray-600">4.9 ⭐</div>
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
