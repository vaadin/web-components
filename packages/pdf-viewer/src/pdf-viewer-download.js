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
 * origins. The data is released after a while, also when the viewer is
 * detached meanwhile, as some browsers fail a download whose URL is
 * released right after the click.
 *
 * @param {import('pdfjs-dist').PDFDocumentProxy} pdfDocument
 * @param {string} fileName
 * @return {Promise<void>}
 */
export async function downloadDocument(pdfDocument, fileName) {
  const data = await pdfDocument.getData();
  const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
  setTimeout(() => URL.revokeObjectURL(url), RELEASE_DELAY);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}
