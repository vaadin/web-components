## ViewLayout Web component design

## Overview

Create `vaadin-view-layout` minimal implementation in `packages/view-layout`

### Public API (HTML)

```html
<!-- Simple case — string title via headerTitle property -->
<vaadin-view-layout header-title="Bookings">
  <vaadin-grid></vaadin-grid>
</vaadin-view-layout>

<!-- Full slot composition -->
<vaadin-view-layout>
  <vaadin-button slot="header-prefix" theme="tertiary icon" aria-label="Back">…</vaadin-button>
  <h2 slot="title">Booking Details</h2>
  <vaadin-button slot="header-suffix" theme="tertiary">Edit</vaadin-button>

  <vaadin-tabsheet></vaadin-tabsheet>

  <vaadin-horizontal-layout slot="footer" theme="spacing">
    <vaadin-button>Cancel</vaadin-button>
    <vaadin-button theme="primary">Save</vaadin-button>
  </vaadin-horizontal-layout>
</vaadin-view-layout>

<!-- Header override replaces the title sub-area; prefix/suffix still flank -->
<vaadin-view-layout>
  <vaadin-button slot="header-prefix">…</vaadin-button>
  <div slot="header">…</div>     <!-- shadow CSS hides slot="title" when has-header -->
  <vaadin-button slot="header-suffix">…</vaadin-button>
  …
</vaadin-view-layout>
```

### Shadow DOM template + CSS

```html
<style>
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  /* Header wrapper — exposed as ::part(header). Theme rules in Lumo/Aura
     target this part alongside vaadin-dialog::part(header) etc. */
  [part='header'] {
    display: flex;
    align-items: center;
    gap: var(--vaadin-gap-m, 0.5rem);
  }

  /* Inside the header wrapper, the four named slots are flex items.
     title and header share the "main" flex position; CSS hides title when
     a header override is supplied (see :host([has-header]) rule below). */
  [part='header'] > slot[name='title'],
  [part='header'] > slot[name='header'] {
    flex: 1;
    min-width: 0;
  }

  /* Content wrapper — exposed as ::part(content). Fills the remaining
     vertical space in the host's flex column. */
  [part='content'] {
    flex: 1;
    min-height: 0;
  }

  /* Footer wrapper — exposed as ::part(footer). Theme rules match Dialog. */
  [part='footer'] {
    display: flex;
    align-items: center;
    gap: var(--vaadin-gap-m, 0.5rem);
  }

  /* Header override hides the auto/user title element. */
  :host([has-header]) ::slotted([slot='title']) { display: none; }
</style>

<div part="header">
  <slot name="header-prefix"></slot>
  <slot name="title"></slot>
  <slot name="header"></slot>
  <slot name="header-suffix"></slot>
</div>

<vaadin-scroller part="content">
  <slot></slot>
</vaadin-scroller>

<div part="footer">
  <slot name="footer"></slot>
</div>
```

### Properties + reflected attributes

| Property | Type | Reflects to attribute | Behavior |
|---|---|---|---|
| `headerTitle` | `string` | `header-title` | When set, manages an internal `<h{titleHeadingLevel} slot='title'>` element appended to the host's light-DOM children. Removed when null/empty. Mirrors `vaadin-dialog`'s `headerTitle` pattern (`vaadin-dialog-overlay-mixin.js`). |
| `titleHeadingLevel` | `number` (1–6) | `title-heading-level` | Tag name of the auto-rendered title element. Default 2. Re-renders the title element when changed (only while `headerTitle` is set). |

| Reflected attribute (set by the component) | When set |
|---|---|
| `has-title` | A `[slot='title']` light-DOM child exists (auto-rendered from `headerTitle` or supplied by consumer). |
| `has-header` | A `[slot='header']` light-DOM child exists. |
| `has-header-prefix` | A `[slot='header-prefix']` light-DOM child exists. |
| `has-header-suffix` | A `[slot='header-suffix']` light-DOM child exists. |
| `has-footer` | A `[slot='footer']` light-DOM child exists. |

Slot detection: a `slotchange` listener on each named `<slot>` element updates the corresponding `has-X` attribute on the host. For the default slot, no attribute is reflected (body presence is implicit).

### Parts

| `::part(…)` | Element | Shared with |
|---|---|---|
| `header` | `<div part="header">` wrapping the four named header slots | `vaadin-dialog::part(header)`, `vaadin-confirm-dialog::part(header)`, CRUD editor dialog's header part |
| `content` | the internal `<vaadin-scroller part="content">` wrapping the default slot | `vaadin-dialog::part(content)` (when Dialog uses a scroller) |
| `footer` | `<div part="footer">` wrapping the footer slot | `vaadin-dialog::part(footer)`, `vaadin-confirm-dialog::part(footer)`, CRUD editor dialog's footer part |

The three parts match the framed-surface vocabulary already used by Dialog / ConfirmDialog / CRUD editor dialog. This is the basis for shared theme rules — see §3.6.

### `headerTitle` ↔ user-supplied `slot="title"` precedence

If both `headerTitle="X"` is set *and* a consumer-supplied `<h2 slot="title">Y</h2>` is appended, the consumer's element wins. The auto-rendered element is detached when the slotchange listener detects a user-supplied `slot="title"` element. Use `TitleController` - see https://github.com/vaadin/web-components/pull/12003
