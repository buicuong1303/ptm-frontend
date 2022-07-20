import { readAsArrayBuffer } from './readFilePromise';
export async function convertUrlToBase64(url, callback) {
  var xhr = new XMLHttpRequest();
  let data = '';

  //hacky
  url += '?' + new Date().getTime();

  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = async function () {
    var file = this.response;
    data = await readAsArrayBuffer(file);
    if (data) callback(null, data);
    else callback('fail', null);
  };
  xhr.send();
}
