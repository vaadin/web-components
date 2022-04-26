/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirHelper } from './dir-helper.js';

/**
 * Array of Vaadin custom element classes that have been subscribed to the dir changes.
 */
const directionSubscribers = [];
function directionUpdater() {
  const documentDir = getDocumentDir();
  directionSubscribers.forEach((element) => {
    alignDirs(element, documentDir);
  });
}

let scrollType;

const directionObserver = new MutationObserver(directionUpdater);
directionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

function alignDirs(element, documentDir, elementDir = element.getAttribute('dir')) {
  if (documentDir) {
    element.setAttribute('dir', documentDir);
  } else if (elementDir != null) {
    element.removeAttribute('dir');
  }
}

function getDocumentDir() {
  return document.documentElement.getAttribute('dir');
}

/**
 * A mixin to handle `dir` attribute based on the one set on the `<html>` element.
 *
 * @polymerMixin
 */
export const DirMixin = (superClass) =>
  class VaadinDirMixin extends superClass {
    static get properties() {
      return {
        /**
         * @protected
         */
        dir: {
          type: String,
          value: '',
          reflectToAttribute: true,
          converter: {
            fromAttribute: (attr) => {
              return !attr ? '' : attr;
            },
            toAttribute: (prop) => {
              return prop === '' ? null : prop;
            },
          },
        },
      };
    }

    /** @protected */
    static finalize() {
      super.finalize();

      if (!scrollType) {
        scrollType = DirHelper.detectScrollType();
      }
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (!this.hasAttribute('dir')) {
        this.__subscribe();
        alignDirs(this, getDocumentDir(), null);
      }
    }

    /** @protected */
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);
      if (name !== 'dir') {
        return;
      }

      const documentDir = getDocumentDir();

      // New value equals to the document direction and the element is not subscribed to the changes
      const newValueEqlDocDir = newValue === documentDir && directionSubscribers.indexOf(this) === -1;
      // Value was emptied and the element is not subscribed to the changes
      const newValueEmptied = !newValue && oldValue && directionSubscribers.indexOf(this) === -1;
      // New value is different and the old equals to document direction and the element is not subscribed to the changes
      const newDiffValue = newValue !== documentDir && oldValue === documentDir;

      if (newValueEqlDocDir || newValueEmptied) {
        this.__subscribe();
        alignDirs(this, documentDir, newValue);
      } else if (newDiffValue) {
        this.__subscribe(false);
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.__subscribe(false);
      this.removeAttribute('dir');
    }

    /** @protected */
    _valueToNodeAttribute(node, value, attribute) {
      // Override default Polymer attribute reflection to match native behavior of HTMLElement.dir property
      // If the property contains an empty string then it should not create an empty attribute
      if (attribute === 'dir' && value === '' && !node.hasAttribute('dir')) {
        return;
      }
      super._valueToNodeAttribute(node, value, attribute);
    }

    /** @protected */
    _attributeToProperty(attribute, value, type) {
      // Override default Polymer attribute reflection to match native behavior of HTMLElement.dir property
      // If the attribute is removed, then the dir property should contain an empty string instead of null
      if (attribute === 'dir' && !value) {
        this.dir = '';
      } else {
        super._attributeToProperty(attribute, value, type);
      }
    }

    /** @private */
    __subscribe(push = true) {
      if (push) {
        if (!directionSubscribers.includes(this)) {
          directionSubscribers.push(this);
        }
      } else if (directionSubscribers.includes(this)) {
        directionSubscribers.splice(directionSubscribers.indexOf(this), 1);
      }
    }

    /**
     * @param {Element} element
     * @return {number}
     * @protected
     */
    __getNormalizedScrollLeft(element) {
      return DirHelper.getNormalizedScrollLeft(scrollType, this.getAttribute('dir') || 'ltr', element);
    }

    /**
     * @param {Element} element
     * @param {number} scrollLeft
     * @protected
     */
    __setNormalizedScrollLeft(element, scrollLeft) {
      return DirHelper.setNormalizedScrollLeft(scrollType, this.getAttribute('dir') || 'ltr', element, scrollLeft);
    }
  };
