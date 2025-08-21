// Validation personnalisée pour IBAN et BIC
const { body } = require('express-validator');

// Validation IBAN
const isIBAN = (value) => {
  if (!value) return false;
  
  // Supprimer les espaces et convertir en majuscules
  const iban = value.replace(/\s/g, '').toUpperCase();
  
  // Format basique IBAN (2 lettres pays + 2 chiffres + 4 caractères banque + reste)
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[A-Z0-9]{7,16}$/;
  
  if (!ibanRegex.test(iban)) return false;
  
  // Validation spécifique pour la France (FR)
  if (iban.startsWith('FR')) {
    // Format français : FR + 2 chiffres + 5 caractères banque + 5 caractères agence + 11 caractères compte + 2 chiffres clé
    const frIbanRegex = /^FR[0-9]{2}[A-Z0-9]{5}[A-Z0-9]{5}[A-Z0-9]{11}[0-9]{2}$/;
    return frIbanRegex.test(iban);
  }
  
  return true; // Pour les autres pays, on accepte le format basique
};

// Validation BIC/SWIFT
const isBIC = (value) => {
  if (!value) return false;
  
  // Supprimer les espaces et convertir en majuscules
  const bic = value.replace(/\s/g, '').toUpperCase();
  
  // Format BIC : 4 lettres banque + 2 lettres pays + 2 caractères ville + 3 caractères optionnels
  const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  
  return bicRegex.test(bic);
};

// Extension des validateurs express-validator
const customValidators = {
  isIBAN: (value) => {
    if (isIBAN(value)) return true;
    throw new Error('IBAN invalide');
  },
  
  isBIC: (value) => {
    if (isBIC(value)) return true;
    throw new Error('BIC invalide');
  }
};

module.exports = {
  isIBAN,
  isBIC,
  customValidators
};
