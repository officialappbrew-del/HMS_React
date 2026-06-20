import { createSlice } from '@reduxjs/toolkit';

const ambulanceSlice = createSlice({
  name: 'ambulance',
  initialState: {
    // Ambulance fleet
    ambulances: [
      {
        ambulanceId: 'AMB001',
        vehicleNumber: 'AMB-001',
        type: 'ALS', // Advanced Life Support
        make: 'Mercedes-Benz',
        model: 'Sprinter',
        year: 2022,
        capacity: 4,
        status: 'Available',
        location: { lat: 6.5244, lng: 3.3792 }, // Lagos coordinates
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-07-15',
        mileage: 45000,
        fuelLevel: 85,
        equipment: [
          'Defibrillator',
          'Ventilator',
          'IV Pumps',
          'Oxygen System',
          'Stretcher',
          'Emergency Lights'
        ]
      },
      {
        ambulanceId: 'AMB002',
        vehicleNumber: 'AMB-002',
        type: 'BLS', // Basic Life Support
        make: 'Toyota',
        model: 'Hiace',
        year: 2021,
        capacity: 3,
        status: 'En Route',
        location: { lat: 6.6018, lng: 3.3515 },
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-07-10',
        mileage: 38000,
        fuelLevel: 60,
        equipment: [
          'First Aid Kit',
          'Oxygen System',
          'Stretcher',
          'Emergency Lights'
        ]
      }
    ],

    // Active missions
    activeMissions: [
      {
        missionId: 'MIS001',
        ambulanceId: 'AMB002',
        incidentType: 'Medical Emergency',
        priority: 'High',
        status: 'En Route',
        patientInfo: {
          name: 'John Doe',
          age: 45,
          condition: 'Chest Pain'
        },
        pickupLocation: {
          address: '123 Victoria Island, Lagos',
          coordinates: { lat: 6.4281, lng: 3.4219 }
        },
        destination: {
          name: 'General Hospital',
          address: '456 Hospital Road, Lagos',
          coordinates: { lat: 6.5244, lng: 3.3792 }
        },
        dispatchedAt: '2024-01-22T10:30:00',
        estimatedArrival: '2024-01-22T10:45:00',
        actualArrival: null,
        crew: [
          { name: 'Dr. Sarah Johnson', role: 'Paramedic' },
          { name: 'Mike Wilson', role: 'Driver' }
        ],
        vitalSigns: [],
        notes: 'Patient complaining of severe chest pain'
      }
    ],

    // Mission history
    missionHistory: [
      {
        missionId: 'MIS002',
        ambulanceId: 'AMB001',
        incidentType: 'Trauma',
        priority: 'Critical',
        status: 'Completed',
        patientInfo: {
          name: 'Jane Smith',
          age: 28,
          condition: 'Motor Vehicle Accident'
        },
        pickupLocation: {
          address: 'Lagos-Ibadan Expressway',
          coordinates: { lat: 6.6194, lng: 3.5023 }
        },
        destination: {
          name: 'Emergency Department',
          address: 'General Hospital, Lagos',
          coordinates: { lat: 6.5244, lng: 3.3792 }
        },
        dispatchedAt: '2024-01-20T14:15:00',
        estimatedArrival: '2024-01-20T14:35:00',
        actualArrival: '2024-01-20T14:28:00',
        completedAt: '2024-01-20T15:45:00',
        crew: [
          { name: 'Dr. Ahmed Hassan', role: 'Paramedic' },
          { name: 'David Brown', role: 'Driver' }
        ],
        responseTime: 13, // minutes
        transportTime: 17, // minutes
        totalTime: 90, // minutes
        outcome: 'Admitted to ICU',
        notes: 'Patient stabilized and transported successfully'
      }
    ],

    // GPS tracking data
    gpsTracking: [
      {
        ambulanceId: 'AMB001',
        timestamp: '2024-01-22T10:35:00',
        location: { lat: 6.5244, lng: 3.3792 },
        speed: 45,
        status: 'Available'
      },
      {
        ambulanceId: 'AMB002',
        timestamp: '2024-01-22T10:35:00',
        location: { lat: 6.6018, lng: 3.3515 },
        speed: 65,
        status: 'En Route'
      }
    ],

    // Utilization analytics
    utilizationAnalytics: {
      monthlyStats: [
        { month: '2023-10', totalMissions: 245, responseTime: 12.5, utilizationRate: 78 },
        { month: '2023-11', totalMissions: 267, responseTime: 11.8, utilizationRate: 82 },
        { month: '2023-12', totalMissions: 289, responseTime: 10.9, utilizationRate: 85 },
        { month: '2024-01', totalMissions: 198, responseTime: 11.2, utilizationRate: 75 }
      ],
      ambulanceStats: [
        { ambulanceId: 'AMB001', missions: 145, avgResponseTime: 11.5, utilizationRate: 82 },
        { ambulanceId: 'AMB002', missions: 132, avgResponseTime: 12.1, utilizationRate: 78 }
      ],
      performanceMetrics: {
        averageResponseTime: 11.7, // minutes
        onTimeResponses: 89, // percentage
        patientSatisfaction: 4.6, // out of 5
        equipmentAvailability: 96 // percentage
      }
    },

    // Emergency zones
    emergencyZones: [
      {
        zoneId: 'ZONE001',
        name: 'Victoria Island',
        coordinates: [
          { lat: 6.4281, lng: 3.4219 },
          { lat: 6.4381, lng: 3.4319 },
          { lat: 6.4181, lng: 3.4119 }
        ],
        population: 250000,
        averageResponseTime: 8.5,
        ambulanceCoverage: 2,
        priority: 'High'
      },
      {
        zoneId: 'ZONE002',
        name: 'Lagos Mainland',
        coordinates: [
          { lat: 6.5244, lng: 3.3792 },
          { lat: 6.5344, lng: 3.3892 },
          { lat: 6.5144, lng: 3.3692 }
        ],
        population: 450000,
        averageResponseTime: 12.3,
        ambulanceCoverage: 3,
        priority: 'Medium'
      }
    ]
  },

  reducers: {
    addAmbulance: (state, action) => {
      state.ambulances.push(action.payload);
    },

    updateAmbulance: (state, action) => {
      const index = state.ambulances.findIndex(amb => amb.ambulanceId === action.payload.ambulanceId);
      if (index !== -1) {
        state.ambulances[index] = { ...state.ambulances[index], ...action.payload };
      }
    },

    updateAmbulanceLocation: (state, action) => {
      const { ambulanceId, location, speed } = action.payload;
      const ambulance = state.ambulances.find(amb => amb.ambulanceId === ambulanceId);
      if (ambulance) {
        ambulance.location = location;
      }

      // Add to GPS tracking
      state.gpsTracking.push({
        ambulanceId,
        timestamp: new Date().toISOString(),
        location,
        speed: speed || 0,
        status: ambulance?.status || 'Unknown'
      });
    },

    dispatchAmbulance: (state, action) => {
      const { ambulanceId, missionData } = action.payload;
      const ambulance = state.ambulances.find(amb => amb.ambulanceId === ambulanceId);
      if (ambulance) {
        ambulance.status = 'En Route';
        state.activeMissions.push({
          missionId: `MIS${Date.now()}`,
          ambulanceId,
          ...missionData,
          status: 'En Route',
          dispatchedAt: new Date().toISOString()
        });
      }
    },

    updateMissionStatus: (state, action) => {
      const { missionId, status, location, vitalSigns, notes } = action.payload;
      const mission = state.activeMissions.find(m => m.missionId === missionId);
      if (mission) {
        mission.status = status;
        if (location) mission.currentLocation = location;
        if (vitalSigns) mission.vitalSigns.push(vitalSigns);
        if (notes) mission.notes = notes;

        // Update ambulance status
        const ambulance = state.ambulances.find(amb => amb.ambulanceId === mission.ambulanceId);
        if (ambulance) {
          ambulance.status = status;
        }
      }
    },

    completeMission: (state, action) => {
      const { missionId, outcome, completedAt } = action.payload;
      const missionIndex = state.activeMissions.findIndex(m => m.missionId === missionId);
      if (missionIndex !== -1) {
        const mission = state.activeMissions[missionIndex];
        mission.status = 'Completed';
        mission.outcome = outcome;
        mission.completedAt = completedAt || new Date().toISOString();

        // Calculate times
        const dispatchTime = new Date(mission.dispatchedAt);
        const completionTime = new Date(mission.completedAt);
        mission.totalTime = Math.floor((completionTime - dispatchTime) / (1000 * 60));

        // Move to history
        state.missionHistory.push(mission);
        state.activeMissions.splice(missionIndex, 1);

        // Update ambulance status
        const ambulance = state.ambulances.find(amb => amb.ambulanceId === mission.ambulanceId);
        if (ambulance) {
          ambulance.status = 'Available';
          ambulance.location = mission.destination.coordinates;
        }
      }
    },

    addEmergencyZone: (state, action) => {
      state.emergencyZones.push(action.payload);
    },

    updateEmergencyZone: (state, action) => {
      const index = state.emergencyZones.findIndex(zone => zone.zoneId === action.payload.zoneId);
      if (index !== -1) {
        state.emergencyZones[index] = { ...state.emergencyZones[index], ...action.payload };
      }
    }
  }
});

export const {
  addAmbulance,
  updateAmbulance,
  updateAmbulanceLocation,
  dispatchAmbulance,
  updateMissionStatus,
  completeMission,
  addEmergencyZone,
  updateEmergencyZone
} = ambulanceSlice.actions;

export default ambulanceSlice.reducer;
