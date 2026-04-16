# Breadcrumb Requirements

## 1. Displaying the ancestor trail

The breadcrumb displays an ordered sequence of items representing the hierarchical path from the root to the current page, arranged from the most general ancestor to the most specific location.

For example, a user viewing an individual product page in an e-commerce catalog sees the trail Home › Electronics › Laptops › ThinkPad X1 Carbon, making it immediately clear which categories contain the current product.

---

## 2. Navigating to an ancestor level

Activating an ancestor item navigates the user to that level of the hierarchy. The user can jump directly to any ancestor without retracing intermediate steps.

For example, a user three levels deep in a documentation tree (Guides › Getting Started › Installation) activates "Guides" and lands on the top-level guides listing, skipping the "Getting Started" intermediate page.

---

## 3. Indicating the current page

The last item in the trail represents the current page. It is visually distinct from the ancestor items and is not a navigation target — activating it has no effect.

For example, in the trail Home › Settings › Notifications, "Notifications" appears with different styling (such as heavier text and no hover underline) so the user can tell at a glance that it is their current location and not somewhere else they can go.

---

## 4. Visual separators between items

A visual delimiter appears between each pair of items to communicate the parent-child direction of the hierarchy. By default the separator is a directional symbol pointing from parent to child.

For example, in the trail Home › Products › Accessories the angle-bracket symbols between items signal that each item is a child of the one to its left.

---

## 5. Reflecting the application's navigation path

The trail reflects exactly the path supplied by the application, without assuming a single canonical hierarchy. When the same page exists under more than one parent, the trail shown matches the path the user actually took to reach the page.

For example, a product catalog lists a laptop both under Electronics › Laptops and under This Week's Deals. A user who reached the product by browsing deals sees Home › This Week's Deals › ThinkPad X1 Carbon, while a user who arrived via the category tree sees Home › Electronics › Laptops › ThinkPad X1 Carbon — each reflecting the user's own navigation context.

---

## 6. Updating the trail as navigation state changes

The trail reflects the user's current position and rebuilds each time the position within the hierarchy changes. The trail content is not tied to a static structure — it can be assembled at runtime from data.

For example, in a file browser the user opens the folders Data › 2025 › Q1 › Reports. Each folder they enter extends the trail by one item. When they navigate sideways from Q1 into Q2, the trail updates to Data › 2025 › Q2 › Reports.

---

## 7. Items with icons

An item can display an icon alongside its text label, or an icon by itself with no text. This allows the root to be represented compactly and lets categories with established iconography be recognized at a glance.

For example, a file-browser breadcrumb starts with a home icon (no text) representing the user's root directory, followed by folder-icon-plus-name items for each subfolder: 🏠 › 📁 Projects › 📁 2026 › Kickoff Notes.

---

## 8. Non-clickable ancestor items

Any item in the trail — not only the current page — can be marked as non-clickable. It still appears in the trail for orientation, but activating it does nothing. This supports ancestor levels that have no dedicated landing page and cases where the current user does not have permission to open the parent view.

For example, in an admin console a user without access to the "Billing" area still sees their full context: Organization › Billing › Invoice #4521. "Billing" is shown as plain text (not a link) so the user understands the hierarchy without being offered a navigation target they cannot use.

---

## 9. Optional inclusion of the current page

The trail can be configured to end at the current page (so the user sees where they are) or to end at the immediate parent (so the trail purely serves as upward navigation). The choice is made per usage, not forced.

For example, a page titled "Installation Guide" can show Docs › Getting Started › Installation Guide with the current page as the last, non-clickable entry; or it can show Docs › Getting Started, giving the user a quick path up to the previous level while the page title communicates the current location.

---

## 10. Customizing the separator

The visual delimiter between items can be replaced with a different character or icon so the breadcrumb matches the visual language of the application.

For example, an application with a minimalist visual style uses a forward slash as the separator, rendering the trail as Home / Products / Shoes instead of Home › Products › Shoes.

---

## 11. Single-line presentation

The trail stays on one horizontal line regardless of the number of items or the length of their labels. When there is not enough width for every item, the component adapts the content (see requirements 12–14) rather than wrapping onto a second line.

For example, a trail with eight items inside a narrow sidebar panel remains on a single line; items collapse or the current-item label shortens, but the trail never becomes two lines of breadcrumbs stacked vertically.

---

## 12. Collapsing items when space is limited

When the full trail does not fit in the available width, intermediate items collapse one at a time, starting with the item closest to the root and moving toward the current page. Only items between the root and the current page collapse in this phase; the root and the current item remain visible. If even that presentation does not fit, the root item collapses as well, leaving only the current item visible. The current item never collapses.

For example, in a six-level trail Home › Region › Country › State › City › Venue inside a narrowing container: first "Region" collapses, then "Country", then "State", leaving Home › … › City › Venue. If the container narrows further, "City" also collapses (Home › … › Venue), and then "Home" itself collapses, leaving … › Venue. The user always sees the item closest to their current location, because that is the most relevant for orientation.

---

## 13. Overflow control reveals the collapsed items

When one or more items are collapsed, a single overflow control (such as an ellipsis) stands in for the hidden items. Activating it opens a menu listing all collapsed ancestors in hierarchical order, and selecting one from the menu navigates to that level.

For example, from the collapsed trail Home › … › City › Venue, activating "…" opens a menu listing Region, Country, State. Selecting "Country" navigates the user to the country-level page directly.

---

## 14. Truncating the current item as a last resort

When every other item has already collapsed and the current item's label is still longer than the remaining width, the current item's label is truncated with an ellipsis. Ancestor item labels do not truncate; ancestors either fit at their natural length or are collapsed entirely. The full label of the truncated current item is revealed on hover or focus so the user can confirm which page they are on.

For example, inside a narrow container the only visible item is the current page "2026 Annual Performance Review Summary". Its label is shown as "2026 Annual Perfor…". Hovering the item shows the full text. The collapsed ancestors remain available through the overflow control described in requirement 13.

---

## 15. Default navigation landmark label

The breadcrumb identifies itself to assistive technology as a navigation region, and the component provides a sensible default label so the landmark is immediately recognizable without any application configuration. The application can still override the label for localization or to match its voice. (This is the breadcrumb's component-specific default on top of the universal "every landmark has an accessible name" rule.)

For example, a screen reader user listing the navigation landmarks on a page hears an entry for "Breadcrumb" alongside the site's primary navigation, and can jump straight to the trail without the application having supplied any label.

---

## 16. Announcing the current page to assistive technology

The item representing the current page is programmatically marked as the user's current location, so assistive technology announces this state without relying on visual styling. This is distinct from the item simply having an accessible name — it communicates the "you are here" semantic that is specific to the breadcrumb pattern.

For example, as a screen reader user moves through the trail Home › Settings › Notifications, "Notifications" is announced as the current page, making the user's location clear to people who cannot see the visual emphasis.

---

## 17. Separators omitted from the accessibility tree

Visual separators between items are presentational only and are not exposed to assistive technology, so users do not hear a redundant word (such as "greater than") between every link. This avoids the screen-reader noise that a naive rendering of a separator-heavy pattern would produce.

For example, a screen reader reads the trail as "Home, link; Settings, link; Notifications, current page," rather than "Home, link, greater than, Settings, link, greater than, Notifications."

---

## 18. Directional separator mirrors in right-to-left layouts

In right-to-left contexts, the default directional separator flips so that it continues to point from parent toward child in the reading direction. This is the breadcrumb-specific extension of the universal right-to-left rule: a chevron that remains literally "pointing right" in RTL would contradict the hierarchy it is meant to convey.

For example, in an Arabic-language application the trail reads from right to left as الرئيسية ‹ المنتجات ‹ الإلكترونيات, with the chevron pointing leftward (toward the child item) to match the reading direction.

---

## 19. Automatic trail from the view hierarchy

<!-- Applies to: flow -->

When a breadcrumb is placed in a view without any explicit items supplied, it builds and updates its trail automatically from the application's view hierarchy — the chain of nested layouts and the current route that the Flow router has resolved. The simplest valid usage is an unconfigured breadcrumb added to a layout; each subsequent navigation rebuilds the trail to reflect the new route's ancestor chain, with the active route marked as the current item. When the developer supplies an explicit trail, the explicit trail takes precedence (supporting, for example, polyhierarchy per requirement 5) and the automatic mode is not used.

For example, a Flow application has a top-level `OrganizationLayout` containing a `BillingLayout`, which hosts the route `InvoiceView` registered at `invoices/:invoiceId`. Placing a plain, unconfigured breadcrumb into the top-level layout renders the trail Organization › Billing › Invoice #4521 with no per-item configuration, deriving each item's label and target from the corresponding route or layout. When the user navigates from an invoice to the billing overview (a sibling route inside `BillingLayout`), the trail automatically updates to Organization › Billing, with "Billing" now marked as the current item.

---

## Discussion

Questions posed to the user while producing this document, with the user's answers. These are the decisions that shaped the requirements above.

**Q: Should breadcrumb items support icons (alongside or instead of text labels)?**

Yes. Items can include an icon with a text label, and items may also be icon-only (no text) — a home icon for the root is a common example.

**Q: On small screens / narrow containers, how should the component adapt?**

The same collapse-and-overflow behavior covers every width, including mobile. Intermediate items collapse into an overflow control (an ellipsis menu) that lists the hidden ancestors; when that is still not enough, the current item's label truncates with an ellipsis. An overflow control occupies roughly the same footprint as a "back to parent" link would, so there is no dedicated mobile back-link mode — mobile users keep the same jump-to-any-ancestor capability as users on wider viewports.

**Q: How should overly long trails (or long labels) be handled when they don't fit the available width?**

Intermediate items collapse in order of ancestry, starting with the item closest to the root, until only the root and the current item remain. If further collapsing is still needed, the root item also collapses. The current item never collapses; if even it does not fit on its own, its label is truncated with an ellipsis. Other items' labels are not truncated — they either fit at their natural length or they are collapsed. Rationale: the items closest to the current page are the most valuable for orientation, and the root is the next most valuable reference point.

**Q: Should the current page be part of the breadcrumb, and can it be omitted?**

Included by default, but the application can configure the breadcrumb to end at the immediate parent instead (purely upward-navigation presentation).

**Q: When intermediate items are collapsed due to insufficient width, how should the user access them?**

An overflow control (e.g. an ellipsis) replaces the collapsed items. Activating it opens a menu listing all hidden ancestors in order; selecting one navigates to that level.

**Q: Should the visual separator between items be customizable by the application?**

Yes. Applications can change the separator character or icon to match their visual language.

**Q: Should breadcrumb items be allowed to be non-clickable (informational only) even when they are not the current page?**

Yes. An ancestor level that has no dedicated page, or that the current user does not have permission to access, can be shown as non-clickable text within the trail.

**Q: Should an application be able to indicate that an item has sub-items, and let the user jump to a sibling at the same level?**

No. The breadcrumb strictly displays the path from the root to the current page; switching among siblings is outside its scope.

**Q: Should the Flow wrapper integrate automatically with the application's router?**

Yes. In Flow, `add(new Breadcrumb())` with no items supplied should render the trail automatically from the current route's view hierarchy — deriving items, labels, paths, and the "current" marker from the registered routes and parent layouts of the active view. Manually supplied items remain available for full control. This decision shapes a Flow-only requirement (the web component has no access to a server-side view/route registry).
