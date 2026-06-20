import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reminders: [],
  templates: {
    'template-1': {
      id: 'template-1',
      name: 'Appointment Reminder',
      type: 'sms',
      channels: ['sms', 'whatsapp'],
      content: 'Hi {patient_name}, this is a reminder for your appointment with Dr. {doctor_name} on {appointment_date} at {appointment_time}. Please arrive 15 minutes early. Reply CONFIRM to confirm.',
      variables: ['patient_name', 'doctor_name', 'appointment_date', 'appointment_time'],
      createdAt: new Date().toISOString(),
      usageCount: 0
    },
    'template-2': {
      id: 'template-2',
      name: 'Appointment Confirmation',
      type: 'sms',
      channels: ['sms'],
      content: 'Thank you {patient_name} for confirming your appointment. We look forward to seeing you on {appointment_date} at {appointment_time}.',
      variables: ['patient_name', 'appointment_date', 'appointment_time'],
      createdAt: new Date().toISOString(),
      usageCount: 0
    },
    'template-3': {
      id: 'template-3',
      name: 'Appointment Cancellation',
      type: 'sms',
      channels: ['sms', 'whatsapp'],
      content: 'Dear {patient_name}, your appointment on {appointment_date} has been cancelled. Please contact us to reschedule.',
      variables: ['patient_name', 'appointment_date'],
      createdAt: new Date().toISOString(),
      usageCount: 0
    },
    'template-4': {
      id: 'template-4',
      name: 'Follow-up Reminder',
      type: 'sms',
      channels: ['sms', 'whatsapp'],
      content: 'Hi {patient_name}, it\'s time for your follow-up appointment. Please schedule your next visit with us.',
      variables: ['patient_name'],
      createdAt: new Date().toISOString(),
      usageCount: 0
    }
  },
  campaigns: [],
  sentMessages: [],
  stats: {
    totalSent: 0,
    delivered: 0,
    pending: 0,
    failed: 0
  },
  searchTerm: '',
  sortBy: 'date',
  filterBy: 'all',
  loading: false,
  error: null
};

const communicationSlice = createSlice({
  name: 'communication',
  initialState,
  reducers: {
    scheduleReminder: (state, action) => {
      const reminder = {
        id: `reminder-${Date.now()}`,
        ...action.payload,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        sentAt: null,
        deliveredAt: null
      };
      state.reminders.push(reminder);
      state.stats.pending += 1;
    },

    sendMessage: (state, action) => {
      const message = {
        id: `msg-${Date.now()}`,
        ...action.payload,
        status: 'sending',
        sentAt: new Date().toISOString(),
        deliveredAt: null,
        failedAt: null,
        retryCount: 0
      };
      state.sentMessages.push(message);
      state.stats.totalSent += 1;

      // Simulate delivery (in real app, this would be handled by backend)
      setTimeout(() => {
        const msgIndex = state.sentMessages.findIndex(m => m.id === message.id);
        if (msgIndex !== -1) {
          const randomStatus = Math.random() > 0.1 ? 'delivered' : 'failed';
          state.sentMessages[msgIndex].status = randomStatus;
          state.sentMessages[msgIndex].deliveredAt = randomStatus === 'delivered' ? new Date().toISOString() : null;
          state.sentMessages[msgIndex].failedAt = randomStatus === 'failed' ? new Date().toISOString() : null;

          if (randomStatus === 'delivered') {
            state.stats.delivered += 1;
            state.stats.pending -= 1;
          } else {
            state.stats.failed += 1;
            state.stats.pending -= 1;
          }
        }
      }, 2000);
    },

    createTemplate: (state, action) => {
      const template = {
        id: `template-${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        usageCount: 0
      };
      state.templates[template.id] = template;
    },

    createCampaign: (state, action) => {
      const campaign = {
        id: `campaign-${Date.now()}`,
        ...action.payload,
        status: 'scheduled',
        sentCount: 0,
        deliveredCount: 0,
        failedCount: 0,
        createdAt: new Date().toISOString(),
        executedAt: null
      };
      state.campaigns.push(campaign);
    },

    executeCampaign: (state, action) => {
      const campaignIndex = state.campaigns.findIndex(c => c.id === action.payload.campaignId);
      if (campaignIndex !== -1) {
        state.campaigns[campaignIndex].status = 'executing';
        state.campaigns[campaignIndex].executedAt = new Date().toISOString();

        // Simulate campaign execution
        const campaign = state.campaigns[campaignIndex];
        const template = state.templates[campaign.templateId];

        if (template && campaign.recipients.length > 0) {
          campaign.recipients.forEach(recipient => {
            const message = {
              id: `msg-${Date.now()}-${Math.random()}`,
              recipient,
              content: template.content,
              channel: campaign.channels[0],
              templateId: template.id,
              campaignId: campaign.id,
              status: 'sending',
              sentAt: new Date().toISOString(),
              deliveredAt: null,
              failedAt: null,
              retryCount: 0
            };
            state.sentMessages.push(message);
            state.stats.totalSent += 1;
            campaign.sentCount += 1;

            // Simulate delivery
            setTimeout(() => {
              const msgIndex = state.sentMessages.findIndex(m => m.id === message.id);
              if (msgIndex !== -1) {
                const randomStatus = Math.random() > 0.1 ? 'delivered' : 'failed';
                state.sentMessages[msgIndex].status = randomStatus;
                state.sentMessages[msgIndex].deliveredAt = randomStatus === 'delivered' ? new Date().toISOString() : null;
                state.sentMessages[msgIndex].failedAt = randomStatus === 'failed' ? new Date().toISOString() : null;

                if (randomStatus === 'delivered') {
                  state.stats.delivered += 1;
                  campaign.deliveredCount += 1;
                } else {
                  state.stats.failed += 1;
                  campaign.failedCount += 1;
                }
              }
            }, Math.random() * 3000 + 1000);
          });

          state.campaigns[campaignIndex].status = 'completed';
        }
      }
    },

    generateAppointmentReminders: (state) => {
      // Generate sample reminders for upcoming appointments
      const sampleReminders = [
        {
          appointmentId: 'APT-001',
          patientId: 'PAT-001',
          templateId: 'template-1',
          channels: ['sms', 'whatsapp'],
          scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          patientData: {
            patient_name: 'John Doe',
            doctor_name: 'Dr. Smith',
            appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-NG'),
            appointment_time: '10:00 AM'
          }
        },
        {
          appointmentId: 'APT-002',
          patientId: 'PAT-002',
          templateId: 'template-1',
          channels: ['sms'],
          scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
          patientData: {
            patient_name: 'Jane Smith',
            doctor_name: 'Dr. Johnson',
            appointment_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NG'),
            appointment_time: '2:30 PM'
          }
        },
        {
          appointmentId: 'APT-003',
          patientId: 'PAT-003',
          templateId: 'template-4',
          channels: ['sms', 'whatsapp'],
          scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          patientData: {
            patient_name: 'Mike Johnson',
            doctor_name: 'Dr. Williams',
            appointment_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NG'),
            appointment_time: '9:00 AM'
          }
        }
      ];

      sampleReminders.forEach(reminder => {
        const newReminder = {
          id: `reminder-${Date.now()}-${Math.random()}`,
          ...reminder,
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          sentAt: null,
          deliveredAt: null
        };
        state.reminders.push(newReminder);
        state.stats.pending += 1;
      });
    },

    updateReminderStatus: (state, action) => {
      const { reminderId, status } = action.payload;
      const reminderIndex = state.reminders.findIndex(r => r.id === reminderId);
      if (reminderIndex !== -1) {
        const oldStatus = state.reminders[reminderIndex].status;
        state.reminders[reminderIndex].status = status;

        if (status === 'sent') {
          state.reminders[reminderIndex].sentAt = new Date().toISOString();
          if (oldStatus === 'scheduled') state.stats.pending -= 1;
        } else if (status === 'delivered') {
          state.reminders[reminderIndex].deliveredAt = new Date().toISOString();
          state.stats.delivered += 1;
        } else if (status === 'failed') {
          state.stats.failed += 1;
          if (oldStatus === 'scheduled') state.stats.pending -= 1;
        }
      }
    },

    searchCommunications: (state, action) => {
      state.searchTerm = action.payload;
    },

    sortCommunications: (state, action) => {
      state.sortBy = action.payload;
    },

    filterCommunications: (state, action) => {
      state.filterBy = action.payload;
    },

    deleteTemplate: (state, action) => {
      delete state.templates[action.payload];
    },

    deleteCampaign: (state, action) => {
      state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  scheduleReminder,
  sendMessage,
  createTemplate,
  createCampaign,
  executeCampaign,
  generateAppointmentReminders,
  updateReminderStatus,
  searchCommunications,
  sortCommunications,
  filterCommunications,
  deleteTemplate,
  deleteCampaign,
  setLoading,
  setError,
  clearError
} = communicationSlice.actions;

export default communicationSlice.reducer;