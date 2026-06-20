import { createSlice } from '@reduxjs/toolkit';

const referralSlice = createSlice({
  name: 'referral',
  initialState: {
    // Referral requests
    referrals: [
      {
        referralId: 'REF001',
        patientId: 'PAT001',
        patientName: 'John Doe',
        age: 45,
        gender: 'Male',
        referringFacility: 'General Hospital Lagos',
        receivingFacility: 'Teaching Hospital Abuja',
        reason: 'Cardiac surgery requiring specialized care',
        urgency: 'High',
        medicalCondition: 'Severe coronary artery disease',
        requiredSpecialty: 'Cardiothoracic Surgery',
        requestedDate: '2024-01-25',
        preferredTime: '08:00',
        status: 'Approved',
        requestedBy: 'Dr. Adebayo Johnson',
        approvedBy: 'Chief Medical Director',
        approvalDate: '2024-01-24',
        notes: 'Patient requires immediate transfer for bypass surgery'
      },
      {
        referralId: 'REF002',
        patientId: 'PAT002',
        patientName: 'Mary Smith',
        age: 28,
        gender: 'Female',
        referringFacility: 'District Hospital Ibadan',
        receivingFacility: 'General Hospital Lagos',
        reason: 'Obstetric emergency requiring C-section',
        urgency: 'Critical',
        medicalCondition: 'Fetal distress, placenta previa',
        requiredSpecialty: 'Obstetrics & Gynecology',
        requestedDate: '2024-01-22',
        preferredTime: 'Emergency',
        status: 'Completed',
        requestedBy: 'Dr. Ngozi Okoye',
        approvedBy: 'Medical Director',
        approvalDate: '2024-01-22',
        completedDate: '2024-01-22',
        notes: 'Emergency air ambulance transfer arranged'
      }
    ],

    // Transport arrangements
    transports: [
      {
        transportId: 'TRANS001',
        referralId: 'REF001',
        transportType: 'Ground Ambulance',
        vehicleType: 'ALS Ambulance',
        vehicleNumber: 'AMB-001',
        driver: 'Mike Wilson',
        escortTeam: [
          { name: 'Dr. Sarah Johnson', role: 'Medical Escort', specialty: 'Cardiology' },
          { name: 'Nurse Grace', role: 'Critical Care Nurse' }
        ],
        departureDate: '2024-01-25',
        departureTime: '08:00',
        estimatedDuration: 480, // minutes (8 hours)
        route: 'Lagos to Abuja via Lagos-Ibadan-Abuja Expressway',
        distance: 780, // km
        cost: 450000,
        status: 'Scheduled',
        specialRequirements: [
          'Cardiac monitor',
          'Defibrillator',
          'IV medications',
          'Oxygen therapy'
        ],
        notes: 'Patient requires continuous cardiac monitoring during transport'
      },
      {
        transportId: 'TRANS002',
        referralId: 'REF002',
        transportType: 'Air Ambulance',
        vehicleType: 'Helicopter',
        vehicleNumber: 'AIR-AMB-001',
        pilot: 'Captain Johnson',
        escortTeam: [
          { name: 'Dr. Ahmed Hassan', role: 'Obstetrician', specialty: 'Obstetrics' },
          { name: 'Midwife Grace', role: 'Midwife' }
        ],
        departureDate: '2024-01-22',
        departureTime: '14:30',
        estimatedDuration: 90, // minutes
        route: 'Ibadan Airport to Lagos Airport',
        distance: 130, // km
        cost: 850000,
        status: 'Completed',
        specialRequirements: [
          'Neonatal incubator',
          'Obstetric emergency kit',
          'Blood products'
        ],
        notes: 'Emergency helicopter transfer for obstetric emergency'
      }
    ],

    // Medical escorts
    escorts: [
      {
        escortId: 'ESC001',
        name: 'Dr. Sarah Johnson',
        licenseNumber: 'MDCN/2019/12345',
        specialty: 'Cardiology',
        experience: 12, // years
        certifications: ['ACLS', 'PALS', 'Critical Care Transport'],
        contact: '+2348123456789',
        availability: 'Available',
        transportCount: 45,
        rating: 4.9,
        status: 'Active'
      },
      {
        escortId: 'ESC002',
        name: 'Dr. Ahmed Hassan',
        licenseNumber: 'MDCN/2018/54321',
        specialty: 'Obstetrics & Gynecology',
        experience: 10,
        certifications: ['ACLS', 'Obstetric Emergency', 'Neonatal Transport'],
        contact: '+2349876543210',
        availability: 'Available',
        transportCount: 38,
        rating: 4.8,
        status: 'Active'
      }
    ],

    // Transfer documentation
    documentation: [
      {
        docId: 'DOC001',
        referralId: 'REF001',
        transportId: 'TRANS001',
        documents: [
          {
            type: 'Medical Records',
            status: 'Prepared',
            preparedBy: 'Dr. Adebayo Johnson',
            preparedDate: '2024-01-24'
          },
          {
            type: 'Consent Form',
            status: 'Signed',
            signedBy: 'John Doe',
            signedDate: '2024-01-24',
            witness: 'Mrs. Johnson'
          },
          {
            type: 'Insurance Authorization',
            status: 'Approved',
            approvedBy: 'Insurance Company',
            approvalDate: '2024-01-24'
          },
          {
            type: 'Laboratory Results',
            status: 'Attached',
            attachedBy: 'Lab Technician',
            attachedDate: '2024-01-24'
          }
        ],
        handoverChecklist: {
          patientDetails: true,
          medicalHistory: true,
          currentMedications: true,
          allergies: true,
          vitalSigns: true,
          equipmentHandover: false,
          documentationComplete: true,
          familyInformed: true
        },
        status: 'Ready'
      }
    ],

    // Cost calculation
    costStructure: {
      groundTransport: {
        baseRate: 50000, // per transport
        perKm: 350, // Naira per km
        hourlyRate: 25000, // for waiting/delays
        medicalEscort: 75000, // per escort
        equipment: 25000 // additional equipment
      },
      airTransport: {
        helicopter: {
          baseRate: 500000,
          perKm: 2500,
          medicalEscort: 100000,
          equipment: 50000
        },
        fixedWing: {
          baseRate: 1500000,
          perKm: 1500,
          medicalEscort: 150000,
          equipment: 75000
        }
      },
      additionalCosts: {
        oxygen: 15000,
        ivMedications: 25000,
        bloodProducts: 50000,
        specialEquipment: 35000
      }
    },

    // Transfer outcomes
    outcomes: [
      {
        outcomeId: 'OUT001',
        referralId: 'REF002',
        transportId: 'TRANS002',
        patientCondition: 'Stable',
        complications: 'None',
        arrivalTime: '2024-01-22T16:00:00',
        handoverTime: '2024-01-22T16:15:00',
        receivingTeam: 'Dr. Fatima Okon',
        outcome: 'Successful transfer, patient admitted to maternity ward',
        followUp: 'Required - 24 hours post-transfer',
        rating: 5,
        feedback: 'Excellent coordination and care during transfer',
        status: 'Completed'
      }
    ],

    // Billing and payments
    billing: [
      {
        billId: 'BILL001',
        referralId: 'REF001',
        transportId: 'TRANS001',
        patientId: 'PAT001',
        patientName: 'John Doe',
        items: [
          {
            description: 'Ground Ambulance Transport (Lagos to Abuja)',
            quantity: 1,
            unitCost: 350000,
            total: 350000
          },
          {
            description: 'Medical Escort (Cardiologist)',
            quantity: 1,
            unitCost: 75000,
            total: 75000
          },
          {
            description: 'Special Equipment (Cardiac Monitor)',
            quantity: 1,
            unitCost: 25000,
            total: 25000
          }
        ],
        subtotal: 450000,
        tax: 67500,
        total: 517500,
        insuranceCoverage: 400000,
        patientResponsibility: 117500,
        status: 'Pending Payment',
        dueDate: '2024-02-25',
        payer: 'NHIS'
      }
    ],

    // Performance analytics
    analytics: {
      monthlyTransfers: [
        { month: '2023-10', count: 45, successRate: 98, avgCost: 285000 },
        { month: '2023-11', count: 52, successRate: 96, avgCost: 320000 },
        { month: '2023-12', count: 48, successRate: 100, avgCost: 295000 },
        { month: '2024-01', count: 38, successRate: 97, avgCost: 310000 }
      ],
      transportTypes: [
        { type: 'Ground Ambulance', count: 156, percentage: 78 },
        { type: 'Air Ambulance', count: 32, percentage: 16 },
        { type: 'Commercial Flight', count: 12, percentage: 6 }
      ],
      referralReasons: [
        { reason: 'Specialized Surgery', count: 89, percentage: 45 },
        { reason: 'Critical Care', count: 67, percentage: 34 },
        { reason: 'Diagnostic Services', count: 34, percentage: 17 },
        { reason: 'Other', count: 10, percentage: 5 }
      ],
      performanceMetrics: {
        averageTransferTime: 240, // minutes
        successRate: 97, // percentage
        patientSatisfaction: 4.8, // out of 5
        costEfficiency: 92, // percentage
        onTimeTransfers: 94 // percentage
      }
    },

    // Facility network
    facilities: [
      {
        facilityId: 'FAC001',
        name: 'General Hospital Lagos',
        type: 'General Hospital',
        level: 'Secondary',
        specialties: ['Internal Medicine', 'Surgery', 'Obstetrics'],
        location: { lat: 6.5244, lng: 3.3792 },
        contact: '+2348123456789',
        email: 'info@ghlagos.ng',
        status: 'Active',
        transferCapacity: 'High'
      },
      {
        facilityId: 'FAC002',
        name: 'Teaching Hospital Abuja',
        type: 'Teaching Hospital',
        level: 'Tertiary',
        specialties: ['Cardiothoracic Surgery', 'Neurosurgery', 'Oncology'],
        location: { lat: 9.0765, lng: 7.3986 },
        contact: '+2349876543210',
        email: 'info@tha.ng',
        status: 'Active',
        transferCapacity: 'High'
      }
    ]
  },

  reducers: {
    createReferral: (state, action) => {
      const newReferral = {
        referralId: `REF${Date.now()}`,
        status: 'Pending',
        ...action.payload
      };
      state.referrals.push(newReferral);
    },

    updateReferral: (state, action) => {
      const index = state.referrals.findIndex(ref => ref.referralId === action.payload.referralId);
      if (index !== -1) {
        state.referrals[index] = { ...state.referrals[index], ...action.payload };
      }
    },

    approveReferral: (state, action) => {
      const { referralId, approvedBy, approvalDate } = action.payload;
      const referral = state.referrals.find(ref => ref.referralId === referralId);
      if (referral) {
        referral.status = 'Approved';
        referral.approvedBy = approvedBy;
        referral.approvalDate = approvalDate;
      }
    },

    arrangeTransport: (state, action) => {
      state.transports.push(action.payload);
    },

    updateTransport: (state, action) => {
      const index = state.transports.findIndex(trans => trans.transportId === action.payload.transportId);
      if (index !== -1) {
        state.transports[index] = { ...state.transports[index], ...action.payload };
      }
    },

    completeTransport: (state, action) => {
      const { transportId, completedDate, outcome } = action.payload;
      const transport = state.transports.find(trans => trans.transportId === transportId);
      if (transport) {
        transport.status = 'Completed';
        transport.completedDate = completedDate;
        transport.outcome = outcome;
      }
    },

    addEscort: (state, action) => {
      state.escorts.push(action.payload);
    },

    updateEscort: (state, action) => {
      const index = state.escorts.findIndex(esc => esc.escortId === action.payload.escortId);
      if (index !== -1) {
        state.escorts[index] = { ...state.escorts[index], ...action.payload };
      }
    },

    createDocumentation: (state, action) => {
      state.documentation.push(action.payload);
    },

    updateDocumentation: (state, action) => {
      const index = state.documentation.findIndex(doc => doc.docId === action.payload.docId);
      if (index !== -1) {
        state.documentation[index] = { ...state.documentation[index], ...action.payload };
      }
    },

    calculateCost: (state, action) => {
      // Cost calculation logic would go here
      // This is a simplified version
      const { transportId, transportType, distance, requirements } = action.payload;
      const transport = state.transports.find(t => t.transportId === transportId);
      if (transport) {
        let cost = 0;
        if (transportType === 'Ground Ambulance') {
          cost = state.costStructure.groundTransport.baseRate +
                 (distance * state.costStructure.groundTransport.perKm);
        }
        transport.cost = cost;
      }
    },

    recordOutcome: (state, action) => {
      state.outcomes.push(action.payload);
    },

    createBill: (state, action) => {
      state.billing.push(action.payload);
    },

    updateBill: (state, action) => {
      const index = state.billing.findIndex(bill => bill.billId === action.payload.billId);
      if (index !== -1) {
        state.billing[index] = { ...state.billing[index], ...action.payload };
      }
    },

    addFacility: (state, action) => {
      state.facilities.push(action.payload);
    },

    updateFacility: (state, action) => {
      const index = state.facilities.findIndex(fac => fac.facilityId === action.payload.facilityId);
      if (index !== -1) {
        state.facilities[index] = { ...state.facilities[index], ...action.payload };
      }
    }
  }
});

export const {
  createReferral,
  updateReferral,
  approveReferral,
  arrangeTransport,
  updateTransport,
  completeTransport,
  addEscort,
  updateEscort,
  createDocumentation,
  updateDocumentation,
  calculateCost,
  recordOutcome,
  createBill,
  updateBill,
  addFacility,
  updateFacility
} = referralSlice.actions;

export default referralSlice.reducer;
