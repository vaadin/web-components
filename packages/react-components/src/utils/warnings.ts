const issuedWarnings = new Set();

export function issueWarning(warning: string) {
  if (issuedWarnings.has(warning)) {
    return;
  }

  issuedWarnings.add(warning);
  console.warn(warning);
}
