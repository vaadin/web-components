# Prototype notes: `<vaadin-number-field>` with `input type="text"`

Findings from the `proto/number-field-type-text-poc` branch — the minimal
form of the breaking change, without locale parsing or presentation
formatting. The locale layer (`locale`, `formatOptions`, affix parsing) is
prototyped separately on `proto/number-field-type-text-v2`, whose notes
answer the Q2 locale question. Epic:
https://github.com/vaadin/web-components/issues/3102. Plan and review trail:
`.omc/plans/number-field-type-text-proto*.md` and
`.omc/plans/number-field-type-text-poc.md` (not part of this package).

Test status at the end of the branch: number-field 390 and integer-field
111 unit tests green in Chromium with zero skips; the native-parity matrix
green in Firefox and WebKit; `yarn test:snapshots` green for both groups.
Visual tests (`test:base` / `test:lumo`): **not run** — no Docker daemon
in the environment used for this branch.

## 1. Q1 — validation parity (answered: yes, with two declared divergences)

The differential test (`test/native-parity.test.js`, 13 values × 13
constraint sets, each asserting `valueMissing` / `rangeUnderflow` /
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

## 2. Q2 — locale presentation

Not part of this branch. `proto/number-field-type-text-v2` answers it
(format-on-commit works, `Intl.NumberFormat` V3 preserves string
precision, lenient grouping is the known limitation). Re-applying that
layer on top of this branch means rebasing its locale commit over the
renamed hooks (§4) and the `value` accessor (§5).

Two decisions taken here that the locale layer must keep: presentation is
written **on commit only** (blur, Enter, step buttons, clear, programmatic
set), which is what keeps caret handling at zero lines; and the parse
step runs on **trusted input events only** (`_modelValueFromInput`), so
the canonical text written by the step buttons is never re-parsed as
locale text.

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
- Asymmetry to document in Flow: after this change Flow receives the
  **canonical** text for parsable input (a typed `5` commits as `5`) and
  the **raw** text for unparsable input, because the commit rewrites the
  presentation from `value`. `AbstractNumberField` only tests
  `.isEmpty()`, so nothing breaks, but any future consumer of
  `_inputElementValue` must know.
- The three-state problem: the field has `value` (canonical),
  `_inputElementValue` (presentation) and "what the user typed" (raw), but
  stores only the first two. Keeping raw text for the server
  (flow-components#1144) needs a third stored state — a production
  decision.
- Remaining flow-components work: BigDecimalField can now format/parse
  server-side against the canonical string (which preserves arbitrary
  precision); the `"NaN"` test literals; the exponent parser fix
  (flow-components#4620 — `DecimalFormat` drops a lowercase-`e` exponent,
  while the canonical string keeps `5.4e4` verbatim).

## 4. Field-base seams production needs

- **`_modelValueFromInput(viewValue, event)` in `InputMixin`.** The
  `_onInput` override here fully replaces `InputMixin._onInput` +
  `InputFieldMixin._onInput` (parse-before-assign is the only way to keep
  raw text out of `value` without transient `value-changed` events — the
  round-trip `'' → '-' → ''` fired observable events when tried). It
  duplicates their bodies, including the `__userInput` guard, and must be
  re-checked on every field-base change. The parse decision itself already
  lives in a protected hook of that name and shape (the `event` argument
  carries the trust dimension); once field-base offers the seam, the
  override goes and the hook stays.
- **`_inputValueFromModel(value)` and one funnel for all value→input
  writes.** The identity hook here is the shape of the presentation seam.
  Six paths write to the input today; two of them (`InputController`'s
  slot initializer, `InputFieldMixin._inputElementChanged`) write the
  canonical value verbatim and bypass `_forwardInputValue`, which is where
  the idempotence guard lives. Every future component with a formatted
  presentation hits the same two.
- **A protected companion to `allowedCharPattern`.** The internal default
  (`_defaultAllowedCharPattern`) and a developer-set value share one public
  slot; this branch applies the default once in `ready()` when the slot is
  empty, so `allowedCharPattern=""` reads as unset. Worth a real seam.
- **`slotStyles` does not compose `super.slotStyles`** in number-field
  (pre-existing): `InputControlMixin`'s autofill and placeholder-font rules
  never applied to number fields. Untouched here; worth a separate fix.

## 5. Deliberate divergences from native and from `main`

- Invalid (non-positive) `step`: warned and ignored instead of silently
  applied as `1` (negative case) — see §1.
- Wheel over a focused field scrolls the page again; `type=text` has no
  native wheel stepping to suppress, and the old `preventDefault` blocked
  page scrolling (the CAVEAT in its own JSDoc).
- Programmatic `value` is strictly parsed: `'3foo'`, `'12abc'`, `'0x10'`,
  `'Infinity'` (all accepted by the old `parseFloat` test) now warn via
  `issueWarning` and clear (vaadin/web-components#1263).
- Value normalization runs in a `value` accessor pair instead of the
  `_valueChanged` observer, so an unparsable programmatic set on an empty
  field is a no-op with zero `value-changed` events and a numeric set fires
  exactly one (vaadin/web-components#8007). integer-field warns through
  `issueWarning` as well, so both fields behave alike.
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

## 8. Arrives with FormatMixin adoption — deliberately not built here

The text-field FormatMixin PoC (`field-formatting.md`) owns these; adding
bespoke versions now would be rebuilt at adoption:

- `formattedValue` and a single caret-preserving `_inputElementValue`
  write site (the idempotence guard in `_forwardInputValue` is the part
  this branch needed today).
- Live formatting while typing and `beforeinput` intent detection.
- Composition suspension (`compositionstart` / `compositionend`): the
  `_onInput` override here parses every input event, so mid-IME
  composition churns `value` — a latent defect the mixin fixes for free.
- At adoption, delete the `_onInput` and `_forwardInputValue` overrides;
  keep `_modelValueFromInput`, `_inputValueFromModel`, `number-utils`,
  `__validity`, the commit model and the `unparsable-change` machinery.

## 9. Open questions

- **Public `inputmode`** — see §6.
- **Public `validity`** — `__validity` is private; exposing a
  `ValidityState`-like object is API design work.
- **The third stored state** (raw typed text) — see §3.
- **Paste tested against the parser instead of the char pattern.**
  Accepting any pasted text that `parseNumber` parses (leading/trailing
  whitespace today, locale-formatted text once the locale layer exists)
  needs `_onPaste` / `_onDrop` promoted from `@private` to `@protected` in
  `InputControlMixin` — **and** `_onBeforeInput`, which tests `e.data`
  against the same whole-text regexp and can undo an accepting paste
  override on its own. Three promotions, not two; deferred to the locale
  layer where it has real value.
- **Canonical `value` and exponent notation** — typed `1e3` is kept
  verbatim (fidelity test), while flow-components#4620 shows a server
  parser that drops a lowercase exponent. Whether the canonical string
  admits exponent notation or is normalized by lossless string expansion
  is an RFC decision, not a prototype patch.
