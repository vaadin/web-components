# Field formatting × number-field — convergence handoff

Companion to [`field-formatting.md`](./field-formatting.md) (summary / PoC scope),
[`field-formatting-use-cases.md`](./field-formatting-use-cases.md) and
[`field-formatting-input-mask.md`](./field-formatting-input-mask.md).

**What this doc is.** `field-formatting.md` keeps `number-field` out of the text-field
FormatMixin PoC and defers number/currency formatting until the `type="text"` refactor
lands, with next-step 9 promising that number formatting "reuses the same mixin". This
doc is the handoff for that reuse: what the two prototypes already agree on, where the
FormatMixin PoC as specced would force a breaking rework at v26 adoption, and the
concrete changes to make on each side **before** either lands.

Inputs, both read in full:

- `proto/number-field-type-text-v2` — the number-field `type="text"` prototype
  (12 commits, findings in `packages/number-field/PROTOTYPE-NOTES.md`)
- `.omc/plans/text-field-format-mixin-poc.md` — the FormatMixin chunking PoC plan
  (consensus-approved, pending implementation; not in the repository — conclusions
  that matter are restated here)
- open issues checked against the prototype: vaadin/web-components#1263,
  vaadin/web-components#8007, vaadin/flow-components#4620 (§3)

Target picture for v26: number-field's `type="text"` change is the precondition;
FormatMixin core lands additively (25.4 bucket); number-field adopts the **mixin core**
— write site, seams, intents — as part of its own v26 breaking change, while keeping
its engine (`number-utils`), its JS validity, and its commit/unparsable machinery.

---

## 1. Already converged — no action, but do not diverge

| Piece | text-field PoC | number-field prototype |
| ----- | -------------- | ---------------------- |
| Value contract | `value` = unformatted model, input owns presentation | `value` = canonical dot-decimal string, presentation formatted |
| Where the model is written | inside `_onInput`, before host listeners → EAGER/LAZY/TIMEOUT need no Flow change | same (parse-before-assign in its `_onInput` override) |
| Constraints off the native input | `maxlength`/`minlength`/`pattern` not delegated under a format, validated in JS against `value` | `min`/`max`/`step` not delegated, `__validity` computed in JS |
| Initial-paint fix | `_inputElementChanged` override (before-attach parity risk row) | `_inputElementChanged` override (D4a) — same two copy sites |
| Mixin chain requirement | FormatMixin requires `InputControlMixin` below it | satisfied: `NumberFieldMixin` → `InputFieldMixin` → `InputControlMixin` (verified) |

## 2. Collision points found

1. **`_modelValueFromInput(viewValue)` lacks the trust dimension.** The PoC's seam takes
   only the view string. Number-field parses **only trusted** input events (its
   Invariant P): parsing is not idempotent on canonical text in comma-decimal locales —
   the step buttons write canonical `1234.5` into a `de-DE` field and dispatch a
   synthetic `input`; re-parsing it as locale text strips `.` as a group separator and
   yields `12345` (×10 corruption, proven during the prototype's review). Chunking never
   notices (`unformat` is idempotent on canonical text), so the seam works for layer 1
   and breaks at number-field adoption. Changing a protected seam signature after four
   components inherit it is the break the PoC exists to avoid.
2. **Write site fused to a live-only policy.** The PoC's `_inputElementValue` accessor
   pair (idempotent, caret-preserving, sole writer of `formattedValue`) is exactly what
   number-field wants — but the PoC wires it only to format-on-input. Number-field
   formats **on commit only** (blur, Enter, step buttons, clear, programmatic set),
   which is what makes its caret handling zero lines. The plan anticipates
   `format.mode: 'live' | 'commit'` "later"; adoption needs the *when* separated from
   the *how* as named seams, not privates.
3. **`format` vs `locale`/`formatOptions`.** The PoC declares the chunking config
   property `format` on `FormatMixin` itself. A v26 number-field applying the mixin
   would inherit a public `format` whose chunking semantics are meaningless next to its
   `locale`/`formatOptions` — two "format*" APIs with different meanings on one element,
   in CEM and the React wrappers. On email-field/password-field/grid-pro the inherited
   property is inert but coherent; on number-field it is incoherent.
4. **The PoC's JS `checkValidity()` branch has the readonly/disabled bug number-field
   already fixed.** Validating `required`/`minlength`/`maxlength`/`pattern` in JS
   without the native "barred from constraint validation" rule makes
   `<vaadin-text-field readonly required format=…>` invalid where every unformatted
   field is valid. Number-field's self-review caught the identical defect in
   `__validity`; the fix and the Chromium quirk (a disabled input still computes the
   individual `ValidityState` flags while `checkValidity()` is forced true — only the
   verdict is comparable) are recorded in `PROTOTYPE-NOTES.md` §1.
5. **Paste of formatted text.** The PoC overrides `_onPaste` / `_onDrop` to test the
   **unformatted** text against `allowedCharPattern` — the better rule. Number-field
   instead added affix characters to the keystroke pattern, which still blocks a
   locale-mismatched paste (`1 234,50` into an `en-US` field — open question in its
   notes §9). Both branches need the same `@private → @protected` promotion of
   `_onPaste` / `_onDrop` in `input-control-mixin.js`.
6. **Default-vs-developer `allowedCharPattern` tracking is duplicated ad hoc.**
   Number-field tracks `__appliedDefaultCharPattern` (its `''`-treated-as-unset flaw is
   a known finding); the PoC derives no pattern. Both notes files already ask for a
   protected companion seam in field-base. Shared follow-up, not a blocker.
7. **Free wins for number-field at adoption**, worth expecting rather than rebuilding:
   composition suspension (`compositionstart`/`compositionend`) fixes a latent
   number-field defect — its `_onInput` parses every input event, so mid-IME
   composition churns `value` today; the idempotent write site removes its known
   `_incrementValue` double-write; `formattedValue` arrives for free; `beforeinput`
   intent detection is what any future "live grouping while typing numbers" option
   would use.

## 3. Open issues mapped to the prototype

Three long-standing bugs were checked against `proto/number-field-type-text-v2`.
All three are consequences of `parseFloat` semantics, observer-side value clearing,
or the opacity of native `[type=number]` — evidence for the prototype's direction,
worth citing on the epic.

| Issue | On `main` | On the prototype | Remaining action |
| ----- | --------- | ---------------- | ---------------- |
| [wc#1263](https://github.com/vaadin/web-components/issues/1263) — `value = '3foo'` kept while the field looks empty | broken (`parseFloat` prefix-parses) | fixed by the strict parser; the `clear()` case from the comments falls out too | regression tests (`'3foo'`, `'12abc'`, `'0x10'`, `'Infinity'`) — a known test gap from the self-review, now with an issue to cite; production PR carries `Fixes #1263` |
| [wc#8007](https://github.com/vaadin/web-components/issues/8007) — two spurious `value-changed` events (`detail: ''`) on an unparsable programmatic set | broken | **still broken** — the typed-input path was fixed (parse-before-assign exists because of exactly this event class), but the programmatic path kept observer-side clearing; a numeric set (`field.value = 9.99`) double-fires the same way via the `String()` re-entry | adopt the accessor fix (below) |
| [fc#4620](https://github.com/vaadin/flow-components/issues/4620) — `5.4e4` parsed as `5.4` server-side (`DecimalFormat` exponent separator is uppercase `E`, so `5.4E4` works) | broken | client is internally consistent: `value` keeps `'5.4e4'` verbatim and validity computes on the true magnitude (`Number('5.4e4') === 54000`, same as native); the server parser bug persists | Flow parser fix (root cause); a canonical-contract decision to record (below) |

**The wc#8007 accessor fix, verified viable.** vursen's comment on the issue sketches
moving the value normalization from `_valueChanged` into a `value` accessor pair.
Checked against `polylit-mixin.js`: the `sync: true` descriptor is installed on the
declaring class's prototype, so a subclass `get value` / `set value` delegating via
`super.value` shadows it for external and internal assignments alike, and the sync
setter's `notEqual` check makes `'NaN'` → `''` on an empty field a true no-op — zero
events, matching the issue's expected outcome. The one accessor-bypass path in polylit
(`_setProperties` writes the storage key directly) has no callers in any component
source. The prototype makes the fix cleaner than it would be on `main`: with
parse-before-assign in `_onInput`, unparsable strings reach the accessor only from
programmatic sets, so the `issueWarning` needs no user-input flag — which also settles
the warning-inconsistency point raised on the issue (integer-field warned, number-field
did not; a warning was explicitly endorsed there).

**The fc#4620 decision to record.** Three options, in order of preference: (1) fix the
Flow parser — `Double.parseDouble` / `BigDecimal` accept both `e` and `E`; belongs on
the notes' remaining-flow-work list. (2) Canonicalize exponent notation in
`parseNumber` via lossless *string* expansion (`'5.4e4'` → `'54000'`, `'1e-7'` →
`'0.0000001'`, no `Number` round-trip) — fixes every consumer and hardens the
"canonical decimal string" contract, but deliberately renegotiates the pinned fidelity
test (typed `'1e3'` stays `'1e3'`): that pin guards against *accidental* narrowing
through `Number`, and a deliberate lossless normalization is a different, v26-level
contract decision — an RFC item, not a prototype patch. (3) Drop `eE` from the default
`allowedCharPattern` (integer-field already excludes them) — blocks typing but not
programmatic sets, and gives up native parity for a server limitation; weakest.

## 4. Changes to the FormatMixin PoC plan (it is pending approval — edit before building)

1. **Seam signature:** `_modelValueFromInput(viewValue, event)` — pass the `InputEvent`
   through from `_onInput`. Identity default and chunking ignore it; number-field's v26
   override reads `event.isTrusted`. One extra argument now versus a protected-API
   break later. `_inputValueFromModel(value)` stays as is.
2. **Split policy from machinery:** route the live reformat through one overridable
   predicate (e.g. `_shouldFormatOnInput(event)` — default: true for non-delete intents
   outside composition) and make the caret-preserving write reachable for a commit-time
   caller (a protected `_presentValue(formatted[, caret])` over the private write
   path). Ship only live behavior in the PoC; name the seams so commit mode is an
   override, not a redesign.
3. **Move the chunking `format` property out of the mixin core** — declare it at the
   application site (`TextFieldMixin`, where the constraint overrides already live) or
   in a thin chunking layer; `FormatMixin` keeps write site + seams + intents +
   `formattedValue` + `_hasFormat`. Also shrinks the accepted "inert public API on
   email-field/password-field/grid-pro" cost. Fallback: keep it, but record in the ADR
   that number-field must reject/hide `format` and the name is reserved against
   `formatOptions`.
4. **Add the barred-from-validation guard** (`readonly || disabled` → valid, all flags
   false) to the JS `checkValidity()` branch, plus one acceptance row, citing the
   number-field parity finding and the Chromium disabled-flags quirk.
5. **Name number-field as the second adopter** in the out-of-scope table, with the
   adoption inventory: deleted at adoption — number-field's `_onInput` override,
   `_forwardInputValue` override, `_inputElementChanged` override,
   `__appliedDefaultCharPattern`; kept — the `number-utils` engine, `__validity`, the
   commit model and `unparsable-change` machinery (chunking has no unparsable state;
   the mixin core never absorbs it).

## 5. Changes to `proto/number-field-type-text-v2` (cheap now, converging)

Branch map: `proto/number-field-type-text-poc` is the minimal `type="text"` change
(Phases 1–7 of v2, no locale / formatting) with items 1, 3, 4, 5 and 6 below applied —
plan in `web-components/.omc/plans/number-field-type-text-poc.md`.
`proto/number-field-type-text-v2` keeps the locale layer; re-applying it on top of the
poc branch means rebasing its locale commit over the renamed hooks and the `value`
accessor.

1. **Rename internal hooks to the seam names.** Extract the parse decision from the
   `_onInput` override into a protected `_modelValueFromInput(viewValue, event)`-shaped
   method; let `_forwardInputValue` delegate to an `_inputValueFromModel(value)`-shaped
   one. The override bodies stay (the field-base seams do not exist yet); the v26 diff
   becomes "delete the overrides, keep the hooks". Update `PROTOTYPE-NOTES.md` §4 so
   the requested `_parseInputValue` seam **is** `_modelValueFromInput` — one seam, not
   two competing names.
2. **Adopt unformat-before-test paste handling.** Override `_onPaste` / `_onDrop` to
   accept text that `parseNumber(text, context)` parses; drop the affix characters from
   the keystroke pattern derivation. Closes the locale-mismatched-paste open question
   the same way the PoC does. Whichever branch lands first carries the
   `input-control-mixin.js` `@protected` promotion.
   **Finding from the minimal branch (deferred there):** the promotion is three
   handlers, not two — `InputControlMixin._onBeforeInput` tests `e.data` against the
   same whole-text regexp, so an accepting `_onPaste` override can be undone by the
   `beforeinput` guard in browsers that populate `data` for `insertFromPaste`. Without
   a locale context the only gain is whitespace-padded paste, so the minimal branch
   records the finding and leaves the change to the locale layer.
3. **Add the idempotence guard to presentation writes** (skip when the string is
   unchanged) — the mixin brings it anyway, and it removes the `_incrementValue`
   double-write today.
4. **Do not add what the mixin will own:** no bespoke `formattedValue`, no live-format
   experiments, no composition handling. Record them in the notes as "arrives with
   FormatMixin adoption".
5. **Move value normalization from `_valueChanged` into a `value` accessor pair**
   (wc#8007, §3): parse-or-clear plus the `String()` conversion before `super.value =`,
   warning kept in the accessor. Tests: an unparsable set on an empty field fires zero
   `value-changed` events; a numeric set fires exactly one. integer-field's
   `_valueChanged` warn-and-clear moves the same way.
6. **Add the strict-parse regression tests** (wc#1263, §3): `'3foo'`, `'12abc'`,
   `'0x10'`, `'Infinity'` each warn and clear — the self-review's open test gap, now
   with the issue citation.

## 6. Doc and RFC follow-ups

- `field-formatting.md` release buckets: add the dependency line — number-field
  `type="text"` first (precondition), FormatMixin core additively in 25.4, number-field
  adopts the mixin **core** (not the chunking property) in its v26 breaking change.
- API RFC (next-step 6): fold the `locale`/`formatOptions`-vs-`format`-object and
  vs-`I18nMixin` questions into one item — **one config-transport pattern for all
  formatted fields**. Driver D1 (one Flow `Serializable` bean → one JSON property)
  argues for an object on number-field too; deciding per component forks the pattern.
- flow-components: add the fc#4620 exponent parser fix (`DecimalFormat` drops a
  lowercase-`e` exponent) to the remaining-flow-work list next to the BigDecimalField
  and `"NaN"`-literal items.
- API RFC: decide whether the canonical `value` admits exponent notation or is
  normalized to plain decimal by lossless string expansion (§3, fc#4620 option 2) —
  it changes the pinned typed-text fidelity contract, so it must be decided once, not
  patched.
- Shared follow-ups both branches point at: the protected default-`allowedCharPattern`
  seam, the single value→input write funnel in field-base, and the `pattern`
  non-delegation logic needing a shared home once a second component formats.
