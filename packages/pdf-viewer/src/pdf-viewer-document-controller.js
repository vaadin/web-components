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
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { acquireWorker, loadPdfjs, releaseWorker } from './pdfjs-loader.js';

/**
 * Maps a pdf.js loading error to the `reason` reported in the `document-error`
 * event. Any failure other than a password or an invalid file is reported as
 * `network`, since the file could not be fetched or read.
 * @param {Error} error
 * @return {'invalid' | 'network' | 'password'}
 */
function getErrorReason(error) {
  if (error && error.name === 'PasswordException') {
    return 'password';
  }
  if (error && error.name === 'InvalidPDFException') {
    return 'invalid';
  }
  return 'network';
}

/**
 * @typedef {Object} PdfViewerDocumentDetails
 * @property {string} title The title from the metadata of the document, or an empty string.
 * @property {boolean} displayDocTitle Whether the document asks viewers to show its title.
 * @property {import('pdfjs-dist').PDFPageProxy} firstPage The first page of the document.
 */

/**
 * @typedef {Object} PdfViewerDocumentCallbacks
 * @property {() => void} onLoadStart Called when loading starts.
 * @property {(pdfDocument: import('pdfjs-dist').PDFDocumentProxy, details: PdfViewerDocumentDetails) => void} onLoad
 *   Called when the document has loaded.
 * @property {(error: unknown, reason: 'invalid' | 'network' | 'password') => void} onError
 *   Called when the document could not be loaded.
 * @property {() => void} onUnload Called when the document or the load in progress is dropped.
 */

/**
 * A controller that loads the document of the host's `src` with pdf.js, and
 * releases it while the host is detached.
 */
export class PdfViewerDocumentController {
  /** @type {HTMLElement & { src: string | null | undefined }} */
  #host;

  /** @type {PdfViewerDocumentCallbacks} */
  #callbacks;

  /** @type {import('pdfjs-dist').PDFDocumentLoadingTask | null} */
  #loadingTask = null;

  /** @type {ReturnType<typeof acquireWorker> | null} */
  #workerHandle = null;

  /** Incremented on every load, to detect results that belong to an outdated load. */
  #loadId = 0;

  /** Set when the document is not loaded because the host is detached, to load it on attach. */
  #released = false;

  /**
   * @param {HTMLElement & { src: string | null | undefined }} host
   * @param {PdfViewerDocumentCallbacks} callbacks
   */
  constructor(host, callbacks) {
    this.#host = host;
    this.#callbacks = callbacks;
  }

  hostConnected() {
    if (this.#released) {
      this.#released = false;
      this.load();
    }
  }

  hostDisconnected() {
    // Wait a microtask so that moving the host in the DOM does not reload the document.
    queueMicrotask(() => {
      if (!this.#host.isConnected && this.#host.src && !this.#released) {
        this.#loadId += 1;
        this.#unload();
        this.#released = true;
      }
    });
  }

  /**
   * Drops the current document and loads the one of the host's `src`.
   * A detached host does not hold on to a document. It loads it once attached.
   */
  load() {
    this.#loadId += 1;
    const loadId = this.#loadId;
    this.#unload();

    const { src } = this.#host;
    this.#released = !!src && !this.#host.isConnected;
    if (!src || this.#released) {
      return;
    }

    this.#callbacks.onLoadStart();
    this.#open(loadId, src).catch((error) => {
      if (loadId === this.#loadId) {
        this.#unload();
        this.#callbacks.onError(error, getErrorReason(error));
      }
    });
  }

  /** @private */
  async #open(loadId, src) {
    const pdfjs = await loadPdfjs();
    if (loadId !== this.#loadId) {
      return;
    }

    this.#workerHandle = acquireWorker(pdfjs);
    this.#loadingTask = pdfjs.getDocument({
      url: new URL(src, document.baseURI).href,
      worker: this.#workerHandle.worker,
      // One request for the whole file, so that the server sends the document once.
      disableRange: true,
      // Security: no XFA forms. Scripting (pdf.sandbox) is never loaded either.
      enableXfa: false,
    });

    const workerFailed = this.#workerHandle.failed.catch((error) => {
      issueWarning(
        'The pdf.js worker of <vaadin-pdf-viewer> failed to load. If the page has a Content Security Policy, check that its worker-src directive allows the worker script.',
      );
      throw error;
    });
    const pdfDocument = await Promise.race([this.#loadingTask.promise, workerFailed]);
    if (loadId !== this.#loadId) {
      return;
    }

    const [{ info }, viewerPreferences, firstPage] = await Promise.all([
      pdfDocument.getMetadata(),
      pdfDocument.getViewerPreferences(),
      pdfDocument.getPage(1),
    ]);
    if (loadId !== this.#loadId) {
      return;
    }
    this.#callbacks.onLoad(pdfDocument, {
      title: (info && info.Title) || '',
      displayDocTitle: !!viewerPreferences && viewerPreferences.get('DisplayDocTitle') === true,
      firstPage,
    });
  }

  /** @private */
  #unload() {
    const loadingTask = this.#loadingTask;
    const workerHandle = this.#workerHandle;
    this.#loadingTask = null;
    this.#workerHandle = null;
    if (loadingTask) {
      // Destroying the loading task also destroys its document. Release
      // the worker only afterwards, as destroying talks to the worker.
      loadingTask
        .destroy()
        .finally(() => releaseWorker(workerHandle))
        .catch((error) => issueWarning(`Failed to release the PDF document: ${error.message}`));
    } else if (workerHandle) {
      releaseWorker(workerHandle);
    }
    this.#callbacks.onUnload();
  }
}
