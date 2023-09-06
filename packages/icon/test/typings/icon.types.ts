import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin';
import type { Icon, IconSvgLiteral } from '../../vaadin-icon';

const assertType = <TExpected>(actual: TExpected) => actual;

const icon = document.createElement('vaadin-icon');
assertType<Icon>(icon);
assertType<ControllerMixinClass>(icon);

assertType<IconSvgLiteral | null>(icon.svg);

assertType<string | null>(icon.font);
assertType<string | null>(icon.char);
assertType<string | null>(icon.ligature);
assertType<string | null>(icon.fontFamily);
assertType<string | null>(icon.src);
