/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

// Based on https://github.com/jouni/j-elements/blob/main/test/old-components/Stylable.js

/**
 * Returns the type of the rule as a string, e.g.
 * 'CSSImportRule', 'CSSMediaRule', etc.
 *
 * @param {CSSRule} rule
 * @return {string}
 */
function getCSSRuleType(rule) {
  return rule.constructor.name;
}

/**
 * Returns the media query string for the given stylesheet.
 *
 * @param {CSSStyleSheet} styleSheet
 * @return {string}
 */
function getCSSStyleSheetMediaText(styleSheet) {
  if (styleSheet.ownerRule) {
    if (getCSSRuleType(styleSheet.ownerRule) === 'CSSImportRule') {
      // @import
      // Need this awkward workaround since Firefox (sometimes?) blocks the access to the MediaList
      // object for some reason in imported stylesheets
      const importRule = styleSheet.ownerRule.cssText.split(' ');
      if (importRule.length > 2) {
        return importRule.slice(2).join(' ').replace(';', '');
      }
    }
  } else if (styleSheet.ownerNode) {
    return styleSheet.ownerNode.media;
  } else if (styleSheet.media) {
    return styleSheet.media.mediaText;
  }

  return '';
}

/**
 * Check if the media query is a non-standard "tag scoped selector".
 *
 * Examples of such media queries:
 * - `@media vaadin-text-field { ... }`
 * - `@import "styles.css" vaadin-text-field`.
 *
 * @param {string} media
 * @return {boolean}
 */
function isTagScopedMedia(media) {
  return /^\w+(-\w+)+$/u.test(media);
}

/**
 * Check if the media query string matches the given tag name.
 *
 * @param {string} media
 * @param {string} tagName
 * @return {boolean}
 */
function matchesTagScopedMedia(media, tagName) {
  return media === tagName;
}

/**
 * Recursively processes a style sheet for matching "tag scoped" rules.
 *
 * @param {CSSStyleSheet} styleSheet
 * @param {string} tagName
 */
function collectStyleSheetTagScopedCSSRules(styleSheet, tagName) {
  // TODO @import sheets should be inserted as the first ones in the results
  // Now they can end up in the middle of other rules and be ignored

  const styleSheetMedia = getCSSStyleSheetMediaText(styleSheet);
  if (isTagScopedMedia(styleSheetMedia)) {
    if (matchesTagScopedMedia(styleSheetMedia, tagName)) {
      return [...styleSheet.cssRules];
    }

    return [];
  }

  const matchingRules = [];

  for (const rule of styleSheet.cssRules) {
    const ruleType = getCSSRuleType(rule);

    if (ruleType === 'CSSImportRule') {
      matchingRules.push(...collectStyleSheetTagScopedCSSRules(rule.styleSheet, tagName));
    }

    if (ruleType === 'CSSMediaRule' && matchesTagScopedMedia(rule.media.mediaText, tagName)) {
      matchingRules.push(...rule.cssRules);
    }
  }

  return matchingRules;
}

/**
 * Recursively processes style sheets of the specified root element, including both
 * `adoptedStyleSheets` and regular `styleSheets`, and returns all CSS rules from
 * `@media` and `@import` blocks where the media query is (a) "tag scoped selector",
 * and (b) matches the specified tag name.
 *
 * Examples of such media queries:
 * - `@media vaadin-text-field { ... }`
 * - `@import "styles.css" vaadin-text-field`
 *
 * The returned rules are ordered in the same way as they are in the original stylesheet.
 *
 * @param {DocumentOrShadowRoot} root
 * @param {string} tagName
 * @return {CSSRule[]}
 */
export function collectTagScopedCSSRules(root, tagName) {
  return [...root.adoptedStyleSheets, ...root.styleSheets].flatMap((styleSheet) =>
    collectStyleSheetTagScopedCSSRules(styleSheet, tagName),
  );
}
