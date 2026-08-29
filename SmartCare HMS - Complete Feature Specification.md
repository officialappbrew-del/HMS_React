# SmartCare HMS — Complete Feature Specification

## What Is SmartCare HMS?

SmartCare HMS is a comprehensive Hospital Management System designed to help healthcare facilities run their daily operations smoothly and efficiently. It brings together every part of a hospital — from patient registration and doctor consultations to pharmacy dispensing, laboratory tests, billing, and staff management — into one easy-to-use platform.

The system is built with Nigerian hospitals and clinics in mind, so it supports local requirements such as NHIS insurance claims, NIN verification, NAFDAC drug regulations, and NCDC disease reporting.

---

## Who Is It For?

SmartCare HMS serves every role in a healthcare facility:

- **Hospital Administrators** — manage staff, subscriptions, settings, and platform analytics
- **Doctors** — conduct consultations, write prescriptions, request lab tests, and document clinical notes
- **Nurses** — record vital signs, manage ward rounds, track patient progress, and administer medications
- **Pharmacists** — manage drug inventory, dispense medications, and process sales
- **Laboratory Staff** — receive test orders, record results, and flag critical findings
- **Receptionists** — register patients, schedule appointments, and check in visitors
- **Accountants** — create invoices, process payments, manage insurance claims, and view financial reports
- **Patients** — access their own medical records, appointments, and lab results through a patient portal

---

## Core Modules and Features

### 1. Patient Management

The patient management module is the heart of the system. It handles everything from first registration to long-term medical history.

**Key Features:**
- **Patient Registration** — Capture full patient demographics, contact details, emergency contacts, blood group, genotype, allergies, chronic conditions, and insurance information
- **Unique Patient Identifiers** — Every patient receives a hospital number and medical record number (MRN) for easy tracking across visits
- **Patient Search** — Find patients by name, phone number, hospital number, MRN, NIN, or NHIS number
- **Duplicate Detection** — Automatically warns if a patient is already registered to avoid duplicate records
- **Patient Merge** — Safely combine duplicate patient records while keeping all historical data intact
- **Patient Journey** — View a complete timeline of every visit, consultation, prescription, lab test, and payment for any patient
- **Patient Portal** — Patients can log in to view their appointments, lab results, prescriptions, and medical documents
- **Soft Delete / Archive** — Deactivate patients without losing their history

---

### 2. Appointment & Visit Management

Manage the full lifecycle of a patient's visit from booking to discharge.

**Key Features:**
- **Appointment Scheduling** — Book, confirm, and cancel appointments with reminders
- **Visit Check-In** — Create a new visit record when a patient arrives
- **Triage** — Nurses record initial vital signs and assign a triage category
- **Consultation Workflow** — Track patients through waiting, in-consultation, awaiting lab/pharmacy, billing, and completion stages
- **Visit Disposition** — Record whether a patient is discharged, referred, admitted, or requires follow-up
- **Follow-Up Management** — Schedule and track follow-up appointments

---

### 3. Clinical Consultation & Documentation

A complete electronic documentation system for doctors and nurses.

**Key Features:**
- **Structured Consultation Notes** — Capture history, examination findings, assessment, and treatment plan in a standardized format
- **HPI / SOAP / ICE Documentation** — Support for detailed clinical note-taking including history of present illness, subjective/objective/assessment/plan, and patient ideas/concerns/expectations
- **Red-Flag Detection** — Automatically highlights dangerous symptoms (such as chest pain or bleeding) as the doctor types
- **Physical Examination** — Document systematic examination findings
- **Disposition & Follow-Up** — Record admission requirements, follow-up dates, and discharge instructions
- **Electronic Signature** — Doctors can sign and finalize notes
- **ICD-10 Code Support** — Link diagnoses to standard international disease codes

---

### 4. Prescription & Medication Management

Complete medication ordering and tracking from prescription to dispensing.

**Key Features:**
- **Digital Prescriptions** — Doctors prescribe medications with dosage, frequency, duration, route, and quantity
- **Medication History** — View a patient's complete prescription history and duplicate therapy warnings
- **Drug Interaction Checks** — Flag potentially dangerous drug combinations before dispensing
- **Prescription Status Tracking** — Track prescriptions from prescribed → dispensed → completed or cancelled
- **Current Medications** — Maintain a list of medications a patient is currently taking

---

### 5. Vital Signs & Early Warning Scores

Nurses can record and monitor patient vital signs with automated clinical risk scoring.

**Key Features:**
- **Vital Signs Entry** — Record temperature, pulse, respiratory rate, blood pressure, oxygen saturation, weight, height, pain score, blood glucose, and consciousness level
- **Automatic BMI Calculation** — Body Mass Index is calculated and categorized automatically
- **Blood Pressure Categorization** — Classify readings as normal, elevated, stage 1, stage 2, or hypertensive crisis
- **Early Warning Score (EWS)** — Automatically calculate NEWS2 scores based on vital signs to identify patients at risk of deterioration
- **Vital Sign Alerts** — Generate and track alerts for abnormal findings; nurses can acknowledge and resolve alerts

---

### 6. Pharmacy & Drug Inventory

Full pharmacy operations including inventory management and point-of-sale dispensing.

**Key Features:**
- **Drug Inventory Management** — Track stock levels, reorder thresholds, batch numbers, expiry dates, and pricing
- **Nigerian Drug Regulations** — Capture NAFDAC numbers, PCN approval status, NEML category, and controlled substance flags
- **Low Stock & Expiry Alerts** — Automatic warnings when drugs are running low or approaching expiration
- **Reorder Management** — Create and process reorder requests for low-stock items
- **Restock Tracking** — Record incoming stock with batch and expiry details
- **Point-of-Sale (POS)** — Process drug sales with support for cash, card, transfer, NHIS, HMO, and mobile money
- **Dispensing** — Link prescriptions to dispensed drugs; automatically creates billing records when medications are dispensed
- **Supplier Management** — Maintain a database of drug suppliers with ratings

---

### 7. Laboratory Information System

Complete lab order and result management.

**Key Features:**
- **Lab Test Catalog** — Standard catalog of tests across hematology, biochemistry, microbiology, serology, and other categories
- **Test Ordering** — Doctors order lab tests directly from consultation notes
- **Sample Tracking** — Track sample collection, accession numbers, and test status
- **Result Entry** — Lab technicians record results with reference ranges and critical value flags
- **Critical Result Alerts** — Flag and highlight critical (abnormal) results that require urgent attention
- **Result Verification** — Lab managers can verify and sign off on results
- **Turnaround Time Tracking** — Monitor time from order to result completion
- **NCDC Notifiable Disease Reporting** — Report infectious disease cases to the Nigeria Centre for Disease Control

---

### 8. Billing & Financial Management

Complete financial management from invoicing to insurance claims.

**Key Features:**
- **Invoice Generation** — Create invoices for consultations, drugs, laboratory tests, procedures, and admissions
- **Payment Processing** — Accept payments via cash, card, bank transfer, POS, Paystack, Flutterwave, and insurance
- **Payment Tracking** — Monitor amounts paid, balances due, and payment history
- **Insurance Claims** — Submit, track, and manage NHIS and HMO insurance claims
- **Claim Approval Workflow** — Review, approve, or reject insurance claims with supporting documentation
- **Financial Analytics** — View revenue trends, outstanding invoices, drug sales performance, and cash flow summaries
- **Billing Audit Log** — Complete audit trail of all billing actions (issued, paid, cancelled, refunded)

---

### 9. Inpatient Management (IPD)

Manage the full inpatient admission lifecycle.

**Key Features:**
- **Admission Management** — Create admission records with emergency flags, diagnosis, and assigned doctor/ward/bed
- **Bed Management** — Track bed availability, reserve beds, and manage cleaning and maintenance status
- **Patient Transfer** — Move patients between beds or wards with full transfer history
- **Progress Notes** — Nurses and doctors document daily patient progress using SOAP notes
- **Intake & Output Tracking** — Record fluid intake and output for inpatients
- **Nursing Care Plans** — Create and track care plans with goals, interventions, and due dates
- **Medication Administration Record (MAR)** — Schedule and track medication administration; record given, held, refused, or omitted doses
- **Discharge Management** — Complete discharge summaries, bill clearance, and follow-up instructions

---

### 10. Ward Rounds & Handover

Support clinical ward rounds and shift handover processes.

**Key Features:**
- **Ward Round Scheduling** — Schedule daily, teaching, grand, and discharge rounds
- **Round Documentation** — Record findings, decisions, and action items during rounds
- **Patient Assignment** — Add or remove patients from a round and assign team members
- **Shift Handover** — Structured handover notes with critical patients, recent admissions, pending procedures, and discharges
- **Grand Rounds** — Document and track teaching grand rounds with case studies
- **Team Management** — Assign consultants, residents, and nurses to rounds

---

### 11. Staff & HR Management

Comprehensive human resources and staff administration.

**Key Features:**
- **Staff Registration** — Onboard staff with employee IDs, roles, departments, designations, and license numbers
- **Role Management** — Assign roles such as doctor, nurse, pharmacist, lab technician, receptionist, accountant, and administrator
- **Duty Roster** — Create and manage staff schedules with shift assignments
- **Leave Management** — Staff can request leave; managers can approve or reject
- **Overtime Tracking** — Record and approve overtime hours
- **Performance Appraisals** — Conduct and track staff performance reviews
- **Research & Teaching** — Track research outputs and teaching activities
- **Staff Directory** — Searchable directory of all staff with contact details and roles

---

### 12. Emergency & Referral Services

Manage emergency responses and patient referrals between facilities.

**Key Features:**
- **Emergency Calls** — Log and track emergency calls within the facility
- **Ambulance Management** — Track ambulance missions, dispatch, and status
- **Inter-Facility Referrals** — Request and manage patient transfers to other hospitals
- **Medical Evacuation** — Coordinate emergency patient transport with cost tracking

---

### 13. Laboratory Dashboard

A centralized view for laboratory operations.

**Key Features:**
- **Pending Orders** — View all ordered tests awaiting sample collection or processing
- **Result Entry** — Quick access to enter results for in-progress tests
- **Critical Results** — Highlight and prioritize critical results requiring immediate attention
- **Turnaround Monitoring** — Track test completion times and identify bottlenecks

---

### 14. Clinical Decision Support

Built-in tools to support safe clinical practice.

**Key Features:**
- **Drug Interaction Checker** — Identify potentially harmful drug interactions
- **Allergy Alerts** — Cross-check patient allergies against prescribed medications
- **Dosing Guidelines** — Access standard dosing recommendations with renal and hepatic adjustments
- **Clinical Guidelines** — Evidence-based recommendations for common conditions
- **Risk Assessments** — Calculate cardiovascular, diabetes, pregnancy, fall, pressure ulcer, sepsis, and DVT risk scores
- **Patient Alerts** — Real-time alerts for drug interactions, allergies, dosing issues, lab abnormalities, and guideline deviations

---

### 15. Electronic Medical Records (EMR)

Comprehensive electronic record-keeping for patient care.

**Key Features:**
- **Medical Records** — Structured outpatient, inpatient, and emergency records
- **Progress Notes** — SOAP notes for ongoing patient care
- **Clinical Documents** — Upload and attach lab reports, radiology images, prescriptions, consent forms, and photos
- **Problem List** — Track active, resolved, and chronic medical problems with ICD-10 codes
- **Allergy Registry** — Document patient allergies with severity and verification status

---

### 16. Insurance & NHIS Management

Streamline insurance claims and NHIS compliance.

**Key Features:**
- **Insurance Verification** — Verify patient insurance coverage before treatment
- **NHIS Claims** — Create and submit claims to the National Health Insurance Scheme
- **Claim Tracking** — Monitor claim status from submission to payment
- **Insurance Splits** — Automatically calculate patient and insurance portions of bills

---

### 17. Reporting & Analytics

Data-driven insights for hospital management.

**Key Features:**
- **Dashboard Analytics** — Role-specific dashboards showing key metrics and quick actions
- **Financial Reports** — Revenue, costs, drug sales, payment trends, and cash flow
- **Clinical Reports** — Patient volume, diagnosis trends, and treatment outcomes
- **Pharmacy Reports** — Stock levels, expiry alerts, reorder status, and sales analytics
- **Laboratory Reports** — Test volumes, turnaround times, and critical result rates
- **Audit Logs** — Complete traceability of all system actions for compliance

---

### 18. Multi-Tenant & Subscription Management

The platform supports multiple healthcare facilities on a single installation.

**Key Features:**
- **Tenant Isolation** — Each hospital gets its own private, secure data space
- **Subscription Plans** — Flexible subscription tiers for different facility sizes
- **Online Payments** — Secure subscription payments via Paystack and PayPal
- **Usage Monitoring** — Track subscription status, expiry, and trial periods
- **Platform Administration** — Super administrators manage all tenants, subscriptions, and platform settings from a central console

---

### 19. Security & Compliance

Enterprise-grade security and regulatory compliance.

**Key Features:**
- **Role-Based Access** — Each user sees only the features and data relevant to their role
- **Two-Factor Authentication** — Optional 2FA using TOTP, SMS, or email for added security
- **Audit Logging** — Every action in the system is logged with user, timestamp, and details
- **Data Encryption** — Sensitive data such as passwords, API keys, and medical information is encrypted
- **Session Management** — Track and manage active user sessions across devices
- **Password Security** — Secure password reset flows and account lockout after failed login attempts
- **NDPR Compliance** — Tools for managing patient consent, data subject requests, and data breach reporting in compliance with Nigeria's Data Protection Regulation

---

### 20. Integrations & Interoperability

Connect with external systems and standards.

**Key Features:**
- **FHIR Support** — Exchange patient data using the HL7 FHIR standard
- **HL7 v2 Messaging** — Send and receive traditional HL7 messages
- **Mirth Connect** — Integrated channel management for Mirth Connect integration engines
- **External API Access** — Secure API key management for partner systems
- **USSD Support** — Patient access via USSD for basic services without internet
- **Mobile Money** — Integration with mobile payment platforms
- **SMS & Email** — Automated appointment reminders, lab result notifications, and patient communications

---

## User Roles at a Glance

| Role | Primary Responsibilities |
|------|-------------------------|
| **Super Admin** | Manages the entire platform, all tenants, subscriptions, and system settings |
| **System Admin** | Manages reference data, user accounts, and platform-wide configurations |
| **Hospital Admin** | Manages staff, facility settings, and billing for a single hospital |
| **Doctor** | Consults patients, writes prescriptions, orders tests, and documents care |
| **Nurse** | Records vitals, manages ward rounds, administers medications, and tracks patient progress |
| **Pharmacist** | Manages drug inventory, dispenses medications, and processes sales |
| **Lab Technician / Manager** | Receives test orders, performs tests, records and verifies results |
| **Receptionist** | Registers patients, schedules appointments, and manages check-ins |
| **Accountant** | Creates invoices, processes payments, manages insurance claims, and views financial reports |
| **Patient** | Views personal medical records, appointments, and lab results |

---

## How the System Works (At a Glance)

1. **Registration** — A receptionist registers a new patient and assigns a unique hospital number
2. **Appointment** — The patient books an appointment or walks in for a visit
3. **Check-In & Triage** — The patient is checked in and a nurse records initial vital signs
4. **Consultation** — The doctor reviews the patient, documents findings, prescribes medications, and orders lab tests
5. **Pharmacy & Lab** — Medications are dispensed and lab tests are processed
6. **Billing** — All services are itemized on an invoice and payment is collected
7. **Follow-Up** — The patient is scheduled for follow-up if needed
8. **Records** — Every step is recorded and accessible through the patient's complete medical history

---

## Why SmartCare HMS?

- **All-in-One Platform** — No need for separate systems for patient records, pharmacy, lab, and billing
- **Nigeria-Ready** — Built for Nigerian hospitals with NHIS, NIN, NAFDAC, and NCDC compliance
- **Multi-Tenant** — One system can serve multiple hospitals, each with complete data privacy
- **Role-Based** — Every staff member sees only what they need to do their job
- **Audit-Ready** — Complete audit trails for every action, supporting compliance and accountability
- **Offline-Ready Frontend** — The user interface is fast and responsive with smart caching and offline capabilities

---

