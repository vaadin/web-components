# Query Field Developer API

> Status: **draft / experimental** — behind the `queryFieldComponent` feature flag.

```js
window.Vaadin.featureFlags.queryFieldComponent = true;
import '@vaadin/query-field';
```

## 1. Basic usage

Covers requirement(s): 1, 2, 10

```html
<vaadin-query-field label="Search records" placeholder="Search…" clear-button-visible></vaadin-query-field>
```

```js
const field = document.querySelector('vaadin-query-field');
field.filters = [
  {
    name: 'label',
    label: 'Record label',
    options: ['Warp Records', 'Ninja Tune', { value: 'xl', label: 'XL Recordings' }],
  },
  { name: 'year', label: 'Release year', type: 'number' },
  { name: 'artist', label: 'Artist', options: ['Aphex Twin', 'Boards of Canada'], allowCustomValue: true },
];
field.value = 'label:"Warp Records" year:2001 ambient';
```

```ts
interface QueryFieldFilter {
  /** Name typed before the colon: `name:value`. Letters, digits, `_` and `-`, starting with a letter. */
  name: string;
  /** Human-readable label shown in suggestions. */
  label?: string;
  /** `'number'` requires a numeric value. Defaults to `'text'`. */
  type?: 'text' | 'number';
  /** Allowed values, suggested while typing the value. Plain strings are shorthand for `{ value }`. */
  options?: Array<string | QueryFieldFilterOption>;
  /** Accept values that are not in `options`. Options are then just suggestions. */
  allowCustomValue?: boolean;
}

interface QueryFieldFilterOption {
  value: string;
  label?: string;
}
```

**Why this shape:** The component extends the text-field mixin chain, so everything a text field does (label, helper, validation, prefix/suffix, clear button, theme variants, tooltip, form participation through the slotted native `<input>`) works with zero new API. The value stays a plain `string`, so it can be bookmarked, persisted and bound in Flow like any text field. Filters are a programmatic `filters` array (like `items` in combo-box) rather than nested `<datalist>`s / child elements, because options are data-driven at runtime and can be large (users for mentions, tags, …). A declarative `<datalist>`-style API could be added later on top, if demos show the need.

---

## 2. Reading the parsed query

Covers requirement(s): 8

```js
field.addEventListener('query-changed', (e) => {
  const { text, filters } = e.detail.value;
  // text:    'ambient'
  // filters: [{ name: 'label', value: 'Warp Records' }, { name: 'year', value: '2001' }]
  backend.search(text, filters);
});
```

```ts
interface QueryFieldQuery {
  /** The free text, i.e. all words that are not filters, joined by a single space. */
  text: string;
  /** Valid filters, in order of appearance. Values are unquoted and canonicalized to the option's `value`. */
  filters: Array<{ name: string; value: string }>;
}
```

**Why this shape:** `query` is a read-only, notifying property (like `selectedItems` in multi-select-combo-box), so applications never re-implement the tokenizer. Invalid filters are left out of `query.filters` — they make the field invalid instead (see 5), so a half-typed `year:` never reaches the backend. Option values are matched case-insensitively and reported in their canonical form, so `label:"warp records"` reports `Warp Records`.

---

## 3. Autocomplete

Covers requirement(s): 3, 4, 5, 9

No API. Behavior:

- Typing a word that is a prefix of a filter name, or contained in its label, opens suggestions of filter names. Picking one replaces the word with `name:` and continues with value suggestions.
- With the caret anywhere inside a known filter that has `options`, the suggestions show the options whose value or label contain the typed value. Picking one replaces the **whole token** with `name:value ` (quoted when needed) and moves the caret after it.
- Arrow Down opens suggestions (also on empty input, showing all filters), Arrow Up / Down move the active suggestion, Enter / Tab pick it, Escape closes the overlay (a second Escape clears the field when `clear-button-visible` is set, as in other fields).
- Replacement uses `document.execCommand('insertText')` where supported, so picking a suggestion can be undone with Ctrl+Z.
- The overlay is anchored to the start of the active token and never takes focus.

ARIA: the native input gets `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` (the light-DOM listbox) and `aria-activedescendant`; suggestions are `vaadin-item`s with `role="option"`.

---

## 4. Highlighting and styling

Covers requirement(s): 6, 12

```css
/* every recognized filter token */
vaadin-query-field::part(token) {
  background: var(--vaadin-query-field-token-background);
  border-radius: var(--vaadin-query-field-token-border-radius);
}
/* the "name:" and "value" halves */
vaadin-query-field::part(token-name) { color: gray; }
vaadin-query-field::part(token-value) { color: navy; }
/* one filter, by name: filter-{name} */
vaadin-query-field::part(filter-year) { background: lightyellow; }
/* invalid tokens, once the caret has left them */
vaadin-query-field::part(invalid-token) { text-decoration: underline wavy red; }
```

Custom CSS properties (base styles, overridden by Lumo / Aura):

- `--vaadin-query-field-token-background`
- `--vaadin-query-field-token-border-radius`
- `--vaadin-query-field-token-name-color`
- `--vaadin-query-field-token-value-color`
- `--vaadin-query-field-invalid-token-color`

**Why this shape:** Highlighting is done with a backdrop layer in shadow DOM that mirrors the input text and scroll position, while the native input renders transparent text on top of it with a visible caret. This works in every supported browser and keeps the native input (and so all native editing, autofill, IME, forms, a11y) untouched. Shadow parts — rather than the CSS Custom Highlight API's global `::highlight(name)` names — keep the styling scoped to the component and consistent with the rest of the library. Only properties that do not change text metrics may be used on the parts (colors, backgrounds, `text-decoration`, `box-shadow`, `border-radius`); padding, borders, `font-weight` etc. would misalign the backdrop and the caret. This is documented on the parts.

Future progressive enhancement: where `HTMLInputElement.createValueRange()` (OpaqueRange) is available, the backdrop could be replaced by CSS Custom Highlights directly on the input, keeping the same parts API via `::highlight()` inside the shadow root.

---

## 5. Validation

Covers requirement(s): 7, 11

```js
field.validate(); // false when any filter is invalid
field.invalid;    // true, error message shown as in any field
```

**Why this shape:** Uses the existing `ValidateMixin` contract, no new API. Validation runs on blur / change like other fields. Tokens are marked with `invalid-token` only while the caret is not inside them, so the user is not nagged while typing.

---

## Discussion / open questions

- **Name.** `vaadin-query-field` follows the `*-field` naming of input components. Alternatives: `vaadin-search-field`, `vaadin-filter-field`, `vaadin-rich-input`.
- **Mentions (`@user`) for message input.** The tokenizer and suggestion/overlay logic are generic. A follow-up could add a filter `trigger` (e.g. `{ trigger: '@', options }`) producing `@value` tokens, and `vaadin-message-input` could reuse the backdrop technique on its `<textarea>`. Multi-line requires wrapping-aware mirroring (same technique, `white-space: pre-wrap`).
- **Option images / custom rendering.** A `renderer` for suggestion items (avatars, logos) is a likely need; left out of the draft.
- **Lazy options.** A `dataProvider`-style callback per filter (e.g. for users) would be needed for large sets.
- **Comparison operators** (`year:>2000`, ranges) and negation (`-label:foo`) are not supported yet.
- **Values with double quotes** inside quoted values are not supported (no escaping).
