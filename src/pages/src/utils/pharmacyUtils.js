// Validation for drug data
export const validateDrug = (drugData) => {
  const errors = [];
  
  if (!drugData.name?.trim()) {
    errors.push('Drug name is required');
  }
  
  if (!drugData.nafdacNumber?.trim()) {
    errors.push('NAFDAC number is required');
  } else if (!/^NAFDAC-\d{2}-\d{4}$/i.test(drugData.nafdacNumber)) {
    errors.push('NAFDAC number must be in format: NAFDAC-04-1234');
  }
  
  if (!drugData.category) {
    errors.push('Drug category is required');
  }
  
  if (!drugData.dosageForm) {
    errors.push('Dosage form is required');
  }
  
  if (drugData.unitPrice && isNaN(drugData.unitPrice)) {
    errors.push('Unit price must be a valid number');
  }
  
  if (drugData.sellingPrice && isNaN(drugData.sellingPrice)) {
    errors.push('Selling price must be a valid number');
  }
  
  if (drugData.quantityInStock && isNaN(drugData.quantityInStock)) {
    errors.push('Quantity must be a valid number');
  }
  
  if (drugData.expiryDate) {
    const expiry = new Date(drugData.expiryDate);
    if (expiry < new Date()) {
      errors.push('Expiry date cannot be in the past');
    }
  }
  
  if (drugData.controlledSubstance && !drugData.schedule) {
    errors.push('Schedule is required for controlled substances');
  }
  
  if (drugData.nhisCovered && !drugData.nhisCode) {
    errors.push('NHIS code is required for NHIS covered drugs');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Format NAFDAC number
export const formatNafdacNumber = (nafdacNumber) => {
  if (!nafdacNumber) return '';
  return nafdacNumber.toUpperCase().replace(/\s/g, '');
};

// Calculate expiry status
export const calculateExpiryStatus = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { status: 'expired', days: 0 };
  } else if (diffDays <= 30) {
    return { status: 'expiring_soon', days: diffDays };
  } else if (diffDays <= 90) {
    return { status: 'warning', days: diffDays };
  } else {
    return { status: 'good', days: diffDays };
  }
};

// Calculate reorder level
export const calculateReorderLevel = (averageUsage, leadTimeDays) => {
  return Math.ceil(averageUsage * leadTimeDays * 1.5);
};

// Nigerian drug categories with NEML classification
export const NEML_CLASSIFICATION = {
  ANTIMALARIALS: [
    'Artemether/Lumefantrine',
    'Artemisinin-based combinations',
    'Chloroquine',
    'Quinine',
    'Primaquine',
  ],
  ANTIBIOTICS: [
    'Amoxicillin',
    'Ciprofloxacin',
    'Metronidazole',
    'Doxycycline',
    'Ceftriaxone',
  ],
  ANALGESICS: [
    'Paracetamol',
    'Ibuprofen',
    'Diclofenac',
    'Tramadol',
    'Morphine',
  ],
};

// Drug interactions checker (simplified)
export const checkDrugInteraction = (drug1, drug2) => {
  const interactions = {
    'Warfarin': ['Aspirin', 'Ibuprofen', 'NSAIDs'],
    'Digoxin': ['Furosemide', 'Hydrochlorothiazide'],
    'Lithium': ['Furosemide', 'Hydrochlorothiazide'],
    'MAOIs': ['SSRIs', 'TCAs', 'Sympathomimetics'],
  };
  
  if (interactions[drug1]?.includes(drug2) || interactions[drug2]?.includes(drug1)) {
    return {
      hasInteraction: true,
      severity: 'high',
      message: `Potential interaction between ${drug1} and ${drug2}`,
    };
  }
  
  return { hasInteraction: false, severity: 'none', message: '' };
};

// Generate prescription barcode
export const generatePrescriptionBarcode = (prescriptionId) => {
  return `RX-${prescriptionId}-${Date.now().toString(36)}`;
};

// Calculate drug shelf life
export const calculateShelfLife = (manufactureDate, expiryDate) => {
  const manufacture = new Date(manufactureDate);
  const expiry = new Date(expiryDate);
  const diffTime = expiry - manufacture;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Format Nigerian currency
export const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Export pharmacy data to CSV
export const exportPharmacyDataToCSV = (drugs) => {
  const headers = [
    'Name',
    'Generic Name',
    'Brand Name',
    'Drug Code',
    'NAFDAC Number',
    'Strength',
    'Dosage Form',
    'Category',
    'Manufacturer',
    'Unit Price (₦)',
    'Selling Price (₦)',
    'Quantity in Stock',
    'Reorder Level',
    'Expiry Date',
    'Batch Number',
    'NEML Category',
    'Controlled Substance',
    'Schedule',
    'NHIS Covered',
    'NHIS Code',
    'Status',
  ];
  
  const rows = drugs.map(drug => [
    drug.name,
    drug.genericName,
    drug.brandName,
    drug.drugCode,
    drug.nafdacNumber,
    drug.strength,
    drug.dosageForm,
    drug.category,
    drug.manufacturer,
    drug.unitPrice,
    drug.sellingPrice,
    drug.quantityInStock,
    drug.reorderLevel,
    drug.expiryDate,
    drug.batchNumber,
    drug.nemlCategory,
    drug.controlledSubstance ? 'Yes' : 'No',
    drug.schedule || 'N/A',
    drug.nhisCovered ? 'Yes' : 'No',
    drug.nhisCode || 'N/A',
    drug.status,
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};