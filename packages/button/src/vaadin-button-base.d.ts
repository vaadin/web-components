/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { CSSResult, TemplateResult } from 'lit';

export const buttonStyles: CSSResult;

export function buttonTemplate<
  T extends HTMLTemplateElement | TemplateResult,
  F extends (strings: TemplateStringsArray, ...values: any[]) => T,
>(tag: F): T;
