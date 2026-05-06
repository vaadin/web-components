# Toggle Switch Problem Statement

## Problem

Business web apps need a binary on/off control whose visual metaphor — a sliding track with a thumb — communicates that it represents the **current state** of a setting, mode, or feature, not a selection to be reviewed and saved. The control should read at a glance as "is this on?" so that users instantly recognize whether a feature is active.

The most common usage is **immediate-effect**: the moment the user flips the switch, the change is persisted or applied to the screen. The component must also slot cleanly into Vaadin's standard field apparatus (label, helper text, error message, required/invalid, disabled/read-only, tooltip) so that the second, less common usage — sitting in a save-on-submit form alongside text fields and other inputs — works without a different control or a different mental model. A single Toggle Switch must cover both modes; the application decides which mode applies in a given context.

A separate Toggle Switch component is needed (alongside Checkbox) because Vaadin business apps regularly expose settings panels, feature flags, mode toggles, and per-row enable/disable controls where the on/off-state semantics fit poorly with checkbox's "select this option" reading.

## Target Users

End users of business web applications who interact with the Toggle Switch in:

- **Personal preference panels** (notification preferences, theme, autosave, accessibility options).
- **Account, workspace, and tenant settings** (default language, security policies, integrations).
- **Per-feature and per-flag admin UIs** (turning capabilities on or off for the workspace, role, or environment).
- **Dashboards and analytical views** (comparing periods, toggling overlays, switching presentational modes).
- **Per-row enable/disable in tables and lists** (activating a user account, publishing an article, enabling a webhook).

Developers building these applications need a switch that supports both immediate-effect usage (the most common) and the occasional case where a switch sits in a save-on-submit form alongside text fields and other inputs, without two different components and two mental models.

## Differentiation

- **Checkbox.** Checkbox marks a selection — "I want this option", "I agree to these terms", "include this row". It is the right control for picking items in a list, multi-selection in forms, and consent-style binary inputs. Toggle Switch represents the **on/off state of a setting** and is the right control for settings that are most naturally read as "is this on?". Both can technically appear in forms; the choice between them is semantic, not structural. Out-of-scope here: indeterminate state — switches do not have one; if a setting has a third "mixed" state (e.g., across multiple selected rows), use a Checkbox.

- **Radio Button Group.** Radio buttons select one option from two or more mutually exclusive choices, and the choices are typically peer values with no implicit default off-state (e.g., "Small / Medium / Large"). Toggle Switch handles the special two-value case where one value is meaningfully the "off" / disabled / absent state of a feature. If a designer is choosing between a Toggle Switch and a 2-option radio group, prefer the Toggle Switch when one of the values is "off" and prefer the radio group when both values are equally meaningful labels (e.g., "Imperial / Metric").

- **Button (and Toggle Button).** A button triggers an action whose effect happens once when invoked (Send, Delete, Refresh). A toggle button — sometimes seen in toolbars (Bold, Italic, grid/list view) — reflects a binary mode of an editor or tool palette and lives next to other tool buttons. Toggle Switch is for **persistent settings and feature state** rather than tool modes; if the control belongs in a toolbar next to other action icons, it is a toggle button, not a switch.

- **Select / Combo Box with two options.** A two-option dropdown adds an interaction step (open menu, then choose) and hides the off state until opened. Toggle Switch shows both states at a glance and changes state in a single tap or click; prefer Toggle Switch for binary settings unless the two values need long, descriptive labels that don't fit a switch.

- **Confirmation flows for destructive or expensive toggles.** Out of scope. When flipping the setting is destructive ("Disable two-factor authentication") or expensive ("Pause billing"), the application combines a Toggle Switch with a Confirm Dialog or undo affordance at the application level. The Toggle Switch component itself does not own destructive-action confirmation.

- **Sliders, multi-step toggles, segmented controls.** Out of scope. Toggle Switch is strictly two-state; ranges and three-or-more discrete options are handled by Slider, Radio Button Group, or Select.

## Use Cases

A user wants to flip a single binary setting and have the change take effect immediately, without finding a Save button. The switch sits in a settings panel where each row's flip is independently persisted; the same pattern applies inside data tables where each row carries its own switch (e.g., enable/disable per item).

_In a project-management app, a team member opens "Notification preferences" and turns on **Email me when I'm @mentioned**. As soon as they flip the switch the preference is persisted to their profile — there is no Save button on the panel — and the next time someone @-mentions them, the email arrives. They flip a second switch, **Daily digest**, off; that change is also persisted instantly. They close the dialog without further action._

---

A user wants to set a binary preference inside a form that is committed all-at-once with a Save / Submit button, where the switch participates in the same dirty-state, validation, and cancel/revert flow as the form's other fields. The switch's value should not apply to the system until the form is saved; if the user cancels, the switch reverts. The switch should look and align with the surrounding fields and support helper text, error messages, and required indicators consistently with them.

_In an HR admin tool, an admin opens an **Edit user** dialog. The dialog has fields for "Job title", "Department", "Manager" — and, alongside them, a switch labeled **Two-factor authentication required**. The admin flips the switch on, edits the job title, and clicks Save. The form validates: if validation fails, the switch shows an invalid state with an error message ("Required", or a server-returned message). If validation passes, all changes are applied together. If the admin clicks Cancel instead, the switch reverts to its original state along with the rest of the form._

---

A user wants to flip between two presentational modes of a screen and see the layout or data update immediately, without applying any backend change.

_A financial reporting dashboard has a switch labeled **Compare with previous period** in its toolbar. With the switch off, every chart on the page shows the current quarter only. The user flips the switch on and each chart re-renders to overlay the previous quarter as a dotted line, with delta percentages added to the KPI tiles. The user flips the switch back off and the previous-period overlay disappears. No data is sent to the server; the switch state lives only in the dashboard's view._

---

A user wants to see the current on/off state of a setting they cannot change themselves, in a way that is visually distinguishable from a normal interactive switch and that explains why the setting is locked. The switch must remain focusable and announced to screen readers so the locked state is reachable by keyboard and assistive tech.

_In a SaaS app, the workspace owner is on the Free plan and opens **Compliance settings**. They see a switch labeled **Audit log retention (90 days)** in the on position, marked read-only, with helper text "Included on the Business plan." The switch announces its state to a screen reader and is reachable by keyboard; clicking or pressing space does not change it._

## Discussion

**Q: Should the Toggle Switch's scope include being used inside a form that requires a Save/Submit button (alongside other fields), or be limited to instant-effect settings only?**

Both. The Toggle Switch must work as an immediate-apply settings control AND as a form field that participates in deferred submit, validation, helper/error text, and cancel/revert. Vaadin's prototype already exposes the field-mixin apparatus for this; the problem statement reflects that broader scope. (Classical UX guidance recommending switches always apply immediately is still acknowledged in Differentiation, but is not used to exclude the form-field scenario.)

**Q: Is per-row switching inside data tables / grids (each row has its own switch) a primary use case worth calling out, or should it be treated as just an instance of the core toggle scenario?**

Treat it as part of the core scenario. The interaction is the same as toggling a single setting; per-row context does not change the user's needs or constraints, so it does not need its own use case. The core use case mentions the table pattern in passing.
