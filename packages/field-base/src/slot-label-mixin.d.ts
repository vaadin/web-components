/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { LabelMixinClass } from './label-mixin.js';
import { SlotTargetMixinClass } from './slot-target-mixin.js';

/**
 * A mixin to forward any content from the default slot to the label node.
 */
export declare function SlotLabelMixin<T extends Constructor<HTMLElement>>(
  base: T
): T & Constructor<LabelMixinClass> & Constructor<SlotTargetMixinClass>;
