/**
 * CEM analyzer plugin that adds the missing outer pipes to Markdown tables in
 * descriptions. Most JSDoc tables have none, and some Markdown parsers, such as
 * the one of Storybook docs, only detect a table whose rows start with `|`.
 */

const SEPARATOR = /^ *\|? *:?-+:? *\|[-| :]*$/u;

/**
 * @param {string} markdown
 * @return {string} the Markdown with a leading and a trailing pipe in every table row
 */
export function addTablePipes(markdown) {
  const lines = markdown.split('\n');
  lines.forEach((line, i) => {
    if (i === 0 || !SEPARATOR.test(line) || !lines[i - 1].includes('|')) {
      return;
    }
    // The header is the line above the separator, the body ends at the first line without a pipe
    for (let row = i - 1; row < lines.length && lines[row].includes('|'); row++) {
      let text = lines[row].trim();
      if (!text.startsWith('|')) {
        text = `| ${text}`;
      }
      // Single-column tables already have a trailing pipe, adding another one creates an empty column
      if (!text.endsWith('|')) {
        text = `${text} |`;
      }
      lines[row] = text;
    }
  });
  return lines.join('\n');
}

/** Fixes the tables in the `description` of an item and of all items nested in it. */
function fixDescriptions(value) {
  if (Array.isArray(value)) {
    value.forEach(fixDescriptions);
  } else if (value && typeof value === 'object') {
    if (typeof value.description === 'string') {
      value.description = addTablePipes(value.description);
    }
    Object.values(value).forEach(fixDescriptions);
  }
}

export function markdownTablesPlugin() {
  return {
    name: 'vaadin-markdown-tables',

    packageLinkPhase({ customElementsManifest }) {
      fixDescriptions(customElementsManifest);
    },
  };
}
