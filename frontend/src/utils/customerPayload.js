function splitCsv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseIdDetailValue(value) {
  const trimmed = String(value || '').trim();
  if (/^\d+$/.test(trimmed)) {
    const asNumber = Number(trimmed);
    return Number.isSafeInteger(asNumber) ? asNumber : trimmed;
  }
  return trimmed;
}

function parsePhoneNumber(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) {
    return null;
  }
  const asNumber = Number(digits);
  return Number.isFinite(asNumber) ? asNumber : null;
}

export function formDataToCustomerPayload(formData) {
  const phoneNumbers = splitCsv(formData.phoneNumbers)
    .map(parsePhoneNumber)
    .filter((value) => value != null);

  const idDetails = Object.fromEntries(
    splitCsv(formData.idDetails).map((entry) => {
      const separatorIndex = entry.indexOf(':');
      const key = separatorIndex >= 0 ? entry.slice(0, separatorIndex).trim() : entry.trim();
      const value =
        separatorIndex >= 0 ? entry.slice(separatorIndex + 1).trim() : '';
      return [key, parseIdDetailValue(value)];
    }),
  );

  return {
    cno: Number(formData.cno),
    cname: String(formData.cname || '').trim(),
    billAmt: Number(formData.billAmt),
    favColor: splitCsv(formData.favColor),
    studies: splitCsv(formData.studies),
    phoneNumbers,
    idDetails,
    company: {
      name: String(formData.companyName || '').trim(),
      addrs: String(formData.companyAddrs || '').trim(),
      type: String(formData.companyType || '').trim(),
      size: Number(formData.companySize),
    },
  };
}
