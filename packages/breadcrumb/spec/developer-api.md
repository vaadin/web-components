# Breadcrumb Developer API

<!--
Developer-facing API derived from requirements.md. Shows the most convenient, minimal HTML/JS API for each requirement.

NOT a specification — no shadow DOM, mixins, or implementation details. Those come in the spec-component step.

Each section maps to one or more requirements and contains a code example.

Do NOT study repository source code.
DO use Vaadin MCP tools for naming conventions, slot patterns, and event patterns.
Design from a developer ergonomics perspective, informed by requirements, Vaadin documentation, and external design systems. Implementation feasibility is not a concern at this stage.
-->

## 1. Display a navigational trail with current page

Covers requirement(s): 1, 2, 4, 8

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item href="/home">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/projects">Projects</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/projects/2026-budget">2026 Budget</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Q1 Report</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** The container + item pattern matches Vaadin's established `vaadin-side-nav` / `vaadin-side-nav-item` structure. Items with `href` render as navigable links; the final item without `href` is automatically the current page (visually distinct, non-interactive). Chevron separators are rendered between items by default. `href` is used because breadcrumb items are fundamentally links — `href` is the universal HTML link attribute, and both Shoelace and React Aria follow this convention for their breadcrumb components.

---

## 2. Omit the current page from the trail

Covers requirement(s): 3

```html
<!-- Current page title is already shown as a page heading elsewhere -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item href="/shop">Shop</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/shop/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/shop/electronics/audio">Audio</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** No special mode or attribute is needed. When every item has an `href`, no item receives current-page styling. The developer simply omits the current-page item when it is already displayed as a page heading. The absence of a current-page item is the API — zero configuration for a common variant.

---

## 3. Custom separator symbol

Covers requirement(s): 5

```html
<vaadin-breadcrumb>
  <span slot="separator">/</span>
  <vaadin-breadcrumb-item href="/docs">Docs</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/docs/api">API</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/docs/api/auth">Authentication</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>OAuth 2.0</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

```html
<!-- Using an icon as separator -->
<vaadin-breadcrumb>
  <vaadin-icon slot="separator" icon="vaadin:arrow-right"></vaadin-icon>
  <vaadin-breadcrumb-item href="/home">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/settings">Settings</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Profile</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** A `separator` slot on the container lets the developer provide any content — text, icon, or SVG — as the separator. The component clones this element between every pair of items. Shoelace uses the same `separator` slot pattern. Placing the slot on the container rather than on each item avoids repetition: one declaration applies everywhere.

---

## 4. Overflow collapse into a dropdown menu

Covers requirement(s): 6

```html
<!-- When items exceed available width, intermediate items collapse automatically -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item href="/drive">My Drive</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/drive/projects">Projects</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/drive/projects/finance">Finance</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/drive/projects/finance/2026">2026 Budget</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/drive/projects/finance/2026/reports">Reports</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Q1 Summary</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
<!--
  When space is insufficient, renders as:
    My Drive > … > Reports > Q1 Summary

  Clicking "…" opens a dropdown listing:
    Projects
    Finance
    2026 Budget
  in their original hierarchical order.
-->
```

**Why this shape:** Overflow is handled automatically — no configuration needed. The component keeps the first item (root) and the last items visible, collapsing intermediate items into an ellipsis button with a dropdown menu. The developer's markup is identical whether or not overflow occurs, so the component works correctly as the hierarchy grows or the container shrinks. This follows the WAI-ARIA breadcrumb pattern recommendation and the approach used by Carbon Design System and shadcn/ui.

---

## 5. Truncate long item labels

Covers requirement(s): 7

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item href="/org">Organization</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/org/dept">
    International Sales and Marketing Department
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Q4 Performance Review</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
<!--
  The long label is truncated: "International Sales and Ma…"
  Hovering or focusing the item shows a tooltip with the full text.
-->
```

**Why this shape:** Truncation is automatic — no property needed. The component applies CSS text overflow with ellipsis and shows the full label in a tooltip on hover or focus. This keeps the API minimal while preventing layout breakage from unexpectedly long labels.

---

## 6. Automatically detect current page by URL

Covers requirement(s): 9

```html
<!-- All items have href; the component matches against the current URL -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item href="/admin">Admin</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/admin/users">Users</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/admin/users/42">User #42</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
<!--
  If the browser URL is /admin/users/42, the last item is
  automatically styled as the current page (non-interactive).
-->
```

**Why this shape:** Following `vaadin-side-nav-item`'s automatic highlighting pattern, when all items have an `href`, the component compares each value against the current URL and marks the matching item as the current page. This eliminates the need for the application to manually synchronize breadcrumb state on every navigation event. When an item without `href` is present, it takes precedence as the explicit current page and URL matching is not performed.

---

## 7. Client-side routing integration

Covers requirement(s): 8

```js
// Prevent full page reloads in a single-page application
const breadcrumb = document.querySelector('vaadin-breadcrumb');

breadcrumb.onNavigate = ({ href }) => {
  // Delegate to your SPA router instead of a full page load
  router.push(href);
};
```

```html
<!-- React example with React Router -->
<Breadcrumb onNavigate={({ href }) => navigate(href)}>
  <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
  <BreadcrumbItem href="/dashboard/content">Content</BreadcrumbItem>
  <BreadcrumbItem href="/dashboard/content/articles">Articles</BreadcrumbItem>
  <BreadcrumbItem>Edit Article</BreadcrumbItem>
</Breadcrumb>
```

**Why this shape:** The `onNavigate` callback follows the same pattern as `vaadin-side-nav`'s `onNavigate`. When set, it intercepts link clicks, prevents the default browser navigation, and passes the target `href` to the callback. The breadcrumb markup remains identical for both multi-page and single-page apps — only the container's `onNavigate` changes. This also applies to links in the overflow dropdown.

---

## 8. Collapse to parent link on small screens

Covers requirement(s): 10

```html
<!-- On small viewports, automatically renders as a single back-navigation link -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item href="/shop">Shop</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/shop/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/shop/electronics/audio">Audio</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Wireless Headphones Pro</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
<!--
  On a phone-sized viewport, renders as:  ← Audio
  Tapping navigates up one level to the Audio category.
-->
```

**Why this shape:** The responsive collapse is automatic — no media query or configuration needed from the developer. On narrow viewports, the component shows only the immediate parent as a back link with a back-arrow icon. The markup is identical regardless of viewport size; the component adapts its presentation internally. This follows the mobile breadcrumb pattern used by Google and Shopify.

---

## 9. Keyboard and screen reader accessibility

Covers requirement(s): 11, 12

```html
<!-- The component wraps items in <nav aria-label="Breadcrumb"> automatically -->
<!-- Override the label when multiple breadcrumb regions exist on the page -->
<vaadin-breadcrumb aria-label="Project navigation">
  <vaadin-breadcrumb-item href="/projects">Projects</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/projects/alpha">Project Alpha</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/projects/alpha/sprint-12">Sprint 12</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Task 405</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
<!--
  Screen reader announces: "Project navigation, navigation" landmark.
  Tab moves through: "link, Projects" → "link, Project Alpha" → "link, Sprint 12" → "current page, Task 405".
  Separators are hidden from assistive technology (aria-hidden).
  Enter activates the focused link.
  When the overflow dropdown is present: Enter opens it, Arrow keys navigate items, Escape closes it.
-->
```

**Why this shape:** No special API is needed — accessibility is built in. The component wraps items in a `<nav>` landmark with a default `aria-label` of "Breadcrumb". The current-page item receives `aria-current="page"`. Separators use `aria-hidden="true"`. All links are focusable via Tab and activatable via Enter. The developer can override `aria-label` for disambiguation when multiple breadcrumb regions are present on the same page.

---

## 10. Non-navigable items for restricted access

Covers requirement(s): 13

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item href="/org" disabled>Organization</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/org/dept">Department</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/org/dept/team">Team</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>My Task</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
<!--
  "Organization" appears as plain text, not a link — the user lacks access.
  "Department" and "Team" are clickable links.
  "My Task" is the current page.
-->
```

**Why this shape:** The `disabled` attribute is the standard HTML pattern for non-interactive elements. When set on a breadcrumb item that has an `href`, the item renders as plain text rather than a link, preserving hierarchical context without suggesting navigability. React Aria uses the same `isDisabled` concept. The `href` is retained in the markup so the item can be re-enabled dynamically without losing its target.

---

## 11. Right-to-left layout

Covers requirement(s): 14

```html
<div dir="rtl">
  <vaadin-breadcrumb>
    <vaadin-breadcrumb-item href="/home">الرئيسية</vaadin-breadcrumb-item>
    <vaadin-breadcrumb-item href="/products">المنتجات</vaadin-breadcrumb-item>
    <vaadin-breadcrumb-item>الإلكترونيات</vaadin-breadcrumb-item>
  </vaadin-breadcrumb>
</div>
<!--
  Trail renders right-to-left: الرئيسية < المنتجات < الإلكترونيات
  Root item appears on the right, current page on the left.
  Separator arrows point left to match the reading direction.
-->
```

**Why this shape:** No dedicated API is needed. The component respects the inherited `dir` attribute, automatically mirroring the layout and flipping the separator direction. This follows standard web platform RTL behavior and requires zero configuration from the developer.

---

## 12. Dynamic content updates

Covers requirement(s): 15

```js
// Update the trail after SPA navigation
const breadcrumb = document.querySelector('vaadin-breadcrumb');

function updateBreadcrumb(trail) {
  breadcrumb.replaceChildren();
  trail.forEach(({ label, href }) => {
    const item = document.createElement('vaadin-breadcrumb-item');
    if (href) item.href = href;
    item.textContent = label;
    breadcrumb.appendChild(item);
  });
}

// Navigate from Projects > Alpha > Tasks to Projects > Beta > Settings
updateBreadcrumb([
  { label: 'Projects', href: '/projects' },
  { label: 'Beta', href: '/projects/beta' },
  { label: 'Settings' },
]);
```

**Why this shape:** The component uses standard DOM APIs — `appendChild`, `removeChild`, `replaceChildren` — to manage items. No special "refresh" method or data-binding API is needed. The component observes its children and re-renders the trail (including overflow state and separator placement) automatically when items change. This works naturally with any framework's rendering model (Lit, React, server-side).

---

## 13. Accessible visual design for low vision and color blindness

Covers requirement(s): 16

```html
<!-- No special API — visual accessibility is provided by the theme -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item href="/home">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Current Product</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
<!--
  Links are distinguished from the current page by underline and/or font weight — not color alone.
  All text meets WCAG 2.1 AA contrast ratios.
  Truncated labels show tooltips that are accessible to screen magnification tools.
-->
```

**Why this shape:** Visual accessibility is a theme responsibility, not an API surface. The Lumo and Aura themes provide accessible defaults: links use non-color indicators (underline, font weight), sufficient contrast ratios are maintained for all elements, and tooltips for truncated text are accessible to magnification tools. The developer does not need to add any attributes or configuration to achieve these guarantees.
