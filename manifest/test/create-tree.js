import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * Creates a checkout with the given files in a temporary directory, removed after the test.
 * @param {import('node:test').TestContext} t
 * @param {Record<string, string>} files the content by path relative to the checkout
 * @return {string} the checkout directory
 */
export function createTree(t, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-test-'));
  t.after(() => fs.rmSync(root, { recursive: true }));
  for (const [file, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), content);
  }
  return root;
}
