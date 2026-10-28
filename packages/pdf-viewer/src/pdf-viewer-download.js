/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
/** The time in milliseconds that the browser gets to start a download before its data is released. */
const RELEASE_DELAY = 60000;

/**
 * Downloads a loaded document as a file. The file has the bytes that pdf.js
 * loaded, so the document is not requested again, and its content, including
 * signatures, stays as it was. This also works for documents from other
 * origins. The data is released after a while, or when the signal aborts.
 * Does nothing when the signal aborts before the bytes are read.
 *
 * @param {import('pdfjs-dist').PDFDocumentProxy} pdfDocument
 * @param {string} fileName
 * @param {AbortSignal} signal
 * @return {Promise<void>}
 */
export async function downloadDocument(pdfDocument, fileName, signal) {
  const data = await pdfDocument.getData();
  if (signal.aborted) {
    return;
  }

  const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
  let timeout = 0;
  const release = () => {
    clearTimeout(timeout);
    signal.removeEventListener('abort', release);
    URL.revokeObjectURL(url);
  };
  timeout = setTimeout(release, RELEASE_DELAY);
  signal.addEventListener('abort', release);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}
