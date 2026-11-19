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

/**
 * @license pdf.js 6.5.438
 *
 * Copyright 2021 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { html, nothing, render } from 'lit';

/**
 * Returns the template of a node of the structure, with the templates of its children.
 * @param {import('./pdf-viewer-page-model.js').PdfViewerStructNode} node
 * @return {import('lit').TemplateResult}
 */
function renderNode({ role, level, label, description, owns, lang, rowSpan, colSpan, image, children }) {
  const imageTemplate = image === undefined ? nothing : html`<span role="img" aria-label=${image}></span>`;
  return html`<span
    role=${role ?? nothing}
    aria-level=${level ?? nothing}
    aria-label=${label ?? nothing}
    aria-description=${description ?? nothing}
    aria-owns=${owns ?? nothing}
    lang=${lang ?? nothing}
    aria-rowspan=${rowSpan ?? nothing}
    aria-colspan=${colSpan ?? nothing}
    >${imageTemplate}${children.map(renderNode)}</span
  >`;
}

/**
 * Exposes the structure of a tagged PDF page to assistive technology, as `buildStructure()` builds it.
 */
export class PdfViewerStructureLayer {
  /**
   * @param {import('./pdf-viewer-page-model.js').PdfViewerStructNode} structure
   */
  constructor(structure) {
    const container = document.createElement('div');
    render(renderNode(structure), container);
    this.element = container.firstElementChild;
    this.element.className = 'struct-tree';
  }
}
