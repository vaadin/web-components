import { DirectiveResult } from 'lit/directive.js';
import { SelectLitRenderer, selectRenderer, SelectRendererDirective } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<(renderer: SelectLitRenderer, dependencies?: unknown) => DirectiveResult<typeof SelectRendererDirective>>(
  selectRenderer,
);
