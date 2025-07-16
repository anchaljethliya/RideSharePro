import { users, drivers, rides, businesses, priceCalculations, type User, type InsertUser, type Driver, type InsertDriver, type Ride, type InsertRide, type Business, type InsertBusiness, type PriceCalculation, type InsertPriceCalculation } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Driver operations
  getDriver(id: number): Promise<Driver | undefined>;
  getDriverByUserId(userId: number): Promise<Driver | undefined>;
  getDriverByLicense(licenseNumber: string): Promise<Driver | undefined>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: number, driver: Partial<Driver>): Promise<Driver | undefined>;
  getOnlineDrivers(): Promise<Driver[]>;
  updateDriverStatus(id: number, isOnline: boolean): Promise<Driver | undefined>;
  
  // Ride operations
  getRide(id: number): Promise<Ride | undefined>;
  getRidesByRider(riderId: number): Promise<Ride[]>;
  getRidesByDriver(driverId: number): Promise<Ride[]>;
  createRide(ride: InsertRide): Promise<Ride>;
  updateRide(id: number, ride: Partial<Ride>): Promise<Ride | undefined>;
  getPendingRides(): Promise<Ride[]>;
  
  // Business operations
  getBusiness(id: number): Promise<Business | undefined>;
  getBusinessByEmail(email: string): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, business: Partial<Business>): Promise<Business | undefined>;
  
  // Price calculation operations
  createPriceCalculation(calculation: InsertPriceCalculation): Promise<PriceCalculation>;
  getPriceCalculation(pickupLocation: string, dropoffLocation: string): Promise<PriceCalculation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private drivers: Map<number, Driver>;
  private rides: Map<number, Ride>;
  private businesses: Map<number, Business>;
  private priceCalculations: Map<number, PriceCalculation>;
  
  private currentUserId: number;
  private currentDriverId: number;
  private currentRideId: number;
  private currentBusinessId: number;
  private currentPriceCalculationId: number;

  constructor() {
    this.users = new Map();
    this.drivers = new Map();
    this.rides = new Map();
    this.businesses = new Map();
    this.priceCalculations = new Map();
    
    this.currentUserId = 1;
    this.currentDriverId = 1;
    this.currentRideId = 1;
    this.currentBusinessId = 1;
    this.currentPriceCalculationId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      phone: insertUser.phone || null,
      userType: insertUser.userType || "rider",
      isActive: insertUser.isActive !== undefined ? insertUser.isActive : true,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Driver operations
  async getDriver(id: number): Promise<Driver | undefined> {
    return this.drivers.get(id);
  }

  async getDriverByUserId(userId: number): Promise<Driver | undefined> {
    return Array.from(this.drivers.values()).find(driver => driver.userId === userId);
  }

  async getDriverByLicense(licenseNumber: string): Promise<Driver | undefined> {
    return Array.from(this.drivers.values()).find(driver => driver.licenseNumber === licenseNumber);
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const id = this.currentDriverId++;
    const driver: Driver = {
      ...insertDriver,
      id,
      isVerified: false,
      isOnline: false,
      rating: "5.00",
      totalRides: 0,
      earnings: "0.00",
      currentLocation: null,
      createdAt: new Date(),
    };
    this.drivers.set(id, driver);
    return driver;
  }

  async updateDriver(id: number, driverData: Partial<Driver>): Promise<Driver | undefined> {
    const driver = this.drivers.get(id);
    if (!driver) return undefined;
    
    const updatedDriver = { ...driver, ...driverData };
    this.drivers.set(id, updatedDriver);
    return updatedDriver;
  }

  async getOnlineDrivers(): Promise<Driver[]> {
    return Array.from(this.drivers.values()).filter(driver => driver.isOnline);
  }

  async updateDriverStatus(id: number, isOnline: boolean): Promise<Driver | undefined> {
    return this.updateDriver(id, { isOnline });
  }

  // Ride operations
  async getRide(id: number): Promise<Ride | undefined> {
    return this.rides.get(id);
  }

  async getRidesByRider(riderId: number): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(ride => ride.riderId === riderId);
  }

  async getRidesByDriver(driverId: number): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(ride => ride.driverId === driverId);
  }

  async createRide(insertRide: InsertRide): Promise<Ride> {
    const id = this.currentRideId++;
    const ride: Ride = {
      ...insertRide,
      id,
      createdAt: new Date(),
      startedAt: null,
      completedAt: null,
      status: insertRide.status || "pending",
      driverId: insertRide.driverId || null,
      pickupCoords: insertRide.pickupCoords || null,
      dropoffCoords: insertRide.dropoffCoords || null,
      fare: insertRide.fare || null,
      estimatedDuration: insertRide.estimatedDuration || null,
      actualDuration: insertRide.actualDuration || null,
      distance: insertRide.distance || null,
      rideType: insertRide.rideType || "standard",
    };
    this.rides.set(id, ride);
    return ride;
  }

  async updateRide(id: number, rideData: Partial<Ride>): Promise<Ride | undefined> {
    const ride = this.rides.get(id);
    if (!ride) return undefined;
    
    const updatedRide = { ...ride, ...rideData };
    this.rides.set(id, updatedRide);
    return updatedRide;
  }

  async getPendingRides(): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(ride => ride.status === "pending");
  }

  // Business operations
  async getBusiness(id: number): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async getBusinessByEmail(email: string): Promise<Business | undefined> {
    return Array.from(this.businesses.values()).find(business => business.email === email);
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = this.currentBusinessId++;
    const business: Business = {
      ...insertBusiness,
      id,
      totalRides: 0,
      monthlySpend: "0.00",
      createdAt: new Date(),
      address: insertBusiness.address || null,
      phone: insertBusiness.phone || null,
      isActive: insertBusiness.isActive !== undefined ? insertBusiness.isActive : true,
    };
    this.businesses.set(id, business);
    return business;
  }

  async updateBusiness(id: number, businessData: Partial<Business>): Promise<Business | undefined> {
    const business = this.businesses.get(id);
    if (!business) return undefined;
    
    const updatedBusiness = { ...business, ...businessData };
    this.businesses.set(id, updatedBusiness);
    return updatedBusiness;
  }

  // Price calculation operations
  async createPriceCalculation(insertCalculation: InsertPriceCalculation): Promise<PriceCalculation> {
    const id = this.currentPriceCalculationId++;
    const calculation: PriceCalculation = {
      ...insertCalculation,
      id,
      createdAt: new Date(),
      rideType: insertCalculation.rideType || "standard",
    };
    this.priceCalculations.set(id, calculation);
    return calculation;
  }

  async getPriceCalculation(pickupLocation: string, dropoffLocation: string): Promise<PriceCalculation | undefined> {
    return Array.from(this.priceCalculations.values()).find(
      calc => calc.pickupLocation === pickupLocation && calc.dropoffLocation === dropoffLocation
    );
  }
}

export const storage = new MemStorage();
