import { TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/directive.js';
import { LitRendererDirective } from '@vaadin/lit-renderer';
import { Dialog } from './vaadin-dialog.js';

export type DialogLitRenderer = (dialog: Dialog) => TemplateResult;

class DialogRendererDirective extends LitRendererDirective<Element, DialogLitRenderer> {
  addRenderer(): void;

  runRenderer(): void;

  removeRenderer(): void;
}

export function dialogRenderer(renderer: DialogLitRenderer, value?: unknown): DirectiveResult<DialogRendererDirective>;
