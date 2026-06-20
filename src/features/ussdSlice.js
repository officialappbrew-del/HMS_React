import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessions: [],
  menus: {
    main: {
      1: { text: 'Patient Services', action: 'patient_services' },
      2: { text: 'Emergency Services', action: 'emergency_services' },
      3: { text: 'Information', action: 'information' },
      4: { text: 'Feedback', action: 'feedback' }
    },
    patient_services: {
      1: { text: 'Check Appointment', action: 'check_appointment' },
      2: { text: 'Book Appointment', action: 'book_appointment' },
      3: { text: 'Lab Results', action: 'lab_results' },
      4: { text: 'Pay Bill', action: 'pay_bill' },
      5: { text: 'Request Prescription Refill', action: 'prescription_refill' }
    },
    emergency_services: {
      1: { text: 'Ambulance Request', action: 'ambulance_request' },
      2: { text: 'Emergency Contact', action: 'emergency_contact' },
      3: { text: 'Nearest Hospital', action: 'nearest_hospital' }
    },
    information: {
      1: { text: 'Visiting Hours', action: 'visiting_hours' },
      2: { text: 'Doctor Schedules', action: 'doctor_schedules' },
      3: { text: 'Services Offered', action: 'services_offered' },
      4: { text: 'Directions', action: 'directions' }
    },
    feedback: {
      1: { text: 'Submit Complaint', action: 'submit_complaint' },
      2: { text: 'Rate Service', action: 'rate_service' },
      3: { text: 'Suggestion Box', action: 'suggestion_box' }
    }
  },
  responses: [],
  searchTerm: '',
  sortBy: 'date',
  filterBy: 'all',
  loading: false,
  error: null,
};

const ussdSlice = createSlice({
  name: 'ussd',
  initialState,
  reducers: {
    startSession: (state, action) => {
      const session = {
        id: Date.now().toString(),
        phoneNumber: action.payload.phoneNumber,
        currentMenu: 'main',
        language: 'english',
        responses: [],
        timestamp: new Date().toISOString(),
        active: true,
      };
      state.sessions.push(session);
    },
    updateSession: (state, action) => {
      const { sessionId, input, response } = action.payload;
      const session = state.sessions.find(s => s.id === sessionId);
      if (session) {
        session.responses.push({ input, response, timestamp: new Date().toISOString() });
        if (action.payload.newMenu) {
          session.currentMenu = action.payload.newMenu;
        }
      }
    },
    endSession: (state, action) => {
      const session = state.sessions.find(s => s.id === action.payload);
      if (session) {
        session.active = false;
        session.endTime = new Date().toISOString();
      }
    },
    processUSSDInput: (state, action) => {
      const { sessionId, input } = action.payload;
      const session = state.sessions.find(s => s.id === sessionId);

      if (!session) return;

      const currentMenu = state.menus[session.currentMenu];
      const selectedOption = currentMenu[input];

      let response = '';
      let newMenu = null;

      if (selectedOption) {
        switch (selectedOption.action) {
          case 'patient_services':
            response = 'Patient Services:\n1. Check Appointment\n2. Book Appointment\n3. Lab Results\n4. Pay Bill\n5. Request Prescription Refill\n0. Back';
            newMenu = 'patient_services';
            break;
          case 'emergency_services':
            response = 'Emergency Services:\n1. Ambulance Request\n2. Emergency Contact\n3. Nearest Hospital\n0. Back';
            newMenu = 'emergency_services';
            break;
          case 'information':
            response = 'Information:\n1. Visiting Hours\n2. Doctor Schedules\n3. Services Offered\n4. Directions\n0. Back';
            newMenu = 'information';
            break;
          case 'feedback':
            response = 'Feedback:\n1. Submit Complaint\n2. Rate Service\n3. Suggestion Box\n0. Back';
            newMenu = 'feedback';
            break;
          case 'check_appointment':
            response = 'Enter your patient ID to check appointments:';
            break;
          case 'book_appointment':
            response = 'Enter patient ID, doctor specialty, and preferred date (format: ID-Specialty-YYYYMMDD):';
            break;
          case 'lab_results':
            response = 'Enter your patient ID to receive lab results via SMS:';
            break;
          case 'pay_bill':
            response = 'Enter patient ID to get payment instructions:';
            break;
          case 'ambulance_request':
            response = 'Emergency! Enter your location and phone number:';
            break;
          case 'visiting_hours':
            response = 'Visiting Hours:\nGeneral Ward: 4PM-6PM\nPrivate Wards: 10AM-8PM\nICU: 11AM-12PM, 4PM-5PM';
            break;
          case 'doctor_schedules':
            response = 'Doctor schedules available. Enter department (e.g., Medicine, Surgery, Pediatrics):';
            break;
          case 'submit_complaint':
            response = 'Enter your complaint (max 160 characters):';
            break;
          default:
            response = 'Service coming soon. Press 0 to go back.';
        }
      } else if (input === '0') {
        if (session.currentMenu === 'main') {
          response = 'Thank you for using SmartCare HMS. Goodbye!';
          state.responses.push({
            sessionId,
            type: 'end_session',
            message: response,
            timestamp: new Date().toISOString(),
          });
          session.active = false;
          return;
        } else {
          response = 'SmartCare HMS:\n1. Patient Services\n2. Emergency Services\n3. Information\n4. Feedback';
          newMenu = 'main';
        }
      } else {
        response = 'Invalid option. Please try again.\n\nSmartCare HMS:\n1. Patient Services\n2. Emergency Services\n3. Information\n4. Feedback';
      }

      state.responses.push({
        sessionId,
        type: 'ussd_response',
        message: response,
        timestamp: new Date().toISOString(),
      });

      // Update session
      session.responses.push({ input, response, timestamp: new Date().toISOString() });
      if (newMenu) {
        session.currentMenu = newMenu;
      }
    },
    searchUSSD: (state, action) => {
      state.searchTerm = action.payload;
    },
    sortUSSD: (state, action) => {
      state.sortBy = action.payload;
    },
    filterUSSD: (state, action) => {
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
  startSession,
  updateSession,
  endSession,
  processUSSDInput,
  searchUSSD,
  sortUSSD,
  filterUSSD,
  setLoading,
  setError,
} = ussdSlice.actions;

export default ussdSlice.reducer;