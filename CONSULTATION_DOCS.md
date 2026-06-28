# Consultation Page Documentation

## Overview
The Consultation page (`src/pages/Consultation.jsx`) is a comprehensive clinical encounter management interface for healthcare professionals to document patient consultations, prescriptions, lab requests, and vital signs.

## Access
- Navigate to `/consultation` in the application
- Route is protected - requires authentication
- Also accessible via `/consultation-legacy` route for backward compatibility

## Features

### Patient Selection
- **Dropdown Selector**: Choose from pre-loaded patient directory (Rasheedat Sanni-Idris, Emmanuel Okafor, Bolanle Adewale)
- **Patient Information Display**: Shows demographics, health plan, consultant, and contact details
- Data persists per patient selection

### Vital Signs Management
- **View Mode**: Displays temperature, weight, blood pressure, heart rate, SpO₂, BMI, respiratory rate, pain score
- **Edit Mode**: Click "Update vitals" to modify all vital parameters inline
- **Vitals History**: Tracks previous readings with trend indicators
- **Clinical Alerts**: Automatic warnings for abnormal values:
  - Blood pressure > 140/90 mmHg
  - Temperature > 38°C or < 36°C
  - Heart rate > 100 or < 60 BPM

### Prescriptions
- **Add Prescription**: Click "Add drug" to open form
- **Medication Database**: Auto-suggestions with drug categories, interactions, and side effects
- **Fields**: Drug name, dosage, quantity, instruction, refills
- **Management**: Edit, remove, and search prescriptions
- **Visual Indicators**: Color-coded category badges, interaction warnings

**Supported Medications**:
| Drug | Category | Interactions | Max Dosage |
|------|----------|--------------|------------|
| Neurovite Forte | Vitamin | Warfarin | 3 tablets/day |
| Prednisolone | Steroid | Aspirin, Warfarin | 60 mg/day |
| Amoxicillin | Antibiotic | Probenecid | 3000 mg/day |
| Lisinopril | ACE Inhibitor | Diuretics, NSAIDs | 40 mg/day |

### Lab Requests
- **Add Request**: Click "Add request" to create lab orders
- **Priority Levels**: Low, Normal, High, Urgent
- **Status Tracking**: Pending, In Progress, Completed, Cancelled
- **Inline Status Updates**: Select dropdown to update status

### Assessment & Notes
- **Diagnosis Field**: Primary diagnosis (required for save)
- **Follow-up Plan**: Next visit/review plan
- **Doctor Notes**: Rich text area for clinical findings, differential diagnoses, management plans
- **Word/Character Counter**: Bottom-right word count display

### Quick Actions
- **Save Draft** (Ctrl+D): Saves as draft without validation
- **Save Consultation** (Ctrl+S): Validates and saves completed encounter
- **Print** (Ctrl+P shortcut): Print-optimized view
- **Export**: Downloads consultation data as JSON file

### Activity Log
- Automatic audit trail of all actions
- Timestamp, action description, and user recording
- Persists with consultation data

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Ctrl+S | Save Consultation |
| Ctrl+D | Save Draft |
| Escape | Close open forms/editors |

## Layout
- **Responsive Grid**: 3-column on desktop, mobile tabs for smaller screens
- **Expandable Sections**: Vitals, prescriptions, history, labs can be collapsed/expanded
- **Print-Friendly**: Dedicated print styles hide interactive elements

## Data Persistence
- Auto-saves to `localStorage` under key `consultationData`
- Survives page refresh/reload
- Clears when new patient is selected (shows confirmation in activity log)

## Validation Rules
Before saving consultation, these fields are required:
1. Diagnosis
2. Doctor notes
3. At least one prescription
4. Temperature
5. Blood pressure

## Status Indicators
- **In Review**: Default state
- **Draft**: Saved as draft
- **Completed**: Successfully saved consultation

## Technical Notes
- Uses `useReducer` for state management
- React hooks: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`
- No external dependencies beyond lucide-react icons
- Pure client-side implementation (no API integration in this legacy version)