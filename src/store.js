import { configureStore } from '@reduxjs/toolkit';
import tenantReducer from './features/tenantSlice';
import patientReducer from './features/patientSlice';
import billingReducer from './features/billingSlice';
import pharmacyReducer from './features/pharmacySlice';
import staffReducer from './features/staffSlice.jsx';
import wardReducer from './features/wardSlice';
import admissionReducer from './features/admissionSlice';
import wardRoundReducer from './features/wardRoundSlice';
import rosterReducer from './features/rosterSlice';
import performanceReducer from './features/performanceSlice';
import payrollReducer from './features/payrollSlice';
import equipmentReducer from './features/equipmentSlice';
import maintenanceReducer from './features/maintenanceSlice';
import generatorReducer from './features/generatorSlice';
import oxygenReducer from './features/oxygenSlice';
import theaterReducer from './features/theaterSlice';
import pharmacyInventoryReducer from './features/pharmacyInventorySlice';
import medicalSuppliesReducer from './features/medicalSuppliesSlice';
import centralStoreReducer from './features/centralStoreSlice';
import procurementReducer from './features/procurementSlice';
import ambulanceReducer from './features/ambulanceSlice';
import fleetReducer from './features/fleetSlice';
import emergencyResponseReducer from './features/emergencyResponseSlice';
import referralReducer from './features/referralSlice';
import vitalSignsReducer from './features/vitalSignsSlice';
import emrReducer from './features/emrSlice';
import ussdReducer from './features/ussdSlice';
import cdsReducer from './features/cdsSlice';
import orderEntryReducer from './features/orderEntrySlice';
import edReducer from './features/edSlice';
import nhisReducer from './features/nhisSlice';
import patientPortalReducer from './features/patientPortalSlice';
import mobileMoneyReducer from './features/mobileMoneySlice';
import communicationReducer from './features/communicationSlice';
import ncdcReducer from './features/ncdcSlice';
import integrationsReducer from './features/integrationsSlice';
import financialReducer from './features/financialSlice';
import auditReducer from './features/auditSlice';
import feedbackReducer from './features/feedbackSlice';
import creditReducer from './features/creditSlice';
import ndprReducer from './features/ndprSlice';
import budgetReducer from './features/budgetSlice';
import loadingReducer from './features/loadingSlice';
import clinicalReducer from './features/clinicalSlice';
import consultationReducer from './features/consultationSlice';
// import ambulanceReducer from './features/ambulanceSlice';
// import fleetReducer from './features/fleetSlice';
// import emergencyResponseReducer from './features/emergencyResponseSlice';
// import referralReducer from './features/referralSlice';

export default configureStore({
  reducer: {
    tenant: tenantReducer,
    patient: patientReducer,
    billing: billingReducer,
    pharmacy: pharmacyReducer,
    staff: staffReducer,
    ward: wardReducer,
    admission: admissionReducer,
    wardRound: wardRoundReducer,
    roster: rosterReducer,
    performance: performanceReducer,
    payroll: payrollReducer,
    equipment: equipmentReducer,
    maintenance: maintenanceReducer,
    generator: generatorReducer,
    oxygen: oxygenReducer,
    theater: theaterReducer,
    pharmacyInventory: pharmacyInventoryReducer,
    medicalSupplies: medicalSuppliesReducer,
    centralStore: centralStoreReducer,
    procurement: procurementReducer,
    ambulance: ambulanceReducer,
    fleet: fleetReducer,
    emergencyResponse: emergencyResponseReducer,
    referral: referralReducer,
    vitalSigns: vitalSignsReducer,
    emr: emrReducer,
    ussd: ussdReducer,
    cds: cdsReducer,
    orderEntry: orderEntryReducer,
    ed: edReducer,
    nhis: nhisReducer,
    patientPortal: patientPortalReducer,
    mobileMoney: mobileMoneyReducer,
    communication: communicationReducer,
    ncdc: ncdcReducer,
    integrations: integrationsReducer,
    financial: financialReducer,
    audit: auditReducer,
    feedback: feedbackReducer,
    credit: creditReducer,
    ndpr: ndprReducer,
    budget: budgetReducer,
    loading: loadingReducer,
    ambulance: ambulanceReducer,
    fleet: fleetReducer,
    emergencyResponse: emergencyResponseReducer,
    referral: referralReducer,
    pharmacyInventory: pharmacyInventoryReducer,
    medicalSupplies: medicalSuppliesReducer,
    centralStore: centralStoreReducer,
    procurement: procurementReducer,
    clinical: clinicalReducer,
    consultation: consultationReducer,
  },
});