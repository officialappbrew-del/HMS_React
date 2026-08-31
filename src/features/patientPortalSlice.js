import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  patients: [],
  appointments: [],
  medicalRecords: [],
  prescriptions: [],
  testResults: [],
  bills: [],
  payments: [],
  healthEducation: [],
  telemedicineSessions: [],
  notifications: [],
  searchTerm: '',
  sortBy: 'date',
  filterBy: 'all',
  loading: false,
  error: null,

  // Patient education content
  healthTopics: {
    malaria: {
      title: 'Malaria Prevention & Treatment',
      content: 'Malaria is a serious disease caused by parasites transmitted through mosquito bites...',
      symptoms: ['Fever', 'Headache', 'Chills', 'Muscle pain'],
      prevention: ['Use mosquito nets', 'Apply insect repellent', 'Take prophylaxis when traveling'],
      whenToSeeDoctor: 'Seek medical attention if you have fever and have been in malaria-endemic areas'
    },
    hypertension: {
      title: 'Managing High Blood Pressure',
      content: 'Hypertension is a common condition that can lead to serious health problems...',
      symptoms: ['Often asymptomatic', 'Headache', 'Dizziness', 'Blurred vision'],
      management: ['Regular blood pressure monitoring', 'Healthy diet', 'Regular exercise', 'Medication adherence'],
      lifestyleTips: ['Reduce salt intake', 'Maintain healthy weight', 'Limit alcohol', 'Quit smoking']
    },
    diabetes: {
      title: 'Living with Diabetes',
      content: 'Diabetes is a chronic condition that affects how your body processes blood sugar...',
      symptoms: ['Frequent urination', 'Increased thirst', 'Fatigue', 'Blurred vision'],
      management: ['Blood glucose monitoring', 'Healthy eating', 'Regular exercise', 'Medication'],
      complications: ['Heart disease', 'Kidney damage', 'Eye problems', 'Nerve damage']
    },
    maternal_health: {
      title: 'Maternal Health & Antenatal Care',
      content: 'Proper antenatal care is essential for a healthy pregnancy...',
      checkups: ['Regular blood pressure monitoring', 'Weight tracking', 'Fetal growth assessment'],
      nutrition: ['Balanced diet', 'Folic acid supplementation', 'Iron supplements'],
      warningSigns: ['Severe headache', 'Blurred vision', 'Swelling', 'Reduced fetal movement']
    }
  },

  // Appointment slots
  availableSlots: {
    'General Medicine': [
      '2024-01-15T09:00:00', '2024-01-15T10:00:00', '2024-01-15T11:00:00',
      '2024-01-16T09:00:00', '2024-01-16T10:00:00', '2024-01-16T14:00:00'
    ],
    'Pediatrics': [
      '2024-01-15T13:00:00', '2024-01-15T14:00:00', '2024-01-15T15:00:00',
      '2024-01-17T09:00:00', '2024-01-17T10:00:00', '2024-01-17T11:00:00'
    ],
    'Obstetrics': [
      '2024-01-15T16:00:00', '2024-01-16T13:00:00', '2024-01-16T14:00:00',
      '2024-01-18T09:00:00', '2024-01-18T10:00:00', '2024-01-18T11:00:00'
    ]
  }
};

const patientPortalSlice = createSlice({
  name: 'patientPortal',
  initialState,
  reducers: {
    registerPatient: (state, action) => {
      const patient = {
        id: Date.now().toString(),
        ...action.payload,
        registrationDate: new Date().toISOString(),
        status: 'active',
        profileComplete: false,
        emailVerified: false,
        phoneVerified: false
      };
      state.patients.push(patient);
    },

    updatePatientProfile: (state, action) => {
      const { patientId, updates } = action.payload;
      const patient = state.patients.find(p => p.id === patientId);
      if (patient) {
        Object.assign(patient, updates);
        patient.profileComplete = true;
      }
    },

    bookAppointment: (state, action) => {
      const appointment = {
        id: Date.now().toString(),
        ...action.payload,
        status: 'confirmed',
        bookedAt: new Date().toISOString(),
        reminderSent: false,
        checkInStatus: 'not_checked_in'
      };
      state.appointments.push(appointment);

      // Remove slot from available slots
      const department = action.payload.department;
      if (state.availableSlots[department]) {
        state.availableSlots[department] = state.availableSlots[department]
          .filter(slot => slot !== action.payload.dateTime);
      }

      // Create notification
      state.notifications.push({
        id: Date.now().toString(),
        patientId: action.payload.patientId,
        type: 'appointment_booked',
        title: 'Appointment Confirmed',
        message: `Your appointment with ${action.payload.doctor} is confirmed for ${new Date(action.payload.dateTime).toLocaleString()}`,
        read: false,
        createdAt: new Date().toISOString()
      });
    },

    cancelAppointment: (state, action) => {
      const { appointmentId, reason } = action.payload;
      const appointment = state.appointments.find(a => a.id === appointmentId);
      if (appointment) {
        appointment.status = 'cancelled';
        appointment.cancelReason = reason;
        appointment.cancelledAt = new Date().toISOString();

        // Add slot back to available slots
        if (state.availableSlots[appointment.department]) {
          state.availableSlots[appointment.department].push(appointment.dateTime);
        }

        // Create notification
        state.notifications.push({
          id: Date.now().toString(),
          patientId: appointment.patientId,
          type: 'appointment_cancelled',
          title: 'Appointment Cancelled',
          message: `Your appointment has been cancelled. ${reason || ''}`,
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    },

    requestPrescriptionRefill: (state, action) => {
      const request = {
        id: Date.now().toString(),
        ...action.payload,
        status: 'pending',
        requestedAt: new Date().toISOString()
      };
      state.prescriptions.push(request);

      // Create notification
      state.notifications.push({
        id: Date.now().toString(),
        patientId: action.payload.patientId,
        type: 'prescription_request',
        title: 'Prescription Refill Requested',
        message: `Your request for ${action.payload.medication} refill is being processed.`,
        read: false,
        createdAt: new Date().toISOString()
      });
    },

    viewTestResults: (state, action) => {
      const { patientId, testId } = action.payload;
      const result = state.testResults.find(r => r.id === testId && r.patientId === patientId);
      if (result) {
        result.viewedAt = new Date().toISOString();
        result.viewed = true;
      }
    },

    makePayment: (state, action) => {
      const payment = {
        id: Date.now().toString(),
        ...action.payload,
        status: 'completed',
        processedAt: new Date().toISOString(),
        receiptNumber: `RCP${Date.now()}`
      };
      state.payments.push(payment);

      // Update bill status
      const bill = state.bills.find(b => b.id === action.payload.billId);
      if (bill) {
        bill.status = 'paid';
        bill.paidAt = new Date().toISOString();
      }

      // Create notification
      state.notifications.push({
        id: Date.now().toString(),
        patientId: action.payload.patientId,
        type: 'payment_successful',
        title: 'Payment Successful',
        message: `Your payment of ₦${action.payload.amount} has been processed successfully.`,
        read: false,
        createdAt: new Date().toISOString()
      });
    },

    bookTelemedicineSession: (state, action) => {
      const session = {
        id: Date.now().toString(),
        ...action.payload,
        status: 'scheduled',
        bookedAt: new Date().toISOString(),
        meetingLink: `https://meet.smartcare.com/${Date.now()}`, // Mock link
        instructions: 'Please ensure you have a stable internet connection and are in a quiet environment.'
      };
      state.telemedicineSessions.push(session);

      // Create notification
      state.notifications.push({
        id: Date.now().toString(),
        patientId: action.payload.patientId,
        type: 'telemedicine_booked',
        title: 'Telemedicine Session Booked',
        message: `Your telemedicine session is scheduled for ${new Date(action.payload.dateTime).toLocaleString()}`,
        read: false,
        createdAt: new Date().toISOString()
      });
    },

    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
      }
    },

    submitFeedback: (state, action) => {
      const feedback = {
        id: Date.now().toString(),
        ...action.payload,
        submittedAt: new Date().toISOString(),
        status: 'received'
      };
      // In a real app, this would be sent to a feedback system
      console.log('Feedback submitted:', feedback);
    },

    hydratePortalData: (state, action) => {
      const { patient, appointments = [], lab_orders = [], documents = [], prescriptions = [], invoices = [], notifications = [] } = action.payload || {};
      if (patient) {
        const existingPatientIndex = state.patients.findIndex(item => item.id === patient.id);
        const profile = {
          ...patient,
          id: patient.id,
          name: patient.full_name || patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
          email: patient.email || '',
          phone: patient.phone || '',
          dateOfBirth: patient.date_of_birth || '',
          gender: patient.gender || '',
          address: patient.address || '',
          login_id: patient.login_id || patient.hospital_number || '',
          mrn: patient.mrn || '',
          hospital_number: patient.hospital_number || '',
        };

        if (existingPatientIndex >= 0) {
          state.patients[existingPatientIndex] = profile;
        } else {
          state.patients.push(profile);
        }
      }

      state.appointments = (appointments || []).map(appointment => ({
        id: appointment.id,
        patientId: appointment.patient || appointment.patient_id,
        doctor: appointment.doctor_name || appointment.doctor || 'Care Team',
        department: appointment.department_name || appointment.department || 'General Medicine',
        dateTime: appointment.scheduled_date && appointment.scheduled_time
          ? `${appointment.scheduled_date}T${appointment.scheduled_time}`
          : appointment.date_time || appointment.dateTime || '',
        reason: appointment.reason || appointment.notes || 'Scheduled visit',
        status: appointment.status || 'confirmed',
        reminderSent: appointment.reminder_sent || false,
      }));

      state.testResults = (lab_orders || []).map(order => ({
        id: order.id,
        patientId: order.patient || order.patient_id,
        title: order.test?.name || order.test_name || 'Lab order',
        status: order.status || 'ordered',
        date: order.ordered_date || order.created_at || '',
      }));

      state.medicalRecords = (documents || []).map(document => ({
        id: document.id,
        title: document.title || document.file_name || 'Medical document',
        type: document.document_type || 'other',
        date: document.upload_date || document.document_date || '',
        fileName: document.file_name || '',
        fileUrl: document.file || document.file_url || '',
      }));

      state.prescriptions = (prescriptions || []).map(prescription => ({
        id: prescription.id,
        medication: prescription.drug_name || prescription.medication || '',
        dosage: prescription.dosage || '',
        frequency: prescription.frequency || '',
        duration: prescription.duration || '',
        quantity: prescription.quantity || 1,
        status: prescription.status || 'prescribed',
        prescribedAt: prescription.prescribed_date || '',
        prescribedBy: prescription.prescribed_by_name || '',
        visitNumber: prescription.visit_number || '',
        instructions: prescription.instructions || '',
      }));

      state.bills = (invoices || []).map(invoice => ({
        id: invoice.id,
        description: invoice.items?.map(item => item.description).filter(Boolean).join(', ') || 'Medical services',
        amount: Number(invoice.balance_due ?? invoice.total_amount ?? 0),
        totalAmount: Number(invoice.total_amount ?? 0),
        date: invoice.invoice_date || '',
        dueDate: invoice.due_date || '',
        status: invoice.status || 'issued',
        service: invoice.items?.[0]?.item_type || 'Healthcare service',
      }));

      state.notifications = (notifications || []).map(notification => ({
        id: notification.id,
        patientId: notification.patientId || patient?.id,
        type: notification.type || 'portal_update',
        title: notification.title || 'Portal update',
        message: notification.message || '',
        read: notification.read ?? true,
        createdAt: notification.createdAt || new Date().toISOString(),
      }));
    },

    searchPortal: (state, action) => {
      state.searchTerm = action.payload;
    },

    sortPortal: (state, action) => {
      state.sortBy = action.payload;
    },

    filterPortal: (state, action) => {
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

export const {
  registerPatient,
  updatePatientProfile,
  bookAppointment,
  cancelAppointment,
  requestPrescriptionRefill,
  viewTestResults,
  makePayment,
  bookTelemedicineSession,
  markNotificationRead,
  submitFeedback,
  hydratePortalData,
  searchPortal,
  sortPortal,
  filterPortal,
  setLoading,
  setError,
} = patientPortalSlice.actions;

export default patientPortalSlice.reducer;