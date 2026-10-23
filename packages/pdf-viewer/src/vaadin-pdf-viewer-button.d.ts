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
import type { TemplateResult } from 'lit';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';

/**
 * Renders the tooltip of a toolbar button, which shows its label on hover
 * and keyboard focus. The label is the accessible name of the button already.
 */
export function renderButtonTooltip(text: string): TemplateResult;

/**
 * Stops the propagation of an event of a toolbar control, so that the event
 * does not reach the application.
 */
export function stopPropagation(event: Event): void;

/**
 * An element used internally by `<vaadin-pdf-viewer>`. Not intended to be used separately.
 */
declare class PdfViewerButton extends ButtonMixin(DirMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-pdf-viewer-button': PdfViewerButton;
  }
}

export { PdfViewerButton };
