import { createSlice } from '@reduxjs/toolkit';

const centralStoreSlice = createSlice({
  name: 'centralStore',
  initialState: {
    // Store locations
    locations: [
      {
        locationId: 'LOC001',
        name: 'Central Medical Store',
        type: 'Main Warehouse',
        address: 'Hospital Basement Level 1',
        manager: 'Mrs. Zainab Hassan',
        capacity: 5000, // sq ft
        status: 'Active',
        phone: '+2348123456789',
        email: 'centralstore@hospital.ng',
        operatingHours: '24/7',
        securityLevel: 'High',
        temperatureControl: true,
        lastInventory: '2024-01-20'
      },
      {
        locationId: 'LOC002',
        name: 'Pharmacy Satellite Store',
        type: 'Department Store',
        address: 'Pharmacy Department',
        manager: 'Mr. Adebayo Johnson',
        capacity: 500,
        status: 'Active',
        phone: '+2348123456790',
        email: 'pharmstore@hospital.ng',
        operatingHours: '08:00-18:00',
        securityLevel: 'High',
        temperatureControl: true,
        lastInventory: '2024-01-19'
      },
      {
        locationId: 'LOC003',
        name: 'Emergency Department Store',
        type: 'Emergency Store',
        address: 'Emergency Department',
        manager: 'Dr. Ngozi Okoye',
        capacity: 200,
        status: 'Active',
        phone: '+2348123456791',
        email: 'emergencystore@hospital.ng',
        operatingHours: '24/7',
        securityLevel: 'High',
        temperatureControl: false,
        lastInventory: '2024-01-21'
      }
    ],

    // Multi-location inventory
    multiLocationInventory: [
      {
        itemId: 'MLI001',
        itemName: 'Paracetamol 500mg',
        itemType: 'Drug',
        totalStock: 1250,
        locations: [
          {
            locationId: 'LOC001',
            stock: 800,
            reorderPoint: 200,
            lastUpdated: '2024-01-20'
          },
          {
            locationId: 'LOC002',
            stock: 450,
            reorderPoint: 100,
            lastUpdated: '2024-01-19'
          }
        ],
        category: 'Analgesic',
        unitCost: 25.50,
        supplier: 'PharmaPlus Ltd',
        expiryTracking: true,
        batchTracking: true
      },
      {
        itemId: 'MLI002',
        itemName: 'Surgical Gloves Size M',
        itemType: 'Consumable',
        totalStock: 1200,
        locations: [
          {
            locationId: 'LOC001',
            stock: 800,
            reorderPoint: 150,
            lastUpdated: '2024-01-20'
          },
          {
            locationId: 'LOC003',
            stock: 400,
            reorderPoint: 50,
            lastUpdated: '2024-01-21'
          }
        ],
        category: 'PPE',
        unitCost: 25.00,
        supplier: 'SafetyFirst Ltd',
        expiryTracking: false,
        batchTracking: true
      }
    ],

    // Stock transfers between locations
    stockTransfers: [
      {
        transferId: 'TRANS001',
        itemId: 'MLI001',
        itemName: 'Paracetamol 500mg',
        fromLocation: 'LOC001',
        toLocation: 'LOC002',
        quantity: 200,
        transferDate: '2024-01-18',
        requestedBy: 'Mr. Adebayo Johnson',
        approvedBy: 'Mrs. Zainab Hassan',
        status: 'Completed',
        reason: 'Replenish pharmacy stock',
        notes: 'Urgent transfer for patient needs'
      },
      {
        transferId: 'TRANS002',
        itemId: 'MLI002',
        itemName: 'Surgical Gloves Size M',
        fromLocation: 'LOC001',
        toLocation: 'LOC003',
        quantity: 100,
        transferDate: '2024-01-20',
        requestedBy: 'Dr. Ngozi Okoye',
        approvedBy: 'Mrs. Zainab Hassan',
        status: 'In Transit',
        reason: 'Emergency department restock',
        notes: 'High priority transfer'
      }
    ],

    // Department requisitions
    departmentRequisitions: [
      {
        reqId: 'DREQ001',
        department: 'Emergency Department',
        locationId: 'LOC003',
        requestedBy: 'Dr. Ngozi Okoye',
        requestDate: '2024-01-20',
        requiredDate: '2024-01-20',
        status: 'Approved',
        priority: 'High',
        items: [
          {
            itemId: 'MLI002',
            itemName: 'Surgical Gloves Size M',
            requestedQuantity: 100,
            approvedQuantity: 100,
            unitCost: 25.00,
            reason: 'Emergency preparedness'
          }
        ],
        totalValue: 2500.00,
        approvedBy: 'Mrs. Zainab Hassan',
        approvalDate: '2024-01-20',
        issuedBy: 'Mrs. Zainab Hassan',
        issueDate: '2024-01-20',
        notes: 'Approved for immediate emergency use'
      }
    ],

    // Waste management
    wasteManagement: [
      {
        wasteId: 'WASTE001',
        itemId: 'MLI001',
        itemName: 'Expired Paracetamol',
        batchNumber: 'PAN2022001',
        expiryDate: '2023-12-31',
        quantity: 50,
        wasteType: 'Expired Medication',
        disposalMethod: 'Incineration',
        locationId: 'LOC001',
        reportedBy: 'Mrs. Zainab Hassan',
        reportDate: '2024-01-15',
        disposedBy: 'Licensed Waste Contractor',
        disposalDate: '2024-01-16',
        certificateNumber: 'WASTE2024001',
        cost: 5000.00,
        notes: 'Proper disposal as per regulations'
      }
    ],

    // Donation tracking
    donations: [
      {
        donationId: 'DON001',
        donorName: 'Rotary Club Lagos',
        donorType: 'NGO',
        contactPerson: 'Mr. John Rotary',
        contactPhone: '+2348123456792',
        donationDate: '2024-01-10',
        items: [
          {
            itemName: 'Bandages 5cm',
            quantity: 500,
            value: 25000.00,
            expiryDate: '2025-01-10'
          },
          {
            itemName: 'Surgical Gloves',
            quantity: 200,
            value: 10000.00,
            expiryDate: '2025-06-10'
          }
        ],
        totalValue: 35000.00,
        receivedBy: 'Mrs. Zainab Hassan',
        locationId: 'LOC001',
        status: 'Received',
        utilizationStatus: 'Available',
        notes: 'Community donation for hospital support'
      }
    ],

    // Inventory counts
    inventoryCounts: [
      {
        countId: 'COUNT001',
        locationId: 'LOC001',
        countDate: '2024-01-20',
        countedBy: 'Mrs. Zainab Hassan',
        verifiedBy: 'Chief Pharmacist',
        status: 'Completed',
        totalItems: 1250,
        discrepancies: 5,
        adjustments: [
          {
            itemId: 'MLI001',
            itemName: 'Paracetamol 500mg',
            systemStock: 850,
            physicalStock: 820,
            adjustment: -30,
            reason: 'Damaged stock'
          }
        ],
        notes: 'Monthly inventory count completed'
      }
    ],

    // Stock alerts across locations
    locationAlerts: [
      {
        alertId: 'LALERT001',
        locationId: 'LOC002',
        itemId: 'MLI001',
        itemName: 'Paracetamol 500mg',
        currentStock: 80,
        reorderPoint: 100,
        status: 'Critical',
        createdDate: '2024-01-22',
        acknowledgedBy: null,
        actionTaken: null
      }
    ],

    // Transfer requests
    transferRequests: [
      {
        requestId: 'TREQ001',
        itemId: 'MLI001',
        itemName: 'Paracetamol 500mg',
        fromLocation: 'LOC001',
        toLocation: 'LOC002',
        requestedQuantity: 150,
        requestDate: '2024-01-22',
        requestedBy: 'Mr. Adebayo Johnson',
        urgency: 'Medium',
        reason: 'Pharmacy stock replenishment',
        status: 'Pending',
        approvedBy: null,
        approvalDate: null
      }
    ],

    // Issue tracking
    issueTracking: []
  },

  reducers: {
    addLocation: (state, action) => {
      state.locations.push(action.payload);
    },

    updateLocation: (state, action) => {
      const index = state.locations.findIndex(loc => loc.locationId === action.payload.locationId);
      if (index !== -1) {
        state.locations[index] = { ...state.locations[index], ...action.payload };
      }
    },

    addMultiLocationItem: (state, action) => {
      state.multiLocationInventory.push(action.payload);
    },

    updateMultiLocationItem: (state, action) => {
      const index = state.multiLocationInventory.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.multiLocationInventory[index] = { ...state.multiLocationInventory[index], ...action.payload };
      }
    },

    createStockTransfer: (state, action) => {
      state.stockTransfers.push(action.payload);

      // Update stock levels
      const { itemId, fromLocation, toLocation, quantity } = action.payload;
      const item = state.multiLocationInventory.find(i => i.itemId === itemId);
      if (item) {
        const fromLoc = item.locations.find(l => l.locationId === fromLocation);
        const toLoc = item.locations.find(l => l.locationId === toLocation);

        if (fromLoc) fromLoc.stock -= quantity;
        if (toLoc) toLoc.stock += quantity;
        else {
          // Add new location entry if it doesn't exist
          item.locations.push({
            locationId: toLocation,
            stock: quantity,
            reorderPoint: 0,
            lastUpdated: action.payload.transferDate
          });
        }
      }
    },

    updateStockTransfer: (state, action) => {
      const index = state.stockTransfers.findIndex(trans => trans.transferId === action.payload.transferId);
      if (index !== -1) {
        state.stockTransfers[index] = { ...state.stockTransfers[index], ...action.payload };
      }
    },

    addDepartmentRequisition: (state, action) => {
      state.departmentRequisitions.push(action.payload);
    },

    updateDepartmentRequisition: (state, action) => {
      const index = state.departmentRequisitions.findIndex(req => req.reqId === action.payload.reqId);
      if (index !== -1) {
        state.departmentRequisitions[index] = { ...state.departmentRequisitions[index], ...action.payload };
      }
    },

    addWasteRecord: (state, action) => {
      state.wasteManagement.push(action.payload);
    },

    addDonation: (state, action) => {
      state.donations.push(action.payload);
    },

    updateDonation: (state, action) => {
      const index = state.donations.findIndex(don => don.donationId === action.payload.donationId);
      if (index !== -1) {
        state.donations[index] = { ...state.donations[index], ...action.payload };
      }
    },

    createInventoryCount: (state, action) => {
      state.inventoryCounts.push(action.payload);
    },

    updateInventoryCount: (state, action) => {
      const index = state.inventoryCounts.findIndex(count => count.countId === action.payload.countId);
      if (index !== -1) {
        state.inventoryCounts[index] = { ...state.inventoryCounts[index], ...action.payload };
      }
    },

    addTransferRequest: (state, action) => {
      state.transferRequests.push(action.payload);
    },

    updateTransferRequest: (state, action) => {
      const index = state.transferRequests.findIndex(req => req.requestId === action.payload.requestId);
      if (index !== -1) {
        state.transferRequests[index] = { ...state.transferRequests[index], ...action.payload };
      }
    },

    acknowledgeLocationAlert: (state, action) => {
      const alert = state.locationAlerts.find(a => a.alertId === action.payload.alertId);
      if (alert) {
        alert.status = 'Acknowledged';
        alert.acknowledgedBy = action.payload.acknowledgedBy;
      }
    }
  }
});

export const {
  addLocation,
  updateLocation,
  addMultiLocationItem,
  updateMultiLocationItem,
  createStockTransfer,
  updateStockTransfer,
  addDepartmentRequisition,
  updateDepartmentRequisition,
  addWasteRecord,
  addDonation,
  updateDonation,
  createInventoryCount,
  updateInventoryCount,
  addTransferRequest,
  updateTransferRequest,
  acknowledgeLocationAlert
} = centralStoreSlice.actions;

export default centralStoreSlice.reducer;
