import type { DirectiveResult } from 'lit/directive';
import type {
  GridColumnBodyLitRenderer,
  GridColumnBodyRendererDirective,
  GridColumnFooterLitRenderer,
  GridColumnFooterRendererDirective,
  GridColumnHeaderLitRenderer,
  GridColumnHeaderRendererDirective,
  GridRowDetailsLitRenderer,
  GridRowDetailsRendererDirective,
} from '../../lit.js';
import { columnBodyRenderer, columnFooterRenderer, columnHeaderRenderer, gridRowDetailsRenderer } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

type TestGridItem = {
  testProperty: string;
};

assertType<
  (
    renderer: GridRowDetailsLitRenderer<TestGridItem>,
    dependencies?: unknown,
  ) => DirectiveResult<typeof GridRowDetailsRendererDirective>
>(gridRowDetailsRenderer);

assertType<
  (
    renderer: GridColumnBodyLitRenderer<TestGridItem>,
    dependencies?: unknown,
  ) => DirectiveResult<typeof GridColumnBodyRendererDirective>
>(columnBodyRenderer);

assertType<
  (
    renderer: GridColumnHeaderLitRenderer,
    dependencies?: unknown,
  ) => DirectiveResult<typeof GridColumnHeaderRendererDirective>
>(columnHeaderRenderer);

assertType<
  (
    renderer: GridColumnFooterLitRenderer,
    dependencies?: unknown,
  ) => DirectiveResult<typeof GridColumnFooterRendererDirective>
>(columnFooterRenderer);
