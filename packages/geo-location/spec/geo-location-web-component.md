# Vaadin Geo Location Web Component

> ⚠️ This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.geoLocationComponent = true`

`<vaadin-geo-location>` is an accessible button that asks the browser (and,
with the user's consent, the underlying device) for the user's current
position. The result is exposed on the element as a structured `position`
object, a serialized form-submittable `value`, and a `location` event.

The component is the bridge between "where am I" and "what should I do
with it". It does not display a map, it does not do reverse geocoding, and
it does not store history. Its only job is to wrap the browser's
Geolocation API in something that behaves like a regular Vaadin component:
declarative markup, accessible button semantics, themable styling, events,
and form participation.

## Usage Examples

### 1. Basic — one-time location request on click

The canonical shape. Works with no JavaScript beyond the component import.
The user clicks the button, the browser asks for permission, and a
`location` event fires with the result.

Covers **UC1 (show information relevant to where I am right now)** — the
most common scenario.

```html
<vaadin-geo-location id="locate">
  <vaadin-icon icon="vaadin:map-marker" slot="prefix"></vaadin-icon>
  Use my location
</vaadin-geo-location>

<script>
  const el = document.querySelector('#locate');
  el.addEventListener('location', (e) => {
    if (e.detail.position) {
      const { latitude, longitude } = e.detail.position.coords;
      showNearestStores(latitude, longitude);
    } else {
      showManualPostcodeEntry(e.detail.error);
    }
  });
</script>
```

Notes:

- The component renders as a button. Clicking it (or pressing Enter/Space
  while focused) triggers a single position request.
- A single `location` event fires per request. Its `detail` carries either
  a `position` or an `error`, never both. Consumers therefore register one
  listener for the entire happy+sad path.
- Activating the button again later issues a fresh request — the cached
  position from a previous click is not reused implicitly (see example 6
  for cache tuning).

### 2. Continuous tracking with the `watch` attribute

Enables continuous position updates instead of a single snapshot. While
watching, the `location` event fires every time the browser reports a new
position, and the `position` property is kept current.

Covers **UC2 (continuously follow me while I am doing something)**.

```html
<vaadin-geo-location id="tracker" watch>Start tracking</vaadin-geo-location>

<script>
  const tracker = document.querySelector('#tracker');
  tracker.addEventListener('location', (e) => {
    if (e.detail.position) {
      recordWorkoutSample(e.detail.position);
    }
  });
</script>
```

- Setting `watch` begins an active watch the first time the user activates
  the button. Removing `watch` (or calling `stopWatching()`) ends it.
- The component also stops watching automatically when it is removed from
  the DOM, so no stray background watches leak between pages. This is how
  UC2's "tracking must stop when the activity ends or the page is left" is
  satisfied without any work from the developer.
- While a watch is active, the host gets the `watching` state attribute so
  applications can restyle the button ("Stop tracking") and/or show a
  recording indicator.

Programmatic equivalent:

```js
document.querySelector('#tracker').startWatching();
// …later…
document.querySelector('#tracker').stopWatching();
```

### 3. Auto-locate when permission is already granted

Setting `auto-locate` causes the component to attempt a single location
request automatically as soon as it connects — but **only if the browser
reports that permission has already been granted**. If permission is in
the `prompt` or `denied` state, the component stays idle and waits for the
user to click it.

Covers **UC3 (automatically use my location when I come back)**.

```html
<vaadin-geo-location auto-locate>Use my location</vaadin-geo-location>
```

- This guarantees UC3's "no extra click if permission is already in place,
  no surprise prompt on cold load". The component never triggers the
  browser's permission dialog from an auto-locate pass — only an explicit
  user activation does that.
- `auto-locate` is a separate flag from `watch`; they can be combined to
  mean "silently begin tracking on return visits".

### 4. Handling denial, failure and unavailability

The error path is first-class. Applications observe three things:

- The `location` event's `detail.error` — the specific reason this request
  failed (permission denied, position unavailable, timeout).
- The `unavailable` boolean property / state attribute — true when the
  Geolocation API itself is not usable at all in the current context
  (insecure origin, disabled by Permissions-Policy, unsupported browser).
  When this is the case, the component disables itself and does not render
  as an interactive button.
- The `permission` property / state attribute (`granted`, `denied`,
  `prompt`, `unknown`) — so the app can show "Location blocked. Click the
  padlock in the address bar to re-enable." messaging to previously-denied
  users.

Covers **UC4 (handle users who say "no" or can't share a location)**.

```html
<vaadin-geo-location id="locate">Find stores near me</vaadin-geo-location>

<div id="fallback" hidden>
  <label>Enter postcode: <input id="postcode" /></label>
</div>

<script>
  const el = document.querySelector('#locate');
  const fallback = document.querySelector('#fallback');

  // The component disables itself and sets [unavailable] when the API
  // isn't usable at all; hide the control entirely in that case.
  if (el.unavailable) {
    el.hidden = true;
    fallback.hidden = false;
  }

  el.addEventListener('location', (e) => {
    if (e.detail.position) {
      showNearbyStores(e.detail.position);
    } else {
      // One branch handles denied, unavailable, timeout, and any future codes.
      fallback.hidden = false;
      reportLocationError(e.detail.error);
    }
  });
</script>
```

- The same `location` event is used for success and failure, so there is
  exactly one place in application code where the outcome is handled.
- Error codes are exposed in a stable, named form (`permission-denied`,
  `position-unavailable`, `timeout`) rather than as opaque numeric codes.
- State attributes (`has-error`, `permission-denied`, etc.) let the
  application style the button itself — e.g. dimming it and swapping its
  label to "Location blocked" after a previous denial — without any JS
  beyond reading the attribute in CSS.

### 5. Reading detailed position data

The full `GeolocationPosition` object returned by the browser is exposed
unchanged on the `position` property (and in `event.detail.position`), so
applications that care about accuracy, altitude, heading, speed or
timestamp can read them directly.

Covers **UC5 (use detailed position data, not just latitude and longitude)**.

```html
<vaadin-geo-location id="cycle" watch high-accuracy>Record ride</vaadin-geo-location>

<script>
  document.querySelector('#cycle').addEventListener('location', (e) => {
    const p = e.detail.position;
    if (!p) return;
    const {
      latitude, longitude, altitude, accuracy,
      altitudeAccuracy, heading, speed,
    } = p.coords;
    const timestamp = p.timestamp;
    updateDashboard({ latitude, longitude, altitude, accuracy, heading, speed, timestamp });
  });
</script>
```

A `minimumAccuracy` property is also provided so that applications can
declare "ignore readings worse than N metres". Readings that fail this
check are reported as a `position-unavailable` error instead of being
surfaced as a (bad) position. This directly covers UC5's "a brief bad GPS
fix should not add a kilometre-long zig-zag to the route".

### 6. Tuning precision, freshness and battery

Three inputs on the component map 1:1 onto the W3C
`PositionOptions` dictionary. They can be different on every instance —
one button on the same page can ask for a fast coarse reading while
another asks for a precise but slow one.

Covers **UC6 (trade off precision, freshness and battery)**.

```html
<!-- News site: a cached city-level reading is fine. -->
<vaadin-geo-location maximum-age="300000" timeout="5000">
  Show local headlines
</vaadin-geo-location>

<!-- Navigation: most accurate position, continuously updated. -->
<vaadin-geo-location watch high-accuracy>Start navigation</vaadin-geo-location>

<!-- Check-in: must be fresh, no cached positions accepted. -->
<vaadin-geo-location maximum-age="0" high-accuracy timeout="10000">
  Check in here
</vaadin-geo-location>

<!-- Address form: give up quickly, the user can type it. -->
<vaadin-geo-location timeout="3000">Use my address</vaadin-geo-location>
```

- `high-accuracy` is the boolean equivalent of W3C's
  `enableHighAccuracy`. Absent = coarse/fast/low-power.
- `maximum-age` is in milliseconds. `0` means "no cached reading accepted";
  a high number means "a reading from that long ago is still fine".
- `timeout` is in milliseconds. After it elapses, the `location` event
  fires with a `timeout` error and the button becomes clickable again.

### 7. Using the captured location as a form field

The component is a form-associated custom element. Its `value` property
(and the corresponding form value it submits) is a compact
`"latitude,longitude"` string — empty when no position has been captured
yet. Like any other form field, it supports `name`, `required`, `invalid`,
and `validate()`.

Covers **UC7 (capture the user's location as part of a form)**.

```html
<form id="report">
  <input name="description" required />
  <vaadin-geo-location name="location" required high-accuracy>
    Pin my location
  </vaadin-geo-location>
  <button type="submit">Report</button>
</form>

<script>
  document.querySelector('#report').addEventListener('submit', (e) => {
    const data = new FormData(e.currentTarget);
    // data.get('location') === "60.170833,24.9375"
  });
</script>
```

- When the form is submitted, the component contributes a field named
  `location` with its current `value`. If no position has been captured
  yet, the value is empty.
- `required` means the form cannot be submitted until a position has been
  captured. A `required` component with an empty value sets `invalid`
  automatically on submit attempts, consistent with the standard
  ValidateMixin behavior used by all Vaadin field components.
- Resetting the form (or calling `clear()`) resets `value`, `position`,
  `error`, and `invalid` to their empty/idle defaults so the form can be
  reused.
- The `has-position` state attribute lets the application style the
  captured vs. not-captured state without JS (e.g. changing the label to
  "Location pinned ✓" once a reading has been stored).
- `minimumAccuracy` (see example 5) can be used to refuse positions that
  are too imprecise to submit, covering UC7's "validation to be possible"
  requirement.

---

### Key Design Decisions

1. **The component is a button first.** Every use case in `use-cases.md`
   begins with a user action ("click to locate", "tap to start tracking",
   "pin my location") or — in UC3's case — with permission already being
   granted. A button is therefore the correct base primitive: it provides
   keyboard activation, focus ring, disabled semantics, and screen reader
   semantics for free, and it matches how applications already present
   "Use my location" affordances. The button label is the default slot;
   `prefix` and `suffix` slots match `<vaadin-button>` exactly so the icon
   pattern carries over unchanged.

2. **Autonomous acquisition is never surprising.** The only way the
   component acquires a position without a user click is the
   `auto-locate` attribute, and even then only when the browser's
   Permissions API reports `granted`. This is the mechanism that covers
   UC3 without violating UC4's "must not pop an unexpected prompt on page
   load". The component never calls `getCurrentPosition()` speculatively.

3. **One event for success and failure: `location`.** Every request
   (one-shot or watched) results in exactly one `location` event whose
   detail is `{ position, error }` (exactly one of the two is set). This
   halves the listener boilerplate and, crucially, means application code
   handles UC4's failure path in the same control-flow branch as UC1's
   success path. It also mirrors the emerging `<geolocation>` HTML
   element's single-event shape.
   - *Alternative considered:* separate `location` and `location-error`
     events. Rejected because it pushes the UC4 work into a second
     listener that apps forget to register — the most common UX bug with
     the raw Geolocation API.

4. **Errors are exposed as named codes, not numeric.** The raw browser
   error codes (1, 2, 3) are mapped to `permission-denied`,
   `position-unavailable`, `timeout` strings. Application code never sees
   the numeric codes, and the component is free to add additional named
   codes in the future (`insecure-context`, `blocked-by-policy`,
   `minimum-accuracy-not-met`) without breaking existing callers.

5. **`unavailable` is distinct from `error`.** A request that fails with
   `permission-denied` is a successful call whose outcome is "the user
   said no". The Geolocation API not being usable at all (insecure
   context, Permissions-Policy block, unsupported browser) is different:
   the component cannot offer its function *at all*. These are reported
   through different channels (`unavailable` property + state attribute
   vs. the `error` in a `location` event) because UC4 explicitly calls
   for different UI treatments — "show a retry option" vs. "hide the
   control that can never work".

6. **`watch` is a declarative attribute, not a method.** Putting `watch`
   on the element itself makes the tracking lifecycle visible in the DOM
   ("is this button currently tracking?") and makes the UC2 requirement
   "tracking must stop when the user navigates away" automatic — the
   watch ends with `disconnectedCallback()`. The underlying `startWatching()`
   / `stopWatching()` methods exist for imperative cases (e.g. toggling
   from a different control), but the attribute is the canonical form.

7. **Form-associated custom element, with a serialized `value`.** UC7
   requires the component to behave like any other form field. Instead of
   adding a hidden-input sibling, the component is form-associated
   (ElementInternals) and exposes `name`, `value`, `required`, `invalid`,
   and `validate()` through the same `ValidateMixin` every other Vaadin
   field component uses. The `value` is serialized to
   `"latitude,longitude"` (empty string = no position) because this is
   the simplest representation that round-trips through a form submission
   and is directly readable on the server. Applications that need the
   full position data use the `position` property instead.

8. **`minimumAccuracy` is in the component, not the application.** UC5
   and UC7 both describe scenarios where a reading is "too bad to accept"
   and the application should effectively pretend the reading never
   happened. Doing this in the component (by converting such readings
   into a `minimum-accuracy-not-met` error) collapses that logic into
   one place and means a form's `required` + `minimumAccuracy` combo is
   enough to enforce "submit only when we have a good-enough location",
   with no custom listener code.

9. **High-accuracy, timeout, and maximum-age are per-instance, never
   global.** UC6 explicitly states that different parts of the same app
   need different trade-offs. Each attribute lives on the instance so two
   `<vaadin-geo-location>` elements on the same page can legitimately
   disagree.

10. **Router-agnostic, framework-agnostic, non-visual data aside.** The
    component does not know about the application's routes, does not
    fetch tiles, does not render a map, and does not reverse-geocode.
    These are explicitly called out as out of scope by `use-cases.md`.
    Any of those features can be layered on top by the application — the
    component only supplies latitude/longitude + metadata and gets out of
    the way.

11. **No declarative "data-driven items" API.** Unlike list-like
    components (breadcrumb, side-nav, menu-bar), this component has no
    children to populate: its state is a single position, not a list of
    entries. The declarative-first guideline is still satisfied — the
    element is fully usable from static HTML via its attributes — but the
    second "also provide an `items` array" requirement does not apply.

---

## Implementation

### Mixin chain

```
GeoLocationMixin(
  ValidateMixin(                       // required / invalid / validate()
    ElementMixin(
      ThemableMixin(
        PolylitMixin(                  // required for ThemableMixin + Vaadin infra
          LumoInjectionMixin(          // Lumo theme auto-injection
            LitElement
          )
        )
      )
    )
  )
)
```

`GeoLocationMixin` internally extends:

- `ActiveMixin` — for button-style `active` state on pointer-down / Space.
- `FocusMixin` — for `focused` / `focus-ring` state attributes.
- `TabindexMixin` — tab index management, including `-1` while disabled.

This combination mirrors how `<vaadin-button>` exposes its button
semantics, plus `ValidateMixin` for form participation (UC7).

### Form association

The element sets `static formAssociated = true` and attaches
`ElementInternals`. The internals' form value is kept in sync with the
`value` property. When `required && !value`, the internals'
`validationMessage` / validity flag reflects "missing value".

---

### Elements

**`<vaadin-geo-location>`** — the only element in the package.

Shadow DOM renders:

```html
<button
  part="button"
  type="button"
  aria-disabled="${disabled || unavailable ? 'true' : 'false'}"
  aria-busy="${requesting ? 'true' : 'false'}"
>
  <span part="prefix"><slot name="prefix"></slot></span>
  <span part="label"><slot></slot></span>
  <span part="suffix"><slot name="suffix"></slot></span>
</button>
```

The host itself gets `role="button"` (set by `GeoLocationMixin` in
`firstUpdated()` if not already present) and is the focusable element;
the inner `<button>` is wrapped as a visual/structural shell consistent
with `<vaadin-button>`.

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `position` | `GeolocationPosition \| null` | `null` | No | The most recent successfully-acquired position, verbatim from the browser. `null` when no position has been acquired (or after `clear()`). |
| `error` | `GeoLocationError \| null` | `null` | No | The most recent error, if any. `null` on success or when idle. See `GeoLocationError` below. |
| `value` | `string` | `""` | Yes | Serialized `"latitude,longitude"` form value (empty string when no position). This is the field value contributed to a surrounding form. Read/write: setting it manually updates the submitted value but does NOT update `position`. Writing is useful mainly for restoring a previously captured value on form edit. |
| `state` | `'idle' \| 'requesting' \| 'success' \| 'error' \| 'unavailable'` | `'idle'` | Yes (as `state` attribute) | High-level lifecycle state. `'requesting'` while a call is in flight; `'success'`/`'error'` after the most recent call; `'idle'` before any call or after `clear()`; `'unavailable'` when the API is not usable at all. |
| `watch` | `boolean` | `false` | Yes | When true, a watch is active from the moment of the first activation (or connect, if `autoLocate` is also true) until `watch` becomes false or the element is disconnected. |
| `autoLocate` | `boolean` | `false` | Yes (as `auto-locate`) | When true, the component attempts a single request on connect — **only** if `permission === 'granted'`. |
| `highAccuracy` | `boolean` | `false` | Yes (as `high-accuracy`) | Maps to W3C `PositionOptions.enableHighAccuracy`. |
| `maximumAge` | `number` | `0` | Yes (as `maximum-age`) | Maps to W3C `PositionOptions.maximumAge` (milliseconds). |
| `timeout` | `number` | `Infinity` | Yes (as `timeout`) | Maps to W3C `PositionOptions.timeout` (milliseconds). After elapsing, a `timeout` error is reported and the button becomes clickable again. |
| `minimumAccuracy` | `number \| null` | `null` | Yes (as `minimum-accuracy`) | If set, readings with `coords.accuracy > minimumAccuracy` (metres) are rejected with a `minimum-accuracy-not-met` error rather than being surfaced as a position. |
| `permission` | `'granted' \| 'denied' \| 'prompt' \| 'unknown'` | `'unknown'` | Yes (as `permission` attribute) | Cached permission state, resolved via `navigator.permissions.query({ name: 'geolocation' })` when available. `'unknown'` when the Permissions API cannot determine it. Updated live when the browser reports permission changes. |
| `unavailable` | `boolean` | `false` | Yes | `true` when the Geolocation API cannot be used at all in this context (no `navigator.geolocation`, insecure origin, blocked by Permissions-Policy). In this state the button is inert and the component cannot be activated. |
| `disabled` | `boolean` | `false` | Yes | Standard disabled semantics: non-focusable, non-activatable, dimmed. |
| `required` | `boolean` | `false` | Yes | Form validation: the component is invalid while `value` is empty. From `ValidateMixin`. |
| `invalid` | `boolean` | `false` | Yes | Standard form invalid state. From `ValidateMixin`. |
| `manualValidation` | `boolean` | `false` | No | Standard `ValidateMixin` escape hatch. |
| `name` | `string` | `""` | Yes | Form field name used when submitting the surrounding form. |

`GeolocationPosition` is the standard DOM type and is not re-defined by
the component.

`GeoLocationError` (TypeScript):

```ts
type GeoLocationErrorCode =
  | 'permission-denied'
  | 'position-unavailable'
  | 'timeout'
  | 'minimum-accuracy-not-met'
  | 'insecure-context'
  | 'unsupported';

interface GeoLocationError {
  /** Stable, named error code. See table above. */
  code: GeoLocationErrorCode;
  /** Human-readable description, taken from the browser when available. */
  message: string;
}
```

| Slot | Description |
|---|---|
| (default) | Button label. Typically short text such as "Use my location". |
| `prefix` | Optional content before the label (e.g. a map-pin icon). |
| `suffix` | Optional content after the label. |

Parts in addition to the ones defined in the shadow DOM:

| Part | Description |
|---|---|
| `button` | The inner button element. |
| `label` | Wrapper around the default slot (text label). |
| `prefix` | Wrapper around the `prefix` slot. |
| `suffix` | Wrapper around the `suffix` slot. |

Events:

| Event | Detail | Description |
|---|---|---|
| `location` | `{ position: GeolocationPosition \| null, error: GeoLocationError \| null }` | Fired once per location attempt, whether success or failure. Exactly one of `position` / `error` is non-null. In `watch` mode, fires again on every subsequent position update. |
| `position-changed` | `{ value: GeolocationPosition \| null }` | Notify event for the `position` property (two-way binding). |
| `error-changed` | `{ value: GeoLocationError \| null }` | Notify event for the `error` property. |
| `state-changed` | `{ value: GeoLocationState }` | Notify event for the `state` property. |
| `value-changed` | `{ value: string }` | Notify event for the serialized `value` (form-submittable string). |
| `permission-changed` | `{ value: GeoPermissionState }` | Notify event for the `permission` property. Also fires when the browser's Permissions API reports a permission change. |
| `invalid-changed` | `{ value: boolean }` | Standard `ValidateMixin` notify event. |
| `unavailable-changed` | `{ value: boolean }` | Notify event for the `unavailable` property (rarely changes after connect, but is reactive). |
| `validated` | `{ valid: boolean }` | Fired from `validate()` (standard `ValidateMixin`). |

Methods:

| Method | Description |
|---|---|
| `requestLocation(): Promise<GeolocationPosition>` | Programmatically trigger a single request. Equivalent to a user click. Resolves with the position or rejects with a `GeoLocationError`. Fires the same `location` event as a user-initiated call. |
| `startWatching(): void` | Equivalent to setting `watch = true`. |
| `stopWatching(): void` | Equivalent to setting `watch = false`. Ends any active watch. |
| `clear(): void` | Resets `position`, `error`, `value`, and `state` (back to `'idle'`) and clears `invalid`. Does not change `watch`, `autoLocate`, or the configuration properties. |
| `validate(): boolean` | Standard `ValidateMixin`. True if `!required \|\| !!value`. |
| `checkValidity(): boolean` | Standard `ValidateMixin`. |

State attributes (reflected on the host):

| Attribute | Description |
|---|---|
| `disabled` | Set when the element is disabled. |
| `focused` | Set when the element is focused. |
| `focus-ring` | Set when the element is keyboard-focused. |
| `active` | Set while the element is being activated (pointer down / Space held). |
| `requesting` | Set while a location request is in flight. |
| `watching` | Set while a continuous watch is active. |
| `has-position` | Set when `position` is non-null. |
| `has-error` | Set when `error` is non-null. |
| `unavailable` | Set when the Geolocation API is not usable in this context. |
| `permission` | One of `granted`, `denied`, `prompt`, `unknown`. Attribute value mirrors the `permission` property. |
| `state` | One of `idle`, `requesting`, `success`, `error`, `unavailable`. Mirrors `state` property. |
| `required` | Set when `required === true`. |
| `invalid` | Set when `invalid === true`. |

CSS custom properties (all follow `<vaadin-button>`'s set, so themes
already written for `<vaadin-button>` style this component correctly
with zero extra work):

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-geo-location-background` | `var(--vaadin-button-background)` | Background color of the button. |
| `--vaadin-geo-location-text-color` | `var(--vaadin-button-text-color)` | Label text color. |
| `--vaadin-geo-location-border-color` | `var(--vaadin-button-border-color)` | Border color. |
| `--vaadin-geo-location-border-width` | `var(--vaadin-button-border-width)` | Border width. |
| `--vaadin-geo-location-border-radius` | `var(--vaadin-button-border-radius)` | Border radius. |
| `--vaadin-geo-location-padding` | `var(--vaadin-button-padding)` | Padding inside the button. |
| `--vaadin-geo-location-gap` | `var(--vaadin-button-gap)` | Gap between prefix / label / suffix. |
| `--vaadin-geo-location-height` | `var(--vaadin-button-height)` | Button height. |
| `--vaadin-geo-location-font-size` | `var(--vaadin-button-font-size)` | Label font size. |
| `--vaadin-geo-location-font-weight` | `var(--vaadin-button-font-weight)` | Label font weight. |

Theme variants:

- `theme="primary"`, `theme="tertiary"`, `theme="error"`, `theme="small"`,
  `theme="large"` — same set `<vaadin-button>` supports, inherited through
  the same variables.

---

### Accessibility

- The host has `role="button"` and a managed `tabindex` (0 when enabled,
  −1 when disabled or unavailable) via `TabindexMixin`.
- `Enter` and `Space` activate the button — exactly like `<vaadin-button>`.
  `ActiveMixin` + `FocusMixin` handle the `active` / `focus-ring` state
  attributes.
- While a request is in flight, the inner button carries
  `aria-busy="true"` so screen readers announce that something is
  happening; the `requesting` state attribute lets CSS show a spinner.
- When `disabled` or `unavailable`, the inner button carries
  `aria-disabled="true"` and the host is removed from the tab order.
- When `required`, the host carries `aria-required="true"`. When
  `invalid`, `aria-invalid="true"`. These are set by the mixin, the same
  way every other Vaadin form field does it.
- Errors are not announced automatically — applications that need screen
  reader feedback on failure can connect the `location` event to a live
  region of their choice. (This keeps the component free of opinionated
  live-region text that would be wrong in many contexts.)

---

### Lifecycle and watch cleanup

- On `connectedCallback()`:
  - Feature-detect `navigator.geolocation`. If missing (or the page is an
    insecure context, or `navigator.permissions.query` reports the
    feature as blocked by Permissions-Policy), set `unavailable = true`
    and `state = 'unavailable'`. The button becomes inert.
  - If `autoLocate` is set AND `permission === 'granted'`, schedule a
    single `requestLocation()` call. Never call it when permission is
    `prompt` or `denied`.
  - If `watch` is set, schedule a watch the first time the component is
    activated (or immediately, if `autoLocate` is also set and permission
    is `granted`).
- On `disconnectedCallback()`:
  - Any in-flight request is abandoned (its eventual resolution is
    ignored).
  - Any active watch is cancelled via `navigator.geolocation.clearWatch`.
  - This is what guarantees UC2's "tracking must stop when the user
    leaves the page" without any code in the application.

---

### Router-agnosticism / out-of-scope features

The component does not:

- Reverse-geocode. Applications that need addresses call their own
  service from the `location` event handler.
- Fetch map tiles or render maps. `<vaadin-map>` (or any third-party map
  component) is the correct tool and can be fed from `position.coords`.
- Remember or persist positions. Each request is stateless; applications
  that want history store positions themselves.
- Read or intercept the application's router or URL — consistent with the
  project-wide router-agnosticism rule.

---

### Coverage check: use cases → API

| Use case | How the API covers it |
|---|---|
| UC1 — Show info relevant to where I am now | Declarative `<vaadin-geo-location>` button; user clicks; single `location` event fires with `detail.position`. |
| UC2 — Continuously follow me | `watch` attribute (or `startWatching()` method). Cleanup on disconnect is automatic. The `watching` state attribute lets the UI reflect tracking state. |
| UC3 — Auto-use location on return | `auto-locate` attribute, gated on `permission === 'granted'`. Never shows an unexpected permission prompt. |
| UC4 — Handle denial / unavailability / timeout / unsupported | `location` event detail carries a named `error`; `unavailable` property + state attribute separates "can never work" from "this attempt failed"; `permission` property lets apps recognise "previously denied" users and show re-enable help. |
| UC5 — Detailed position data | `position` property is the raw `GeolocationPosition`, so accuracy, altitude, altitudeAccuracy, heading, speed, timestamp are all available. `minimumAccuracy` lets the component reject low-confidence readings automatically. |
| UC6 — Precision / freshness / battery trade-offs | `high-accuracy`, `maximum-age`, `timeout` attributes; all per-instance, so two buttons on the same page can legitimately disagree. |
| UC7 — Location as a form field | Form-associated: `name`, `value` (serialized `"lat,lng"`), `required`, `invalid`, `validate()`. `clear()` resets on form reset. `has-position` state attribute enables "Location pinned ✓" styling. `minimumAccuracy` enables "refuse to submit imprecise positions" without custom listener code. |

Every piece of API above is justified by at least one use case:

- Button semantics (default/prefix/suffix slots, part=button/label/prefix/suffix,
  active/focused/focus-ring, disabled, TabindexMixin, ActiveMixin, FocusMixin):
  UC1, UC2, UC3, UC7 — all of them have the user clicking something.
- `location` event with `{ position, error }` detail: UC1, UC2, UC4, UC5.
- `position` property: UC5, UC7 (also UC1 for frameworks that two-way-bind).
- `error` property and `error-changed`: UC4.
- `value`, `name`, `required`, `invalid`, `validate()`, form association:
  UC7.
- `state` property and `state-changed`: UC1 (show a spinner while
  requesting), UC2 (distinguish "actively tracking" from "idle"), UC4
  ("error" state).
- `watch` attribute, `startWatching()`, `stopWatching()`,
  `watching` state attribute, disconnect cleanup: UC2.
- `autoLocate` attribute: UC3.
- `highAccuracy`, `maximumAge`, `timeout` attributes: UC6.
- `minimumAccuracy` attribute: UC5 ("reject bad fixes"), UC7
  ("refuse imprecise submission").
- `unavailable` property and state attribute: UC4 ("hide the control
  when it can never work").
- `permission` property and state attribute: UC3 ("only auto-locate when
  granted"), UC4 ("tell previously-denied users how to re-enable").
- `clear()` method: UC7 (form reset).
- `requestLocation()` method: UC1/UC2 for imperative triggers (same
  semantics as a user click).
- CSS custom properties: cosmetic, inherited from `<vaadin-button>` —
  zero-cost theme consistency.
