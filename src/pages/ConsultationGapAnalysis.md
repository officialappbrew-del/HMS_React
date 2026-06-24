# Consultation Workflow Gap Analysis

## Current State
The existing `src/pages/Consultation.jsx` component is a single-page consultation form with:
- basic patient profile and vitals display
- prescription list and add/remove capability
- lab request entry
- diagnosis and follow-up fields
- status save/draft actions
- clinical alert checks for BP, temperature, heart rate
- localStorage persistence

## Missing Clinical Workflow Elements
The current page is missing or only partially supports:

- Full patient snapshot with MRN, DOB, genotype, insurance, emergency contact, risk flags, chronic conditions, recent admissions, outstanding bills
- Consultation encounter metadata: encounter number, encounter type, consultation status, department, telemedicine/referral support
- Structured HPI documentation in SOAP-friendly format
- Review of Systems (ROS) sections for multiple organ systems
- Past medical history, family history, social history, addictions, lifestyle, travel
- Full medication reconciliation with current/previous/stopped, dosage, frequency, start/end dates, reason, drug interaction and allergy detection
- Allergy management engine with severity, reaction type and critical blocks
- Structured physical exam sections and templates for exam findings
- Clinical assessment with problem list, clinical impression, differential, primary/secondary/working/final diagnosis, reasoning notes
- ICD-10 search, favorites, recent diagnoses, multiple-coded diagnoses
- Clinical decision support beyond basic vitals alerts
- Orders management for lab, radiology, procedures, referrals, nursing orders and order lifecycle
- Laboratory and radiology modules for results, trends, reporting and sign-off
- Prescription workflow with drug search, dose calculator, route, frequency, duration, quantity, refills, generic alternatives
- Procedure documentation, referral tracking, treatment plan and disposition capture
- Follow-up scheduling and reminder generation
- Medical certificate generation and discharge summary intent
- Electronic signature and record locking after sign-off
- Audit trail of create/modify/view/sign actions
- Billing integration to derive charges automatically
- Clinical dashboard summarizing active problems, pending orders, alerts, medication summary, risk indicators
- Role-based, offline draft save, print-friendly and accessible form structure

## Architectural Recommendations

- Create a dedicated Redux slice `consultation` to manage the encounter lifecycle and enable state sharing across pages.
- Keep the original `Consultation.jsx` as a fallback while routing `/consultation` to the new `ConsultationV2.jsx` module.
- Use modular React section components inside `ConsultationV2.jsx` to separate patient snapshot, header, HPI, ROS, medication reconciliation, allergy management, orders, assessment, treatment plan, disposition, follow-up, billing, signature, and audit trail.
- Implement client-side clinical rules for vitals alerts, allergy conflict blocking, drug interaction warnings, and high-risk flagging.
- Persist draft state to `localStorage` and support save/draft workflow on every significant action.
- Keep the UI responsive with desktop two-column layout and collapsible mobile sections.
- Use a single store-backed consultation object and compute derived dashboard metrics on render.

## Implementation Plan

1. Add `consultationSlice.js` to `src/features/` and wire it into `src/store.js`.
2. Create `ConsultationV2.jsx` in `src/pages/` with the complete consult workflow.
3. Update `src/App.jsx` to route `/consultation` to `ConsultationV2` instead of the legacy page.
4. Implement the patient snapshot panel and consultation header with all required encounter metadata.
5. Add structured HPI, ROS and past history sections.
6. Add medication reconciliation, allergy management, and interaction/allergy checking.
7. Add physical exam module, clinical assessment and ICD-10 coding sections.
8. Add order entry sections for lab, radiology, procedures and referrals.
9. Add treatment plan, disposition, follow-up scheduling, billing summary, signature and audit trail.
10. Add clinical dashboard and alert engine for risk indicators and outstanding tasks.
11. Validate form requirements, preserve existing clinical functionality, and ensure the module can autosave as draft.

## Notes
- This implementation is designed as a hospital-grade consultation workflow bridge between existing app state and a future API-enabled EMR module.
- The goal is to extend the app without removing current features and to provide the required lifecycle coverage for outpatient, telemedicine, emergency, and inpatient consultation use cases.
