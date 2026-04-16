# {ComponentName} Requirements

<!--
Behavioral requirements for the component, written from the perspective of an application end user. No implementation details, APIs, or technology choices.

The document opens with a Discussion section: a log of the questions the skill posed to the user while this document was being produced, and the answers the user gave. The Discussion captures the decisions that shaped the requirements — it is context, not a summary of the requirements.

The detailed numbered requirements follow. Each:
- Has a short, behavior-focused title
- Opens with the required behavior: what the component must do and when
- Follows with a concrete example that makes the requirement unambiguous
- Is self-contained — no knowledge of the component API required
- Is separated from the next requirement by a `---` horizontal rule
- MAY carry an optional `Applies to: universal | web | flow` line to scope it to one variant. Omitted = `universal` (applies to both variants). Only add the line when the behavior is meaningful for just one variant.

Every use case from the problem statement must be covered by at least one requirement. Core use case requirements come first, followed by variant use case requirements.

Do NOT include:
- Property, attribute, event, slot, or CSS names
- Framework-specific code
- Implementation notes
- API design suggestions
- Restatements of universal behavioural rules from DESIGN_GUIDELINES.md (accessible names, customisable labels, focus order matching visual order, RTL support, readable/tappable targets on small viewports). A requirement may touch these concerns only when the component adds a concrete default, a component-specific extension, or a specific interaction pattern that the universal rule does not pin down.
-->

## Discussion

Questions posed to the user while producing this document, with the user's answers. Each entry captures a decision that shaped the requirements below. The Discussion is the audit trail of scope and behavior choices — not a summary of the detailed requirements.

**Q: {Short, focused question — e.g. "Should items support icons?"}**

{User's answer, paraphrased as the decision. Keep it short.}

**Q: {Next question — e.g. "On mobile, should the component collapse the middle or simplify to a back link?"}**

{User's answer.}

---

## 1. <Behavior-focused title>

<!-- Applies to: universal | web | flow (optional — default is universal; include only when the behavior is variant-specific) -->

State the required behavior: what the component must do and when. Then give a concrete example to make it tangible.

---

## 2. <Behavior-focused title>

...

---

## 3. <Behavior-focused title>

...
