/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { CSSResult, TemplateResult } from 'lit';

export const styles: CSSResult;

export function template<
  T extends HTMLTemplateElement | TemplateResult,
  F extends (strings: TemplateStringsArray, ...values: any[]) => T,
>(tag: F): T;
