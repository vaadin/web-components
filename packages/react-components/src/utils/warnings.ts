/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const issuedWarnings = new Set();

export function issueWarning(warning: string) {
  if (issuedWarnings.has(warning)) {
    return;
  }

  issuedWarnings.add(warning);
  console.warn(warning);
}
