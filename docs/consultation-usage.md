# Consultation Page Usage Guide

## Purpose
The `ConsultationV2` page is designed to work with an active patient visit. It loads visit details, consultation notes, prescriptions, and allows clinicians to save or close a consultation for a specific patient visit.

## Required visit context
The consultation page requires a `visit` ID to be provided in one of these ways:

- URL query parameter: `/consultation?visit=<visitId>`
- React navigation state: `location.state?.visitId`

If the page is opened without a visit ID, it will display a message:

> No visit selected. Please open consultation from a patient visit record.

## How to open consultation correctly

### Recommended flow
1. Open the patient visit record from the app’s visit workflow.
2. Use the link or button that launches the consultation page for that visit.
3. The application should navigate to: `/consultation?visit=<visitId>`.

### Manual URL entry
If you need to open the page manually, use the route:

```
/consultation?visit=<visitId>
```

Replace `<visitId>` with the actual visit ID from the backend.

## New fallback behavior
If no visit ID is provided, the page now attempts to load recent visits and presents them as selectable options. This makes it easier to recover from direct navigation to `/consultation`.

## What the page loads
When a visit ID is present, the page loads:

- Patient visit details from `/api/v1/patients/visits/<visitId>/`
- Consultation notes from `/api/v1/clinical/consultation-notes/?visit=<visitId>`
- Prescriptions from `/api/v1/clinical/prescriptions/?visit=<visitId>`

## Page workflow

### 1. Review patient and encounter details
- Confirm the patient summary
- Confirm encounter date, doctor, clinic, department, and status

### 2. Complete clinical sections
- HPI (History of Present Illness)
- ROS (Review of Systems)
- Medication reconciliation
- Allergy management
- ICD-10 diagnosis coding
- Orders (laboratory, radiology, procedures, referrals)
- Treatment plan
- Disposition and follow-up
- Billing charges
- Audit trail

### 3. Save or finalize
- Click `Save Consult` to save the current consultation payload
- Click `Sign & Close` to finalize the consultation and mark the visit as closed

## Notes
- The page is not meant to be opened as a standalone route without visit context.
- If no recent visits are available, the page will ask the user to start consultation from another part of the application.
- This page relies on the backend `PatientVisit` visit object and the consultation API under `/api/v1/patients/visits/<visitId>/end_consultation/`.
