import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report },
} = stylelint;

const ruleName = 'custom-rules/content-with-css-escape';

const messages = {
  rejected: () =>
    'CSS unicode escapes in content properties must use double backslash (\\\\2003) not single backslash (\\2003) in JavaScript source',
};

const ruleFunction = () => {
  return (root, result) => {
    const input = result.root.source.input;

    // Only check .js and .ts files (CSS-in-JS), not .css files
    if (!input.file || !(input.file.endsWith('.js') || input.file.endsWith('.ts'))) {
      return;
    }

    root.walkDecls(/^content$/iu, (decl) => {
      // Get the actual source text of this declaration
      if (!decl.source || !decl.source.start || !input) {
        return;
      }

      const sourceText = input.css.substring(decl.source.start.offset, decl.source.end.offset + 1);

      // Check if this looks like a unicode escape pattern in the source
      // Pattern: content: '\XXXX' where XXXX is hex digits
      // This would indicate a SINGLE backslash in JavaScript source (wrong)
      const singleBackslashPattern = /content:\s*['"]\\[0-9a-fA-F]{4}['"]/u;

      if (!singleBackslashPattern.test(sourceText)) {
        return;
      }

      // Now check if it's actually a double backslash by counting backslashes in source
      // Extract the quoted value from source text
      const valueMatch = sourceText.match(/content:\s*(['"][^'"]*['"])/u);
      if (!valueMatch) {
        return;
      }

      const quotedValue = valueMatch[1];

      // Count consecutive backslashes before hex digits
      // Single backslash in source: '\ 2003' (1 backslash char)
      // Double backslash in source: '\\ 2003' (2 backslash chars)
      const backslashMatch = quotedValue.match(/(\\+)[0-9a-fA-F]{4}/u);
      if (!backslashMatch) {
        return;
      }

      const backslashCount = backslashMatch[1].length;

      // If only 1 backslash in source, it's an error (JavaScript will interpret as octal/escape)
      // Should be 2 backslashes in source (so JavaScript sees literal \ followed by digits)
      if (backslashCount === 1) {
        report({
          result,
          ruleName,
          message: messages.rejected(),
          node: decl,
          word: decl.prop,
          fix: () => {
            // Fix by doubling the backslash in the source
            // We need to use raws.value.raw to avoid double-escaping by PostCSS
            const fixedValue = decl.value.replace(/(["'])\\([0-9a-fA-F]{4})\1/u, '$1\\\\$2$1');

            if (!decl.raws.value) {
              decl.raws.value = {};
            }
            decl.raws.value.raw = fixedValue;
          },
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = { fixable: true };

export default createPlugin(ruleName, ruleFunction);
