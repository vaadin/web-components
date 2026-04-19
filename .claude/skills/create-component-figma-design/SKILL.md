---
description: Create or compare Figma component designs from a Vaadin web component spec using the Figma MCP server. Supports both Lumo and Aura themes.
allowed-tools: Read(packages/*/spec/*),Read(packages/aura/src/*),Read(packages/vaadin-lumo-styles/*),Read(.claude/skills/create-component-figma-design/*),Glob,Grep,Write(packages/:*),Bash(mkdir -p packages/*/spec),mcp__figma
user_invocable: true
arg_description: "ComponentName [compare <figma-url>]"
---

This skill translates a component specification into Figma component designs using the Figma MCP server, or compares an existing Figma design against the spec.

This is step 5 in the spec-driven development pipeline. Steps 1-4 defined the problem, researched requirements, designed the developer API, and produced a full implementation specification. This step creates visual design artifacts in Figma that match the spec, supporting both Lumo and Aura themes.

**Reference:** Vaadin publishes an official Figma Design System (https://www.figma.com/community/file/843042473942860131/vaadin-design-system). The existing library defaults to Lumo styling. Align new component designs with this structure.

Arguments: [ComponentName] [compare <figma-url>]

PREREQUISITE CHECK:

1. Read `packages/{component-name}/spec/web-component-spec.md`. This is the primary input.
   If the file does not exist, stop and tell the user to run `create-component-spec` first.

2. If the second argument is "compare", the third argument must be a Figma file URL.
   If missing, stop and ask the user for the Figma file URL.

MODE ROUTING:

If the second argument is "compare", go to COMPARE MODE below.
Otherwise, proceed with CREATE MODE.

=== CREATE MODE ===

TASK OVERVIEW:

1. Parse the spec. Extract from `web-component-spec.md`:
   a. All elements (`<vaadin-{name}>`, `<vaadin-{name}-item>`, etc.)
   b. For each element: shadow DOM structure, properties table, slots table, parts table, events table, CSS custom properties table
   c. State attributes (disabled, focused, focus-ring, current, selected, etc.)
   d. Theme variants (primary, tertiary, filled, danger/error, success, warning)
   e. Size variants if applicable (xsmall, small, medium, large, xlarge)

2. Read design tokens for BOTH themes.

   Aura tokens:
   - `packages/aura/src/palette.css` (palette colors: --aura-red, --aura-blue, etc.)
   - `packages/aura/src/color.css` (semantic colors: --vaadin-text-color, --vaadin-border-color, accent system)
   - `packages/aura/src/size.css` (spacing: --vaadin-gap-*, --vaadin-padding-*, --vaadin-radius-*)
   - `packages/aura/src/typography.css` (fonts: --aura-font-family, --aura-font-size-*, --aura-font-weight-*)
   - `packages/aura/src/shadow.css` (shadows: --aura-shadow-xs, --aura-shadow-s, --aura-shadow-m)
   - `packages/aura/src/surface.css` (surface: --aura-surface-level, --aura-surface-opacity, --aura-surface-color)

   Lumo tokens:
   - `packages/vaadin-lumo-styles/src/props/color.css` (base, tint/shade, contrast, primary, error, success, warning, text colors)
   - `packages/vaadin-lumo-styles/src/props/spacing.css` (--lumo-space-xs through --lumo-space-xl, wide/tall variants)
   - `packages/vaadin-lumo-styles/src/props/typography.css` (--lumo-font-family, --lumo-font-size-*, --lumo-line-height-*)
   - `packages/vaadin-lumo-styles/src/props/sizing.css` (--lumo-size-xs through --lumo-size-xl, icon sizes)

   Both themes define shared `--vaadin-*` semantic tokens. These are the bridge between themes:
   - `--vaadin-text-color`, `--vaadin-text-color-secondary`, `--vaadin-text-color-disabled`
   - `--vaadin-border-color`, `--vaadin-border-color-secondary`
   - `--vaadin-background-color`, `--vaadin-background-container`, `--vaadin-background-container-strong`
   - `--vaadin-focus-ring-color`

3. Read theme-specific component CSS (if it exists).
   - Aura: `packages/aura/src/components/{name}.css`
   - Lumo: `packages/vaadin-lumo-styles/src/components/{name}.css`
   These files show how each theme visually styles the component. If neither exists (new component), use the base token values from step 2.

4. Read `DESIGN_TOKEN_MAP.md` in this skill's directory. This maps Lumo (`--lumo-*`) and Aura (`--aura-*`) CSS custom properties to Figma variable paths in the connected design library.

5. Search the connected Figma design system library.
   Use `search_design_system` to find existing Vaadin components in the Figma library that are similar to the new component. Use `get_screenshot` to capture visual reference from these for consistency in spacing, sizing, and visual weight.

6. Retrieve Figma design system variables.
   Use `get_variable_defs` to fetch existing color, spacing, and typography variables from the connected Figma library. Map the spec's CSS custom properties to these Figma variables using `DESIGN_TOKEN_MAP.md` as a starting reference. Adapt to actual variable names found.

7. Determine the Figma file target.
   Ask the user for the Figma file URL where the component should be created.
   - If the user provides a URL, use it.
   - If the user says "new file", use `create_new_file` to create a blank file named "vaadin-{component-name} Design".

8. Create the Figma component structure. Use `use_figma` to build:

   a. PAGE STRUCTURE:
      - Page: "{ComponentName}"
      - Section frame: "Anatomy" -- structural breakdown (theme-neutral)
      - Section frame: "Lumo Variants" -- all property/state combinations in Lumo theme
      - Section frame: "Aura Variants" -- all property/state combinations in Aura theme
      - Section frame: "States" -- interactive states for both themes
      - Section frame: "Design Tokens" -- side-by-side Lumo vs Aura token reference

   b. ANATOMY FRAME (theme-neutral):
      For each element in the spec, create an annotated auto-layout frame mirroring the shadow DOM structure:
      - Each shadow DOM node becomes a frame or shape
      - Slots become dashed-border placeholder frames with slot name labels
      - Parts become labeled frames (part name shown)
      - Use auto-layout to match the flex/grid layout implied by the shadow DOM
      - Add text annotations pointing to parts, slots, and structural elements

   c. LUMO VARIANTS FRAME:
      Create a Figma component set styled with Lumo tokens:
      - One variant per theme variant in default state (e.g., default, primary, tertiary)
      - One variant per interactive state in default theme (default, hover, focus, active, disabled)
      - Size variants if the spec supports them (xs through xl)
      - Key slot combinations from common usage in web-component-api.md
      Apply Lumo colors, spacing, border-radius, typography. Bind to Figma variables where available.

   d. AURA VARIANTS FRAME:
      Same component set as Lumo but styled with Aura tokens:
      - Aura uses oklch colors, surface levels, and contrast-level system
      - Apply Aura-specific spacing (--vaadin-gap-*, --vaadin-padding-*)
      - Apply Aura typography (Instrument Sans font, --aura-font-size-*)
      - Apply Aura surfaces and shadows
      Bind to Figma variables where available.

   e. STATES FRAME:
      Two rows (one Lumo, one Aura), each showing the component in every interactive state:
      - Default, Hover, Focus (with focus-ring), Active, Disabled
      - Additional component-specific states from the spec (e.g., current, selected, overflow)

   f. DESIGN TOKENS FRAME:
      A reference table showing side-by-side:
      - CSS custom property name (the shared --vaadin-* or component-specific property)
      - Lumo resolved value (from --lumo-* token chain)
      - Aura resolved value (from --aura-* token chain)
      - Color swatches or spacing indicators where applicable

   g. COMPONENT METADATA:
      Include the Vaadin tag name (e.g., `<vaadin-button>`) in each Figma component's description field. This enables Vaadin Copilot's Figma import to recognize and map the design back to code.

   Do NOT create a cartesian product of all variant combinations. Focus on representative variants:
   - One variant per theme variant in default state
   - One variant per interactive state in default theme
   - Size variants if explicitly in the spec
   - Key slot content variations (empty, with icon, with text, combined)

9. Take screenshots for verification.
   Use `get_screenshot` to capture the created Figma components. Review them to verify structure matches the spec. If obvious issues are found, use `use_figma` to correct them.

10. Read `FIGMA_DESIGN_TEMPLATE.md` in this skill's directory. Write a summary document at `packages/{component-name}/spec/figma-design.md` containing:
    - The Figma file URL
    - Element and variant mapping tables
    - Design token bindings for both Lumo and Aura
    - Any deviations from the spec
    - Notes on which variants were created and why

=== COMPARE MODE ===

1. Read `packages/{component-name}/spec/web-component-spec.md` (prerequisite already verified).

2. Use `get_metadata` on the provided Figma URL to get the full layer structure.

3. Use `get_design_context` to extract design information from the Figma file.

4. Use `get_screenshot` to capture the current visual state.

5. Compare the Figma design against the spec:
   a. Check that all elements from the spec exist as components/frames.
   b. Check that variant properties match the spec's state attributes and theme variants.
   c. Check for both Lumo and Aura theme coverage.
   d. Check that auto-layout structure matches the shadow DOM structure.
   e. Check that design token bindings match the spec's CSS custom properties.
   f. Check that slots are represented as placeholder areas.
   g. Check that parts are labeled.
   h. Check that component descriptions include Vaadin tag names.

6. Write a comparison report at `packages/{component-name}/spec/figma-comparison.md`:
   - Elements present in spec but missing from Figma
   - Elements present in Figma but not in spec (possible drift)
   - Theme coverage gaps (missing Lumo or Aura variants)
   - Token mismatches
   - Structural differences
   - Recommendations

IMPORTANT GUIDELINES:

- Do not modify the spec or any other pipeline documents.
- Do not create Figma designs for features not in the spec.
- Every Figma variant must trace to a property, state, or theme variant in the spec.
- Support both Lumo and Aura themes. Lumo aligns with Vaadin's existing Figma Design System. Aura provides the modern alternative.
- Use shared `--vaadin-*` tokens as the bridge between themes where applicable.
- If the Figma MCP server is not available (tools fail), stop and tell the user:
  "The Figma MCP server is not configured. Set it up with:
   claude mcp add --transport http figma https://mcp.figma.com/mcp
   Then re-run this skill."
- If the Figma MCP server requires OAuth authentication, call `mcp__figma__authenticate` to start the flow. In remote environments (devcontainers, Codespaces, SSH), the OAuth callback port on localhost is typically not auto-forwarded and changes on every attempt. Tell the user to:
  1. Open the authorization URL in their browser.
  2. Approve access in Figma.
  3. Copy the full URL from the browser address bar after redirect (it will look like `http://localhost:<port>/callback?code=...&state=...`) — the page itself will fail to load, which is expected.
  4. Paste the URL back so you can call `mcp__figma__complete_authentication` with it.
- If the specified Figma file is not accessible, stop and tell the user to check permissions and the file URL.
- If write tools (`use_figma`, `create_new_file`) fail but read tools work, fall back to producing only the markdown summary (`figma-design.md`) with the complete mapping specification, noting that manual Figma creation is needed.
- The primary output is the Figma design itself. The markdown summary is secondary documentation for traceability.
