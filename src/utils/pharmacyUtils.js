export const formatNafdacNumber = (value = '') =>
  String(value).trim().replace(/\s+/g, '').toUpperCase();

export const validateDrug = (drug = {}) => {
  const errors = [];
  if (!String(drug.name || '').trim()) errors.push('Drug name is required.');
  if (!String(drug.dosageForm || '').trim()) errors.push('Dosage form is required.');
  if (!String(drug.category || '').trim()) errors.push('Category is required.');

  const quantity = Number(drug.quantityInStock);
  if (drug.quantityInStock !== '' && (!Number.isFinite(quantity) || quantity < 0)) {
    errors.push('Quantity in stock must be zero or greater.');
  }

  const unitPrice = Number(drug.unitPrice);
  if (drug.unitPrice !== '' && (!Number.isFinite(unitPrice) || unitPrice < 0)) {
    errors.push('Unit price must be zero or greater.');
  }

  return { isValid: errors.length === 0, errors };
};

export const calculateExpiryStatus = (expiryDate) => {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  if (Number.isNaN(expiry.getTime())) return null;
  return Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

export const calculateReorderLevel = (averageDailyUsage = 0, leadTimeDays = 0, safetyStock = 0) =>
  Math.max(0, Math.ceil(Number(averageDailyUsage) * Number(leadTimeDays) + Number(safetyStock)));
