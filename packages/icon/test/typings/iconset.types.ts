import '../../vaadin-icon.js';
import type { IconSvgLiteral } from '../../src/vaadin-icon-svg.js';
import { Iconset } from '../../vaadin-iconset.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const iconset1 = document.createElement('vaadin-iconset');
assertType<Iconset>(iconset1);

const iconset2 = Iconset.getIconset('vaadin');
assertType<Iconset>(iconset2);

const result = Iconset.getIconSvg('test');
assertType<{ svg: IconSvgLiteral; size?: number; viewBox?: string | null }>(result);
