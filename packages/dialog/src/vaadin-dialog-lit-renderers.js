/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/* eslint-disable max-classes-per-file */
import { directive } from 'lit/directive.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { LitRendererDirective } from '@vaadin/lit-renderer';

const RUN_RENDERER_DEBOUNCER = Symbol('runRendererDebouncer');

class AbstractDialogRendererDirective extends LitRendererDirective {
  /**
   * A property to that the renderer callback will be assigned.
   *
   * @abstract
   */
  rendererProperty;

  /**
   * Adds the renderer callback to the dialog.
   */
  addRenderer() {
    this.element[this.rendererProperty] = (root, dialog) => {
      this.renderRenderer(root, dialog);
    };
  }

  /**
   * Runs the renderer callback on the dialog.
   */
  runRenderer() {
    this.element[RUN_RENDERER_DEBOUNCER] = Debouncer.debounce(this.element[RUN_RENDERER_DEBOUNCER], microTask, () => {
      this.element.requestContentUpdate();
    });
  }

  /**
   * Removes the renderer callback from the dialog.
   */
  removeRenderer() {
    this.element[this.rendererProperty] = null;
  }
}

export class DialogRendererDirective extends AbstractDialogRendererDirective {
  rendererProperty = 'renderer';
}

export class DialogHeaderRendererDirective extends AbstractDialogRendererDirective {
  rendererProperty = 'headerRenderer';
}

export class DialogFooterRendererDirective extends AbstractDialogRendererDirective {
  rendererProperty = 'footerRenderer';
}

/**
 * A Lit directive for populating the content of the dialog.
 *
 * ```js
 * `<vaadin-dialog
 *   ${dialogRenderer((dialog) => html`...`)}
 * ></vaadin-dialog>`
 * ```
 */
export const dialogRenderer = directive(DialogRendererDirective);

/**
 * A Lit directive for populating the content of the dialog header.
 *
 * ```js
 * `<vaadin-dialog
 *   ${dialogHeaderRenderer((dialog) => html`...`)}
 * ></vaadin-dialog>`
 * ```
 */
export const dialogHeaderRenderer = directive(DialogHeaderRendererDirective);

/**
 * A Lit directive for populating the content of the dialog footer.
 *
 * ```js
 * `<vaadin-dialog
 *   ${dialogFooterRenderer((dialog) => html`...`)}
 * ></vaadin-dialog>`
 * ```
 */
export const dialogFooterRenderer = directive(DialogFooterRendererDirective);
