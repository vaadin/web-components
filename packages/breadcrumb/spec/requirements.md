# Breadcrumb Requirements

<!--
Behavioral requirements for the component, written from the perspective of an application end user. No implementation details, APIs, or technology choices.

Each numbered requirement:
- Has a short, behavior-focused title
- Opens with the required behavior: what the component must do and when
- Follows with a concrete example that makes the requirement unambiguous
- Is self-contained — no knowledge of the component API required
- Is separated from the next requirement by a `---` horizontal rule

Core behavioral requirements come first, ordered from most common to most specialized. Requirements for uniformly-applicable behaviors (use by people with disabilities, keyboard-only operation, right-to-left languages, small screens, long or dynamic content) come after.

Do NOT include:
- Property, attribute, event, slot, or CSS names
- Framework-specific code
- Implementation notes
- API design suggestions
-->

## 1. Display a navigational trail showing the user's position in a hierarchy

The component must render an ordered sequence of links representing the path from the root of the application hierarchy to the user's current location. Each link in the trail navigates to the corresponding ancestor level when activated.

For example, in a cloud storage application, a user viewing a file sees the trail "My Drive > Projects > 2026 Budget > Q1 Report.xlsx". Clicking "Projects" navigates directly to the Projects folder listing.

---

## 2. Indicate the current page as the final item in the trail

The last item in the breadcrumb trail must represent the user's current page. This item must be visually distinct from the preceding links and must not behave as a navigable link, since the user is already on that page.

For example, in an admin console showing "Settings > Users > Jane Doe", the "Jane Doe" item appears in a different style (e.g., not underlined, different color) and does not respond to clicks.

---

## 3. Optionally omit the current page from the trail

The component must support a mode where the current page is not shown in the breadcrumb trail, leaving only the ancestor links. This is useful when the current page's title is already prominently displayed elsewhere on the page and repeating it in the breadcrumb would be redundant.

For example, on a product detail page whose heading already reads "Wireless Headphones Pro", the breadcrumb shows only "Shop > Electronics > Audio" without repeating the product name.

---

## 4. Separate items with a visual divider

The component must display a visual separator between each breadcrumb item so users can distinguish individual levels in the hierarchy. The default separator should be a forward-pointing chevron or similar directional symbol that conveys hierarchy.

For example, "Home > Departments > Engineering" uses chevrons between items to indicate the parent-child direction.

---

## 5. Allow customization of the separator symbol

The application must be able to replace the default separator with a different character or symbol. This enables visual consistency with the application's design language.

For example, a documentation portal uses a forward slash as its separator, rendering the trail as "Docs / API / Authentication / OAuth 2.0".

---

## 6. Collapse overflowing items into a dropdown menu when horizontal space is insufficient

When the breadcrumb trail is too wide to fit in its container, the component must collapse intermediate items into a dropdown menu, represented by an ellipsis button. The first item (root) and the last items (closest ancestors and current page) must remain visible. Activating the ellipsis button reveals the hidden items in their correct hierarchical order.

For example, in a file manager showing "My Drive > ... > Reports > Q1 Summary", clicking the ellipsis reveals the hidden levels "Projects", "2026 Budget", and "Finance" in a dropdown menu.

---

## 7. Truncate long item labels with an ellipsis

When an individual breadcrumb item's label is too long to display in full, the component must truncate the text with an ellipsis rather than allowing it to break the layout. The full label must be accessible via a tooltip on hover or focus.

For example, a breadcrumb item labeled "International Sales and Marketing Department" is displayed as "International Sales and Ma..." with a tooltip showing the full name.

---

## 8. Navigate to ancestor pages when breadcrumb links are activated

Each breadcrumb item (except the current page) must function as a navigation link. When a user clicks or taps an item, the application navigates to the page represented by that item. The component must support both standard link navigation (full page loads) and client-side routing (single-page application navigation).

For example, in a CMS showing "Dashboard > Content > Articles > Edit Article", clicking "Content" navigates the user to the content listing page without a full page reload in a single-page application.

---

## 9. Highlight the current route automatically based on the URL

The component must be able to automatically determine which breadcrumb item corresponds to the current page based on the application's URL or route, and mark it accordingly. This prevents the application from needing to manually synchronize breadcrumb state with every navigation event.

For example, when a user navigates to "/admin/users/42", the breadcrumb automatically highlights "User #42" as the current page and renders "Admin > Users > User #42" with the correct current-page styling.

---

## 10. Show only the immediate parent link on small screens

On narrow viewports or small screens, the full breadcrumb trail should collapse to show only a single link to the immediate parent of the current page, styled as a back-navigation link. This preserves the upward-navigation function without consuming excessive screen space.

For example, on a phone, instead of "Shop > Electronics > Audio > Wireless Headphones Pro", the user sees only a back arrow followed by "Audio", which navigates up one level to the Audio category.

---

## 11. Support keyboard-only navigation

All interactive breadcrumb items must be reachable and activatable using only the keyboard. Users must be able to Tab through the breadcrumb links in order and activate them with Enter. When an overflow dropdown menu is present, keyboard users must be able to open it and navigate its items.

For example, a keyboard-only user presses Tab to move through "Home", "Products", then the ellipsis button. Pressing Enter on the ellipsis opens the dropdown, and arrow keys navigate through hidden items.

---

## 12. Communicate the navigation trail to screen readers

The breadcrumb must be rendered within a navigation landmark so screen readers can identify it as a distinct navigational region. The current page item must be announced as the current page. Visual separators between items must not be announced by screen readers.

For example, a screen reader user navigating a project management tool hears "Breadcrumb navigation" when entering the region, then "link, Project Alpha", "link, Sprint 12", "current page, Task 405" as they navigate the items — without hearing the chevron separators.

---

## 13. Indicate non-navigable items for users without access to a parent level

The component must support marking individual breadcrumb items as non-interactive when the user does not have access to that ancestor level. A non-interactive item remains visible to preserve the hierarchical context but does not function as a link.

For example, in an enterprise application, a user can see "Organization > Department > Team > My Task" but does not have permission to visit the "Organization" page. The "Organization" item appears as plain text, not a link, while "Department" and "Team" remain clickable.

---

## 14. Render correctly in right-to-left languages

When the application uses a right-to-left language, the breadcrumb trail must mirror its layout: the root item appears on the right, the current page appears on the left, and separator symbols point in the appropriate direction for the reading order.

For example, in an Arabic-language application, the trail reads from right to left as "الرئيسية < المنتجات < الإلكترونيات" with separators pointing left.

---

## 15. Handle dynamically changing content gracefully

The breadcrumb trail must update smoothly when the hierarchy changes due to navigation or dynamic content loading. Items must not flicker, jump, or lose their overflow state during updates.

For example, in a single-page application, when a user navigates from "Projects > Alpha > Tasks" to "Projects > Beta > Settings", the breadcrumb trail transitions cleanly to reflect the new path without visible layout shifts.

---

## 16. Remain usable for users with low vision or color blindness

The visual distinction between interactive links, the current page, and separators must not rely on color alone. Sufficient contrast ratios must be maintained for all text and interactive elements. Truncated labels must be accessible via tooltips that are also readable by magnification tools.

For example, a user with color blindness can distinguish breadcrumb links from the current page because links are underlined (or otherwise styled beyond color), and the current page uses a different font weight in addition to a different color.

