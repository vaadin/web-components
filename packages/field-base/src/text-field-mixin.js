/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { CharLengthMixin } from './char-length-mixin.js';
import { InputFieldMixin } from './input-field-mixin.js';
import { PatternMixin } from './pattern-mixin.js';

const TextFieldMixinImplementation = (superclass) =>
  class TextFieldMixinClass extends InputFieldMixin(CharLengthMixin(PatternMixin(superclass))) {};

/**
 * A mixin to provide validation constraints for vaadin-text-field and related components.
 */
export const TextFieldMixin = dedupingMixin(TextFieldMixinImplementation);
