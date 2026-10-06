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

let pdfjsPromise;

/**
 * Loads the pdf.js library on first use. The library is large, so it is not
 * loaded until a viewer actually needs to show a document.
 *
 * @return {Promise<typeof import('pdfjs-dist')>}
 */
export function loadPdfjs() {
  pdfjsPromise ||= import('pdfjs-dist/legacy/build/pdf.mjs');
  return pdfjsPromise;
}

let sharedWorker = null;
let sharedWorkerError = null;
let workerUsers = 0;

/**
 * Returns the pdf.js worker shared by all viewers on the page, creating it
 * when needed. Every call must be balanced by a call to `releaseWorker()`.
 *
 * The worker is passed to each document explicitly, so that pdf.js'
 * `GlobalWorkerOptions` stay untouched for any other pdf.js user on the page.
 *
 * @param {typeof import('pdfjs-dist')} pdfjs
 * @return {{ worker: import('pdfjs-dist').PDFWorker, failed: Promise<never> }}
 */
export function acquireWorker(pdfjs) {
  if (!sharedWorker) {
    const port = new Worker(new URL('./pdf-viewer-worker.js', import.meta.url), { type: 'module' });
    // pdf.js does not notice when a worker passed as a port fails to load,
    // so loading would wait forever. Expose the failure to the caller instead.
    sharedWorkerError = new Promise((_, reject) => {
      port.addEventListener('error', () => reject(new Error('The pdf.js worker failed to load')), { once: true });
    });
    sharedWorkerError.catch(() => {});
    sharedWorker = new pdfjs.PDFWorker({ port });
  }
  workerUsers += 1;
  return { worker: sharedWorker, failed: sharedWorkerError };
}

/**
 * Releases a worker obtained with `acquireWorker()`, and terminates it when
 * no viewer uses it anymore.
 */
export function releaseWorker() {
  workerUsers -= 1;
  if (workerUsers === 0 && sharedWorker) {
    const { port } = sharedWorker;
    sharedWorker.destroy();
    port.terminate();
    sharedWorker = null;
    sharedWorkerError = null;
  }
}
