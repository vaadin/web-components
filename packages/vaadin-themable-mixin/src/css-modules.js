/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/** @type {WeakMap<CSSStyleSheet, Record<string, Map>>} */
const cache = new WeakMap();

export function parseStyleSheet(
  styleSheet,
  result = {
    tags: new Map(),
    modules: new Map(),
  },
) {
  let cssRules;
  try {
    cssRules = styleSheet.cssRules;
  } catch {
    // External stylesheets may not be accessible due to CORS security restrictions.
    cssRules = [];
  }

  for (const rule of cssRules) {
    const { media } = rule;

    if (rule instanceof CSSImportRule) {
      if (media?.mediaText.startsWith('lumo_')) {
        result.modules.set(media.mediaText, [...rule.styleSheet.cssRules]);
      } else {
        parseStyleSheet(rule.styleSheet, result);
      }

      continue;
    }

    if (rule instanceof CSSMediaRule) {
      if (media?.mediaText.startsWith('lumo_')) {
        result.modules.set(media.mediaText, [...rule.cssRules]);
      }

      continue;
    }

    if (rule instanceof CSSStyleRule && rule.cssText.includes('-css-inject')) {
      for (const property of rule.style) {
        const tagName = property.match(/^--(.*)-css-inject-modules$/u)?.[1];
        if (!tagName) {
          continue;
        }

        const value = rule.style.getPropertyValue(property);

        result.tags.set(
          tagName,
          value.split(',').map((module) => module.trim().replace(/'|"/gu, '')),
        );
      }

      continue;
    }
  }

  return result;
}

export function parseStyleSheets(styleSheets) {
  let tags = new Map();
  let modules = new Map();

  for (const styleSheet of styleSheets) {
    let result = cache.get(styleSheet);
    if (!result) {
      result = parseStyleSheet(styleSheet);
      cache.set(styleSheet, result);
    }

    tags = new Map([...tags, ...result.tags]);
    modules = new Map([...modules, ...result.modules]);
  }

  return { tags, modules };
}
