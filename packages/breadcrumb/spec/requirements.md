# Breadcrumb Requirements

## 1. Ancestor trail display

The breadcrumb displays an ordered sequence of items representing the hierarchical path from the root of the navigation to the current page. Each ancestor item is a link that the user can activate to navigate to that level.

*Example: In an e-commerce admin panel, a user viewing a product detail page sees the trail "Catalog > Electronics > Laptops > ThinkPad X1 Carbon". Each item except the last is a link.*

---

## 2. Current page indication

The last item in the trail represents the current page. It is visually distinct from the ancestor links (e.g., different weight or color) and is not interactive — activating it does not navigate anywhere. Assistive technology identifies it as the current page.

*Example: In the trail "Catalog > Electronics > Laptops > ThinkPad X1 Carbon", the last item "ThinkPad X1 Carbon" appears as plain text rather than a link. A screen reader announces it as the current page.*

---

## 3. Navigation on item activation

When a user activates an ancestor item (by clicking or pressing Enter), the browser navigates to that item's target. The breadcrumb renders standard links so that browser features such as middle-click, right-click context menus, and "open in new tab" work without special handling.

*Example: A user right-clicks "Electronics" and selects "Open in new tab" to view the electronics category in a separate tab while staying on the current product page.*

---

## 4. Navigation interception

The application can intercept breadcrumb item activation to perform checks before navigation occurs. If the application prevents the activation, the browser does not navigate.

*Example: A user is editing a product form with unsaved changes and clicks the "Catalog" breadcrumb. The application intercepts the activation and shows a "Discard unsaved changes?" confirmation dialog. If the user cancels, they remain on the current page.*

---

## 5. Prefix content on items

Items can display additional content before the text label, such as an icon. This is optional per item.

*Example: The root item "Home" displays a home icon before its label. Other items in the trail show only their text labels.*

---

## 6. Single-line display

The breadcrumb always renders on a single line. When the trail exceeds the available horizontal space, items collapse rather than wrapping to a second line.

---

## 7. Item collapse order

When the trail does not fit the available space, intermediate items collapse behind an expand control (visually represented as an ellipsis). Items collapse in order of ancestry starting from the item closest to the root. The root item and the current page remain visible as long as possible. If all intermediates are collapsed and the trail still does not fit, the root item collapses as well. The current page item never collapses.

*Example: The trail "Home > Catalog > Electronics > Computers > Laptops > ThinkPad X1 Carbon" progressively collapses as space decreases:*
- *"Home > ... > Computers > Laptops > ThinkPad X1 Carbon" (Catalog collapsed)*
- *"Home > ... > Laptops > ThinkPad X1 Carbon" (Catalog, Computers collapsed)*
- *"Home > ... > ThinkPad X1 Carbon" (all intermediates collapsed)*
- *"... > ThinkPad X1 Carbon" (root also collapsed)*

---

## 8. Collapsed item access via dropdown

Activating the expand control opens a dropdown listing the collapsed items in hierarchy order. The user can activate any item in the dropdown to navigate to it. Closing the dropdown without selecting an item returns focus to the expand control.

*Example: A user sees "Home > ... > ThinkPad X1 Carbon" and clicks the ellipsis. A dropdown appears listing "Catalog", "Electronics", "Computers", "Laptops" in top-to-bottom order. The user clicks "Electronics" to navigate there.*

---

## 9. Current page label truncation

When all other items have been collapsed and the current page label still exceeds the available space, the label is truncated with a text ellipsis. The full label remains accessible to the user.

*Example: After all ancestors are collapsed, the trail shows "... > ThinkPad X1 Ca..." with the label truncated. Hovering over the truncated label reveals the full text "ThinkPad X1 Carbon".*

---

## 10. Dynamic trail updates

The trail can be updated at any time to reflect a new hierarchical path. When the items change, the breadcrumb re-renders to show the new trail, applying collapse and truncation as needed for the current available space.

*Example: A user navigates from a product page to a category page within a single-page application. The breadcrumb trail updates from "Catalog > Electronics > Laptops > ThinkPad X1 Carbon" to "Catalog > Electronics" without a full page reload.*

---

## 11. Navigation landmark default label

The breadcrumb identifies itself as a navigation landmark to assistive technology. Its default label is "Breadcrumb".

*Example: A screen reader user navigating by landmarks hears "Breadcrumb navigation" and understands this is a breadcrumb trail, distinct from the primary site navigation.*

---

## 12. Separator direction in RTL

The visual separator between items reverses direction in right-to-left layouts so that it remains correct in the reading direction.

*Example: In a left-to-right layout the separator points right (e.g., ">"). In a right-to-left layout it points left ("<"), matching the reading direction of the trail.*

---

## Discussion

**Q: Should the current page be displayed as the last item in the breadcrumb trail?**

Yes. The current page appears as the final breadcrumb item, visually distinct and non-interactive. This is the most common pattern across design systems.

**Q: On very narrow viewports (mobile), should the breadcrumb collapse middle items with an overflow menu, or simplify to a single back link to the immediate parent?**

Use the same collapse-with-overflow mechanism as desktop. The component provides a single consistent behavior across viewport sizes.

**Q: Should breadcrumb items support prefix content such as icons?**

Yes. Items can include prefix content like icons. Common pattern: a home icon on the root item.

**Q: Which variants are in scope?**

Both the web component and the Flow (Java) wrapper.

**Q: When there are too many items to fit, which items should be collapsed?**

Intermediate items collapse in order of ancestry, starting from the one closest to the root, until only the root and current items remain uncollapsed. If further collapsing is needed, the root item collapses as well. The current item never collapses. The rationale: the root and the current item's immediate ancestors are the ones users most likely want to see and navigate to.

**Q: How should collapsed items be accessed?**

Via a dropdown/popover opened by activating the expand control (ellipsis).

**Q: Should the breadcrumb prevent wrapping to a second line?**

Yes. The breadcrumb always stays on a single line. Overflow is handled by collapsing items, never by wrapping.

**Q: Should long individual item labels be truncated?**

Only the current page item is truncated, and only after all other items have been collapsed. Ancestor item labels are never truncated.
