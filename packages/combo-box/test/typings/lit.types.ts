import type { DirectiveResult } from 'lit/directive.js';
import type { ComboBoxLitRenderer, ComboBoxRendererDirective } from '../../lit.js';
import { comboBoxRenderer } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

interface TestComboBoxItem {
  testProperty: string;
}

assertType<
  (
    renderer: ComboBoxLitRenderer<TestComboBoxItem>,
    dependencies?: unknown,
  ) => DirectiveResult<typeof ComboBoxRendererDirective>
>(comboBoxRenderer);
