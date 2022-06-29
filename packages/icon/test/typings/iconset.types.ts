import type { Iconset, IconSvgLiteral } from '../../vaadin-iconset';

const assertType = <TExpected>(actual: TExpected) => actual;

const iconset = document.createElement('vaadin-iconset');
assertType<Iconset>(iconset);

const result = iconset.applyIcon('test');
assertType<{ svg: IconSvgLiteral; size: number; viewBox: string | null }>(result);
