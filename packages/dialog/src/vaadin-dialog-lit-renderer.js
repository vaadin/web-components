/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { directive } from 'lit/directive.js';
import { LitRendererDirective } from '@vaadin/lit-renderer';

export class DialogRendererDirective extends LitRendererDirective {
  /**
   * Adds the renderer callback to the dialog.
   */
  addRenderer() {
    this.element.renderer = (root, dialog) => {
      this.renderRenderer(root, dialog);
    };
  }

  /**
   * Runs the renderer callback on the dialog.
   */
  runRenderer() {
    this.element.requestContentUpdate();
  }

  /**
   * Removes the renderer callback from the dialog.
   */
  removeRenderer() {
    this.element.renderer = null;
  }
}

export const dialogRenderer = directive(DialogRendererDirective);
