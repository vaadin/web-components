import '../../vaadin-markdown.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const markdown = document.createElement('vaadin-markdown');

// Properties
assertType<string | null | undefined>(markdown.content);

// Mixins
assertType<ElementMixinClass>(markdown);
assertType<ThemableMixinClass>(markdown);
