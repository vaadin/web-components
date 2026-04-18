# Breadcrumb Requirements

## 1. Display a navigable trail of ancestor levels

The breadcrumb displays an ordered trail of items representing the user's current position in a hierarchy. Each item except the last is a link that navigates to the corresponding ancestor level when activated. The last item represents the current page and is not a link.

For example, in an e-commerce admin where the user is viewing a product, the trail reads "Home > Electronics > Laptops > ThinkPad X1 Carbon". Clicking "Electronics" navigates directly to the Electronics department page.

---

## 2. Visually distinguish the current page from ancestor links

The last item in the trail represents the current page and must be visually distinct from the ancestor links — it appears as plain text rather than as a clickable link, and is marked with `aria-current="page"` so assistive technology identifies it as the current location.

For example, in the trail "Settings > Security > Roles", the "Roles" item appears as non-interactive text while "Settings" and "Security" appear as links.

---

## 3. Separate items with a visual separator

Each pair of adjacent items is separated by a visual indicator (such as a forward slash or chevron) that conveys the hierarchical direction. The separator is purely decorative and not announced by screen readers.

For example, in "Home / Products / Shoes", the "/" characters between items visually indicate the hierarchy without adding noise to the screen-reader experience.

---

## 4. Separator direction flips in right-to-left contexts

When the separator is directional (e.g., a chevron pointing right), it flips to point in the opposite direction in RTL layouts so that the visual direction remains consistent with the reading order. Non-directional separators (e.g., "/") do not flip.

For example, in an Arabic-language application using a chevron separator, the chevron points left (the reading direction) rather than right.

---

## 5. Support optional icons on items

Each item in the trail can optionally display an icon alongside its text label. This is most commonly used for the root item (e.g., a home icon) but may be used on any item.

For example, in a file manager breadcrumb, the root item shows a home icon followed by "Home", and folder items show a folder icon followed by the folder name.

---

## 6. Collapse middle items into an overflow menu when the trail does not fit

When the trail is too long to fit in the available horizontal space, the component collapses intermediate items (between the first and last visible items) into an overflow menu represented by an ellipsis. The first item and the last item (current page) always remain visible. Activating the ellipsis reveals the collapsed items so the user can navigate to any ancestor.

For example, in a file manager 8 folders deep, the breadcrumb shows "Home > … > Reports > Q4 Summary". Clicking "…" opens a menu listing the collapsed intermediate folders.

---

## 7. Truncate the current page label with an ellipsis when space is insufficient

When the available space is not enough to display even the first item, the overflow menu, and the current page label at full width, the current page label (last item) is truncated with a text ellipsis. Ancestor link labels are never truncated — they are collapsed into the overflow menu instead.

For example, in a narrow panel showing the breadcrumb "Home > … > Q4 2025 Marketing Campaign Ass…", the current page label is truncated because the full text does not fit after the overflow menu has already collapsed all intermediate items.

---

## 8. Overflow menu and current-page truncation compose predictably

When the trail exceeds available space, the component first collapses intermediate items into the overflow menu (requirement 6). If the trail still does not fit after all collapsible items have been collapsed, the current page label is truncated with an ellipsis (requirement 7). Both behaviors can be active simultaneously: the overflow menu is shown and the current page label is truncated.

For example, in an extremely narrow container, the breadcrumb shows "Home > … > Q4 2025 Marketi…" — intermediate items are in the overflow menu and the current page label is truncated to fill the remaining space.

---

## 9. Wrap the component in a navigation landmark

The breadcrumb is rendered inside a navigation landmark so assistive technology can identify it as a navigation region. The landmark's default label is "Breadcrumb".

This is a component-specific default for the universal accessible-name rule: the component provides "Breadcrumb" as a sensible English fallback that the application can override for localisation.

---

## 10. Application can intercept item activation

When a user activates a breadcrumb link, the application can intercept the activation to perform custom logic (such as an unsaved-changes confirmation) before navigation proceeds. If the application suppresses the activation, no navigation occurs.

For example, in a form editor with unsaved changes, clicking a breadcrumb ancestor triggers a "Discard changes?" dialog. If the user cancels, they remain on the current page.

---

## 11. Application controls which item is current

**Applies to:** flow

The application can programmatically set which item in the trail represents the current page — typically by updating the breadcrumb items to match the current route. In a Flow application, the breadcrumb integrates with the server-side routing so that when the user navigates to a new view, the breadcrumb trail updates to reflect the new location without the developer manually reconstructing the trail for every route change.

For example, in a Flow application with routes like "/settings/security/roles", navigating to that URL automatically produces the trail "Settings > Security > Roles" based on the route hierarchy.

---

## Discussion

Questions posed to the user while producing this document, with the user's answers.

**Q: Should breadcrumb items support icons alongside their text labels (e.g., a home icon for the root item)?**

Yes, items should optionally support icons. This shaped requirement 5.

**Q: On small viewports where the full trail cannot fit, how should the breadcrumb behave?**

Always depending on width — use the same overflow strategy (collapse middle items into a menu) regardless of viewport size. No separate mobile mode or back-link simplification. This shaped requirements 6 and 8.

**Q: Which variants are in scope?**

Both web component and Flow wrapper (the default).

**Q: Should the breadcrumb trail include the current page as the last item?**

Yes, include the current page. It should be visually distinct and marked with `aria-current`. This shaped requirements 1 and 2.

**Q: Should individual breadcrumb item labels be truncated with an ellipsis when too long?**

No truncation for ancestor labels — only the last item (current page) gets truncated with an ellipsis when there is not enough space. This shaped requirements 7 and 8.
