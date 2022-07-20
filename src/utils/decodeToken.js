export default (token) => {
  try {
    if (token.split('.').length !== 3 || typeof token !== 'string') {
      return null;
    } else {
      var payload = token.split('.')[1];
      var base64 = payload.replace('-', '+').replace('_', '/');
      var decoded = JSON.parse(atob(base64));
      return decoded;
    }
  } catch (error) {
    return null;
  }
};
