import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-number-field.js';

// Values erased by the native [type=number] sanitizer have no oracle
// verdict to compare against, so they are skipped per browser. '5.' and
// '+5' are erased by every browser and are covered as declared
// divergences in other tests instead; '.5' survives only in some
// browsers, which this probe measures.
const probe = document.createElement('input');
probe.type = 'number';

function keptByNativeSanitizer(value) {
  probe.value = value;
  const kept = probe.value === value;
  probe.value = '';
  return kept;
}

describe('native parity', () => {
  let field, oracle;

  const values = ['', '0', '5', '-5', '0.3', '10.5', '-10', '1e3', '0.1', '2.5', '0.14', '0.39', '.5'];

  const constraintSets = [
    {},
    { min: -10 },
    { max: 10 },
    { min: -10, max: 10 },
    { step: 0.5 },
    { step: 0.1 },
    { step: 0.07 },
    { min: 0.29, step: 0.1 },
    { min: -10, step: 0.5 },
    { min: 1, step: 2 },
    { required: true },
  ];

  beforeEach(async () => {
    field = fixtureSync('<vaadin-number-field></vaadin-number-field>');
    await nextRender();
    oracle = document.createElement('input');
    oracle.type = 'number';
  });

  constraintSets.forEach((constraints) => {
    describe(JSON.stringify(constraints), () => {
      values.forEach((value) => {
        const hasOracleVerdict = value === '' || keptByNativeSanitizer(value);

        (hasOracleVerdict ? it : it.skip)(`should match native input validity for value "${value}"`, async () => {
          Object.assign(field, constraints);
          field.value = value;
          await nextUpdate(field);

          // Every entry in `static get constraints()` must be mirrored onto
          // the oracle, since the field no longer delegates any of them to
          // its own input element. A missing `min`, `max` or `required`
          // silently inverts the verdict for the affected cases, and native
          // treats a missing `step` as `1` rather than as no constraint,
          // so it must be translated to "any".
          oracle.min = constraints.min != null ? String(constraints.min) : '';
          oracle.max = constraints.max != null ? String(constraints.max) : '';
          oracle.step = constraints.step != null ? String(constraints.step) : 'any';
          oracle.required = !!constraints.required;
          oracle.value = value;

          const validity = field.__validity;
          expect(validity.valueMissing, 'valueMissing').to.equal(oracle.validity.valueMissing);
          expect(validity.rangeUnderflow, 'rangeUnderflow').to.equal(oracle.validity.rangeUnderflow);
          expect(validity.rangeOverflow, 'rangeOverflow').to.equal(oracle.validity.rangeOverflow);
          expect(validity.stepMismatch, 'stepMismatch').to.equal(oracle.validity.stepMismatch);
          expect(validity.valid, 'valid').to.equal(oracle.checkValidity());
        });
      });
    });
  });
});
