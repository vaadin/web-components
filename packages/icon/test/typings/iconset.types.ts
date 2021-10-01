import { IconsetElement, IconSvgLiteral } from '../../vaadin-iconset';

const assertType = <TExpected>(actual: TExpected) => actual;

const iconset = document.createElement('vaadin-iconset');
assertType<IconsetElement>(iconset);

const result = iconset.applyIcon('test');
assertType<{ svg: IconSvgLiteral; size: number }>(result);
