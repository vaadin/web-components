/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { css } from 'lit';

export const contentStyles = css`
  [part='content'] {
    box-sizing: border-box;
    position: relative;
    flex: auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /*
    Quill core styles.
    CSS selectors removed: margin & padding reset, check list, indentation, video, colors, ordered & unordered list, h1-6, anchor
  */
  .ql-clipboard {
    left: -100000px;
    height: 1px;
    overflow-y: hidden;
    position: absolute;
    top: 50%;
  }

  .ql-clipboard p {
    margin: 0;
    padding: 0;
  }

  .ql-editor {
    box-sizing: border-box;
    line-height: 1.42;
    height: 100%;
    outline: none;
    overflow-y: auto;
    padding: 0.75em 1em;
    -moz-tab-size: 4;
    tab-size: 4;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
    flex: 1;
  }

  .ql-editor > * {
    cursor: text;
  }

  .ql-align-left {
    text-align: left;
  }

  .ql-direction-rtl {
    direction: rtl;
    text-align: inherit;
  }

  .ql-align-center {
    text-align: center;
  }

  .ql-align-justify {
    text-align: justify;
  }

  .ql-align-right {
    text-align: right;
  }

  /* lists */
  .ql-editor ol {
    --_item-indent: 1.5em;
    --_list-indent: calc(2 * var(--_item-indent));
    padding-inline-start: var(--_item-indent);
  }

  .ql-editor li {
    list-style-type: none;
    position: relative;
    padding-left: var(--_item-indent);
  }

  .ql-editor li > .ql-ui::before {
    display: inline-block;
    margin-left: -1.5em;
    margin-right: 0.3em;
    text-align: right;
    white-space: nowrap;
    width: 1.2em;
  }

  .ql-editor li[data-list='bullet'] > .ql-ui::before {
    content: '\\2022';
    font-size: 1.6rem;
    line-height: 1rem;
    align-self: baseline;
    vertical-align: text-top;
  }

  .ql-editor p,
  .ql-editor h1,
  .ql-editor h2,
  .ql-editor h3,
  .ql-editor h4,
  .ql-editor h5,
  .ql-editor h6 {
    counter-set: list-0 list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }

  /* 0 */
  .ql-editor li[data-list='ordered'] {
    counter-increment: list-0;
  }

  .ql-editor li[data-list='ordered'] > .ql-ui::before {
    content: counter(list-0, decimal) '. ';
  }

  /* 1 */
  .ql-editor li[data-list='ordered'].ql-indent-1 {
    counter-increment: list-1;
  }

  .ql-editor li[data-list='ordered'].ql-indent-1 > .ql-ui::before {
    content: counter(list-1, lower-alpha) '. ';
  }

  .ql-editor li[data-list].ql-indent-1 {
    counter-set: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }

  /* 2 */
  .ql-editor li[data-list='ordered'].ql-indent-2 {
    counter-increment: list-2;
  }

  .ql-editor li[data-list='ordered'].ql-indent-2 > .ql-ui::before {
    content: counter(list-2, lower-roman) '. ';
  }

  .ql-editor li[data-list].ql-indent-2 {
    counter-set: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }

  /* 3 */
  .ql-editor li[data-list='ordered'].ql-indent-3 {
    counter-increment: list-3;
  }

  .ql-editor li[data-list='ordered'].ql-indent-3 > .ql-ui::before {
    content: counter(list-3, decimal) '. ';
  }

  .ql-editor li[data-list].ql-indent-3 {
    counter-set: list-4 list-5 list-6 list-7 list-8 list-9;
  }

  /* 4 */
  .ql-editor li[data-list='ordered'].ql-indent-4 {
    counter-increment: list-4;
  }

  .ql-editor li[data-list='ordered'].ql-indent-4 > .ql-ui::before {
    content: counter(list-4, lower-alpha) '. ';
  }

  .ql-editor li[data-list].ql-indent-4 {
    counter-set: list-5 list-6 list-7 list-8 list-9;
  }

  /* 5 */
  .ql-editor li[data-list='ordered'].ql-indent-5 {
    counter-increment: list-5;
  }

  .ql-editor li[data-list='ordered'].ql-indent-5 > .ql-ui::before {
    content: counter(list-5, lower-roman) '. ';
  }

  .ql-editor li[data-list].ql-indent-5 {
    counter-set: list-6 list-7 list-8 list-9;
  }

  /* 6 */
  .ql-editor li[data-list='ordered'].ql-indent-6 {
    counter-increment: list-6;
  }

  .ql-editor li[data-list='ordered'].ql-indent-6 > .ql-ui::before {
    content: counter(list-6, decimal) '. ';
  }

  .ql-editor li[data-list].ql-indent-6 {
    counter-set: list-7 list-8 list-9;
  }

  /* 7 */
  .ql-editor li[data-list='ordered'].ql-indent-7 {
    counter-increment: list-7;
  }

  .ql-editor li[data-list='ordered'].ql-indent-7 > .ql-ui::before {
    content: counter(list-7, lower-alpha) '. ';
  }

  .ql-editor li[data-list].ql-indent-7 {
    counter-set: list-8 list-9;
  }

  /* 8 */
  .ql-editor li[data-list='ordered'].ql-indent-8 {
    counter-increment: list-8;
  }

  .ql-editor li[data-list='ordered'].ql-indent-8 > .ql-ui::before {
    content: counter(list-8, lower-roman) '. ';
  }

  .ql-editor li[data-list].ql-indent-8 {
    counter-set: list-9;
  }

  /* 9 */
  .ql-editor li[data-list='ordered'].ql-indent-9 {
    counter-increment: list-9;
  }

  .ql-editor li[data-list='ordered'].ql-indent-9 > .ql-ui::before {
    content: counter(list-9, decimal) '. ';
  }

  /* indent 1 */
  .ql-editor .ql-indent-1:not(.ql-direction-rtl) {
    padding-left: var(--_list-indent);
  }

  .ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) + var(--_item-indent));
  }

  .ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: var(--_list-indent);
  }

  .ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) + var(--_item-indent));
  }

  /* indent 2 */
  .ql-editor .ql-indent-2:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 2);
  }

  .ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 2 + var(--_item-indent));
  }

  .ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 2);
  }

  .ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 2 + var(--_item-indent));
  }

  /* indent 3 */
  .ql-editor .ql-indent-3:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 3);
  }

  .ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 3 + var(--_item-indent));
  }

  .ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 3);
  }

  .ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 3 + var(--_item-indent));
  }

  /* indent 4 */
  .ql-editor .ql-indent-4:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 4);
  }

  .ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 4 + var(--_item-indent));
  }

  .ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 4);
  }

  .ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 4 + var(--_item-indent));
  }

  /* indent 5 */
  .ql-editor .ql-indent-5:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 5);
  }

  .ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 5 + var(--_item-indent));
  }

  .ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 5);
  }

  .ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 5 + var(--_item-indent));
  }

  /* indent 6 */
  .ql-editor .ql-indent-6:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 6);
  }

  .ql-editor li.ql-indent-6:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 6 + var(--_item-indent));
  }

  .ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 6);
  }

  .ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 6 + var(--_item-indent));
  }

  /* indent 7 */
  .ql-editor .ql-indent-7:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 7);
  }

  .ql-editor li.ql-indent-7:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 7 + var(--_item-indent));
  }

  .ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 7);
  }

  .ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 7 + var(--_item-indent));
  }

  /* indent 8 */
  .ql-editor .ql-indent-8:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 8);
  }

  .ql-editor li.ql-indent-8:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 8 + var(--_item-indent));
  }

  .ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 8);
  }

  .ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 8 + var(--_item-indent));
  }

  /* indent 8 */
  .ql-editor .ql-indent-9:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 9);
  }

  .ql-editor li.ql-indent-9:not(.ql-direction-rtl) {
    padding-left: calc(var(--_list-indent) * 9 + var(--_item-indent));
  }

  .ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 9);
  }

  .ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: calc(var(--_list-indent) * 9 + var(--_item-indent));
  }

  .ql-editor li.ql-direction-rtl {
    padding-right: var(--_item-indent);
  }

  .ql-editor li.ql-direction-rtl > .ql-ui::before {
    margin-left: 0.3em;
    margin-right: -1.5em;
    text-align: left;
  }

  /* quill core end */

  blockquote {
    border-left: 0.25em solid #ccc;
    margin-bottom: 0.3125em;
    margin-top: 0.3125em;
    padding-left: 1em;
  }

  /* Quill converts <pre> to this */
  .ql-code-block-container {
    font-family: monospace;
    white-space: pre-wrap;
    margin-bottom: 0.3125em;
    margin-top: 0.3125em;
    padding: 0.3125em 0.625em;
    background-color: #f0f0f0;
    border-radius: 0.1875em;
  }

  img {
    max-width: 100%;
  }

  /* RTL specific styles */
  :host([dir='rtl']) .ql-editor {
    direction: rtl;
    text-align: right;
  }
`;
