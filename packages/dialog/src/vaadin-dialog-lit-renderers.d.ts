/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TemplateResult } from 'lit';
import type { LitRendererDirectiveFactory } from '@vaadin/lit-renderer';
import { LitRendererDirective } from '@vaadin/lit-renderer';
import { Dialog } from './vaadin-dialog.js';

export type DialogLitRenderer = (dialog: Dialog) => TemplateResult;

export class DialogRendererDirective extends LitRendererDirective<Dialog, DialogLitRenderer> {
  /**
   * A property to that the renderer callback will be assigned.
   */
  protected rendererProperty: string;

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

export class DialogHeaderRendererDirective extends DialogRendererDirective {}

export class DialogFooterRendererDirective extends DialogRendererDirective {}

export declare const dialogRenderer: LitRendererDirectiveFactory<typeof DialogRendererDirective>;
export declare const dialogHeaderRenderer: LitRendererDirectiveFactory<typeof DialogHeaderRendererDirective>;
export declare const dialogFooterRenderer: LitRendererDirectiveFactory<typeof DialogFooterRendererDirective>;
