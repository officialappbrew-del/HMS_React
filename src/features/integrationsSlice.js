import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  integrations: {},
  webhooks: [],
  logs: [],
  stats: {
    totalIntegrations: 0,
    activeIntegrations: 0,
    todaySyncs: 0,
    errorCount: 0
  },
  searchTerm: '',
  filterBy: 'all',
  loading: false,
  error: null
};

const integrationsSlice = createSlice({
  name: 'integrations',
  initialState,
  reducers: {
    configureIntegration: (state, action) => {
      const integration = {
        id: `integration-${Date.now()}`,
        ...action.payload,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastSync: null,
        apiCallsToday: 0,
        errorCount: 0,
        successCount: 0
      };
      state.integrations[integration.id] = integration;
      state.stats.totalIntegrations += 1;

      // Add to logs
      state.logs.push({
        id: `log-${Date.now()}`,
        integrationId: integration.id,
        action: 'configure',
        status: 'success',
        message: `Integration ${integration.system} configured successfully`,
        timestamp: new Date().toISOString()
      });
    },

    testIntegration: (state, action) => {
      const { integrationId } = action.payload;
      if (state.integrations[integrationId]) {
        const integration = state.integrations[integrationId];
        integration.status = 'testing';

        // Simulate testing (in real app, this would make actual API calls)
        setTimeout(() => {
          const randomSuccess = Math.random() > 0.2; // 80% success rate
          integration.status = randomSuccess ? 'active' : 'error';
          integration.updatedAt = new Date().toISOString();

          if (randomSuccess) {
            state.stats.activeIntegrations += 1;
          }

          // Add to logs
          state.logs.push({
            id: `log-${Date.now()}`,
            integrationId,
            action: 'test',
            status: randomSuccess ? 'success' : 'error',
            message: randomSuccess
              ? `Integration ${integration.system} test successful`
              : `Integration ${integration.system} test failed`,
            timestamp: new Date().toISOString()
          });
        }, 2000);
      }
    },

    enableIntegration: (state, action) => {
      const { integrationId } = action.payload;
      if (state.integrations[integrationId]) {
        state.integrations[integrationId].status = 'active';
        state.integrations[integrationId].updatedAt = new Date().toISOString();
        state.stats.activeIntegrations += 1;

        // Add to logs
        state.logs.push({
          id: `log-${Date.now()}`,
          integrationId,
          action: 'enable',
          status: 'success',
          message: `Integration ${state.integrations[integrationId].system} enabled`,
          timestamp: new Date().toISOString()
        });
      }
    },

    disableIntegration: (state, action) => {
      const { integrationId } = action.payload;
      if (state.integrations[integrationId]) {
        state.integrations[integrationId].status = 'inactive';
        state.integrations[integrationId].updatedAt = new Date().toISOString();
        state.stats.activeIntegrations = Math.max(0, state.stats.activeIntegrations - 1);

        // Add to logs
        state.logs.push({
          id: `log-${Date.now()}`,
          integrationId,
          action: 'disable',
          status: 'success',
          message: `Integration ${state.integrations[integrationId].system} disabled`,
          timestamp: new Date().toISOString()
        });
      }
    },

    syncData: (state, action) => {
      const { integrationId } = action.payload;
      if (state.integrations[integrationId]) {
        const integration = state.integrations[integrationId];
        integration.status = 'testing'; // Show as syncing

        // Simulate sync process
        setTimeout(() => {
          integration.status = 'active';
          integration.lastSync = new Date().toISOString();
          integration.apiCallsToday += 1;
          integration.updatedAt = new Date().toISOString();
          state.stats.todaySyncs += 1;

          // Add to logs
          state.logs.push({
            id: `log-${Date.now()}`,
            integrationId,
            action: 'sync',
            status: 'success',
            message: `Data sync completed for ${integration.system}`,
            timestamp: new Date().toISOString()
          });
        }, 3000);
      }
    },

    updateIntegrationCredentials: (state, action) => {
      const { integrationId, credentials } = action.payload;
      if (state.integrations[integrationId]) {
        state.integrations[integrationId] = {
          ...state.integrations[integrationId],
          ...credentials,
          updatedAt: new Date().toISOString()
        };

        // Add to logs
        state.logs.push({
          id: `log-${Date.now()}`,
          integrationId,
          action: 'update_credentials',
          status: 'success',
          message: `Credentials updated for ${state.integrations[integrationId].system}`,
          timestamp: new Date().toISOString()
        });
      }
    },

    createWebhook: (state, action) => {
      const webhook = {
        id: `webhook-${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        lastTriggered: null,
        successCount: 0,
        failureCount: 0,
        successRate: 0
      };
      state.webhooks.push(webhook);

      // Add to logs
      state.logs.push({
        id: `log-${Date.now()}`,
        integrationId: webhook.integrationId,
        action: 'create_webhook',
        status: 'success',
        message: `Webhook ${webhook.name} created`,
        timestamp: new Date().toISOString()
      });
    },

    updateWebhook: (state, action) => {
      const { webhookId, updates } = action.payload;
      const webhookIndex = state.webhooks.findIndex(w => w.id === webhookId);
      if (webhookIndex !== -1) {
        state.webhooks[webhookIndex] = {
          ...state.webhooks[webhookIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    deleteWebhook: (state, action) => {
      const webhookId = action.payload;
      state.webhooks = state.webhooks.filter(w => w.id !== webhookId);

      // Add to logs
      state.logs.push({
        id: `log-${Date.now()}`,
        integrationId: 'system',
        action: 'delete_webhook',
        status: 'success',
        message: `Webhook deleted`,
        timestamp: new Date().toISOString()
      });
    },

    getIntegrationLogs: (state, action) => {
      // In a real app, this would fetch logs from the server
      // For now, we'll just return the existing logs
    },

    searchIntegrations: (state, action) => {
      state.searchTerm = action.payload;
    },

    filterIntegrations: (state, action) => {
      state.filterBy = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Initialize with sample data
    initializeSampleData: (state) => {
      // Sample integrations
      const sampleIntegrations = {
        'integration-1': {
          id: 'integration-1',
          name: 'NHIS Portal',
          system: 'nhis',
          category: 'government',
          apiEndpoint: 'https://api.nhis.gov.ng/v1',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          lastSync: '2024-01-15T10:00:00Z',
          apiCallsToday: 45,
          errorCount: 0,
          successCount: 95
        },
        'integration-2': {
          id: 'integration-2',
          name: 'Paystack',
          system: 'paystack',
          category: 'financial',
          apiEndpoint: 'https://api.paystack.co',
          status: 'active',
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-15T08:30:00Z',
          lastSync: '2024-01-15T08:30:00Z',
          apiCallsToday: 120,
          errorCount: 2,
          successCount: 98
        },
        'integration-3': {
          id: 'integration-3',
          name: 'Bulk SMS Gateway',
          system: 'bulk_sms',
          category: 'communication',
          apiEndpoint: 'https://api.smsprovider.com/v1',
          status: 'active',
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-15T12:00:00Z',
          lastSync: '2024-01-15T12:00:00Z',
          apiCallsToday: 85,
          errorCount: 1,
          successCount: 97
        },
        'integration-4': {
          id: 'integration-4',
          name: 'NCDC Portal',
          system: 'ncdc',
          category: 'government',
          apiEndpoint: 'https://api.ncdc.gov.ng/v1',
          status: 'error',
          createdAt: '2024-01-12T00:00:00Z',
          updatedAt: '2024-01-15T14:00:00Z',
          lastSync: null,
          apiCallsToday: 0,
          errorCount: 5,
          successCount: 0
        }
      };

      // Sample webhooks
      const sampleWebhooks = [
        {
          id: 'webhook-1',
          name: 'NHIS Claims Webhook',
          integrationId: 'integration-1',
          url: 'https://hms.example.com/webhooks/nhis',
          events: ['claim_submitted', 'claim_approved', 'claim_rejected'],
          secret: 'nhis_webhook_secret_123',
          active: true,
          createdAt: '2024-01-05T00:00:00Z',
          lastTriggered: '2024-01-15T10:30:00Z',
          successCount: 25,
          failureCount: 1,
          successRate: 96
        },
        {
          id: 'webhook-2',
          name: 'Payment Notifications',
          integrationId: 'integration-2',
          url: 'https://hms.example.com/webhooks/payments',
          events: ['payment_successful', 'payment_failed'],
          secret: 'paystack_webhook_secret_456',
          active: true,
          createdAt: '2024-01-10T00:00:00Z',
          lastTriggered: '2024-01-15T11:15:00Z',
          successCount: 45,
          failureCount: 0,
          successRate: 100
        }
      ];

      // Sample logs
      const sampleLogs = [
        {
          id: 'log-1',
          integrationId: 'integration-1',
          action: 'sync',
          status: 'success',
          message: 'Successfully synced 25 NHIS claims',
          timestamp: '2024-01-15T10:00:00Z'
        },
        {
          id: 'log-2',
          integrationId: 'integration-2',
          action: 'sync',
          status: 'success',
          message: 'Payment data synchronized successfully',
          timestamp: '2024-01-15T08:30:00Z'
        },
        {
          id: 'log-3',
          integrationId: 'integration-4',
          action: 'test',
          status: 'error',
          message: 'Connection timeout - NCDC API unreachable',
          timestamp: '2024-01-15T14:00:00Z'
        },
        {
          id: 'log-4',
          integrationId: 'integration-3',
          action: 'sync',
          status: 'success',
          message: 'SMS delivery reports updated',
          timestamp: '2024-01-15T12:00:00Z'
        }
      ];

      state.integrations = sampleIntegrations;
      state.webhooks = sampleWebhooks;
      state.logs = sampleLogs;
      state.stats.totalIntegrations = Object.keys(sampleIntegrations).length;
      state.stats.activeIntegrations = Object.values(sampleIntegrations).filter(i => i.status === 'active').length;
      state.stats.errorCount = Object.values(sampleIntegrations).filter(i => i.status === 'error').length;
      state.stats.todaySyncs = 3;
    }
  }
});

export const {
  configureIntegration,
  testIntegration,
  enableIntegration,
  disableIntegration,
  updateIntegrationCredentials,
  syncData,
  getIntegrationLogs,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  searchIntegrations,
  filterIntegrations,
  setLoading,
  setError,
  clearError,
  initializeSampleData
} = integrationsSlice.actions;

export default integrationsSlice.reducer;