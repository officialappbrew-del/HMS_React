import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const createMedicationOrder = createAsyncThunk(
  'orderEntry/createMedicationOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // In a real app, this would call the order API
      // const response = await api.post('/orders/medication', orderData);
      // return response.data;

      // Mock implementation
      const newOrder = {
        id: `MED-${Date.now()}`,
        type: 'medication',
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        priority: orderData.controlled ? 'high' : 'routine'
      };
      return newOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createLabOrder = createAsyncThunk(
  'orderEntry/createLabOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // Mock implementation
      const newOrder = {
        id: `LAB-${Date.now()}`,
        type: 'laboratory',
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        details: orderData.testPanel || orderData.individualTests?.join(', ') || 'Lab tests'
      };
      return newOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createRadiologyOrder = createAsyncThunk(
  'orderEntry/createRadiologyOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // Mock implementation
      const newOrder = {
        id: `RAD-${Date.now()}`,
        type: 'radiology',
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        details: `${orderData.modality} - ${orderData.bodyPart}`
      };
      return newOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProcedureOrder = createAsyncThunk(
  'orderEntry/createProcedureOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // Mock implementation
      const newOrder = {
        id: `PROC-${Date.now()}`,
        type: 'procedure',
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        details: `${orderData.procedure}${orderData.bodySite ? ` - ${orderData.bodySite}` : ''}`
      };
      return newOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createDietaryOrder = createAsyncThunk(
  'orderEntry/createDietaryOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // Mock implementation
      const newOrder = {
        id: `DIET-${Date.now()}`,
        type: 'dietary',
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        details: `${orderData.dietType} diet`
      };
      return newOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orderEntry/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      // Mock implementation
      return { orderId, status, updatedAt: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orderEntry/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      // Mock implementation
      return { orderId, status: 'cancelled', cancelledAt: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkOrderInteractions = createAsyncThunk(
  'orderEntry/checkOrderInteractions',
  async (_, { rejectWithValue }) => {
    try {
      // Mock implementation - would check for interactions with CDS
      const interactions = [
        {
          type: 'drug-allergy',
          severity: 'high',
          message: 'Patient allergic to penicillin - current order contains amoxicillin',
          recommendation: 'Cancel order and select alternative antibiotic'
        },
        {
          type: 'drug-drug',
          severity: 'moderate',
          message: 'Potential interaction between metformin and contrast media',
          recommendation: 'Hold metformin 48 hours before and after procedure'
        }
      ];
      return interactions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchOrders = createAsyncThunk(
  'orderEntry/searchOrders',
  async (searchTerm, { rejectWithValue }) => {
    try {
      // Mock implementation
      return { searchTerm };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const filterOrders = createAsyncThunk(
  'orderEntry/filterOrders',
  async (filterBy, { rejectWithValue }) => {
    try {
      // Mock implementation
      return { filterBy };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateOrderSummary = createAsyncThunk(
  'orderEntry/generateOrderSummary',
  async (orderId, { rejectWithValue }) => {
    try {
      // Mock implementation - would generate PDF or printable summary
      console.log('Generating order summary for:', orderId);
      return { success: true, orderId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const printOrder = createAsyncThunk(
  'orderEntry/printOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      // Mock implementation - would trigger print dialog
      console.log('Printing order:', orderId);
      return { success: true, orderId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  orders: [
    {
      id: 'MED-001',
      type: 'medication',
      patientId: 'PAT-001',
      patientName: 'John Doe',
      medication: 'Artemether-Lumefantrine',
      dose: '20/120mg',
      frequency: 'bd',
      duration: '3',
      route: 'oral',
      indication: 'Malaria',
      status: 'completed',
      priority: 'routine',
      orderingPhysician: 'Dr. Adebayo',
      createdAt: '2024-01-27T08:00:00Z',
      details: 'Artemether-Lumefantrine 20/120mg BD for 3 days'
    },
    {
      id: 'LAB-001',
      type: 'laboratory',
      patientId: 'PAT-002',
      patientName: 'Jane Smith',
      testPanel: 'Full Blood Count',
      priority: 'urgent',
      clinicalIndication: 'Fever investigation',
      status: 'pending',
      orderingPhysician: 'Dr. Okon',
      createdAt: '2024-01-27T09:30:00Z',
      details: 'Full Blood Count - Fever investigation'
    },
    {
      id: 'RAD-001',
      type: 'radiology',
      patientId: 'PAT-003',
      patientName: 'Mike Johnson',
      modality: 'X-Ray',
      bodyPart: 'Chest',
      clinicalIndication: 'Cough evaluation',
      status: 'completed',
      priority: 'routine',
      orderingPhysician: 'Dr. Ibrahim',
      createdAt: '2024-01-27T10:15:00Z',
      details: 'X-Ray - Chest'
    },
    {
      id: 'PROC-001',
      type: 'procedure',
      patientId: 'PAT-004',
      patientName: 'Sarah Williams',
      procedure: 'Venipuncture',
      bodySite: 'Left arm',
      clinicalIndication: 'Blood collection',
      status: 'pending',
      priority: 'routine',
      orderingPhysician: 'Dr. Adebayo',
      createdAt: '2024-01-27T11:00:00Z',
      details: 'Venipuncture - Left arm'
    },
    {
      id: 'DIET-001',
      type: 'dietary',
      patientId: 'PAT-005',
      patientName: 'David Brown',
      dietType: 'Diabetic Diet',
      status: 'active',
      priority: 'routine',
      orderingPhysician: 'Dr. Okon',
      createdAt: '2024-01-27T12:00:00Z',
      details: 'Diabetic Diet'
    }
  ],
  pendingOrders: [],
  completedOrders: [],
  interactions: [],
  searchTerm: '',
  filterBy: 'all',
  loading: false,
  error: null
};

// Order Entry slice
const orderEntrySlice = createSlice({
  name: 'orderEntry',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetOrderForms: (state) => {
      // Reset form states if needed
    },
    updateOrderLocally: (state, action) => {
      const { id, updates } = action.payload;
      const order = state.orders.find(o => o.id === id);
      if (order) {
        Object.assign(order, updates);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Medication Order
      .addCase(createMedicationOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMedicationOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.pendingOrders.push(action.payload);
      })
      .addCase(createMedicationOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Lab Order
      .addCase(createLabOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLabOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.pendingOrders.push(action.payload);
      })
      .addCase(createLabOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Radiology Order
      .addCase(createRadiologyOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRadiologyOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.pendingOrders.push(action.payload);
      })
      .addCase(createRadiologyOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Procedure Order
      .addCase(createProcedureOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProcedureOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.pendingOrders.push(action.payload);
      })
      .addCase(createProcedureOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Dietary Order
      .addCase(createDietaryOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDietaryOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.pendingOrders.push(action.payload);
      })
      .addCase(createDietaryOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { orderId, status } = action.payload;
        const order = state.orders.find(o => o.id === orderId);
        if (order) {
          order.status = status;
          if (status === 'completed') {
            state.completedOrders.push(order);
            state.pendingOrders = state.pendingOrders.filter(o => o.id !== orderId);
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const { orderId } = action.payload;
        const order = state.orders.find(o => o.id === orderId);
        if (order) {
          order.status = 'cancelled';
          state.pendingOrders = state.pendingOrders.filter(o => o.id !== orderId);
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Order Interactions
      .addCase(checkOrderInteractions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOrderInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions = action.payload;
      })
      .addCase(checkOrderInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Orders
      .addCase(searchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.searchTerm = action.payload.searchTerm;
      })
      .addCase(searchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Filter Orders
      .addCase(filterOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.filterBy = action.payload.filterBy;
      })
      .addCase(filterOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Generate Order Summary
      .addCase(generateOrderSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateOrderSummary.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(generateOrderSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Print Order
      .addCase(printOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(printOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(printOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  resetOrderForms,
  updateOrderLocally
} = orderEntrySlice.actions;

export default orderEntrySlice.reducer;