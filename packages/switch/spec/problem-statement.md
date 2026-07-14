# Switch Problem Statement

## Problem

Business web apps need a simple on/off control.

- Anatomy: sliding track with a marker and a text label.
- Visual meaning: to indicate "is this on?" for a single setting.

The setting controlled by the switch can be applied in 2 ways:

1. Instant: toggling the switch takes effect immediately.
2. Save on submit: switch used in a form, together with other fields and a Save button.

Switch must support both modes. The app decides which mode to use.

## Why a separate component from Checkbox

Checkbox and Switch mean different things:

- Checkbox says "select this option" — pick an item, agree to terms, include a row.
- Switch says "this setting is on or off" — a feature, mode, or state.

Using a Checkbox for "on/off" settings is sub-optimal.

## Target Users

End users expect to use a switch for:

- Personal preference panels (notifications, theme, autosave).
- Account and workspace settings (language, policies, integrations).
- Admin UIs for features and flags (turn a capability on or off).
- Per-row enable/disable in tables (activate a user, publish an article).

## Differentiation

- **Checkbox.** Marks a selection ("I want this", "include this row"). Switch shows the on/off state of a setting. Switch has no indeterminate state; if a setting has a third "mixed" state (e.g. across many selected rows), use a Checkbox.

- **Radio Button Group.** Picks one of two or more equal options ("Small / Medium / Large"). Use a Switch when one value is clearly the "off" state of a feature. Use a 2-option radio group when both values are equal labels ("Imperial / Metric").

- **Toggle Button.** A toggle button reflects a tool mode in a toolbar (Bold, Italic, grid/list view). Switch is for persistent settings and feature state, not tool modes. If it belongs in a toolbar next to action icons, it is a toggle button.

- **Select / Combo Box with two options.** A dropdown hides the off state and needs an extra click to open. Switch shows both states at once and toggles in one click. Prefer a dropdown only when the two values need long labels.

- **Sliders, multi-step toggles.** Out of scope. Switch is strictly two-state. Ranges and three-or-more options use Slider, Radio Button Group, or Select.

## Use Cases

**Flip one setting and have it apply immediately.**

_In a project app, a user opens "Notification preferences" and turns on "Email me when I'm @mentioned". The preference saves at once — there is no Save button. They turn "Daily digest" off; that saves too. The same pattern works per-row inside data tables._

---

**Set a switch inside a form that saves all at once.**

- The switch can be marked as dirty, validated and reset together with a form.
- Its value applies only when the form is saved; clicking Cancel reverts it.
- It supports required indicator, helper text, and error message, same as other fields.

_In an HR tool, an admin opens "Edit user". Next to "Job title" and "Department" is a switch "Two-factor authentication required". The admin flips it on, edits the title, and clicks Save; all changes apply together. If the switch is required and left off, submit fails and it shows an error. Cancel reverts it._

---

**Flip between two view modes and see the screen update, with no backend change.**

_A reporting dashboard has a switch "Compare with previous period" in its toolbar. Off: charts show this quarter only. On: each chart overlays last quarter and the KPI tiles gain deltas. Off again: the overlay disappears. Nothing is sent to the server._

---

**See a setting you cannot change, and understand why.**

- The switch looks different from a normal one.
- It stays focusable and announced, so keyboard and screen-reader users can reach it.

_On the Free plan, a workspace owner opens "Compliance settings" and sees "Audit log retention (90 days)" on and read-only, with helper text "Included on the Business plan." A screen reader announces its state; clicking or pressing Space does nothing._

## Discussion

**Q: Should the Switch's scope include being used inside a form that requires a Save/Submit button (alongside other fields), or be limited to instant-effect settings only?**

Both. The Switch works as an immediate-apply settings control AND as a form field with deferred submit, validation, helper/error text, and cancel/revert. Classic UX guidance says switches should always apply immediately, but that does not exclude the form case.

**Q: Is per-row switching inside data tables / grids (each row has its own switch) a primary use case worth calling out, or should it be treated as just an instance of the core toggle scenario?**

Treat it as part of the core scenario. Per-row toggling is the same as toggling a single setting, so it needs no separate use case. The core use case mentions the table pattern in passing.
