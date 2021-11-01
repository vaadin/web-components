/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { LabelHost } from './label-mixin.js';
import { SlotTargetHost } from './slot-target-mixin.js';

export type SlotLabelHost = LabelHost & SlotTargetHost;

/**
 * A mixin to forward any content from the default slot to the label node.
 */
export declare function SlotLabelMixin<T extends Constructor<HTMLElement>>(
  base: T
): T &
  Constructor<LabelHost> &
  Pick<typeof LabelHost, keyof typeof LabelHost> &
  Constructor<SlotTargetHost> &
  Pick<typeof SlotTargetHost, keyof typeof SlotTargetHost>;
