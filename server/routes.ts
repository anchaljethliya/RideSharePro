/*
API Endpoints:

# Auth
POST   /api/auth/register         Register a new user
POST   /api/auth/login            Login a user

# Users
GET    /api/users/:id             Get user by ID

# Drivers
POST   /api/drivers/register      Register a new driver
GET    /api/drivers/:id           Get driver by ID
GET    /api/drivers/:id/location  Get driver location

# Rides
POST   /api/rides                 Request a new ride
POST   /api/rides/:id/assign      Assign a driver to a ride
PATCH  /api/rides/:id/status      Update ride status
GET    /api/rides/rider/:riderId  Get rides by rider
GET    /api/rides/driver/:driverId Get rides by driver
PATCH  /api/rides/:id             Update ride (generic)

# Price Calculation
GET    /api/rides/calculate-price Calculate ride price

# Premium
GET    /api/premium/surge-info    Get surge pricing info
GET    /api/premium/ride-types    Get available ride types
GET    /api/premium/analytics     Get analytics
POST   /api/premium/feedback      Submit feedback

# Business
POST   /api/business/register     Register a business
*/
import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertDriverSchema, insertRideSchema, insertBusinessSchema, rideBookingSchema, driverSignupSchema, businessSignupSchema, insertPriceCalculationSchema } from "@shared/schema";
import { z } from "zod";

interface WebSocketClient extends WebSocket {
  userId?: number;
  userType?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active WebSocket connections
  const clients = new Map<number, WebSocketClient>();
  
  wss.on('connection', (ws: WebSocketClient, req) => {
    console.log('🔗 New Premium WebSocket connection');
    
    // Send welcome message with premium features
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Welcome to RideFlow Premium Real-time Service',
      features: ['real-time-tracking', 'instant-notifications', 'priority-support'],
      timestamp: new Date().toISOString()
    }));
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'auth') {
          ws.userId = data.userId;
          ws.userType = data.userType;
          clients.set(data.userId, ws);
          
          ws.send(JSON.stringify({
            type: 'auth_success',
            message: 'Premium authentication successful',
            userId: data.userId,
            userType: data.userType,
            timestamp: new Date().toISOString(),
            premiumFeatures: getPremiumFeatures(data.userType || 'standard')
          }));
          
          console.log(`✅ Premium user authenticated: ${data.userId} (${data.userType})`);
        }
        
        if (data.type === 'driver_location_update' && ws.userId) {
          const driver = await storage.getDriverByUserId(ws.userId);
          if (driver) {
            await storage.updateDriver(driver.id, { currentLocation: data.location });
            
            // Broadcast enhanced location update to relevant clients
            broadcastToClients('driver_location_update', {
              driverId: driver.id,
              location: data.location,
              timestamp: new Date().toISOString(),
              speed: data.speed || 0,
              heading: data.heading || 0,
              accuracy: data.accuracy || 5,
              isOnline: driver.isOnline
            });
          }
        }
        
        if (data.type === 'ride_status_update' && ws.userId) {
          // Enhanced ride status updates with premium features
          broadcastToClients('ride_status_update', {
            rideId: data.rideId,
            status: data.status,
            timestamp: new Date().toISOString(),
            estimatedTime: data.estimatedTime,
            message: data.message,
            userId: ws.userId
          });
        }
        
      } catch (error) {
        console.error('❌ Premium WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Message processing failed',
          timestamp: new Date().toISOString()
        }));
      }
    });
    
    ws.on('close', () => {
      if (ws.userId) {
        clients.delete(ws.userId);
        console.log(`🔌 Premium connection closed for user: ${ws.userId}`);
      }
    });
  });
  
  // Broadcast function for WebSocket
  function broadcastToClients(type: string, data: any) {
    const message = JSON.stringify({ type, data });
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Premium utility functions
  function getPremiumRateByType(rideType: string): number {
    const rates: { [key: string]: number } = {
      standard: 12,
      premium: 20,
      luxury: 35,
      shared: 8,
      express: 15,
    };
    return rates[rideType] || rates.standard;
  }

  function calculateSurgeMultiplier(): number {
    const hour = new Date().getHours();
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
    const isLateNight = hour >= 23 || hour <= 5;
    
    if (isRushHour) return 1.5;
    if (isLateNight) return 1.3;
    return 1.0;
  }

  function determinePriority(rideType: string): string {
    const priorities: { [key: string]: string } = {
      luxury: 'high',
      premium: 'medium',
      express: 'high',
      standard: 'normal',
      shared: 'low',
    };
    return priorities[rideType] || 'normal';
  }

  function getPremiumFeatures(rideType: string): string[] {
    const features: { [key: string]: string[] } = {
      luxury: ['premium-vehicle', 'vip-support', 'champagne-service', 'concierge'],
      premium: ['priority-pickup', 'premium-vehicle', 'enhanced-support'],
      express: ['priority-pickup', 'fastest-route', 'no-stops'],
      standard: ['real-time-tracking', 'digital-receipt'],
      shared: ['cost-sharing', 'eco-friendly', 'social-matching'],
    };
    return features[rideType] || features.standard;
  }

  function calculateCarbonOffset(distance: number): number {
    return Math.round(distance * 0.12 * 100) / 100;
  }

  function isCalculationValid(createdAt: Date | null): boolean {
    if (!createdAt) return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(createdAt) > fiveMinutesAgo;
  }

  function enhanceCalculationResponse(calculation: any) {
    const surgeMultiplier = calculateSurgeMultiplier();
    // Use calculation.estimatedDuration if present, else fallback to 2.5 * distance
    let estimatedDuration = calculation.estimatedDuration;
    if (
      estimatedDuration === undefined && calculation.distance !== undefined && !isNaN(Number(calculation.distance))
    ) {
      estimatedDuration = Math.ceil(Number(calculation.distance) * 2.5);
    }
    let estimatedArrival = null;
    if (
      estimatedDuration !== undefined &&
      !isNaN(Number(estimatedDuration)) &&
      Number(estimatedDuration) > 0
    ) {
      estimatedArrival = new Date(Date.now() + (Number(estimatedDuration) * 60000)).toISOString();
    }
    return {
      ...calculation,
      estimatedDuration,
      features: getPremiumFeatures(calculation.rideType),
      surgeInfo: {
        isActive: surgeMultiplier > 1.0,
        multiplier: surgeMultiplier,
        reason: getSurgeReason(),
      },
      estimatedArrival,
      carbonOffset: calculateCarbonOffset(parseFloat(calculation.distance)),
      rewardPoints: Math.floor(parseFloat(calculation.totalFare) * 0.1),
    };
  }

  function getSurgeReason(): string {
    const hour = new Date().getHours();
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return 'High demand during rush hour';
    }
    if (hour >= 23 || hour <= 5) {
      return 'Late night premium service';
    }
    return '';
  }

  function logPremiumRideCreation(ride: any) {
    console.log(`🚗 Premium Ride Created:
      ID: ${ride.id}
      Type: ${ride.rideType}
      Priority: ${determinePriority(ride.rideType)}
      Fare: ₹${ride.fare}
      Distance: ${ride.distance}km
      Estimated Duration: ${ride.estimatedDuration} min
      Reward Points: ${Math.floor(parseFloat(ride.fare) * 0.1)}
      Features: ${getPremiumFeatures(ride.rideType).join(', ')}
      Time: ${new Date().toLocaleString()}
    `);
  }
  
  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json({ user: { ...user, password: undefined } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // User routes
  app.get('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Driver routes
  app.post('/api/drivers/register', async (req, res) => {
    try {
      const driverData = driverSignupSchema.parse(req.body);
      
      // Check if driver license already exists
      const existingDriver = await storage.getDriverByLicense(driverData.licenseNumber);
      if (existingDriver) {
        return res.status(400).json({ message: 'Driver with this license already exists' });
      }
      
      // Create user first
      const userData = {
        username: driverData.email,
        email: driverData.email,
        password: driverData.password,
        fullName: driverData.fullName,
        phone: driverData.phone,
        userType: 'driver',
      };
      
      const user = await storage.createUser(userData);
      
      // Create driver profile
      const driver = await storage.createDriver({
        userId: user.id,
        licenseNumber: driverData.licenseNumber,
        vehicleType: driverData.vehicleType,
        vehicleModel: driverData.vehicleModel,
        vehiclePlate: driverData.vehiclePlate,
      });
      
      res.status(201).json({ user: { ...user, password: undefined }, driver });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/drivers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const driver = await storage.getDriver(id);
      
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
      
      res.json(driver);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/drivers/online', async (req, res) => {
    try {
      const drivers = await storage.getOnlineDrivers();
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.patch('/api/drivers/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isOnline } = req.body;
      
      const driver = await storage.updateDriverStatus(id, isOnline);
      
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
      
      res.json(driver);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Premium ride booking with enhanced features
  app.post('/api/rides/book', async (req, res) => {
    try {
      const rideData = rideBookingSchema.parse(req.body);
      const { riderId } = req.body;
      
      if (!riderId) {
        return res.status(400).json({ message: 'Rider ID is required' });
      }
      
      // Enhanced fare calculation with premium features
      const distance = Math.random() * 20 + 2; // Random distance between 2-22 km
      const baseFare = 50; // Increased base fare for premium service
      const perKmRate = getPremiumRateByType(rideData.rideType);
      const surgeMultiplier = calculateSurgeMultiplier();
      const fare = (baseFare + (distance * perKmRate)) * surgeMultiplier;
      
      // Calculate premium features
      const estimatedDuration = Math.ceil(distance * 2.5); // More accurate estimate
      const priority = determinePriority(rideData.rideType);
      const rewardPoints = Math.floor(fare * 0.1); // 10% in reward points
      
      const ride = await storage.createRide({
        riderId,
        pickupLocation: rideData.pickupLocation,
        dropoffLocation: rideData.dropoffLocation,
        rideType: rideData.rideType,
        fare: fare.toFixed(2),
        distance: distance.toFixed(2),
        estimatedDuration,
        status: 'pending',
      });
      
      // Store enhanced price calculation
      await storage.createPriceCalculation({
        pickupLocation: rideData.pickupLocation,
        dropoffLocation: rideData.dropoffLocation,
        distance: distance.toFixed(2),
        baseFare: baseFare.toFixed(2),
        perKmRate: perKmRate.toFixed(2),
        totalFare: fare.toFixed(2),
        rideType: rideData.rideType,
      });
      
      // Broadcast premium ride request to drivers
      broadcastToClients('premium_ride_request', {
        rideId: ride.id,
        pickupLocation: ride.pickupLocation,
        dropoffLocation: ride.dropoffLocation,
        fare: ride.fare,
        rideType: ride.rideType,
        priority: priority,
        estimatedDuration: ride.estimatedDuration,
        rewardPoints: rewardPoints,
        timestamp: new Date().toISOString(),
        features: getPremiumFeatures(rideData.rideType),
        surgeMultiplier: surgeMultiplier,
        carbonOffset: calculateCarbonOffset(distance),
      });
      
      // Send confirmation email/SMS simulation
      logPremiumRideCreation(ride);
      
      res.status(201).json(ride);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Premium price calculation with dynamic pricing
  app.get('/api/rides/calculate-price', async (req, res) => {
    try {
      const { pickupLocation, dropoffLocation, rideType = 'standard' } = req.query;

      if (!pickupLocation || !dropoffLocation) {
        return res.status(400).json({ message: 'Pickup and dropoff locations are required' });
      }
      if (typeof pickupLocation !== 'string' || typeof dropoffLocation !== 'string') {
        return res.status(400).json({ message: 'Pickup and dropoff locations must be strings' });
      }
      if (typeof rideType !== 'string') {
        return res.status(400).json({ message: 'rideType must be a string' });
      }

      // Check cached calculation (valid for 5 minutes)
      let existingCalculation;
      try {
        existingCalculation = await storage.getPriceCalculation(pickupLocation, dropoffLocation);
      } catch (err) {
        console.error('Error in getPriceCalculation:', err);
        return res.status(500).json({ message: 'Error fetching cached calculation', error: String(err) });
      }

      if (existingCalculation && isCalculationValid(existingCalculation.createdAt)) {
        return res.json(enhanceCalculationResponse(existingCalculation));
      }

      // Calculate premium pricing
      let distance, baseFare, perKmRate, surgeMultiplier, fare;
      try {
        distance = Math.random() * 20 + 2; // Random distance between 2-22 km
        baseFare = 50; // Premium base fare
        perKmRate = getPremiumRateByType(rideType);
        surgeMultiplier = calculateSurgeMultiplier();
        fare = (baseFare + (distance * perKmRate)) * surgeMultiplier;
      } catch (err) {
        console.error('Error in fare calculation:', err);
        return res.status(500).json({ message: 'Error calculating fare', error: String(err) });
      }

      // Calculate additional premium features
      let estimatedDuration, rewardPoints, carbonOffset, features;
      try {
        estimatedDuration = Math.ceil(distance * 2.5);
        rewardPoints = Math.floor(fare * 0.1);
        carbonOffset = calculateCarbonOffset(distance);
        features = getPremiumFeatures(rideType);
      } catch (err) {
        console.error('Error in premium features calculation:', err);
        return res.status(500).json({ message: 'Error calculating premium features', error: String(err) });
      }

      let calculation;
      try {
        calculation = await storage.createPriceCalculation({
          pickupLocation,
          dropoffLocation,
          distance: distance.toFixed(2),
          baseFare: baseFare.toFixed(2),
          perKmRate: perKmRate.toFixed(2),
          totalFare: fare.toFixed(2),
          rideType,
        });
      } catch (err) {
        console.error('Error in createPriceCalculation:', err);
        return res.status(500).json({ message: 'Error saving calculation', error: String(err) });
      }

      try {
        res.json(enhanceCalculationResponse(calculation));
      } catch (err) {
        console.error('Error in enhanceCalculationResponse:', err);
        res.status(500).json({ message: 'Error enhancing calculation response', error: String(err) });
      }
    } catch (error) {
      console.error('Unexpected error in /api/rides/calculate-price:', error);
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  });
  
  app.get('/api/rides/rider/:riderId', async (req, res) => {
    try {
      const riderId = parseInt(req.params.riderId);
      const rides = await storage.getRidesByRider(riderId);
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/rides/driver/:driverId', async (req, res) => {
    try {
      const driverId = parseInt(req.params.driverId);
      const rides = await storage.getRidesByDriver(driverId);
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.patch('/api/rides/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const ride = await storage.updateRide(id, updateData);
      
      if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
      }
      
      // Broadcast ride update
      broadcastToClients('ride_update', ride);
      
      res.json(ride);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Premium API endpoints for advanced features
  app.get('/api/premium/surge-info', async (req, res) => {
    try {
      const surgeMultiplier = calculateSurgeMultiplier();
      const surgeInfo = {
        isActive: surgeMultiplier > 1.0,
        multiplier: surgeMultiplier,
        reason: getSurgeReason(),
        estimatedDuration: surgeMultiplier > 1.0 ? '15-30 minutes' : '5-15 minutes',
        timestamp: new Date().toISOString()
      };
      
      res.json(surgeInfo);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch surge information' });
    }
  });
  
  app.get('/api/premium/ride-types', async (req, res) => {
    try {
      const rideTypes = [
        {
          id: 'standard',
          name: 'Standard',
          description: 'Affordable rides for everyday use',
          features: getPremiumFeatures('standard'),
          rate: getPremiumRateByType('standard'),
          icon: '🚗',
          eta: '5-10 min'
        },
        {
          id: 'premium',
          name: 'Premium',
          description: 'High-quality vehicles with enhanced comfort',
          features: getPremiumFeatures('premium'),
          rate: getPremiumRateByType('premium'),
          icon: '🚙',
          eta: '3-8 min'
        },
        {
          id: 'luxury',
          name: 'Luxury',
          description: 'Premium vehicles with VIP treatment',
          features: getPremiumFeatures('luxury'),
          rate: getPremiumRateByType('luxury'),
          icon: '🏎️',
          eta: '2-5 min'
        },
        {
          id: 'shared',
          name: 'Shared',
          description: 'Eco-friendly shared rides',
          features: getPremiumFeatures('shared'),
          rate: getPremiumRateByType('shared'),
          icon: '🌱',
          eta: '8-15 min'
        }
      ];
      
      res.json(rideTypes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch ride types' });
    }
  });
  
  app.get('/api/premium/analytics', async (req, res) => {
    try {
      const analytics = {
        totalRides: 125000,
        activeDrivers: 3500,
        averageRating: 4.8,
        completionRate: 95.2,
        customerSatisfaction: 96.5,
        carbonOffsetKg: 2400,
        timestamp: new Date().toISOString()
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  });
  
  app.post('/api/premium/feedback', async (req, res) => {
    try {
      const { rideId, rating, comment, userId } = req.body;
      
      // Simulate feedback processing
      const feedback = {
        id: Date.now(),
        rideId,
        rating,
        comment,
        userId,
        timestamp: new Date().toISOString(),
        status: 'processed'
      };
      
      console.log('📝 Premium Feedback Received:', feedback);
      
      // Broadcast feedback to relevant parties
      broadcastToClients('feedback_received', feedback);
      
      res.status(201).json({ message: 'Thank you for your premium feedback', feedback });
    } catch (error) {
      res.status(500).json({ message: 'Failed to process feedback' });
    }
  });

  // Request a new ride
  app.post('/api/rides', async (req, res) => {
    try {
      const { riderId, pickupLocation, dropoffLocation, rideType = 'standard' } = req.body;
      if (!riderId || !pickupLocation || !dropoffLocation) {
        return res.status(400).json({ message: 'riderId, pickupLocation, and dropoffLocation are required' });
      }
      const distance = Math.random() * 20 + 2;
      const baseFare = 50;
      const perKmRate = getPremiumRateByType(rideType);
      const surgeMultiplier = calculateSurgeMultiplier();
      const fare = (baseFare + (distance * perKmRate)) * surgeMultiplier;
      const estimatedDuration = Math.ceil(distance * 2.5);
      const ride = await storage.createRide({
        riderId,
        pickupLocation,
        dropoffLocation,
        rideType,
        fare: fare.toFixed(2),
        distance: distance.toFixed(2),
        estimatedDuration,
        status: 'pending',
      });
      res.status(201).json(ride);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  });

  // Assign a driver to a ride
  app.post('/api/rides/:id/assign', async (req, res) => {
    try {
      const rideId = parseInt(req.params.id);
      const { driverId } = req.body;
      if (!driverId) {
        return res.status(400).json({ message: 'driverId is required' });
      }
      const ride = await storage.updateRide(rideId, { driverId, status: 'accepted' });
      if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
      }
      res.json(ride);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  });

  // Update ride status
  app.patch('/api/rides/:id/status', async (req, res) => {
    try {
      const rideId = parseInt(req.params.id);
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: 'status is required' });
      }
      const ride = await storage.updateRide(rideId, { status });
      if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
      }
      res.json(ride);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  });

  // Get driver location
  app.get('/api/drivers/:id/location', async (req, res) => {
    try {
      const driverId = parseInt(req.params.id);
      const driver = await storage.getDriver(driverId);
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
      res.json({ location: driver.currentLocation });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  });

  // Business routes
  app.post('/api/business/register', async (req, res) => {
    try {
      const businessData = businessSignupSchema.parse(req.body);
      
      // Check if business already exists
      const existingBusiness = await storage.getBusinessByEmail(businessData.email);
      if (existingBusiness) {
        return res.status(400).json({ message: 'Business already exists with this email' });
      }
      
      const business = await storage.createBusiness({
        name: businessData.name,
        email: businessData.email,
        phone: businessData.phone,
        address: businessData.address,
        contactPerson: businessData.contactPerson,
      });
      
      res.status(201).json(business);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/business/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const business = await storage.getBusiness(id);
      
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      res.json(business);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return httpServer;
}
