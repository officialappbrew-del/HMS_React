import { createSlice } from '@reduxjs/toolkit';

const pharmacyInventorySlice = createSlice({
  name: 'pharmacyInventory',
  initialState: {
    // Drug inventory
    drugs: [
      {
        drugId: 'DRUG001',
        name: 'Paracetamol 500mg',
        genericName: 'Paracetamol',
        brandName: 'Panadol',
        strength: '500mg',
        dosageForm: 'Tablet',
        packSize: 100,
        batchNumber: 'PAN2024001',
        expiryDate: '2026-12-31',
        manufacturer: 'GSK Nigeria',
        supplier: 'PharmaPlus Ltd',
        currentStock: 250,
        reorderPoint: 50,
        unitCost: 25.50,
        sellingPrice: 35.00,
        location: 'Pharmacy Main Store',
        category: 'Analgesic',
        controlled: false,
        narcotic: false,
        lastRestocked: '2024-01-15',
        stockAlerts: []
      },
      {
        drugId: 'DRUG002',
        name: 'Amoxicillin 250mg',
        genericName: 'Amoxicillin',
        brandName: 'Amoxil',
        strength: '250mg',
        dosageForm: 'Capsule',
        packSize: 50,
        batchNumber: 'AMO2024002',
        expiryDate: '2025-08-15',
        manufacturer: 'Pfizer Nigeria',
        supplier: 'MediCare Distributors',
        currentStock: 75,
        reorderPoint: 25,
        unitCost: 45.00,
        sellingPrice: 65.00,
        location: 'Pharmacy Main Store',
        category: 'Antibiotic',
        controlled: false,
        narcotic: false,
        lastRestocked: '2024-01-10',
        stockAlerts: ['Low Stock']
      },
      {
        drugId: 'DRUG003',
        name: 'Tramadol 50mg',
        genericName: 'Tramadol',
        brandName: 'Tramal',
        strength: '50mg',
        dosageForm: 'Tablet',
        packSize: 30,
        batchNumber: 'TRA2024003',
        expiryDate: '2025-06-20',
        manufacturer: 'Grunenthal',
        supplier: 'Specialty Meds Ltd',
        currentStock: 15,
        reorderPoint: 10,
        unitCost: 85.00,
        sellingPrice: 120.00,
        location: 'Pharmacy Controlled Store',
        category: 'Analgesic',
        controlled: true,
        narcotic: true,
        lastRestocked: '2024-01-05',
        stockAlerts: ['Low Stock', 'Controlled Substance']
      }
    ],

    // Stock transactions
    stockTransactions: [
      {
        transactionId: 'TXN001',
        drugId: 'DRUG001',
        type: 'Stock In',
        quantity: 100,
        unitCost: 25.50,
        totalCost: 2550.00,
        supplier: 'PharmaPlus Ltd',
        batchNumber: 'PAN2024001',
        expiryDate: '2026-12-31',
        date: '2024-01-15',
        performedBy: 'Mr. Adebayo Johnson',
        reference: 'PO2024001',
        notes: 'Regular restock'
      },
      {
        transactionId: 'TXN002',
        drugId: 'DRUG001',
        type: 'Stock Out',
        quantity: 25,
        unitCost: 35.00,
        totalCost: 875.00,
        department: 'General Ward',
        date: '2024-01-20',
        performedBy: 'Nurse Chioma Okafor',
        reference: 'RX2024001',
        notes: 'Patient medication'
      }
    ],

    // Narcotics register (PCN Form C)
    narcoticsRegister: [
      {
        registerId: 'NARC001',
        drugId: 'DRUG003',
        batchNumber: 'TRA2024003',
        receivedDate: '2024-01-05',
        receivedFrom: 'Specialty Meds Ltd',
        quantityReceived: 30,
        issuedTo: [],
        currentBalance: 15,
        destroyed: [],
        witnessName: 'Mrs. Fatima Okon',
        notes: 'Controlled substance register'
      }
    ],

    // Drug recalls
    drugRecalls: [
      {
        recallId: 'REC001',
        drugId: 'DRUG004',
        drugName: 'Contaminated Injection',
        batchNumber: 'INJ2023001',
        manufacturer: 'MediCorp Ltd',
        reason: 'Contamination',
        recallDate: '2024-01-10',
        affectedQuantity: 500,
        status: 'Ongoing',
        actionTaken: 'Quarantined and returned to supplier',
        notifiedBy: 'NAFDAC',
        notes: 'Immediate recall initiated'
      }
    ],

    // Purchase orders
    purchaseOrders: [
      {
        poId: 'PO001',
        supplier: 'PharmaPlus Ltd',
        orderDate: '2024-01-10',
        expectedDelivery: '2024-01-20',
        status: 'Delivered',
        items: [
          {
            drugId: 'DRUG001',
            quantity: 100,
            unitCost: 25.50,
            totalCost: 2550.00
          }
        ],
        totalAmount: 2550.00,
        approvedBy: 'Chief Pharmacist',
        receivedBy: 'Mr. Adebayo Johnson',
        notes: 'Regular monthly order'
      }
    ],

    // Suppliers
    suppliers: [
      {
        supplierId: 'SUP001',
        name: 'PharmaPlus Ltd',
        contact: '+2348123456789',
        email: 'orders@pharmaplus.ng',
        address: 'Lagos, Nigeria',
        licenseNumber: 'PCN/SUP/2023/001',
        paymentTerms: '30 days',
        deliveryTime: '3-5 days',
        status: 'Active',
        lastOrder: '2024-01-10',
        totalOrders: 25
      },
      {
        supplierId: 'SUP002',
        name: 'MediCare Distributors',
        contact: '+2349876543210',
        email: 'sales@medicare.ng',
        address: 'Abuja, Nigeria',
        licenseNumber: 'PCN/SUP/2022/045',
        paymentTerms: '15 days',
        deliveryTime: '2-3 days',
        status: 'Active',
        lastOrder: '2024-01-08',
        totalOrders: 18
      }
    ],

    // Stock valuation
    stockValuation: {
      fifo: {
        totalValue: 125000.00,
        lastUpdated: '2024-01-22'
      },
      lifo: {
        totalValue: 118000.00,
        lastUpdated: '2024-01-22'
      },
      weightedAverage: {
        totalValue: 121500.00,
        lastUpdated: '2024-01-22'
      }
    },

    // Low stock alerts
    lowStockAlerts: [
      {
        alertId: 'ALERT001',
        drugId: 'DRUG002',
        drugName: 'Amoxicillin 250mg',
        currentStock: 75,
        reorderPoint: 25,
        status: 'Active',
        createdDate: '2024-01-20',
        acknowledgedBy: null,
        actionTaken: 'Reorder initiated'
      }
    ],

    // Drug categories
    categories: [
      'Analgesic',
      'Antibiotic',
      'Antihypertensive',
      'Antidiabetic',
      'Cardiovascular',
      'Respiratory',
      'Gastrointestinal',
      'Neurological',
      'Psychiatric',
      'Oncology',
      'Dermatology',
      'Ophthalmic'
    ],

    // Dosage forms
    dosageForms: [
      'Tablet',
      'Capsule',
      'Syrup',
      'Injection',
      'Cream',
      'Ointment',
      'Drops',
      'Inhaler',
      'Suppository',
      'Patch'
    ]
  },

  reducers: {
    addDrug: (state, action) => {
      state.drugs.push(action.payload);
    },

    updateDrug: (state, action) => {
      const index = state.drugs.findIndex(drug => drug.drugId === action.payload.drugId);
      if (index !== -1) {
        state.drugs[index] = { ...state.drugs[index], ...action.payload };
      }
    },

    deleteDrug: (state, action) => {
      state.drugs = state.drugs.filter(drug => drug.drugId !== action.payload);
    },

    addStockTransaction: (state, action) => {
      state.stockTransactions.push(action.payload);

      // Update drug stock level
      const drug = state.drugs.find(d => d.drugId === action.payload.drugId);
      if (drug) {
        if (action.payload.type === 'Stock In') {
          drug.currentStock += action.payload.quantity;
          drug.lastRestocked = action.payload.date;
        } else if (action.payload.type === 'Stock Out') {
          drug.currentStock -= action.payload.quantity;
        }

        // Check for low stock alerts
        if (drug.currentStock <= drug.reorderPoint) {
          const existingAlert = state.lowStockAlerts.find(a => a.drugId === drug.drugId);
          if (!existingAlert) {
            state.lowStockAlerts.push({
              alertId: `ALERT${Date.now()}`,
              drugId: drug.drugId,
              drugName: drug.name,
              currentStock: drug.currentStock,
              reorderPoint: drug.reorderPoint,
              status: 'Active',
              createdDate: new Date().toISOString().split('T')[0],
              acknowledgedBy: null,
              actionTaken: null
            });
          }
        }
      }
    },

    addPurchaseOrder: (state, action) => {
      state.purchaseOrders.push(action.payload);
    },

    updatePurchaseOrder: (state, action) => {
      const index = state.purchaseOrders.findIndex(po => po.poId === action.payload.poId);
      if (index !== -1) {
        state.purchaseOrders[index] = { ...state.purchaseOrders[index], ...action.payload };
      }
    },

    addSupplier: (state, action) => {
      state.suppliers.push(action.payload);
    },

    updateSupplier: (state, action) => {
      const index = state.suppliers.findIndex(sup => sup.supplierId === action.payload.supplierId);
      if (index !== -1) {
        state.suppliers[index] = { ...state.suppliers[index], ...action.payload };
      }
    },

    addDrugRecall: (state, action) => {
      state.drugRecalls.push(action.payload);
    },

    acknowledgeLowStockAlert: (state, action) => {
      const alert = state.lowStockAlerts.find(a => a.alertId === action.payload.alertId);
      if (alert) {
        alert.status = 'Acknowledged';
        alert.acknowledgedBy = action.payload.acknowledgedBy;
      }
    },

    updateNarcoticsRegister: (state, action) => {
      const index = state.narcoticsRegister.findIndex(reg => reg.registerId === action.payload.registerId);
      if (index !== -1) {
        state.narcoticsRegister[index] = { ...state.narcoticsRegister[index], ...action.payload };
      }
    }
  }
});

export const {
  addDrug,
  updateDrug,
  deleteDrug,
  addStockTransaction,
  addPurchaseOrder,
  updatePurchaseOrder,
  addSupplier,
  updateSupplier,
  addDrugRecall,
  acknowledgeLowStockAlert,
  updateNarcoticsRegister
} = pharmacyInventorySlice.actions;

export default pharmacyInventorySlice.reducer;
