export function convertBufferToBase64(buffer, type) {
  let TYPED_ARRAY = new Uint8Array(buffer);
  const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
    return data + String.fromCharCode(byte);
  }, '');
  let base64String = btoa(STRING_CHAR);
  return `data:${type};base64, ` + base64String;
}
