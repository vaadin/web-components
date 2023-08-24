import { html, noChange, nothing } from 'lit';
import type { LitRenderer } from '../../src/lit-renderer';

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<LitRenderer>(() => html`foo`);
assertType<LitRenderer>(() => 'foo');
assertType<LitRenderer>(() => noChange);
assertType<LitRenderer>(() => nothing);
assertType<LitRenderer>(() => null);
