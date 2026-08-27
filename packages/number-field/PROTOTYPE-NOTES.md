# Prototype notes: `<vaadin-number-field>` with `input type="text"`

Findings from the `proto/number-field-type-text-v2` branch. Epic:
https://github.com/vaadin/web-components/issues/3102. Plan and review trail:
`.omc/plans/number-field-type-text-proto*.md` (not part of this package).

Test status at the end of the branch: number-field 363 and integer-field 108
unit tests green in Chromium, Firefox and WebKit with zero skips;
`yarn test:snapshots` green for both groups; `yarn test:it` 472 passed,
0 failed, 1 pre-existing skip. Visual tests (`test:base` / `test:lumo`):
**not run** — no Docker daemon in the environment used for this branch.

## 1. Q1 — validation parity (answered: yes, with two declared divergences)

The differential test (`test/native-parity.test.js`, 143 cases: 13 values ×
11 constraint sets, each asserting `valueMissing` / `rangeUnderflow` /
`rangeOverflow` / `stepMismatch` individually plus `valid`) passes with
**zero divergent cells in Chromium, Firefox and WebKit**, including the
float-precision rows (`0.14` with `step=0.07`, `0.39` with
`min=0.29 step=0.1`).

Measured native accept set: all three browsers keep `.5` and `1e3` through
the `[type=number]` sanitizer (zero runtime skips fired), while `5.` and
`+5` are erased everywhere. The strict parser deliberately accepts all of
them — a declared widening over the HTML valid-floating-point grammar.

Declared divergences from native:

- A non-positive `step` warns and is ignored. Natively, a negative step
  silently validates as if it were `1`; `step="0"` already mapped to
  `step="any"` before, so only the negative case changed.
- `.5`, `5.`, `+5` are accepted as parsable.

Shipped bug found and fixed on the way (`fix:` commit, cherry-pickable to
main on its own): `_getIncrement` scaled `step` and `min` without rounding,
so `0.07 * 100 === 7.000000000000001` left a float error in the margin and
stepping from `0.07` with `step="0.07"` got stuck instead of reaching
`0.14`.

Production item: `_getDecimalCount` reads decimals off `String(number)`,
which switches to exponential notation at `1e-7` (and for large integers
such as `1e21`), yielding a wrong multiplier. The `|| step * multiplier`
guard only prevents the rounded product from collapsing to `0` and dividing
by zero; outside the decimal-notation range the multiplier scheme is still
imprecise, exactly as it ships today.

Readonly and disabled fields are barred from constraint validation and
always report valid, as native inputs do. The first version of the JS
validity computation missed this (the parity matrix had no readonly or
disabled column) and made `<vaadin-number-field readonly required>`
invalid; the matrix now covers both. Note that Chromium still computes
the individual `ValidityState` flags for a disabled input (but not for a
readonly one) while forcing `checkValidity()` to `true`, so for barred
inputs only the verdict is comparable.

`badInput` is the one validity field the differential matrix cannot
exercise (programmatic sets never produce bad input; the detached oracle
cannot be typed into). Its parity rests on the typed-input tests in
`validation.test.js` and `value-commit.test.js`.

## 2. Q2 — locale presentation (answered: yes, format-on-commit works)

Round-tripping verified by tests in all three browsers: `de-DE` (dot
group, comma decimal, and `1,234.5` correctly rejected), `fr-FR` (U+202F
narrow no-break space group), `ru-RU` (U+00A0), `en-IN` (lakh grouping
`12,34,567`), `sv-SE` (U+2212 minus, both directions).

Whitespace decision: when a locale groups with any whitespace, a regular
typed space, U+00A0 and U+202F are all accepted as group separators
interchangeably. Users cannot type U+202F.

`Intl.NumberFormat.format` accepts decimal strings (Intl V3) in all three
tested engines and preserves precision: a 20-significant-digit canonical
string formats without collapsing to a double. No fallback needed for the
current browser targets.

Caret: formatting strictly on commit (blur, Enter, step buttons, clear,
programmatic set, locale change) means the text is never rewritten while
typing, so there is no caret management anywhere in the implementation.
Step-button presses rewrite the input text, which places the caret at the
end — acceptable, per the demo page.

Affixes are supported: the parser strips every non-numeric part that
`formatToParts` reports for the configured formatter (currency symbol,
unit, surrounding literals), so `style: 'currency'` and `style: 'unit'`
round-trip and the affix characters are typeable. `style: 'percent'` and
`notation: 'compact'` are rejected with a warning: their affixes change
the magnitude of the shown number, so the text could not be parsed back
into the same value.

Integer-field shares the formatter, so a plain `<vaadin-integer-field
value="1234">` shows `1,234` in `en-US` — a display change from before.
Its character pattern is derived from the same locale symbols (digits,
signs, group separator, affixes; no decimal separator or exponent), so
the grouped text is typeable back.

Grouping is parsed leniently: group separators are stripped wherever they
appear (required for lakh grouping), except after the decimal separator,
which rejects. Consequence: `12,34,45` parses as `123445` in `en-US`
instead of being invalid, which is weaker than what
vaadin/flow-components#1144 asks for. Strict grouping validation is a
production decision (react-aria is similarly lenient).

Environment finding: browser default locales differ across test runners —
Playwright's Firefox defaults to a comma-decimal locale while Chromium and
WebKit default to `en-US`. Any locale-sensitive test must pin `locale`,
and typed-text fidelity is locale-relative by design (a typed `.` is a
group separator in a comma-decimal locale).

## 3. Q3 — the Flow contract (answered: the 'NaN' marker was never load-bearing)

- `AbstractNumberField` never compares against the literal `'NaN'`. Its
  contract is only: `_inputElementValue` non-empty while the model value is
  empty ⇒ unparsable. The raw text now returned satisfies it and is
  strictly more useful. Only the Java **unit tests** hardcode `"NaN"`
  (`NumberFieldBasicValidationTest`, `IntegerFieldBasicValidationTest`);
  they assert the unparsable branch, so any non-empty string passes, but
  the literals should be updated when this lands.
- Flow already registers the "user modifies input but it remains
  unparsable" case as an `unparsable-change` trigger — an expectation the
  web component could not meet with `[type=number]` and now does.
- Asymmetry to document in Flow: after this change Flow receives
  **formatted** text for parsable input and **raw** text for unparsable
  input, because format-on-commit rewrites the presentation on every
  successful commit. `AbstractNumberField` only tests `.isEmpty()`, so
  nothing breaks, but any future consumer of `_inputElementValue` must know.
- The three-state problem: the field has `value` (canonical),
  `_inputElementValue` (presentation) and "what the user typed" (raw), but
  stores only the first two. Caret safety and raw-text fidelity are the
  same variable: format-on-commit is what makes the caret trivial, and it
  is also what destroys the raw text on every successful commit. Keeping
  raw text for the server (flow-components#1144) needs a third stored
  state — a production decision.
- Remaining flow-components work: BigDecimalField can now format/parse
  server-side against the canonical string (which preserves arbitrary
  precision); the `"NaN"` test literals; deciding whether Flow should set
  `locale`/`formatOptions` from the Java locale.

## 4. Field-base seams production needs

- **One funnel for all value→input writes.** Six paths write to the input
  today; two of them (`InputController`'s slot initializer,
  `InputFieldMixin._inputElementChanged`) write the canonical value
  verbatim and had to be overridden here (`_inputElementChanged`) to paint
  an initial value formatted. Every future component with a formatted
  presentation hits the same two.
- **A `_parseInputValue(raw)` hook in `InputMixin`.** The `_onInput`
  override here fully replaces `InputMixin._onInput` +
  `InputFieldMixin._onInput` (parse-before-assign is the only way to keep
  raw text out of `value` without transient `value-changed` events — the
  round-trip `'' → '-' → ''` fired observable events when tried). It
  duplicates their bodies, including the `__userInput` guard, and must be
  re-checked on every field-base change.
- **A protected companion to `allowedCharPattern`.** The internal default
  and a developer-set value share one public slot; this branch tracks the
  applied default (`__appliedDefaultCharPattern`) to tell them apart when
  the locale changes. Order-sensitive and worth a real seam.
- **`slotStyles` does not compose `super.slotStyles`** in number-field
  (pre-existing): `InputControlMixin`'s autofill and placeholder-font rules
  never applied to number fields. Untouched here; worth a separate fix.

## 5. Deliberate divergences from native

- Invalid (non-positive) `step`: warned and ignored instead of silently
  applied as `1` (negative case) — see §1.
- Wheel over a focused field scrolls the page again; `type=text` has no
  native wheel stepping to suppress, and the old `preventDefault` blocked
  page scrolling (the CAVEAT in its own JSDoc).
- Programmatic `value` is strictly parsed: `'12abc'`, `'0x10'`,
  `'Infinity'` (all accepted by the old `parseFloat` test) now warn via
  `issueWarning` and clear.
- `.5`, `5.`, `+5` accepted as typed input (see §1).

## 6. Accessibility

`type="text"` drops the implicit numeric semantics of a number input.
There is no `role` or `aria-value*` anywhere in the component, and with
`step-buttons-visible` the component effectively is a spinbutton without
announcing itself as one. `inputmode="decimal"` (number-field) /
`"numeric"` (integer-field) selects the on-screen keyboard, and `decimal`
on iOS shows a keypad without a minus sign — a real problem for fields
allowing negatives. Screen-reader behavior was **not tested** on this
branch (no assistive tech in the environment). Production owes a decision
on `role="spinbutton"` + `aria-valuenow`/`aria-valuemin`/`aria-valuemax`,
announcement of rejected characters (`input-prevented` is visual only),
and a public `inputmode` override.

## 7. The unparsable-escape finding

A user who has typed unparsable text (e.g. `1--`) has no single-action way
out: the clear button requires `[clear-button-visible][has-value]` and
`has-value` follows `value` (empty for unparsable text), and Escape's
clear is gated on `!!this.value`. Select-all + Delete is the only
recovery. Pre-existing behavior, but far more visible now that the bad
text stays on screen instead of being hidden by the native sanitizer.
Production should let the clear button and Escape act on unparsable text.

## 8. `@internationalized/number` comparison criteria (spike not run)

Measure against this branch's string-surgery parser:

- Lines removed from `number-utils.js` vs. dependency size and bundle cost
  (first third-party runtime dependency of an Apache core package — a
  governance decision, not only a technical one).
- Does `NumberParser` preserve a 20-significant-digit string, or does it
  round-trip through `Number`? (This branch preserves it.)
- `isValidPartialNumber` vs. the derived `allowedCharPattern`: per-keystroke
  validation is position-aware there, character-class-based here.
- Which locale cases does it get right that this branch does not: strict
  grouping validation (`12,34,45`), percent/compact/scientific notations,
  non-`latn` numbering systems beyond the digit map.
- Run: `yarn add @internationalized/number -W` (lockfile v1), reimplement
  `number-utils.js` behind the same three exports, diff the test results.

## 9. Open questions

- **Unformat on focus** (show `1234.5` for editing, `1.234,5` blurred) —
  common in other libraries; would need caret handling on focus only.
- **Public `inputmode`** — see §6.
- **Public `validity`** — `__validity` is private; exposing a
  `ValidityState`-like object is API design work.
- **The third stored state** (raw typed text) — see §3.
- **Strict grouping validation** — see §2.
- **Paste of formatted text vs. the char pattern**: paste is checked
  against `allowedCharPattern` as a whole string, so pasting `1 234,50`
  into an `en-US` field is blocked at the paste stage (space not in the
  pattern), while pasting it into `fr-FR` works. Locale-mismatched paste
  handling is unresolved.
