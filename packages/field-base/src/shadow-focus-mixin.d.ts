/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledHost } from '@vaadin/component-base/src/disabled-mixin.js';
import { FocusHost } from '@vaadin/component-base/src/focus-mixin.js';
import { KeyboardHost } from '@vaadin/component-base/src/keyboard-mixin.js';
import { TabindexHost } from '@vaadin/component-base/src/tabindex-mixin.js';
import { DelegateFocusHost } from './delegate-focus-mixin.js';

/**
 * A mixin to forward focus to an element in the shadow DOM.
 */
export declare function ShadowFocusMixin<T extends Constructor<HTMLElement>>(
  base: T
): T &
  Constructor<DelegateFocusHost> &
  Pick<typeof DelegateFocusHost, keyof typeof DelegateFocusHost> &
  Constructor<DisabledHost> &
  Pick<typeof DisabledHost, keyof typeof DisabledHost> &
  Constructor<FocusHost> &
  Pick<typeof FocusHost, keyof typeof FocusHost> &
  Constructor<KeyboardHost> &
  Pick<typeof KeyboardHost, keyof typeof KeyboardHost> &
  Constructor<TabindexHost> &
  Pick<typeof TabindexHost, keyof typeof TabindexHost>;
