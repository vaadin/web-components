# CEM Migration — Progress

Summary of changes made to support migrating web-types generation from Polymer Analyzer (`analysis.json`) to Custom Elements Manifest (`custom-elements.json`).

## CEM Analyzer Config (`custom-elements-manifest.config.js`)

### Plugins added

- **`classPrivacyPlugin`** — marks `@private`/`@protected` class declarations so they are filtered out of the manifest (#11182)
- **`readonlyPlugin`** — marks `readOnly: true` Polymer properties as `readonly` in CEM, so they are excluded from Lit property bindings (#11181)
- **`mixesPlugin`** — augments mixin declarations with `@mixes` JSDoc tags that the analyzer couldn't capture from static analysis (e.g., `I18nMixin(defaultI18n, Chain(superClass))`) (#11176)
- **`typeOverridePlugin`** — collects `@type` JSDoc overrides from getter declarations during `analyzePhase` and re-applies them in `packageLinkPhase`, fixing i18n property types (e.g., `AppLayoutI18n` instead of generic `Object`)

### packageLinkPhase improvements

- **Multi-level inheritance resolution** — `resolveInheritedMembers` copies missing members and attributes from mixin/superclass declarations through arbitrary-depth inheritance chains (e.g., `EmailField → TextField → FieldMixin → LabelMixin`)
- **Type propagation** — `copyMissingItems` fills in missing `type` from parent when a member exists but has `undefined` type (fixes `exclude`/`include` on crud)
- **Description propagation** — `copyMissingItems` fills in missing `description` from parent (fixes `value` description on `Checkbox`, `RadioButton`)
- **Type override BFS** — `applyClosestOverrides` walks the mixin/superclass chain breadth-first, applying the closest (most specific) `@type` override for each member
- **False positive filtering** — deny lists for members (`slotName`, `id`) and events (`eventName`) incorrectly picked up by CEM from sub-object property assignments and dynamic `dispatchEvent` calls
- **Attribute filtering** — filters out attributes for non-public members and non-primitive types (#11174)
- **Privacy defaulting** — defaults member privacy to `public` for inherited members that lack explicit privacy

## Web-Types Generator (`scripts/buildWebtypes.js`)

- **Migrated from `analysis.json` to `custom-elements.json`** as data source
- **Fixed boolean type check** — uses exact token match (`mapType().includes('boolean')`) instead of substring match, fixing `isItemSelectable` (type `(item) => boolean`) getting `?` prefix instead of `.`

## JSDoc Fixes (merged to main)

These source code fixes were needed to produce correct CEM output:

- **`@type` instead of `@return` for i18n getters** — CEM reads `@type` on getters, not `@return` (#11254)
- **Removed redundant `@type` JSDoc** — properties that duplicate the Polymer `type:` declaration caused CEM to emit incorrect types (#11255)
- **Removed `@type` for string enum properties** — `@type {"none" | "normal" | "percent"}` broke the primitive type filter; removing lets CEM infer `string` from Polymer `type: String` (#11264, charts)
- **Removed more unnecessary `@type` annotations** — further cleanup of redundant type annotations (#11263)
- **Added missing `@fires` for upload file events** — `file-abort`, `file-retry`, `file-start` on `UploadFile` (#11268)
- **Fixed `@fires` for chart series-mouse-over** — incorrect annotation (#11267)
- **Added missing `@customElement` tag name for badge** — CEM requires tag name in JSDoc (#11259)
- **Object syntax for property declarations** — shorthand `prop: String` causes CEM to produce empty types; converted to `prop: { type: String }` in 8 source files across crud, custom-field, date-picker, dialog, side-nav, upload (#11273)
- **Added `@type` JSDoc to `ItemMixin.value`** — getter/setter pair had no description for CEM to pick up (#11276)
- **Added `@prop` JSDoc for `Item.label`** — CEM ignores bare `this.label;` constructor declarations; `@prop {string} label` on the class docblock makes CEM pick it up (#11290)
- **Removed `@type` for chart series `markers`** — custom enum type `'auto' | 'hidden' | 'shown'` was excluded by primitive type filter; removing `@type` lets CEM infer `string` from Polymer `type: String` (#11305)
- **Fixed missing space in chart `@fires` annotation** — event description incorrectly included a leading dash (#11306)
- **Added `@fires` for time-picker `unparsable-change`** — event type and `CustomEventMap` entry in `.d.ts` (#11300)
- **Added `@fires` for upload `file-remove`** — event type and `CustomEventMap` entry in `.d.ts` (#11301)
- **Added `@fires` for dashboard `dashboard-item-before-remove`** — was in `.js` but missing in `.d.ts` (#11302)
- **Added `@fires` for message-input `submit`** — CEM only recognizes `@fires`, not the `@event` syntax used in the mixin (#11303)
- **Added `@fires` for context-menu `close-all-menus` and `items-outside-click`** — present in `.d.ts` event map but missing `@fires` JSDoc (#11303)
- **Object syntax for `String` shorthand properties** — `prop: String` shorthand didn't use `{ type: String }` causing CEM to produce empty types; converted in additional source files (#11292)

## Diff Summary (old Polymer Analyzer vs new CEM)

### Intentional / expected changes

- **765 type changes**: all are `["type","null","undefined"] → ["type"]` — CEM strips `null | undefined` from property types. This is correct and expected.
- **18 added events**: newly documented events from dashboard, date-picker (`unparsable-change`), grid-filter/sorter, rich-text-editor (`change`), upload (`file-remove`), context-menu (`close-all-menus`). These are legitimate additions from proper `@fires` annotations.
- **4 added attributes**: `tabindex` on checkbox/radio-button (from `DelegateFocusMixin`), `disabled` on grid/grid-pro. Legitimate — previously missed by Polymer Analyzer.
- **Lit property prefix fixes**: `?isDateDisabled` → `.isDateDisabled`, `?onNavigate` → `.onNavigate` — correctly changed from boolean to dot prefix (function types, not boolean).

### Correctly filtered removals

- `upload/vaadin-upload-drop-zone: max-files-reached` — readonly property, correctly excluded
- `side-nav/vaadin-side-nav: location` — type `any`, correctly excluded by primitive type filter
- `side-nav/vaadin-side-nav: on-navigate` — function type, correctly excluded from attributes (still available as `.onNavigate` in Lit bindings)
- `upload/vaadin-upload-file-list: .items` (Lit) — readonly, correctly excluded
- `multi-select-combo-box: value` — deliberately omitted via `Omit<InputMixinClass, 'value'>` in the d.ts

## Remaining Issues

### 1. grid-pro events dropped

Events missing from `vaadin-grid-pro` web-types:
- `enter-next-row-changed`
- `single-cell-edit-changed`
- `editor-type-changed`

**Fix:** Add `@fires` JSDoc annotations to `InlineEditingMixin` and `GridProEditColumnMixin`.

### 2. Other missing events (need `@fires` annotations)

- `checkbox/vaadin-checkbox: value-changed` — not documented with `@fires`
- `radio-group/vaadin-radio-button: value-changed` — not documented with `@fires`
- `combo-box/vaadin-combo-box: input` — native input event forwarded from inner `<input>`
- `date-picker/vaadin-date-picker: input` — same
- `multi-select-combo-box/vaadin-multi-select-combo-box: input` — same
- `time-picker/vaadin-time-picker: input` — same
- `crud/vaadin-crud-edit: edit` — missing `@fires` annotation

### 3. Missing attributes (need investigation)

- `crud/vaadin-crud-edit-column: aria-label` — string type but not in CEM attributes; may need attribute mapping
- `grid/vaadin-grid-sorter: path` — string type but not appearing in web-types

### 4. Upload sub-component Lit binding

- `upload/vaadin-upload-button: .disabled` — CEM member lacks `attribute` link, so Lit binding `.disabled` is not generated despite being a valid public boolean property
