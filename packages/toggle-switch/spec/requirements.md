# Toggle Switch Requirements

## 1. Flip between on and off via pointer or keyboard

The Toggle Switch must flip between the on and off states when the user activates it. Activation must happen on a single primary-button click anywhere on the switch graphic (the track region and the thumb) or on its associated label, or on a Space-key press while the switch has keyboard focus. The newly entered state must be visible immediately — without waiting for any application acknowledgement — so the user knows the activation was accepted. A freshly rendered Toggle Switch with no value supplied by the application defaults to the off state.

_A user opens "Notification preferences" and clicks the row labeled "Email me when I'm @mentioned"; the thumb slides to the on side and the track switches to the on color the moment the click registers. Tabbing to the next switch and pressing Space flips that one too. There is no delay between the click and the visible state change._

---

## 2. Notify the application only on user-initiated state changes

When the user flips the switch (by click, label click, or Space), the component must emit a state-change notification carrying the new value. When the application sets the state programmatically — for example, hydrating from a server response or restoring a form's pristine state — the component must update its visual state but must NOT emit the user-change notification. Applications use this notification to persist immediate-effect settings or to trigger view-mode changes; receiving it for their own programmatic updates would cause ricochet writes.

_A dashboard hydrates the "Compare with previous period" switch from a saved view-state object on page load: the switch displays "on" but the app does not re-save the view, because no change notification fires. A moment later the user clicks the switch off; the change notification fires, the dashboard re-renders without the overlay, and the new view-state is saved._

---

## 3. Render a clickable label next to the switch

The Toggle Switch must support an optional label rendered as part of the component (not as an external `<label>` the application has to wire up). Clicking the label region must flip the switch with the same effect as clicking the switch graphic. The label's content may include an inline anchor (`<a>`); clicks landing on the anchor must not flip the switch — they activate the link as usual. Clicks on any other content within the label — plain text or formatting elements like `<strong>`, `<em>`, or `<span>` — do flip the switch. When no label is provided (e.g. switches that take their accessible name from a surrounding column header in a data grid) the switch graphic still toggles on click and on Space.

_A switch labeled "Send anonymous usage data — read our privacy policy" places the words "privacy policy" inside an `<a>` element. Clicking the surrounding label text flips the switch; clicking the privacy-policy link opens the policy page without changing the switch state. In a separate webhooks table, each row has a switch with no visible label — clicking the switch graphic in row 3 still flips that row's switch._

---

## 4. Announce the control as a switch with its on/off state

The Toggle Switch must expose itself to assistive technology using the WAI-ARIA switch role rather than the generic checkbox role, so that screen readers describe it as a switch and announce its state as on/off rather than checked/unchecked. The component must keep the AT-visible state in sync with the visible state at all times — when the user flips the switch, when the application updates the value programmatically, and when the form is reset — so screen-reader users never observe a stale state.

_A blind user navigating "Privacy settings" with NVDA tabs onto a row and hears "switch, Email notifications, off". They press Space; NVDA announces "on". They tab to the next row, "switch, Marketing emails, off"; they leave that one alone and tab off the panel._

---

## 5. Refuse interaction when disabled

In the disabled state, the Toggle Switch must not respond to clicks or keyboard activation, must not be reachable by Tab, and must be visually distinguishable from the enabled state. Programmatic state changes are still allowed (the application may flip a disabled switch from off to on to reflect a system-driven update); these are non-user-initiated and do not emit the user-change notification described in requirement 2. A disabled switch does not contribute to native form submission regardless of its on/off state.

_In a settings dialog, the switch "Daily digest" is shown disabled because the parent setting "Email me on activity" is off. The user clicks the disabled switch — nothing happens, no visual press feedback, no state change. They tab through the dialog and Tab skips the disabled switch entirely._

---

## 6. Reflect a locked state with read-only mode

In addition to disabled, the Toggle Switch must support a read-only mode where the user cannot change the state, but the switch remains focusable, reachable by Tab, and announced to assistive technology with its current on/off state and a "read-only" qualifier. Read-only is the right mode for "this setting is on but you can't change it here" — for example, locked by plan, by policy, or by an upstream parent setting — where disabled would hide the setting from screen-reader users navigating by Tab. Unlike a disabled switch, a read-only switch still contributes its current value to native form submission, since its value is authoritative and merely non-editable in this view. A read-only switch that is also marked required is treated as "valid if on, invalid if off" the same as any other required switch — the application is responsible for not pairing read-only-off with required when it would block the form.

_The workspace owner is on the Free plan and opens "Compliance settings". They Tab to the "Audit log retention (90 days)" switch; the screen reader announces "switch, Audit log retention 90 days, on, read-only". They press Space — nothing changes; the switch remains on. They Tab forward to the helper text and on to the next setting._

---

## 7. Mark the switch invalid when required and off

When the application marks the Toggle Switch required, the component must consider the off state invalid for form-validation purposes and the on state valid. The required state must be communicated visually with a required indicator next to the label and announced to assistive technology so that screen-reader users know the switch must be turned on before submit. A required Toggle Switch that has not yet been touched must not display as invalid until the user attempts to submit (or the application explicitly triggers validation), so the user does not see a red error before they have done anything wrong.

_A booking-confirmation form has a switch labeled "I confirm the trip details are correct" with a required indicator. The user fills in everything else and clicks Submit while the switch is off; the form prevents submission and the switch turns invalid with an error message. The user flips the switch on; the invalid state clears immediately and they can submit._

---

## 8. Display a helper text describing the setting

The Toggle Switch must support an optional helper text rendered alongside the switch (typically below the label and switch graphic), used to explain what the setting does, what its on/off positions mean, or why it is locked. The helper text must be associated with the switch for assistive technology so a screen-reader user gets the explanation without leaving the control.

_The "Audit log retention" switch in a Compliance panel has helper text "Included on the Business plan." A blind user lands on the switch and hears "switch, Audit log retention 90 days, on, read-only, Included on the Business plan." A sighted user reads the same explanation just under the switch._

---

## 9. Display an error message when invalid

When the Toggle Switch is invalid (typically because it is required and off, or marked invalid by the application after a server-side rejection), it must display an error message and visually indicate the invalid state. The application must be able to supply a custom error-message text — both for the required-but-off case and for application-determined invalid states (e.g. a server-returned message such as "Two-factor authentication can't be disabled while the account is on the Compliance plan") — instead of being limited to a fixed built-in message. The error message must be associated with the switch for assistive technology and removed cleanly when the switch becomes valid again.

_After a failed form submit, the "I accept the booking terms" switch shows the error "You must accept the terms to continue" in a danger color. The user flips the switch on; the error message disappears and the helper text (if any was set) reappears._

---

## 10. Support an optional tooltip with extra context

The Toggle Switch must accept an optional tooltip that opens on hover or keyboard focus and supplements (does not replace) the label and helper text. Tooltips are useful for short hints that don't warrant a permanent helper-text line — typically in dense settings panels or in per-row table contexts where vertical space is at a premium.

_In a per-row table of webhooks, each row has a switch labeled "Active" with no helper text. Hovering a switch shows a tooltip with the webhook's last delivery status; tabbing to the switch shows the same tooltip._

---

## 11. Participate in native HTML form submission

The Toggle Switch must accept a name and an associated submission value (defaulting to the conventional binary-form-control default when none is supplied). When the switch is on, the form submission carries the switch's name with its submission value; when the switch is off, the switch contributes nothing to the submission. The same applies through `<form>.reset()` and other native form lifecycle events: the switch must restore its initial value and update its visible state without emitting the user-change notification described in requirement 2. This lets the Toggle Switch drop into existing server-side form handlers — and into Vaadin's Flow data-binding — without any framework-side adapter code.

_A "Save user" form posts to a Flow endpoint. The form contains text fields and a switch named "twoFactor" with submission value "required". When the admin submits with the switch on, the request body includes `twoFactor=required`; when they submit with it off, the field is absent from the request. If the admin clicks Cancel and the form is reset, the switch flips back to its initial position with no change notification and the server-side `User.twoFactorRequired` boolean is unchanged._

---

## Discussion

**Q: Which variants should this requirements document cover?**

Both web component and Flow. All requirements are universal unless a behavior genuinely only exists in one variant. None of the requirements above are tagged Flow- or web-only because all of them describe behavior that is observable identically through both APIs.

**Q: Should on-track state indicators inside the switch (visible "ON" / "OFF" text or check / X icons inside the track) be in scope?**

Out of scope. The on/off state is communicated by track color and thumb position only — consistent with the existing Vaadin prototype and with Vaadin's broader visual style (Checkbox does not place text or icons inside its tick area either). Material 3, Ant, and Carbon offer in-track icons; we deliberately do not, to keep the visual quiet and theme-token-driven.

**Q: Should the Toggle Switch expose a loading / pending state (e.g. while an async toggle persists to the server)?**

Out of scope. Applications that need to show pending feedback on a server-bound toggle can use existing primitives — disabling the switch while the request is in flight, or surfacing a neighbouring spinner — but the Toggle Switch itself does not own a loading state. This matches Vaadin Checkbox, which has no equivalent, and avoids overlapping with the pending-state vocabulary that Button and other components may introduce later.

**Q: Should drag / swipe gesture interaction be in scope?**

Out of scope. The Toggle Switch toggles via single click, label click, and Space-key press only — no thumb-drag interaction. This matches the team consensus from `vaadin/web-components#893` ("not in v1, see if needed") and keeps the interaction model consistent with Vaadin Checkbox. Adding drag support later is non-breaking if a real need emerges.

**Q: Why was button-in-label support removed from requirement 3?**

Placing a `<button>` inside the label slot is not a supported use case for any Vaadin field. Narrowing the click-pass-through rule to anchors only keeps the toggle switch behavior identical to the inherited `CheckboxMixin` rule (which only checks for `<a>`) and avoids inventing a switch-only divergence to support a pattern no application uses.
