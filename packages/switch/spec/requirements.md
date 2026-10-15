# Switch Requirements

## 1. Flip between on and off via pointer or keyboard

- Switch toggles on:
  - A primary-button click on the graphic (track or marker).
  - A click on the label.
  - A Space press while focused.
- The new state shows immediately, without waiting for app acknowledgement.
- Defaults to off when the app supplies no value.

_A user clicks the "Email me when I'm @mentioned" row; the marker slides over and the track changes color at once. Tabbing to the next switch and pressing Space flips it too._

---

## 2. Notify the application only on user-initiated state changes

- User flips (click, label click, Space) emit a change notification carrying the new value.
- Programmatic changes — initial server value, form reset — update the visual state but emit no notification.
- Rationale: apps use the notification to persist settings or trigger view changes; firing it on their own updates would cause ricochet writes.

_A dashboard loads the "Compare with previous period" switch as "on" from saved state; no notification fires, so the app does not re-save. The user then clicks it off; the notification fires and the dashboard re-renders and saves._

---

## 3. Render a clickable label next to the switch

- Optional label rendered by the component, not an external `<label>` linked by the app.
- Clicking the label flips the switch, same as clicking the graphic.
- Inline links in the label are exempt: clicking them follows the link, not the switch.
- Clicking inline non-interactive content (`<strong>`, `<em>`, `<span>`, plain text) flips the switch.
- With no label (e.g. name comes from a grid column header), the graphic still toggles on click and Space.

_A switch "Send anonymous usage data — read our privacy policy" wraps "privacy policy" in an `<a>`. Clicking the label text flips the switch; clicking the link opens the policy without flipping it._

---

## 4. Announce the control as a switch with its on/off state

- Uses the WAI-ARIA `switch` role, not `checkbox`, so screen readers say "switch" and announce on/off, not checked/unchecked.
- Keeps the AT state in sync with the visible state at all times: user flips, programmatic updates, and form resets.

_A blind user navigating "Privacy settings" with NVDA tabs onto a row and hears "switch, Email notifications, off". They press Space; NVDA announces "on". Tabbing to the next row: "switch, Marketing emails, off"._

---

## 5. Prevent interaction when disabled

When disabled, the switch:

- Ignores clicks and keyboard activation.
- Is not reachable by Tab.
- Looks different from the enabled state.

_In a settings dialog, "Daily digest" is disabled because the parent setting "Email me on activity" is off. The user clicks it — nothing happens. Tab skips it._

---

## 6. Reflect a locked state with read-only mode

The switch also supports a read-only mode:

- User cannot change the state.
- Stays focusable and reachable by Tab.
- Screen readers announce the on/off state plus a "read-only" qualifier.
- Still accepts programmatic changes (the app may flip it for a system-driven update).
- If also required, "valid if on, invalid if off" applies as for any required switch. The app must avoid pairing read-only-off with required when it would block the form.

Read-only fits "this setting is on but you can't change it here" — locked by plan, policy, or a parent setting — where disabled would hide it from screen-reader users navigating by Tab.

_On the Free plan, the workspace owner opens "Compliance settings" and Tabs to the "Audit log retention (90 days)" switch; the screen reader announces "switch, Audit log retention 90 days, on, read-only". They press Space — nothing changes._

---

## 7. Mark the switch invalid when required and off

When the app marks the switch required:

- Off is invalid; on is valid.
- A required indicator shows next to the label and is announced to AT.
- An untouched required switch is not shown invalid until the user submits or the app triggers validation, so the user sees no error before acting.

_A booking form has a switch "I confirm the trip details are correct" with a required indicator. The user fills in everything else and clicks Submit while the switch is off; submission is blocked and the switch turns invalid with an error message. Flipping it on clears the invalid state at once._

---

## 8. Display a helper text describing the setting

- Optional helper text rendered alongside the switch, usually below the label and graphic.
- Explains what the setting does, what its on/off positions mean, or why it is locked.
- Associated with the switch for AT, so screen-reader users hear it without leaving the control.

_The "Audit log retention" switch has helper text "Included on the Business plan." A blind user hears "switch, Audit log retention 90 days, on, read-only, Included on the Business plan." A sighted user reads the same text under the switch._

---

## 9. Display an error message when invalid

When invalid (typically required-and-off, or marked invalid by the app after a server rejection):

- Shows an error message and marks the invalid state visually.
- The app can supply custom error text for both the required-but-off case and app-determined invalid states (e.g. a server "Two-factor authentication can't be disabled on the Compliance plan").
- The error message is associated with the switch for AT.
- The error clears cleanly when the switch becomes valid again.

_After a failed submit, the "I accept the booking terms" switch shows the error "You must accept the terms to continue" in a danger color. The user flips it on; the error disappears and the helper text (if any) reappears._

---

## 10. Support an optional tooltip with extra context

- Optional tooltip that opens on hover or on keyboard focus.
- Supplements, does not replace, the label and helper text.
- Good for short hints that don't warrant a permanent helper line, e.g. dense settings panels or per-row tables where vertical space is tight.

_In a per-row table of webhooks, each row has a switch "Active" with no helper text. Hovering shows a tooltip with the webhook's last delivery status; tabbing to the switch shows the same tooltip._

---

## Discussion

**Q: Why is native HTML form participation not enumerated as a separate requirement?**

Vaadin's validation and data-binding mechanism is Flow's Binder, not native `<form>` submit or `<form>.reset()`. Switch works with Binder like other Vaadin fields — carrying a value, exposing required/invalid state, integrating with helper/error text — so a separate requirement would only restate shared field behavior. Native `<form>` reset is not a primary case.

**Q: Which variants should this requirements document cover?**

Both web component and Flow. All requirements are universal; none is tagged Flow- or web-only because each behaves identically through both APIs.

**Q: Does the switch show an on/off icon, or only track color and marker position?**

By default it stays quiet: on/off is shown through marker position and track color only, consistent with Vaadin's visual style. An opt-in `icon` theme variant additionally renders a checkmark inside the marker when on and a cross when off, for cases that need a stronger at-a-glance affordance.

**Q: Should the Switch expose a loading / pending state (e.g. while an async toggle persists to the server)?**

Out of scope. Apps needing pending feedback on a server-bound toggle can use existing primitives — disable the switch while the request runs, or show a nearby spinner — but the Switch does not own a loading state. This matches Vaadin Checkbox and avoids overlapping with the pending-state vocabulary Button and others may add later.

**Q: Should drag / swipe gesture interaction be in scope?**

Out of scope. The Switch toggles via click, label click, and Space only — no marker drag. This matches the team consensus in `vaadin/web-components#893` ("not in v1, see if needed") and keeps the interaction consistent with Vaadin Checkbox. Adding drag later is non-breaking if a real need emerges.
