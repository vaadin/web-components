# BreadcrumbTrail Requirements

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

The expanded list is reachable through both keyboard models the user might bring to it: standard linear Tab navigation (so any user moving through the page with Tab encounters the hidden links the same way they encounter every other anchor) and menu-style Up/Down arrow keys (so users who recognise the visual as a menu, or who arrive at it from an in-page menu interaction, can navigate it without breaking that mental model). Pressing Escape closes the expanded list and returns focus to the overflow indicator.

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

## 13. Flow: Default trail derived from the router hierarchy

In the Flow wrapper, instantiating a breadcrumb without configuring its items causes it to populate itself automatically from the application's router. The default strategy walks up the URL path of the current route and matches each prefix to a registered Flow route, producing one breadcrumb item per matched ancestor. The text shown for each item is the matched route's view title (the value Flow uses to set the page title for that route — typically the route's `@PageTitle`, or the title supplied dynamically by the view).

*Example: A user navigates to `/customers/acme/orders`. The orders view is annotated `@PageTitle("Orders")`, the customer detail view dynamically sets its title to "Acme Corp", the customers list view is `@PageTitle("Customers")`, and the root view is `@PageTitle("Home")`. A view that simply does `add(new BreadcrumbTrail())` shows "Home › Customers › Acme Corp › Orders" — one item per matched route, each labeled with that route's view title.*

---

## 14. Flow: Opting out of automatic trail population

The Flow wrapper lets the application disable automatic population so the breadcrumb shows only the items the application provides explicitly. Opting out is a per-instance choice and does not affect other breadcrumbs in the application.

*Example: A product catalog view builds its trail from category data rather than the URL structure. It opts the breadcrumb out of automatic population and supplies the items itself, so router-derived ancestors are not mixed in.*

---

## 15. Flow: Sitemap parent annotation overrides URL-based parent lookup

A Flow `@Route` class can carry an annotation that declares its sitemap parent. When the annotation is present, the automatic trail uses the declared parent for that view instead of inferring one from the URL hierarchy. Walking continues from the declared parent using the same rules.

*Example: A route registered at `/orders/edit/123` declares its sitemap parent as the orders list view. The breadcrumb shows "Home › Orders › Edit Order" instead of the URL-derived "Home › Orders › Edit › Edit Order".*

---

## 16. Flow: Routes can dynamically supply their breadcrumb contribution

A Flow `@Route` class can implement an interface that lets it dynamically provide what should appear in the breadcrumb for that view. The contribution is evaluated at navigation time, so it can depend on the data the view is currently showing, and it can replace the view's default item, add additional ancestors, or both.

*Example: A `CustomerView` showing customer "Acme Corp" implements the interface and returns "Acme Corp" as its own label plus an extra ancestor "Enterprise" (the customer's segment). The breadcrumb shows "Home › Customers › Enterprise › Acme Corp" instead of a generic "Home › Customers › Customer".*

---

## Discussion

Questions posed while producing this document, with the user's answers.

**Q: How should the user navigate the expanded list of collapsed items with the keyboard?**

Both menu-style arrow keys and linear Tab. The visual reads as a menu, so users coming from menu-bar / context-menu expect Up/Down to step through entries. At the same time, the entries are plain anchors and a screen-reader user (or anyone navigating the page entirely with Tab) expects to traverse them the same way they traverse any other link. Supporting both — Tab as the primary document-level mechanism, arrows as a menu-style convenience — covers both audiences without forcing one to adopt the other's interaction model. Escape closes the list regardless of how it was opened.

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

**Q: Why does the Flow wrapper auto-populate the trail from the router by default?**

A Flow application already declares its sitemap as `@Route` classes, so requiring every view to manually build a breadcrumb duplicates information the framework already has. Defaulting to router-derived items (req 13) lets the trivial case work with zero configuration. Apps that need full control can opt out per instance (req 14).

**Q: What text does the auto-populated trail show for each item?**

Each item is labeled with the matched route's view title — i.e., whatever Flow already uses as the page title for that route (the `@PageTitle` value, or a dynamically supplied title). Reusing the existing title means a route's breadcrumb label and browser tab title stay in sync without the developer having to declare them twice.

**Q: Why support both a parent annotation and a runtime interface for influencing the trail?**

URL hierarchy alone cannot express two common cases: (a) a route whose conceptual parent differs from its URL parent — e.g., an edit view whose parent is the list view, not the URL segment "edit" (req 15) — and (b) a trail that depends on the data the view is showing, such as inserting a customer's segment as an ancestor (req 16). A static annotation handles the first cleanly without runtime cost; a runtime interface handles the second. Together they cover the cases the URL-walking default cannot.
