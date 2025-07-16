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
    console.log('New WebSocket connection');
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'auth') {
          ws.userId = data.userId;
          ws.userType = data.userType;
          clients.set(data.userId, ws);
          
          ws.send(JSON.stringify({
            type: 'auth_success',
            message: 'Successfully authenticated'
          }));
        }
        
        if (data.type === 'driver_location_update' && ws.userId) {
          const driver = await storage.getDriverByUserId(ws.userId);
          if (driver) {
            await storage.updateDriver(driver.id, { currentLocation: data.location });
            
            // Broadcast location update to relevant clients
            broadcastToClients('driver_location_update', {
              driverId: driver.id,
              location: data.location
            });
          }
        }
        
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      if (ws.userId) {
        clients.delete(ws.userId);
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
  
  // Ride routes
  app.post('/api/rides/book', async (req, res) => {
    try {
      const rideData = rideBookingSchema.parse(req.body);
      const { riderId } = req.body;
      
      if (!riderId) {
        return res.status(400).json({ message: 'Rider ID is required' });
      }
      
      // Calculate fare (simplified calculation)
      const distance = Math.random() * 20 + 2; // Random distance between 2-22 km
      const baseFare = 40;
      const perKmRate = 12;
      const fare = baseFare + (distance * perKmRate);
      
      const ride = await storage.createRide({
        riderId,
        pickupLocation: rideData.pickupLocation,
        dropoffLocation: rideData.dropoffLocation,
        rideType: rideData.rideType,
        fare: fare.toFixed(2),
        distance: distance.toFixed(2),
        estimatedDuration: Math.ceil(distance * 3), // Rough estimate: 3 min per km
        status: 'pending',
      });
      
      // Store price calculation
      await storage.createPriceCalculation({
        pickupLocation: rideData.pickupLocation,
        dropoffLocation: rideData.dropoffLocation,
        distance: distance.toFixed(2),
        baseFare: baseFare.toFixed(2),
        perKmRate: perKmRate.toFixed(2),
        totalFare: fare.toFixed(2),
        rideType: rideData.rideType,
      });
      
      // Broadcast new ride to online drivers
      broadcastToClients('new_ride', ride);
      
      res.status(201).json(ride);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/rides/calculate-price', async (req, res) => {
    try {
      const { pickupLocation, dropoffLocation, rideType = 'standard' } = req.query;
      
      if (!pickupLocation || !dropoffLocation) {
        return res.status(400).json({ message: 'Pickup and dropoff locations are required' });
      }
      
      // Check if we have a cached calculation
      const existingCalculation = await storage.getPriceCalculation(
        pickupLocation as string,
        dropoffLocation as string
      );
      
      if (existingCalculation) {
        return res.json(existingCalculation);
      }
      
      // Calculate new price
      const distance = Math.random() * 20 + 2; // Random distance between 2-22 km
      const baseFare = 40;
      const perKmRate = rideType === 'premium' ? 18 : rideType === 'shared' ? 8 : 12;
      const fare = baseFare + (distance * perKmRate);
      
      const calculation = await storage.createPriceCalculation({
        pickupLocation: pickupLocation as string,
        dropoffLocation: dropoffLocation as string,
        distance: distance.toFixed(2),
        baseFare: baseFare.toFixed(2),
        perKmRate: perKmRate.toFixed(2),
        totalFare: fare.toFixed(2),
        rideType: rideType as string,
      });
      
      res.json(calculation);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
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
