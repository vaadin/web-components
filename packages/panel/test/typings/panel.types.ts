import '../../vaadin-panel.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { Panel } from '../../vaadin-panel.js';

const assertType = <TExpected>(value: TExpected) => value;

const panel = document.createElement('vaadin-panel');
assertType<Panel>(panel);

// Properties
assertType<string>(panel.headerTitle);
assertType<number>(panel.headingLevel);

// Mixins
assertType<ElementMixinClass>(panel);
assertType<ThemableMixinClass>(panel);
