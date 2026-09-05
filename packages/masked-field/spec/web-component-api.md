# Masked Field Developer API

> This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.maskedFieldComponent = true`

```js
window.Vaadin.featureFlags.maskedFieldComponent = true;

import '@vaadin/masked-field';
```

## 1. Grouping as the user types

Covers requirement(s): 1, 4, 6, 8

```html
<vaadin-masked-field label="IBAN" format-blocks="[4, 4, 4, 4, 2]"></vaadin-masked-field>

<vaadin-masked-field label="Phone" format-blocks="[3, 3, 4]" format-delimiter="-"></vaadin-masked-field>
```

```js
field.formatBlocks = [4, 4, 4, 4, 2];
field.formatDelimiter = ' '; // default
```

**Why this shape:** Grouping needs two facts, the group lengths and the delimiter, so they are two
flat properties rather than one options object. Every other text-field constraint is flat
(`pattern`, `maxlength`, `allowed-char-pattern`), frameworks bind properties one at a time, and the
`format` prefix groups the family in autocomplete next to `formattedValue`. The delimiter defaults to
a space so the common IBAN and phone cases need one attribute.

---

## 2. Plain value and presented text

Covers requirement(s): 2, 11

```js
field.value; // 'FI2112345600000785' — what Binder, validation and the server see
field.formattedValue; // 'FI21 1234 5600 0007 85' — read-only, empty when no format is set
field.inputElement.value; // the same presented text, owned by the field
```

**Why this shape:** `value` keeps its meaning for every existing consumer. The presented text is
exposed as a separate read-only property so nothing has to parse the input element, and so a later
Flow accessor has one property to synchronise. `pattern`, `minlength` and `maxlength` validate
`value`, so they are written for the plain value.

---

## 3. Fixed shapes

Covers requirement(s): 3, 4, 5, 7, 8, 18

```html
<vaadin-masked-field label="Phone" format-mask="+7 (000) 000-00-00"></vaadin-masked-field>

<vaadin-masked-field label="Time" format-mask="00:00"></vaadin-masked-field>

<vaadin-masked-field label="ZIP" format-mask="00000[-0000]"></vaadin-masked-field>
```

Mask tokens: `0` any digit, `a` any letter, `*` any character, `[…]` an optional section, `\x` the
literal `x`, every other character a literal.

An optional section is shown once the user types into it: `00000[-0000]` presents `12345` at five
digits and `12345-6` at six. Sections are only allowed in the trailing run of the mask, and are
enabled left to right, so a mask with `n` of them has `n + 1` lengths rather than `2 ** n` shapes.

An invalid mask is reported with one warning and treated as unset, so the field behaves as if
nothing were configured. Optional sections add six conditions to the ones the rest of the grammar
already has, and the first condition that matches is the one reported:

- an optional section that is never closed, or one nested inside another, as in `0[0[0]]`;
- a `]` with no `[` open before it, as in `0]` — write `\]` for a literal `]`;
- an optional section that is not part of the trailing run of sections, as in `[000]-00`;
- an optional section with no slot in it, as in `0[-]`;
- a mask whose shortest expansion has no slot in it, as in `[000]`, which would accept nothing
  before the user types;
- more than four optional sections, which is a readability cap rather than an engine limit.

```js
field.formatMask = '00[-00][-00]'; // three lengths: 00, 00-00, 00-00-00
field.formatMask = '00[-00]-00'; // one warning; the mask is ignored
```

The field derives `inputmode="numeric"` for a mask whose every slot is a digit, so a numeric keypad
opens on a phone without the application asking for it twice. It is derived only while the
application leaves `inputMode` unset; an empty string counts as set by the application and keeps
removing the attribute. The derivation reads the longest expansion of the mask, so it does not
change while the user types into an optional section, and a format configured with `formatBlocks`
derives nothing, since the blocks grow with the value and have no longest expansion.

**Why this shape:** One string, in the token set of IMask, which is what the existing add-on users
and the migration examples already use. A string is settable as an attribute, trivially serialised
from Java, and stable across renders in React. `[…]` is the optional syntax that IMask and
Inputmask share. Alternatives and custom token definitions are not part of the grammar yet.

---

## 4. Legacy codes with embedded constants

Covers requirement(s): 3

```html
<vaadin-masked-field label="Code" format-mask="*\08\0\0\0-00-**-000000-0"></vaadin-masked-field>
```

Typing `C10476001374` shows `C08000-10-47-600137-4`; `value` is `C10476001374`.

**Why this shape:** Escaped digits are literals, so a constant run such as `08000` needs no special
syntax and the same mask string a Swing `MaskFormatter` user would write, token by token, works
unchanged.

---

## 5. Letter case

Covers requirement(s): 10

```html
<vaadin-masked-field label="IBAN" format-blocks="[4, 4, 4, 4, 2]" format-text-case="upper"></vaadin-masked-field>
```

Values: `upper`, `lower`. Applies to grouped and fixed shapes alike.

**Why this shape:** Case is a property of the value, not of one kind of shape, so it is its own
property shared by both. The name avoids the reserved word `case`.

---

## 6. Changing or removing the format at runtime

Covers requirement(s): 9

```js
field.formatBlocks = [2, 4, 4]; // value re-presented, caret kept
field.formatBlocks = null; // shows the plain value; formattedValue becomes ''
field.formatMask = ''; // same for a fixed shape
```

**Why this shape:** Assigning a property is the whole API. The field re-presents the current value
under the new shape and keeps the caret next to the same character.

---

## 7. Precedence and invalid configuration

Covers requirement(s): 3, 9, 15

```js
field.formatBlocks = [4, 4];
field.formatMask = '00:00'; // one warning; the mask is used
field.formatDelimiter = '--'; // one warning; the default delimiter is used, groups still apply
```

**Why this shape:** A fixed shape and groups cannot both apply, so the mask wins and a single
development-time warning names both properties. An invalid delimiter or case falls back to its
default rather than disabling grouping, because each property is set independently. Invalid group
lengths disable the format, since there is nothing to group by.

---

## 8. Programmatic values that do not fit

Covers requirement(s): 12

```js
field.formatMask = '+7 (000) 000-00-00';
field.value = '90020111223344';
field.formattedValue; // '+7 (900) 201-11-22'
field.value; // '90020111223344' — kept; one warning logged
```

The warning is for a value the format could not lay out in full. A value the format only normalises,
such as `'٣٤٥٦'` on a `0000` mask presented as `3456`, is laid out in full and kept as assigned, with
no warning.

**Why this shape:** Overwriting an application-supplied value silently would hide a data problem,
and a second value change on assignment would surprise Binder. The field shows what fits and warns.

---

## 9. Relationship to Text Field

Covers requirement(s): 13, 14, 15

```html
<vaadin-masked-field
  label="IBAN"
  helper-text="Your account number"
  required
  allowed-char-pattern="[0-9A-Za-z]"
  format-blocks="[4, 4, 4, 4, 2]"
  format-text-case="upper"
></vaadin-masked-field>
```

`<vaadin-masked-field>` extends `<vaadin-text-field>` and inherits its whole API: `label`, helper,
validation and its constraints, `allowedCharPattern`, `pattern`, prefix and suffix slots, theme
variants. On top of that it adds `formatBlocks`, `formatDelimiter`, `formatTextCase`, `formatMask`,
`formatCompletionRequired`, `formatPrompt` and the read-only `formattedValue`. The mixins that carry
them live in the `@vaadin/masked-field` package.

**Why this shape:** A developer who knows text field only has to learn the `format*` family, and
everything text field already does keeps working on the same element. Text field and the components
built on it — email field, password field, the grid-pro editor — carry none of the format behaviour,
and the feature flag keeps the new element opt-in while it is experimental.

---

## 10. Requiring a complete shape

Covers requirement(s): 19

```html
<vaadin-masked-field
  label="Time"
  format-mask="00:00"
  format-completion-required
  error-message="Enter a time as hh:mm"
></vaadin-masked-field>
```

```js
field.formatMask = '00:00';
field.formatCompletionRequired = true;

field.value = '123';
field.checkValidity(); // false — the mask is not filled
field.value = '1234';
field.checkValidity(); // true
field.value = '';
field.checkValidity(); // true — an empty value is left to `required`
```

`checkValidity()` reports `false` for a value that does not fill the mask, alongside the other
constraints, and the field validates it on commit, so an incomplete value is reported when the user
leaves the field. An empty value is left to `required`. A `readonly` or `disabled` field is always
valid, as it is for every other constraint. With `formatBlocks` the property does nothing, since the
blocks have no length to fill. A value the mask only normalises, such as `'٣٤٥٦'` on `0000`, fills
the mask and stays valid.

**Why this shape:** One boolean named after the state it turns on, opt-in so that no existing field
changes validity, and checked at the moment the other constraints are. Deriving a `pattern` from the
mask would collide with an application-set `pattern` and produce an expression no error message
could explain.

---

## 11. Showing the shape while typing

Covers requirement(s): 22

```html
<vaadin-masked-field label="Phone" format-mask="+1 (000) 000-0000" format-prompt="_"></vaadin-masked-field>
```

The empty field reads `+1 (___) ___-____`; after `900` it reads `+1 (900) ___-____`; once the mask
is full nothing is drawn. `formatPrompt` is one character; any other value is reported with a
warning and treated as unset.

The shape is drawn by a `prompt` shadow part sitting over the input element, so `value`,
`formattedValue` and the text of the input element are all unaffected by it. The part is
`aria-hidden`, and the element sets a `has-format-prompt` state attribute while there is something
to draw:

```css
vaadin-masked-field::part(prompt) {
  color: lightgray;
}

vaadin-masked-field[has-format-prompt]::part(input-field) {
  border-color: lightgray;
}
```

The colour comes from `--vaadin-input-field-placeholder-color`, so the shape reads as a placeholder
by default. A `placeholder` takes precedence: while the native placeholder is showing, the shape is
hidden, and it appears on the first character the user types. With optional sections the shape
follows the expansion the value resolves to, so `00000[-0000]` shows five positions while empty,
nothing at five digits, and the rest of the section at six. With `formatBlocks` nothing is drawn,
since the blocks grow with the value and have no shape to show.

**Why this shape:** A part beside the input rather than characters inside it, so the value, the
caret and the deletions stay exactly what they are without the prompt. One character rather than a
whole template, so the shape comes from the mask that already describes it. Opt-in, because a field
that shows its shape while empty is a different visual design from one that shows a label only.

---

## Discussion

**Q: One `format` object or flat properties?**

Flat. Every other text-field constraint is flat, Flow binds signals per property, Hilla exposes
props one to one, and an object whose keys are mutually exclusive makes an awkward Java bean.

**Q: Should the properties carry the `format` prefix?**

Yes. `blocks` and `delimiter` are too generic on a field, the prefix groups the family in
autocomplete next to `formattedValue`, and combo-box's `item*` family is the precedent.

**Q: `case` or `textCase`?**

`textCase`. `case` is a reserved word in JavaScript and Java and awkward to destructure.

**Q: `mask` or `formatMask`?**

`formatMask`, so the whole family reads `format*` and the mask is understood as one way to define
the format, with `formatTextCase` applying to it too.

**Q: Which mask grammar?**

The IMask token subset `0`, `a`, `*`, `\`. It is what the existing add-on users have. Swing
`MaskFormatter` tokens are a documented translation, not a second grammar. `[]`, `{}` and custom
definitions are deferred.

**Q: Two engines or one?**

One. Grouping is a dynamic shape generated from the group lengths and the current value length, and
the same engine that handles fixed shapes handles it. Measured against the grouping test suite, one
engine reproduces every row but one caret index.

**Q: Why `formattedValue` and not a settable formatted property?**

Setting the decorated form would make two properties writable for one value. `value` is the only
write channel; `formattedValue` is derived.

**Q: Why is the API on a new element instead of `<vaadin-text-field>`?**

Text field and everything built on it stay untouched while the behaviour is proven, and the feature
flag keeps the new element opt-in. The element name also says what the field does, which an
attribute on a plain text field would not. A later move of the properties into text field would keep
the same names.

**Q: Does an incomplete value get its own error message?**

No. The field shows the `errorMessage` the application set, the same one a `required` failure shows.
Text field has no per-constraint message family, and inventing one for this constraint alone, ahead
of the API review that has to settle it for the whole `format*` family, would be the wrong place to
start.

**Q: Why is the shape a shadow part rather than characters in `value`?**

Because everything else stays untouched that way. Prompt characters inside the input element are
what force overwrite typing, a special deletion rule, and a value that has to be stripped before it
is read. A part drawn over the input costs one node and leaves `value`, `formattedValue`, the caret
model and the deletions exactly as they are without it. The cost is that the shape is decoration:
it is `aria-hidden`, so a screen reader is told nothing about it.

**Q: Why is `formatPrompt` one character rather than a template, and why is it opt-in?**

The mask already describes the shape, so the only thing left to choose is what an unfilled slot
looks like, and every library that offers this offers exactly that one choice. Opt-in because a
field drawn as `+1 (___) ___-____` while empty is a different visual design from a plain empty
field, and because the two ways to fill an empty field, a `placeholder` and a shape, would otherwise
collide by default rather than by the application's choice.
