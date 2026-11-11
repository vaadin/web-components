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

export interface WorkerHandle {
  worker: PDFWorker | null;
  port: Worker;
  failed: Promise<never> | null;
  users: number;
}

export function loadPdfjs(): Promise<Pdfjs>;

export function acquireWorker(pdfjs: Pdfjs): WorkerHandle;

export function releaseWorker(handle: WorkerHandle): void;
