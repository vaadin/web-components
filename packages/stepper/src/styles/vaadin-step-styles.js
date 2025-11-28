/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const stepStyles = css`
  :host {
    display: block;
    position: relative;
    min-width: 0;
    font-family: var(--lumo-font-family);
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.5;
  }

  /* Content wrapper */
  a,
  div {
    display: flex;
    align-items: center;
    gap: var(--lumo-space-m);
    padding: var(--lumo-space-s);
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    outline: none;
    transition: color 0.2s;
  }

  :host([small]) a,
  :host([small]) div {
    gap: var(--lumo-space-s);
  }

  div {
    cursor: default;
  }

  /* Indicator (circle) */
  [part='indicator'] {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--lumo-size-m);
    height: var(--lumo-size-m);
    border: 2px solid var(--lumo-contrast-30pct);
    border-radius: 50%;
    background: var(--lumo-base-color);
    font-size: var(--lumo-font-size-s);
    font-weight: 500;
    color: var(--lumo-secondary-text-color);
    transition: all 0.2s;
  }

  :host([small]) [part='indicator'] {
    width: var(--lumo-size-xs);
    height: var(--lumo-size-xs);
    font-size: var(--lumo-font-size-xs);
  }

  /* Active state */
  :host([active]) [part='indicator'] {
    border-color: var(--lumo-primary-color);
    color: var(--lumo-primary-color);
  }

  /* Completed state */
  :host([completed]) [part='indicator'] {
    background: var(--lumo-primary-color);
    border-color: var(--lumo-primary-color);
    color: var(--lumo-primary-contrast-color);
  }

  /* Error state */
  :host([error]) [part='indicator'] {
    background: var(--lumo-error-color);
    border-color: var(--lumo-error-color);
    color: var(--lumo-error-contrast-color);
  }

  /* Content */
  [part='content'] {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
  }

  /* Label */
  [part='label'] {
    font-weight: 500;
    color: var(--lumo-body-text-color);
  }

  :host([small]) [part='label'] {
    font-size: var(--lumo-font-size-s);
  }

  :host([active]) [part='label'] {
    color: var(--lumo-primary-color);
  }

  :host([completed]) [part='label'] {
    color: var(--lumo-body-text-color);
  }

  :host([error]) [part='label'] {
    color: var(--lumo-error-color);
  }

  :host(:not([active]):not([completed]):not([error])) [part='label'] {
    color: var(--lumo-secondary-text-color);
  }

  /* Description */
  [part='description'] {
    font-size: var(--lumo-font-size-s);
    color: var(--lumo-secondary-text-color);
    margin-top: var(--lumo-space-xs);
  }

  :host([small]) [part='description'] {
    font-size: var(--lumo-font-size-xs);
  }

  /* Horizontal orientation specific styles */
  :host([orientation='horizontal']) [part='label'],
  :host([orientation='horizontal']) [part='description'] {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Connector line */
  [part='connector'] {
    position: absolute;
    background: var(--lumo-contrast-30pct);
  }

  /* Vertical connector */
  :host([orientation='vertical']) [part='connector'] {
    position: absolute;
    left: calc(var(--lumo-size-m) / 2 + var(--lumo-space-s) - 1px);
    top: calc(var(--lumo-size-m) + var(--lumo-space-s));
    width: 2px;
    height: var(--lumo-space-l);
  }

  :host([orientation='vertical'][small]) [part='connector'] {
    left: calc(var(--lumo-size-xs) / 2 + var(--lumo-space-s) - 1px);
    top: calc(var(--lumo-size-xs) + var(--lumo-space-s));
    height: var(--lumo-space-m);
  }

  /* Horizontal connector */
  :host([orientation='horizontal']) [part='connector'] {
    top: 50%;
    left: 100%;
    right: calc(var(--lumo-space-l) * -1);
    height: 2px;
    transform: translateY(-50%);
  }

  /* Hide connector for last step */
  :host([last]) [part='connector'] {
    display: none;
  }

  /* Hover effects */
  a:hover [part='indicator']:not(:host([disabled]) [part='indicator']) {
    border-color: var(--lumo-primary-color-50pct);
  }

  a:hover [part='label']:not(:host([disabled]) [part='label']) {
    color: var(--lumo-primary-text-color);
  }

  /* Focus styles */
  a:focus-visible {
    outline: 2px solid var(--lumo-primary-color);
    outline-offset: 2px;
    border-radius: var(--lumo-border-radius-m);
  }

  /* Icons in indicator */
  .checkmark,
  .error-icon,
  .step-number {
    line-height: 1;
  }

  /* RTL support */
  :host([dir='rtl']) [part='connector'] {
    left: auto;
    right: calc(var(--lumo-size-m) / 2);
    transform: translateX(50%);
  }

  :host([dir='rtl'][orientation='horizontal']) [part='connector'] {
    left: calc(var(--lumo-space-l) * -1);
    right: 100%;
  }
`;
