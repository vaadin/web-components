---
allowed-tools: Read(*),Glob(*),Grep(*),Bash(ls:*),Agent(subagent_type=Explore:*)
description: Validate a component spec file for internal consistency and cross-component API consistency
---

You are a senior web component architect reviewing a specification for consistency and quality. Your task is to validate a component spec file against itself and against the existing Vaadin web components in this repository.

Arguments: [ComponentName]

The spec file is located at: `packages/[component-name]/spec/[component-name]-web-component.md`
If not found there, also check: `spec/[component-name]-web-component.md`

**CRITICAL: You must NEVER modify any spec files. Your output is a validation report only.**

## Validation Process

### Phase 1: Structural Validation

Check that the spec follows the template structure from `SPEC_TEMPLATE.md`:
- Has "Usage Examples" section with numbered examples
- Has "Key Design Decisions" section
- Has "Implementation" section with "Elements" subsection
- Each element has: Shadow DOM structure, Property table, Slot table, Parts table, Event table, CSS Custom Property table
- All tables have correct columns (Property tables: Property, Type, Default, Reflected, Description)

### Phase 2: Internal Consistency

Check the spec is consistent with itself:
- Properties mentioned in usage examples match those defined in property tables
- Slot names used in examples match slot table definitions
- Events referenced in descriptions are listed in event tables
- CSS custom properties referenced in descriptions are listed in CSS property tables
- Shadow DOM structure matches parts table entries
- Default values in property tables are consistent with behavior described in examples
- Items in the `items` property type match the properties available on child elements

### Phase 3: Cross-Component Consistency

This is the most important phase. Examine existing components in `packages/` to validate naming consistency.

For each check below, look at 8-10 existing components' source code (their `src/` directories) to establish the existing convention, then compare the spec against it.

#### 3a. Property Naming
Check that the spec uses the same property names as existing components for equivalent concepts:
- `disabled` (not `isDisabled`) — Boolean, reflected
- `readonly` (not `readOnly` or `isReadonly`)
- `opened` (not `open` or `isOpen`) — for expandable/collapsible components
- `expanded` — for accordion-like expansion
- `items` — for data-driven item lists (Array type)
- `selected` / `selectedItem` — for selection
- `value` — for form field values
- `label` — for accessible labels
- `renderer` — for custom render functions
- `overlay` — follows overlay patterns if applicable
- If the component has an `items` property, check that item shape properties match the child element's properties

#### 3b. Event Naming
Check events follow established patterns:
- `[property]-changed` pattern for property change notifications (e.g., `opened-changed`, `value-changed`)
- Standard DOM events (`change`, `input`) for form-like behavior
- kebab-case for all custom events
- Events should use `CustomEvent` type with appropriate detail

#### 3c. Slot Naming
Check slots follow established patterns:
- `prefix` — content before main content
- `suffix` — content after main content
- `label` — label content
- `helper` — helper text
- `error-message` — error message content
- `tooltip` — tooltip element

#### 3d. CSS Custom Property Naming
Check CSS custom properties follow the pattern:
- Must start with `--vaadin-[component-name]-`
- Use kebab-case throughout
- Follow patterns like `--vaadin-[component]-background`, `--vaadin-[component]-border-color`, etc.
- Check that properties for similar concepts use similar suffixes as other components

#### 3e. Part Naming
Check shadow DOM parts follow established patterns:
- `label`, `input-field`, `prefix`, `suffix`, `clear-button`, `toggle-button` for field components
- `overlay`, `backdrop`, `content`, `header`, `footer` for overlay components
- All lowercase, hyphenated

#### 3f. Attribute Reflection
Check that the same types of properties are reflected consistently:
- `disabled` — always reflected
- `readonly` — always reflected
- `opened` — always reflected
- `invalid` — always reflected
- `value` — typically NOT reflected for complex values
- `items` — never reflected (Array/Object types)

#### 3g. Mixin Usage
Check if the spec's described behavior implies use of standard mixins:
- Disabled behavior → should mention or align with DisabledMixin patterns
- Focus behavior → should align with FocusMixin patterns
- Field behavior → should align with FieldMixin patterns
- Theming → should align with ThemableMixin patterns

#### 3h. Accessibility Patterns
Check accessibility follows established patterns:
- ARIA roles match W3C WAI-ARIA patterns for the component type
- `aria-label` properties follow the same patterns as similar components
- Focus management follows established patterns
- Keyboard interaction follows established patterns

### Phase 4: Web Component Guidelines Compliance

Read `WEB_COMPONENT_GUIDELINES.md` and check the spec aligns with the project's development guidelines.

## Output Format

Produce a structured report with the following format:

```
# Spec Validation Report: [ComponentName]

## Summary
[1-2 sentence overall assessment]

## Critical Issues
[Issues that MUST be fixed — naming conflicts, missing required sections, accessibility problems]

### Issue N: [Title]
- **Category**: [Structural | Internal Consistency | Cross-Component | Guidelines]
- **Location**: [Section/line in spec]
- **Problem**: [What's wrong]
- **Evidence**: [What existing components do differently, with specific component names]
- **Recommendation**: [How to fix it]

## Warnings
[Issues that SHOULD be fixed — minor naming inconsistencies, missing optional sections]

### Warning N: [Title]
- **Category**: ...
- **Location**: ...
- **Problem**: ...
- **Evidence**: ...
- **Recommendation**: ...

## Notes
[Observations that are not issues but worth considering]

## Consistency Score
[X/10 — how consistent the spec is with the rest of the project]
```

## Important Guidelines

- Be thorough — check EVERY property, event, slot, part, and CSS custom property in the spec
- Always cite specific existing components as evidence when flagging cross-component issues
- Do not flag things as issues if the spec's approach is actually valid for its component type (e.g., a non-field component doesn't need `value`)
- Focus on actionable, specific feedback
- NEVER modify any files — this is a read-only validation task
