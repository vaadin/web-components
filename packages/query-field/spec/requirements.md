# Query Field Requirements

## 1. Free text and filters in one value

The field accepts a single line of text mixing free words and filters written as `name:value`. Values containing whitespace are wrapped in double quotes: `name:"some value"`. The value of the field is always the plain text the user sees.

*Example: `label:"Warp Records" year:2001 ambient`.*

---

## 2. Configurable filters

The application defines which filter names exist, with an optional human-readable label, an optional value type (text or number) and an optional list of allowed values. Each allowed value has a stored value and an optional display label.

---

## 3. Filter name suggestions

While the user types a word that could be the beginning of a filter name, the field suggests matching filters (by name or label). Picking one inserts `name:` and immediately continues with value suggestions.

*Example: typing `l` suggests `label:` (Record Label).*

---

## 4. Filter value suggestions

While the caret is inside the value of a known filter that has allowed values, the field suggests values that match what has been typed, regardless of where in the token the caret is. Picking a value replaces the whole token with a correctly quoted `name:value` followed by a space.

---

## 5. Keyboard and pointer operation

Suggestions can be browsed with Arrow Up / Arrow Down, picked with Enter or Tab, dismissed with Escape, and opened explicitly with Arrow Down. They can also be picked with the pointer. Focus always stays in the text input.

---

## 6. Highlighting

Recognized filters are visually distinguished from free text without changing the text metrics (no layout shift, the caret stays exactly where native text editing puts it). Name and value of a filter can be styled separately, and applications can style each filter name differently.

---

## 7. Validation

A filter is invalid when its name is unknown, its value is empty, a quote is left unclosed, a number filter has a non-numeric value, or a filter with allowed values has a value outside of them (unless custom values are allowed). Invalid filters are marked visually once the caret is no longer inside them. Field validation (`validate()`, `checkValidity()`, `required`) treats any invalid filter as a constraint violation.

---

## 8. Parsed query

The application can read the parsed query — the free text and the list of valid filters with their (canonical) values — without parsing the string itself, and is notified whenever it changes.

---

## 9. Native text editing

Caret movement, selection, copy/paste, undo/redo, IME composition, autofill and form participation work exactly as in a native `<input>`.

---

## 10. Field features

Everything a Vaadin text field supports — label, helper text, error message, placeholder, prefix / suffix, clear button, required, readonly, disabled, tooltip, theme variants — works the same.

---

## 11. Accessibility

The input is announced as a combobox with a list popup, the active suggestion is announced, and suggestions have accessible names. Invalid state is exposed via the field's standard `aria-invalid` / error message wiring.

---

## 12. Theming

Highlight colors and the suggestion overlay are themable and work in Lumo and Aura, light and dark, and forced-colors mode.
