import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiRequest, consultationApi } from '../utils/api';
import {
  loadConsultation,
  selectConsultation,
  updateHPIField,
  updateROSField,
  addMedication,
  updateMedication,
  removeMedication,
  addAllergy,
  updateAllergy,
  removeAllergy,
  addICD10Code,
  removeICD10Code,
  updateICD10SearchTerm,
  addLabOrder,
  addRadiologyOrder,
  addProcedure,
  addReferral,
  updateTreatmentPlan,
  updateDisposition,
  updateFollowUp,
  signConsultation,
  addAuditLog,
  generateBillingCharge
} from '../features/consultationSlice';
import {
  Activity,
  CalendarDays,
  Clock3,
  FileText,
  HeartPulse,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserCircle2,
  Printer,
  FileDown,
  Search,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  User,
  Calendar,
  Hospital,
  MapPin,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Edit,
  Save,
  FileUser,
  IdCard
} from 'lucide-react';


const ORDER_TYPES = [
  { key: 'laboratory', label: 'Laboratory' },
  { key: 'radiology', label: 'Radiology' },
  { key: 'procedures', label: 'Procedure' },
  { key: 'referralOrders', label: 'Referral' }
];

const ConsultationV2 = () => {
  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL, BEFORE ANY CONDITIONAL RETURNS
  
  const consultation = useSelector(selectConsultation);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [expandedSections, setExpandedSections] = useState({
    hpi: true,
    ros: false,
    medications: false,
    allergies: false,
    icd10: false,
    orders: false,
    plan: false,
    disposition: false,
    followUp: false,
    billing: false,
    audit: false
  });
  const [icd10SearchLoading, setIcd10SearchLoading] = useState(false);
  const [icd10SearchError, setIcd10SearchError] = useState('');
  const [icd10Database, setIcd10Database] = useState([]);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    quantity: '',
    route: 'Oral',
    reason: ''
  });
  const [newAllergy, setNewAllergy] = useState({
    type: 'Drug',
    substance: '',
    severity: 'Moderate',
    reactionType: '',
    notes: ''
  });
  const [chargeItem, setChargeItem] = useState({ item: '', amount: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [availableVisits, setAvailableVisits] = useState([]);
  const [isLoadingVisits, setIsLoadingVisits] = useState(false);
  const [visitLoadError, setVisitLoadError] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [isSearchingPatients, setIsSearchingPatients] = useState(false);
  const [patientSearchError, setPatientSearchError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientVisits, setPatientVisits] = useState([]);
  const [isLoadingPatientVisits, setIsLoadingPatientVisits] = useState(false);
  const [patientVisitsError, setPatientVisitsError] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInError, setCheckInError] = useState('');
  const [medicationSafetyWarnings, setMedicationSafetyWarnings] = useState([]);

  const visitId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('visit') || location.state?.visitId || null;
  }, [location.search, location.state]);

  const parseList = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.results && Array.isArray(response.results)) return response.results;
    return [];
  };

  const searchPatients = async () => {
    const trimmedTerm = patientSearchTerm.trim();
    if (!trimmedTerm) {
      setPatientSearchError('Enter a patient name, MRN, phone, or email to search.');
      setPatientResults([]);
      return;
    }

    setPatientSearchError('');
    setIsSearchingPatients(true);
    setPatientResults([]);

    try {
      const response = await apiRequest(`/api/v1/patients/patients/?search=${encodeURIComponent(trimmedTerm)}&page_size=20`);
      const patients = parseList(response);
      setPatientResults(patients);
    } catch (error) {
      setPatientSearchError(error.message || 'Unable to search patients.');
    } finally {
      setIsSearchingPatients(false);
    }
  };

  // Effect for patient search debouncing
  useEffect(() => {
    if (!patientSearchTerm.trim()) {
      setPatientResults([]);
      setPatientSearchError('');
      return;
    }

    const handler = setTimeout(() => {
      searchPatients();
    }, 350);

    return () => clearTimeout(handler);
  }, [patientSearchTerm]);

  const loadPatientVisits = async (patientId) => {
    setPatientVisitsError('');
    setIsLoadingPatientVisits(true);
    setPatientVisits([]);

    try {
      const visits = await consultationApi.getPatientVisits(patientId);
      setPatientVisits(visits);
      if (!visits.length) {
        setPatientVisitsError('No visits found for this patient.');
      }
    } catch (error) {
      setPatientVisitsError(error.message || 'Unable to load patient visits.');
    } finally {
      setIsLoadingPatientVisits(false);
    }
  };

  const selectPatient = async (patient) => {
    setSelectedPatient(patient);
    setPatientVisits([]);
    setCheckInError('');
    await loadPatientVisits(patient.id);
  };

  const startNewVisit = async () => {
    if (!selectedPatient) return;
    setCheckInError('');
    setIsCheckingIn(true);

    try {
      const visit = await consultationApi.checkIn(selectedPatient.id, {
        visit_type: 'opd',
        chief_complaint: `New consultation for ${selectedPatient.full_name || selectedPatient.hospital_number || 'patient'}`,
        triage_category: 'green'
      });

      if (visit && visit.id) {
        navigate(`/consultation?visit=${visit.id}`);
      } else {
        throw new Error('Unable to start a new visit.');
      }
    } catch (error) {
      setCheckInError(error.message || 'Unable to start a new visit.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const clearSelectedPatient = () => {
    setSelectedPatient(null);
    setPatientVisits([]);
    setPatientSearchTerm('');
    setPatientResults([]);
    setPatientSearchError('');
    setPatientVisitsError('');
  };

  // Effect for loading recent visits - MOVED BEFORE CONDITIONAL RETURN
  useEffect(() => {
    if (visitId || availableVisits.length > 0) return;

    const loadRecentVisits = async () => {
      setIsLoadingVisits(true);
      setVisitLoadError('');
      try {
        const response = await consultationApi.getVisits({ status: 'triaged', page_size: 20 });
        const visits = parseList(response);
        setAvailableVisits(visits);
      } catch (error) {
        setVisitLoadError(error.message || 'Unable to load patient visits.');
      } finally {
        setIsLoadingVisits(false);
      }
    };

    loadRecentVisits();
  }, [visitId]);

  // Effect for loading consultation data - MOVED BEFORE CONDITIONAL RETURN
  useEffect(() => {
    if (!visitId) return;

    const loadVisit = async () => {
      setIsLoading(true);
      try {
        const [visit, noteResponse, prescriptionResponse] = await Promise.all([
          consultationApi.getVisit(visitId),
          consultationApi.getConsultationNotes({ visit: visitId }),
          consultationApi.getPrescriptions({ visit: visitId })
        ]);

        const notes = parseList(noteResponse);
        const prescriptions = parseList(prescriptionResponse);

        if (visit) {
          const currentPatient = {
            ...consultation.patient,
            patientId: visit.patient || consultation.patient.patientId,
            mrn: consultation.patient.mrn,
            name: visit.patient_name || consultation.patient.name,
            insurancePlan: consultation.patient.insurancePlan,
            primaryConsultant: visit.doctor_name || consultation.patient.primaryConsultant,
            gender: consultation.patient.gender,
            age: consultation.patient.age,
            latestVitals: visit.vital_signs ? Object.entries(visit.vital_signs).map(([key, value]) => `${key}: ${value}`).join(', ') : consultation.patient.latestVitals
          };

          const visitPayload = {
            ...consultation.encounter,
            encounterNumber: visit.visit_number || consultation.encounter.encounterNumber,
            date: visit.checkin_time ? new Date(visit.checkin_time).toLocaleDateString() : consultation.encounter.date,
            time: visit.checkin_time ? new Date(visit.checkin_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : consultation.encounter.time,
            doctorName: visit.doctor_name || consultation.encounter.doctorName,
            clinic: visit.department_name || consultation.encounter.clinic,
            department: visit.department_name || consultation.encounter.department,
            type: visit.visit_type || consultation.encounter.type,
            consultationStatus: visit.visit_status ? visit.visit_status.replace('_', ' ') : consultation.encounter.consultationStatus,
            location: visit.referral_from || consultation.encounter.location
          };

          const note = notes.length ? notes[0] : null;
          const notePayload = note ? {
            hpi: {
              ...consultation.hpi,
              freeNotes: note.subjective || consultation.hpi.freeNotes,
              chiefComplaint: note.subjective || consultation.hpi.chiefComplaint
            },
            assessment: {
              ...consultation.assessment,
              clinicalImpression: note.assessment || consultation.assessment.clinicalImpression,
              differentialDiagnosis: note.differential_diagnosis || consultation.assessment.differentialDiagnosis
            },
            treatmentPlan: {
              ...consultation.treatmentPlan,
              managementPlan: note.plan || consultation.treatmentPlan.managementPlan
            },
            icd10: {
              ...consultation.icd10,
              selectedCodes: Array.isArray(note.diagnosis_codes)
                ? note.diagnosis_codes.map(code => ({ code, description: '' }))
                : consultation.icd10.selectedCodes
            }
          } : {};

          const prescriptionsPayload = prescriptions.length ? {
            prescriptions: prescriptions.map((prescription) => ({
              id: prescription.id,
              medication: prescription.drug_name,
              dose: prescription.dosage,
              frequency: prescription.frequency,
              duration: prescription.duration ? String(prescription.duration) : '',
              quantity: prescription.quantity ? String(prescription.quantity) : '',
              route: prescription.route,
              instructions: prescription.instructions,
              status: prescription.status || 'active'
            }))
          } : {};

          dispatch(loadConsultation({
            patient: currentPatient,
            encounter: visitPayload,
            hpi: {
              ...consultation.hpi,
              freeNotes: visit.history_of_present_illness || consultation.hpi.freeNotes,
              chiefComplaint: visit.chief_complaint || consultation.hpi.chiefComplaint
            },
            ...notePayload,
            ...prescriptionsPayload
          }));

          if (visit.patient) {
            await refreshMedicationSafetyWarnings(visit.patient);
          }
        }
      } catch (error) {
        setApiError(error.message || 'Unable to load consultation details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadVisit();
  }, [visitId, dispatch]);

  const clinicalAlerts = useMemo(() => {
    const alerts = [];

    if (consultation.patient.allergies?.length > 0 && consultation.prescriptions?.length > 0) {
      const allergyTerms = consultation.patient.allergies.map(a => a.toLowerCase());
      consultation.prescriptions.forEach((prescription) => {
        const medName = prescription.medication.toLowerCase();
        allergyTerms.forEach((allergy) => {
          if (medName.includes(allergy) || prescription.medication.toLowerCase().includes(allergy)) {
            alerts.push({
              type: 'allergy',
              message: `Prescription ${prescription.medication} may trigger patient allergy to ${allergy}.`,
              severity: 'high'
            });
          }
        });
      });
    }

    consultation.medications.forEach((med) => {
      const info = med.name.toLowerCase();
      if (info.includes('prednisolone') && consultation.allergies.some(a => a.substance.toLowerCase().includes('penicillin'))) {
        alerts.push({
          type: 'interaction',
          message: `Review use of ${med.name} with patient allergy profile.`,
          severity: 'moderate'
        });
      }
    });

    if (consultation.encounter.consultationStatus === 'In Progress' && consultation.prescriptions.length === 0) {
      alerts.push({
        type: 'action',
        message: 'No active prescriptions present. Confirm treatment plan or consider medication reconciliation.',
        severity: 'info'
      });
    }

    return alerts;
  }, [consultation.patient.allergies, consultation.prescriptions, consultation.medications, consultation.encounter.consultationStatus]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleHPIChange = (field, value) => {
    dispatch(updateHPIField({ field, value }));
    dispatch(addAuditLog({ action: `Updated HPI field ${field}` }));
  };

  const handleROSChange = (section, field, value) => {
    dispatch(updateROSField({ section, field, value }));
    dispatch(addAuditLog({ action: `Updated ROS ${section} ${field}` }));
  };

  const refreshMedicationSafetyWarnings = async (patientId, incomingMedication = null) => {
    if (!patientId) return;

    try {
      const history = await consultationApi.getMedicationHistory(patientId);
      const existingDrugNames = (history?.medications || []).map(item => item.drug_name).filter(Boolean);
      const candidateDrugs = incomingMedication
        ? [...existingDrugNames, incomingMedication.name]
        : existingDrugNames;

      let interactionPayload = { patient_id: patientId, drug_names: candidateDrugs };
      if (candidateDrugs.length === 0) {
        setMedicationSafetyWarnings(history?.warnings || []);
        return;
      }

      const interactionResult = await consultationApi.checkInteractions(interactionPayload);
      const warnings = [
        ...(history?.warnings || []),
        ...(interactionResult?.interactions || []).map(item => ({
          type: 'drug_interaction',
          severity: item.severity || 'high',
          message: item.message,
          drugs: item.drugs || []
        }))
      ];

      setMedicationSafetyWarnings(warnings);
    } catch (error) {
      console.warn('Failed to load medication safety data:', error);
      setMedicationSafetyWarnings([]);
    }
  };

  const handleAddMedication = async () => {
    if (!newMedication.name || !newMedication.dosage) return;

    const medicationData = { ...newMedication, current: true, previous: false, stopped: false };
    dispatch(addMedication(medicationData));
    dispatch(addAuditLog({ action: `Added medication ${newMedication.name}` }));

    const patientId = consultation.patient.patientId || consultation.patient.id;
    if (patientId) {
      try {
        const interactionResult = await consultationApi.checkInteractions({
          patient_id: patientId,
          drug_names: [
            ...((consultation.medications || []).map(item => item.name).filter(Boolean)),
            newMedication.name
          ]
        });

        const interactionWarnings = (interactionResult?.interactions || []).map(item => ({
          type: 'drug_interaction',
          severity: item.severity || 'high',
          message: item.message,
          drugs: item.drugs || []
        }));

        setMedicationSafetyWarnings(prev => [...prev, ...interactionWarnings]);
      } catch (error) {
        setApiError(error.message || 'Failed to validate medication safety.');
      }
    }

    setNewMedication({ name: '', dosage: '', frequency: '', duration: '', quantity: '', route: 'Oral', reason: '' });
    if (visitId) {
      try {
        await consultationApi.createPrescription({
          visit: visitId,
          drug_name: newMedication.name,
          dosage: newMedication.dosage,
          frequency: newMedication.frequency,
          duration: newMedication.duration,
          quantity: newMedication.quantity,
          route: newMedication.route,
          instructions: newMedication.reason
        });
        if (patientId) {
          await refreshMedicationSafetyWarnings(patientId, medicationData);
        }
      } catch (error) {
        setApiError(error.message || 'Failed to save medication to server.');
      }
    }
  };

  const handleAddAllergy = async () => {
    if (!newAllergy.substance) return;
    dispatch(addAllergy(newAllergy));
    dispatch(addAuditLog({ action: `Added allergy ${newAllergy.substance}` }));
    setNewAllergy({ type: 'Drug', substance: '', severity: 'Moderate', reactionType: '', notes: '' });
    if (visitId) {
      try {
        await consultationApi.createPrescription({
          visit: visitId,
          allergy_data: {
            type: newAllergy.type,
            substance: newAllergy.substance,
            severity: newAllergy.severity,
            reaction_type: newAllergy.reactionType,
            notes: newAllergy.notes
          }
        });
      } catch (error) {
        setApiError(error.message || 'Failed to save allergy to server.');
      }
    }
  };

  const handleSearchICD10 = async (query) => {
    if (!query.trim()) {
      setIcd10Database([]);
      setIcd10SearchError('');
      return;
    }
    setIcd10SearchLoading(true);
    setIcd10SearchError('');
    try {
      const results = await consultationApi.searchICD10(query);
      setIcd10Database(results);
    } catch (error) {
      setIcd10SearchError(error.message || 'Unable to search ICD-10 codes.');
      setIcd10Database([]);
    } finally {
      setIcd10SearchLoading(false);
    }
  };

  const handleSaveHPI = async () => {
    if (!visitId) return;
    try {
      const response = await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        chief_complaint: consultation.hpi.chiefComplaint,
        subjective: consultation.hpi.freeNotes,
        hpi_data: consultation.hpi
      });
      dispatch(addAuditLog({ action: 'Saved HPI section' }));
      setApiMessage('HPI saved.');
      setTimeout(() => setApiMessage(''), 3000);
    } catch (error) {
      setApiError(error.message || 'Failed to save HPI.');
    }
  };

  const handleSaveROS = async () => {
    if (!visitId) return;
    try {
      const response = await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        ros_data: consultation.ros
      });
      dispatch(addAuditLog({ action: 'Saved ROS section' }));
      setApiMessage('ROS saved.');
      setTimeout(() => setApiMessage(''), 3000);
    } catch (error) {
      setApiError(error.message || 'Failed to save ROS.');
    }
  };

  const handleSaveICD10 = async () => {
    if (!visitId) return;
    try {
      const response = await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        diagnosis_codes: consultation.icd10.selectedCodes.map(c => c.code)
      });
      dispatch(addAuditLog({ action: 'Saved ICD-10 codes' }));
      setApiMessage('ICD-10 codes saved.');
      setTimeout(() => setApiMessage(''), 3000);
    } catch (error) {
      setApiError(error.message || 'Failed to save ICD-10 codes.');
    }
  };

  const handleSaveTreatmentPlan = async () => {
    if (!visitId) return;
    try {
      const response = await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        plan: `${consultation.treatmentPlan.managementPlan}\n${consultation.treatmentPlan.medications}\n${consultation.treatmentPlan.lifestyleAdvice}\n${consultation.treatmentPlan.dietaryAdvice}\n${consultation.treatmentPlan.monitoringPlan}\n${consultation.treatmentPlan.safetyNetAdvice}`
      });
      dispatch(addAuditLog({ action: 'Saved Treatment Plan section' }));
      setApiMessage('Treatment plan saved.');
      setTimeout(() => setApiMessage(''), 3000);
    } catch (error) {
      setApiError(error.message || 'Failed to save treatment plan.');
    }
  };

  const handleSaveOrders = async (orderType, orderData) => {
    if (!visitId) return;
    try {
      const payload = {
        ...orderData,
        visit: visitId,
        patient: consultation.patient.patientId
      };
      if (orderType === 'laboratory') {
        payload.test = orderData.test?.id || orderData.test?.code || orderData.test;
      }
      const createMap = {
        laboratory: consultationApi.createLabOrder,
        radiology: consultationApi.createRadiologyOrder,
        procedures: consultationApi.createProcedure,
        referralOrders: consultationApi.createReferral
      };
      await createMap[orderType](payload);
      dispatch(addAuditLog({ action: `Saved ${ORDER_TYPES.find(o => o.key === orderType)?.label} order` }));
      setApiMessage('Order saved.');
      setTimeout(() => setApiMessage(''), 3000);
    } catch (error) {
      setApiError(error.message || 'Failed to save order.');
    }
  };

  const handleSaveBilling = async () => {
    if (!visitId) return;
    try {
      const response = await consultationApi.createBillingItem({
        visit: visitId,
        items: consultation.billing.charges
      });
      dispatch(addAuditLog({ action: 'Saved Billing charges' }));
      setApiMessage('Billing charges saved.');
      setTimeout(() => setApiMessage(''), 3000);
    } catch (error) {
      setApiError(error.message || 'Failed to save billing.');
    }
  };

  const handleAddICD10 = (code) => {
    dispatch(addICD10Code(code));
    dispatch(addAuditLog({ action: `Added diagnosis code ${code.code}` }));
  };

  const handleAddOrder = (orderType) => {
    const orderTemplate = {
      laboratory: { test: 'New lab test', status: 'pending', priority: 'normal' },
      radiology: { study: 'New radiology study', status: 'pending', priority: 'normal' },
      procedures: { procedure: 'New procedure', status: 'pending', priority: 'normal' },
      referralOrders: { referral: 'Specialist referral', status: 'pending', priority: 'routine' }
    };

    const actionMap = {
      laboratory: addLabOrder,
      radiology: addRadiologyOrder,
      procedures: addProcedure,
      referralOrders: addReferral
    };

    dispatch(actionMap[orderType](orderTemplate[orderType]));
    dispatch(addAuditLog({ action: `Created ${ORDER_TYPES.find(order => order.key === orderType).label} order` }));
  };

  const handleSignOff = async () => {
    const userFullName = localStorage.getItem('userFullName') || localStorage.getItem('userName');
    const tenantId = localStorage.getItem('tenantId');
    dispatch(signConsultation({ 
      doctorName: userFullName || consultation.signature.doctorName,
      licenseNumber: tenantId || consultation.signature.licenseNumber,
      digitalSignature: 'signed-by-app', 
      ipAddress: window.location.hostname 
    }));
    dispatch(addAuditLog({ action: 'Signed consultation' }));
    dispatch(generateBillingCharge({ item: 'Consultation fee', amount: 5000 }));
    await handleSaveConsultation({ markFinal: true });
  };

  const handleBillingCharge = () => {
    if (!chargeItem.item || !chargeItem.amount) return;
    dispatch(generateBillingCharge({ item: chargeItem.item, amount: Number(chargeItem.amount) }));
    setChargeItem({ item: '', amount: '' });
  };

  const handleSaveConsultation = async ({ markFinal = false } = {}) => {
    setApiError('');
    setApiMessage('');
    setIsSaving(true);

    try {
      const payload = {
        next_status: markFinal ? 'billing' : 'awaiting_lab',
        chief_complaint: consultation.hpi.chiefComplaint,
        history_of_present_illness: consultation.hpi.freeNotes,
        referral_from: consultation.disposition.referral,
        referral_reason: consultation.disposition.reason,
        subjective: `${consultation.hpi.freeNotes}\n\nROS: ${Object.entries(consultation.ros).map(([section, values]) => `${section}: ${values.status}, ${values.comments}`).join('; ')}`,
        objective: `${consultation.physicalExam.generalAppearance}\n${consultation.physicalExam.vitalSigns}\n${consultation.physicalExam.cardiovascular}\n${consultation.physicalExam.respiratory}\n${consultation.physicalExam.abdominal}\n${consultation.physicalExam.neurological}\n${consultation.physicalExam.musculoskeletal}\n${consultation.physicalExam.ent}\n${consultation.physicalExam.eye}\n${consultation.physicalExam.skin}\n${consultation.physicalExam.mentalState}`,
        assessment: `${consultation.assessment.clinicalImpression}\nPrimary: ${consultation.assessment.primaryDiagnosis}\nSecondary: ${consultation.assessment.secondaryDiagnosis}\nDifferential: ${consultation.assessment.differentialDiagnosis}`,
        plan: `${consultation.treatmentPlan.managementPlan}\nMedications: ${consultation.treatmentPlan.medications}\nLifestyle: ${consultation.treatmentPlan.lifestyleAdvice}\nDietary: ${consultation.treatmentPlan.dietaryAdvice}\nMonitoring: ${consultation.treatmentPlan.monitoringPlan}\nSafety net: ${consultation.treatmentPlan.safetyNetAdvice}`,
        differential_diagnosis: consultation.assessment.differentialDiagnosis,
        diagnosis_codes: consultation.icd10.selectedCodes.map(code => code.code),
        is_final: markFinal,
        prescriptions: consultation.prescriptions.map(p => ({
          medication: p.medication,
          drug_name: p.medication,
          dosage: p.dose,
          frequency: p.frequency,
          duration: p.duration,
          quantity: p.quantity,
          route: p.route,
          instructions: p.instructions,
          status: p.status || 'prescribed'
        })),
        lab_orders: consultation.orders.laboratory.map(order => ({
          test_name: order.test || order.test_name,
          clinical_notes: order.clinical_notes || '',
          priority: order.priority || 'routine',
          status: order.status || 'ordered'
        })),
        radiology_orders: consultation.orders.radiology.map(order => ({
          study: order.study,
          priority: order.priority || 'routine',
          status: order.status || 'ordered',
          notes: order.notes || ''
        })),
        procedure_orders: consultation.orders.procedures.map(order => ({
          procedure: order.procedure,
          priority: order.priority || 'routine',
          status: order.status || 'ordered',
          notes: order.notes || ''
        })),
        referral_orders: consultation.orders.referralOrders.map(order => ({
          referral: order.referral,
          priority: order.priority || 'routine',
          status: order.status || 'ordered',
          notes: order.notes || ''
        })),
        billing_items: consultation.billing.charges.map(charge => ({
          item: charge.item,
          amount: charge.amount
        })),
        insurance_covered: consultation.billing.insuranceCovered || false,
        insurance_amount: consultation.billing.insuranceAmount || 0
      };

      if (!visitId) {
        throw new Error('No visit selected for consultation save.');
      }

      await consultationApi.endConsultation(visitId, payload);

      setApiMessage('Consultation saved successfully.');
    } catch (error) {
      setApiError(error.message || 'Unable to save consultation.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMedication = (id) => {
    dispatch(removeMedication(id));
    dispatch(addAuditLog({ action: `Removed medication ${id}` }));
  };

  const handleRemoveAllergy = (id) => {
    dispatch(removeAllergy(id));
    dispatch(addAuditLog({ action: `Removed allergy ${id}` }));
  };

  const icd10Results = useMemo(() => {
    const search = consultation.icd10.searchTerm.trim().toLowerCase();
    if (!search) return icd10Database;
    return icd10Database.filter(item => item.code.toLowerCase().includes(search) || item.description.toLowerCase().includes(search));
  }, [consultation.icd10.searchTerm, icd10Database]);

  useEffect(() => {
    handleSearchICD10(consultation.icd10.searchTerm);
  }, [consultation.icd10.searchTerm]);

  // NOW WE CAN HAVE THE CONDITIONAL RETURN AFTER ALL HOOKS
  if (!visitId) {
    return (
      <div className="p-6 space-y-6">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          <p className="font-semibold">No visit selected.</p>
          <p>Please search for a patient, select one of their visits, or choose a recent visit below to start consultation.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Search patient</h2>
                <p className="mt-2 text-sm text-slate-600">Find the patient and open a visit from their history.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label htmlFor="patient-search" className="sr-only">Patient search</label>
                <input
                  id="patient-search"
                  type="text"
                  value={patientSearchTerm}
                  onChange={(e) => {
                    setPatientSearchTerm(e.target.value);
                    if (selectedPatient) {
                      clearSelectedPatient();
                    }
                  }}
                  placeholder="Name, MRN, phone, or email"
                  className="min-w-0 flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
                <button
                  type="button"
                  onClick={searchPatients}
                  className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Search
                </button>
              </div>

              <p className="text-sm text-slate-500">Search by patient name, hospital number, phone, email, or national ID.</p>

              {patientSearchError && (
                <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
                  {patientSearchError}
                </div>
              )}

              {isSearchingPatients ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Searching patients...</div>
              ) : patientResults.length > 0 ? (
                <div className="space-y-3">
                  {patientResults.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => selectPatient(patient)}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-slate-100"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || `Patient ${patient.id}`}</p>
                          <p className="text-sm text-slate-600">{patient.hospital_number || patient.nin || patient.phone || patient.email || 'No additional patient info'}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">Select</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Search for a patient to view their visit history.</div>
              )}

              {selectedPatient && (
                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Selected patient</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{selectedPatient.full_name || `${selectedPatient.first_name || ''} ${selectedPatient.last_name || ''}`.trim()}</p>
                      <p className="mt-1 text-sm text-slate-600">MRN: {selectedPatient.hospital_number || 'N/A'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={clearSelectedPatient}
                      className="rounded-3xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{selectedPatient ? 'Patient visits' : 'Recent patient visits'}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  {selectedPatient
                    ? `Choose a visit for ${selectedPatient.full_name || 'the selected patient'}`
                    : 'Select a visit from recent check-ins to start consultation.'}
                </p>
              </div>
            </div>

            {selectedPatient ? (
              isLoadingPatientVisits ? (
                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Loading patient visits...</div>
              ) : patientVisits.length > 0 ? (
                <div className="mt-6 grid gap-3">
                  {patientVisits.map((visit) => (
                    <button
                      key={visit.id}
                      type="button"
                      onClick={() => navigate(`/consultation?visit=${visit.id}`)}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left hover:bg-slate-100"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{visit.visit_number || `Visit ${visit.id}`}</p>
                          <p className="text-sm text-slate-600">{visit.department_name || visit.visit_type || 'Visit record'}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">{visit.visit_status || 'Status unknown'}</span>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        {visit.checkin_time ? new Date(visit.checkin_time).toLocaleString() : 'No check-in time'}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <div>{patientVisitsError || 'No visits are available for the selected patient.'}</div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={startNewVisit}
                      disabled={isCheckingIn}
                      className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCheckingIn ? 'Starting visit…' : 'Start new visit'}
                    </button>
                    <p className="text-sm text-slate-600">No prior visits found for this patient. Create a new visit to begin consultation.</p>
                  </div>
                  {checkInError && (
                    <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
                      {checkInError}
                    </div>
                  )}
                </div>
              )
            ) : visitLoadError ? (
              <div className="mt-6 rounded-3xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">{visitLoadError}</div>
            ) : isLoadingVisits ? (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Loading recent visits...</div>
            ) : availableVisits.length > 0 ? (
              <div className="mt-6 grid gap-3">
                {availableVisits.map((visit) => (
                  <button
                    key={visit.id}
                    type="button"
                    onClick={() => navigate(`/consultation?visit=${visit.id}`)}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left hover:bg-slate-100"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{visit.visit_number || `Visit ${visit.id}`}</p>
                        <p className="text-sm text-slate-600">{visit.patient_name || 'Unknown patient'}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">{visit.visit_status || 'Unknown'}</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      {visit.department_name ? `${visit.department_name} · ` : ''}{visit.checkin_time ? new Date(visit.checkin_time).toLocaleString() : 'No check-in time'}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                No recent visits were found. Start consultation from a patient visit record elsewhere in the application.
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  // Main consultation UI when visitId exists
  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Consultation Module</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">Electronic Medical Record Consultation</h1>
              <p className="mt-2 text-sm text-slate-600">Structured workflow with HPI, ROS, medications, orders, diagnostics, billing, and audit support.</p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">Encounter #{consultation.encounter.encounterNumber}</div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => {
                  const printWindow = window.open('', '_blank');
                  const patientData = `
                    <html>
                      <head><title>Patient Summary - ${consultation.patient.name}</title>
                      <style>
                        body { font-family: Inter, sans-serif; padding: 20px; }
                        .header { border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
                        .section { margin-bottom: 15px; }
                        .label { font-weight: 600; color: #475569; }
                        .value { color: #0f172a; }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <h1>Patient Summary</h1>
                        <p>Generated: ${new Date().toLocaleString()}</p>
                      </div>
                      <div class="section"><span class="label">Name:</span> <span class="value">${consultation.patient.name}</span></div>
                      <div class="section"><span class="label">MRN:</span> <span class="value">${consultation.patient.mrn}</span></div>
                      <div class="section"><span class="label">Gender/Age:</span> <span class="value">${consultation.patient.gender} / ${consultation.patient.age}</span></div>
                      <div class="section"><span class="label">Insurance:</span> <span class="value">${consultation.patient.insurancePlan}</span></div>
                      <div class="section"><span class="label">Consultant:</span> <span class="value">${consultation.patient.primaryConsultant}</span></div>
                      <div class="section"><span class="label">Latest Vitals:</span> <span class="value">${consultation.patient.latestVitals}</span></div>
                      <div class="section"><span class="label">Risk Flags:</span> <span class="value">${consultation.patient.riskFlags.join(', ')}</span></div>
                    </body>
                    </html>`;
                  printWindow.document.write(patientData);
                  printWindow.document.close();
                  printWindow.print();
                }} className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  <FileUser className="h-4 w-4" /> Print Patient Summary
                </button>
                <button onClick={handleSignOff} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                  <CheckCircle className="h-4 w-4" /> Sign & Close
                </button>
                <button onClick={handleSaveConsultation} disabled={isSaving} className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                  <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Consult'}
                </button>
              </div>
              {apiMessage && <div className="mt-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{apiMessage}</div>}
              {apiError && <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{apiError}</div>}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Patient</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">{consultation.patient.name}</h2>
              <p className="mt-1 text-sm text-slate-600">MRN: {consultation.patient.mrn} • {consultation.patient.gender} • {consultation.patient.age}</p>
              <p className="mt-1 text-sm text-slate-600">Insurance: {consultation.patient.insurancePlan}</p>
              <p className="mt-1 text-sm text-slate-600">Primary Consultant: {consultation.patient.primaryConsultant}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Encounter Details</p>
              <div className="mt-2 space-y-2 text-sm text-slate-600">
                <p><strong>Clinic:</strong> {consultation.encounter.clinic}</p>
                <p><strong>Department:</strong> {consultation.encounter.department}</p>
                <p><strong>Type:</strong> {consultation.encounter.type}</p>
                <p><strong>Status:</strong> {consultation.encounter.consultationStatus}</p>
                <p><strong>Location:</strong> {consultation.encounter.location}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Latest Vitals</p>
              <p className="mt-2 text-slate-900">{consultation.patient.latestVitals}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Risk Flags</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-700">
                {consultation.patient.riskFlags.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-800">
              <ShieldCheck className="h-5 w-5 text-slate-500" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Clinical Alerts</p>
                <p className="mt-1 text-sm text-slate-700">Review active safety and diagnostic alerts.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {clinicalAlerts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">No active clinical alerts.</div>
              ) : clinicalAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <AlertCircle className="mt-1 h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-semibold text-slate-900">{alert.severity === 'high' ? 'High-risk' : alert.severity === 'moderate' ? 'Moderate risk' : 'Info'}</p>
                    <p className="text-sm text-slate-700">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-slate-800">
                <Activity className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Audit Trail</p>
                  <p className="mt-1 text-sm text-slate-700">Recent consultation activity.</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {consultation.auditTrail.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">No audit events recorded yet.</p>
              ) : consultation.auditTrail.slice(0, 5).map((event) => (
                <div key={event.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{event.action}</p>
                  <p className="text-xs text-slate-600">{new Date(event.timestamp).toLocaleString()} • {event.user || consultation.signature.doctorName}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">History of Present Illness</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Structured HPI</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSaveHPI} className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">Save HPI</button>
            <button onClick={() => toggleSection('hpi')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              {expandedSections.hpi ? 'Collapse' : 'Expand'} {expandedSections.hpi ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {expandedSections.hpi && (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {['chiefComplaint', 'duration', 'onset', 'location', 'severity', 'character', 'radiation', 'associatedSymptoms', 'aggravatingFactors', 'relievingFactors', 'previousTreatment', 'progression'].map((field) => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                <input
                  value={consultation.hpi[field]}
                  onChange={(e) => handleHPIChange(field, e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>
            ))}
            <div className="lg:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-slate-700">Free text notes</label>
              <textarea
                value={consultation.hpi.freeNotes}
                onChange={(e) => handleHPIChange('freeNotes', e.target.value)}
                className="min-h-[120px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
            </div>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Review of Systems</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Organ System Screening</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSaveROS} className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">Save ROS</button>
            <button onClick={() => toggleSection('ros')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              {expandedSections.ros ? 'Collapse' : 'Expand'} {expandedSections.ros ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {expandedSections.ros && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(consultation.ros).map(([section, values]) => (
              <div key={section} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{section.charAt(0).toUpperCase() + section.slice(1)}</p>
                <select
                  value={values.status}
                  onChange={(e) => handleROSChange(section, 'status', e.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="unknown">Unknown</option>
                </select>
                <textarea
                  value={values.comments}
                  onChange={(e) => handleROSChange(section, 'comments', e.target.value)}
                  placeholder="Comments"
                  className="mt-3 min-h-[90px] w-full rounded-3xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Medication Reconciliation</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Current Medications</h2>
            </div>
            <button onClick={() => toggleSection('medications')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              {expandedSections.medications ? 'Collapse' : 'Expand'} {expandedSections.medications ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
          {expandedSections.medications && (
            <div className="mt-6 space-y-4">
              <div className="grid gap-3 lg:grid-cols-2">
                <input value={newMedication.name} onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="Medication name" />
                <input value={newMedication.dosage} onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="Dosage" />
                <input value={newMedication.frequency} onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="Frequency" />
                <input value={newMedication.duration} onChange={(e) => setNewMedication(prev => ({ ...prev, duration: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="Duration" />
                <input value={newMedication.quantity} onChange={(e) => setNewMedication(prev => ({ ...prev, quantity: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="Quantity" />
                <input value={newMedication.reason} onChange={(e) => setNewMedication(prev => ({ ...prev, reason: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="Reason" />
              </div>
              <div className="flex flex-wrap gap-3">
                <select value={newMedication.route} onChange={(e) => setNewMedication(prev => ({ ...prev, route: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                  <option>Oral</option>
                  <option>IV</option>
                  <option>IM</option>
                  <option>Topical</option>
                </select>
                <button onClick={handleAddMedication} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">Add Medication</button>
              </div>
              {medicationSafetyWarnings.length > 0 && (
                <div className="mb-4 rounded-3xl border border-amber-200 bg-amber-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800">
                    <AlertTriangle className="h-4 w-4" /> Medication safety review
                  </div>
                  <ul className="space-y-2 text-sm text-amber-800">
                    {medicationSafetyWarnings.map((warning, index) => (
                      <li key={`${warning.type}-${warning.drug_name || index}`} className="rounded-2xl border border-amber-200 bg-white/60 p-3">
                        {warning.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                {consultation.medications.length === 0 ? (
                  <p className="text-sm text-slate-600">No current medications documented.</p>
                ) : (
                  <div className="space-y-3">
                    {consultation.medications.map((med) => (
                      <div key={med.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{med.name}</p>
                            <p className="text-sm text-slate-600">{med.dosage} • {med.frequency} • {med.route}</p>
                          </div>
                          <button onClick={() => handleRemoveMedication(med.id)} className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Remove</button>
                        </div>
                        <p className="mt-2 text-sm text-slate-700">Instructions: {med.reason || 'N/A'}</p>
                        <p className="mt-1 text-sm text-slate-500">Duration: {med.duration || 'Not specified'} • Qty: {med.quantity || 'Not set'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Allergies</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Allergy Management</h2>
            </div>
            <button onClick={() => toggleSection('allergies')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              {expandedSections.allergies ? 'Collapse' : 'Expand'} {expandedSections.allergies ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
          {expandedSections.allergies && (
            <div className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <input value={newAllergy.substance} onChange={(e) => setNewAllergy(prev => ({ ...prev, substance: e.target.value }))} placeholder="Allergen" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                <select value={newAllergy.severity} onChange={(e) => setNewAllergy(prev => ({ ...prev, severity: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                  <option>Severe</option>
                  <option>Moderate</option>
                  <option>Mild</option>
                </select>
                <input value={newAllergy.reactionType} onChange={(e) => setNewAllergy(prev => ({ ...prev, reactionType: e.target.value }))} placeholder="Reaction type" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
              </div>
              <textarea value={newAllergy.notes} onChange={(e) => setNewAllergy(prev => ({ ...prev, notes: e.target.value }))} placeholder="Notes" className="min-h-[100px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              <button onClick={handleAddAllergy} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">Add Allergy</button>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                {consultation.allergies.length === 0 ? (
                  <p className="text-sm text-slate-600">No allergies on record.</p>
                ) : (
                  <ul className="space-y-3">
                    {consultation.allergies.map((allergy) => (
                      <li key={allergy.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{allergy.substance}</p>
                            <p className="text-sm text-slate-600">{allergy.type} allergy • {allergy.severity}</p>
                          </div>
                          <button onClick={() => handleRemoveAllergy(allergy.id)} className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Remove</button>
                        </div>
                        <p className="mt-2 text-sm text-slate-700">{allergy.notes || 'No notes'}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Diagnosis & Coding</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">ICD-10 Selection</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSaveICD10} className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">Save ICD-10</button>
            <button onClick={() => toggleSection('icd10')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              {expandedSections.icd10 ? 'Collapse' : 'Expand'} {expandedSections.icd10 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {expandedSections.icd10 && (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.7fr]">
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <label className="block text-sm font-medium text-slate-700">Search ICD-10</label>
                <div className="mt-2 flex gap-2">
                  <input
                    value={consultation.icd10.searchTerm}
                    onChange={(e) => dispatch(updateICD10SearchTerm(e.target.value))}
                    placeholder="Search by code or description"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                  />
                  <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700" type="button">
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                {icd10Results.map((item) => (
                  <div key={item.code} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.code}</p>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                    <button onClick={() => handleAddICD10(item)} className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">Add</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Selected codes</h3>
              <div className="mt-3 space-y-3">
                {consultation.icd10.selectedCodes.map((code) => (
                  <div key={code.code} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                    <div>
                      <p className="font-semibold text-slate-900">{code.code}</p>
                      <p className="text-sm text-slate-600">{code.description}</p>
                    </div>
                    <button onClick={() => dispatch(removeICD10Code(code.code))} className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Orders</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Diagnostics & Referrals</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleSaveOrders('laboratory', consultation.orders.laboratory[0])} disabled={!visitId} className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50">Save Orders</button>
            <button onClick={() => toggleSection('orders')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              {expandedSections.orders ? 'Collapse' : 'Expand'} {expandedSections.orders ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {expandedSections.orders && (
          <div className="mt-6 space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ORDER_TYPES.map((order) => (
                <button
                  key={order.key}
                  onClick={() => handleAddOrder(order.key)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-900 hover:bg-slate-100"
                >
                  {order.label}
                </button>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">Lab Orders</h3>
                {consultation.orders.laboratory.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-600">No lab orders added.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {consultation.orders.laboratory.map(order => (
                      <li key={order.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700">{order.test} • {order.priority}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">Radiology & Referrals</h3>
                {consultation.orders.radiology.length === 0 && consultation.orders.referralOrders.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-600">No radiology or referral orders.</p>
                ) : (
                  <div className="space-y-3">
                    {consultation.orders.radiology.map(order => (
                      <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700">{order.study} • {order.priority}</div>
                    ))}
                    {consultation.orders.referralOrders.map(order => (
                      <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700">{order.referral} • {order.priority}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Treatment Plan</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Care Plan</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSaveTreatmentPlan} className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">Save Plan</button>
              <button onClick={() => toggleSection('plan')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                {expandedSections.plan ? 'Collapse' : 'Expand'} {expandedSections.plan ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {expandedSections.plan && (
            <div className="mt-6 grid gap-4">
              {['managementPlan', 'medications', 'lifestyleAdvice', 'dietaryAdvice', 'patientEducation', 'monitoringPlan', 'safetyNetAdvice'].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                  <textarea
                    value={consultation.treatmentPlan[field]}
                    onChange={(e) => dispatch(updateTreatmentPlan({ field, value: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Disposition</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Plan & Follow-up</h2>
            </div>
            <button onClick={() => toggleSection('disposition')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              {expandedSections.disposition ? 'Collapse' : 'Expand'} {expandedSections.disposition ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
          {expandedSections.disposition && (
            <div className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={consultation.disposition.type} onChange={(e) => dispatch(updateDisposition({ field: 'type', value: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                  <option>Outpatient</option>
                  <option>Inpatient</option>
                  <option>Observation</option>
                  <option>Referral</option>
                </select>
                <select value={consultation.disposition.admission} onChange={(e) => dispatch(updateDisposition({ field: 'admission', value: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <textarea value={consultation.disposition.reason} onChange={(e) => dispatch(updateDisposition({ field: 'reason', value: e.target.value }))} placeholder="Disposition reason" className="min-h-[100px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Follow-up date</label>
                  <input value={consultation.followUp.date} onChange={(e) => dispatch(updateFollowUp({ field: 'date', value: e.target.value }))} type="date" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Follow-up time</label>
                  <input value={consultation.followUp.time} onChange={(e) => dispatch(updateFollowUp({ field: 'time', value: e.target.value }))} type="time" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
                </div>
              </div>
              <textarea value={consultation.followUp.reason} onChange={(e) => dispatch(updateFollowUp({ field: 'reason', value: e.target.value }))} placeholder="Follow-up indication" className="min-h-[100px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Billing</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Charges</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSaveBilling} disabled={!visitId} className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50">Save Billing</button>
              <button onClick={() => toggleSection('billing')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                {expandedSections.billing ? 'Collapse' : 'Expand'} {expandedSections.billing ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {expandedSections.billing && (
            <div className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={chargeItem.item} onChange={(e) => setChargeItem(prev => ({ ...prev, item: e.target.value }))} placeholder="Charge item" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                <input value={chargeItem.amount} onChange={(e) => setChargeItem(prev => ({ ...prev, amount: e.target.value }))} placeholder="Amount" type="number" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
              </div>
              <button onClick={handleBillingCharge} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">Add Charge</button>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                {consultation.billing.charges.length === 0 ? (
                  <p className="text-sm text-slate-600">No billing items recorded.</p>
                ) : (
                  <div className="space-y-3">
                    {consultation.billing.charges.map((charge) => (
                      <div key={charge.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                        <span>{charge.item}</span>
                        <strong>₦{charge.amount}</strong>
                      </div>
                    ))}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-300 pt-3 text-sm font-semibold text-slate-900">
                      <span>Total</span>
                      <span>₦{consultation.billing.total}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Sign-off</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Electronic Signature</h2>
            </div>
            <button onClick={handleSignOff} disabled={isSaving || !visitId} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">Sign Now</button>
          </div>
          <div className="mt-6 space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">Doctor: <span className="font-semibold text-slate-900">{localStorage.getItem('userFullName') || localStorage.getItem('userName') || consultation.signature.doctorName}</span></p>
            <p className="text-sm text-slate-700">License: <span className="font-semibold text-slate-900">{localStorage.getItem('licenseNumber') || consultation.signature.licenseNumber}</span></p>
            <p className="text-sm text-slate-700">Signed: <span className="font-semibold text-slate-900">{consultation.signature.signed ? 'Yes' : 'No'}</span></p>
            {consultation.signature.signed && <p className="text-sm text-slate-600">Signed at {new Date(consultation.signature.signedAt).toLocaleString()}</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ConsultationV2;