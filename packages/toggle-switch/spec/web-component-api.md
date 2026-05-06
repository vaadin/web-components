# Toggle Switch Developer API

The component is exposed as `<vaadin-toggle-switch>`, following the Vaadin convention where the kebab-cased ComponentName becomes the tag (`ToggleSwitch` → `vaadin-toggle-switch`). All examples below are minimal — no extra wiring needed beyond what the snippet shows.

---

## 1. Basic on/off control with a default-off state

Covers requirement(s): 1, 4

```html
<!-- Default: starts off, exposes the WAI-ARIA switch role automatically -->
<vaadin-toggle-switch label="Notifications"></vaadin-toggle-switch>

<!-- Initial state: on -->
<vaadin-toggle-switch label="Dark mode" checked></vaadin-toggle-switch>

<!-- Read the current state programmatically -->
<script>
  const sw = document.querySelector('vaadin-toggle-switch');
  console.log(sw.checked); // false
  sw.checked = true;       // turn it on programmatically
</script>
```

**Why this shape:** A boolean `checked` property/attribute mirrors Vaadin Checkbox and the WHATWG `<input type="checkbox">` family — there is no precedent for a separate `value` property carrying the on/off state in Vaadin field components. The default-off state is implicit because `checked` defaults to `false` when the attribute is absent. Click and Space activation are not configurable in the API; they are part of the component's contract. The same applies to ARIA: the component exposes the WAI-ARIA `switch` role with the correct on/off state automatically — there is no `role` attribute or aria-related property for the developer to set, and no way to opt into the generic checkbox role instead.

---

## 2. User-change notification vs. property-change observation

Covers requirement(s): 2

```html
<vaadin-toggle-switch label="Compare with previous period"></vaadin-toggle-switch>
<script>
  const sw = document.querySelector('vaadin-toggle-switch');

  // User-initiated: fires only when the user flips the switch
  sw.addEventListener('change', (e) => {
    saveSetting('compare', e.target.checked);
  });

  // Property-change: fires for both user and programmatic updates
  // — useful for two-way binding in framework wrappers
  sw.addEventListener('checked-changed', (e) => {
    console.log('checked is now', e.detail.value);
  });

  // Programmatic update — fires `checked-changed` but NOT `change`
  sw.checked = true;
</script>
```

**Why this shape:** Two events are necessary because applications want different things from each. `change` is the canonical user-action event (matches Vaadin Checkbox and native `<input>`); applications hook it to persist immediate-effect settings. `checked-changed` is the Vaadin-wide property-change event used by the framework's two-way data binding (Polymer-style `{{checked}}` syntax). Splitting them is what lets Req 2 hold: programmatic hydration cannot accidentally trigger a re-save loop because hydration only fires the property-change event, never `change`.

---

## 3. Label as text, label as HTML, label-less

Covers requirement(s): 3

```html
<!-- Plain-text label (most common) -->
<vaadin-toggle-switch label="Email me when I'm @mentioned"></vaadin-toggle-switch>

<!-- HTML content in the label, including inline links -->
<vaadin-toggle-switch>
  <span slot="label">
    Send anonymous usage data — <a href="/privacy">read our privacy policy</a>
  </span>
</vaadin-toggle-switch>

<!-- Label-less switch (e.g. inside a data grid where the column header is the name) -->
<vaadin-toggle-switch accessible-name="Active"></vaadin-toggle-switch>

<!-- Or referencing an external label by id -->
<span id="row-3-active-label" hidden>Webhook 'shipments-prod' active</span>
<vaadin-toggle-switch accessible-name-ref="row-3-active-label"></vaadin-toggle-switch>
```

**Why this shape:** Three label paths cover the three real-world scenarios. The `label` attribute is the lightest option for plain text. `slot="label"` matches Vaadin Checkbox / Radio Button when the application needs HTML inside the label (links, formatting). For the label-less case (per-row tables, toolbars), `accessibleName` and `accessibleNameRef` are the standard Vaadin field-mixin pair, so the switch always has an accessible name even when nothing is visible. Clicking interactive children inside the label (the `<a>`) does not toggle — Req 3 mandates that, no API surface needed.

---

## 4. Disabled

Covers requirement(s): 5

```html
<!-- Disabled: not focusable, ignored by Tab, no interaction, omitted from form submission -->
<form>
  <vaadin-toggle-switch name="dailyDigest" label="Daily digest" disabled></vaadin-toggle-switch>
</form>

<!-- Programmatic toggle of the disabled state in response to a parent setting -->
<script>
  const child = document.querySelector('#daily-digest-switch');
  parentSwitch.addEventListener('change', (e) => {
    child.disabled = !e.target.checked;
  });

  // Programmatic state update on a disabled switch is allowed and quiet:
  // updates the visual + ARIA state, fires `checked-changed`, does NOT fire `change`.
  child.checked = true;
</script>
```

**Why this shape:** A single `disabled` boolean attribute matches every other Vaadin form field and the platform-native disabled semantics. No custom shape needed. The form-submission exclusion and the "programmatic flips are allowed and silent" behavior come for free from the underlying field/checked machinery — no separate API.

---

## 5. Read-only (locked but still announced)

Covers requirement(s): 6

```html
<!-- Read-only switch reflecting a plan-locked setting -->
<vaadin-toggle-switch
  label="Audit log retention (90 days)"
  helper-text="Included on the Business plan."
  checked
  readonly
></vaadin-toggle-switch>

<!-- Read-only + required: validation rule "valid if on, invalid if off" still applies.
     The application is responsible for not pairing read-only-off with required when
     it would block the form. No new API; just the combination of two attributes. -->
<vaadin-toggle-switch
  label="Account verified"
  checked
  readonly
  required
></vaadin-toggle-switch>
```

**Why this shape:** A boolean `readonly` attribute mirrors Vaadin's other field-mixin components (text-field, checkbox, radio-button). The distinction from `disabled` is intentional and matches the Vaadin convention: read-only stays focusable and Tab-reachable, disabled does not. Unlike a disabled switch, a read-only switch still contributes its current value to form submission — that distinction is implicit in the Vaadin convention and does not require a separate property.

---

## 6. Required validation + error message

Covers requirement(s): 7, 9

```html
<!-- Required: built-in indicator and built-in invalid behavior. After a failed
     submit, the switch shows `invalid`; flipping it on clears `invalid` automatically. -->
<vaadin-toggle-switch
  label="I confirm the trip details are correct"
  required
  error-message="You must accept the trip details to continue"
></vaadin-toggle-switch>

<!-- Application-driven invalid state (e.g. server-side rejection) -->
<script>
  const sw = document.querySelector('vaadin-toggle-switch');

  // Switch off auto-validation; the app is in charge of `invalid` and `errorMessage`.
  sw.manualValidation = true;

  form.addEventListener('save-failed', (event) => {
    sw.invalid = true;
    sw.errorMessage = event.detail.message;
    // e.g. "Two-factor authentication can't be disabled while on the Compliance plan"
  });

  // Trigger validation from app code
  sw.validate();

  // Observe validation outcome
  sw.addEventListener('validated', (e) => {
    console.log(e.detail.valid);
  });
</script>
```

**Why this shape:** `required`, `invalid`, `errorMessage`, `manualValidation`, `validate()`, and the `validated` event are the Vaadin field convention shared by every form field — using the same names here keeps Toggle Switch interchangeable with TextField, ComboBox, Checkbox, etc. in form layouts and data-binding code. The required→on-is-valid rule is component-internal and does not surface as separate API; setting `required` is enough. The `manualValidation` flag is what unlocks Req 9's "application-supplied custom error message" use case (server-side validation flows) without fighting the component's own validation pass.

---

## 7. Helper text

Covers requirement(s): 8

```html
<vaadin-toggle-switch
  label="Auto-save"
  helper-text="Save changes automatically every 30 seconds"
></vaadin-toggle-switch>

<!-- HTML content in helper text -->
<vaadin-toggle-switch label="Beta features">
  <span slot="helper">
    See the <a href="/beta">beta program page</a> for what's enabled.
  </span>
</vaadin-toggle-switch>
```

**Why this shape:** The `helper-text` attribute / `slot="helper"` pair is the Vaadin field-mixin convention. Same shape as TextField, Checkbox, and Radio Group — an application that wraps a switch in the same form layout as other fields gets consistent helper-text rendering and ARIA wiring for free.

---

## 8. Tooltip

Covers requirement(s): 10

```html
<!-- Tooltip via slotted vaadin-tooltip — opens on hover and on keyboard focus -->
<vaadin-toggle-switch label="Active">
  <vaadin-tooltip slot="tooltip" text="Last delivery: 2 minutes ago"></vaadin-tooltip>
</vaadin-toggle-switch>
```

**Why this shape:** The `slot="tooltip"` pattern with a child `<vaadin-tooltip>` is the established Vaadin tooltip integration — applies uniformly to all field components. No new API needed on the Toggle Switch itself.

---

## 9. Form submission

Covers requirement(s): 11

```html
<form action="/api/users/42" method="post">
  <vaadin-text-field name="name" label="Name"></vaadin-text-field>

  <!-- Only `name` set: submitted as `subscribe=on` (the WHATWG default) when on -->
  <vaadin-toggle-switch name="subscribe" label="Subscribe to newsletter"></vaadin-toggle-switch>

  <!-- `name` + custom `value`: submitted as `twoFactor=required` only when on -->
  <vaadin-toggle-switch
    name="twoFactor"
    value="required"
    label="Two-factor authentication required"
  ></vaadin-toggle-switch>

  <button type="submit">Save</button>
</form>

<script>
  // Native <form>.reset() restores the initial checked state and updates the
  // visible thumb position. The reset fires `checked-changed` (so two-way
  // bindings observe the rollback) but does NOT fire `change` — same
  // user-vs-programmatic split as §2.
  form.reset();
</script>
```

**Why this shape:** Native form participation through `name` and `value` keeps the Toggle Switch a drop-in replacement anywhere a `<input type="checkbox">` was used (search params, server-side handlers, Vaadin Flow Binder). `value` defaults to `"on"` per the WHATWG checkbox convention — the first `<vaadin-toggle-switch>` example above shows that case explicitly — so a developer who only sets `name` still gets a sensible submission. The form-reset behavior is automatic; the developer does not opt in. A disabled switch is excluded from submission per native HTML behavior; no extra API to express that.

---

## Discussion

No questions were posed to the user during the production of this document. All API choices follow established Vaadin field-mixin conventions (Checkbox, Radio Button, Text Field) and are fully determined by the requirements:

- **Tag name `<vaadin-toggle-switch>`** — derived from the ComponentName "ToggleSwitch" via the standard kebab-name rule.
- **`checked` boolean for state** — matches Vaadin Checkbox and native `<input type="checkbox">`.
- **`change` (user) vs. `checked-changed` (property)** — standard Vaadin two-event split, required by Req 2's user-vs-programmatic distinction.
- **`label` attribute / `slot="label"` / `accessibleName(Ref)` for the three label paths** — standard Vaadin field-mixin trio.
- **`helper-text` / `error-message` / `slot="tooltip"` field apparatus** — standard Vaadin field convention.
- **`required`, `invalid`, `manualValidation`, `validate()`, `validated` validation pipeline** — standard Vaadin field convention.
- **`name` + `value` for native form submission, with `value` defaulting to `"on"`** — standard WHATWG checkbox convention, mirrored by Vaadin Checkbox.
- **No `loading` attribute, no `indeterminate` attribute, no in-track text/icon slot, no drag gesture API** — all out of scope per `requirements.md` Discussion.
- **No `size` attribute** — sizing is theme-token driven via CSS custom properties, matching Vaadin's broader convention; not surfaced as an HTML attribute. (Not raised in `requirements.md` because sizing is not a behavioral concern.)
