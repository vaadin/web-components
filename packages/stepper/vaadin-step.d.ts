/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export type StepState = 'active' | 'completed' | 'error' | 'inactive';

/**
 * `<vaadin-step>` is a Web Component for displaying a single step in a stepper.
 *
 * ```html
 * <vaadin-step href="/step1">Step 1</vaadin-step>
 * ```
 */
declare class Step extends DisabledMixin(DirMixin(ElementMixin(ThemableMixin(HTMLElement)))) {
  /**
   * The URL to navigate to
   */
  href: string | null | undefined;

  /**
   * The target of the link
   */
  target: string | null | undefined;

  /**
   * The label text
   */
  label: string | null | undefined;

  /**
   * The description text
   */
  description: string | null | undefined;

  /**
   * The state of the step
   * @attr {string} state
   */
  state: StepState;

  /**
   * Whether to exclude the item from client-side routing
   * @attr {boolean} router-ignore
   */
  routerIgnore: boolean;

  /**
   * Whether the step's href matches the current page
   */
  readonly current: boolean;

  /**
   * Whether the step is completed
   */
  completed: boolean;

  /**
   * Whether the step has an error
   */
  error: boolean;

  /**
   * Whether the step is active
   */
  active: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-step': Step;
  }
}

export { Step };
