import { createSlice } from '@reduxjs/toolkit';

const procurementSlice = createSlice({
  name: 'procurement',
  initialState: {
    // Vendors/Suppliers
    vendors: [
      {
        vendorId: 'VEND001',
        name: 'PharmaPlus Ltd',
        type: 'Pharmaceutical Supplier',
        contactPerson: 'Mr. Adebayo Johnson',
        phone: '+2348123456789',
        email: 'orders@pharmaplus.ng',
        address: 'Lagos, Nigeria',
        licenseNumber: 'PCN/SUP/2023/001',
        taxId: '123456789',
        paymentTerms: '30 days',
        deliveryTime: '3-5 days',
        status: 'Active',
        creditLimit: 5000000.00,
        currentBalance: 1250000.00,
        lastOrderDate: '2024-01-15',
        totalOrders: 25,
        onTimeDelivery: 95,
        qualityRating: 4.8,
        categories: ['Pharmaceuticals', 'Medical Supplies']
      },
      {
        vendorId: 'VEND002',
        name: 'MediCare Distributors',
        type: 'Medical Equipment Supplier',
        contactPerson: 'Mrs. Fatima Okon',
        phone: '+2349876543210',
        email: 'sales@medicare.ng',
        address: 'Abuja, Nigeria',
        licenseNumber: 'PCN/SUP/2022/045',
        taxId: '987654321',
        paymentTerms: '15 days',
        deliveryTime: '2-3 days',
        status: 'Active',
        creditLimit: 3000000.00,
        currentBalance: 750000.00,
        lastOrderDate: '2024-01-12',
        totalOrders: 18,
        onTimeDelivery: 98,
        qualityRating: 4.9,
        categories: ['Medical Supplies', 'Consumables', 'PPE']
      }
    ],

    // Request for Quotations (RFQ)
    rfqs: [
      {
        rfqId: 'RFQ001',
        title: 'Annual Pharmaceutical Supply Contract',
        description: 'Supply of essential medicines for 2024',
        category: 'Pharmaceuticals',
        requestedBy: 'Chief Pharmacist',
        requestDate: '2024-01-01',
        requiredDate: '2024-01-31',
        status: 'Closed',
        items: [
          {
            itemId: 'ITEM001',
            name: 'Paracetamol 500mg',
            quantity: 1000,
            specifications: 'BP grade, blister pack',
            estimatedValue: 25500.00
          },
          {
            itemId: 'ITEM002',
            name: 'Amoxicillin 250mg',
            quantity: 500,
            specifications: 'Capsules, NAFDAC approved',
            estimatedValue: 22500.00
          }
        ],
        totalEstimatedValue: 48000.00,
        quotations: [
          {
            quotationId: 'QUOT001',
            vendorId: 'VEND001',
            vendorName: 'PharmaPlus Ltd',
            submissionDate: '2024-01-10',
            validUntil: '2024-01-25',
            items: [
              {
                itemId: 'ITEM001',
                unitPrice: 25.50,
                totalPrice: 25500.00,
                deliveryTime: '3 days'
              },
              {
                itemId: 'ITEM002',
                unitPrice: 45.00,
                totalPrice: 22500.00,
                deliveryTime: '3 days'
              }
            ],
            totalPrice: 48000.00,
            terms: '30 days payment',
            status: 'Accepted'
          }
        ],
        selectedVendor: 'VEND001',
        awardDate: '2024-01-15',
        notes: 'Competitive bidding completed'
      }
    ],

    // Purchase orders
    purchaseOrders: [
      {
        poId: 'PO001',
        rfqId: 'RFQ001',
        vendorId: 'VEND001',
        vendorName: 'PharmaPlus Ltd',
        orderDate: '2024-01-15',
        deliveryDate: '2024-01-20',
        status: 'Delivered',
        items: [
          {
            itemId: 'ITEM001',
            name: 'Paracetamol 500mg',
            quantity: 1000,
            unitPrice: 25.50,
            totalPrice: 25500.00,
            deliveredQuantity: 1000,
            receivedDate: '2024-01-18'
          }
        ],
        subtotal: 48000.00,
        tax: 7200.00,
        totalAmount: 55200.00,
        paymentTerms: '30 days',
        deliveryTerms: 'DDP Hospital',
        approvedBy: 'Chief Pharmacist',
        approvalDate: '2024-01-15',
        receivedBy: 'Mrs. Zainab Hassan',
        grnNumber: 'GRN2024001',
        invoiceNumber: 'INV2024001',
        paymentStatus: 'Paid',
        notes: 'First delivery of annual contract'
      }
    ],

    // Goods Received Notes (GRN)
    goodsReceivedNotes: [
      {
        grnId: 'GRN001',
        poId: 'PO001',
        vendorId: 'VEND001',
        vendorName: 'PharmaPlus Ltd',
        receivedDate: '2024-01-18',
        receivedBy: 'Mrs. Zainab Hassan',
        inspectedBy: 'Quality Control Officer',
        status: 'Accepted',
        items: [
          {
            itemId: 'ITEM001',
            name: 'Paracetamol 500mg',
            orderedQuantity: 1000,
            receivedQuantity: 1000,
            acceptedQuantity: 1000,
            rejectedQuantity: 0,
            unitPrice: 25.50,
            batchNumber: 'PAN2024001',
            expiryDate: '2026-12-31',
            condition: 'Good',
            notes: 'All items accepted'
          }
        ],
        totalValue: 25500.00,
        qualityCheck: {
          packaging: 'Satisfactory',
          labeling: 'Correct',
          documentation: 'Complete',
          physicalCondition: 'Good',
          expiryDates: 'Acceptable'
        },
        discrepancies: [],
        acceptanceCertificate: 'AC2024001',
        notes: 'Quality inspection passed'
      }
    ],

    // Invoice matching (3-way matching)
    invoiceMatching: [
      {
        matchId: 'MATCH001',
        poId: 'PO001',
        grnId: 'GRN001',
        invoiceId: 'INV001',
        vendorId: 'VEND001',
        vendorName: 'PharmaPlus Ltd',
        matchDate: '2024-01-22',
        performedBy: 'Accounts Payable Officer',
        status: 'Matched',
        poTotal: 48000.00,
        grnTotal: 25500.00,
        invoiceTotal: 25500.00,
        variances: {
          quantity: 0,
          price: 0,
          total: 0
        },
        discrepancies: [],
        approvalStatus: 'Approved',
        approvedBy: 'Finance Manager',
        approvalDate: '2024-01-22',
        paymentAuthorized: true,
        notes: 'Perfect 3-way match'
      }
    ],

    // Payment authorizations
    paymentAuthorizations: [
      {
        authId: 'AUTH001',
        matchId: 'MATCH001',
        vendorId: 'VEND001',
        vendorName: 'PharmaPlus Ltd',
        amount: 25500.00,
        currency: 'NGN',
        paymentMethod: 'Bank Transfer',
        dueDate: '2024-02-14',
        requestedBy: 'Accounts Payable Officer',
        requestDate: '2024-01-22',
        approvedBy: 'Finance Manager',
        approvalDate: '2024-01-22',
        status: 'Approved',
        paymentDate: null,
        reference: 'PAY2024001',
        bankDetails: {
          accountName: 'PharmaPlus Ltd',
          accountNumber: '0123456789',
          bankName: 'First Bank Nigeria',
          sortCode: '011'
        },
        notes: 'Payment for pharmaceutical supplies'
      }
    ],

    // Vendor performance metrics
    vendorPerformance: [
      {
        vendorId: 'VEND001',
        period: '2024-Q1',
        metrics: {
          onTimeDelivery: 95,
          qualityRating: 4.8,
          responsiveness: 4.7,
          pricingCompetitiveness: 4.5,
          overallScore: 4.7
        },
        totalOrders: 8,
        totalValue: 1250000.00,
        issuesReported: 1,
        improvements: ['Improved delivery times', 'Better packaging']
      }
    ],

    // Procurement categories
    categories: [
      'Pharmaceuticals',
      'Medical Supplies',
      'Medical Equipment',
      'Consumables',
      'PPE',
      'Laboratory Reagents',
      'Radiology Supplies',
      'Surgical Instruments',
      'IT Equipment',
      'Maintenance Supplies'
    ],

    // Approval workflows
    approvalWorkflows: {
      LOW_VALUE: {
        threshold: 100000,
        approvers: ['Department Head']
      },
      MEDIUM_VALUE: {
        threshold: 500000,
        approvers: ['Department Head', 'Finance Manager']
      },
      HIGH_VALUE: {
        threshold: 1000000,
        approvers: ['Department Head', 'Finance Manager', 'Chief Executive']
      }
    }
  },

  reducers: {
    addVendor: (state, action) => {
      state.vendors.push(action.payload);
    },

    updateVendor: (state, action) => {
      const index = state.vendors.findIndex(vendor => vendor.vendorId === action.payload.vendorId);
      if (index !== -1) {
        state.vendors[index] = { ...state.vendors[index], ...action.payload };
      }
    },

    createRFQ: (state, action) => {
      state.rfqs.push(action.payload);
    },

    updateRFQ: (state, action) => {
      const index = state.rfqs.findIndex(rfq => rfq.rfqId === action.payload.rfqId);
      if (index !== -1) {
        state.rfqs[index] = { ...state.rfqs[index], ...action.payload };
      }
    },

    submitQuotation: (state, action) => {
      const { rfqId, quotation } = action.payload;
      const rfq = state.rfqs.find(r => r.rfqId === rfqId);
      if (rfq) {
        rfq.quotations.push(quotation);
      }
    },

    awardRFQ: (state, action) => {
      const { rfqId, vendorId, awardDate } = action.payload;
      const rfq = state.rfqs.find(r => r.rfqId === rfqId);
      if (rfq) {
        rfq.selectedVendor = vendorId;
        rfq.awardDate = awardDate;
        rfq.status = 'Awarded';
      }
    },

    createPurchaseOrder: (state, action) => {
      state.purchaseOrders.push(action.payload);
    },

    updatePurchaseOrder: (state, action) => {
      const index = state.purchaseOrders.findIndex(po => po.poId === action.payload.poId);
      if (index !== -1) {
        state.purchaseOrders[index] = { ...state.purchaseOrders[index], ...action.payload };
      }
    },

    createGRN: (state, action) => {
      state.goodsReceivedNotes.push(action.payload);
    },

    updateGRN: (state, action) => {
      const index = state.goodsReceivedNotes.findIndex(grn => grn.grnId === action.payload.grnId);
      if (index !== -1) {
        state.goodsReceivedNotes[index] = { ...state.goodsReceivedNotes[index], ...action.payload };
      }
    },

    createInvoiceMatch: (state, action) => {
      state.invoiceMatching.push(action.payload);
    },

    updateInvoiceMatch: (state, action) => {
      const index = state.invoiceMatching.findIndex(match => match.matchId === action.payload.matchId);
      if (index !== -1) {
        state.invoiceMatching[index] = { ...state.invoiceMatching[index], ...action.payload };
      }
    },

    createPaymentAuthorization: (state, action) => {
      state.paymentAuthorizations.push(action.payload);
    },

    updatePaymentAuthorization: (state, action) => {
      const index = state.paymentAuthorizations.findIndex(auth => auth.authId === action.payload.authId);
      if (index !== -1) {
        state.paymentAuthorizations[index] = { ...state.paymentAuthorizations[index], ...action.payload };
      }
    },

    updateVendorPerformance: (state, action) => {
      const index = state.vendorPerformance.findIndex(perf => perf.vendorId === action.payload.vendorId && perf.period === action.payload.period);
      if (index !== -1) {
        state.vendorPerformance[index] = { ...state.vendorPerformance[index], ...action.payload };
      } else {
        state.vendorPerformance.push(action.payload);
      }
    }
  }
});

export const {
  addVendor,
  updateVendor,
  createRFQ,
  updateRFQ,
  submitQuotation,
  awardRFQ,
  createPurchaseOrder,
  updatePurchaseOrder,
  createGRN,
  updateGRN,
  createInvoiceMatch,
  updateInvoiceMatch,
  createPaymentAuthorization,
  updatePaymentAuthorization,
  updateVendorPerformance
} = procurementSlice.actions;

export default procurementSlice.reducer;
