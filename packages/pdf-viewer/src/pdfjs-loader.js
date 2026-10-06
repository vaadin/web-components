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

/**
 * The worker shared by all viewers on the page, with the number of documents
 * that use it.
 *
 * @type {{ worker: import('pdfjs-dist').PDFWorker, port: Worker, failed: Promise<never>, users: number } | null}
 */
let sharedWorker = null;

/**
 * Returns the pdf.js worker shared by all viewers on the page, creating it
 * when needed. Every call must be balanced by a call to `releaseWorker()`
 * with the returned handle.
 *
 * The worker is passed to each document explicitly, so that pdf.js'
 * `GlobalWorkerOptions` stay untouched for any other pdf.js user on the page.
 *
 * @param {typeof import('pdfjs-dist')} pdfjs
 */
export function acquireWorker(pdfjs) {
  if (!sharedWorker) {
    const port = new Worker(new URL('./pdf-viewer-worker.js', import.meta.url), { type: 'module' });
    const handle = { worker: null, port, failed: null, users: 0, pdfjs };
    // pdf.js does not notice when a worker passed as a port fails to load,
    // so loading would wait forever. Expose the failure to the caller instead,
    // and make sure that the next document gets a new worker.
    handle.failed = new Promise((_, reject) => {
      port.addEventListener(
        'error',
        () => {
          if (sharedWorker === handle) {
            sharedWorker = null;
          }
          reject(new Error('The pdf.js worker failed to load'));
        },
        { once: true },
      );
    });
    handle.failed.catch(() => {});
    handle.worker = new pdfjs.PDFWorker({ port });
    sharedWorker = handle;
  }
  sharedWorker.users += 1;
  return sharedWorker;
}

/**
 * Releases a worker handle obtained with `acquireWorker()`, and terminates
 * the worker when no document uses it anymore.
 *
 * @param {ReturnType<typeof acquireWorker>} handle
 */
export function releaseWorker(handle) {
  handle.users -= 1;
  if (handle.users === 0) {
    handle.worker.destroy();
    handle.port.terminate();
    // Removes the elements that the text layer adds to the document for measuring text.
    handle.pdfjs.TextLayer.cleanup();
    if (sharedWorker === handle) {
      sharedWorker = null;
    }
  }
}
