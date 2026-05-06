# Switch Requirements

## 1. Flip between on and off via pointer or keyboard

- Switch toggles on:
  - A single primary-button click on the switch graphic (track or thumb).
  - A click on the associated label.
  - A Space-key press while the switch has keyboard focus.
- The new state is visible immediately, without waiting for any application acknowledgement.
- Defaults to off when the application supplies no value.

_A user opens "Notification preferences" and clicks the row labeled "Email me when I'm @mentioned"; the thumb slides to the on side and the track switches to the on color the moment the click registers. Tabbing to the next switch and pressing Space flips that one too._

---

## 2. Notify the application only on user-initiated state changes

- User-initiated flips (click, label click, Space) emit a state-change notification carrying the new value.
- Programmatic state changes — e.g. an initial value set by the server, restoring a form's pristine state — update the visual state but do NOT emit the notification.
- Rationale: applications use this notification to persist immediate-effect settings or trigger view-mode changes; firing it for their own programmatic updates would cause ricochet writes.

_A dashboard initializes the "Compare with previous period" switch from a saved view-state on page load: the switch displays "on" but the app does not re-save the view, because no change notification fires. A moment later the user clicks the switch off; the notification fires, the dashboard re-renders, and the new view-state is saved._

---

## 3. Render a clickable label next to the switch

- Supports an optional label rendered as part of the component, not an external `<label>` the application has to wire up.
- Clicking the label region flips the switch, with the same effect as clicking the switch graphic.
- Inline links inside the label are exempt: clicks on them activate the link and do not flip the switch.
- Clicks on inline non-interactive content (`<strong>`, `<em>`, `<span>`, plain text) do flip the switch.
- When no label is supplied (e.g. switches that take their accessible name from a column header in a data grid), the switch graphic still toggles on click and on Space.

_A switch labeled "Send anonymous usage data — read our privacy policy" places the words "privacy policy" inside an `<a>` element. Clicking the surrounding label text flips the switch; clicking the privacy-policy link opens the policy page without changing the switch state._

---

## 4. Announce the control as a switch with its on/off state

- Exposes the WAI-ARIA `switch` role rather than `checkbox`, so screen readers describe it as a switch and announce on/off rather than checked/unchecked.
- Keeps the AT-visible state in sync with the visible state at all times: user flips, programmatic updates, and form resets.

_A blind user navigating "Privacy settings" with NVDA tabs onto a row and hears "switch, Email notifications, off". They press Space; NVDA announces "on". They tab to the next row and hear "switch, Marketing emails, off"._

---

## 5. Prevent interaction when disabled

When disabled, the switch:

- Does not respond to clicks or keyboard activation.
- Is not reachable by Tab.
- Is visually distinguishable from the enabled state.
- Still accepts programmatic state changes (the application may flip a disabled switch to reflect a system-driven update); these emit no user-change notification.

_In a settings dialog, the switch "Daily digest" is shown disabled because the parent setting "Email me on activity" is off. The user clicks it — nothing happens. Tab skips it entirely._

---

## 6. Reflect a locked state with read-only mode

In addition to disabled, the switch supports a read-only mode:

- User cannot change the state.
- Switch remains focusable and reachable by Tab.
- Screen readers announce the current on/off state plus a "read-only" qualifier.
- When also marked required: "valid if on, invalid if off" applies as for any required switch. The application is responsible for not pairing read-only-off with required when it would block the form.

Read-only is the right mode for "this setting is on but you can't change it here" — locked by plan, policy, or an upstream parent setting — where disabled would hide the setting from screen-reader users navigating by Tab.

_The workspace owner is on the Free plan and opens "Compliance settings". They Tab to the "Audit log retention (90 days)" switch; the screen reader announces "switch, Audit log retention 90 days, on, read-only". They press Space — nothing changes._

---

## 7. Mark the switch invalid when required and off

When the application marks the switch required:

- The off state is invalid for form-validation purposes; on is valid.
- A required indicator is shown next to the label and announced to AT.
- An untouched required switch is not displayed as invalid until the user attempts to submit, or the application explicitly triggers validation, so the user does not see an error before doing anything wrong.

_A booking-confirmation form has a switch "I confirm the trip details are correct" with a required indicator. The user fills in everything else and clicks Submit while the switch is off; submission is prevented and the switch turns invalid with an error message. Flipping the switch on clears the invalid state immediately._

---

## 8. Display a helper text describing the setting

- Supports an optional helper text rendered alongside the switch, typically below the label and graphic.
- Used to explain what the setting does, what its on/off positions mean, or why it is locked.
- Associated with the switch for AT, so screen-reader users hear the explanation without leaving the control.

_The "Audit log retention" switch has helper text "Included on the Business plan." A blind user hears "switch, Audit log retention 90 days, on, read-only, Included on the Business plan." A sighted user reads the same explanation under the switch._

---

## 9. Display an error message when invalid

When invalid (typically required-and-off, or marked invalid by the application after a server rejection):

- Displays an error message and visually indicates the invalid state.
- The application can supply custom error-message text for both the required-but-off case and application-determined invalid states (e.g. a server-returned "Two-factor authentication can't be disabled while the account is on the Compliance plan").
- The error message is associated with the switch for AT.
- The error is removed cleanly when the switch becomes valid again.

_After a failed submit, the "I accept the booking terms" switch shows the error "You must accept the terms to continue" in a danger color. The user flips the switch on; the error disappears and the helper text (if any was set) reappears._

---

## 10. Support an optional tooltip with extra context

- Optional tooltip that opens on hover or on keyboard focus.
- Supplements — does not replace — the label and helper text.
- Useful for short hints that do not warrant a permanent helper-text line, typically in dense settings panels or per-row table contexts where vertical space is at a premium.

_In a per-row table of webhooks, each row has a switch labeled "Active" with no helper text. Hovering a switch shows a tooltip with the webhook's last delivery status; tabbing to the switch shows the same tooltip._

---

## Discussion

**Q: Why is native HTML form participation not enumerated as a separate requirement?**

The primary validation and data-binding mechanism for Vaadin components is Flow's Binder, not native `<form>` submission or `<form>.reset()`. Switch participates in Binder the same way other Vaadin field components do — carrying a value, exposing required/invalid state, and integrating with helper/error text — so a dedicated requirement here would only restate shared field-mixin behavior. Native `<form>` reset is not a primary supported case.

**Q: Which variants should this requirements document cover?**

Both web component and Flow. All requirements are universal unless a behavior genuinely only exists in one variant. None of the requirements above are tagged Flow- or web-only because all of them describe behavior that is observable identically through both APIs.

**Q: Should on-track state indicators inside the switch (visible "ON" / "OFF" text or check / X icons inside the track) be in scope?**

Out of scope. The on/off state is communicated by track color and thumb position only — consistent with the existing Vaadin prototype and with Vaadin's broader visual style (Checkbox does not place text or icons inside its tick area either). Material 3, Ant, and Carbon offer in-track icons; we deliberately do not, to keep the visual quiet and theme-token-driven.

**Q: Should the Switch expose a loading / pending state (e.g. while an async toggle persists to the server)?**

Out of scope. Applications that need to show pending feedback on a server-bound toggle can use existing primitives — disabling the switch while the request is in flight, or surfacing a neighbouring spinner — but the Switch itself does not own a loading state. This matches Vaadin Checkbox, which has no equivalent, and avoids overlapping with the pending-state vocabulary that Button and other components may introduce later.

**Q: Should drag / swipe gesture interaction be in scope?**

Out of scope. The Switch toggles via single click, label click, and Space-key press only — no thumb-drag interaction. This matches the team consensus from `vaadin/web-components#893` ("not in v1, see if needed") and keeps the interaction model consistent with Vaadin Checkbox. Adding drag support later is non-breaking if a real need emerges.
