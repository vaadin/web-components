import { deepMerge, deepMergePartials } from '../../../src/object-utils.js';

const assertType = <TExpected>(actual: TExpected) => actual;

interface TestObject {
  foo: string;
  bar?: { baz: string };
}

const target: TestObject = { foo: 'foo' };

assertType<TestObject>(deepMerge(target, { bar: { baz: 'baz' } }));
assertType<TestObject>(deepMergePartials(target, { bar: { baz: 'baz' } }, { foo: 'foo' }));
