import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { TestContext } from 'node:test';

/**
 * Creates a checkout with the given files in a temporary directory, removed after the test.
 * @param files the content by path relative to the checkout
 * @return the checkout directory
 */
export function createTree(t: TestContext, files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-test-'));
  t.after(() => fs.rmSync(root, { recursive: true }));
  for (const [file, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), content);
  }
  return root;
}
