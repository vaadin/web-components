# Breadcrumb Requirements

## 1. Displaying the ancestor trail

The breadcrumb displays a horizontal sequence of items representing the path from the root of a hierarchy to the user's current location. Each ancestor item is a navigable link that takes the user directly to that level when activated.

*Example: A user viewing an article sees "Home > Developer Guide > API Reference > Authentication > OAuth2". Clicking "API Reference" navigates them to the API overview page.*

---

## 2. Current page indication

The last item in the trail represents the user's current location and is visually distinct from the ancestor links. It is not an interactive link — it serves as a label confirming where the user is.

*Example: In "Home > Customers > Acme Corp", the text "Acme Corp" appears in a different style (e.g., not underlined, not clickable) to show it is the current page, while "Home" and "Customers" are links.*

---

## 3. Optionally omitting the current page

The application can choose whether the current-page item is included in the trail. When omitted, the breadcrumb shows only the ancestor links leading up to (but not including) the current page.

*Example: A documentation portal shows the page title as a heading below the breadcrumb. The breadcrumb displays "Home > Developer Guide > API Reference" without repeating "Authentication" because the heading already identifies the current page.*

---

## 4. Visual separator between items

A visual separator appears between consecutive items to convey the hierarchical relationship. The separator is purely decorative and is not announced by assistive technology.

*Example: Each pair of adjacent items is separated by a forward-pointing chevron: "Home › Laptops › Gaming".*

---

## 5. Customizable separator appearance

The application can change the visual appearance of the separator to match its design language.

*Example: An application replaces the default chevron separator with a forward slash, so the trail reads "Home / Products / Laptops".*

---

## 6. Overflow collapse of intermediate items

When the trail contains more items than fit the available horizontal width, intermediate items collapse in order of ancestry — starting from the item closest to the root — until only the root and the current item remain uncollapsed. If further collapsing is still needed, the root item finally collapses as well. The current item never collapses. Collapsed items are replaced by a single overflow indicator (such as an ellipsis button).

The rationale: the root and the current item's immediate ancestors are the ones the user is most likely to want to see and navigate to, so they are preserved the longest.

*Example: A file manager path "Home > Documents > Projects > 2026 > Q1 > Reports > Summary" first collapses to "Home > … > Q1 > Reports > Summary" (hiding "Documents" and "Projects"), then to "Home > … > Reports > Summary", then to "Home > … > Summary", and finally — if even that doesn't fit — to "… > Summary".*

---

## 7. Expanding collapsed items

When items are collapsed behind the overflow indicator, the user can activate the indicator to reveal the hidden items so they can navigate to any level in the trail.

*Example: The user clicks the "…" button and sees a menu listing "Documents", "Projects", "2026", "Q1", and "Reports". They click "Q1" to navigate directly to that level.*

---

## 8. Items may display icons

Each breadcrumb item can optionally display an icon alongside its text label. Icons are supplementary — the text label remains the primary identifier.

*Example: The root item shows a home icon next to the label "Home", while a category item shows a folder icon next to "Documents".*

---

## 9. Dynamic trail updates

The breadcrumb trail can be updated at runtime to reflect a hierarchy that changes based on application state, user navigation, or data-driven paths. The component renders whatever trail the application provides, without assuming a fixed sitemap.

*Example: A product catalog breadcrumb shows "Electronics > Laptops > Gaming" when browsing by category. When the user switches to browsing by brand, the application updates the trail to "Brands > Asus > Laptops", and the breadcrumb immediately reflects the new path.*

---

## 10. Navigation landmark

The breadcrumb identifies itself as a navigation landmark so that assistive technology users can locate it among other landmarks on the page.

*Example: A screen reader user pressing a landmark shortcut finds the breadcrumb navigation region without having to read through every link on the page.*

---

## 11. Current page announced as current by assistive technology

When the current-page item is included in the trail, assistive technology announces it as the current page, distinguishing it from the ancestor links.

*Example: A screen reader user tabbing through the breadcrumb hears each ancestor announced as a link. The last item is announced as "OAuth2, current page", making clear that this is their current location rather than a navigable link.*

---

## 12. Directional separator flips in right-to-left layouts

When the component renders in a right-to-left context, directional separators (such as chevrons) flip to point in the reading direction, maintaining the visual indication of hierarchy from right to left.

*Example: In an Arabic-language application, the breadcrumb reads from right to left and the chevron separators point left instead of right, so the visual flow matches the reading direction.*

---

## Discussion

Questions posed while producing this document, with the user's answers.

**Q: When the breadcrumb trail is too long to fit the available width, how should the component handle overflow?**

Collapse intermediate items progressively, starting from the item closest to the root, so the current item's immediate ancestors are preserved the longest. The root collapses only as a last resort; the current item never collapses. The rationale is that the root and the current item's nearby ancestors are the ones the user most likely wants to see or jump to.

**Q: Should breadcrumb items support displaying icons alongside their text label?**

Yes, items can optionally display an icon before their text. Useful for home icons, folder icons, etc.

**Q: On small viewports (mobile), should the breadcrumb simplify its display?**

No special mobile behavior — use the same overflow/collapse mechanism as on desktop.

**Q: Which variants are in scope for this component?**

Both web component and Flow (Java) wrapper — the standard for new Vaadin components.

**Q: Should long item labels be truncated with an ellipsis?**

No. Truncation of individual labels is not a component-level requirement — removed from scope.

**Q: Should the navigation landmark have a default label (e.g., "Breadcrumb")?**

No. The component identifies itself as a navigation landmark but does not provide a component-specific default label.
