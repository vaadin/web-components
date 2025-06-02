/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

// Based on https://github.com/jouni/j-elements/blob/main/test/old-components/Stylable.js
const mediaRulesCache = new WeakMap();

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
 * Recursively processes a style sheet for media rules that match
 * the specified predicate.
 *
 * @param {CSSStyleSheet} styleSheet
 * @param {(rule: CSSRule) => boolean} predicate
 * @return {Array<CSSMediaRule | CSSImportRule>}
 */
function extractMediaRulesFromStyleSheet(styleSheet, predicate) {
  const result = [];

  for (const rule of styleSheet.cssRules) {
    const ruleType = rule.constructor.name;

    if (ruleType === 'CSSImportRule') {
      if (predicate(rule)) {
        result.push(rule);
      } else {
        result.push(...extractMediaRulesFromStyleSheet(rule.styleSheet, predicate));
      }
    }

    if (ruleType === 'CSSMediaRule') {
      if (predicate(rule)) {
        result.push(rule);
      }
    }
  }

  return result;
}

/**
 * Deduplicates media rules by their CSS text, keeping the last occurrence.
 *
 * @param {Array<CSSMediaRule | CSSImportRule>} rules
 * @return {Array<CSSMediaRule | CSSImportRule>}
 */
function deduplicateMediaRules(rules) {
  const seen = new Set();
  return rules.reduceRight((deduped, rule) => {
    const key = rule.styleSheet?.cssText ?? rule.cssText;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.unshift(rule);
    }
    return deduped;
  }, []);
}

/**
 * Extracts all CSS rules from a style sheet that are contained in media queries
 * with a "tag scoped selector" matching the specified tag name.
 *
 * This function caches the results for each style sheet to avoid
 * reprocessing the same style sheet multiple times.
 *
 * @param {CSSStyleSheet} styleSheet
 * @param {string} tagName
 * @return {CSSRule[]}
 */
function extractTagScopedCSSRulesFromStyleSheet(styleSheet, tagName) {
  let mediaRules = mediaRulesCache.get(styleSheet);
  if (!mediaRules) {
    // Collect all media rules that look like "tag scoped selectors", e.g. "@media vaadin-text-field { ... }"
    mediaRules = extractMediaRulesFromStyleSheet(styleSheet, (rule) => isTagScopedMedia(rule.media.mediaText));

    // Remove duplicate media rules which may result from multiple imports of the same stylesheet
    mediaRules = deduplicateMediaRules(mediaRules);

    // Group rules by tag name specified in the media query
    mediaRules = Map.groupBy(mediaRules, (rule) => rule.media.mediaText);

    // Save the processed media rules in the cache
    mediaRulesCache.set(styleSheet, mediaRules);
  }

  return (mediaRules.get(tagName) ?? []).flatMap((mediaRule) =>
    Array.from(mediaRule.styleSheet?.cssRules ?? mediaRule.cssRules),
  );
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
export function extractTagScopedCSSRules(root, tagName) {
  const styleSheets = new Set(root.styleSheets);
  const adoptedStyleSheets = new Set(root.adoptedStyleSheets);

  return [...styleSheets.union(adoptedStyleSheets)].flatMap((styleSheet) => {
    return extractTagScopedCSSRulesFromStyleSheet(styleSheet, tagName);
  });
}
