import type { Icon, IconSvgLiteral } from '../../vaadin-icon';

const assertType = <TExpected>(actual: TExpected) => actual;

const icon = document.createElement('vaadin-icon');
assertType<Icon>(icon);

assertType<IconSvgLiteral | null>(icon.svg);
