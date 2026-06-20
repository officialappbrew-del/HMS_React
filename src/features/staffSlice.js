import { createSlice } from '@reduxjs/toolkit';

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    // Staff members with Nigerian registration details
    staff: [
      {
        staffId: 'DR001',
        name: 'Dr. Adekunle Ifeanyi',
        email: 'adekunle.ifeanyi@hospital.com',
        phone: '+2348123456789',
        category: 'Doctor',
        specialty: 'Internal Medicine',
        registrationNumber: 'MDCN/2019/12345',
        licenseExpiryDate: '2025-12-31',
        dateOfBirth: '1985-05-15',
        address: 'Lagos, Nigeria',
        department: 'Internal Medicine',
        designation: 'Consultant',
        status: 'Active',
        photoUrl: null,
        dateEmployed: '2015-08-01'
      },
      {
        staffId: 'NUR001',
        name: 'Nurse Chioma Okafor',
        email: 'chioma.okafor@hospital.com',
        phone: '+2349876543210',
        category: 'Nurse',
        specialty: 'General Nursing',
        registrationNumber: 'NMCN/2018/54321',
        licenseExpiryDate: '2026-06-30',
        dateOfBirth: '1990-03-22',
        address: 'Enugu, Nigeria',
        department: 'General Ward',
        designation: 'Senior Nurse',
        status: 'Active',
        photoUrl: null,
        dateEmployed: '2016-02-15'
      },
      {
        staffId: 'PHARM001',
        name: 'Mr. Tunde Oluwaseun',
        email: 'tunde.oluwaseun@hospital.com',
        phone: '+2348765432109',
        category: 'Pharmacist',
        specialty: 'Clinical Pharmacy',
        registrationNumber: 'PCN/2017/98765',
        licenseExpiryDate: '2025-03-31',
        dateOfBirth: '1988-07-10',
        address: 'Ibadan, Nigeria',
        department: 'Pharmacy',
        designation: 'Senior Pharmacist',
        status: 'Active',
        photoUrl: null,
        dateEmployed: '2017-05-20'
      },
      {
        staffId: 'LAB001',
        name: 'Mrs. Zainab Hassan',
        email: 'zainab.hassan@hospital.com',
        phone: '+2348123409876',
        category: 'Laboratory Technician',
        specialty: 'Medical Laboratory Science',
        registrationNumber: 'MLSN/2019/11111',
        licenseExpiryDate: '2026-12-15',
        dateOfBirth: '1992-11-05',
        address: 'Kano, Nigeria',
        department: 'Laboratory',
        designation: 'Laboratory Scientist',
        status: 'Active',
        photoUrl: null,
        dateEmployed: '2018-09-10'
      },
      {
        staffId: 'ADMIN001',
        name: 'Mr. Obi Ejiofor',
        email: 'obi.ejiofor@hospital.com',
        phone: '+2348456789123',
        category: 'Administrative',
        specialty: 'Health Administration',
        registrationNumber: 'ADMIN/2020/22222',
        licenseExpiryDate: null,
        dateOfBirth: '1987-02-14',
        address: 'Abuja, Nigeria',
        department: 'Administration',
        designation: 'Administrative Officer',
        status: 'Active',
        photoUrl: null,
        dateEmployed: '2019-01-15'
      }
    ],

    // Professional certifications and licenses
    certifications: [
      {
        certId: 'CERT001',
        staffId: 'DR001',
        certificationName: 'BLS/ACLS Certification',
        issuingBody: 'American Heart Association',
        dateObtained: '2022-06-15',
        expiryDate: '2025-06-14',
        certificateNumber: 'AHA-BLS-2022-001',
        status: 'Active'
      },
      {
        certId: 'CERT002',
        staffId: 'DR001',
        certificationName: 'CME - Cardiovascular Management',
        issuingBody: 'Nigerian Medical Association',
        dateObtained: '2024-01-10',
        expiryDate: '2025-01-10',
        certificateNumber: 'NMA-CME-2024-001',
        status: 'Active'
      },
      {
        certId: 'CERT003',
        staffId: 'NUR001',
        certificationName: 'Advanced Nursing Practice',
        issuingBody: 'Nursing Regulatory Council',
        dateObtained: '2023-09-20',
        expiryDate: '2026-09-19',
        certificateNumber: 'NRC-ANP-2023-001',
        status: 'Active'
      },
      {
        certId: 'CERT004',
        staffId: 'PHARM001',
        certificationName: 'Pharmacy Practice Certificate',
        issuingBody: 'Pharmacy Council of Nigeria',
        dateObtained: '2020-05-12',
        expiryDate: '2025-05-11',
        certificateNumber: 'PCN-PP-2020-001',
        status: 'Active'
      }
    ],

    // Training records
    trainingRecords: [
      {
        trainingId: 'TRAIN001',
        staffId: 'DR001',
        trainingTitle: 'Infection Control & Prevention',
        trainingDate: '2024-01-15',
        duration: '4 hours',
        trainer: 'Dr. Nneka Uzozie',
        status: 'Completed',
        certificateNumber: 'ICP-2024-001'
      },
      {
        trainingId: 'TRAIN002',
        staffId: 'NUR001',
        trainingTitle: 'NHIS Billing Procedures',
        trainingDate: '2024-02-20',
        duration: '8 hours',
        trainer: 'Mrs. Zainab Hassan',
        status: 'Completed',
        certificateNumber: 'NHIS-2024-001'
      },
      {
        trainingId: 'TRAIN003',
        staffId: 'PHARM001',
        trainingTitle: 'Drug Safety & Adverse Effects',
        trainingDate: '2024-01-25',
        duration: '6 hours',
        trainer: 'Prof. Emeka Ejiofor',
        status: 'Completed',
        certificateNumber: 'DSAE-2024-001'
      }
    ],

    // Staff categories
    staffCategories: {
      DOCTOR: 'Doctor',
      NURSE: 'Nurse',
      PHARMACIST: 'Pharmacist',
      LAB_TECH: 'Laboratory Technician',
      RADIOGRAPHER: 'Radiographer',
      ADMIN: 'Administrative',
      SUPPORT: 'Support Staff'
    },

    // Designations
    designations: {
      CONSULTANT: 'Consultant',
      SENIOR_REG: 'Senior Registrar',
      REGISTRAR: 'Registrar',
      SENIOR_RESIDENT: 'Senior Resident',
      RESIDENT: 'Resident',
      INTERN: 'Intern',
      SENIOR_NURSE: 'Senior Nurse',
      NURSE: 'Nurse',
      AUXILIARY: 'Auxiliary Nurse'
    }
  },

  reducers: {
    addStaff: (state, action) => {
      state.staff.push(action.payload);
    },

    updateStaff: (state, action) => {
      const index = state.staff.findIndex(s => s.staffId === action.payload.staffId);
      if (index !== -1) {
        state.staff[index] = { ...state.staff[index], ...action.payload };
      }
    },

    deleteStaff: (state, action) => {
      state.staff = state.staff.filter(s => s.staffId !== action.payload);
    },

    addCertification: (state, action) => {
      state.certifications.push(action.payload);
    },

    updateCertification: (state, action) => {
      const index = state.certifications.findIndex(c => c.certId === action.payload.certId);
      if (index !== -1) {
        state.certifications[index] = { ...state.certifications[index], ...action.payload };
      }
    },

    deleteCertification: (state, action) => {
      state.certifications = state.certifications.filter(c => c.certId !== action.payload);
    },

    addTraining: (state, action) => {
      state.trainingRecords.push(action.payload);
    },

    updateTraining: (state, action) => {
      const index = state.trainingRecords.findIndex(t => t.trainingId === action.payload.trainingId);
      if (index !== -1) {
        state.trainingRecords[index] = { ...state.trainingRecords[index], ...action.payload };
      }
    },

    deleteTraining: (state, action) => {
      state.trainingRecords = state.trainingRecords.filter(t => t.trainingId !== action.payload);
    }
  }
});

export const {
  addStaff,
  updateStaff,
  deleteStaff,
  addCertification,
  updateCertification,
  deleteCertification,
  addTraining,
  updateTraining,
  deleteTraining
} = staffSlice.actions;

export default staffSlice.reducer;
