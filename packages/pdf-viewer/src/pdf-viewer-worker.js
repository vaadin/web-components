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
// Entry point of the pdf.js worker. Loaded as a module worker by the viewer, see `pdfjs-loader.js`.
// The import has side effects only: pdf.js sets up its message handler when it runs inside a worker.
import 'pdfjs-dist/legacy/build/pdf.worker.mjs';
