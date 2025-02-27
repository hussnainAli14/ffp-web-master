export function cleanPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');

  const result = cleaned.startsWith('0') ? cleaned.slice(1) : cleaned;

  return result;
}

export function formatNumberWithCommas(num: number, precision = 2): string {
  return num.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision });
}
