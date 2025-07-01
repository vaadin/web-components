/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/** @type {WeakMap<CSSStyleSheet, Record<string, Map>>} */
const cache = new WeakMap();

function parseStyleSheet(
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

    if (rule instanceof CSSStyleRule && rule.cssText.includes('-lumo-inject')) {
      for (const property of rule.style) {
        const tagName = property.match(/^--(.*)-lumo-inject-modules$/u)?.[1];
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

/**
 * Parses the provided CSSStyleSheet objects and returns an object with
 * tag-to-modules mappings and module rules.
 *
 * Modules are defined using CSS media rules with names starting with `lumo_`:
 *
 * ```css
 * \@media lumo_base-field {
 *  #label {
 *    color: gray;
 *  }
 * }
 *
 * \@media lumo_text-field {
 *   #input {
 *     color: yellow;
 *   }
 * }
 * ```
 *
 * Also, an entire CSS import can be defined as a module:
 *
 * ```css
 * \@import 'lumo-base-field.css' lumo_base-field;
 * ```
 *
 * Tag-to-modules mappings are defined as CSS custom properties that list
 * the module names to be applied to specific tags, e.g. `vaadin-text-field`:
 *
 * ```css
 * html {
 *   --vaadin-text-field-lumo-inject-modules:
 *      lumo_base-field,
 *      lumo_text-field;
 * }
 * ```
 *
 * Example output:
 *
 * ```js
 * {
 *   tags: Map {
 *    'vaadin-text-field': ['lumo_base-field', 'lumo_text-field']
 *   },
 *   modules: Map {
 *     'lumo_base-field': [CSSStyleRule],
 *     'lumo_text-field': [CSSStyleRule]
 *   }
 * }
 * ```
 *
 * @param {CSSStyleSheet[]} styleSheets - An array of CSSStyleSheet objects to parse.
 * @return {{tags: Map<string, string[]>, modules: Map<string, CSSRule[]>}}
 */
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
