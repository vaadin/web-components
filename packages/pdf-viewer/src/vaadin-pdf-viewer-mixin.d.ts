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
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { PdfViewerDocumentMixinClass } from './vaadin-pdf-viewer-document-mixin.js';
import type { PdfViewerKeyboardMixinClass } from './vaadin-pdf-viewer-keyboard-mixin.js';
import type { PdfViewerRenderMixinClass } from './vaadin-pdf-viewer-render-mixin.js';
import type { PdfViewerScrollMixinClass } from './vaadin-pdf-viewer-scroll-mixin.js';

/**
 * A mixin providing common PDF viewer functionality.
 */
export declare function PdfViewerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerKeyboardMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<PdfViewerScrollMixinClass> &
  Constructor<ResizeMixinClass> &
  Constructor<PdfViewerRenderMixinClass> &
  Constructor<PdfViewerDocumentMixinClass> &
  T;
