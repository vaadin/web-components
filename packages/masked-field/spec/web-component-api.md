# Masked Field Developer API

## 1. Grouping as the user types

Covers requirement(s): 1, 4, 6, 8

The component is experimental. Enable the feature flag before importing it:

```js
window.Vaadin.featureFlags.maskedFieldComponent = true;

import '@vaadin/masked-field';
```

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

Covers requirement(s): 3, 4, 5, 7, 8

```html
<vaadin-masked-field label="Phone" format-mask="+7 (000) 000-00-00"></vaadin-masked-field>

<vaadin-masked-field label="Time" format-mask="00:00"></vaadin-masked-field>
```

Mask tokens: `0` any digit, `a` any letter, `*` any character, `\x` the literal `x`, every other
character a literal.

**Why this shape:** One string, in the token set of IMask, which is what the existing add-on users
and the migration examples already use. A string is settable as an attribute, trivially serialised
from Java, and stable across renders in React. Optional sections, alternatives and custom token
definitions are not part of the grammar yet.

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
variants. On top of that it adds `formatBlocks`, `formatDelimiter`, `formatTextCase`, `formatMask`
and the read-only `formattedValue`. The mixins that carry them live in the `@vaadin/masked-field`
package.

**Why this shape:** A developer who knows text field only has to learn the `format*` family, and
everything text field already does keeps working on the same element. Text field and the components
built on it — email field, password field, the grid-pro editor — carry none of the format behaviour,
and the feature flag keeps the new element opt-in while it is experimental.

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
