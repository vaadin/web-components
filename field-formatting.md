# Field formatting & input mask — summary, PoC scope, next steps

Short version of two longer working docs:

- [`field-formatting-input-mask.md`](./field-formatting-input-mask.md) — raw notes: issue links and the Slack discussion
- [`field-formatting-use-cases.md`](./field-formatting-use-cases.md) — use cases, add-on API survey, Lion prior art
- [`field-formatting-number.md`](./field-formatting-number.md) — number-field × FormatMixin convergence handoff for v26

**Out of scope:** `number-field` — on hold until the `input type="text"` refactor lands
(`proto/number-field-type-text-v2`). Number and currency formatting come back after that.

## Background

- Feature request: https://github.com/vaadin/platform/issues/9364
- Related issues:
  - https://github.com/vaadin/web-components/issues/1267
  - https://github.com/vaadin/web-components/issues/1271
  - https://github.com/vaadin/flow-components/issues/1144
- Slack thread: https://vaadin.slack.com/archives/C0AK1KF8YVA/p1788353668646829
- Add-ons:
- [vcf-input-mask](https://github.com/vaadin-component-factory/input-mask/tree/v25/vcf-input-mask) (IMask)- [textfieldformatter-zen](https://github.com/vaadin-component-factory/textfieldformatter-zen/tree/v25) (cleave-zen)
- [super-fields](https://github.com/vaadin-miki/super-fields)

Add-ons work from _outside_ the field — they append a helper element, reach into `inputElement`, and call private `_onChange`. This results in bugs: value sync in EAGER / TIMEOUT mode, paste, runtime mask change, caret jumps. Fixing it properly means doing it inside the
field.

## 3 separate features

|     | Feature          | Changes                                     | When                         |
| --- | ---------------- | ------------------------------------------- | ---------------------------- |
| A   | **Format**       | what the user sees                          | as you type, or on commit    |
| B   | **Parse**        | what the server / Binder gets               | on commit                    |
| C   | **Visible mask** | a hint of the expected shape (`__ __ ____`) | while empty or partly filled |

## Use cases

| Use case                         | Example                                                                        | Cost                                  |
| -------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------- |
| Chunking                         | `FI2112345600000785` → `FI21 1234 5600 0007 85`, `0401234567` → `040 123 4567` | low                                   |
| Normalize on commit              | `5.1.2027` → `05.01.2027`, lower → upper case                                  | low                                   |
| Parse to model                   | `FI21 1234 …` → `FI2112345600000785`, `0401234567` → `+358401234567`           | low–medium                            |
| Date/time as you type            | separators inserted from the configured `dateFormat`                           | medium                                |
| Visible placeholder mask         | `DD.MM.YYYY` → `05.MM.YYYY`                                                    | medium, a11y unknown                  |
| Value-dependent groups           | AMEX `4-6-5` vs `4-4-4-4`; German area codes 3 or 4 digits                     | medium–high                           |
| Embedded literals / legacy masks | `*\08\0\0\0-00-**-000000-0` → `C08000-10-47-600137-4`                          | high                                  |
| International phone as you type  | any country                                                                    | out — needs libphonenumber-sized data |

## Prior art

**The value model is the decision.** cleave writes the formatted string into `input.value` and that _is_
the value — separators leak into the model. IMask keeps `value` / `unmaskedValue` separate. We need the
split.

**Whole-string reformat + caret restore does not work.** cleave's Backspace-over-a-delimiter bug is
[wontfix by design](https://github.com/nosir/cleave.js/issues/374). Editing has to be handled as intents
(insert, delete, paste), and the simplest rule already helps a lot: _do not reformat while deleting_.

**No grammar needed for the cheap 80%.** Lion's
[`FormatMixin`](https://github.com/ing-bank/lion/blob/master/packages/ui/components/form-core/src/FormatMixin.js)
covers IBAN, phone, amount and date with three overridable hooks — `preprocessor` (live), `formatter`
(commit), `parser` (view → model) — plus a `_reflectBackOn()` predicate that decides when the field may
overwrite what the user is typing. No mask DSL anywhere. A grammar is only needed for legacy masks and
variable-length groups.

**Engine constraints.** IMask requires `type="text"` — affects `email-field` (`_setType('email')`) as well
as `number-field`. cleave.js is dead, cleave-zen stale; IMask 7 is alive.

**Maskito's model is the one to copy.** A per-position mask (`Array<RegExp | string>`) with five pure
functions over `{ value, selection }`, and a mask that may be a function of the value for variable-length
shapes. The prototype reimplements that model (`mask-utils.js`) and generates chunking from it as a dynamic
mask, so one engine serves groups and masks. Details in
[`field-formatting-use-cases.md`](./field-formatting-use-cases.md) §3.7.

## Proposed direction

A separate experimental component, `<vaadin-masked-field>` in `@vaadin/masked-field`, built on text-field
(the way password-field is) and gated behind `window.Vaadin.featureFlags.maskedFieldComponent`, so text-field,
email-field, password-field and grid-pro's editor are untouched while the behaviour is proven. Integrating the
capability into text-field itself stays a future option. The component carries an explicit two-value contract:

- `value` — the model value (what Binder sees), unchanged unless a format is configured
- `inputElement.value` — the presentation, owned by the mixin

Three opt-in layers on top, all three on the branch:

1. **Chunking formatter** — blocks + delimiter + case. IBAN, national phone, card.
2. **Pattern mask** — per-position classes, literals, trailing optional sections. Legacy masks, SSN,
   ZIP+4.
3. **Visible placeholder mask** — `formatPrompt`, drawn as a `prompt` shadow part beside the input
   rather than as characters inside it, so the value, the caret and the deletions are untouched and
   the part is `aria-hidden`.

On top of the two-value contract, the prototype carries five behaviours adopted from USWDS, Ignite UI
and the shadcn/ui thread:

| Behaviour                      | Property                                               | Note                                                                                       |
| ------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Trailing optional sections     | `formatMask="00000[-0000]"`                            | trailing run only; sections enable left to right                                           |
| Completeness as a constraint   | `formatCompletionRequired`                             | opt-in, checked on commit, no message of its own                                           |
| Unicode digits stored as ASCII | —                                                      | typing path normalises the value, programmatic path presents normalised digits, value kept |
| Derived `inputmode`            | —                                                      | `numeric` for an all-digit mask while `inputMode` is unset                                 |
| Visible shape while typing     | `formatPrompt="_"`, `prompt` part, `has-format-prompt` | hidden while a `placeholder` shows; nothing for blocks                                     |

Deferred to the API RFC rather than built: announcing a rejected character to a screen reader (A1)
and describing the accepted shape (A3), undo across the field's own edits, and a selector that picks
one of several shapes from the value, which is what non-trailing optional sections need.

Where it plugs into `input-mixin.js` today: `_onInput` → live format; `_onChange` → commit format;
`_valueChanged` → programmatic format, gated by the reflect predicate; `_inputElementValue` setter →
caret-preserving write.

## Flow API considerations

Details in [`field-formatting-use-cases.md`](./field-formatting-use-cases.md) §3.5–3.6.

- **Flow ships data, not functions.** Lion-style JS hooks cannot be set from Java — that is why
  vcf-input-mask needed `eval`. Live formatting must be **declarative WC properties**; custom Java logic
  can only run at commit, after a round trip. Two tiers:

  | Tier   | Runs                    | Configured by                                                                          | Covers           |
  | ------ | ----------------------- | -------------------------------------------------------------------------------------- | ---------------- |
  | Live   | client, every `input`   | properties set from Java (`formatBlocks`, `formatDelimiter`, `formatTextCase`, `mask`) | chunking, masks  |
  | Commit | server, on value change | `SerializableFunction<String, Result<String>>`                                         | normalize, parse |

- **The split already exists in Flow.** `AbstractSinglePropertyField` takes `presentationToModel` /
  `modelToPresentation`; `DatePicker` (`String` ↔ `LocalDate`) and `AbstractNumberField` use it today.
- **`_inputElementValue` + `unparsable-change`** is the established WC↔Flow contract for "what was typed"
  vs "the value" — DatePicker and NumberField sync it, keep a server-side `unparsableValue`, and validate
  with `badInputErrorMessage`. Reuse it for a masked `TextField` instead of inventing a new channel.
- **A server-side parse hook already exists:** `DatePicker#setFallbackParser(SerializableFunction<String,
Result<LocalDate>>)` — runs in `setModelValue`, pushes the parsed value back as presentation, turns
  `Result.error` into a validation error. Same shape on `TextField` covers normalize-on-commit and
  parse-to-model with **no WC work**.
- **Value-change modes need no Flow change** if the WC formats inside `_onInput`: Flow reads `value` on the
  `input` event, and `_onInput` has already written the model value by then. Add-ons fail because their
  listener runs later.
- **`pattern` / `minlength` / `maxlength` straddle the split**: server validates the model
  (`TextFieldValidationSupport`), client delegates them to the native input, i.e. the presentation.
  `maxlength=18` blocks a spaced IBAN. Needs a decision.
- **Properties, not `callJsFunction`.** SuperFields configures via `runWhenAttached` + `callJsFunction`
  and needed a `performDelayedInitialisation` hack for Grid re-attach. Follow `HasAllowedCharPattern`: a
  shared default-method interface over one property, plus `bindXxx(Signal)` overloads. Config beans must be
  `Serializable`.
- **Binder:** keep `TextField` a `String` field with `value` already normalized. Typed models stay with
  `DatePicker`-style subclasses or Binder converters. "Invalid without a value change" (incomplete mask) uses
  `ValidationStatusChangeEvent`, as NumberField does.
- **SuperFields lessons:** derive `pattern` / `allowedCharPattern` / `inputmode` from the format config
  instead of asking twice; accept alternative separators when parsing (NBSP → space); "strip grouping on
  focus, format on blur" is a cheap on-commit mode with zero client code. Java composition
  (`CustomField` around `TextField`) collected the same class of bugs as the JS wrappers.

## Minimal PoC

**Goal:** show that doing this inside the field removes the _class_ of bugs the add-ons patch one by one.

**Scope**

- `vaadin-text-field` only. Web component only — no Flow API yet.
- One layer: chunking. Three flat properties: `formatBlocks` (`format-blocks`, JSON array), `formatDelimiter`
  (`format-delimiter`, one character, default space) and `formatTextCase` (`format-text-case`, `upper` |
  `lower`). Flat rather than one `format` object because every other TextField constraint is flat, Flow binds
  signals per property, and Hilla exposes props 1:1; the `format` prefix groups them next to `formattedValue`.
- Value contract: `value` = unformatted, `inputElement.value` = formatted. Read-only `formattedValue`
  for anyone who wants the string.
- Live formatting on insert and paste; no reformat on delete.
- Caret preserved on every write the mixin makes.
- Dev page `dev/text-field.html` gets an IBAN and a phone example.

**Must pass**

- [ ] `value-change-mode` EAGER, LAZY, TIMEOUT all deliver the _unformatted_ value, never a rejected char
- [ ] Paste formatted, unformatted, and over-long strings — full field and mid-string
- [ ] Backspace / Delete directly before and after a delimiter removes a _user_ character
- [ ] Insert in the middle keeps the caret next to the typed character
- [ ] Programmatic `value` set while focused keeps the caret
- [ ] Change `blocks` at runtime with a value present — value reformats, nothing truncated
- [ ] `clear()`, `required`, `pattern`, `allowedCharPattern`, `maxlength` still behave
- [ ] IME composition is not interrupted
- [ ] VoiceOver / NVDA: inserted separators do not produce confusing announcements

**Not in the PoC:** mask grammar, visible mask, date-picker, text-area, Flow API, number-field.

## Release buckets

Rule of thumb: nothing changes for an app that does not opt in → 25.4. Existing behavior changes but the
API stays → 25.4 with a release note. A default flips or an API goes → 26.

### Additive — fine for 25.4

| Item                                                                                                            | Note                                                                                 |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Format mixin in `field-base` with identity defaults                                                             | zero behavior change until configured                                                |
| Chunking properties on `text-field` (and later `text-area`)                                                     | opt-in                                                                               |
| Read-only `formattedValue`                                                                                      | new property                                                                         |
| Pattern-mask property (layer 2)                                                                                 | opt-in; grammar TBD                                                                  |
| Visible placeholder mask (layer 3)                                                                              | opt-in; blocked on a11y                                                              |
| `date-picker` / `time-picker` as-you-type, **opt-in** flag derived from `dateFormat`                            | default stays off                                                                    |
| Flow: `setFormatBlocks(int...)`, `setFormatDelimiter(String)`, `setFormatTextCase(TextCase)`, `setMask(String)` | Binder already gets `value`; `getFormattedValue()` needs `notify` on the WC property |
| Flow: shared `HasInputFormat` default-method interface over those properties, with `bindXxx(Signal)`            | same pattern as `HasAllowedCharPattern`; `@Synchronize` works on interface getters   |
| Flow: `TextField#setFallbackParser(SerializableFunction<String, Result<String>>)`                               | copies the `DatePicker` hook; commit-time only                                       |
| Flow: `TextFieldI18n#setBadInputErrorMessage`                                                                   | mirrors `AbstractNumberFieldI18n`                                                    |
| Flow: overflow / truncation event on paste                                                                      | mirrors the cleave add-on's `PasteOverflowEvent`                                     |

### Behavior-altering — acceptable in 25.4, call out in release notes

| Item                                                                              | What changes                                                                              |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Caret-preserving `_inputElementValue` writes for all text fields                  | programmatic `value` set while focused no longer jumps caret to end                       |
| Route `_onInput` / `_valueChanged` through one sync function                      | internal; timing of `value-changed` must stay identical — regression risk, not API change |
| Suspend value sync during IME composition                                         | fewer intermediate `value-changed` events in EAGER mode for IME users                     |
| `allowedCharPattern` deprecated in favour of the mask when both are set           | still works; warning only                                                                 |
| `maxlength` / `pattern` not delegated to the native input when a format is active | only fields with a format configured; server-side validation unchanged                    |

### Breaking — postpone to 26

| Item                                                                                           | Why it breaks                                                                  |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| As-you-type formatting **on by default** in `date-picker` / `time-picker` / `date-time-picker` | visible UX change for every app                                                |
| `email-field` switching `_setType('email')` → `text` + `inputmode="email"`                     | native `typeMismatch` validity, autofill and `inputElement.type` checks change |
| `number-field` → `type="text"`                                                                 | tracked separately; same class of change                                       |
| Removing `allowedCharPattern`                                                                  | API removal                                                                    |
| Changing what `value` / `value-changed` carry for a field **without** a format configured      | contract change for every consumer                                             |
| Non-string `value` (Lion-style `Unparseable` object)                                           | type change; keep `value` a string, use `invalid` instead                      |
| Flow: changing `TextField`'s value type or `getValue()` semantics without a format             | every Binder binding and converter breaks                                      |
| New or renamed `input-container` parts to host a mask overlay                                  | theming break                                                                  |

## Next steps

1. **Answer the a11y question.** Screen-reader behaviour with auto-inserted separators and caret moves.
   Nothing sourced survived the research pass. This can veto layers 2 and 3 and shapes layer 1.
2. **Re-read the issue threads** (#9364 and the three linked) to confirm use-case priority. The ranking
   above comes from the Slack thread only.
3. **Decide the value contract** — `value` = model. Confirm with Flow (Binder, `ValueChangeMode`), and
   decide what `pattern` / `maxlength` apply to under a format.
   - Cheap Flow win in parallel: prototype `TextField#setFallbackParser` on the `DatePicker` model —
     normalize-on-commit and parse-to-model with no WC changes. Shows how much of the demand the commit
     tier already covers.
4. **Build the PoC** as scoped above, on a `proto/*` branch.
5. **Run the must-pass list** plus a VoiceOver / NVDA session. Record what the add-ons get wrong on the
   same list for comparison.
6. **Write the API RFC** — property names, Flow classes, how `pattern` / `allowedCharPattern` compose with
   the format. Target the additive bucket for 25.4.
7. **Then extend:** `text-area`; `date-picker` opt-in as-you-type from `dateFormat`. All three layers are
   on the `proto/masked-field` branch: `formatMask` with the IMask token subset plus trailing `[…]`
   sections, one engine with chunking (`InputFormatMixin` over `mask-utils.js`), widened deletes, regroup
   on every delete, and the `formatPrompt` overlay.
   - The whole engine lives in `packages/masked-field/src/` — `format-mixin.js`, `input-format-mixin.js`,
     `mask-utils.js` and `chunk-mask.js` moved out of `field-base`, which keeps only the seams
     (`_inputValueFromModel`, `_modelValueFromInput`, `_shouldAcceptText`). text-field, email-field,
     password-field and grid-pro carry no diff at all.
   - Spec documents for the experimental `@vaadin/masked-field` package live in `packages/masked-field/spec/`
     (problem statement, requirements, web component API, Flow API).
8. **Undo across live formatting** — still dropped. Every reformat is a script write and clears the
   native undo stack, so RFC options are: accept absent undo (peer libraries do), route all presentation
   writes through `execCommand('insertText')`, or keep a field-owned history as Maskito does.
9. **Coordinate with Component Factory** on a deprecation path for the two add-ons once layer 1 ships.
10. **Revisit `number-field`** after the `type="text"` refactor — number/currency formatting reuses the
    same mixin.
