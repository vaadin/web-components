import { DirectiveResult } from 'lit/directive.js';
import { dialogFooterRenderer, dialogHeaderRenderer, DialogLitRenderer, dialogRenderer } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<(renderer: DialogLitRenderer, value?: unknown) => DirectiveResult>(dialogRenderer);
assertType<(renderer: DialogLitRenderer, value?: unknown) => DirectiveResult>(dialogHeaderRenderer);
assertType<(renderer: DialogLitRenderer, value?: unknown) => DirectiveResult>(dialogFooterRenderer);
