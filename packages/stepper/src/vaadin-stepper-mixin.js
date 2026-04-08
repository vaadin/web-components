/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ActiveMixin } from '@vaadin/a11y-base/src/active-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { TabindexMixin } from '@vaadin/a11y-base/src/tabindex-mixin.js';

/**
 * A mixin providing common stepper functionality.
 *
 * @polymerMixin
 * @mixes ActiveMixin
 * @mixes FocusMixin
 * @mixes TabindexMixin
 */
export const StepperMixin = (superClass) =>
  class StepperMixinClass extends ActiveMixin(TabindexMixin(FocusMixin(superClass))) {};
