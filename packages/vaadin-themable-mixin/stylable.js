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
  } catch {
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

/**
 * Convert an array of CSSRuleList objects into a string of CSS
 * @param  {Array} ruleListArray Array of CSSRuleList objects
 * @return {String}              The CSS from all the rules in the array
 */
function rulesToString(ruleListArray) {
  let styleString = '';
  ruleListArray.forEach((ruleList) => {
    for (const rule of ruleList) {
      styleString += `${rule.cssText}\n`;
    }
  });
  return styleString;
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

function linkOrStylePromise(linkOrStyle) {
  // <style> without any @imports will not fire a load event so we need to resolve immmediately
  if (linkOrStyle.nodeName === 'STYLE') {
    // Remove comments and check if there are @imports
    const hasImports = linkOrStyle.textContent.replace(/\/\*[\s\S]*?(?=\*\/)\*\//gmu, '').indexOf('@import');
    if (hasImports) {
      return linkOrStyle.sheet;
    }
  }

  return new Promise((resolve, _) => {
    const resolveFunc = () => {
      resolve(linkOrStyle.sheet);
      window.removeEventListener('load', resolveFunc);
    };

    linkOrStyle.addEventListener('load', resolveFunc);
    // Stylesheets with @imports that get 404 will cause them to error. The rest of the stylesheet
    // is still parsed and applied
    linkOrStyle.addEventListener('error', resolveFunc);

    // TODO sometimes Chrome does not fire the load event for some of the stylesheets (when the page
    // loads really fast), so we fall back to full page load event
    if (linkOrStyle.nodeName === 'LINK') {
      window.addEventListener('load', resolveFunc);
    }
  });
}

let globalStyleSheetsLoadedPromise;
let globalStyleSheetCount = 0;

function globalStyleSheetsLoaded() {
  const linkOrStyleElements = document.querySelectorAll('link[rel="stylesheet"], style');

  // Cache, but account for style sheets inserted dynamically during initial page load
  if (!globalStyleSheetsLoadedPromise || globalStyleSheetCount < linkOrStyleElements.length) {
    const promises = [];

    const linkOrStyleElements = document.querySelectorAll('link[rel="stylesheet"], style');
    for (const el of linkOrStyleElements) {
      promises.push(linkOrStylePromise(el));
    }

    globalStyleSheetCount = linkOrStyleElements.length;
    globalStyleSheetsLoadedPromise = Promise.all(promises);
  }

  return globalStyleSheetsLoadedPromise;
}

function processSheetsArray(sheets, el, matchingStyleRules) {
  for (const sheet of sheets) {
    extractMatchingStyleRules(sheet, el, (rules) => {
      matchingStyleRules.push(rules);
    });
  }
}

export const Stylable = (superClass) =>
  class extends superClass {
    connectedCallback() {
      this.applyMatchingStyleRules();
      if (super.connectedCallback) super.connectedCallback();
    }

    disconnectedCallback() {
      this.cleanupStyleRules();
      if (super.disconnectedCallback) super.disconnectedCallback();
    }

    async applyMatchingStyleRules() {
      this.cleanupStyleRules();

      const matchingStyleRules = await this.gatherMatchingStyleRules();

      if (matchingStyleRules.length > 0) {
        // TODO could probably utilize adoptedStyleSheets when available, to limit the amount of created stylesheets (cache)
        // TODO should cache the style elements (based on hashed the text content?) so that we can simply clone those instead of creating new ones
        // See https://github.com/Polymer/polymer/issues/4940#issuecomment-614213287 for the reason ("Cloning <style> helps trigger the deduplication optimization that browsers implement")
        const style = document.createElement('style');
        style.setAttribute('stylable-mixin', '');
        style.textContent = rulesToString(matchingStyleRules);
        this.shadowRoot.appendChild(style);
      }
    }

    cleanupStyleRules() {
      const styleSheets = this.shadowRoot?.querySelectorAll('style[stylable-mixin]') ?? [];
      for (const sheet of styleSheets) {
        this.shadowRoot.removeChild(sheet);
      }
    }

    async gatherMatchingStyleRules() {
      const matchingStyleRules = [];

      // Global stylesheets
      if (performance.timing.loadEventEnd) {
        // Page has already loaded, document.styleSheets is populated
        for (const sheet of document.styleSheets) {
          extractMatchingStyleRules(sheet, this, (rules) => {
            matchingStyleRules.push(rules);
          });
        }
      } else {
        // Need to jump through hoops to get all global stylesheets since they might still be loading
        const sheets = await globalStyleSheetsLoaded();
        processSheetsArray(sheets, this, matchingStyleRules);
      }

      // Scoped stylesheets
      const root = this.getRootNode();
      if (root !== document) {
        if (root.adoptedStyleSheets) {
          processSheetsArray(root.adoptedStyleSheets, this, matchingStyleRules);
        }
        processSheetsArray(root.styleSheets, this, matchingStyleRules);
      }

      return matchingStyleRules;
    }
  };
