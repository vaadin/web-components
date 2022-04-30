/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/* eslint-disable max-classes-per-file */
import { TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/directive.js';
import { LitRendererDirective } from '@vaadin/lit-renderer';
import { Dialog } from './vaadin-dialog.js';

export type DialogLitRenderer = (dialog: Dialog) => TemplateResult;

declare abstract class AbstractDialogRendererDirective extends LitRendererDirective<Dialog, DialogLitRenderer> {
  /**
   * A property to that the renderer callback will be assigned.
   */
  abstract rendererProperty: string;

  /**
   * Adds the renderer callback to the dialog.
   */
  addRenderer(): void;

  /**
   * Runs the renderer callback on the dialog.
   */
  runRenderer(): void;

  /**
   * Removes the renderer callback from the dialog.
   */
  removeRenderer(): void;
}

export class DialogRendererDirective extends AbstractDialogRendererDirective {
  rendererProperty: string;
}

export class DialogHeaderRendererDirective extends AbstractDialogRendererDirective {
  rendererProperty: string;
}

export class DialogFooterRendererDirective extends AbstractDialogRendererDirective {
  rendererProperty: string;
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
export declare function dialogRenderer(
  renderer: DialogLitRenderer,
  value?: unknown,
): DirectiveResult<typeof DialogRendererDirective>;

/**
 * A Lit directive for populating the content of the dialog header.
 *
 * ```js
 * `<vaadin-dialog
 *   ${dialogHeaderRenderer((dialog) => html`...`)}
 * ></vaadin-dialog>`
 * ```
 */
export declare function dialogHeaderRenderer(
  renderer: DialogLitRenderer,
  value?: unknown,
): DirectiveResult<typeof DialogHeaderRendererDirective>;

/**
 * A Lit directive for populating the content of the dialog footer.
 *
 * ```js
 * `<vaadin-dialog
 *   ${dialogFooterRenderer((dialog) => html`...`)}
 * ></vaadin-dialog>`
 * ```
 */
export declare function dialogFooterRenderer(
  renderer: DialogLitRenderer,
  value?: unknown,
): DirectiveResult<typeof DialogFooterRendererDirective>;
