/**
 * Polls `predicate` every 10 ms until it returns a truthy value, and returns that value.
 * Bounded below the 2 s test timeout, so a predicate that never holds fails with a clear message.
 */
export async function until<T = boolean>(predicate: () => T, timeout = 1500): Promise<NonNullable<T>> {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeout) {
      throw new Error(`Condition not met within ${timeout} ms: ${predicate}`);
    }
    await new Promise((r) => setTimeout(r, 10));
  }
  return predicate()!;
}
