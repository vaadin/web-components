/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { directive } from 'lit/directive.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { LitRendererDirective } from '@vaadin/lit-renderer';

const RUN_RENDERER_DEBOUNCER = Symbol('runRendererDebouncer');

export class DialogRendererDirective extends LitRendererDirective {
  /**
   * A property to that the renderer callback will be assigned.
   *
   * @protected
   */
  rendererProperty = 'renderer';

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

export class DialogHeaderRendererDirective extends DialogRendererDirective {
  rendererProperty = 'headerRenderer';
}

export class DialogFooterRendererDirective extends DialogRendererDirective {
  rendererProperty = 'footerRenderer';
}

export const dialogRenderer = directive(DialogRendererDirective);
export const dialogHeaderRenderer = directive(DialogHeaderRendererDirective);
export const dialogFooterRenderer = directive(DialogFooterRendererDirective);
