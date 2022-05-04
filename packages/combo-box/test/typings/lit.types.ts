import { DirectiveResult } from 'lit/directive.js';
import { ComboBoxLitRenderer, comboBoxRenderer, ComboBoxRendererDirective } from '../../lit.js';

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
