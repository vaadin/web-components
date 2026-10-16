# Stepper Requirements

## 1. Displaying an ordered sequence of steps

The stepper displays a sequence of steps in order. Each step shows a label and an indicator containing its position number (1, 2, 3 …). Steps are connected by a line that conveys the sequence.

_Example: "① Shopping cart — ② Shipping & billing — ③ Payment method — ④ Confirmation"._

---

## 2. Current step indication

One step is the current step. It is visually emphasised and announced as the current step by assistive technology.

_Example: "Shipping & billing" is rendered with a highlighted indicator and bold label; a screen reader announces "current step"._

---

## 3. Completed steps

A step can be marked as completed. Its indicator shows a check mark instead of the number, and the connector leading to the next step is emphasised to visualise progress. Assistive technology announces the step as completed.

---

## 4. Invalid steps

A step can be marked as invalid (needs attention). Its indicator shows an error icon instead of the number, and the label uses the theme's error colour. Assistive technology announces the error state. Invalid takes visual precedence over completed.

---

## 5. Optional description

Each step can show a secondary line of text under its label.

_Example: "Hyperspectral calibrations — Optimise the quantum entanglement matrices"._

---

## 6. Navigating to a step

A step can act as a link to the route or page that hosts it, so users can jump back to an earlier step. Steps that are not links are not focusable and not interactive.

---

## 7. Disabled steps

A step that is a link can be disabled so it stays visible but cannot be activated or focused.

---

## 8. Horizontal and vertical orientation

The stepper can lay out its steps horizontally (default, typically above the content) or vertically (typically beside the content, with more room for descriptions).

---

## 9. Compact size

A compact variant reduces the indicator and text size for dense layouts and side panels.

---

## 10. Dynamic steps

Steps can be added, removed, hidden and re-ordered at runtime. Numbering always reflects the visible steps.

---

## 11. Localisation

All texts that the component itself produces for assistive technology ("Completed", "Error") are customisable.

---

## 12. Theming and accessibility

The stepper is styled by both Lumo and Aura, supports dark mode, RTL, forced-colors mode, and works with keyboard and screen readers (list semantics, `aria-current="step"`, visible focus ring on interactive steps).
