# SmartCare HMS Frontend

SmartCare HMS is a multi-tenant hospital management system frontend for Nigerian healthcare facilities. It provides role-based workflows for patient registration, consultations, vital signs, pharmacy, prescriptions, dispensing audits, billing, admissions, laboratory work, appointments, staff management, and patient journeys.

This directory contains the React frontend. The Django API server is in `../HMS_backend`.

## Requirements

- Node.js 18 or newer
- npm
- The SmartCare HMS Django backend running locally or available remotely
- A valid authenticated user and tenant configured by the backend

## Local Setup

From this directory:

```powershell
cd C:\Users\HP\Desktop\HMS\HMS_React
npm install
```

Create the local environment file:

```powershell
Copy-Item .env.example .env
```

The shared environment uses the deployed Render backend:

```env
VITE_API_BASE_URL=https://hms-backend-l09g.onrender.com
```

Start the development server:

```powershell
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173
```

For access through a local admin subdomain, use:

```powershell
npm run dev:admin
```


## Main Application Areas

- `/dashboard` - Role-specific dashboard
- `/patients` - Patient registration and management
- `/patients/:patientId/journey` - Patient visits, prescriptions, vital records, invoices, charge breakdown, and payment history
- `/consultation` - Doctor and clinical consultation workflow
- `/vital-signs` - Vital-sign recording and early warning scores
- `/pharmacy` - Inventory, prescriptions, dispensing, suppliers, sales, and dispensing audit
- `/billing` - Invoices, payments, claims, and billing administration
- `/appointments` - Appointment scheduling and status management
- `/admissions` - Admission and bed workflows
- `/laboratory` - Laboratory orders and results

Routes are protected by authentication and, where configured, user role. The backend also enforces tenant isolation and permissions.

## Patient Journey and Billing

The patient journey is server-backed and uses:

```text
GET /api/v1/patients/patients/{patient_id}/journey/
```

It combines visits, prescriptions, vital signs, invoices, invoice line items, and payments. Charge sources are represented by invoice item types, including:

- `consultation`
- `service` for vital or other medical services
- `drug` for dispensed medication
- `test`, `procedure`, `admission`, and `other`

Staff can confirm full or partial patient payments from the invoice detail view. Payments update the invoice balance and status on the server.

## Production Build

Build the frontend:

```powershell
npm run build
```

The output is written to `dist/`. Preview it locally with:

```powershell
npm run preview
```

For Vercel or another static host:

- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_BASE_URL` in the hosting provider environment settings
- Configure SPA rewrites so application routes serve `index.html`

The repository includes `vercel.json` for deployment configuration.

## Troubleshooting

### `VITE_API_BASE_URL is not configured`

Create `.env` from `.env.example`, set `VITE_API_BASE_URL`, and restart Vite. Environment changes are read when the development server starts.

### API requests return 401 or 403

Confirm that you are logged in, the selected user belongs to the expected tenant, and the backend role permits the requested operation. Check the backend logs for the specific permission response.

### API requests return 404

Confirm that the backend is running and that `VITE_API_BASE_URL` points to the backend root, such as `https://hms-backend-l09g.onrender.com`, not to the frontend port.

### Changes do not appear after updating environment variables

Stop and restart the Vite server. Clear an old service worker or browser cache if a production PWA build is being tested.

### Browser blocks requests because of CORS

Configure the backend allowed origins for the frontend URL. For local development, the usual frontend origin is `http://localhost:5173`.

## Project Structure

```text
src/
  components/   Shared UI and role dashboards
  contexts/     React context providers
  data/         Static reference data only
  features/     Redux Toolkit slices and async API workflows
  hooks/        Reusable React hooks
  pages/        Routed application pages
  utils/        API clients and shared utilities
  App.jsx       Routing, authentication guards, and application shell
  main.jsx      React entry point
  store.js      Redux store configuration
```

The application is built with React, Vite, React Router, Redux Toolkit, Tailwind CSS, Lucide icons, Recharts, and a service worker through `vite-plugin-pwa`.
