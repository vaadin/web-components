/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isElementHidden } from '@vaadin/a11y-base/src/focus-utils.js';
import { AbstractLayout } from './abstract-layout.js';

function isValidCSSLength(value) {
  // Check if the value is a valid CSS length and not `inherit` or `normal`,
  // which are also valid values for `word-spacing`, see:
  // https://drafts.csswg.org/css-text-3/#word-spacing-property
  return CSS.supports('word-spacing', value) && !['inherit', 'normal'].includes(value);
}

function naturalNumberOrOne(n) {
  if (typeof n === 'number' && n >= 1 && n < Infinity) {
    return Math.floor(n);
  }
  return 1;
}

/**
 * A class that implements the layout algorithm based on responsive steps.
 * Not intended for public use.
 *
 * @private
 */
export class ResponsiveStepsLayout extends AbstractLayout {
  constructor(host) {
    super(host, {
      mutationObserverOptions: {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['colspan', 'data-colspan', 'hidden'],
      },
    });
  }

  /** @override */
  connect() {
    if (this.isConnected) {
      return;
    }

    super.connect();

    this.__selectResponsiveStep();
    this.updateLayout();

    requestAnimationFrame(() => this.__selectResponsiveStep());
    requestAnimationFrame(() => this.updateLayout());
  }

  /** @override */
  disconnect() {
    if (!this.isConnected) {
      return;
    }

    super.disconnect();

    const { host } = this;
    host.$.layout.style.removeProperty('opacity');
    [...host.children].forEach((child) => {
      child.style.removeProperty('width');
      child.style.removeProperty('margin-left');
      child.style.removeProperty('margin-right');
      child.removeAttribute('label-position');
    });
  }

  /** @override */
  setProps(props) {
    const { responsiveSteps } = props;
    if (!Array.isArray(responsiveSteps)) {
      throw new Error('Invalid "responsiveSteps" type, an Array is required.');
    }

    if (responsiveSteps.length < 1) {
      throw new Error('Invalid empty "responsiveSteps" array, at least one item is required.');
    }

    responsiveSteps.forEach((step) => {
      if (naturalNumberOrOne(step.columns) !== step.columns) {
        throw new Error(`Invalid 'columns' value of ${step.columns}, a natural number is required.`);
      }

      if (step.minWidth !== undefined && !isValidCSSLength(step.minWidth)) {
        throw new Error(`Invalid 'minWidth' value of ${step.minWidth}, a valid CSS length required.`);
      }

      if (step.labelsPosition !== undefined && ['aside', 'top'].indexOf(step.labelsPosition) === -1) {
        throw new Error(
          `Invalid 'labelsPosition' value of ${step.labelsPosition}, 'aside' or 'top' string is required.`,
        );
      }
    });

    super.setProps(props);

    if (this.isConnected) {
      this.__selectResponsiveStep();
      this.updateLayout();
    }
  }

  /** @override */
  updateLayout() {
    const { host } = this;

    // Do not update layout when invisible
    if (!this.isConnected || isElementHidden(host)) {
      return;
    }

    /*
      The item width formula:

          itemWidth = colspan / columnCount * 100% - columnSpacing

      We have to subtract columnSpacing, because the column spacing space is taken
      by item margins of 1/2 * spacing on both sides
    */

    const style = getComputedStyle(host);
    const columnSpacing = style.getPropertyValue('--_column-spacing');

    const direction = style.direction;
    const marginStartProp = `margin-${direction === 'ltr' ? 'left' : 'right'}`;
    const marginEndProp = `margin-${direction === 'ltr' ? 'right' : 'left'}`;

    const containerWidth = host.offsetWidth;

    let col = 0;
    Array.from(host.children)
      .filter((child) => child.localName === 'br' || getComputedStyle(child).display !== 'none')
      .forEach((child, index, children) => {
        if (child.localName === 'br') {
          // Reset column count on line break
          col = 0;
          return;
        }

        const attrColspan = child.getAttribute('colspan') || child.getAttribute('data-colspan');
        let colspan;
        colspan = naturalNumberOrOne(parseFloat(attrColspan));

        // Never span further than the number of columns
        colspan = Math.min(colspan, this.__columnCount);

        const childRatio = colspan / this.__columnCount;
        child.style.width = `calc(${childRatio * 100}% - ${1 - childRatio} * ${columnSpacing})`;

        if (col + colspan > this.__columnCount) {
          // Too big to fit on this row, let's wrap it
          col = 0;
        }

        // At the start edge
        if (col === 0) {
          child.style.setProperty(marginStartProp, '0px');
        } else {
          child.style.removeProperty(marginStartProp);
        }

        const nextIndex = index + 1;
        const nextLineBreak = nextIndex < children.length && children[nextIndex].localName === 'br';

        // At the end edge
        if (col + colspan === this.__columnCount) {
          child.style.setProperty(marginEndProp, '0px');
        } else if (nextLineBreak) {
          const colspanRatio = (this.__columnCount - col - colspan) / this.__columnCount;
          child.style.setProperty(
            marginEndProp,
            `calc(${colspanRatio * containerWidth}px + ${colspanRatio} * ${columnSpacing})`,
          );
        } else {
          child.style.removeProperty(marginEndProp);
        }

        // Move the column counter
        col = (col + colspan) % this.__columnCount;

        if (child.localName === 'vaadin-form-item') {
          if (this.__labelsOnTop) {
            if (child.getAttribute('label-position') !== 'top') {
              child.__useLayoutLabelPosition = true;
              child.setAttribute('label-position', 'top');
            }
          } else if (child.__useLayoutLabelPosition) {
            delete child.__useLayoutLabelPosition;
            child.removeAttribute('label-position');
          }
        }
      });
  }

  /** @override */
  _onResize() {
    const { host } = this;
    if (isElementHidden(host)) {
      host.$.layout.style.opacity = '0';
      return;
    }

    this.__selectResponsiveStep();
    this.updateLayout();

    host.$.layout.style.opacity = '';
  }

  /** @override */
  _onMutation(records) {
    const shouldUpdateLayout = records.some(({ target }) => {
      return target === this.host || target.parentElement === this.host;
    });
    if (shouldUpdateLayout) {
      this.updateLayout();
    }
  }

  /** @private */
  __selectResponsiveStep() {
    if (!this.isConnected) {
      return;
    }

    const { host, props } = this;
    // Iterate through responsiveSteps and choose the step
    let selectedStep;
    const tmpStyleProp = 'background-position';
    props.responsiveSteps.forEach((step) => {
      // Convert minWidth to px units for comparison
      host.$.layout.style.setProperty(tmpStyleProp, step.minWidth);
      const stepMinWidthPx = parseFloat(getComputedStyle(host.$.layout).getPropertyValue(tmpStyleProp));

      // Compare step min-width with the host width, select the passed step
      if (stepMinWidthPx <= host.offsetWidth) {
        selectedStep = step;
      }
    });
    host.$.layout.style.removeProperty(tmpStyleProp);

    // Sometimes converting units is not possible, e.g, when element is
    // not connected. Then the `selectedStep` stays `undefined`.
    if (selectedStep) {
      // Apply the chosen responsive step's properties
      this.__columnCount = selectedStep.columns;
      this.__labelsOnTop = selectedStep.labelsPosition === 'top';
    }
  }
}
