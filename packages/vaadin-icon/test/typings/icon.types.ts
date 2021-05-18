import { IconElement, IconSvgLiteral } from '../../vaadin-icon';

const assertType = <TExpected>(actual: TExpected) => actual;

const icon = document.createElement('vaadin-icon');
assertType<IconElement>(icon);

assertType<IconSvgLiteral | null>(icon.svg);
