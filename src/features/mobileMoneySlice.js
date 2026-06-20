import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  providers: {
    mtn: {
      name: 'MTN Mobile Money',
      code: 'MTN',
      ussdCode: '*165#',
      logo: '🟡',
      status: 'active',
      supportedCurrencies: ['NGN'],
      transactionLimits: { min: 100, max: 300000, daily: 500000 }
    },
    airtel: {
      name: 'Airtel Money',
      code: 'AIRTEL',
      ussdCode: '*318#',
      logo: '🔴',
      status: 'active',
      supportedCurrencies: ['NGN'],
      transactionLimits: { min: 100, max: 200000, daily: 300000 }
    },
    '9mobile': {
      name: '9mobile Payments',
      code: '9MOBILE',
      ussdCode: '*222#',
      logo: '🟢',
      status: 'active',
      supportedCurrencies: ['NGN'],
      transactionLimits: { min: 100, max: 150000, daily: 200000 }
    },
    glo: {
      name: 'Glo QuickCharge',
      code: 'GLO',
      ussdCode: '*323#',
      logo: '🔵',
      status: 'active',
      supportedCurrencies: ['NGN'],
      transactionLimits: { min: 100, max: 100000, daily: 150000 }
    }
  },
  paymentRequests: [],
  settlements: [],
  webhooks: [],
  stats: {
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    totalVolume: 0,
    todayVolume: 0,
    pendingSettlements: 0
  },
  searchTerm: '',
  sortBy: 'date',
  filterBy: 'all',
  loading: false,
  error: null,
};

const mobileMoneySlice = createSlice({
  name: 'mobileMoney',
  initialState,
  reducers: {
    initiatePayment: (state, action) => {
      const { amount, provider, phoneNumber, reference, description, patientId } = action.payload;

      const paymentRequest = {
        id: Date.now().toString(),
        amount,
        provider,
        phoneNumber,
        reference: reference || `TXN${Date.now()}`,
        description: description || 'Hospital Payment',
        patientId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        ussdString: generateUSSDString(provider, amount, reference)
      };

      state.paymentRequests.push(paymentRequest);

      // Create transaction record
      const transaction = {
        id: paymentRequest.id,
        type: 'payment',
        amount,
        provider,
        phoneNumber,
        reference: paymentRequest.reference,
        description: paymentRequest.description,
        patientId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        metadata: { paymentRequestId: paymentRequest.id }
      };

      state.transactions.push(transaction);
    },

    processPayment: (state, action) => {
      const { paymentRequestId, status, transactionId, responseData } = action.payload;

      // Update payment request
      const paymentRequest = state.paymentRequests.find(p => p.id === paymentRequestId);
      if (paymentRequest) {
        paymentRequest.status = status;
        paymentRequest.processedAt = new Date().toISOString();
        paymentRequest.transactionId = transactionId;
        paymentRequest.responseData = responseData;
      }

      // Update transaction
      const transaction = state.transactions.find(t => t.metadata?.paymentRequestId === paymentRequestId);
      if (transaction) {
        transaction.status = status;
        transaction.processedAt = new Date().toISOString();
        transaction.transactionId = transactionId;
        transaction.responseData = responseData;

        // Update stats
        if (status === 'completed') {
          state.stats.successfulTransactions++;
          state.stats.totalVolume += transaction.amount;
          state.stats.todayVolume += transaction.amount;
        } else if (status === 'failed') {
          state.stats.failedTransactions++;
        }
      }

      state.stats.totalTransactions++;
    },

    createSettlement: (state, action) => {
      const { transactions, totalAmount, provider, settlementDate } = action.payload;

      const settlement = {
        id: Date.now().toString(),
        transactions: transactions.map(t => t.id),
        totalAmount,
        provider,
        settlementDate: settlementDate || new Date().toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      state.settlements.push(settlement);
      state.stats.pendingSettlements++;
    },

    processSettlement: (state, action) => {
      const { settlementId, status, bankReference, processedAt } = action.payload;

      const settlement = state.settlements.find(s => s.id === settlementId);
      if (settlement) {
        settlement.status = status;
        settlement.bankReference = bankReference;
        settlement.processedAt = processedAt || new Date().toISOString();

        if (status === 'completed') {
          state.stats.pendingSettlements--;
        }
      }
    },

    handleWebhook: (state, action) => {
      const { provider, eventType, data, receivedAt } = action.payload;

      const webhook = {
        id: Date.now().toString(),
        provider,
        eventType,
        data,
        receivedAt: receivedAt || new Date().toISOString(),
        processed: false
      };

      state.webhooks.push(webhook);

      // Process webhook based on event type
      if (eventType === 'payment.success') {
        const paymentRequest = state.paymentRequests.find(p =>
          p.reference === data.reference || p.id === data.paymentRequestId
        );

        if (paymentRequest) {
          // Auto-process successful payment
          dispatch(processPayment({
            paymentRequestId: paymentRequest.id,
            status: 'completed',
            transactionId: data.transactionId,
            responseData: data
          }));
        }
      } else if (eventType === 'payment.failed') {
        const paymentRequest = state.paymentRequests.find(p =>
          p.reference === data.reference || p.id === data.paymentRequestId
        );

        if (paymentRequest) {
          dispatch(processPayment({
            paymentRequestId: paymentRequest.id,
            status: 'failed',
            responseData: data
          }));
        }
      }

      webhook.processed = true;
    },

    generateUSSDPayment: (state, action) => {
      const { provider, amount, reference } = action.payload;

      const ussdString = generateUSSDString(provider, amount, reference);

      return {
        ussdString,
        instructions: `Dial ${ussdString} on your ${provider} phone to complete payment`,
        expiresIn: 10 // minutes
      };
    },

    checkTransactionStatus: (state, action) => {
      const { transactionId } = action.payload;

      const transaction = state.transactions.find(t => t.id === transactionId || t.transactionId === transactionId);
      return transaction ? transaction.status : 'not_found';
    },

    getProviderStats: (state, action) => {
      const { provider, dateRange } = action.payload;

      let providerTransactions = state.transactions.filter(t => t.provider === provider);

      if (dateRange) {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        providerTransactions = providerTransactions.filter(t => {
          const txDate = new Date(t.createdAt);
          return txDate >= startDate && txDate <= endDate;
        });
      }

      return {
        totalTransactions: providerTransactions.length,
        successfulTransactions: providerTransactions.filter(t => t.status === 'completed').length,
        failedTransactions: providerTransactions.filter(t => t.status === 'failed').length,
        totalVolume: providerTransactions
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0),
        averageTransaction: providerTransactions.length > 0 ?
          providerTransactions.reduce((sum, t) => sum + t.amount, 0) / providerTransactions.length : 0
      };
    },

    searchMobileMoney: (state, action) => {
      state.searchTerm = action.payload;
    },

    sortMobileMoney: (state, action) => {
      state.sortBy = action.payload;
    },

    filterMobileMoney: (state, action) => {
      state.filterBy = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Helper function to generate USSD strings
function generateUSSDString(provider, amount, reference) {
  const providerData = initialState.providers[provider.toLowerCase()];

  if (!providerData) return '';

  switch (provider.toLowerCase()) {
    case 'mtn':
      return `*165*1*1*${amount}*${reference}#`;
    case 'airtel':
      return `*318*1*${amount}*${reference}#`;
    case '9mobile':
      return `*222*1*${amount}*${reference}#`;
    case 'glo':
      return `*323*1*${amount}*${reference}#`;
    default:
      return '';
  }
}

export const {
  initiatePayment,
  processPayment,
  createSettlement,
  processSettlement,
  handleWebhook,
  generateUSSDPayment,
  checkTransactionStatus,
  getProviderStats,
  searchMobileMoney,
  sortMobileMoney,
  filterMobileMoney,
  setLoading,
  setError,
} = mobileMoneySlice.actions;

export default mobileMoneySlice.reducer;