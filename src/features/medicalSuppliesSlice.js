import { createSlice } from '@reduxjs/toolkit';

const medicalSuppliesSlice = createSlice({
  name: 'medicalSupplies',
  initialState: {
    // Consumables inventory
    consumables: [
      {
        itemId: 'CONS001',
        name: 'Disposable Syringes 5ml',
        category: 'Injection Supplies',
        packSize: 100,
        unit: 'pieces',
        currentStock: 500,
        reorderPoint: 100,
        unitCost: 15.00,
        supplier: 'MediCare Distributors',
        location: 'Central Store',
        expiryDate: null,
        batchNumber: 'SYR2024001',
        lastRestocked: '2024-01-15',
        usageRate: 'High',
        stockAlerts: []
      },
      {
        itemId: 'CONS002',
        name: 'Surgical Gloves Size M',
        category: 'PPE',
        packSize: 50,
        unit: 'pairs',
        currentStock: 200,
        reorderPoint: 50,
        unitCost: 25.00,
        supplier: 'SafetyFirst Ltd',
        location: 'Central Store',
        expiryDate: null,
        batchNumber: 'GLV2024002',
        lastRestocked: '2024-01-12',
        usageRate: 'High',
        stockAlerts: []
      },
      {
        itemId: 'CONS003',
        name: 'IV Cannula 18G',
        category: 'IV Supplies',
        packSize: 50,
        unit: 'pieces',
        currentStock: 75,
        reorderPoint: 25,
        unitCost: 35.00,
        supplier: 'MediCare Distributors',
        location: 'Central Store',
        expiryDate: '2025-12-31',
        batchNumber: 'IVC2024003',
        lastRestocked: '2024-01-10',
        usageRate: 'Medium',
        stockAlerts: ['Low Stock']
      }
    ],

    // PPE inventory
    ppe: [
      {
        itemId: 'PPE001',
        name: 'N95 Face Masks',
        type: 'Respiratory Protection',
        packSize: 50,
        currentStock: 300,
        reorderPoint: 100,
        unitCost: 45.00,
        supplier: 'SafetyFirst Ltd',
        location: 'PPE Store',
        expiryDate: '2025-06-30',
        certification: 'N95 Standard',
        lastRestocked: '2024-01-08',
        stockAlerts: []
      },
      {
        itemId: 'PPE002',
        name: 'Surgical Gowns Large',
        type: 'Protective Clothing',
        packSize: 25,
        currentStock: 150,
        reorderPoint: 50,
        unitCost: 85.00,
        supplier: 'MediCare Distributors',
        location: 'PPE Store',
        expiryDate: null,
        certification: 'EN13795',
        lastRestocked: '2024-01-05',
        stockAlerts: []
      }
    ],

    // Laboratory reagents
    labReagents: [
      {
        itemId: 'REAG001',
        name: 'Hemoglobin Test Kit',
        testType: 'Hematology',
        packSize: 100,
        currentStock: 45,
        reorderPoint: 20,
        unitCost: 125.00,
        supplier: 'LabSolutions Ltd',
        location: 'Lab Store',
        expiryDate: '2024-08-15',
        batchNumber: 'HEM2024001',
        storageTemp: '2-8°C',
        lastRestocked: '2024-01-03',
        stockAlerts: []
      },
      {
        itemId: 'REAG002',
        name: 'Malaria Rapid Test',
        testType: 'Infectious Diseases',
        packSize: 25,
        currentStock: 80,
        reorderPoint: 15,
        unitCost: 75.00,
        supplier: 'MediCare Distributors',
        location: 'Lab Store',
        expiryDate: '2024-10-20',
        batchNumber: 'MAL2024002',
        storageTemp: 'Room Temperature',
        lastRestocked: '2024-01-07',
        stockAlerts: []
      }
    ],

    // Radiology supplies
    radiologySupplies: [
      {
        itemId: 'RAD001',
        name: 'Contrast Media 100ml',
        type: 'Contrast Agent',
        packSize: 10,
        currentStock: 25,
        reorderPoint: 8,
        unitCost: 250.00,
        supplier: 'ImagingPlus Ltd',
        location: 'Radiology Store',
        expiryDate: '2024-12-31',
        batchNumber: 'CON2024001',
        storageTemp: 'Room Temperature',
        lastRestocked: '2024-01-02',
        stockAlerts: []
      },
      {
        itemId: 'RAD002',
        name: 'X-Ray Film 14x17',
        type: 'Imaging Film',
        packSize: 100,
        currentStock: 60,
        reorderPoint: 20,
        unitCost: 12.00,
        supplier: 'MediCare Distributors',
        location: 'Radiology Store',
        expiryDate: null,
        batchNumber: 'XRAY2024003',
        storageTemp: 'Dark, Cool Place',
        lastRestocked: '2024-01-06',
        stockAlerts: []
      }
    ],

    // Surgical instruments
    surgicalInstruments: [
      {
        itemId: 'SURG001',
        name: 'Surgical Scalpel Handle #3',
        type: 'Cutting Instrument',
        category: 'General Surgery',
        currentStock: 25,
        reorderPoint: 5,
        unitCost: 150.00,
        supplier: 'SurgicalTools Ltd',
        location: 'Surgical Store',
        sterilizationMethod: 'Autoclave',
        maintenanceSchedule: 'After each use',
        lastMaintenance: '2024-01-20',
        stockAlerts: []
      },
      {
        itemId: 'SURG002',
        name: 'Artery Forceps 6"',
        type: 'Grasping Instrument',
        category: 'General Surgery',
        currentStock: 18,
        reorderPoint: 4,
        unitCost: 200.00,
        supplier: 'SurgicalTools Ltd',
        location: 'Surgical Store',
        sterilizationMethod: 'Autoclave',
        maintenanceSchedule: 'After each use',
        lastMaintenance: '2024-01-20',
        stockAlerts: []
      }
    ],

    // Linen and laundry
    linen: [
      {
        itemId: 'LINEN001',
        name: 'Hospital Bed Sheets',
        type: 'Bedding',
        size: 'Standard',
        material: 'Cotton',
        currentStock: 200,
        reorderPoint: 50,
        unitCost: 85.00,
        supplier: 'TextileMed Ltd',
        location: 'Laundry Store',
        washingInstructions: 'Hot wash, 90°C',
        lastRestocked: '2024-01-01',
        stockAlerts: []
      },
      {
        itemId: 'LINEN002',
        name: 'Surgical Drapes',
        type: 'Surgical Linen',
        size: 'Large',
        material: 'Disposable',
        currentStock: 150,
        reorderPoint: 30,
        unitCost: 45.00,
        supplier: 'MediCare Distributors',
        location: 'Surgical Store',
        washingInstructions: 'Single use',
        lastRestocked: '2024-01-04',
        stockAlerts: []
      }
    ],

    // Stock transactions for supplies
    supplyTransactions: [
      {
        transactionId: 'STXN001',
        itemId: 'CONS001',
        itemType: 'consumables',
        type: 'Stock In',
        quantity: 200,
        unitCost: 15.00,
        totalCost: 3000.00,
        supplier: 'MediCare Distributors',
        batchNumber: 'SYR2024001',
        date: '2024-01-15',
        performedBy: 'Mrs. Zainab Hassan',
        department: 'Central Store',
        reference: 'PO2024002',
        notes: 'Monthly restock'
      },
      {
        transactionId: 'STXN002',
        itemId: 'PPE001',
        itemType: 'ppe',
        type: 'Stock Out',
        quantity: 50,
        department: 'Emergency Department',
        date: '2024-01-18',
        performedBy: 'Dr. Ngozi Okoye',
        reference: 'REQ2024001',
        notes: 'Emergency preparedness'
      }
    ],

    // Department requisitions
    requisitions: [
      {
        reqId: 'REQ001',
        department: 'Emergency Department',
        requestedBy: 'Dr. Ngozi Okoye',
        requestDate: '2024-01-18',
        requiredDate: '2024-01-18',
        status: 'Approved',
        items: [
          {
            itemId: 'PPE001',
            itemName: 'N95 Face Masks',
            quantity: 50,
            urgency: 'High',
            reason: 'Emergency preparedness'
          }
        ],
        approvedBy: 'Chief Medical Director',
        approvalDate: '2024-01-18',
        issuedBy: 'Mrs. Zainab Hassan',
        issueDate: '2024-01-18',
        notes: 'Approved for immediate use'
      }
    ],

    // Low stock alerts for supplies
    supplyAlerts: [
      {
        alertId: 'SALERT001',
        itemId: 'CONS003',
        itemName: 'IV Cannula 18G',
        itemType: 'consumables',
        currentStock: 75,
        reorderPoint: 25,
        status: 'Active',
        createdDate: '2024-01-20',
        acknowledgedBy: null,
        actionTaken: 'Reorder initiated'
      }
    ],

    // Categories
    categories: {
      CONSUMABLES: 'Consumables',
      PPE: 'Personal Protective Equipment',
      LAB_REAGENTS: 'Laboratory Reagents',
      RADIOLOGY: 'Radiology Supplies',
      SURGICAL: 'Surgical Instruments',
      LINEN: 'Linen & Laundry'
    },

    // Locations
    locations: [
      'Central Store',
      'PPE Store',
      'Lab Store',
      'Radiology Store',
      'Surgical Store',
      'Laundry Store',
      'Emergency Department',
      'Operating Theater',
      'General Ward',
      'ICU'
    ]
  },

  reducers: {
    addConsumable: (state, action) => {
      state.consumables.push(action.payload);
    },

    updateConsumable: (state, action) => {
      const index = state.consumables.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.consumables[index] = { ...state.consumables[index], ...action.payload };
      }
    },

    addPPE: (state, action) => {
      state.ppe.push(action.payload);
    },

    updatePPE: (state, action) => {
      const index = state.ppe.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.ppe[index] = { ...state.ppe[index], ...action.payload };
      }
    },

    addLabReagent: (state, action) => {
      state.labReagents.push(action.payload);
    },

    updateLabReagent: (state, action) => {
      const index = state.labReagents.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.labReagents[index] = { ...state.labReagents[index], ...action.payload };
      }
    },

    addRadiologySupply: (state, action) => {
      state.radiologySupplies.push(action.payload);
    },

    updateRadiologySupply: (state, action) => {
      const index = state.radiologySupplies.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.radiologySupplies[index] = { ...state.radiologySupplies[index], ...action.payload };
      }
    },

    addSurgicalInstrument: (state, action) => {
      state.surgicalInstruments.push(action.payload);
    },

    updateSurgicalInstrument: (state, action) => {
      const index = state.surgicalInstruments.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.surgicalInstruments[index] = { ...state.surgicalInstruments[index], ...action.payload };
      }
    },

    addLinen: (state, action) => {
      state.linen.push(action.payload);
    },

    updateLinen: (state, action) => {
      const index = state.linen.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.linen[index] = { ...state.linen[index], ...action.payload };
      }
    },

    addSupplyTransaction: (state, action) => {
      state.supplyTransactions.push(action.payload);

      // Update stock levels based on transaction
      const { itemId, itemType, type, quantity } = action.payload;
      let itemArray;

      switch (itemType) {
        case 'consumables':
          itemArray = state.consumables;
          break;
        case 'ppe':
          itemArray = state.ppe;
          break;
        case 'labReagents':
          itemArray = state.labReagents;
          break;
        case 'radiologySupplies':
          itemArray = state.radiologySupplies;
          break;
        case 'surgicalInstruments':
          itemArray = state.surgicalInstruments;
          break;
        case 'linen':
          itemArray = state.linen;
          break;
        default:
          return;
      }

      const item = itemArray.find(i => i.itemId === itemId);
      if (item) {
        if (type === 'Stock In') {
          item.currentStock += quantity;
          item.lastRestocked = action.payload.date;
        } else if (type === 'Stock Out') {
          item.currentStock -= quantity;
        }

        // Check for low stock alerts
        if (item.currentStock <= item.reorderPoint) {
          const existingAlert = state.supplyAlerts.find(a => a.itemId === item.itemId);
          if (!existingAlert) {
            state.supplyAlerts.push({
              alertId: `SALERT${Date.now()}`,
              itemId: item.itemId,
              itemName: item.name,
              itemType: itemType,
              currentStock: item.currentStock,
              reorderPoint: item.reorderPoint,
              status: 'Active',
              createdDate: new Date().toISOString().split('T')[0],
              acknowledgedBy: null,
              actionTaken: null
            });
          }
        }
      }
    },

    addRequisition: (state, action) => {
      state.requisitions.push(action.payload);
    },

    updateRequisition: (state, action) => {
      const index = state.requisitions.findIndex(req => req.reqId === action.payload.reqId);
      if (index !== -1) {
        state.requisitions[index] = { ...state.requisitions[index], ...action.payload };
      }
    },

    acknowledgeSupplyAlert: (state, action) => {
      const alert = state.supplyAlerts.find(a => a.alertId === action.payload.alertId);
      if (alert) {
        alert.status = 'Acknowledged';
        alert.acknowledgedBy = action.payload.acknowledgedBy;
      }
    }
  }
});

export const {
  addConsumable,
  updateConsumable,
  addPPE,
  updatePPE,
  addLabReagent,
  updateLabReagent,
  addRadiologySupply,
  updateRadiologySupply,
  addSurgicalInstrument,
  updateSurgicalInstrument,
  addLinen,
  updateLinen,
  addSupplyTransaction,
  addRequisition,
  updateRequisition,
  acknowledgeSupplyAlert
} = medicalSuppliesSlice.actions;

export default medicalSuppliesSlice.reducer;
