import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

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

export const createImage = (dataURI, type) => {
  const array = convertDataURIToBinary(dataURI);
  const file = new Blob([array], { type });
  file.name = 'file';
  return file;
};

export const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

export const isDesktopSafari = (() => {
  const uA = navigator.userAgent;
  const vendor = navigator.vendor;
  return /Safari/i.test(uA) && /Apple Computer/.test(vendor) && !/Mobi|Android/i.test(uA);
})();

export const nextRender = (target) => {
  return new Promise((resolve) => {
    afterNextRender(target, () => {
      resolve();
    });
  });
};
