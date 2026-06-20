// Patient validation utility
export const validatePatient = (patientData) => {
  const errors = [];
  
  if (!patientData.name?.trim()) {
    errors.push('Name is required');
  }
  
  if (!patientData.phone?.trim()) {
    errors.push('Phone number is required');
  } else if (!/^[0-9]{11}$/.test(patientData.phone.replace(/\D/g, ''))) {
    errors.push('Phone number must be 11 digits');
  }
  
  if (patientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email)) {
    errors.push('Invalid email format');
  }
  
  if (patientData.nin && !/^[0-9]{11}$/.test(patientData.nin)) {
    errors.push('NIN must be 11 digits');
  }
  
  if (patientData.dateOfBirth) {
    const dob = new Date(patientData.dateOfBirth);
    const today = new Date();
    if (dob > today) {
      errors.push('Date of birth cannot be in the future');
    }
    
    const age = today.getFullYear() - dob.getFullYear();
    if (age > 120) {
      errors.push('Please verify date of birth');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Patient data formatting
export const formatPatientForDisplay = (patient) => {
  return {
    ...patient,
    formattedPhone: patient.phone ? formatPhoneNumber(patient.phone) : 'N/A',
    formattedDob: patient.dateOfBirth 
      ? new Date(patient.dateOfBirth).toLocaleDateString('en-NG')
      : 'N/A',
    age: patient.dateOfBirth 
      ? calculateAge(patient.dateOfBirth)
      : null,
    fullAddress: [
      patient.address,
      patient.lga,
      patient.state,
      'Nigeria'
    ].filter(Boolean).join(', '),
  };
};

// Helper functions
const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  return phone;
};

const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
};

// Export to CSV
export const exportPatientsToCSV = (patients) => {
  const headers = [
    'Name',
    'NIN',
    'Phone',
    'Email',
    'Date of Birth',
    'Age',
    'Blood Type',
    'Tribe',
    'State',
    'LGA',
    'Address',
    'Status',
    'Date Added',
    'Last Updated',
  ];
  
  const rows = patients.map(patient => [
    patient.name,
    patient.nin || '',
    patient.phone,
    patient.email || '',
    patient.dateOfBirth || '',
    calculateAge(patient.dateOfBirth) || '',
    patient.bloodType || '',
    patient.tribe || '',
    patient.state || '',
    patient.lga || '',
    patient.address || '',
    patient.status,
    new Date(patient.createdAt).toLocaleDateString(),
    new Date(patient.updatedAt).toLocaleDateString(),
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};