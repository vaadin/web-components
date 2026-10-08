export class ElementNameMissingError extends Error {
  constructor(packageName: string) {
    super(`[${packageName}]: name is missing in element declaration`);
  }
}
