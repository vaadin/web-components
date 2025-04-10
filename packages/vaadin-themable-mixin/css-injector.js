import StyleObserver from 'style-observer';
import { gatherMatchingStyleRules } from './css-injection-utils.js';

function injectStyleSheet(element, stylesheet) {
  const { shadowRoot } = element;
  if (shadowRoot.adoptedStyleSheets.includes(stylesheet)) {
    return;
  }
  shadowRoot.adoptedStyleSheets.unshift(stylesheet);
}

function removeStyleSheet(element, stylesheet) {
  const { shadowRoot } = element;

  const index = shadowRoot.adoptedStyleSheets.indexOf(stylesheet);
  if (index !== -1) {
    shadowRoot.adoptedStyleSheets.splice(index, 1);
  }
}

export class CssInjector {
  /** @type {Document | ShadowRoot} */
  root;

  /** @type {Map<string, Element[]>} */
  componentsByTag;

  /** @type {Map<string, CSSStyleSheet>} */
  styleSheetsByTag;

  /** @type {StyleObserver} */
  styleObserver;

  constructor(root) {
    this.root = root;
    this.componentsByTag = new Map();
    this.styleSheetsByTag = new Map();

    this.styleObserver = new StyleObserver((records) => {
      records.forEach((record) => {
        const { property, value, oldValue } = record;
        const tagName = property.slice(2).replace('-css-inject', '');
        if (value === '1') {
          this.componentStylesAdded(tagName);
        } else if (oldValue === '1') {
          this.componentStylesRemoved(tagName);
        }
      });
    });
  }

  componentConnected(component) {
    const { is: tagName, cssInjectPropName } = component.constructor;

    if (this.componentsByTag.has(tagName)) {
      this.componentsByTag.get(tagName).add(component);
    } else {
      this.componentsByTag.set(tagName, new Set([component]));
    }

    const stylesheet = this.styleSheetsByTag.get(tagName);
    if (stylesheet) {
      injectStyleSheet(component, stylesheet);
      return;
    }

    // If styles for custom property are already loaded for this root,
    // store corresponding tag name so that we can inject styles
    const value = getComputedStyle(this.rootHost).getPropertyValue(cssInjectPropName);
    if (value === '1') {
      this.componentStylesAdded(tagName);
    }

    // Observe custom property that would trigger injection for this class
    this.styleObserver.observe(this.rootHost, cssInjectPropName);
  }

  componentDisconnected(component) {
    const tagName = component.constructor.is;

    const stylesheet = this.styleSheetsByTag.get(tagName);
    if (stylesheet) {
      removeStyleSheet(component, stylesheet);
    }

    this.componentsByTag.get(tagName)?.delete(component);
  }

  componentStylesAdded(tagName) {
    const stylesheet = this.styleSheetsByTag.get(tagName) || new CSSStyleSheet();

    const cssText = gatherMatchingStyleRules(tagName, this.root)
      .flatMap((ruleList) => [...ruleList])
      .map((rule) => rule.cssText)
      .join('\n');
    stylesheet.replaceSync(cssText);

    this.componentsByTag.get(tagName)?.forEach((component) => {
      injectStyleSheet(component, stylesheet);
    });

    this.styleSheetsByTag.set(tagName, stylesheet);
  }

  componentStylesRemoved(tagName) {
    const stylesheet = this.styleSheetsByTag.get(tagName);
    if (stylesheet) {
      this.componentsByTag.get(tagName)?.forEach((component) => {
        removeStyleSheet(component, stylesheet);
      });
    }
    this.styleSheetsByTag.delete(tagName);
  }

  get rootHost() {
    return this.root === document ? this.root.documentElement : this.root.host;
  }
}
