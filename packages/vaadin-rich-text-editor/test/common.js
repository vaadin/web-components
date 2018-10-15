const BASE64_MARKER = ';base64,';

function convertDataURIToBinary(dataURI) {
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));
  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

// eslint-disable-next-line no-unused-vars
function createImage(dataURI, type) {
  const array = convertDataURIToBinary(dataURI);
  const file = new Blob([array], {type});
  file.name = 'file';
  return file;
}
