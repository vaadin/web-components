import type { DirectiveResult } from 'lit/directive.js';
import type { PopoverLitRenderer, PopoverRendererDirective } from '../../lit.js';
import { popoverRenderer } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<(renderer: PopoverLitRenderer, dependencies?: unknown) => DirectiveResult<typeof PopoverRendererDirective>>(
  popoverRenderer,
);
