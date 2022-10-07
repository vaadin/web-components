import type { DirectiveResult } from 'lit/directive.js';
import type { MultiSelectComboBoxLitRenderer, MultiSelectComboBoxRendererDirective } from '../../lit.js';
import { multiSelectComboBoxRenderer } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

type TestComboBoxItem = {
  testProperty: string;
};

assertType<
  (
    renderer: MultiSelectComboBoxLitRenderer<TestComboBoxItem>,
    dependencies?: unknown,
  ) => DirectiveResult<typeof MultiSelectComboBoxRendererDirective>
>(multiSelectComboBoxRenderer);
