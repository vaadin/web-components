// /**
//  * @license
//  * Copyright (c) 2017 - 2022 Vaadin Ltd.
//  * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
//  */
//  import { render, RenderOptions, TemplateResult } from 'lit';
//  import { directive, DirectiveResult } from 'lit/directive.js';
//  import { LitRendererDirective } from '@vaadin/lit-renderer';
//  import { Dialog } from './vaadin-dialog.js';

//  export type DialogLitRenderer = (dialog: Dialog) => TemplateResult;

//  class DialogRendererDirective extends LitRendererDirective<Dialog, DialogLitRenderer> {
//    /**
//     * Set renderer callback to the element.
//     */
//    addRenderer(element: Dialog, renderer: DialogLitRenderer, options: RenderOptions) {
//      element.renderer = (root: HTMLElement, dialog?: Dialog) => {
//        render(renderer.call(options.host, dialog as Dialog), root, options);
//      };
//    }

//    /**
//     * Run renderer callback on the element.
//     */
//    runRenderer(element: Dialog) {
//      element.requestContentUpdate();
//    }
//  }

//  const rendererDirective = directive(DialogRendererDirective);

//  export const dialogRenderer = (
//    renderer: DialogLitRenderer,
//    value?: unknown
//  ): DirectiveResult<typeof DialogRendererDirective> => rendererDirective(renderer, value);
