# Format Base Flow Developer API

<!--
Flow (Java) developer-facing API derived from requirements.md (universal + flow) and web-component-api.md. Shows the most idiomatic, minimal Java API a Flow developer would use.

NOT a specification — no connector files, no @Synchronize wiring, no method bodies, no serialisation analysis.

The Flow API ALWAYS wraps the web component. Every attribute/property in web-component-api.md is reachable from Java — see the Web API coverage check at the end.
-->

## 1. Grouping as the user types

Covers requirement(s): 1, 16

```java
TextField iban = new TextField("IBAN");
iban.setFormatBlocks(4, 4, 4, 4, 2);
iban.setFormatTextCase(TextCase.UPPER);

TextField phone = new TextField("Phone");
phone.setFormatBlocks(3, 3, 4);
phone.setFormatDelimiter("-");
```

**Why this shape:**

- One setter per web component property, as `setAllowedCharPattern`, `setPattern` and
  `setMaxLength` already are. No configuration bean whose fields exclude each other.
- The setters live on a shared default-method interface, `HasInputFormat`, in
  `vaadin-flow-components-base`, following `HasAllowedCharPattern`. `TextField` implements it;
  `TextArea` and other adopters implement it later with no new code.
- `int...` for the groups mirrors the JSON array on the client and reads naturally at the call site.
- `TextCase` is an enum with `UPPER` and `LOWER`; `null` clears it.

---

## 2. Fixed shapes

Covers requirement(s): 3, 16

```java
TextField phone = new TextField("Phone");
phone.setFormatMask("+7 (000) 000-00-00");

TextField code = new TextField("Code");
code.setFormatMask("*\\08\\0\\0\\0-00-**-000000-0");
```

**Why this shape:** The mask string is passed through unchanged, so a mask written for the web
component, or for the vcf-input-mask add-on, works as is. `setFormatMask("")` or `null` removes it.

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

## Web API coverage check

| Web API surface (from web-component-api.md)         | Flow API                                                         | Notes                                                     |
| --------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| `format-blocks` attribute / `formatBlocks` property | `HasInputFormat#setFormatBlocks(int...)`, `getFormatBlocks()`    | JSON array property; empty or `null` clears               |
| `format-delimiter` / `formatDelimiter`              | `setFormatDelimiter(String)`, `getFormatDelimiter()`             | one character; `null` restores the default                |
| `format-text-case` / `formatTextCase`               | `setFormatTextCase(TextCase)`, `getFormatTextCase()`             | enum `UPPER`, `LOWER`; `null` clears                      |
| `format-mask` / `formatMask`                        | `setFormatMask(String)`, `getFormatMask()`                       | passed through unchanged                                  |
| `formattedValue` read-only property                 | `getFormattedValue()`                                            | synchronised from the client on `formatted-value-changed` |
| `value`                                             | `getValue()` / `setValue()` unchanged                            | plain value, Binder unchanged                             |
| runtime change of any `format*` property            | the same setters                                                 | client re-presents the value                              |
| `InputFormatMixin` for component authors            | `HasInputFormat` default-method interface                        | implemented by `TextField`; other adopters later          |
| precedence and invalid-configuration warnings       | — (client-side)                                                  | no server API needed                                      |
| `change` after a field-applied edit                 | `addValueChangeListener` with `ValueChangeMode.ON_BLUR` / `LAZY` | works because the web component fires `change`            |

## Discussion

**Q: One `setFormat(bean)` or flat setters?**

Flat setters. The bean would carry mutually exclusive fields, bind only as a whole, and repeat the
mistake that led vcf-input-mask to untyped `InputMaskOption(key, value)` pairs.

**Q: Should Flow enforce that groups and mask are not both set?**

No. The setters stay dumb like `setAllowedCharPattern`; the web component owns the rule and the
warning, so the two APIs never disagree.

**Q: Where do the setters live?**

On a `HasInputFormat` interface in `vaadin-flow-components-base`, so `TextField` and later
adopters share one definition, including `getFormattedValue()` with its synchronisation annotation.

**Q: Is a server-side parse hook part of this API?**

Not here. Normalising or parsing on commit follows the shape of `DatePicker#setFallbackParser`
and is independent of the presentation format; it is recorded as a separate follow-up.
