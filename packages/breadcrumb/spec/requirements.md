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

## 6. Overflow collapse of middle items

When the trail contains more items than fit the available horizontal width, the component collapses intermediate items into a single overflow indicator (such as an ellipsis button), always keeping the first item (root) and the last item (current page or last ancestor) visible.

*Example: A deeply nested file manager path "Home > Documents > Projects > 2026 > Q1 > Reports > Summary" collapses to "Home > … > Summary" when the container is narrow. The middle items are hidden behind the ellipsis.*

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

## 10. Truncation of long item labels

When an individual item's text label is too long to display in full, the label is truncated with an ellipsis rather than causing the entire trail to overflow. The full label remains accessible (e.g., via a tooltip on hover).

*Example: A breadcrumb item labeled "Enterprise Resource Planning Configuration" is displayed as "Enterprise Resource Pl…" with a tooltip showing the full text on hover.*

---

## 11. Navigation landmark with default label

The breadcrumb identifies itself as a navigation landmark with a default label of "Breadcrumb" so that assistive technology users can locate it among other landmarks on the page.

*Example: A screen reader user pressing a landmark shortcut hears "Breadcrumb navigation" and knows they have reached the breadcrumb trail without having to read through every link.*

---

## 12. Current page announced as current by assistive technology

When the current-page item is included in the trail, assistive technology announces it as the current page, distinguishing it from the ancestor links.

*Example: A screen reader user tabbing through the breadcrumb hears each ancestor announced as a link. The last item is announced as "OAuth2, current page", making clear that this is their current location rather than a navigable link.*

---

## 13. Directional separator flips in right-to-left layouts

When the component renders in a right-to-left context, directional separators (such as chevrons) flip to point in the reading direction, maintaining the visual indication of hierarchy from right to left.

*Example: In an Arabic-language application, the breadcrumb reads from right to left and the chevron separators point left instead of right, so the visual flow matches the reading direction.*

---

## Discussion

Questions posed while producing this document, with the user's answers.

**Q: When the breadcrumb trail is too long to fit the available width, how should the component handle overflow?**

Collapse middle items behind an overflow indicator, always showing the first (root) and last (current) items. This is the standard pattern across design systems.

**Q: Should breadcrumb items support displaying icons alongside their text label?**

Yes, items can optionally display an icon before their text. Useful for home icons, folder icons, etc.

**Q: On small viewports (mobile), should the breadcrumb simplify its display?**

No special mobile behavior — use the same overflow/collapse mechanism as on desktop.

**Q: Which variants are in scope for this component?**

Both web component and Flow (Java) wrapper — the standard for new Vaadin components.
