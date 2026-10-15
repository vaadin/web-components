import type { DirectiveResult } from 'lit/directive.js';
import type { SelectLitRenderer, SelectRendererDirective } from '../../lit.js';
import { selectRenderer } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<(renderer: SelectLitRenderer, dependencies?: unknown) => DirectiveResult<typeof SelectRendererDirective>>(
  selectRenderer,
);
