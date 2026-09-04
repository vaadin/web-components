# Field formatting & input mask — use cases and add-on API survey

Working doc. Companion to [`field-formatting-input-mask.md`](./field-formatting-input-mask.md), which
collects the raw issue links and Slack quotes. This one turns those into a use-case list and surveys the
API of the two Component Factory add-ons.

**Scope:** `text-field`, `text-area`, `email-field`, `date-picker`, `time-picker`, `date-time-picker`,
`combo-box` (custom value), and a possible shared `field-base` mixin.
**Out of scope:** `number-field` — on hold pending the `input type="text"` refactor
(`proto/number-field-type-text-v2`). Number and currency formatting are only mentioned where they
constrain the shared API.

---

## 1. Three features, not one

The request is regularly stated as "input mask", but it is three separable features. Juuso in the source
notes: _"Formatting, parsing and visible masks are all nice things and with current addons using one
technique rules out the others AFAIK."_ Each add-on implements one and blocks the other two.

| #   | Feature               | What it changes                          | Runs                                      |
| --- | --------------------- | ---------------------------------------- | ----------------------------------------- |
| A   | **Format**            | how the value is displayed               | as you type, or on blur                   |
| B   | **Parse / normalize** | the value the server receives            | on commit                                 |
| C   | **Visible mask**      | an affordance showing the expected shape | while the field is empty or partly filled |

They can conflict, and the notes say so explicitly — Juuso: _"I am not suggesting that we should have
formatting, parsing and visible masks for all inputs."_

---

## 2. Use cases

### 2.1 Chunking / grouping (format as you type)

Insert separators into an otherwise continuous value. Rolf: _"The chunking (i.e. space-based
segmentation) for e.g. IBAN or phone numbers should IMO be easily doable as a feature."_ This is the
cheapest, highest-value subset.

| Case                   | Input                | Displayed                |
| ---------------------- | -------------------- | ------------------------ |
| IBAN                   | `FI2112345600000785` | `FI21 1234 5600 0007 85` |
| National phone (FI)    | `0401234567`         | `040 123 4567`           |
| Payment card, 16-digit | `4111111111111111`   | `4111 1111 1111 1111`    |
| Payment card, AMEX     | `341111111111111`    | `3411 111111 11111`      |

Card grouping is the proof that block patterns cannot be static: 4-4-4-4 for 16-digit VISA / MasterCard /
Discover / JCB, but **4-6-5 for 15-digit AMEX**, detected from the `34`/`37` prefix, plus 14-digit Diners
(4-6-4), variable-length Maestro and 19-digit ranges
([Baymard](https://baymard.com/blog/credit-card-field-auto-format-spaces)). A chunking API therefore needs
either value-dependent block selection or a dedicated card mode.

### 2.2 Formatting on commit (normalize what was typed)

Reformat a loosely typed value into the canonical presentation when the field commits.

| Case                        | Typed          | Displayed after commit |
| --------------------------- | -------------- | ---------------------- |
| Date, missing leading zeros | `5.1.2027`     | `05.01.2027`           |
| Padding / case              | `fi21 1234...` | `FI21 1234 …`          |

### 2.3 Parsing / normalization (what the server gets)

The typed form and the model form differ. Jean-Christophe: _"Pattern validation is different [from] what
I expect, because I need to type the separators 044-787-90-90 or allow bad data in the backend like
04478790-90 or revalidate/reparse it."_

| Case                            | Typed                    | Model value          |
| ------------------------------- | ------------------------ | -------------------- |
| Finnish domestic account → IBAN | `211234-56785`           | `FI2112345600000785` |
| National phone → E.164          | `0401234567`             | `+358401234567`      |
| Short date → ISO / `LocalDate`  | `5/1/27`                 | `2027-01-05`         |
| Grouped value → plain           | `FI21 1234 5600 0007 85` | `FI2112345600000785` |

The last row is the one today's formatter add-on gets wrong: the separators end up in the model value.

### 2.4 Visible mask / placeholder mask

Show the expected shape and fill it in progressively.

| Case  | Empty                | Partly typed         | Complete             |
| ----- | -------------------- | -------------------- | -------------------- |
| IBAN  | `FI################` | `FI21123###########` | `FI2112345600000785` |
| Phone | `___ ___ ____`       | `040 ___ ____`       | `040 123 4567`       |
| Date  | `DD-MM-YYYY`         | `05.MM.YYYY`         | `05.01.2027`         |

The concrete Vaadin gap, from Juuso: _"Missing in DatePicker: Visible mask and or formatting as you type.
Our Date Format example uses placeholder + helper text (which probably no one does). Once you type, the
placeholder is hidden and you lose the hint of date format. You need to guess the right separator
character whereas in formatting the separator is added for you and you just type in numbers."_

### 2.5 Embedded literal segments (legacy alphanumeric masks)

Fixed characters **inside** the value, not only between groups. Johannes: mask
`*\08\0\0\0-00-**-000000-0`, where `08000` is a constant in the middle — the user types `C10476001374`
and gets `C08000-10-47-600137-4`. This is the Swing `JFormattedTextField` + `MaskFormatter` behaviour
that legacy apps are migrating away from.

Requirements this creates: per-position character classes, literals that are skipped over while typing,
and a decision on whether the literals belong to the model value.

### 2.6 Variable-length groups and alternatives

Olli: a Finnish SSN is `[8 digits]` `[one of -, +, A]` `[3 digits + a checksum char computed from the
rest]`. German landlines have a 3- or 4-digit area code — `+49 030 1234567` (Berlin) vs
`+49 0211 1234567` (Düsseldorf) — _"so where to put the space after the second group depends on the value
of the second group."_

Requirements: alternative patterns selected from the value, optional sections, and a per-position class
that is not just "digit".

### 2.7 Locale and i18n

Separator characters, date field order, and grouping style are locale-dependent. For date and time fields
the mask overlaps with the existing `i18n` `dateFormat` / parser — the same information would otherwise be
configured twice.

### 2.8 Explicitly out of scope for now

Numeral and currency formatting (`1234567.12` → `$1,234,567.12`, `500 000,34 €`, Indian _lakh_ and Chinese
_wan_ grouping). Jean-Christophe: _"Not being able to have a number field with 500,000.34 euros is
annoying."_ Deferred with `number-field` until it moves to `input type="text"`.

Full international as-you-type phone formatting is also out of scope: it needs libphonenumber-sized locale
data. cleave.js split its phone support into per-country add-ons for exactly that reason — the full i18n
lib is 254 KB minified / 50 KB gzipped, versus 14 KB / 5 KB per country
([cleave.js phone addon docs](https://github.com/nosir/cleave.js/blob/master/doc/phone-lib-addon.md)).
Plain grouping of a _known_ national format (§2.1) stays in scope; resolving the country from the digits
does not.

---

## 3. Add-on API survey

### 3.1 vcf-input-mask — masking (IMask)

`~/cf/input-mask`, branch `v25`, wraps `imask` 7.1.3.

**Web component** — `vcf-input-mask/src/main/resources/META-INF/frontend/src/input-mask.js`

`<input-mask>` is a `LitElement` appended **as a child of the host field**, which then reaches into
`host.inputElement`.

- properties: `options` (a JSON string of key/value pairs), `imask`, `allowWhitespace`
- getter `unmaskedValue`; methods `getUnmaskedValue()`, `getMaskedValue()`, `setValue(value)`
- event `unmasked-value-changed` (composed, bubbles)
- host detection by tag name: `VAADIN-TEXT-FIELD` / `VAADIN-TEXT-AREA` bind to `parent.inputElement` and
  listen on `change` / `input` / `paste`; anything else falls back to `parent.querySelector('input')` and
  the host's `value-changed`

**Flow API** — `vcf-input-mask/src/main/java/com/vaadin/componentfactory/addons/inputmask/InputMask.java`

```java
TextField phoneField = new TextField("Phone");
new InputMask("(000) 000-0000").extend(phoneField);
```

- `InputMask extends AbstractSinglePropertyField<InputMask, String> implements HasValidation`, single
  property `unmaskedValue` — so the _wrapper itself_ is the `HasValue` carrying the unmasked value, and
  Binder is pointed at the wrapper, not the field, when the app wants unmasked data
- `extend(Component)` / `remove()`, `WeakReference` to the host plus an attach listener
- `setMask(String)`, `setMask(String, boolean evalMask)`, `setMask(String, boolean, InputMaskOption...)`
- reads are **async callbacks**: `getUnmaskedValue(SerializableConsumer<String>)`, `getMaskedValue(…)`
- `setAllowWhitespace(boolean)`; `HasValidation` methods proxy to the host component
- `InputMaskOption.option(key, value[, eval])` — untyped key/value pairs mirroring IMask option names, with
  only four named helpers: `blocks(...)`, `lazy(boolean)`, `overwrite(boolean)`, `toUppercase()`
  (implemented as the eval'd JS `str => str.toUpperCase()`)
- `evalMask=true` passes the mask through client-side `eval()` so IMask can receive a regex literal or a
  built-in like `"Number"`. The Javadoc carries an explicit security warning; the option exists because
  the JSON option channel cannot express functions
- `setPresentationValue` **throws `IllegalArgumentException` unless the host is a `TextField`** — unmasked
  binding is TextField-only

**What the source tells us.** Johannes named three fragilities — _"value sync in eager mode, paste
handling, runtime mask changes"_ — and all three are hand-patched in `input-mask.js`:

- `_handleMaskedInput` is registered _after_ `new IMask(...)` so it runs after IMask reformats, then
  defers the correction to a `queueMicrotask`, guarded on `e.isTrusted` and `document.activeElement`.
  Without it, EAGER / TIMEOUT value-change modes send the server the raw pre-mask text, including
  characters the mask rejected.
- `_handlePaste` detects `eager` masks, calls `preventDefault()`, routes full-field pastes through
  `imask.value = text`, restores the caret with `nearestInputPos(...)` and synthesises a `change` event,
  because the prevented paste never marks the input dirty.
- `updated()` on `options` re-seeds IMask from `host.value` on a runtime mask swap, because the DOM value
  may already be truncated by the previous, shorter mask (`"2005"` shown as `"20"` under a `"00"` mask).
- `_syncImaskFromInput()` runs before every read, because a server-driven `setValue` can otherwise make
  `getMaskedValue()` return a lag-by-one value.
- `_handleKeyEvent` intercepts Space at caret 0 and select-all-then-Space — a hack that had to be made
  opt-out via `allowWhitespace`.

Demos cover: phone on TextField and TextArea, `"00/00/0000"` on DatePicker paired with
`DatePickerI18n.setDateFormat`, a `"Number"` mask with `scale`/`thousandsSeparator`/`radix`, a regex mask,
the **embedded constant mask** from §2.5 (`lazy(false)`, `placeholderChar: " "`, `eager: true`), runtime
mask switching from a `Select`, and both Binder styles.

### 3.2 textfieldformatter-zen — formatting (cleave-zen)

`~/cf/textfieldformatter-zen`, branch `v25`, wraps `cleave-zen` 0.0.17 + `libphonenumber-js` 1.12.8.

The README states the design fork outright: _"Different from an input mask, the actual value of the input
field is formatted."_

**Web component** — `cleave-zen-formatter/src/main/resources/META-INF/resources/frontend/textfield-formatter.ts`

`<textfield-formatter>`, a plain `HTMLElement`, also appended as a child of the host. Imperative API only —
no attributes, no properties, no events:

- `updateConf(configuration, formatType)` where `formatType ∈ 'creditCard' | 'general' | 'numeral' | 'date' | 'time' | 'phone'`
- `updateValueChangeEvent(eventName)`
- finds the input via `parentElement.shadowRoot.querySelector('input')` with a light-DOM fallback
- on every `input`, formats the whole string and writes it back to both `el.value` and `parent.value`,
  then calls the host's **private** `_onChange(e)`
- caret handling is delegated to cleave-zen's `registerCursorTracker({ input, delimiter })`
- calls `$server.onCreditCardChanged(type)` and `$server.onPasteOverflow(original, formatted)`

**Flow API** — `cleave-zen-formatter/src/main/java/org/vaadin/addons/componentfactory/cleavezenformatter/`

`abstract CleaveExtension<CONF extends AbstractCleaveConfiguration> extends Component` (`conf/CleaveExtension.java`)
provides `extend(Component)` / `remove()`, pushes config via `executeJs("$0.updateConf($1,$2)")`, reads
`HasValueChangeMode.getValueChangeMode()` to pick the DOM event, and exposes
`addPasteOverflowListener` → `PasteOverflowEvent(originalValue, formattedValue)`, fired when a pasted value
is truncated by the format. Concrete formatters, all with `extend(TextField)`:

| Class                        | Configuration                                                                                                                                                                                                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CustomStringBlockFormatter` | `int[] blocks`, `String[] delimiters`, `delimiterLazyShow`, `ForceCase {NONE,UPPER,LOWER}`, `prefix` (+`showPrefixImmediately`), `numericOnly`; `Options` bean + fluent `Builder` (`block(len, delim)`, `blocks(int...)`, `delimiters(…)`, `numeric()`, `forceCase(…)`) |
| `IBANFormatter`              | `fromIBANLength(int)` — 4-char blocks with a shorter tail, forced upper case, `" "` delimiter                                                                                                                                                                           |
| `CreditCardFieldFormatter`   | `creditCardStrictMode` (19-digit PAN); `addCreditCardChangedListener` → `CreditCardType` enum of 14 brands                                                                                                                                                              |
| `DateFieldFormatter`         | `datePattern` (`yyyy\|yy\|MM\|dd`, translated to cleave's `Y\|y\|m\|d`), `dateMin` / `dateMax` as `LocalDate` (clamps the typed value), `delimiter`; `Builder`                                                                                                          |
| `NumeralFieldFormatter`      | `delimiter`, `numeralDecimalMark`, integer/decimal scale, `numeralPositiveOnly`, `ThousandsGroupStyle {THOUSAND, LAKH, WAN, NONE}`, `signBeforePrefix`, `stripLeadingZeroes`, `prefix`, `tailPrefix`; `Builder`                                                         |
| `PhoneFieldFormatter`        | `country` (default `"US"`), `formatNational` — delegates to libphonenumber-js                                                                                                                                                                                           |

**Documented limitations** (`TODO.md`, verbatim):

- _"A different ValueChangeMode for the TextField are not working well since the value is formatted eagerly
  and updated to the server side automatically (if it's not updated automatically with the `_onChange` then
  the value is wrong on the server side!)"_
- _"The cursor position might be an issue to be tested. It doesn't work for all the different cases (with
  delimiters)"_
- `noImmediatePrefix` has no cleave-zen equivalent
- missing from cleave-zen: add leading zero (`.99` → `0.99`), always display decimals (`99` → `99.00`)

### 3.3 Engine constraints worth knowing

- **cleave-zen has no per-character grammar.** `FormatGeneralOptions` is `blocks: number[]` plus
  delimiters/prefix, with `numericOnly` / `uppercase` / `lowercase` as _global_ booleans. Delimiters only
  go _between_ blocks. §2.5 (literal inside a group) and §2.6 (per-position classes) are inexpressible.
- **cleave.js has a known, wontfix caret defect.**
  [nosir/cleave.js#374](https://github.com/nosir/cleave.js/issues/374): _"When using Backspace in the middle
  of an input, delimiters will consume keystrokes to give unintuitive results."_ The maintainer's own
  diagnosis: _"it's hard since how the lib works is totally based on string replacement but not mask input
  actions. TL;DR: won't fix this soon."_ Juuso reported the same symptom independently. cleave-zen does not
  fix it — `registerCursorTracker` listens to `input` _after_ the browser applied the edit and restores a
  caret index in a `setTimeout(…, 0)`; it never intercepts Backspace over a delimiter.
- **cleave-zen's factoring is nevertheless the right one for us:** pure `format*(value, options) → string`
  functions plus an opt-in `registerCursorTracker(props): CursorTrackerDestructor`. The formatting logic
  stays pure and testable and the _component_ owns the DOM write, the caret and the lifecycle — which is
  exactly what a field-base mixin is positioned to do. ([cleave.js#723](https://github.com/nosir/cleave.js/issues/723))
- **IMask keeps the value split.** `value` (masked), `unmaskedValue` (raw) and `typedValue` are separate,
  two-way assignable accessors: `mask.unmaskedValue = '70000000000'` yields
  `mask.value === '+7(000)000-00-00'`. It also has dynamic masks (an array of masks, best-fit selection plus
  a `dispatch` callback) for §2.6, and `lazy: false` + `placeholderChar` for §2.4.
- **IMask requires `type="text"`.** From its guide: _"If you apply mask to `input` element you have to use
  `type=text`. Other types are not supported."_ In this repo that rules out `email-field`
  (`packages/email-field/src/vaadin-email-field.js:116` → `_setType('email')`) as well as `number-field`
  (`packages/number-field/src/vaadin-number-field-mixin.js:75`). This is engine-specific, not inherent — we
  control `_setType` — but any IMask-backed prototype has to plan for it.
- **Maintenance risk.** cleave.js: last code push 2020, deprecated 2023. cleave-zen: last push 2024-02, an
  open "is this dead?" issue. IMask 7.x is current, though the add-on pins 7.1.3 while the docs describe
  7.6.x, and [imaskjs#1035](https://github.com/uNmAnNeR/imaskjs/issues/1035) is a live regression where the
  `lazy:false` placeholder is not painted until first interaction.

### 3.4 Lion `form-core` — the closest prior art to a built-in mixin

`~/cf/lion/packages/ui/components/form-core/src/FormatMixin.js` (ING's Lion). Not an add-on wrapping a
masking library — a _mixin inside the field_, which is the shape §4 argues for. Worth studying closely
because it solves several problems both Component Factory add-ons hand-patch from the outside.

**Value model.** Four representations, connected by four overridable hooks:

| Representation    | Meaning                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `value`           | the view value, delegated to `_inputNode.value`                                              |
| `formattedValue`  | the _scheduled_ view value — the formatter's output, held until the reflect condition is met |
| `modelValue`      | the typed value the app works with (`Date`, `Number`, IBAN string…)                          |
| `serializedValue` | the transport form (ISO date, `'1234.56'`)                                                   |

Hooks: `parser(viewValue, opts) → modelValue`, `formatter(modelValue, opts) → string`,
`serializer` / `deserializer`, plus `preprocessor` (below). Two flows, documented in the mixin header:
app sets `modelValue` → formatter → view; user types → parser → `modelValue` → formatter → _debounced_
back to the view.

**`preprocessor` — the live formatter, separate from `formatter`.** _"Preprocessors could be considered
'live formatters'… preprocessors are run before modelValue is computed (and work based on view value),
whereas formatters are run after the parser."_ Signature:

```js
preprocessor(viewValue, { currentCaretIndex, prevViewValue, mode })
  → { viewValue, caretIndex } | string | undefined
```

This is precisely the §2.1 / §2.2 split — format-as-you-type vs. format-on-commit — as two different hooks
rather than one setting. Returning `undefined` means "leave it alone", which preserves the caret by doing
nothing.

**Caret handling is in the contract, not bolted on.** `__handlePreprocessor` reads `selectionStart`
_before_ calling the preprocessor, passes it in, and writes back the returned `caretIndex`.
`NativeTextFieldMixin._setValueAndPreserveCaret` restores the selection on every programmatic write, only
when focused (changing `selectionStart` moves focus in Safari) and inside a try/catch for input types that
throw. And `liveFormatPhoneNumber` (`input-tel/src/preprocessors.js`) opens with:

```js
const diff = viewValue.length - prevViewValue.length;
if (diff <= 0 || !PhoneUtilManager.isLoaded) return undefined; // don't reformat while deleting
```

That single guard is the answer to the cleave backspace defect (§3.3) — don't fight the delete.

**`_reflectBackOn()` — one overridable predicate for "may I overwrite what the user sees?"** Default
`!this._isHandlingUserInput`. `input-amount` extends it to `super._reflectBackOn() || this._isPasting`;
`input-tel` to `!this.__isUpdatingRegionWhileFocused && super._reflectBackOn()`. This is the exact fault
line that `vcf-input-mask` patches with a `queueMicrotask` + `isTrusted` + `activeElement` guard and that
`textfieldformatter-zen` lists as its first TODO.

**`Unparseable`** (`validate/Unparseable.js`). When the parser cannot produce a model value, the model
value becomes `new Unparseable(viewValue)`, which retains the raw text. The half-typed value is never
silently lost, validation can act on it, and a session can be restored. The formatter then syncs
`modelValue.viewValue` back rather than blanking the field.

**`formatOptions.mode: 'auto' | 'pasted' | 'user-edited'`** — meta info about _how_ the current value came
to be, computed right before each parser/formatter call and passed into both. `_isPasting` is set on
`paste` and cleared in a `setTimeout`. `parseAmount` uses it to reject unmatched characters when typed but
tolerate them when pasted. Compare with `_handlePaste` in `input-mask.js`: same problem, solved as a
declarative flag instead of an event interception.

**`viewValueStates: ['formatted']`** — tracks whether what is currently in the view is the formatter's own
output that actually reached the view. `getParseMode` (`localize/src/number/parseNumber.js`) uses it: when
the user edits a value _we_ formatted, stick to the locale we used instead of re-guessing from the
separators. The documented consequence: typing `400,0` in an English locale gives `4,000.00`, pasting it
gives `400.00`.

**Other details worth copying:** `_calculateValues({source})` computes all representations in one place
with a recursion lock and a `source` marker so the triggering representation is not recomputed;
`_callFormatter` skips formatting while the user is editing an invalid value (_"we only 'reward' valid
inputs"_); `compositionstart`/`compositionend` suspend preprocessing so IME input is not mangled
mid-composition — neither add-on handles composition at all.

**No mask grammar anywhere.** Lion covers our §2.1–§2.3 by composing small per-type parser/formatter pairs
on the shared mixin: `input-iban` is `friendlyFormatIBAN` / `isValidIBAN` from `ibantools`; `input-tel` is
awesome-phonenumber's `getAsYouType` inside a preprocessor; `input-amount` is `Intl`-based; `input-date` is
locale parse/format with `type = 'text'` set explicitly. Each is roughly thirty lines. `input-tel` also
models §2.6: `activeRegion` is derived through a documented five-step fallback (single allowed region →
derived from the value → preferred regions → `html[lang]` → undefined), and changing it reformats — but not
while focused.

**What Lion does not solve:** no visible/placeholder mask (§2.4), no per-character grammar, literal
skipping or overwrite mode (§2.5). Its own header comment also flags warts to avoid inheriting —
`formattedValue` is a public property that can be set to drive a computation loop, events are fired for
private concepts, and the recursion lock exists only because those observers are wired together.

### 3.5 SuperFields — formatting done from the Java side

`~/cf/super-fields`, branch `596-vaadin-25.3-preps`. Miki's add-on takes the opposite route to the two
Component Factory add-ons: formatting lives on the **server**, the client gets plain `TextField` plus a few
JS hooks.

**Number fields** — `superfields/numbers/AbstractSuperNumberField.java`

`AbstractSuperNumberField<T extends Number> extends CustomField<T>` wrapping a `SuperTextField`. The
model is typed (`Double`, `Integer`, `BigDecimal`…), the presentation is a `java.text.DecimalFormat`
string:

- `setPresentationValue(T)` → `format.format(number)` → `field.setValue(formatted)`; `generateModelValue()`
  → `parseRawValue(field.getValue(), format)`. Formatting happens **on blur** (`onFieldBlurred` →
  `setPresentationValue(getValue())`), never as you type.
- `setGroupingSeparatorHiddenOnFocus(boolean)` — on focus, grouping separators are stripped so the user
  edits `1234567,89`, on blur it comes back as `1 234 567,89`. A cheap and honest form of "format on
  commit" that needs zero client code.
- `buildRegularExpression(DecimalFormat)` and `buildAllowedCharPattern(...)` **derive** `pattern` and
  `allowedCharPattern` from the format, so the developer never specifies the same shape twice.
- `groupingAlternatives`, `decimalSeparatorAlternatives`, `negativeSignAlternatives` — lenient parsing;
  e.g. when the locale's grouping separator is a non-breaking space (untypeable), a normal space is
  accepted automatically.
- `updateTextInputMode()` sets `inputmode` to `numeric` or `decimal` depending on fraction digits.
- The Java composition has its own scar tissue: focus/blur forwarding, an `invalid` re-sync hack on
  every `setPresentationValue` (issue #241), a special case so `ValueChangeMode` works at all (#337), and a
  fix for values going out of sync when set from a global keybinding (#537). Wrapping a field from Java is
  as fragile as wrapping it from JS.

**Dates** — `superfields/dates/SuperDatePicker.java`, `DatePatternDelegate.java`, `shared/dates/DatePattern.java`,
`frontend/date-pattern-mixin.js`

A `DatePattern` bean (`Order {DAY_MONTH_YEAR, …}`, `MonthDisplayMode {ZERO_PREFIXED_NUMBER, NUMBER, NAME}`,
`separator`, `shortYear` + `baseCentury` + `centuryBoundaryYear`) is serialised to a compact descriptor
(`"-0d0M_y"`) and pushed with `callJsFunction("setDisplayPattern", …)`. The client mixin then **replaces
`i18n.parseDate` / `i18n.formatDate`** on the date picker and monkey-patches `$connector.setLocale` to
survive locale changes. This predates `DatePickerI18n#setDateFormats(primary, additional…)` +
`setReferenceDate(LocalDate)`, which now cover the same ground in core — the relevant lesson for §2.7 is
that the format string in `i18n.dateFormats[0]` (`dd.MM.yyyy`) already _is_ the mask template.

**Text** — `superfields/text/SuperTextField.java`, `frontend/super-text-field.js`, `text-selection-mixin.js`

- `setPreventingInvalidInput(boolean)` — client `input` listener that reverts to the last value matching
  `pattern`. This is what `allowedCharPattern` does per character, done per whole value.
- `TextSelectionDelegate` / `CanModifyText` — server-side `selectAll()`, `select(from, to)`,
  `modifyText(replacement, from, to)` (client `setRangeText` + synthetic `input`/`change`), and a
  `TextSelectionEvent` round-trip. Evidence that some apps want caret/selection control from Java.
- `TextInputMode` enum → `inputElement.inputMode` via `executeJs`. Core Flow `TextField` now has
  `setInputMode(InputMode)`, so this one is solved.
- Lifecycle is the weak spot: config goes through `runWhenAttached` + `beforeClientResponse` +
  `callJsFunction`, and a `@ClientCallable(DisabledUpdateMode.ALWAYS) performDelayedInitialisation()` hack
  exists for re-attach inside Grid (#243, #513, #531). Element **properties** would have survived
  detach/re-attach for free.

### 3.6 Flow side — what already exists, and what constrains the design

Read from `~/vaadin/flow` and `~/vaadin/flow-components`.

**1. Flow can ship data, not functions.** Lion's `preprocessor` / `formatter` / `parser` are JS
functions. Flow's channel to the client is element properties (JSON) and `executeJs`. That is _why_
vcf-input-mask grew an `evalMask` flag and an `eval()` in `_generateIMaskOptions`. Consequence: any
as-you-type behaviour must be **fully declarative** on the client — blocks, delimiter, case, a mask string,
or a named preset. Custom Java logic can only run at commit time, after a round trip.

**2. The presentation/model split already exists in Flow.**
`AbstractSinglePropertyField(propertyName, default, Class<P>, presentationToModel, modelToPresentation)`
(`flow-server/.../AbstractSinglePropertyField.java`) plus a `hasValidValue()` hook. `TextFieldBase`
exposes constructors with these converters, and two core fields use them today:
`DatePicker` — `super("value", null, String.class, PARSER, FORMATTER)` (`String` ↔ `LocalDate`), and
`AbstractNumberField` — `super(null, null, String.class, parser, formatter, true)`. Formatting on commit
for a typed field is just `modelToPresentation`.

**3. `_inputElementValue` + `unparsable-change` is the established WC↔Flow contract for "what the user
typed" vs "the value".** DatePicker: `@Synchronize(property = "_inputElementValue", value = {"change",
"unparsable-change"})`, a server-side `unparsableValue`, and `isInputUnparsable()` feeding the default
validator with `badInputErrorMessage` from i18n. `AbstractNumberField.setValueChangeMode` additionally
does `synchronizeProperty("_inputElementValue")` on `input` so EAGER modes keep the raw string current.
The web components already implement it (`packages/date-picker/src/vaadin-date-picker-mixin.js:428`,
`packages/number-field/src/vaadin-number-field-mixin.js:521`). This is Flow's twin of Lion's
`Unparseable`, and the natural shape for a masked `TextField`: `value` = model, `_inputElementValue` =
presentation, `unparsable-change` when the input changed but the model did not (incomplete mask).

**4. A server-side parse hook already exists — on DatePicker.**
`DatePicker#setFallbackParser(SerializableFunction<String, Result<LocalDate>>)`. It runs inside
`setModelValue` (guarded by `isFallbackParserRunning`), and on success calls `setPresentationValue(parsed)`
so the field _displays the normalised value_; on `Result.error(msg)` the message becomes the validation
error. This is exactly "some sort of API for using custom parsing logic" — for dates. The same shape on
`TextField` — `SerializableFunction<String, Result<String>>` applied at commit — covers §2.2 and §2.3
(`5.1.2027` → `05.01.2027`, `0401234567` → `+358401234567`) with no client code. Limitation: commit only,
never as you type.

**5. Value-change modes need no Flow change if the WC gets it right.**
`TextFieldBase.setValueChangeMode` → `setSynchronizedEvent(ValueChangeMode.eventForMode(mode, "input"))`,
i.e. Flow reads the `value` property when the `input` DOM event reaches the host. The WC's `_onInput`
(`input-mixin.js:174`) does `this.value = target.value` synchronously in the input element's listener,
which fires _before_ host-level listeners. Add-ons break because their listener runs after `_onInput`, so
Flow reads the pre-format value. A mixin that formats **inside** `_onInput` has already written the model
value by the time Flow's listener runs — EAGER / LAZY / TIMEOUT work with zero Flow changes.

**6. `pattern`, `minlength`, `maxlength` will straddle the split.** Flow re-validates them server-side
against `getValue()` — `TextFieldValidationSupport` exists "because it is possible to circumvent the client
side validation constraints using browser development tools" — so on the server they apply to the
**model**. The WC delegates them as attributes to the native input (`vaadin-text-field-mixin.js:53`
`delegateAttrs`), so on the client they apply to the **presentation**. With chunking, `maxlength="18"`
would block the spaced IBAN at 18 characters including spaces. Decision: constraints target the model
value; when a format is active the WC must stop delegating `maxlength`/`pattern` to the native input (or
translate them). `allowedCharPattern` acts per keystroke and needs to allow — or auto-skip — typed
delimiters.

**7. Config transport: properties, not JS calls.** `HasAllowedCharPattern` is the pattern to copy — a
default-method interface in `com.vaadin.flow.component.shared` backed by one element property,
implemented by `TextField`, `DatePicker`, and friends. Properties survive detach/re-attach (Grid editors,
dialogs), need no `runWhenAttached`, and are what the SuperFields hacks in §3.5 were compensating for.
25.x additionally expects signal overloads — `AbstractField#bindValue(Signal)`,
`SignalPropertySupport` for `min`/`max` in `AbstractNumberField` — so new properties come with `bindXxx`.

**8. Serialization.** Flow components live in the HTTP session and may be replicated. `InputMaskOption` and
`DatePattern` both `implements Serializable`; hooks are `SerializableFunction`. Config beans must be
serializable, and `AbstractSinglePropertyField` carries a "do not convert to lambda, see #5973" comment for
a reason.

**9. Binder.** `TextField` is `HasValue<?, String>`; typed conversion is Binder's job via
`Converter<P, M>#convertToModel(P, ValueContext) → Result<M>`. If the WC `value` is already normalised
(`FI2112345600000785`), existing converters keep working and Binder validators see clean data. Keep
`TextField` a `String` field; typed models stay with `DatePicker`-style subclasses or Binder converters.
For "validity changed without a value change" (an incomplete mask), the mechanism is
`HasValidator#addValidationStatusChangeListener` + `ValidationStatusChangeEvent`, as DatePicker and
NumberField use for unparsable input.

**10. i18n messages.** `TextFieldI18n` has `patternErrorMessage`, `minLengthErrorMessage`,
`maxLengthErrorMessage`, `requiredErrorMessage`; `AbstractNumberFieldI18n` and `DatePickerI18n` add
`badInputErrorMessage`. A mask layer adds a `badInputErrorMessage` (incomplete / rejected input) to
`TextFieldI18n` — additive.

**Two-tier shape this implies for Flow.**

| Tier   | Runs                                | Configured by                                                                                                                                   | Covers           |
| ------ | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Live   | client, on every `input`            | declarative WC properties set from Java (`blocks`, `delimiter`, `mask`…)                                                                        | §2.1, §2.4–2.6   |
| Commit | server, on `change` / value-changed | `SerializableFunction<String, Result<String>>` in `setModelValue`, DatePicker `setFallbackParser` shape; `modelToPresentation` for typed fields | §2.2, §2.3, §2.7 |

---

## 4. What this suggests for a built-in API

A sketch, not a decision — offered so the open questions below have something concrete to attack.

A shared `field-base` mixin with three opt-in layers and an explicit two-value contract:

1. **Chunking formatter** — declarative blocks + delimiters + case/prefix. Covers §2.1 and the "easily
   doable" subset. Needs value-dependent blocks for cards.
2. **Pattern mask** — per-character grammar with alternatives, for §2.5 and §2.6. Rules out a
   cleave-shaped engine.
3. **Visible placeholder mask** — §2.4, aimed first at date-picker / time-picker.

The value contract is the load-bearing decision: the mixin owns the input's DOM value (presentation) and
exposes the model value separately, rather than mutating `value` in place. The cleave-based add-on's
`(this.parentElement as any).value = formattedValue` is the direct cause of the "formatted characters end
up in the value" complaint, and of its own `TODO.md`'s first bullet.

Editing behaviour must be modelled as **intents** — Backspace/Delete over a separator, mid-string
insertion, overwrite — not as reformat-the-whole-string-then-restore-the-caret, which is the documented
failure mode of the string-replacement design.

Where Lion's pieces would land in our `field-base`: `_inputElementValue` (setter in `input-mixin.js:98`) is
the seam for a caret-preserving write; `_onInput` (`:174`) is where a `preprocessor` would run; `_onChange`
(`:191`) is where a commit-time `formatter` would run; `_valueChanged` (`:209`) is where a `formatter` for
programmatic changes would run, gated by a `_reflectBackOn()`-style predicate. `_forwardInputValue`
(`:144`) already exists for the downward sync.

Integration points the outside-in wrappers had to fake, and that a mixin gets natively: value-change modes
(EAGER / TIMEOUT), paste, programmatic `setValue` from the server, runtime mask change, clear, and the
interplay with existing validation. Rolf: TextField _"already has allowed-chars (that prevents entering
disallowed chars) and pattern validation (that validates the full value on commit)"_ — the mask must
compose with those, not duplicate or fight them.

---

## 5. Open questions

1. **Accessibility.** No sourced position. The research pass found nothing on GOV.UK / screen-reader
   behaviour with auto-inserted separators and caret jumps that survived verification. This is genuinely
   open, and it could veto layers 2 and 3 — it should be settled before, not after, a prototype.
2. **Default value direction.** Does the field expose the normalized value or the formatted string?
   vcf-input-mask makes the caller bind a _separate object_ to get the unmasked value, and only for
   TextField. A core API has to decide once, for Binder, validation, `pattern`, Grid and serialization —
   and say what a mask change does to an already-set value.
3. **Mask grammar.** Invent one, adopt IMask's, or align with Swing's `MaskFormatter` for the
   legacy-migration audience Johannes describes? How are embedded literals (the `08000` case) and computed
   positions (SSN checksum) expressed, and do literals belong to the model value?
4. **Date/time composition.** Does the visible mask compose with the existing i18n `dateFormat` and parser,
   or replace it — and can the mask be derived from the configured format so apps don't specify it twice?
5. **email-field.** Does it get masking at all, given `type="email"`? Change `_setType` the way
   `number-field` is being changed, or have the mixin refuse non-text inputs?
6. **Constraints under a format.** `pattern` / `minlength` / `maxlength` validate the model on the server
   but the presentation on the client (§3.6 #6). Stop delegating them to the native input when a format is
   active, translate them, or document that they apply to the formatted string?
7. **Live vs commit.** Which use cases are worth client-side declarative support, and which are fine as a
   server-side commit hook (`setFallbackParser` shape, §3.6 #4)? The second is cheap and needs no WC work.
8. **Undo across live formatting.** Every reformat that changes the presented text is a script write to
   `input.value`, and browsers clear the native undo stack on such writes — so Ctrl/Cmd+Z is inert in a
   live-formatted field after any block boundary (or any keystroke under a `case` transform). The PoC
   accepts this, as IMask and cleave do. Preserving undo would mean routing every presentation write through
   `document.execCommand('insertText')` (deprecated, no standard replacement) and doubling undo granularity
   at block boundaries. Decide in the RFC whether the cost is worth paying; the PoC measured that
   `execCommand` works in Chromium, Firefox and WebKit, so the option is real.

---

## Sources and confidence

Local code (both add-ons, read in full) and the source notes are primary. Library behaviour is cited from
official docs and source, several claims re-verified against the live cleave.js demo.

Deliberately **not** asserted here, because it did not survive adversarial verification: the exact IMask
pattern-definition token set (`0` / `a` / `*` / `[]` / `{}`), and the framing of IMask `blocks` as _the_
mechanism for grouping — grouping is done with literal characters in a flat mask, and `blocks` is for
per-block validation (`MaskedRange`, `MaskedEnum`). Verify the definitions table against imask.js.org
before it goes into a spec.

Also unverified: the platform#9364, web-components#1267 / #1271 and flow-components#1144 comment threads
were not read directly — use-case attribution and priority come from the Slack quotes in the notes and
should be re-checked against the issues. SuperFields (§3.5) and the Flow / flow-components sources (§3.6)
were read locally after the research pass; they are not covered by the adversarial verification.
