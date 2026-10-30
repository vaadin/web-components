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
 * @license pdf.js 6.4.299
 *
 * Copyright 2014 Mozilla Foundation
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
import { css } from 'lit';

/* Adapted from the text layer styles in pdf_viewer.css of pdf.js */
export const pdfViewerTextLayerStyles = css`
  .text-layer {
    position: absolute;
    inset: 0;
    overflow: clip;
    line-height: 1;
    text-align: initial;
    letter-spacing: normal;
    word-spacing: normal;
    -webkit-text-size-adjust: none;
    text-size-adjust: none;
    forced-color-adjust: none;
    transform-origin: 0 0;
    caret-color: CanvasText;
    /* Prevent host styles from affecting pdf.js */
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    font-stretch: normal;
    font-feature-settings: normal;
    font-variation-settings: normal;
    font-kerning: auto;
    text-transform: none;
    text-indent: 0;
    tab-size: 8;
    writing-mode: horizontal-tb;
    /* The page is white paper, also in a dark color scheme */
    color-scheme: only light;
    z-index: 0;
    --min-font-size: 1;
    --text-scale-factor: calc(var(--total-scale-factor) * var(--min-font-size));
    --min-font-size-inv: calc(1 / var(--min-font-size));
  }

  .text-layer :is(span, br) {
    position: absolute;
    color: transparent;
    white-space: pre;
    cursor: text;
    transform-origin: 0% 0%;
    -webkit-user-select: text;
    user-select: text;
  }

  .text-layer > :not(.markedContent),
  .text-layer .markedContent span:not(.markedContent) {
    z-index: 1;
    --font-height: 0;
    font-size: calc(var(--text-scale-factor) * var(--font-height));
    --scale-x: 1;
    --rotate: 0deg;
    transform: rotate(var(--rotate)) scaleX(var(--scale-x)) scale(var(--min-font-size-inv));
  }

  .text-layer .markedContent {
    display: contents;
  }

  .text-layer ::selection {
    color: transparent;
    background: Highlight;
  }

  .text-layer br::selection {
    background: transparent;
  }

  /* Keeps the selection from jumping to other pages when dragging over empty space */
  .text-layer .end-of-content {
    display: block;
    position: absolute;
    inset: 100% 0 0;
    z-index: 0;
    cursor: default;
    -webkit-user-select: none;
    user-select: none;
  }

  .text-layer.selecting .end-of-content {
    top: 0;
  }

  /* The text layer has the size of the unrotated page, and rotates with it */
  .text-layer[data-main-rotation='90'] {
    transform: rotate(90deg) translateY(-100%);
  }

  .text-layer[data-main-rotation='180'] {
    transform: rotate(180deg) translate(-100%, -100%);
  }

  .text-layer[data-main-rotation='270'] {
    transform: rotate(270deg) translateX(-100%);
  }
`;
