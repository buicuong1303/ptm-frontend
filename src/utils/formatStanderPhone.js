export function formatStanderPhone(phoneString) {
  const plainPhone = phoneString.replace(/[^0-9]/g, '');
  let standardPhone =
    plainPhone.length === 10 ? `+1${plainPhone}` : `+${plainPhone}`;
  return standardPhone;
}
