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
function matches(el, selector) {
  try {
    return el.matches(selector);
  } catch (_) {
    // Not a valid selector (such as an empty string)
    return undefined;
  }
}

/**
 * Check if the media type string matches the given element
 * @param  {HTMLElement} el  The element which might match the given media type string
 * @param  {MediaList} media MediaList object to match against
 * @return {Boolean}         undefined if the media type string is not a valid CSS selector or a standard media features query. True|false whether the element matches the selector or not.
 */
function matchesElement(el, media) {
  // Firefox parses the escaping backward slash into a double backward slash: \ -> \\
  media = media.replace(/\\/gmu, '');
  if (isElementMedia(media)) {
    return matches(el, media);
  }

  return undefined;
}

// Recursively process a style sheet for matching rules
function extractMatchingStyleRules(styleSheet, element, collectorFunc) {
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

  const match = matchesElement(element, media);
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
        extractMatchingStyleRules(rule.styleSheet, element, collectorFunc);
      } else if (rule.type === 4) {
        // @media
        if (matchesElement(element, rule.media.mediaText)) {
          collectorFunc(rule.cssRules);
        }
      }
    }
  }
}

function processSheetsArray(sheets, element) {
  const matchingRules = [];

  for (const sheet of sheets) {
    extractMatchingStyleRules(sheet, element, (rules) => matchingRules.push(rules));
  }

  return matchingRules;
}

export function gatherMatchingStyleRules(instance) {
  const matchingRules = [];

  // Global stylesheets
  if (document.adoptedStyleSheets) {
    matchingRules.push(...processSheetsArray(document.adoptedStyleSheets, instance));
  }

  matchingRules.push(...processSheetsArray(document.styleSheets, instance));

  // Scoped stylesheets

  // NOTE: can be needed for embedded components where Lumo will only
  // be loaded in a shadow root but should not leak to the host page.
  // See e.g. https://github.com/vaadin/flow/issues/12704
  const root = instance.getRootNode();
  if (root !== document) {
    if (root.adoptedStyleSheets) {
      matchingRules.push(...processSheetsArray(root.adoptedStyleSheets, instance));
    }
    matchingRules.push(...processSheetsArray(root.styleSheets, instance));
  }

  return matchingRules;
}
