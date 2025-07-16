import { pgTable, text, serial, integer, boolean, timestamp, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  userType: text("user_type").notNull().default("rider"), // rider, driver, admin
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  vehicleType: text("vehicle_type").notNull(),
  vehicleModel: text("vehicle_model").notNull(),
  vehiclePlate: text("vehicle_plate").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  isOnline: boolean("is_online").notNull().default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  totalRides: integer("total_rides").notNull().default(0),
  earnings: decimal("earnings", { precision: 10, scale: 2 }).default("0.00"),
  currentLocation: text("current_location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  riderId: integer("rider_id").references(() => users.id).notNull(),
  driverId: integer("driver_id").references(() => drivers.id),
  pickupLocation: text("pickup_location").notNull(),
  dropoffLocation: text("dropoff_location").notNull(),
  pickupCoords: text("pickup_coords"),
  dropoffCoords: text("dropoff_coords"),
  status: text("status").notNull().default("pending"), // pending, accepted, in_progress, completed, cancelled
  fare: decimal("fare", { precision: 8, scale: 2 }),
  estimatedDuration: integer("estimated_duration"), // in minutes
  actualDuration: integer("actual_duration"), // in minutes
  distance: decimal("distance", { precision: 8, scale: 2 }), // in km
  rideType: text("ride_type").notNull().default("standard"), // standard, premium, shared
  createdAt: timestamp("created_at").defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  contactPerson: text("contact_person").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  totalRides: integer("total_rides").notNull().default(0),
  monthlySpend: decimal("monthly_spend", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const priceCalculations = pgTable("price_calculations", {
  id: serial("id").primaryKey(),
  pickupLocation: text("pickup_location").notNull(),
  dropoffLocation: text("dropoff_location").notNull(),
  distance: decimal("distance", { precision: 8, scale: 2 }).notNull(),
  baseFare: decimal("base_fare", { precision: 8, scale: 2 }).notNull(),
  perKmRate: decimal("per_km_rate", { precision: 8, scale: 2 }).notNull(),
  totalFare: decimal("total_fare", { precision: 8, scale: 2 }).notNull(),
  rideType: text("ride_type").notNull().default("standard"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  createdAt: true,
  rating: true,
  totalRides: true,
  earnings: true,
});

export const insertRideSchema = createInsertSchema(rides).omit({
  id: true,
  createdAt: true,
  startedAt: true,
  completedAt: true,
});

export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  createdAt: true,
  totalRides: true,
  monthlySpend: true,
});

export const insertPriceCalculationSchema = createInsertSchema(priceCalculations).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = z.infer<typeof insertDriverSchema>;

export type Ride = typeof rides.$inferSelect;
export type InsertRide = z.infer<typeof insertRideSchema>;

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;

export type PriceCalculation = typeof priceCalculations.$inferSelect;
export type InsertPriceCalculation = z.infer<typeof insertPriceCalculationSchema>;

// Additional schemas for forms
export const rideBookingSchema = z.object({
  pickupLocation: z.string().min(3, "Pickup location must be at least 3 characters"),
  dropoffLocation: z.string().min(3, "Dropoff location must be at least 3 characters"),
  rideType: z.enum(["standard", "premium", "shared"]).default("standard"),
});

export const driverSignupSchema = insertDriverSchema.extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const businessSignupSchema = insertBusinessSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RideBooking = z.infer<typeof rideBookingSchema>;
export type DriverSignup = z.infer<typeof driverSignupSchema>;
export type BusinessSignup = z.infer<typeof businessSignupSchema>;
