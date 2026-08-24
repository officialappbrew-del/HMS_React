import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiRequest, consultationApi } from '../utils/api';
import {
  loadConsultation,
  selectConsultation,
  updateHPIField,
  updateICEField,
  updateROSField,
  updatePastMedicalHistory,
  updateFamilyHistory,
  addFamilySibling,
  updateFamilySibling,
  removeFamilySibling,
  addRelevantCondition,
  removeRelevantCondition,
  updateSocialHistory,
  updateSocialHistorySubsection,
  addMedication,
  removeMedication,
  addAllergy,
  removeAllergy,
  addICD10Code,
  removeICD10Code,
  updateICD10SearchTerm,
  addLabOrder,
  addRadiologyOrder,
  addProcedure,
  addReferral,
  updateAssessment,
  updateTreatmentPlan,
  updateDisposition,
  updateFollowUp,
  signConsultation,
  addAuditLog,
  generateBillingCharge,
  updatePhysicalExam,
  updateCompletionStatus,
  selectRedFlags,
  resetConsultation
} from '../features/consultationSlice';

// Lucide React Icons
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FileText,
  FileUser,
  Heart,
  HeartPulse,
  Home,
  IdCard,
  Info,
  Phone,
  Pill,
  Plus,
  Save,
  Scissors,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  User,
  Users,
  X,
  Clock,
  Calendar,
  Briefcase,
  UserCircle,
  UserPlus,
  Edit3,
  AlertOctagon,
  Eye,
  File,
  Settings,
  HelpCircle,
  BookOpen,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Stethoscope,
  Loader2
} from 'lucide-react';

// ==================== SUB-COMPONENTS ====================

const SectionHeader = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  expanded, 
  onToggle, 
  onSave, 
  isSaving,
  saveLabel = 'Save',
  showSave = true
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div className="flex items-center gap-3 min-w-0">
      {Icon && (
        <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500">{subtitle}</p>
        <h2 className="text-sm sm:text-base font-semibold text-slate-900 truncate">{title}</h2>
      </div>
    </div>
    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
      {showSave && onSave && (
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1 rounded-lg bg-slate-900 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-70"
        >
          {isSaving ? (
            <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
          ) : (
            <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          )}
          <span className="hidden xs:inline">{isSaving ? 'Saving...' : saveLabel}</span>
        </button>
      )}
      <button
        onClick={onToggle}
        className="flex items-center gap-1 rounded-lg p-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        aria-label={expanded ? 'Collapse section' : 'Expand section'}
      >
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

const FormInput = ({ label, value, onChange, placeholder, type = 'text', required, className = '' }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="block text-xs font-medium text-slate-700">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
    />
  </div>
);

const FormTextarea = ({ label, value, onChange, placeholder, rows = 3, required, className = '' }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="block text-xs font-medium text-slate-700">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
    />
  </div>
);

const FormSelect = ({ label, value, onChange, options, required, className = '' }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="block text-xs font-medium text-slate-700">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// ==================== PATIENT DETAILS MODAL ====================

const PatientMedicalDetails = ({ patient, onClose }) => {
  if (!patient) return null;

  const hasAllergies = patient.known_allergies && patient.known_allergies !== 'None';
  const hasChronic = patient.chronic_conditions && patient.chronic_conditions !== 'None';
  const hasMedications = patient.current_medications && patient.current_medications !== 'None';
  const hasSurgery = patient.surgical_history && patient.surgical_history !== 'None';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-900">
              <User className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-900">
                {patient.full_name || `${patient.first_name} ${patient.last_name}`}
              </h2>
              <div className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
                <span>{patient.hospital_number || patient.mrn}</span>
                <span>•</span>
                <span>{patient.age}y</span>
                <span>•</span>
                <span className="capitalize">{patient.gender}</span>
                {patient.blood_group && (
                  <>
                    <span>•</span>
                    <span className="font-medium">{patient.blood_group}</span>
                  </>
                )}
                {patient.phone && (
                  <>
                    <span>•</span>
                    <span>{patient.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-px bg-slate-200">
          <div className="bg-slate-50/80 px-2 py-1.5 text-center">
            <p className="text-xs font-semibold text-slate-900">{patient.age}</p>
            <p className="text-[8px] uppercase tracking-wider text-slate-400">Age</p>
          </div>
          <div className="bg-slate-50/80 px-2 py-1.5 text-center">
            <p className="text-xs font-semibold text-slate-900 capitalize">{patient.gender}</p>
            <p className="text-[8px] uppercase tracking-wider text-slate-400">Gender</p>
          </div>
          <div className="bg-slate-50/80 px-2 py-1.5 text-center">
            <p className="text-xs font-semibold text-slate-900">{patient.blood_group}</p>
            <p className="text-[8px] uppercase tracking-wider text-slate-400">Blood</p>
          </div>
          <div className="bg-slate-50/80 px-2 py-1.5 text-center">
            <p className="text-xs font-semibold text-slate-900">{patient.genotype}</p>
            <p className="text-[8px] uppercase tracking-wider text-slate-400">Genotype</p>
          </div>
        </div>

        {(hasAllergies || hasChronic || patient.dnr_order || hasMedications || hasSurgery) && (
          <div className="flex flex-wrap items-center gap-1 px-3 py-1.5 bg-red-50/50 border-b border-slate-200">
            <AlertTriangle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />
            <span className="text-[8px] font-semibold text-red-700 uppercase tracking-wider mr-0.5">Alerts:</span>
            {hasAllergies && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-2 py-0.5 text-[8px] font-medium text-red-700">
                <AlertCircle className="h-2.5 w-2.5 flex-shrink-0" />
                {patient.known_allergies}
              </span>
            )}
            {hasChronic && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-100 px-2 py-0.5 text-[8px] font-medium text-orange-700">
                <Heart className="h-2.5 w-2.5 flex-shrink-0" />
                {patient.chronic_conditions}
              </span>
            )}
            {patient.dnr_order && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-2 py-0.5 text-[8px] font-medium text-red-700">
                <AlertTriangle className="h-2.5 w-2.5 flex-shrink-0" />
                DNR
              </span>
            )}
            {hasMedications && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-100 px-2 py-0.5 text-[8px] font-medium text-blue-700">
                <Pill className="h-2.5 w-2.5 flex-shrink-0" />
                {patient.current_medications}
              </span>
            )}
            {hasSurgery && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-100 px-2 py-0.5 text-[8px] font-medium text-purple-700">
                <Scissors className="h-2.5 w-2.5 flex-shrink-0" />
                {patient.surgical_history}
              </span>
            )}
          </div>
        )}

        <div className="overflow-y-auto max-h-[calc(85vh-200px)] p-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-2">
              <div className="flex items-center gap-1 mb-1.5">
                <User className="h-3 w-3 text-slate-500 flex-shrink-0" />
                <h4 className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">Personal</h4>
              </div>
              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500 flex-shrink-0">DOB</span>
                  <span className="font-medium text-slate-800 text-right">{formatDate(patient.date_of_birth)}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Marital</span>
                  <span className="font-medium text-slate-800 text-right capitalize">{patient.marital_status}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Occupation</span>
                  <span className="font-medium text-slate-800 text-right">{patient.occupation}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Religion</span>
                  <span className="font-medium text-slate-800 text-right">{patient.religion}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Ethnicity</span>
                  <span className="font-medium text-slate-800 text-right">{patient.ethnicity}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Language</span>
                  <span className="font-medium text-slate-800 text-right">{patient.preferred_language || patient.language_spoken}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-2">
              <div className="flex items-center gap-1 mb-1.5">
                <Phone className="h-3 w-3 text-slate-500 flex-shrink-0" />
                <h4 className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">Contact</h4>
              </div>
              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500 flex-shrink-0">Phone</span>
                  <span className="font-medium text-slate-800 text-right">{patient.phone}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Alt Phone</span>
                  <span className="font-medium text-slate-800 text-right">{patient.phone2}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Email</span>
                  <span className="font-medium text-slate-800 text-right">{patient.email}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Address</span>
                  <span className="font-medium text-slate-800 text-right">{patient.address}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">City</span>
                  <span className="font-medium text-slate-800 text-right">{patient.city}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">State</span>
                  <span className="font-medium text-slate-800 text-right">{patient.state}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Country</span>
                  <span className="font-medium text-slate-800 text-right">{patient.country}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-2">
              <div className="flex items-center gap-1 mb-1.5">
                <HeartPulse className="h-3 w-3 text-slate-500 flex-shrink-0" />
                <h4 className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">Medical</h4>
              </div>
              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500 flex-shrink-0">Blood Group</span>
                  <span className="font-medium text-slate-800 text-right">{patient.blood_group}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Genotype</span>
                  <span className="font-medium text-slate-800 text-right">{patient.genotype}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Allergies</span>
                  <span className={`font-medium text-right ${hasAllergies ? 'text-red-600' : 'text-slate-800'}`}>
                    {patient.known_allergies}
                  </span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Chronic</span>
                  <span className={`font-medium text-right ${hasChronic ? 'text-orange-600' : 'text-slate-800'}`}>
                    {patient.chronic_conditions}
                  </span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Medications</span>
                  <span className={`font-medium text-right ${hasMedications ? 'text-blue-600' : 'text-slate-800'}`}>
                    {patient.current_medications}
                  </span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Surgery</span>
                  <span className={`font-medium text-right ${hasSurgery ? 'text-purple-600' : 'text-slate-800'}`}>
                    {patient.surgical_history}
                  </span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Family History</span>
                  <span className="font-medium text-slate-800 text-right">{patient.family_history}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-2">
              <div className="flex items-center gap-1 mb-1.5">
                <IdCard className="h-3 w-3 text-slate-500 flex-shrink-0" />
                <h4 className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">ID & Insurance</h4>
              </div>
              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500 flex-shrink-0">MRN</span>
                  <span className="font-medium text-slate-800 text-right">{patient.mrn}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Hospital #</span>
                  <span className="font-medium text-slate-800 text-right">{patient.hospital_number}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">NIN</span>
                  <span className="font-medium text-slate-800 text-right">{patient.nin}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">NHIS</span>
                  <span className="font-medium text-slate-800 text-right">{patient.nhis_number}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">Insurance</span>
                  <span className="font-medium text-slate-800 text-right">{patient.has_insurance ? 'Yes' : 'No'}</span>
                </div>
                {patient.has_insurance && (
                  <>
                    <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                      <span className="text-slate-500 flex-shrink-0">Provider</span>
                      <span className="font-medium text-slate-800 text-right">{patient.insurance_company}</span>
                    </div>
                    <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                      <span className="text-slate-500 flex-shrink-0">Policy #</span>
                      <span className="font-medium text-slate-800 text-right">{patient.insurance_policy_number}</span>
                    </div>
                    <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                      <span className="text-slate-500 flex-shrink-0">Expiry</span>
                      <span className="font-medium text-slate-800 text-right">{formatDate(patient.insurance_expiry)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between gap-2 border-t border-slate-200/50 pt-0.5">
                  <span className="text-slate-500 flex-shrink-0">DNR</span>
                  <span className={`font-medium text-right ${patient.dnr_order ? 'text-red-600' : 'text-slate-800'}`}>
                    {patient.dnr_order ? `Yes${patient.dnr_order_reason ? ` (${patient.dnr_order_reason})` : ''}` : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-1.5 border-t border-slate-200 bg-slate-50/80">
          <div className="flex flex-wrap items-center gap-1 text-[8px] text-slate-400">
            <span>Created: {formatDate(patient.created_at)}</span>
            <span>•</span>
            <span>Updated: {formatDate(patient.updated_at)}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-3 py-1 text-[10px] font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const ConsultationV2 = () => {
  const dispatch = useDispatch();
  const consultation = useSelector(selectConsultation);
  const redFlags = useSelector(selectRedFlags);
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [expandedSections, setExpandedSections] = useState({
    hpi: true,
    ice: false,
    ros: false,
    pmh: false,
    familyHistory: false,
    drugHistory: false,
    socialHistory: false,
    assessment: false,
    plan: false,
    disposition: false,
    orders: false,
    billing: false,
    physicalExam: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSavingSection, setIsSavingSection] = useState({});
  const [apiMessage, setApiMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    quantity: '',
    route: 'oral',
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
  const [icd10Database, setIcd10Database] = useState([]);
  const [icd10SearchLoading, setIcd10SearchLoading] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [isSearchingPatients, setIsSearchingPatients] = useState(false);
  const [patientSearchError, setPatientSearchError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientVisits, setPatientVisits] = useState([]);
  const [isLoadingPatientVisits, setIsLoadingPatientVisits] = useState(false);
  const [patientVisitsError, setPatientVisitsError] = useState('');
  const [allPatientVisits, setAllPatientVisits] = useState([]);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInError, setCheckInError] = useState('');
  const [availableVisits, setAvailableVisits] = useState([]);
  const [isLoadingVisits, setIsLoadingVisits] = useState(false);
  const [visitLoadError, setVisitLoadError] = useState('');
  const [newRelevantCondition, setNewRelevantCondition] = useState('');
  const [newSiblingName, setNewSiblingName] = useState('');
  const [newSiblingConditions, setNewSiblingConditions] = useState('');
  const [otherVisits, setOtherVisits] = useState([]);
  const [showVisitSwitcher, setShowVisitSwitcher] = useState(false);

  const visitId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('visit') || location.state?.visitId || null;
  }, [location.search, location.state]);

  // ==================== HELPERS ====================

  const parseList = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.results && Array.isArray(response.results)) return response.results;
    return [];
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const showSuccess = (message) => {
    setApiMessage(message);
    setTimeout(() => setApiMessage(''), 3000);
  };

  const showError = (message) => {
    setApiError(message);
    setTimeout(() => setApiError(''), 5000);
  };

  const getHpiDetails = () => ({
    onset: consultation.hpi.onset,
    location: consultation.hpi.location,
    character: consultation.hpi.character,
    radiation: consultation.hpi.radiation,
    associatedSymptoms: consultation.hpi.associatedSymptoms,
    aggravatingFactors: consultation.hpi.aggravatingFactors,
    relievingFactors: consultation.hpi.relievingFactors,
    severity: consultation.hpi.severity,
    previousTreatment: consultation.hpi.previousTreatment
  });

  const parseStructured = (value, fallback = {}) => {
    if (value && typeof value === 'object') return value;
    if (typeof value !== 'string' || !value.trim()) return fallback;
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch {
      return fallback;
    }
  };

  // ==================== API FUNCTIONS ====================


  const handleSaveHPI = async () => {
    if (!visitId) return;
    setIsSavingSection(prev => ({ ...prev, hpi: true }));
    try {
      await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        chief_complaint: consultation.hpi.chiefComplaint,
        history_of_present_illness: consultation.hpi.freeNotes,
        duration: consultation.hpi.duration,
        timing: consultation.hpi.timing,
        hpi_details: getHpiDetails()
      });
      dispatch(addAuditLog({ action: 'Saved HPI section' }));
      showSuccess('HPI saved successfully.');
    } catch (error) {
      showError(error.message || 'Failed to save HPI.');
    } finally {
      setIsSavingSection(prev => ({ ...prev, hpi: false }));
    }
  };

  const handleSaveICE = async () => {
    if (!visitId) return;
    setIsSavingSection(prev => ({ ...prev, ice: true }));
    try {
      await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        allergies: consultation.allergies,
        ice_ideas: consultation.ice.ideas,
        ice_concerns: consultation.ice.concerns,
        ice_expectations: consultation.ice.expectations
      });
      dispatch(addAuditLog({ action: 'Saved ICE section' }));
      showSuccess('ICE saved successfully.');
    } catch (error) {
      showError(error.message || 'Failed to save ICE.');
    } finally {
      setIsSavingSection(prev => ({ ...prev, ice: false }));
    }
  };

  const handleSaveROS = async () => {
    if (!visitId) return;
    setIsSavingSection(prev => ({ ...prev, ros: true }));
    try {
      const rosData = {};
      Object.entries(consultation.ros).forEach(([section, values]) => {
        rosData[section] = values;
      });
      await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        subjective: JSON.stringify(rosData)
      });
      dispatch(addAuditLog({ action: 'Saved ROS section' }));
      showSuccess('ROS saved successfully.');
    } catch (error) {
      showError(error.message || 'Failed to save ROS.');
    } finally {
      setIsSavingSection(prev => ({ ...prev, ros: false }));
    }
  };

  const handleSavePMH = async () => {
    if (!visitId) return;
    setIsSavingSection(prev => ({ ...prev, pmh: true }));
    try {
      await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        past_medical_history: JSON.stringify({
          conditions: consultation.pastMedicalHistory.conditions,
          surgeries: consultation.pastMedicalHistory.surgeries,
          hospitalizations: consultation.pastMedicalHistory.hospitalizations,
          other_history: consultation.pastMedicalHistory.otherHistory
        })
      });
      dispatch(addAuditLog({ action: 'Saved Past Medical History' }));
      showSuccess('PMH saved successfully.');
    } catch (error) {
      showError(error.message || 'Failed to save PMH.');
    } finally {
      setIsSavingSection(prev => ({ ...prev, pmh: false }));
    }
  };

  const handleSaveFamilyHistory = async () => {
    if (!visitId) return;
    setIsSavingSection(prev => ({ ...prev, familyHistory: true }));
    try {
      await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        family_history: JSON.stringify({
          mother: consultation.familyHistory.mother,
          father: consultation.familyHistory.father,
          siblings: consultation.familyHistory.siblings,
          relevant_conditions: consultation.familyHistory.relevantConditions
        })
      });
      dispatch(addAuditLog({ action: 'Saved Family History' }));
      showSuccess('Family history saved successfully.');
    } catch (error) {
      showError(error.message || 'Failed to save family history.');
    } finally {
      setIsSavingSection(prev => ({ ...prev, familyHistory: false }));
    }
  };

  const handleSaveSocialHistory = async () => {
    if (!visitId) return;
    setIsSavingSection(prev => ({ ...prev, socialHistory: true }));
    try {
      await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        social_history: JSON.stringify({
          occupation: consultation.socialHistory.occupation,
          living_situation: consultation.socialHistory.livingSituation,
          marital_status: consultation.socialHistory.maritalStatus,
          children: consultation.socialHistory.children,
          independence: consultation.socialHistory.independence,
          smoking: consultation.socialHistory.smoking,
          alcohol: consultation.socialHistory.alcohol,
          recreational_drugs: consultation.socialHistory.recreationalDrugs
        })
      });
      dispatch(addAuditLog({ action: 'Saved Social History' }));
      showSuccess('Social history saved successfully.');
    } catch (error) {
      showError(error.message || 'Failed to save social history.');
    } finally {
      setIsSavingSection(prev => ({ ...prev, socialHistory: false }));
    }
  };

  const handleSaveAssessment = async () => {
    if (!visitId) return;
    setIsSavingSection(prev => ({ ...prev, assessment: true }));
    try {
      await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        assessment: JSON.stringify({
          clinical_impression: consultation.assessment.clinicalImpression,
          primary_diagnosis: consultation.assessment.primaryDiagnosis,
          secondary_diagnosis: consultation.assessment.secondaryDiagnosis,
          differential_diagnosis: consultation.assessment.differentialDiagnosis
        })
      });
      dispatch(addAuditLog({ action: 'Saved Assessment' }));
      showSuccess('Assessment saved successfully.');
    } catch (error) {
      showError(error.message || 'Failed to save assessment.');
    } finally {
      setIsSavingSection(prev => ({ ...prev, assessment: false }));
    }
  };

  const handleSaveTreatmentPlan = async () => {
    if (!visitId) return;
    setIsSavingSection(prev => ({ ...prev, plan: true }));
    try {
      await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        plan: JSON.stringify({
          management_plan: consultation.treatmentPlan.managementPlan,
          medications: consultation.treatmentPlan.medications,
          lifestyle_advice: consultation.treatmentPlan.lifestyleAdvice,
          dietary_advice: consultation.treatmentPlan.dietaryAdvice,
          patient_education: consultation.treatmentPlan.patientEducation,
          monitoring_plan: consultation.treatmentPlan.monitoringPlan,
          safety_net_advice: consultation.treatmentPlan.safetyNetAdvice
        })
      });
      dispatch(addAuditLog({ action: 'Saved Treatment Plan' }));
      showSuccess('Treatment plan saved successfully.');
    } catch (error) {
      showError(error.message || 'Failed to save treatment plan.');
    } finally {
      setIsSavingSection(prev => ({ ...prev, plan: false }));
    }
  };

  const handleSavePhysicalExam = async () => {
    if (!visitId) return;
    setIsSavingSection(prev => ({ ...prev, physicalExam: true }));
    try {
      await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        objective: JSON.stringify(consultation.physicalExam)
      });
      dispatch(addAuditLog({ action: 'Saved Physical Exam' }));
      showSuccess('Physical exam saved successfully.');
    } catch (error) {
      showError(error.message || 'Failed to save physical exam.');
    } finally {
      setIsSavingSection(prev => ({ ...prev, physicalExam: false }));
    }
  };

  const handleSaveDrugHistory = async () => {
    if (!visitId) return;
    setIsSavingSection(prev => ({ ...prev, drugHistory: true }));
    try {
      const medPromises = consultation.medications.map(med =>
        consultationApi.createPrescription({
          visit: visitId,
          drug_name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          quantity: med.quantity,
          route: med.route,
          instructions: med.reason,
          status: 'prescribed'
        })
      );

      const allergyPromises = consultation.allergies.map(allergy =>
        consultationApi.createAllergy({
          visit: visitId,
          patient: consultation.patient.patientId,
          allergen: allergy.substance,
          allergy_type: allergy.type,
          reaction: allergy.reactionType,
          severity: allergy.severity,
          notes: allergy.notes,
          status: 'active'
        })
      );

      await Promise.all([...medPromises, ...allergyPromises]);
      dispatch(addAuditLog({ action: 'Saved Drug History' }));
      showSuccess('Drug history saved successfully.');
    } catch (error) {
      showError(error.message || 'Failed to save drug history.');
    } finally {
      setIsSavingSection(prev => ({ ...prev, drugHistory: false }));
    }
  };

  const handleSaveDisposition = async () => {
    if (!visitId) return;
    setIsSavingSection(prev => ({ ...prev, disposition: true }));
    try {
      await apiRequest(`/api/v1/patients/visits/${visitId}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          disposition_type: consultation.disposition.type,
          disposition_reason: consultation.disposition.reason,
          admission_required: consultation.disposition.admission === 'Yes',
          follow_up_date: consultation.followUp.date || null,
          follow_up_time: consultation.followUp.time || null,
          follow_up_reason: consultation.followUp.reason
        })
      });
      await consultationApi.createConsultationNote({
        visit: visitId,
        patient: consultation.patient.patientId,
        disposition_type: consultation.disposition.type,
        disposition_reason: consultation.disposition.reason,
        admission_required: consultation.disposition.admission === 'Yes',
        follow_up_date: consultation.followUp.date || null,
        follow_up_time: consultation.followUp.time || null,
        follow_up_reason: consultation.followUp.reason
      });
      dispatch(addAuditLog({ action: 'Saved Disposition' }));
      showSuccess('Disposition saved successfully.');
    } catch (error) {
      showError(error.message || 'Failed to save disposition.');
    } finally {
      setIsSavingSection(prev => ({ ...prev, disposition: false }));
    }
  };

  // --- Patient Search Functions ---

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
      const normalizedSearch = trimmedTerm.replace(/^(mrn[:\s-]+|patient\s+(id|number)[:\s-]+|search[:\s-]+)/i, '').trim() || trimmedTerm;
      const response = await Promise.race([
        apiRequest(`/api/v1/patients/patients/?search=${encodeURIComponent(normalizedSearch)}&page_size=20`),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Search timed out after 15 seconds')), 15000)
        ),
      ]);
      const patients = parseList(response);
      setPatientResults(patients);
      if (!patients.length) {
        setPatientSearchError('No patients found matching your search.');
      }
    } catch (error) {
      setPatientSearchError(error.message || 'Unable to search patients.');
    } finally {
      setIsSearchingPatients(false);
    }
  };

  const loadPatientVisits = async (patientId) => {
    setPatientVisitsError('');
    setIsLoadingPatientVisits(true);
    setPatientVisits([]);
    setAllPatientVisits([]);

    try {
      const response = await Promise.race([
        consultationApi.getPatientVisits(patientId),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out after 15 seconds')), 15000)
        ),
      ]);
      const visits = parseList(response);
      setPatientVisits(visits);
      setAllPatientVisits(visits);
      if (!visits.length) {
        setPatientVisitsError('No visits found for this patient.');
      }
    } catch (error) {
      setPatientVisitsError(error.message || 'Unable to load patient visits.');
    } finally {
      setIsLoadingPatientVisits(false);
    }
  };

  const loadOtherVisits = () => {
    const currentId = String(visitId);
    let others = [];

    if (allPatientVisits.length > 0) {
      others = allPatientVisits.filter(v => String(v.id) !== currentId);
    } else if (consultation.patient?.patientId) {
      others = patientVisits.filter(v => String(v.id) !== currentId);
    }

    setOtherVisits(others);
    setShowVisitSwitcher(true);
  };

  const switchToVisit = (visit) => {
    navigate(`/consultation?visit=${visit.id}`);
    setShowVisitSwitcher(false);
  };

  const selectPatient = async (patient) => {
    setSelectedPatient(patient);
    setPatientVisits([]);
    setCheckInError('');
    await loadPatientVisits(patient.id);
  };

  const clearSelectedPatient = () => {
    setSelectedPatient(null);
    setPatientVisits([]);
    setAllPatientVisits([]);
    setPatientSearchTerm('');
    setPatientResults([]);
    setPatientSearchError('');
    setPatientVisitsError('');
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

  const viewPatientDetails = (patient) => {
    setSelectedPatientForDetails(patient);
    setShowPatientDetails(true);
  };

  // ==================== EFFECTS ====================

  useEffect(() => {
    if (visitId || availableVisits.length > 0) return;

    const loadRecentVisits = async () => {
      setIsLoadingVisits(true);
      setVisitLoadError('');
      try {
        const response = await Promise.race([
          consultationApi.getVisits({ status: 'triaged', page_size: 20 }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Loading recent visits timed out after 15 seconds')), 15000)
          ),
        ]);
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

  useEffect(() => {
    if (!visitId) return;

    let isCurrentRequest = true;
    dispatch(resetConsultation());

    const loadVisit = async () => {
      setIsLoading(true);
      try {
        const [visit, noteResponse, prescriptionResponse] = await Promise.race([
          Promise.all([
            consultationApi.getVisit(visitId),
            consultationApi.getConsultationNotes({ visit: visitId }),
            consultationApi.getPrescriptions({ visit: visitId })
          ]),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Loading visit timed out after 20 seconds')), 20000)
          ),
        ]);

        if (!isCurrentRequest) return;

        const notes = parseList(noteResponse);
        const prescriptions = parseList(prescriptionResponse);
        const allergyResponse = await consultationApi.getAllergies({ patient: visit.patient }).catch(() => []);
        const allergies = parseList(allergyResponse);

        const currentPatient = {
          patientId: visit.patient,
          mrn: visit.patient_mrn || visit.patient_hospital_number || '',
          name: visit.patient_name,
          gender: visit.patient_gender || '',
          age: visit.patient_age ?? '',
          insurancePlan: visit.patient_insurance || '',
          primaryConsultant: visit.doctor_name,
          latestVitals: visit.vital_signs ? Object.entries(visit.vital_signs).map(([key, value]) => `${key}: ${value}`).join(', ') : ''
        };

        const visitPayload = {
          encounterNumber: visit.visit_number,
          date: visit.checkin_time ? new Date(visit.checkin_time).toLocaleDateString() : '',
          time: visit.checkin_time ? new Date(visit.checkin_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          doctorName: visit.doctor_name,
          clinic: visit.department_name,
          department: visit.department_name,
          type: visit.visit_type,
          consultationStatus: visit.visit_status ? visit.visit_status.replace('_', ' ') : '',
          location: visit.referral_from
        };

        const note = notes.length ? notes[0] : null;
        const subjectiveData = parseStructured(note?.subjective);
        const assessmentData = parseStructured(note?.assessment);
        const planData = parseStructured(note?.plan);
        const physicalExamData = parseStructured(note?.objective);
        const rosData = subjectiveData.ros || (subjectiveData.general ? subjectiveData : {});
        const loadedRos = Object.keys(rosData).length > 0 ? rosData : {
          general: { status: '', comments: '' },
          cardiovascular: { status: '', comments: '' },
          respiratory: { status: '', comments: '' },
          gastrointestinal: { status: '', comments: '' },
          genitourinary: { status: '', comments: '' },
          neurological: { status: '', comments: '' },
          musculoskeletal: { status: '', comments: '' },
          endocrine: { status: '', comments: '' },
          psychiatric: { status: '', comments: '' },
          skin: { status: '', comments: '' },
          ent: { status: '', comments: '' },
          eyes: { status: '', comments: '' }
        };
        const subjectiveNotes = subjectiveData.notes || (
          typeof note?.subjective === 'string' && !note.subjective.trim().startsWith('{')
            ? note.subjective
            : ''
        );
        const pmhData = parseStructured(note?.past_medical_history);
        const familyData = parseStructured(note?.family_history);
        const socialData = parseStructured(note?.social_history);
        const billingItems = Array.isArray(note?.billing_items) ? note.billing_items : [];
        const notePayload = note ? {
          hpi: {
            freeNotes: subjectiveNotes || note.history_of_present_illness || '',
            chiefComplaint: note.chief_complaint || '',
            duration: note.duration || '',
            timing: note.timing || '',
            ...(note.hpi_details || {})
          },
          assessment: {
            clinicalImpression: assessmentData.clinical_impression || assessmentData.clinicalImpression || note.assessment || '',
            primaryDiagnosis: assessmentData.primary_diagnosis || assessmentData.primaryDiagnosis || '',
            secondaryDiagnosis: assessmentData.secondary_diagnosis || assessmentData.secondaryDiagnosis || '',
            workingDiagnosis: assessmentData.working_diagnosis || assessmentData.workingDiagnosis || '',
            finalDiagnosis: assessmentData.final_diagnosis || assessmentData.finalDiagnosis || '',
            clinicalReasoning: assessmentData.clinical_reasoning || assessmentData.clinicalReasoning || '',
            differentialDiagnosis: assessmentData.differential_diagnosis || assessmentData.differentialDiagnosis || note.differential_diagnosis || ''
          },
          treatmentPlan: {
            managementPlan: planData.management_plan || planData.managementPlan || note.plan || '',
            medications: planData.medications || '',
            lifestyleAdvice: planData.lifestyle_advice || planData.lifestyleAdvice || '',
            dietaryAdvice: planData.dietary_advice || planData.dietaryAdvice || '',
            patientEducation: planData.patient_education || planData.patientEducation || '',
            procedurePlan: planData.procedure_plan || planData.procedurePlan || '',
            monitoringPlan: planData.monitoring_plan || planData.monitoringPlan || '',
            safetyNetAdvice: planData.safety_net_advice || planData.safetyNetAdvice || ''
          },
          icd10: {
            selectedCodes: Array.isArray(note.diagnosis_codes)
              ? note.diagnosis_codes.map(code => ({ code, description: '' }))
              : []
          },
          ice: {
            ideas: note.ice_ideas || '',
            concerns: note.ice_concerns || '',
            expectations: note.ice_expectations || ''
          },
          ros: loadedRos,
          pastMedicalHistory: {
            conditions: pmhData.conditions || '',
            surgeries: pmhData.surgeries || '',
            hospitalizations: pmhData.hospitalizations || '',
            otherHistory: pmhData.otherHistory || pmhData.other_history || '',
            pastIllnesses: pmhData.pastIllnesses || [],
            chronicDiseases: pmhData.chronicDiseases || [],
            pastSurgeries: pmhData.pastSurgeries || [],
            hospitalAdmissions: pmhData.hospitalAdmissions || [],
            previousDiagnoses: pmhData.previousDiagnoses || [],
            vaccinations: pmhData.vaccinations || []
          },
          familyHistory: {
            mother: familyData.mother || { alive: false, age: '', conditions: '', causeOfDeath: '' },
            father: familyData.father || { alive: false, age: '', conditions: '', causeOfDeath: '' },
            siblings: familyData.siblings || [],
            relevantConditions: familyData.relevantConditions || familyData.relevant_conditions || []
          },
          socialHistory: {
            occupation: socialData.occupation || '',
            livingSituation: socialData.livingSituation || socialData.living_situation || '',
            maritalStatus: socialData.maritalStatus || socialData.marital_status || '',
            children: socialData.children || '',
            independence: socialData.independence || '',
            smoking: socialData.smoking || { status: '', startDate: '', packYears: '', quitDate: '' },
            alcohol: socialData.alcohol || { status: '', unitsPerWeek: '', duration: '' },
            recreationalDrugs: socialData.recreationalDrugs || socialData.recreational_drugs || { status: '', substances: '', frequency: '' }
          },
          physicalExam: physicalExamData,
          disposition: {
            type: note.disposition_type || '',
            reason: note.disposition_reason || '',
            admission: note.admission_required ? 'Yes' : 'No'
          },
          followUp: {
            date: note.follow_up_date || '',
            time: note.follow_up_time || '',
            reason: note.follow_up_reason || ''
          },
          billing: {
            charges: billingItems,
            total: billingItems.reduce((total, item) => total + Number(item.amount || 0), 0),
            generated: billingItems.length > 0,
            insuranceCovered: !!note.insurance_covered,
            insuranceAmount: Number(note.insurance_amount || 0)
          },
          signature: {
            signed: !!note.is_signed,
            signedAt: note.signed_at || '',
            doctorName: note.doctor_name || ''
          }
        } : {};

        const prescriptionsPayload = {
          medications: prescriptions.map((prescription) => ({
            id: prescription.id,
            name: prescription.drug_name,
            dosage: prescription.dosage,
            frequency: prescription.frequency,
            duration: prescription.duration ? String(prescription.duration) : '',
            quantity: prescription.quantity ? String(prescription.quantity) : '',
            route: prescription.route,
            reason: prescription.instructions || '',
            status: prescription.status || 'active'
          }))
        };

        const savedAllergies = Array.isArray(note?.allergies) ? note.allergies : [];
        const allergiesPayload = [...savedAllergies, ...allergies].map((allergy) => ({
          id: allergy.id,
          substance: allergy.allergen || allergy.substance || '',
          type: allergy.allergy_type || allergy.type || 'Drug',
          severity: allergy.severity || 'Moderate',
          reactionType: allergy.reaction || allergy.reaction_type || '',
          notes: allergy.notes || ''
        }));

        dispatch(loadConsultation({
          patient: currentPatient,
          encounter: visitPayload,
          hpi: {
            ...notePayload.hpi,
            freeNotes: visit.history_of_present_illness || '',
            chiefComplaint: visit.chief_complaint || '',
            duration: note?.duration || '',
            timing: note?.timing || ''
          },
          ...notePayload,
          ...prescriptionsPayload,
          allergies: allergiesPayload.filter((allergy, index, values) =>
            values.findIndex(item => item.substance.toLowerCase() === allergy.substance.toLowerCase()) === index
          )
        }));

        const status = {
          hpi: !!visit.chief_complaint,
          ice: !!(notePayload.ice?.ideas || notePayload.ice?.concerns || notePayload.ice?.expectations),
          drugHistory: prescriptions.length > 0,
          assessment: !!(notePayload.assessment?.clinicalImpression)
        };
        dispatch(updateCompletionStatus(status));

      } catch (error) {
        if (isCurrentRequest) {
          setApiError(error.message || 'Unable to load consultation details.');
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    };

    loadVisit();
    return () => {
      isCurrentRequest = false;
    };
  }, [visitId, dispatch]);

  useEffect(() => {
    const patientId = consultation.patient?.patientId;
    if (!patientId || !visitId || allPatientVisits.length > 0) return;

    const preloadOtherVisits = async () => {
      try {
        const response = await consultationApi.getPatientVisits(patientId);
        const visits = parseList(response);
        setAllPatientVisits(visits);
      } catch {
        // Silently fail - other visits will be empty until user searches for patient
      }
    };

    preloadOtherVisits();
  }, [consultation.patient?.patientId, visitId, allPatientVisits.length]);

  // ==================== HANDLERS ====================

  const handleHPIChange = (field, value) => {
    dispatch(updateHPIField({ field, value }));
    dispatch(addAuditLog({ action: `Updated HPI field ${field}` }));
  };

  const handleICEChange = (field, value) => {
    dispatch(updateICEField({ field, value }));
    dispatch(addAuditLog({ action: `Updated ICE field ${field}` }));
  };

  const handleROSChange = (section, field, value) => {
    dispatch(updateROSField({ section, field, value }));
    dispatch(addAuditLog({ action: `Updated ROS ${section} ${field}` }));
  };

  const handlePMHChange = (field, value) => {
    dispatch(updatePastMedicalHistory({ field, value }));
    dispatch(addAuditLog({ action: `Updated PMH ${field}` }));
  };

  const handleFamilyHistoryChange = (section, field, value) => {
    dispatch(updateFamilyHistory({ section, field, value }));
    dispatch(addAuditLog({ action: `Updated Family History ${section}.${field}` }));
  };

  const handleSocialHistoryChange = (field, value) => {
    dispatch(updateSocialHistory({ field, value }));
    dispatch(addAuditLog({ action: `Updated Social History ${field}` }));
  };

  const handleSocialHistorySubsectionChange = (section, field, value) => {
    dispatch(updateSocialHistorySubsection({ section, field, value }));
    dispatch(addAuditLog({ action: `Updated Social History ${section}.${field}` }));
  };

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      showError('Please enter medication name and dosage.');
      return;
    }
    dispatch(addMedication(newMedication));
    dispatch(addAuditLog({ action: `Added medication ${newMedication.name}` }));
    setNewMedication({ name: '', dosage: '', frequency: '', duration: '', quantity: '', route: 'oral', reason: '' });
    showSuccess('Medication added.');
  };

  const handleRemoveMedication = (id) => {
    dispatch(removeMedication(id));
    dispatch(addAuditLog({ action: `Removed medication ${id}` }));
    showSuccess('Medication removed.');
  };

  const handleAddAllergy = () => {
    if (!newAllergy.substance) {
      showError('Please enter allergy substance.');
      return;
    }
    dispatch(addAllergy(newAllergy));
    dispatch(addAuditLog({ action: `Added allergy ${newAllergy.substance}` }));
    setNewAllergy({ type: 'Drug', substance: '', severity: 'Moderate', reactionType: '', notes: '' });
    showSuccess('Allergy added.');
  };

  const handleRemoveAllergy = (id) => {
    dispatch(removeAllergy(id));
    dispatch(addAuditLog({ action: `Removed allergy ${id}` }));
    showSuccess('Allergy removed.');
  };

  const handleAddRelevantCondition = () => {
    if (newRelevantCondition.trim()) {
      dispatch(addRelevantCondition(newRelevantCondition.trim()));
      setNewRelevantCondition('');
      showSuccess('Condition added.');
    }
  };

  const handleRemoveRelevantCondition = (condition) => {
    dispatch(removeRelevantCondition(condition));
    showSuccess('Condition removed.');
  };

  const handleAddSibling = () => {
    if (newSiblingName.trim()) {
      dispatch(addFamilySibling({ 
        id: Date.now().toString(), 
        name: newSiblingName.trim(), 
        conditions: newSiblingConditions.trim() 
      }));
      setNewSiblingName('');
      setNewSiblingConditions('');
      showSuccess('Sibling added.');
    } else {
      showError('Please enter sibling name.');
    }
  };

  const handleRemoveSibling = (id) => {
    dispatch(removeFamilySibling(id));
    showSuccess('Sibling removed.');
  };

  const handleSearchICD10 = async (query) => {
    if (!query.trim()) {
      setIcd10Database([]);
      return;
    }
    setIcd10SearchLoading(true);
    try {
      const results = await consultationApi.searchICD10(query);
      setIcd10Database(results);
    } catch (error) {
      showError(error.message || 'Unable to search ICD-10 codes.');
    } finally {
      setIcd10SearchLoading(false);
    }
  };

  const handleAddICD10 = (code) => {
    dispatch(addICD10Code(code));
    dispatch(addAuditLog({ action: `Added diagnosis code ${code.code}` }));
    showSuccess('ICD-10 code added.');
  };

  const handleSignOff = async () => {
    const userFullName = localStorage.getItem('userFullName') || localStorage.getItem('userName');
    const tenantId = localStorage.getItem('tenantId');
    const signedAt = new Date().toISOString();
    const consultationCharge = { item: 'Consultation fee', amount: 5000 };
    dispatch(signConsultation({
      doctorName: userFullName,
      licenseNumber: tenantId,
      digitalSignature: 'signed-by-app',
      ipAddress: window.location.hostname
    }));
    dispatch(addAuditLog({ action: 'Signed consultation' }));
    dispatch(generateBillingCharge(consultationCharge));
    showSuccess('Consultation signed and finalized.');
    await handleSaveConsultation({
      markFinal: true,
      signatureOverride: {
        signed: true,
        signedAt,
        doctorName: userFullName,
        licenseNumber: tenantId,
        digitalSignature: 'signed-by-app',
        ipAddress: window.location.hostname
      },
      billingOverride: {
        ...consultation.billing,
        charges: [...consultation.billing.charges, { id: Date.now(), ...consultationCharge }],
        generated: true,
        total: consultation.billing.total + Number(consultationCharge.amount)
      }
    });
  };

  const handleSaveConsultation = async ({ markFinal = false, signatureOverride, billingOverride } = {}) => {
    setApiError('');
    setApiMessage('');
    setIsSaving(true);

    try {
      const payload = {
        next_status: markFinal ? 'billing' : 'awaiting_lab',
        chief_complaint: consultation.hpi.chiefComplaint,
        history_of_present_illness: consultation.hpi.freeNotes,
        duration: consultation.hpi.duration,
        timing: consultation.hpi.timing,
        hpi_details: getHpiDetails(),
        referral_from: consultation.disposition.referral,
        referral_reason: consultation.disposition.reason,
        subjective: JSON.stringify({ notes: consultation.hpi.freeNotes, ros: consultation.ros }),
        objective: JSON.stringify(consultation.physicalExam),
        assessment: JSON.stringify(consultation.assessment),
        plan: JSON.stringify(consultation.treatmentPlan),
        differential_diagnosis: consultation.assessment.differentialDiagnosis,
        diagnosis_codes: consultation.icd10.selectedCodes.map(code => code.code),
        is_final: markFinal,
        ice_ideas: consultation.ice.ideas,
        ice_concerns: consultation.ice.concerns,
        ice_expectations: consultation.ice.expectations,
        past_medical_history: consultation.pastMedicalHistory,
        social_history: consultation.socialHistory,
        family_history: consultation.familyHistory,
        physical_exam: consultation.physicalExam,
        disposition_type: consultation.disposition.type,
        disposition_reason: consultation.disposition.reason,
        admission_required: consultation.disposition.admission === 'Yes',
        follow_up_date: consultation.followUp.date || null,
        follow_up_time: consultation.followUp.time || null,
        follow_up_reason: consultation.followUp.reason,
        prescriptions: consultation.medications.map(p => ({
          medication: p.name,
          drug_name: p.name,
          dosage: p.dosage,
          frequency: p.frequency,
          duration: p.duration,
          quantity: p.quantity,
          route: p.route,
          instructions: p.reason,
          status: 'prescribed'
        })),
        allergies: consultation.allergies,
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
        billing_items: (billingOverride?.charges || consultation.billing.charges).map(charge => ({
          item: charge.item,
          amount: charge.amount
        })),
        insurance_covered: (billingOverride || consultation.billing).insuranceCovered || false,
        insurance_amount: (billingOverride || consultation.billing).insuranceAmount || 0,
        is_signed: signatureOverride?.signed ?? consultation.signature.signed,
        signed_at: signatureOverride?.signedAt || consultation.signature.signedAt || null
      };

      if (!visitId) {
        throw new Error('No visit selected for consultation save.');
      }

      await consultationApi.endConsultation(visitId, payload);

      showSuccess('Consultation saved successfully.');
    } catch (error) {
      showError(error.message || 'Unable to save consultation.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBillingCharge = () => {
    if (!chargeItem.item || !chargeItem.amount) {
      showError('Please enter item and amount.');
      return;
    }
    dispatch(generateBillingCharge({ item: chargeItem.item, amount: Number(chargeItem.amount) }));
    setChargeItem({ item: '', amount: '' });
    showSuccess('Charge added successfully.');
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
    dispatch(addAuditLog({ action: `Created ${orderType} order` }));
    showSuccess(`${orderType} order added.`);
  };

  // ==================== RENDER ====================

  // --- Patient Search / No Visit ---
  if (!visitId) {
    return (
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 sm:p-4 text-sm text-red-700">
          <p className="font-semibold">No visit selected.</p>
          <p className="text-xs sm:text-sm">Search for a patient, select a visit, or choose a recent visit to start consultation.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Patient Search */}
          <section className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm flex-1 lg:max-w-[45%]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-slate-900">Search Patient</h2>
                <p className="mt-0.5 text-[10px] sm:text-xs text-slate-600">Find a patient and open a visit from their history.</p>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={patientSearchTerm}
                  onChange={(e) => {
                    setPatientSearchTerm(e.target.value);
                    if (selectedPatient) clearSelectedPatient();
                  }}
                  placeholder="Name, MRN, phone, or email"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
                <button
                  type="button"
                  onClick={searchPatients}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 whitespace-nowrap"
                >
                  <Search className="h-4 w-4 mr-1.5" />
                  Search
                </button>
              </div>

              {patientSearchError && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-2 text-xs text-orange-700">
                  {patientSearchError}
                </div>
              )}

              {isSearchingPatients ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">Searching...</div>
              ) : patientResults.length > 0 ? (
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                  {patientResults.map((patient) => {
                    const hasAllergies = patient.known_allergies && patient.known_allergies !== 'None';
                    const hasChronic = patient.chronic_conditions && patient.chronic_conditions !== 'None';
                    const hasMedications = patient.current_medications && patient.current_medications !== 'None';
                    const hasSurgery = patient.surgical_history && patient.surgical_history !== 'None';

                    return (
                      <div
                        key={patient.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-2 transition hover:bg-slate-100"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="font-semibold text-slate-900 text-sm truncate">
                                {patient.full_name || `${patient.first_name} ${patient.last_name}`}
                              </p>
                              {hasAllergies && (
                                <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-medium text-red-700 flex items-center gap-0.5">
                                  <AlertCircle className="h-2.5 w-2.5" />
                                  Allergy
                                </span>
                              )}
                              {hasChronic && (
                                <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] font-medium text-orange-700 flex items-center gap-0.5">
                                  <Heart className="h-2.5 w-2.5" />
                                  Chronic
                                </span>
                              )}
                              {hasMedications && (
                                <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-medium text-blue-700 flex items-center gap-0.5">
                                  <Pill className="h-2.5 w-2.5" />
                                  Meds
                                </span>
                              )}
                              {hasSurgery && (
                                <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[9px] font-medium text-purple-700 flex items-center gap-0.5">
                                  <Scissors className="h-2.5 w-2.5" />
                                  Surgery
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[10px] text-slate-600">
                              <span>MRN: {patient.hospital_number || patient.mrn}</span>
                              <span>•</span>
                              <span>{patient.age_display || `${patient.age}y`}</span>
                              <span>•</span>
                              <span className="capitalize">{patient.gender}</span>
                              {patient.phone && (
                                <>
                                  <span>•</span>
                                  <span>{patient.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => viewPatientDetails(patient)}
                              className="rounded-lg bg-slate-200 px-2 py-1 text-[10px] font-medium text-slate-700 transition hover:bg-slate-300"
                            >
                              <FileText className="inline h-3 w-3 mr-0.5" />
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => selectPatient(patient)}
                              className="rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-slate-700"
                            >
                              <User className="inline h-3 w-3 mr-0.5" />
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : patientSearchTerm ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">No patients found.</div>
              ) : null}

              {selectedPatient && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Selected</p>
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {selectedPatient.full_name || `${selectedPatient.first_name} ${selectedPatient.last_name}`}
                      </p>
                      <div className="mt-0.5 flex flex-wrap gap-1 text-[10px] text-slate-600">
                        <span>MRN: {selectedPatient.hospital_number || selectedPatient.mrn}</span>
                        <span>•</span>
                        <span>{selectedPatient.age_display || `${selectedPatient.age}y`}</span>
                        {selectedPatient.blood_group && (
                          <>
                            <span>•</span>
                            <span className="font-medium">{selectedPatient.blood_group}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => viewPatientDetails(selectedPatient)}
                        className="rounded-lg bg-slate-200 px-2 py-1 text-[10px] font-medium text-slate-700 transition hover:bg-slate-300"
                      >
                        <FileText className="inline h-3 w-3 mr-0.5" />
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={clearSelectedPatient}
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[10px] font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <X className="inline h-3 w-3 mr-0.5" />
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Visits List */}
          <section className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm flex-1">
            <div className="text-left">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                {selectedPatient ? 'Patient Visits' : 'Recent Visits'}
              </h2>
              <p className="mt-0.5 text-[10px] sm:text-xs text-slate-600">
                {selectedPatient
                  ? `Select a visit for ${selectedPatient.full_name?.split(' ')[0] || 'patient'}`
                  : 'Choose a recent visit to start consultation'}
              </p>
            </div>

            {selectedPatient ? (
              isLoadingPatientVisits ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">Loading visits...</div>
              ) : (
                <div className="mt-3 space-y-2">
                  {patientVisits.length > 0 && (
                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                      {patientVisits.map((visit) => (
                        <button
                          key={visit.id}
                          type="button"
                          onClick={() => navigate(`/consultation?visit=${visit.id}`)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-left transition hover:bg-slate-100"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">
                                {visit.visit_number}
                              </p>
                              <p className="text-[10px] text-slate-600">
                                {visit.department_name || visit.visit_type}
                              </p>
                            </div>
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-700">
                              {visit.visit_status || 'pending'}
                            </span>
                          </div>
                          <div className="mt-0.5 text-[10px] text-slate-500">
                            {visit.checkin_time ? new Date(visit.checkin_time).toLocaleString() : 'No check-in time'}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                    {patientVisits.length === 0 && (patientVisitsError || 'No visits available.')}
                    <button
                      type="button"
                      onClick={startNewVisit}
                      disabled={isCheckingIn}
                      className="mt-2 inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
                    >
                      {isCheckingIn ? 'Starting...' : 'Start New Visit'}
                    </button>
                    {checkInError && (
                      <div className="mt-2 rounded-xl border border-orange-200 bg-orange-50 p-2 text-xs text-orange-700">
                        {checkInError}
                      </div>
                    )}
                  </div>
                </div>
              )
            ) : visitLoadError ? (
              <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-2 text-xs text-orange-700">{visitLoadError}</div>
            ) : isLoadingVisits ? (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">Loading...</div>
            ) : availableVisits.length > 0 ? (
              <div className="mt-3 space-y-1.5 max-h-[300px] overflow-y-auto">
                {availableVisits.map((visit) => (
                  <button
                    key={visit.id}
                    type="button"
                    onClick={() => navigate(`/consultation?visit=${visit.id}`)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-left transition hover:bg-slate-100"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {visit.visit_number}
                        </p>
                        <p className="text-[10px] text-slate-600">
                          {visit.patient_name}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-700">
                        {visit.visit_status || 'pending'}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[10px] text-slate-500">
                      {visit.department_name ? `${visit.department_name} · ` : ''}
                      {visit.checkin_time ? new Date(visit.checkin_time).toLocaleString() : 'No check-in time'}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">
                No recent visits found.
              </div>
            )}
          </section>
        </div>

        {/* Patient Details Modal */}
        {showPatientDetails && selectedPatientForDetails && (
          <PatientMedicalDetails 
            patient={selectedPatientForDetails} 
            onClose={() => {
              setShowPatientDetails(false);
              setSelectedPatientForDetails(null);
            }}
          />
        )}
      </div>
    );
  }

  // ==================== MAIN CONSULTATION VIEW ====================

  return (
    <>
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Top Bar */}
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500">Consultation Module</p>
                <h1 className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">EMR Consultation</h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">Structured workflow with PISP-FDS clinical framework</p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <div className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs sm:text-sm text-slate-700">Encounter #{consultation.encounter.encounterNumber}</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
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
                            @media print { body { padding: 10px; } }
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
                        </body>
                        </html>`;
                      printWindow.document.write(patientData);
                      printWindow.document.close();
                      printWindow.print();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    <FileUser className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">Print</span>
                  </button>
                  <button
                    onClick={handleSignOff}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-white transition hover:bg-slate-700"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">Sign & Close</span>
                  </button>
                  <button
                    onClick={() => handleSaveConsultation({ markFinal: false })}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
                {apiMessage && (
                  <div className="mt-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs sm:text-sm text-green-700">
                    {apiMessage}
                  </div>
                )}
                {apiError && (
                  <div className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-700">
                    {apiError}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Patient</p>
                <h2 className="mt-1 text-sm sm:text-base font-semibold text-slate-900 truncate">{consultation.patient.name}</h2>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-600">MRN: {consultation.patient.mrn || 'N/A'} • {consultation.patient.gender || 'N/A'} • {consultation.patient.age || 'N/A'}</p>
                <p className="text-xs sm:text-sm text-slate-600">Insurance: {consultation.patient.insurancePlan || 'None recorded'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Encounter</p>
                <div className="mt-1 space-y-0.5 text-xs sm:text-sm text-slate-600">
                  <p><strong>Clinic:</strong> {consultation.encounter.clinic || 'N/A'}</p>
                  <p><strong>Dept:</strong> {consultation.encounter.department || 'N/A'}</p>
                  <p><strong>Type:</strong> {consultation.encounter.type || 'N/A'}</p>
                  <p><strong>Status:</strong> {consultation.encounter.consultationStatus || 'N/A'}</p>
                </div>
              </div>
            </div>

            {visitId && (
              <div className="mt-3">
                <button
                  onClick={loadOtherVisits}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[10px] sm:text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Users className="h-3.5 w-3.5" />
                  Switch Visit
                </button>
                {showVisitSwitcher && (
                  <div className="mt-2 rounded-xl border border-slate-200 bg-white shadow-lg z-50 max-h-[300px] overflow-y-auto">
                    {otherVisits.length === 0 ? (
                      <div className="p-3 text-xs text-slate-500">No other visits found for this patient.</div>
                    ) : (
                      <div className="p-1">
                        {otherVisits.map((visit) => (
                          <button
                            key={visit.id}
                            onClick={() => switchToVisit(visit)}
                            className="w-full text-left rounded-lg p-2 hover:bg-slate-50 transition"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-semibold text-slate-900">{visit.visit_number}</p>
                                <p className="text-[10px] text-slate-500">
                                  {visit.checkin_time ? new Date(visit.checkin_time).toLocaleDateString() : 'No date'} • {visit.visit_status || 'registered'}
                                </p>
                              </div>
                              <span className="text-[10px] text-slate-400">Click to open</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Alerts Sidebar */}
          <section className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-800">
                <ShieldCheck className="h-4 w-4 text-slate-500" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Clinical Alerts</p>
                {redFlags.detected.length > 0 && (
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
                    <AlertTriangle className="h-3 w-3" />
                    {redFlags.detected.length}
                  </span>
                )}
              </div>
              <div className="mt-2 space-y-2">
                {redFlags.detected.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-2 text-xs sm:text-sm text-slate-600">
                    No red flags detected.
                  </div>
                ) : (
                  redFlags.detected.slice(0, 3).map((flag, index) => (
                    <div key={index} className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-2">
                      <AlertOctagon className="mt-0.5 h-4 w-4 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-red-900">{flag}</p>
                        {redFlags.recommendedActions[index] && (
                          <p className="text-[10px] text-red-700">{redFlags.recommendedActions[index]}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {redFlags.detected.length > 3 && (
                  <p className="text-[10px] text-slate-500">+{redFlags.detected.length - 3} more alerts</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-800">
                <Activity className="h-4 w-4 text-slate-500" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Progress</p>
              </div>
              <div className="mt-2 space-y-1.5">
                {Object.entries(consultation.completionStatus || {}).map(([key, completed]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  const Icon = completed ? CheckCircle : AlertCircle;
                  return (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{label}</span>
                      <Icon className={`h-3.5 w-3.5 ${completed ? 'text-green-600' : 'text-slate-300'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* ====== PISP-FDS SECTIONS ====== */}

        {/* === P - Presenting Complaint (HPI) === */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Presenting Complaint"
            subtitle="History of Presenting Illness"
            icon={FileText}
            expanded={expandedSections.hpi}
            onToggle={() => toggleSection('hpi')}
            onSave={handleSaveHPI}
            isSaving={isSavingSection.hpi}
          />
          {expandedSections.hpi && (
            <div className="mt-4">
              {/* Golden Minute Tip */}
              <div className="mb-4 rounded-xl bg-blue-50 p-3 border border-blue-200">
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Info className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-800">"Golden Minute" Approach</p>
                    <p className="text-xs text-blue-700">
                      Start with an open question: <strong>"What has brought you in to see the doctor today?"</strong>
                    </p>
                    <p className="mt-1 text-[10px] text-blue-600">
                      💡 Let the patient speak freely, then summarize back to show you've listened.
                    </p>
                  </div>
                </div>
              </div>

              {/* Screening Prompt */}
              <div className="mb-4 rounded-xl bg-amber-50 p-3 border border-amber-200">
                <div className="flex items-start gap-2">
                  <Search className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800">"Screen then Scrutinize"</p>
                    <p className="text-xs text-amber-700">
                      Ask <strong>ALL</strong> symptoms before exploring any in detail.
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-amber-700">
                      "Apart from this, have you noticed anything else?"
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <FormInput
                  label="Chief Complaint"
                  value={consultation.hpi.chiefComplaint}
                  onChange={(v) => handleHPIChange('chiefComplaint', v)}
                  placeholder="Main reason for visit"
                  required
                />
                <FormInput
                  label="Duration"
                  value={consultation.hpi.duration}
                  onChange={(v) => handleHPIChange('duration', v)}
                  placeholder="How long has this been going on?"
                />
                <FormInput
                  label="Onset"
                  value={consultation.hpi.onset}
                  onChange={(v) => handleHPIChange('onset', v)}
                  placeholder="When did it start? Sudden or gradual?"
                />
                <FormInput
                  label="Location"
                  value={consultation.hpi.location}
                  onChange={(v) => handleHPIChange('location', v)}
                  placeholder="Where exactly? Can you point to it?"
                />
                <FormInput
                  label="Character"
                  value={consultation.hpi.character}
                  onChange={(v) => handleHPIChange('character', v)}
                  placeholder="Burning, stabbing, dull, crushing?"
                />
                <FormInput
                  label="Radiation"
                  value={consultation.hpi.radiation}
                  onChange={(v) => handleHPIChange('radiation', v)}
                  placeholder="Does the pain spread anywhere?"
                />
                <FormInput
                  label="Associated Symptoms"
                  value={consultation.hpi.associatedSymptoms}
                  onChange={(v) => handleHPIChange('associatedSymptoms', v)}
                  placeholder="Any other symptoms with this?"
                />
                <FormInput
                  label="Timing"
                  value={consultation.hpi.timing}
                  onChange={(v) => handleHPIChange('timing', v)}
                  placeholder="Constant, intermittent, episodic, or worse at a certain time?"
                />
                <FormInput
                  label="Aggravating Factors"
                  value={consultation.hpi.aggravatingFactors}
                  onChange={(v) => handleHPIChange('aggravatingFactors', v)}
                  placeholder="What makes it worse?"
                />
                <FormInput
                  label="Relieving Factors"
                  value={consultation.hpi.relievingFactors}
                  onChange={(v) => handleHPIChange('relievingFactors', v)}
                  placeholder="What makes it better?"
                />
                <FormInput
                  label="Severity (1-10)"
                  value={consultation.hpi.severity}
                  onChange={(v) => handleHPIChange('severity', v)}
                  placeholder="Rate the severity"
                  type="number"
                />
                <FormInput
                  label="Previous Treatment"
                  value={consultation.hpi.previousTreatment}
                  onChange={(v) => handleHPIChange('previousTreatment', v)}
                  placeholder="What have you tried so far?"
                />
              </div>
              <div className="mt-3">
                <FormTextarea
                  label="Free Text Notes"
                  value={consultation.hpi.freeNotes}
                  onChange={(v) => handleHPIChange('freeNotes', v)}
                  placeholder="Detailed history in patient's own words..."
                  rows={4}
                />
              </div>
            </div>
          )}
        </section>

        {/* === I - Ideas, Concerns & Expectations (ICE) === */}
        <section className="rounded-2xl border border-purple-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Ideas, Concerns & Expectations"
            subtitle="Patient Perspective"
            icon={HelpCircle}
            expanded={expandedSections.ice}
            onToggle={() => toggleSection('ice')}
            onSave={handleSaveICE}
            isSaving={isSavingSection.ice}
          />
          {expandedSections.ice && (
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-purple-50 p-3 border border-purple-200">
                <p className="text-xs text-purple-700">
                  💡 <strong>Clinical tip:</strong> Out of 100 people with the same symptoms, only 5 visit a doctor. 
                  Ask directly to uncover the real reason they came today.
                </p>
              </div>
              <FormTextarea
                label="Ideas - What do you think is causing this?"
                value={consultation.ice.ideas}
                onChange={(v) => handleICEChange('ideas', v)}
                placeholder="Patient's own ideas about their condition..."
                rows={3}
              />
              <FormTextarea
                label="Concerns - What are you most worried about?"
                value={consultation.ice.concerns}
                onChange={(v) => handleICEChange('concerns', v)}
                placeholder="Patient's fears and anxieties..."
                rows={3}
              />
              <FormTextarea
                label="Expectations - What were you hoping to achieve today?"
                value={consultation.ice.expectations}
                onChange={(v) => handleICEChange('expectations', v)}
                placeholder="Patient's desired outcomes..."
                rows={3}
              />
            </div>
          )}
        </section>

        {/* === S - Systems Review (ROS) === */}
        <section className="rounded-2xl border border-green-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Systems Review"
            subtitle="Review of Systems"
            icon={ClipboardList}
            expanded={expandedSections.ros}
            onToggle={() => toggleSection('ros')}
            onSave={handleSaveROS}
            isSaving={isSavingSection.ros}
          />
          {expandedSections.ros && (
            <div className="mt-4">
              {/* Red Flag Mnemonic */}
              <div className="mb-4 rounded-xl bg-red-50 p-3 border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-red-800">Red Flag Mnemonic</p>
                    <p className="text-xs text-red-700">
                      <strong>"Fat Gorillas Will Always Be Wanting To Try Nice Roast Potatoes"</strong>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-red-600">
                      <span className="rounded bg-red-100 px-1.5 py-0.5">Fever</span>
                      <span className="rounded bg-red-100 px-1.5 py-0.5">Glands</span>
                      <span className="rounded bg-red-100 px-1.5 py-0.5">Weight</span>
                      <span className="rounded bg-red-100 px-1.5 py-0.5">Appetite</span>
                      <span className="rounded bg-red-100 px-1.5 py-0.5">Bowels</span>
                      <span className="rounded bg-red-100 px-1.5 py-0.5">Waterworks</span>
                      <span className="rounded bg-red-100 px-1.5 py-0.5">Tired</span>
                      <span className="rounded bg-red-100 px-1.5 py-0.5">Travel</span>
                      <span className="rounded bg-red-100 px-1.5 py-0.5">Night sweats</span>
                      <span className="rounded bg-red-100 px-1.5 py-0.5">Rash</span>
                      <span className="rounded bg-red-100 px-1.5 py-0.5">Pill/Pregnancy</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(consultation.ros).map(([section, values]) => (
                  <div key={section} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 capitalize">{section}</p>
                    <div className="mt-2 space-y-2">
                      <select
                        value={values.status}
                        onChange={(e) => handleROSChange(section, 'status', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs sm:text-sm text-slate-900"
                      >
                        <option value="unknown">Unknown</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                      <textarea
                        value={values.comments || ''}
                        onChange={(e) => handleROSChange(section, 'comments', e.target.value)}
                        placeholder="Comments..."
                        rows={2}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs sm:text-sm text-slate-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* === P - Past Medical History (WITH SAVE) === */}
        <section className="rounded-2xl border border-orange-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Past Medical History"
            subtitle="Medical Conditions & Surgeries"
            icon={UserCircle}
            expanded={expandedSections.pmh}
            onToggle={() => toggleSection('pmh')}
            onSave={handleSavePMH}
            isSaving={isSavingSection.pmh}
          />
          {expandedSections.pmh && (
            <div className="mt-4 grid gap-3">
              <FormTextarea
                label="Medical Conditions"
                value={consultation.pastMedicalHistory.conditions}
                onChange={(v) => handlePMHChange('conditions', v)}
                placeholder="Diabetes, hypertension, asthma, etc."
                rows={3}
              />
              <FormTextarea
                label="Surgeries"
                value={consultation.pastMedicalHistory.surgeries}
                onChange={(v) => handlePMHChange('surgeries', v)}
                placeholder="Previous operations and procedures"
                rows={3}
              />
              <FormTextarea
                label="Hospitalizations"
                value={consultation.pastMedicalHistory.hospitalizations}
                onChange={(v) => handlePMHChange('hospitalizations', v)}
                placeholder="Previous hospital admissions"
                rows={3}
              />
              <FormTextarea
                label="Other History"
                value={consultation.pastMedicalHistory.otherHistory}
                onChange={(v) => handlePMHChange('otherHistory', v)}
                placeholder="Any other relevant medical history"
                rows={2}
              />
            </div>
          )}
        </section>

        {/* === F - Family History (WITH SAVE) === */}
        <section className="rounded-2xl border border-yellow-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Family History"
            subtitle="Genetic & Familial Risk Factors"
            icon={Users}
            expanded={expandedSections.familyHistory}
            onToggle={() => toggleSection('familyHistory')}
            onSave={handleSaveFamilyHistory}
            isSaving={isSavingSection.familyHistory}
          />
          {expandedSections.familyHistory && (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-3 space-y-3">
                  <h3 className="text-xs font-semibold text-slate-900">Mother</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={consultation.familyHistory.mother.alive}
                      onChange={(e) => handleFamilyHistoryChange('mother', 'alive', e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <span className="text-xs text-slate-600">Alive</span>
                  </div>
                  <FormInput
                    label="Age"
                    value={consultation.familyHistory.mother.age}
                    onChange={(v) => handleFamilyHistoryChange('mother', 'age', v)}
                    placeholder="Age or age at death"
                  />
                  <FormTextarea
                    label="Conditions"
                    value={consultation.familyHistory.mother.conditions}
                    onChange={(v) => handleFamilyHistoryChange('mother', 'conditions', v)}
                    placeholder="Medical conditions"
                    rows={2}
                  />
                  {!consultation.familyHistory.mother.alive && (
                    <FormInput
                      label="Cause of Death"
                      value={consultation.familyHistory.mother.causeOfDeath}
                      onChange={(v) => handleFamilyHistoryChange('mother', 'causeOfDeath', v)}
                      placeholder="Cause of death"
                    />
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 p-3 space-y-3">
                  <h3 className="text-xs font-semibold text-slate-900">Father</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={consultation.familyHistory.father.alive}
                      onChange={(e) => handleFamilyHistoryChange('father', 'alive', e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <span className="text-xs text-slate-600">Alive</span>
                  </div>
                  <FormInput
                    label="Age"
                    value={consultation.familyHistory.father.age}
                    onChange={(v) => handleFamilyHistoryChange('father', 'age', v)}
                    placeholder="Age or age at death"
                  />
                  <FormTextarea
                    label="Conditions"
                    value={consultation.familyHistory.father.conditions}
                    onChange={(v) => handleFamilyHistoryChange('father', 'conditions', v)}
                    placeholder="Medical conditions"
                    rows={2}
                  />
                  {!consultation.familyHistory.father.alive && (
                    <FormInput
                      label="Cause of Death"
                      value={consultation.familyHistory.father.causeOfDeath}
                      onChange={(v) => handleFamilyHistoryChange('father', 'causeOfDeath', v)}
                      placeholder="Cause of death"
                    />
                  )}
                </div>
              </div>

              {/* Siblings */}
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-xs font-semibold text-slate-900">Siblings</h3>
                  <button
                    onClick={handleAddSibling}
                    className="flex items-center gap-1 rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-medium text-white hover:bg-slate-700"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input
                    value={newSiblingName}
                    onChange={(e) => setNewSiblingName(e.target.value)}
                    placeholder="Name"
                    className="flex-1 min-w-[80px] rounded border border-slate-200 bg-white px-2 py-1 text-xs"
                  />
                  <input
                    value={newSiblingConditions}
                    onChange={(e) => setNewSiblingConditions(e.target.value)}
                    placeholder="Conditions"
                    className="flex-1 min-w-[80px] rounded border border-slate-200 bg-white px-2 py-1 text-xs"
                  />
                </div>
                <div className="mt-2 space-y-2">
                  {consultation.familyHistory.siblings.map((sibling) => (
                    <div key={sibling.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                      <span className="text-xs font-medium text-slate-900 min-w-[80px]">{sibling.name || 'Unnamed'}</span>
                      <span className="text-xs text-slate-600 flex-1">{sibling.conditions || 'No conditions'}</span>
                      <button
                        onClick={() => handleRemoveSibling(sibling.id)}
                        className="rounded p-1 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {consultation.familyHistory.siblings.length === 0 && (
                    <p className="text-xs text-slate-500">No siblings added.</p>
                  )}
                </div>
              </div>

              {/* Relevant Conditions */}
              <div className="rounded-xl border border-slate-200 p-3">
                <h3 className="text-xs font-semibold text-slate-900">Relevant Family Conditions</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <input
                    value={newRelevantCondition}
                    onChange={(e) => setNewRelevantCondition(e.target.value)}
                    placeholder="Condition"
                    className="flex-1 min-w-[120px] rounded border border-slate-200 bg-white px-2 py-1 text-xs"
                  />
                  <button
                    onClick={handleAddRelevantCondition}
                    className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {consultation.familyHistory.relevantConditions.map((condition) => (
                    <span key={condition} className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                      {condition}
                      <button
                        onClick={() => handleRemoveRelevantCondition(condition)}
                        className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* === D - Drug History (WITH SAVE) === */}
        <section className="rounded-2xl border border-red-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Drug History"
            subtitle="Medications & Allergies"
            icon={Pill}
            expanded={expandedSections.drugHistory}
            onToggle={() => toggleSection('drugHistory')}
            onSave={handleSaveDrugHistory}
            isSaving={isSavingSection.drugHistory}
          />
          {expandedSections.drugHistory && (
            <div className="mt-4 space-y-4">
              {/* Medications */}
              <div className="rounded-xl border border-slate-200 p-3">
                <h3 className="text-xs font-semibold text-slate-900">Current Medications</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <FormInput
                    label="Medication"
                    value={newMedication.name}
                    onChange={(v) => setNewMedication(prev => ({ ...prev, name: v }))}
                    placeholder="Medication name"
                  />
                  <FormInput
                    label="Dosage"
                    value={newMedication.dosage}
                    onChange={(v) => setNewMedication(prev => ({ ...prev, dosage: v }))}
                    placeholder="e.g., 500mg"
                  />
                  <FormInput
                    label="Frequency"
                    value={newMedication.frequency}
                    onChange={(v) => setNewMedication(prev => ({ ...prev, frequency: v }))}
                    placeholder="e.g., Twice daily"
                  />
                  <FormInput
                    label="Duration"
                    value={newMedication.duration}
                    onChange={(v) => setNewMedication(prev => ({ ...prev, duration: v }))}
                    placeholder="e.g., 7 days"
                  />
                  <FormInput
                    label="Quantity"
                    value={newMedication.quantity}
                    onChange={(v) => setNewMedication(prev => ({ ...prev, quantity: v }))}
                    placeholder="Number of tablets"
                  />
                  <FormSelect
                    label="Route"
                    value={newMedication.route}
                    onChange={(v) => setNewMedication(prev => ({ ...prev, route: v }))}
                    options={[
                      { value: 'oral', label: 'Oral' },
                      { value: 'iv', label: 'IV' },
                      { value: 'im', label: 'IM' },
                      { value: 'sc', label: 'SC' },
                      { value: 'topical', label: 'Topical' },
                      { value: 'inhalation', label: 'Inhalation' }
                    ]}
                  />
                </div>
                <FormInput
                  label="Reason"
                  value={newMedication.reason}
                  onChange={(v) => setNewMedication(prev => ({ ...prev, reason: v }))}
                  placeholder="Why is this medication being prescribed?"
                  className="mt-2"
                />
                <button
                  onClick={handleAddMedication}
                  className="mt-3 flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Medication
                </button>

                <div className="mt-3 space-y-1.5 max-h-[200px] overflow-y-auto">
                  {consultation.medications.map((med) => (
                    <div key={med.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900">{med.name}</p>
                        <p className="text-[10px] text-slate-600">{med.dosage} • {med.frequency} • {med.route}</p>
                        {med.reason && <p className="text-[10px] text-slate-500">Reason: {med.reason}</p>}
                      </div>
                      <button
                        onClick={() => handleRemoveMedication(med.id)}
                        className="rounded p-1 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {consultation.medications.length === 0 && (
                    <p className="text-xs text-slate-500">No medications added.</p>
                  )}
                </div>
              </div>

              {/* Allergies */}
              <div className="rounded-xl border border-slate-200 p-3">
                <h3 className="text-xs font-semibold text-slate-900">Allergies</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <FormInput
                    label="Allergen"
                    value={newAllergy.substance}
                    onChange={(v) => setNewAllergy(prev => ({ ...prev, substance: v }))}
                    placeholder="e.g., Penicillin, Peanuts"
                  />
                  <FormSelect
                    label="Type"
                    value={newAllergy.type}
                    onChange={(v) => setNewAllergy(prev => ({ ...prev, type: v }))}
                    options={[
                      { value: 'Drug', label: 'Drug' },
                      { value: 'Food', label: 'Food' },
                      { value: 'Environmental', label: 'Environmental' },
                      { value: 'Other', label: 'Other' }
                    ]}
                  />
                  <FormSelect
                    label="Severity"
                    value={newAllergy.severity}
                    onChange={(v) => setNewAllergy(prev => ({ ...prev, severity: v }))}
                    options={[
                      { value: 'Mild', label: 'Mild' },
                      { value: 'Moderate', label: 'Moderate' },
                      { value: 'Severe', label: 'Severe' },
                      { value: 'Life-Threatening', label: 'Life-Threatening' }
                    ]}
                  />
                  <FormInput
                    label="Reaction Type"
                    value={newAllergy.reactionType}
                    onChange={(v) => setNewAllergy(prev => ({ ...prev, reactionType: v }))}
                    placeholder="e.g., Rash, Anaphylaxis"
                  />
                </div>
                <FormTextarea
                  label="Notes"
                  value={newAllergy.notes}
                  onChange={(v) => setNewAllergy(prev => ({ ...prev, notes: v }))}
                  placeholder="Additional details"
                  rows={2}
                  className="mt-2"
                />
                <button
                  onClick={handleAddAllergy}
                  className="mt-3 flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Allergy
                </button>

                <div className="mt-3 space-y-1.5 max-h-[200px] overflow-y-auto">
                  {consultation.allergies.map((allergy) => (
                    <div key={allergy.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50/50 p-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-red-900">{allergy.substance}</p>
                          <span className="rounded-full bg-red-200 px-1.5 py-0.5 text-[8px] font-medium text-red-700">
                            {allergy.severity}
                          </span>
                        </div>
                        <p className="text-[10px] text-red-700">{allergy.type} • {allergy.reactionType || 'No reaction noted'}</p>
                        {allergy.notes && <p className="text-[10px] text-red-600">{allergy.notes}</p>}
                      </div>
                      <button
                        onClick={() => handleRemoveAllergy(allergy.id)}
                        className="rounded p-1 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {consultation.allergies.length === 0 && (
                    <p className="text-xs text-slate-500">No allergies recorded.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* === S - Social History (WITH SAVE) === */}
        <section className="rounded-2xl border border-teal-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Social History"
            subtitle="Lifestyle & Context"
            icon={Home}
            expanded={expandedSections.socialHistory}
            onToggle={() => toggleSection('socialHistory')}
            onSave={handleSaveSocialHistory}
            isSaving={isSavingSection.socialHistory}
          />
          {expandedSections.socialHistory && (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <FormInput
                  label="Occupation"
                  value={consultation.socialHistory.occupation}
                  onChange={(v) => handleSocialHistoryChange('occupation', v)}
                  placeholder="What do you do for work?"
                />
                <FormInput
                  label="Living Situation"
                  value={consultation.socialHistory.livingSituation}
                  onChange={(v) => handleSocialHistoryChange('livingSituation', v)}
                  placeholder="e.g., Lives alone, with family"
                />
                <FormSelect
                  label="Marital Status"
                  value={consultation.socialHistory.maritalStatus}
                  onChange={(v) => handleSocialHistoryChange('maritalStatus', v)}
                  options={[
                    { value: 'single', label: 'Single' },
                    { value: 'married', label: 'Married' },
                    { value: 'divorced', label: 'Divorced' },
                    { value: 'widowed', label: 'Widowed' },
                    { value: 'separated', label: 'Separated' }
                  ]}
                />
                <FormInput
                  label="Children"
                  value={consultation.socialHistory.children}
                  onChange={(v) => handleSocialHistoryChange('children', v)}
                  placeholder="Number of children"
                />
                <FormSelect
                  label="Independence"
                  value={consultation.socialHistory.independence}
                  onChange={(v) => handleSocialHistoryChange('independence', v)}
                  options={[
                    { value: 'independent', label: 'Independent' },
                    { value: 'assisted', label: 'Assisted Living' },
                    { value: 'dependent', label: 'Dependent' }
                  ]}
                />
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <h3 className="text-xs font-semibold text-slate-900">Smoking</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <FormSelect
                    label="Status"
                    value={consultation.socialHistory.smoking.status}
                    onChange={(v) => handleSocialHistorySubsectionChange('smoking', 'status', v)}
                    options={[
                      { value: 'never', label: 'Never' },
                      { value: 'former', label: 'Former' },
                      { value: 'current', label: 'Current' }
                    ]}
                  />
                  <FormInput
                    label="Pack Years"
                    value={consultation.socialHistory.smoking.packYears}
                    onChange={(v) => handleSocialHistorySubsectionChange('smoking', 'packYears', v)}
                    placeholder="e.g., 10 pack-years"
                  />
                  <FormInput
                    label="Quit Date"
                    value={consultation.socialHistory.smoking.quitDate}
                    onChange={(v) => handleSocialHistorySubsectionChange('smoking', 'quitDate', v)}
                    placeholder="When did you quit?"
                    type="date"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <h3 className="text-xs font-semibold text-slate-900">Alcohol</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <FormSelect
                    label="Status"
                    value={consultation.socialHistory.alcohol.status}
                    onChange={(v) => handleSocialHistorySubsectionChange('alcohol', 'status', v)}
                    options={[
                      { value: 'never', label: 'Never' },
                      { value: 'occasional', label: 'Occasional' },
                      { value: 'moderate', label: 'Moderate' },
                      { value: 'heavy', label: 'Heavy' }
                    ]}
                  />
                  <FormInput
                    label="Units per Week"
                    value={consultation.socialHistory.alcohol.unitsPerWeek}
                    onChange={(v) => handleSocialHistorySubsectionChange('alcohol', 'unitsPerWeek', v)}
                    placeholder="Number of units"
                    type="number"
                  />
                  <FormInput
                    label="Duration"
                    value={consultation.socialHistory.alcohol.duration}
                    onChange={(v) => handleSocialHistorySubsectionChange('alcohol', 'duration', v)}
                    placeholder="e.g., 10 years"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <h3 className="text-xs font-semibold text-slate-900">Recreational Drug Use</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <FormSelect
                    label="Status"
                    value={consultation.socialHistory.recreationalDrugs.status}
                    onChange={(v) => handleSocialHistorySubsectionChange('recreationalDrugs', 'status', v)}
                    options={[
                      { value: 'never', label: 'Never' },
                      { value: 'former', label: 'Former' },
                      { value: 'current', label: 'Current' }
                    ]}
                  />
                  <FormInput
                    label="Substances"
                    value={consultation.socialHistory.recreationalDrugs.substances}
                    onChange={(v) => handleSocialHistorySubsectionChange('recreationalDrugs', 'substances', v)}
                    placeholder="e.g., Cannabis, Cocaine"
                  />
                  <FormInput
                    label="Frequency"
                    value={consultation.socialHistory.recreationalDrugs.frequency}
                    onChange={(v) => handleSocialHistorySubsectionChange('recreationalDrugs', 'frequency', v)}
                    placeholder="e.g., Weekly, Daily"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* === Assessment (WITH SAVE) === */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Assessment"
            subtitle="Clinical Assessment"
            icon={Stethoscope}
            expanded={expandedSections.assessment}
            onToggle={() => toggleSection('assessment')}
            onSave={handleSaveAssessment}
            isSaving={isSavingSection.assessment}
          />
          {expandedSections.assessment && (
            <div className="mt-4 grid gap-3">
              <FormTextarea
                label="Clinical Impression"
                value={consultation.assessment.clinicalImpression}
                onChange={(v) => dispatch(updateAssessment({ field: 'clinicalImpression', value: v }))}
                placeholder="Overall clinical assessment"
                rows={3}
              />
              <FormInput
                label="Primary Diagnosis"
                value={consultation.assessment.primaryDiagnosis}
                onChange={(v) => dispatch(updateAssessment({ field: 'primaryDiagnosis', value: v }))}
                placeholder="Main diagnosis"
              />
              <FormInput
                label="Secondary Diagnosis"
                value={consultation.assessment.secondaryDiagnosis}
                onChange={(v) => dispatch(updateAssessment({ field: 'secondaryDiagnosis', value: v }))}
                placeholder="Other diagnoses"
              />
              <FormTextarea
                label="Differential Diagnosis"
                value={consultation.assessment.differentialDiagnosis}
                onChange={(v) => dispatch(updateAssessment({ field: 'differentialDiagnosis', value: v }))}
                placeholder="List of differential diagnoses with reasoning"
                rows={4}
              />
            </div>
          )}
        </section>

        {/* === Treatment Plan (WITH SAVE) === */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Treatment Plan"
            subtitle="Management Plan"
            icon={Edit3}
            expanded={expandedSections.plan}
            onToggle={() => toggleSection('plan')}
            onSave={handleSaveTreatmentPlan}
            isSaving={isSavingSection.plan}
          />
          {expandedSections.plan && (
            <div className="mt-4 grid gap-3">
              <FormTextarea
                label="Management Plan"
                value={consultation.treatmentPlan.managementPlan}
                onChange={(v) => dispatch(updateTreatmentPlan({ field: 'managementPlan', value: v }))}
                placeholder="Overall management strategy"
                rows={3}
              />
              <FormTextarea
                label="Medications"
                value={consultation.treatmentPlan.medications}
                onChange={(v) => dispatch(updateTreatmentPlan({ field: 'medications', value: v }))}
                placeholder="Medication plan"
                rows={3}
              />
              <FormTextarea
                label="Lifestyle Advice"
                value={consultation.treatmentPlan.lifestyleAdvice}
                onChange={(v) => dispatch(updateTreatmentPlan({ field: 'lifestyleAdvice', value: v }))}
                placeholder="Lifestyle recommendations"
                rows={2}
              />
              <FormTextarea
                label="Dietary Advice"
                value={consultation.treatmentPlan.dietaryAdvice}
                onChange={(v) => dispatch(updateTreatmentPlan({ field: 'dietaryAdvice', value: v }))}
                placeholder="Dietary recommendations"
                rows={2}
              />
              <FormTextarea
                label="Monitoring Plan"
                value={consultation.treatmentPlan.monitoringPlan}
                onChange={(v) => dispatch(updateTreatmentPlan({ field: 'monitoringPlan', value: v }))}
                placeholder="Follow-up and monitoring schedule"
                rows={2}
              />
              <FormTextarea
                label="Safety Net Advice"
                value={consultation.treatmentPlan.safetyNetAdvice}
                onChange={(v) => dispatch(updateTreatmentPlan({ field: 'safetyNetAdvice', value: v }))}
                placeholder="When to seek urgent care"
                rows={2}
              />
            </div>
          )}
        </section>

        {/* === Physical Exam (WITH SAVE) === */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Physical Exam"
            subtitle="Examination Findings"
            icon={Eye}
            expanded={expandedSections.physicalExam}
            onToggle={() => toggleSection('physicalExam')}
            onSave={handleSavePhysicalExam}
            isSaving={isSavingSection.physicalExam}
          />
          {expandedSections.physicalExam && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <FormTextarea
                label="General Appearance"
                value={consultation.physicalExam.generalAppearance}
                onChange={(v) => dispatch(updatePhysicalExam({ field: 'generalAppearance', value: v }))}
                placeholder="Overall appearance"
                rows={2}
              />
              <FormTextarea
                label="Vital Signs"
                value={consultation.physicalExam.vitalSigns}
                onChange={(v) => dispatch(updatePhysicalExam({ field: 'vitalSigns', value: v }))}
                placeholder="BP, HR, RR, Temp, SpO2"
                rows={2}
              />
              <FormTextarea
                label="Cardiovascular"
                value={consultation.physicalExam.cardiovascular}
                onChange={(v) => dispatch(updatePhysicalExam({ field: 'cardiovascular', value: v }))}
                placeholder="Heart sounds, murmurs, JVP"
                rows={2}
              />
              <FormTextarea
                label="Respiratory"
                value={consultation.physicalExam.respiratory}
                onChange={(v) => dispatch(updatePhysicalExam({ field: 'respiratory', value: v }))}
                placeholder="Breath sounds, work of breathing"
                rows={2}
              />
              <FormTextarea
                label="Abdominal"
                value={consultation.physicalExam.abdominal}
                onChange={(v) => dispatch(updatePhysicalExam({ field: 'abdominal', value: v }))}
                placeholder="Abdomen examination"
                rows={2}
              />
              <FormTextarea
                label="Neurological"
                value={consultation.physicalExam.neurological}
                onChange={(v) => dispatch(updatePhysicalExam({ field: 'neurological', value: v }))}
                placeholder="CNS examination"
                rows={2}
              />
              <FormTextarea
                label="Musculoskeletal"
                value={consultation.physicalExam.musculoskeletal}
                onChange={(v) => dispatch(updatePhysicalExam({ field: 'musculoskeletal', value: v }))}
                placeholder="Joint and muscle examination"
                rows={2}
              />
              <FormTextarea
                label="ENT"
                value={consultation.physicalExam.ent}
                onChange={(v) => dispatch(updatePhysicalExam({ field: 'ent', value: v }))}
                placeholder="Ear, nose, throat examination"
                rows={2}
              />
              <FormTextarea
                label="Eye"
                value={consultation.physicalExam.eye}
                onChange={(v) => dispatch(updatePhysicalExam({ field: 'eye', value: v }))}
                placeholder="Eye examination"
                rows={2}
              />
              <FormTextarea
                label="Skin"
                value={consultation.physicalExam.skin}
                onChange={(v) => dispatch(updatePhysicalExam({ field: 'skin', value: v }))}
                placeholder="Skin examination"
                rows={2}
              />
              <div className="sm:col-span-2">
                <FormTextarea
                  label="Mental State"
                  value={consultation.physicalExam.mentalState}
                  onChange={(v) => dispatch(updatePhysicalExam({ field: 'mentalState', value: v }))}
                  placeholder="Mental status examination"
                  rows={2}
                />
              </div>
            </div>
          )}
        </section>

        {/* === Disposition & Follow-up (WITH SAVE) === */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Disposition & Follow-up"
            subtitle="Plan & Next Steps"
            icon={Calendar}
            expanded={expandedSections.disposition}
            onToggle={() => toggleSection('disposition')}
            onSave={handleSaveDisposition}
            isSaving={isSavingSection.disposition}
          />
          {expandedSections.disposition && (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <FormSelect
                  label="Disposition Type"
                  value={consultation.disposition.type}
                  onChange={(v) => dispatch(updateDisposition({ field: 'type', value: v }))}
                  options={[
                    { value: 'Outpatient', label: 'Outpatient' },
                    { value: 'Inpatient', label: 'Inpatient' },
                    { value: 'Observation', label: 'Observation' },
                    { value: 'Referral', label: 'Referral' }
                  ]}
                />
                <FormSelect
                  label="Admission Required"
                  value={consultation.disposition.admission}
                  onChange={(v) => dispatch(updateDisposition({ field: 'admission', value: v }))}
                  options={[
                    { value: 'No', label: 'No' },
                    { value: 'Yes', label: 'Yes' }
                  ]}
                />
              </div>
              <FormTextarea
                label="Disposition Reason"
                value={consultation.disposition.reason}
                onChange={(v) => dispatch(updateDisposition({ field: 'reason', value: v }))}
                placeholder="Reason for disposition decision"
                rows={2}
              />

              <div className="border-t border-slate-200 pt-4 mt-4">
                <h3 className="text-xs font-semibold text-slate-900 mb-3">Follow-up</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormInput
                    label="Follow-up Date"
                    value={consultation.followUp.date}
                    onChange={(v) => dispatch(updateFollowUp({ field: 'date', value: v }))}
                    placeholder="mm/dd/yyyy"
                    type="date"
                  />
                  <FormInput
                    label="Follow-up Time"
                    value={consultation.followUp.time}
                    onChange={(v) => dispatch(updateFollowUp({ field: 'time', value: v }))}
                    placeholder="HH:MM"
                    type="time"
                  />
                </div>
                <FormTextarea
                  label="Follow-up Reason"
                  value={consultation.followUp.reason}
                  onChange={(v) => dispatch(updateFollowUp({ field: 'reason', value: v }))}
                  placeholder="Reason for follow-up"
                  rows={2}
                  className="mt-3"
                />
              </div>
            </div>
          )}
        </section>

        {/* === ICD-10 === */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Diagnosis & Coding"
            subtitle="ICD-10 Selection"
            icon={File}
            expanded={expandedSections.orders}
            onToggle={() => toggleSection('orders')}
            showSave={false}
          />
          {expandedSections.orders && (
            <div className="mt-4">
              <div className="flex gap-2 mb-3">
                <input
                  value={consultation.icd10.searchTerm}
                  onChange={(e) => {
                    dispatch(updateICD10SearchTerm(e.target.value));
                    handleSearchICD10(e.target.value);
                  }}
                  placeholder="Search ICD-10 codes..."
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  onClick={() => handleSearchICD10(consultation.icd10.searchTerm)}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {icd10Database.slice(0, 10).map((item) => (
                    <div key={item.code} className="flex items-center justify-between rounded-lg border border-slate-200 p-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900">{item.code}</p>
                        <p className="text-[10px] text-slate-600">{item.description}</p>
                      </div>
                      <button
                        onClick={() => handleAddICD10(item)}
                        className="rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-medium text-white hover:bg-slate-700"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  <p className="text-xs font-medium text-slate-700">Selected Codes</p>
                  {consultation.icd10.selectedCodes.map((code) => (
                    <div key={code.code} className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-green-900">{code.code}</p>
                        <p className="text-[10px] text-green-700">{code.description}</p>
                      </div>
                      <button
                        onClick={() => dispatch(removeICD10Code(code.code))}
                        className="rounded p-1 text-red-600 hover:bg-red-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {consultation.icd10.selectedCodes.length === 0 && (
                    <p className="text-xs text-slate-500">No codes selected.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* === Billing === */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <SectionHeader
            title="Billing"
            subtitle="Charges & Insurance"
            icon={BarChart3}
            expanded={expandedSections.billing}
            onToggle={() => toggleSection('billing')}
            showSave={false}
          />
          {expandedSections.billing && (
            <div className="mt-4 space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <FormInput
                  label="Item"
                  value={chargeItem.item}
                  onChange={(v) => setChargeItem(prev => ({ ...prev, item: v }))}
                  placeholder="Service or item"
                />
                <FormInput
                  label="Amount"
                  value={chargeItem.amount}
                  onChange={(v) => setChargeItem(prev => ({ ...prev, amount: v }))}
                  placeholder="Amount"
                  type="number"
                />
              </div>
              <button
                onClick={handleBillingCharge}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Charge
              </button>

              <div className="rounded-xl border border-slate-200 p-3">
                {consultation.billing.charges.map((charge) => (
                  <div key={charge.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-700">{charge.item}</span>
                    <span className="text-sm font-semibold text-slate-900">₦{charge.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200">
                  <span className="text-sm font-semibold text-slate-900">Total</span>
                  <span className="text-sm font-bold text-slate-900">₦{consultation.billing.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* === Signature === */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500">Sign-off</p>
                <h2 className="text-sm sm:text-base font-semibold text-slate-900">Electronic Signature</h2>
              </div>
            </div>
            <button
              onClick={handleSignOff}
              disabled={isSaving || !visitId}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              Sign Now
            </button>
          </div>
          <div className="mt-3 space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs sm:text-sm text-slate-700">
              Doctor: <span className="font-semibold text-slate-900">
                {localStorage.getItem('userFullName') || localStorage.getItem('userName') || consultation.signature.doctorName || 'Not signed'}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-slate-700">
              Status: <span className={`font-semibold ${consultation.signature.signed ? 'text-green-600' : 'text-amber-600'}`}>
                {consultation.signature.signed ? '✓ Signed' : 'Pending'}
              </span>
            </p>
            {consultation.signature.signed && consultation.signature.signedAt && (
              <p className="text-[10px] sm:text-xs text-slate-500">
                Signed at {new Date(consultation.signature.signedAt).toLocaleString()}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Patient Details Modal */}
      {showPatientDetails && selectedPatientForDetails && (
        <PatientMedicalDetails 
          patient={selectedPatientForDetails} 
          onClose={() => {
            setShowPatientDetails(false);
            setSelectedPatientForDetails(null);
          }}
        />
      )}
    </>
  );
};

export default ConsultationV2;