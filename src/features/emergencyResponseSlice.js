import { createSlice } from '@reduxjs/toolkit';

const emergencyResponseSlice = createSlice({
  name: 'emergencyResponse',
  initialState: {
    // Emergency incidents
    incidents: [
      {
        incidentId: 'INC001',
        type: 'Medical Emergency',
        subtype: 'Cardiac Arrest',
        priority: 'Critical',
        status: 'Active',
        reportedAt: '2024-01-22T10:25:00',
        reportedBy: 'Anonymous Caller',
        callerPhone: '+2348123456789',
        location: {
          address: '123 Victoria Island, Lagos',
          coordinates: { lat: 6.4281, lng: 3.4219 },
          landmark: 'Near Shoprite'
        },
        patientInfo: {
          name: 'John Doe',
          age: 45,
          gender: 'Male',
          condition: 'Unconscious, not breathing',
          medicalHistory: 'Unknown'
        },
        responseTeam: {
          ambulance: 'AMB002',
          crew: [
            { name: 'Dr. Sarah Johnson', role: 'Paramedic', id: 'EMP001' },
            { name: 'Mike Wilson', role: 'Driver', id: 'DRV001' }
          ]
        },
        dispatchedAt: '2024-01-22T10:26:00',
        arrivedAt: null,
        resolvedAt: null,
        outcome: null,
        notes: 'Caller reports patient collapsed in shopping mall'
      },
      {
        incidentId: 'INC002',
        type: 'Trauma',
        subtype: 'Motor Vehicle Accident',
        priority: 'High',
        status: 'Resolved',
        reportedAt: '2024-01-20T14:10:00',
        reportedBy: 'Police Officer',
        callerPhone: '+2349876543210',
        location: {
          address: 'Lagos-Ibadan Expressway, Km 12',
          coordinates: { lat: 6.6194, lng: 3.5023 },
          landmark: 'Near toll gate'
        },
        patientInfo: {
          name: 'Jane Smith',
          age: 28,
          gender: 'Female',
          condition: 'Multiple injuries from MVA',
          medicalHistory: 'Unknown'
        },
        responseTeam: {
          ambulance: 'AMB001',
          crew: [
            { name: 'Dr. Ahmed Hassan', role: 'Paramedic', id: 'EMP002' },
            { name: 'David Brown', role: 'Driver', id: 'DRV002' }
          ]
        },
        dispatchedAt: '2024-01-20T14:12:00',
        arrivedAt: '2024-01-20T14:28:00',
        resolvedAt: '2024-01-20T15:45:00',
        outcome: 'Transported to hospital ICU',
        notes: 'Multiple vehicle collision, 3 injured'
      }
    ],

    // Response protocols
    protocols: [
      {
        protocolId: 'PROTOCOL001',
        name: 'Cardiac Arrest Response',
        type: 'Medical Emergency',
        priority: 'Critical',
        steps: [
          'Assess scene safety',
          'Check patient responsiveness',
          'Call for backup if needed',
          'Start CPR if indicated',
          'Apply AED if available',
          'Transport to nearest facility with cardiac care'
        ],
        requiredEquipment: ['Defibrillator', 'AED', 'Oxygen', 'IV Supplies'],
        estimatedResponseTime: 8, // minutes
        successRate: 85,
        lastUpdated: '2024-01-01'
      },
      {
        protocolId: 'PROTOCOL002',
        name: 'Trauma Response',
        type: 'Trauma',
        priority: 'High',
        steps: [
          'Secure scene and patient',
          'Assess ABCs (Airway, Breathing, Circulation)',
          'Control major bleeding',
          'Immobilize spine if indicated',
          'Monitor vital signs continuously',
          'Transport with minimal movement'
        ],
        requiredEquipment: ['Spinal Board', 'Cervical Collar', 'Pressure Dressings', 'IV Supplies'],
        estimatedResponseTime: 12,
        successRate: 92,
        lastUpdated: '2024-01-01'
      }
    ],

    // Response teams
    responseTeams: [
      {
        teamId: 'TEAM001',
        name: 'Alpha Team',
        type: 'ALS', // Advanced Life Support
        status: 'Active',
        leader: 'Dr. Sarah Johnson',
        members: [
          { name: 'Dr. Sarah Johnson', role: 'Team Leader/Paramedic', id: 'EMP001' },
          { name: 'Mike Wilson', role: 'Driver', id: 'DRV001' },
          { name: 'Nurse Grace', role: 'Nurse Assistant', id: 'NUR001' }
        ],
        assignedAmbulance: 'AMB002',
        location: 'Central Ambulance Station',
        availability: 'Available',
        certifications: ['ACLS', 'PALS', 'ITLS'],
        responseCount: 45,
        successRate: 96
      },
      {
        teamId: 'TEAM002',
        name: 'Bravo Team',
        type: 'BLS', // Basic Life Support
        status: 'Active',
        leader: 'Dr. Ahmed Hassan',
        members: [
          { name: 'Dr. Ahmed Hassan', role: 'Team Leader/Paramedic', id: 'EMP002' },
          { name: 'David Brown', role: 'Driver', id: 'DRV002' }
        ],
        assignedAmbulance: 'AMB001',
        location: 'North Ambulance Station',
        availability: 'On Mission',
        certifications: ['BLS', 'First Aid'],
        responseCount: 38,
        successRate: 94
      }
    ],

    // Quality assurance
    qualityAssurance: [
      {
        qaId: 'QA001',
        incidentId: 'INC002',
        reviewedBy: 'Quality Assurance Officer',
        reviewDate: '2024-01-21',
        responseTime: 16, // minutes (target: 12)
        protocolCompliance: 95,
        documentationQuality: 92,
        patientOutcome: 'Good',
        teamPerformance: 88,
        equipmentFunctionality: 100,
        areasForImprovement: [
          'Response time slightly over target',
          'Better documentation of vital signs'
        ],
        recommendations: [
          'Review route optimization',
          'Additional training on documentation'
        ],
        followUpRequired: false,
        status: 'Completed'
      }
    ],

    // Emergency checklists
    checklists: [
      {
        checklistId: 'CHECK001',
        name: 'Scene Assessment Checklist',
        type: 'Initial Response',
        items: [
          { item: 'Scene safety assessed', required: true, completed: false },
          { item: 'Number of patients determined', required: true, completed: false },
          { item: 'Hazards identified and controlled', required: true, completed: false },
          { item: 'Bystanders managed', required: false, completed: false },
          { item: 'Access routes established', required: true, completed: false }
        ]
      },
      {
        checklistId: 'CHECK002',
        name: 'Patient Handover Checklist',
        type: 'Hospital Handover',
        items: [
          { item: 'Patient details communicated', required: true, completed: false },
          { item: 'Vital signs reported', required: true, completed: false },
          { item: 'Treatment given documented', required: true, completed: false },
          { item: 'Medications administered listed', required: true, completed: false },
          { item: 'Equipment handed over', required: true, completed: false },
          { item: 'Verbal handover completed', required: true, completed: false }
        ]
      }
    ],

    // Response analytics
    responseAnalytics: {
      monthlyStats: [
        { month: '2023-10', incidents: 145, avgResponseTime: 11.2, successRate: 94 },
        { month: '2023-11', incidents: 167, avgResponseTime: 10.8, successRate: 96 },
        { month: '2023-12', incidents: 189, avgResponseTime: 9.9, successRate: 95 },
        { month: '2024-01', incidents: 98, avgResponseTime: 10.5, successRate: 93 }
      ],
      incidentTypes: [
        { type: 'Medical Emergency', count: 156, percentage: 45 },
        { type: 'Trauma', count: 98, percentage: 28 },
        { type: 'Cardiac', count: 67, percentage: 19 },
        { type: 'Respiratory', count: 34, percentage: 10 },
        { type: 'Other', count: 44, percentage: 13 }
      ],
      performanceMetrics: {
        averageResponseTime: 10.6, // minutes
        targetResponseTime: 10, // minutes
        onTimeResponses: 87, // percentage
        protocolCompliance: 94, // percentage
        patientSatisfaction: 4.7, // out of 5
        teamSatisfaction: 4.5 // out of 5
      }
    },

    // Emergency contacts
    emergencyContacts: [
      {
        contactId: 'CONT001',
        name: 'Lagos State Emergency Management Agency',
        type: 'Government',
        phone: '112',
        email: 'emergency@lagosstate.gov.ng',
        address: 'Alausa, Lagos',
        services: ['Emergency Coordination', 'Resource Allocation'],
        priority: 'High'
      },
      {
        contactId: 'CONT002',
        name: 'National Emergency Management Agency',
        type: 'Federal',
        phone: '199',
        email: 'info@nema.gov.ng',
        address: 'Abuja',
        services: ['National Emergency Response', 'Disaster Management'],
        priority: 'Critical'
      }
    ]
  },

  reducers: {
    reportIncident: (state, action) => {
      const newIncident = {
        incidentId: `INC${Date.now()}`,
        reportedAt: new Date().toISOString(),
        status: 'Reported',
        ...action.payload
      };
      state.incidents.push(newIncident);
    },

    updateIncident: (state, action) => {
      const index = state.incidents.findIndex(inc => inc.incidentId === action.payload.incidentId);
      if (index !== -1) {
        state.incidents[index] = { ...state.incidents[index], ...action.payload };
      }
    },

    dispatchResponse: (state, action) => {
      const { incidentId, responseTeam, ambulance } = action.payload;
      const incident = state.incidents.find(inc => inc.incidentId === incidentId);
      if (incident) {
        incident.responseTeam = { ambulance, crew: responseTeam };
        incident.status = 'Responding';
        incident.dispatchedAt = new Date().toISOString();
      }
    },

    updateResponseStatus: (state, action) => {
      const { incidentId, status, timestamp, notes } = action.payload;
      const incident = state.incidents.find(inc => inc.incidentId === incidentId);
      if (incident) {
        incident.status = status;
        if (status === 'Arrived' && !incident.arrivedAt) {
          incident.arrivedAt = timestamp;
        }
        if (notes) {
          incident.notes = (incident.notes || '') + '\n' + notes;
        }
      }
    },

    resolveIncident: (state, action) => {
      const { incidentId, outcome, resolvedAt } = action.payload;
      const incident = state.incidents.find(inc => inc.incidentId === incidentId);
      if (incident) {
        incident.status = 'Resolved';
        incident.outcome = outcome;
        incident.resolvedAt = resolvedAt || new Date().toISOString();
      }
    },

    addProtocol: (state, action) => {
      state.protocols.push(action.payload);
    },

    updateProtocol: (state, action) => {
      const index = state.protocols.findIndex(proto => proto.protocolId === action.payload.protocolId);
      if (index !== -1) {
        state.protocols[index] = { ...state.protocols[index], ...action.payload };
      }
    },

    addResponseTeam: (state, action) => {
      state.responseTeams.push(action.payload);
    },

    updateResponseTeam: (state, action) => {
      const index = state.responseTeams.findIndex(team => team.teamId === action.payload.teamId);
      if (index !== -1) {
        state.responseTeams[index] = { ...state.responseTeams[index], ...action.payload };
      }
    },

    conductQualityReview: (state, action) => {
      state.qualityAssurance.push(action.payload);
    },

    updateQualityReview: (state, action) => {
      const index = state.qualityAssurance.findIndex(qa => qa.qaId === action.payload.qaId);
      if (index !== -1) {
        state.qualityAssurance[index] = { ...state.qualityAssurance[index], ...action.payload };
      }
    },

    updateChecklist: (state, action) => {
      const { checklistId, itemIndex, completed } = action.payload;
      const checklist = state.checklists.find(c => c.checklistId === checklistId);
      if (checklist && checklist.items[itemIndex]) {
        checklist.items[itemIndex].completed = completed;
      }
    },

    addEmergencyContact: (state, action) => {
      state.emergencyContacts.push(action.payload);
    },

    updateEmergencyContact: (state, action) => {
      const index = state.emergencyContacts.findIndex(contact => contact.contactId === action.payload.contactId);
      if (index !== -1) {
        state.emergencyContacts[index] = { ...state.emergencyContacts[index], ...action.payload };
      }
    }
  }
});

export const {
  reportIncident,
  updateIncident,
  dispatchResponse,
  updateResponseStatus,
  resolveIncident,
  addProtocol,
  updateProtocol,
  addResponseTeam,
  updateResponseTeam,
  conductQualityReview,
  updateQualityReview,
  updateChecklist,
  addEmergencyContact,
  updateEmergencyContact
} = emergencyResponseSlice.actions;

export default emergencyResponseSlice.reducer;
