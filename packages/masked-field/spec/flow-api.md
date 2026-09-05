# Masked Field Flow Developer API

<!--
Flow (Java) developer-facing API derived from requirements.md (universal + flow) and web-component-api.md. Shows the most idiomatic, minimal Java API a Flow developer would use.

NOT a specification — no connector files, no @Synchronize wiring, no method bodies, no serialisation analysis.

The Flow API ALWAYS wraps the web component. Every attribute/property in web-component-api.md is reachable from Java — see the Web API coverage check at the end.
-->

## 1. Grouping as the user types

Covers requirement(s): 1, 16

```java
MaskedField iban = new MaskedField("IBAN");
iban.setFormatBlocks(4, 4, 4, 4, 2);
iban.setFormatTextCase(TextCase.UPPER);

MaskedField phone = new MaskedField("Phone");
phone.setFormatBlocks(3, 3, 4);
phone.setFormatDelimiter("-");
```

**Why this shape:**

- One setter per web component property, as `setAllowedCharPattern`, `setPattern` and
  `setMaxLength` already are. No configuration bean whose fields exclude each other.
- The setters live on a shared default-method interface, `HasInputFormat`, in
  `vaadin-flow-components-base`, following `HasAllowedCharPattern`. `MaskedField` implements it;
  `TextField`, `TextArea` and other adopters implement it later, with no new code, if the capability
  is integrated into them.
- `int...` for the groups mirrors the JSON array on the client and reads naturally at the call site.
- `TextCase` is an enum with `UPPER` and `LOWER`; `null` clears it.

---

## 2. Fixed shapes

Covers requirement(s): 3, 16, 18

```java
MaskedField phone = new MaskedField("Phone");
phone.setFormatMask("+7 (000) 000-00-00");

MaskedField code = new MaskedField("Code");
code.setFormatMask("*\\08\\0\\0\\0-00-**-000000-0");

MaskedField zip = new MaskedField("ZIP");
zip.setFormatMask("00000[-0000]"); // the four extra digits are optional
```

**Why this shape:** The mask string is passed through unchanged, so a mask written for the web
component, or for the vcf-input-mask add-on, works as is, including its optional sections.
`setFormatMask("")` or `null` removes it.

---

## 3. Plain value for Binder, presented text on request

Covers requirement(s): 2, 17

```java
binder.forField(iban).bind(Account::getIban, Account::setIban); // receives "FI2112345600000785"

String shown = iban.getFormattedValue(); // "FI21 1234 5600 0007 85"
```

**Why this shape:** `getValue()`, `setValue()` and every existing converter keep their meaning; the
format is presentation only. `getFormattedValue()` is a read-only accessor synchronised from the
client, for applications that store the decorated form or show it elsewhere.

---

## 4. Changing the format at runtime

Covers requirement(s): 9, 16

```java
countrySelect.addValueChangeListener(e -> phone.setFormatMask(masks.get(e.getValue())));
```

**Why this shape:** A property write is the whole API; the client re-presents the current value and
keeps the caret. Nothing on the server has to re-read or re-set the value.

---

## 5. Binding the format to signals

Covers requirement(s): 16

```java
Signal<String> mask = ...;
phone.bindFormatMask(mask);

Signal<int[]> blocks = ...;
iban.bindFormatBlocks(blocks);
```

**Why this shape:** Each format property is one element property, so it binds with the same
mechanism `NumberField#bindMin` uses. A single configuration object would only bind as a whole.

---

## 6. Precedence and invalid configuration

Covers requirement(s): 3, 9

```java
field.setFormatBlocks(4, 4);
field.setFormatMask("00:00"); // the mask is used; the client logs one warning
```

**Why this shape:** The server does not duplicate the client's validation. The setters write the
properties; the web component decides precedence and reports invalid configuration in the browser
console, where the developer sees the component's own message.

---

## 7. Requiring a complete shape, and showing it while typing

Covers requirement(s): 19, 22, 16

```java
MaskedField time = new MaskedField("Time");
time.setFormatMask("00:00");
time.setFormatCompletionRequired(true);
time.setErrorMessage("Enter a time as hh:mm");
time.setFormatPrompt('_'); // the field reads __:__ while empty
```

**Why this shape:** Two more properties of the same family, so two more setters on
`HasInputFormat`, both with `bindFormatCompletionRequired(Signal)` and `bindFormatPrompt(Signal)`
overloads like the rest. Completeness is validated by the web component and reported through the
existing invalid state, so a Binder sees it the way it sees `setRequired`, and the error message is
the field's own `setErrorMessage`. `setFormatPrompt` takes a `char` and a `String` overload, since
the client accepts one character and `null` or `""` clears it.

---

## Web API coverage check

| Web API surface (from web-component-api.md)               | Flow API                                                                | Notes                                                                                                                   |
| --------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `<vaadin-masked-field>` element                           | `new MaskedField()`                                                     | constructor; extends `TextField`, so `HasSize`, `HasStyle`, validation and `HasAllowedCharPattern` come from it         |
| `maskedFieldComponent` feature flag                       | —                                                                       | enabled by the application through `FeatureFlags` or `vaadin-featureflags.properties`, as other experimental components |
| `format-blocks` attribute / `formatBlocks` property       | `HasInputFormat#setFormatBlocks(int...)`, `getFormatBlocks()`           | JSON array property; empty or `null` clears                                                                             |
| `format-delimiter` / `formatDelimiter`                    | `setFormatDelimiter(String)`, `getFormatDelimiter()`                    | one character; `null` restores the default                                                                              |
| `format-text-case` / `formatTextCase`                     | `setFormatTextCase(TextCase)`, `getFormatTextCase()`                    | enum `UPPER`, `LOWER`; `null` clears                                                                                    |
| `format-mask` / `formatMask`                              | `setFormatMask(String)`, `getFormatMask()`                              | passed through unchanged                                                                                                |
| `format-completion-required` / `formatCompletionRequired` | `setFormatCompletionRequired(boolean)`, `isFormatCompletionRequired()`  | client-side constraint; the field goes invalid on commit, no new event                                                  |
| `format-prompt` / `formatPrompt`                          | `setFormatPrompt(char)`, `setFormatPrompt(String)`, `getFormatPrompt()` | one character; `null` or `""` clears it                                                                                 |
| derived `inputmode` for an all-digit mask                 | — (client-side)                                                         | inherited from `TextField#setInputMode`, which the client only fills in while the application leaves it unset           |
| `formattedValue` read-only property                       | `getFormattedValue()`                                                   | synchronised from the client on `formatted-value-changed`                                                               |
| `value`                                                   | `getValue()` / `setValue()` unchanged                                   | plain value, Binder unchanged                                                                                           |
| runtime change of any `format*` property                  | the same setters                                                        | client re-presents the value                                                                                            |
| `format*` mixins in `@vaadin/masked-field`                | `HasInputFormat` default-method interface                               | implemented by `MaskedField`; `TextField` later if integrated                                                           |
| precedence and invalid-configuration warnings             | — (client-side)                                                         | no server API needed                                                                                                    |
| `change` after a field-applied edit                       | `addValueChangeListener` with `ValueChangeMode.ON_BLUR` / `LAZY`        | works because the web component fires `change`                                                                          |

## Discussion

**Q: One `setFormat(bean)` or flat setters?**

Flat setters. The bean would carry mutually exclusive fields, bind only as a whole, and repeat the
mistake that led vcf-input-mask to untyped `InputMaskOption(key, value)` pairs.

**Q: Should Flow enforce that groups and mask are not both set?**

No. The setters stay dumb like `setAllowedCharPattern`; the web component owns the rule and the
warning, so the two APIs never disagree.

**Q: Where do the setters live?**

On a `HasInputFormat` interface in `vaadin-flow-components-base`, so `MaskedField` and later
adopters share one definition, including `getFormattedValue()` with its synchronisation annotation.

**Q: Is a server-side parse hook part of this API?**

Not here. Normalising or parsing on commit follows the shape of `DatePicker#setFallbackParser`
and is independent of the presentation format; it is recorded as a separate follow-up.

**Q: Why a `MaskedField` class rather than setters on `TextField`?**

The Flow API mirrors the web component, which is a separate experimental element, so `TextField` and
everything built on it keep their current API while the behaviour is proven. `MaskedField extends
TextField`, so a view that needs the shape changes the class and keeps the rest of its code.
`HasInputFormat` is ready for `TextField` to implement if the capability is integrated later.

**Q: Does an incomplete value need an `unparsable-change` event, as `NumberField` has?**

No. `NumberField` needs one because a native `type="number"` input cannot report the text the user
typed, so the server would otherwise never learn about it. A masked field is a text input and always
reports what was typed, so `change` fires as usual and the server only needs
`setFormatCompletionRequired(boolean)`.

**Q: Is the shape shown while typing a server-side feature?**

No. `setFormatPrompt` writes one property and the client draws the shape from the mask it already
has. There is no event for it, nothing to synchronise back, and the shape is not part of the value,
so a Binder never sees it.
