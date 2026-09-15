/**
 * Normalizes phone numbers to standard formats.
 */

/**
 * Strips all non-digit characters except leading '+'.
 */
export function sanitizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (!digitsOnly) return '';

  if (hasPlus) {
    return `+${digitsOnly}`;
  }
  return digitsOnly;
}

/**
 * Normalizes Indian phone numbers to canonical +91XXXXXXXXXX format.
 * If 10 digits starting with 6-9, prefixes +91.
 * If 12 digits starting with 91, prefixes +.
 * If 11 digits starting with 0, strips leading 0 and prefixes +91.
 */
export function normalizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  const sanitized = sanitizePhoneNumber(phone);
  const digitsOnly = sanitized.replace(/\D/g, '');

  // 10 digits starting with 6, 7, 8, 9 (standard Indian mobile)
  if (digitsOnly.length === 10 && /^[6-9]/.test(digitsOnly)) {
    return `+91${digitsOnly}`;
  }

  // 11 digits starting with 0 (e.g. 09876543210)
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0') && /^[6-9]/.test(digitsOnly.slice(1))) {
    return `+91${digitsOnly.slice(1)}`;
  }

  // 12 digits starting with 91 (e.g. 919876543210)
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return `+${digitsOnly}`;
  }

  // Already prefixed with + (e.g. +919876543210 or international +1234567890)
  if (sanitized.startsWith('+')) {
    return sanitized;
  }

  return sanitized ? `+${digitsOnly}` : '';
}

export function getRazorpayContact(phone: string | null | undefined): string {
  if (!phone) return '';
  const digitsOnly = phone.trim().replace(/\D/g, '');
  if (!digitsOnly) return '';

  // If 12 digits starting with 91 (e.g. 919573445521), return last 10 digits
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return digitsOnly.slice(2);
  }
  // If 11 digits starting with 0 (e.g. 09573445521), return last 10 digits
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return digitsOnly.slice(1);
  }
  // Standard 10-digit mobile number
  if (digitsOnly.length === 10) {
    return digitsOnly;
  }
  return digitsOnly;
}
