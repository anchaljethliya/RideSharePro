import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { rideBookingSchema, type RideBooking } from "@shared/schema";
import { Link } from "wouter";

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
    <section className="relative bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12 lg:py-20">
          {/* Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-8">
              Go anywhere with Uber
            </h1>
            
            {/* Ride Booking Form */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Pickup Location */}
                    <FormField
                      control={form.control}
                      name="pickupLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                              </div>
                              <Input
                                placeholder="Pickup location"
                                className="pl-10"
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
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <div className="w-3 h-3 bg-destructive rounded-sm"></div>
                              </div>
                              <Input
                                placeholder="Dropoff location"
                                className="pl-10"
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
                      className="w-full"
                      disabled={calculatePriceMutation.isPending}
                    >
                      {calculatePriceMutation.isPending ? "Calculating..." : "See prices"}
                    </Button>
                  </form>
                </Form>

                {/* Price Display */}
                {priceData && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Estimated Fare</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Base fare:</span>
                        <span>₹{priceData.baseFare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Distance ({priceData.distance} km):</span>
                        <span>₹{(parseFloat(priceData.distance) * parseFloat(priceData.perKmRate)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-base border-t pt-2">
                        <span>Total:</span>
                        <span>₹{priceData.totalFare}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent activity</h3>
                <p className="text-muted-foreground mb-4">
                  View past trips, tailored suggestions, support resources, and more.
                </p>
                <div className="space-y-3">
                  <Link href="/login">
                    <Button variant="secondary" className="w-full">
                      Log in to your account
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="ghost" className="w-full text-primary">
                      Don't have an Uber account? Sign up
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hero Image */}
          <div className="animate-slide-up">
            <img
              src="https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Modern rideshare interface showing urban transportation"
              className="w-full h-auto rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
