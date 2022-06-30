import type { DirectiveResult } from 'lit/directive';
import type { GridProColumnEditModeLitRenderer, GridProColumnEditModeRendererDirective } from '../../lit.js';
import { columnEditModeRenderer } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

interface TestGridItem {
  testProperty: string;
}

assertType<
  (
    renderer: GridProColumnEditModeLitRenderer<TestGridItem>,
    dependencies?: unknown,
  ) => DirectiveResult<typeof GridProColumnEditModeRendererDirective>
>(columnEditModeRenderer);
