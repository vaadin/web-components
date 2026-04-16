# Breadcrumb Requirements

## Discussion

Questions posed to the user while producing this document, with the user's answers. These are the decisions that shaped the requirements below.

**Q: Should breadcrumb items support icons (alongside or instead of text labels)?**

Yes. Items can include an icon with a text label, and items may also be icon-only (no text) — a home icon for the root is a common example.

**Q: On small screens / narrow containers, how should the component adapt?**

Simplify to a back-to-parent link. On small viewports the full trail is replaced by a single back-style link pointing to the immediate parent of the current page.

**Q: How should overly long trails (or long labels) be handled when they don't fit the available width on desktop?**

Intermediate items collapse in order of ancestry, starting with the one closest to the root, until only the root and the current item remain. If further collapsing is still needed, the root item collapses as well. The current item never collapses. Rationale: the items closest to the current page are the ones the user most needs for orientation, and the root is the next most valuable reference point.

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

---

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

## 5. Displaying an application-supplied path

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

For example, a trail with eight items inside a narrow sidebar panel remains on a single line; items collapse or labels shorten, but the trail never becomes two lines of breadcrumbs stacked vertically.

---

## 12. Collapsing intermediate items when space is limited

When the full trail does not fit in the available width, intermediate items collapse one at a time, starting with the item closest to the root and moving toward the current page. The current item never collapses. If the available space is so constrained that only the current item fits, even the root item collapses; the current item is always shown.

For example, in a six-level trail Home › Region › Country › State › City › Venue in a narrowing container: first "Region" collapses, then "Country", then "State", leaving Home › … › City › Venue. If the container narrows further, "Home" also collapses, leaving … › City › Venue. The user always sees the items closest to their current location, because those are the most relevant for orientation.

---

## 13. Overflow control reveals the collapsed items

When one or more items are collapsed, a single overflow control (such as an ellipsis) stands in for the hidden items. Activating it opens a menu listing all collapsed ancestors in hierarchical order, and selecting one from the menu navigates to that level.

For example, from the collapsed trail Home › … › City › Venue, activating "…" opens a menu listing Region, Country, State. Selecting "Country" navigates the user to the country-level page directly.

---

## 14. Truncating long item labels

When an individual item's label is longer than the space allotted to it, the label truncates with an ellipsis instead of pushing other items out of view. The full label is revealed when the user hovers over or focuses the truncated item.

For example, an item labeled "2026 Annual Performance Review Summary" appears as "2026 Annual Perfor…" in a narrow container; hovering or focusing the item shows the full text so the user can confirm which item they are looking at before clicking.

---

## 15. Identifying as a navigation landmark for assistive technologies

The breadcrumb is exposed as a navigation region with a descriptive label, so screen reader users can locate it among the other navigation landmarks on the page and know what it is.

For example, a screen reader user pressing a landmark shortcut hears "Breadcrumb navigation" and knows they have reached the hierarchical trail, distinct from other landmarks such as the primary site navigation or the footer.

---

## 16. Announcing the current page to screen readers

The item representing the current page is programmatically marked as such, so assistive technology announces it as the user's current location without relying on visual styling alone.

For example, as a screen reader user moves through the trail Home › Settings › Notifications, "Notifications" is announced as the current page, making the user's location clear to people who cannot see the visual emphasis.

---

## 17. Separators not announced by screen readers

Visual separators between items are not announced by assistive technology, so users do not hear a redundant word (such as "greater than") between every link.

For example, a screen reader reads the trail as "Home, link; Settings, link; Notifications, current page," rather than "Home, link, greater than, Settings, link, greater than, Notifications."

---

## 18. Keyboard navigation

Users can move focus through the interactive items of the breadcrumb using standard link-navigation keys. Ancestor items and the overflow control (when present) are part of the tab order, and activation follows the standard link convention. The current-page item and any non-clickable items are skipped in the tab order because they are not navigation targets.

For example, a keyboard user pressing Tab moves focus through Home, then the overflow control, then the last visible ancestor, and presses Enter on the overflow control to open the menu of collapsed items — without needing any component-specific keyboard shortcuts.

---

## 19. Right-to-left language support

In right-to-left languages, the trail mirrors: the root appears on the right and the current page on the left. Directional separator icons also flip so that they continue to point from parent toward child in the reading direction.

For example, in an Arabic-language application the trail reads from right to left as الرئيسية ‹ المنتجات ‹ الإلكترونيات, with the chevron pointing leftward (toward the child item) to match the reading direction.

---

## 20. Simplifying to a back link on small screens

On small screens or very narrow containers, the breadcrumb replaces the full trail with a single back-style link pointing to the immediate parent of the current page. This keeps orientation and upward navigation available without consuming excessive horizontal space.

For example, on a mobile phone viewing a product page nested under Home › Electronics › Laptops, the breadcrumb displays a back arrow followed by "Laptops", letting the user return to the laptops category with one tap. When the current page is the root, the back link is not shown because there is no parent to go back to.

---

## 21. Readable and tappable targets on small screens

On small viewports, the breadcrumb's text and interactive targets stay large enough to read and tap reliably, even when the layout is condensed.

For example, on a 320-pixel-wide phone screen, the compact back link has enough height and padding that a user can tap it accurately without hitting neighboring elements by mistake.
