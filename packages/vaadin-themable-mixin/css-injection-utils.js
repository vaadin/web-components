/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

// Based on https://github.com/jouni/j-elements/blob/main/test/old-components/Stylable.js

/**
 * Check if the media query is a non-standard "element scoped selector", i.e. it does not contain any media feature queries, only media type.
 * @param  {MediaList} media
 * @return {Boolean}   True if the media query only contains a media type query
 */
function isElementMedia(media) {
  // TODO account for the 'and' combinator?
  // e.g. screen and (orientation: portrait) and (max-width: 400px) and x-foo
  // x-foo and x-bar
  return media && media.match(/^[\w]+-[\w.()[\]"'=~*^$]+/u);
}

/**
 * Check if an element matches a given selector
 * @param  {HTMLElement} el   The element which might match the selector
 * @param  {String} selector  The selector to match against
 * @return {Boolean}          undefined if the selector is not a valid CSS selector. True|false whether the element matches the selector or not.
 */
function matches(tagName, selector) {
  return tagName === selector;
}

/**
 * Check if the media type string matches the given element
 * @param  {HTMLElement} el  The element which might match the given media type string
 * @param  {MediaList} media MediaList object to match against
 * @return {Boolean}         undefined if the media type string is not a valid CSS selector or a standard media features query. True|false whether the element matches the selector or not.
 */
function matchesTag(tagName, media) {
  // Firefox parses the escaping backward slash into a double backward slash: \ -> \\
  media = media.replace(/\\/gmu, '');
  if (isElementMedia(media)) {
    return matches(tagName, media);
  }

  return undefined;
}

/**
 * Recursively process a style sheet for matching rules
 *
 * @param {CSSStyleSheet} styleSheet
 * @param {HTMLElement} element
 * @param {Function} collectorFunc
 */
function extractMatchingStyleRules(styleSheet, tagName, collectorFunc) {
  let media = '';

  if (styleSheet.ownerRule) {
    if (styleSheet.ownerRule.type === 3) {
      // @import
      // Need this awkward workaround since Firefox (sometimes?) blocks the access to the MediaList
      // object for some reason in imported stylesheets
      const importRule = styleSheet.ownerRule.cssText.split(' ');
      if (importRule.length > 2) {
        media = importRule.slice(2).join(' ').replace(';', '');
      }
    }
  } else if (styleSheet.ownerNode) {
    media = styleSheet.ownerNode.media;
  } else if (styleSheet.media) {
    media = styleSheet.media.mediaText;
  }

  // TODO @import sheets should be inserted as the first ones in the results
  // Now they can end up in the middle of other rules and be ignored

  const match = matchesTag(tagName, media);
  if (match !== undefined) {
    // Not a standard media query (no media features specified, only media type)
    if (match) {
      // Media type matches the element
      collectorFunc(styleSheet.cssRules);
    }
  } else {
    // Either no media specified or a standard media query
    for (const rule of styleSheet.cssRules) {
      if (rule.type === 3) {
        // @import
        extractMatchingStyleRules(rule.styleSheet, tagName, collectorFunc);
      } else if (rule.type === 4) {
        // @media
        if (matchesTag(tagName, rule.media.mediaText)) {
          collectorFunc(rule.cssRules);
        }
      }
    }
  }
}

/**
 * @param {DocumentOrShadowRoot} root
 * @param {string} tagName
 * @return {CSSRuleList[]}
 */
export function gatherMatchingCSSRules(root, tagName) {
  const matchingRules = [];

  [...root.adoptedStyleSheets, ...root.styleSheets].forEach((sheet) => {
    extractMatchingStyleRules(sheet, tagName, (rules) => matchingRules.push(rules));
  });

  return matchingRules;
}
