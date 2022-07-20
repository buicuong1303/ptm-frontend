const transformPhoneNumber = (value) =>
  value ? value.replace(/[^0-9+]/gi, '') : '';

export default transformPhoneNumber;
