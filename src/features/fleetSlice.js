import { createSlice } from '@reduxjs/toolkit';

const fleetSlice = createSlice({
  name: 'fleet',
  initialState: {
    // Fleet vehicles (including ambulances)
    vehicles: [
      {
        vehicleId: 'VEH001',
        type: 'Ambulance',
        vehicleNumber: 'AMB-001',
        make: 'Mercedes-Benz',
        model: 'Sprinter',
        year: 2022,
        registrationNumber: 'Lagos-AMB-001',
        chassisNumber: 'WDB9036621R123456',
        engineNumber: 'OM651123456',
        mileage: 45000,
        fuelType: 'Diesel',
        tankCapacity: 100, // liters
        status: 'Active',
        location: 'Central Ambulance Station',
        assignedDriver: 'Mike Wilson',
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-07-15',
        insuranceExpiry: '2025-01-15',
        roadTaxExpiry: '2024-12-31',
        fitnessExpiry: '2024-11-30'
      },
      {
        vehicleId: 'VEH002',
        type: 'Ambulance',
        vehicleNumber: 'AMB-002',
        make: 'Toyota',
        model: 'Hiace',
        year: 2021,
        registrationNumber: 'Lagos-AMB-002',
        chassisNumber: 'JT123456789012345',
        engineNumber: '2TR123456',
        mileage: 38000,
        fuelType: 'Diesel',
        tankCapacity: 80,
        status: 'Active',
        location: 'North Ambulance Station',
        assignedDriver: 'David Brown',
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-07-10',
        insuranceExpiry: '2025-01-10',
        roadTaxExpiry: '2024-12-31',
        fitnessExpiry: '2024-11-30'
      },
      {
        vehicleId: 'VEH003',
        type: 'Service Vehicle',
        vehicleNumber: 'SRV-001',
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        registrationNumber: 'Lagos-SRV-001',
        chassisNumber: 'NZE123456789012',
        engineNumber: '1NZ123456',
        mileage: 65000,
        fuelType: 'Petrol',
        tankCapacity: 50,
        status: 'Active',
        location: 'Administration Block',
        assignedDriver: 'John Admin',
        lastMaintenance: '2024-01-05',
        nextMaintenance: '2024-04-05',
        insuranceExpiry: '2025-01-05',
        roadTaxExpiry: '2024-12-31',
        fitnessExpiry: '2024-11-30'
      }
    ],

    // Drivers
    drivers: [
      {
        driverId: 'DRV001',
        name: 'Mike Wilson',
        employeeId: 'EMP001',
        licenseNumber: 'Lagos-DRV-001',
        licenseExpiry: '2025-03-15',
        licenseType: 'Professional Driver',
        dateOfBirth: '1985-06-20',
        phone: '+2348123456789',
        address: 'Lagos, Nigeria',
        experience: 8, // years
        certifications: ['Advanced Life Support', 'Defensive Driving'],
        status: 'Active',
        assignedVehicle: 'AMB-001',
        lastMedicalCheck: '2024-01-01',
        nextMedicalCheck: '2024-07-01',
        performanceRating: 4.8
      },
      {
        driverId: 'DRV002',
        name: 'David Brown',
        employeeId: 'EMP002',
        licenseNumber: 'Lagos-DRV-002',
        licenseExpiry: '2025-08-20',
        licenseType: 'Professional Driver',
        dateOfBirth: '1988-11-10',
        phone: '+2349876543210',
        address: 'Lagos, Nigeria',
        experience: 6,
        certifications: ['Basic Life Support', 'Emergency Response'],
        status: 'Active',
        assignedVehicle: 'AMB-002',
        lastMedicalCheck: '2024-01-01',
        nextMedicalCheck: '2024-07-01',
        performanceRating: 4.6
      }
    ],

    // Maintenance records
    maintenanceRecords: [
      {
        maintenanceId: 'MAINT001',
        vehicleId: 'VEH001',
        type: 'Scheduled Service',
        description: 'Full service and oil change',
        scheduledDate: '2024-01-15',
        completedDate: '2024-01-15',
        mileage: 45000,
        cost: 150000,
        performedBy: 'ABC Auto Services',
        partsReplaced: ['Oil Filter', 'Air Filter', 'Brake Pads'],
        nextServiceMileage: 55000,
        nextServiceDate: '2024-07-15',
        status: 'Completed',
        notes: 'All systems checked and functioning properly'
      },
      {
        maintenanceId: 'MAINT002',
        vehicleId: 'VEH002',
        type: 'Repair',
        description: 'Brake system repair',
        scheduledDate: '2024-01-08',
        completedDate: '2024-01-10',
        mileage: 37500,
        cost: 85000,
        performedBy: 'Lagos Auto Repair',
        partsReplaced: ['Brake Pads', 'Brake Discs', 'Brake Fluid'],
        nextServiceMileage: 47500,
        nextServiceDate: '2024-07-10',
        status: 'Completed',
        notes: 'Emergency brake repair completed'
      }
    ],

    // Fuel records
    fuelRecords: [
      {
        fuelId: 'FUEL001',
        vehicleId: 'VEH001',
        date: '2024-01-20',
        mileage: 45200,
        fuelAdded: 80, // liters
        costPerLiter: 650, // Naira
        totalCost: 52000,
        fuelStation: 'NNPC Mega Station',
        driver: 'Mike Wilson',
        fuelLevelBefore: 15,
        fuelLevelAfter: 95,
        efficiency: 8.5 // km/l
      },
      {
        fuelId: 'FUEL002',
        vehicleId: 'VEH002',
        date: '2024-01-19',
        mileage: 38200,
        fuelAdded: 60,
        costPerLiter: 650,
        totalCost: 39000,
        fuelStation: 'Total Energies',
        driver: 'David Brown',
        fuelLevelBefore: 20,
        fuelLevelAfter: 90,
        efficiency: 9.2
      }
    ],

    // Vehicle allocation
    allocations: [
      {
        allocationId: 'ALLOC001',
        vehicleId: 'VEH001',
        driverId: 'DRV001',
        startDate: '2024-01-01',
        endDate: null, // ongoing
        purpose: 'Emergency Response',
        approvedBy: 'Fleet Manager',
        status: 'Active',
        notes: 'Primary ambulance for emergency responses'
      },
      {
        allocationId: 'ALLOC002',
        vehicleId: 'VEH003',
        driverId: 'DRV001',
        startDate: '2024-01-15',
        endDate: '2024-01-15',
        purpose: 'Administrative Transport',
        approvedBy: 'Administration Manager',
        status: 'Completed',
        notes: 'Transport for medical conference'
      }
    ],

    // Cost tracking
    costTracking: {
      monthlyCosts: [
        { month: '2023-10', fuel: 450000, maintenance: 280000, total: 730000 },
        { month: '2023-11', fuel: 520000, maintenance: 350000, total: 870000 },
        { month: '2023-12', fuel: 480000, maintenance: 420000, total: 900000 },
        { month: '2024-01', fuel: 510000, maintenance: 235000, total: 745000 }
      ],
      costPerKm: {
        ambulance: 85, // Naira per km
        serviceVehicle: 45,
        average: 65
      },
      budgetVsActual: {
        monthlyBudget: 800000,
        currentMonth: 745000,
        variance: 55000,
        variancePercent: 6.9
      }
    },

    // Insurance and registration
    insurance: [
      {
        policyId: 'INS001',
        vehicleId: 'VEH001',
        provider: 'Leadway Assurance',
        policyNumber: 'AMB001-2024',
        type: 'Comprehensive',
        startDate: '2024-01-15',
        expiryDate: '2025-01-14',
        premium: 450000,
        coverage: 'Full coverage including emergency response',
        status: 'Active',
        claims: []
      }
    ],

    // Performance metrics
    performanceMetrics: {
      fleetUtilization: 78, // percentage
      averageMileage: 45000, // km per vehicle
      fuelEfficiency: 8.8, // km/l average
      maintenanceCompliance: 95, // percentage
      breakdownRate: 2.1, // per 1000 km
      driverPerformance: 4.7 // average rating
    }
  },

  reducers: {
    addVehicle: (state, action) => {
      state.vehicles.push(action.payload);
    },

    updateVehicle: (state, action) => {
      const index = state.vehicles.findIndex(vehicle => vehicle.vehicleId === action.payload.vehicleId);
      if (index !== -1) {
        state.vehicles[index] = { ...state.vehicles[index], ...action.payload };
      }
    },

    addDriver: (state, action) => {
      state.drivers.push(action.payload);
    },

    updateDriver: (state, action) => {
      const index = state.drivers.findIndex(driver => driver.driverId === action.payload.driverId);
      if (index !== -1) {
        state.drivers[index] = { ...state.drivers[index], ...action.payload };
      }
    },

    scheduleMaintenance: (state, action) => {
      state.maintenanceRecords.push(action.payload);
    },

    completeMaintenance: (state, action) => {
      const index = state.maintenanceRecords.findIndex(maint => maint.maintenanceId === action.payload.maintenanceId);
      if (index !== -1) {
        state.maintenanceRecords[index] = { ...state.maintenanceRecords[index], ...action.payload, status: 'Completed' };
      }
    },

    recordFuel: (state, action) => {
      state.fuelRecords.push(action.payload);

      // Update vehicle mileage
      const vehicle = state.vehicles.find(v => v.vehicleId === action.payload.vehicleId);
      if (vehicle) {
        vehicle.mileage = action.payload.mileage;
      }
    },

    allocateVehicle: (state, action) => {
      state.allocations.push(action.payload);
    },

    updateAllocation: (state, action) => {
      const index = state.allocations.findIndex(alloc => alloc.allocationId === action.payload.allocationId);
      if (index !== -1) {
        state.allocations[index] = { ...state.allocations[index], ...action.payload };
      }
    },

    addInsurance: (state, action) => {
      state.insurance.push(action.payload);
    },

    updateInsurance: (state, action) => {
      const index = state.insurance.findIndex(ins => ins.policyId === action.payload.policyId);
      if (index !== -1) {
        state.insurance[index] = { ...state.insurance[index], ...action.payload };
      }
    }
  }
});

export const {
  addVehicle,
  updateVehicle,
  addDriver,
  updateDriver,
  scheduleMaintenance,
  completeMaintenance,
  recordFuel,
  allocateVehicle,
  updateAllocation,
  addInsurance,
  updateInsurance
} = fleetSlice.actions;

export default fleetSlice.reducer;
