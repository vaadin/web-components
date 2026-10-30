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
import type * as pdfjsLib from 'pdfjs-dist';
import type { PDFWorker } from 'pdfjs-dist';

type Pdfjs = typeof pdfjsLib;

/**
 * The worker shared by all viewers on the page, with the number of documents
 * that use it.
 */
export interface WorkerHandle {
  worker: PDFWorker | null;
  port: Worker;
  failed: Promise<never> | null;
  users: number;
  pdfjs: Pdfjs;
}

/**
 * Loads the pdf.js library on first use. The library is large, so it is not
 * loaded until a viewer actually needs to show a document.
 */
export function loadPdfjs(): Promise<Pdfjs>;

/**
 * Returns the pdf.js worker shared by all viewers on the page, creating it
 * when needed. Every call must be balanced by a call to `releaseWorker()`
 * with the returned handle.
 *
 * The worker is passed to each document explicitly, so that pdf.js'
 * `GlobalWorkerOptions` stay untouched for any other pdf.js user on the page.
 */
export function acquireWorker(pdfjs: Pdfjs): WorkerHandle;

/**
 * Releases a worker handle obtained with `acquireWorker()`, and terminates
 * the worker when no document uses it anymore.
 */
export function releaseWorker(handle: WorkerHandle): void;
