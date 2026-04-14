# Breadcrumb Requirements

## 1. Displaying the ancestor trail

The breadcrumb displays an ordered sequence of items representing the hierarchical path from the root level to the current page. Each item in the trail corresponds to one level of the hierarchy, arranged left to right from the most general ancestor to the most specific location.

For example, in a product catalog a user viewing a laptop product page sees the trail: Home > Electronics > Laptops > ThinkPad X1 Carbon.

---

## 2. Navigating to an ancestor level

Clicking any ancestor item in the trail navigates the user to that level of the hierarchy. The user can jump directly to any ancestor without retracing intermediate steps.

For example, a user three levels deep in a documentation tree (Guides > Getting Started > Installation) clicks "Guides" to jump directly to the top-level guides listing, bypassing the "Getting Started" page.

---

## 3. Indicating the current page

The last item in the trail represents the current page. It is visually distinct from the ancestor links — it appears as plain text rather than a clickable link, so the user can immediately distinguish where they are from where they can go.

For example, in the trail Home > Electronics > Laptops, "Laptops" appears in a different style (e.g., darker text, no underline) to communicate that it is the current location, not a navigation target.

---

## 4. Displaying visual separators between items

A visual delimiter appears between each pair of items to communicate the parent-child direction of the hierarchy. The default separator is a directional symbol such as a chevron or angle bracket pointing from parent to child.

For example, in the trail Home > Products > Accessories, the ">" characters between items signal that each item is a child of the one preceding it.

---

## 5. Remaining on a single horizontal line

The trail displays on one horizontal line and does not wrap to multiple lines, regardless of the number of items or the length of their labels. When the content exceeds the available width, overflow handling takes effect rather than the trail breaking onto a second line.

For example, a breadcrumb trail with eight levels in a narrow sidebar panel stays on one line; the component collapses or truncates items rather than wrapping.

---

## 6. Collapsing intermediate items when space is limited

When the trail is too wide for the available horizontal space, intermediate items collapse behind a single interactive control (such as an ellipsis button) that opens a dropdown menu listing the hidden items in hierarchical order. The user can select any hidden item from the menu to navigate to that level.

For example, a six-level trail Home > Region > Country > State > City > Venue in a narrow container becomes Home > ... > City > Venue, where clicking "..." opens a menu showing Region, Country, and State.

---

## 7. Keeping the first and last items visible during collapse

When items collapse, the first item (root) and the last item (current page) remain visible. This ensures the user always sees where the hierarchy starts and where they currently are, even when the middle of the trail is hidden.

For example, after collapsing, a trail for a deeply nested admin page still reads Dashboard > ... > SMTP Settings, with "Dashboard" (the root) and "SMTP Settings" (the current page) always visible.

---

## 8. Truncating long item labels

When an individual item's text is too long for the available space, it truncates with an ellipsis rather than pushing other items out of view. The full label is revealed via a tooltip when the user hovers over or focuses the truncated item.

For example, an item labeled "2025 Annual Performance Review Summary" truncates to "2025 Annual Perfor..." and the full text appears in a tooltip on hover.

---

## 9. Updating the trail as the user navigates

The trail reflects the user's current position and updates each time the user navigates to a new page within the hierarchy. In applications where the hierarchy is generated dynamically — such as a file browser, organizational chart, or search drilldown — the trail rebuilds to match the current path, regardless of how deep or variable the structure is.

For example, in a file manager the user opens nested folders Data > 2025 > Q1 > Reports. Each folder they enter adds a new item to the trail. When they navigate from Q1 into Q2 via a sibling link, the trail updates to Data > 2025 > Q2.

---

## 10. Optionally showing or hiding the current page in the trail

The trail can be configured to include the current page as the last item or to display only the ancestor links leading up to the current page. When the current page is omitted, the last visible item is the immediate parent, and the breadcrumb serves purely as upward navigation rather than also confirming the current location.

For example, a page titled "Installation Guide" can show the trail as Docs > Getting Started > Installation Guide (current page included) or as Docs > Getting Started (current page omitted, acting as a "you came from here" indicator).

---

## 11. Customizing the separator appearance

The visual delimiter between items can be changed from its default appearance to a different character, symbol, or icon. This allows the breadcrumb to match the visual language of the application.

For example, an application using a slash-based breadcrumb style displays the trail as Home / Products / Shoes instead of Home > Products > Shoes.

---

## 12. Identifying as a navigation landmark for assistive technologies

The breadcrumb is identified as a navigation region so that screen reader users can locate it among the page's landmark regions. The region carries a descriptive label (such as "Breadcrumbs") that distinguishes it from other navigation landmarks on the same page, like a main menu or sidebar navigation.

For example, a screen reader user pressing a landmark shortcut hears "Breadcrumbs navigation" and knows they have reached the hierarchical trail, distinct from the primary site navigation.

---

## 13. Announcing the current page to screen readers

The item representing the current page is programmatically marked so that screen readers announce it as the user's current location within the hierarchy. This allows assistive technology users to understand which item is the active page without relying on visual styling differences.

For example, when a screen reader user tabs through the breadcrumb trail Home > Settings > Notifications, the "Notifications" item is announced as the current page.

---

## 14. Hiding separators from screen reader announcements

Visual separators between items are not announced by screen readers. This prevents assistive technology users from hearing redundant characters (such as "greater than" for each chevron) between every link, keeping the announced trail clean and efficient.

For example, a screen reader reads the trail as "Home, link; Settings, link; Notifications, current page" rather than "Home, link, greater than, Settings, link, greater than, Notifications."

---

## 15. Navigating between items via keyboard

Users move focus between breadcrumb items using Tab and Shift+Tab, following standard link keyboard behavior. Each focusable ancestor link receives focus in document order. There are no component-specific keyboard shortcuts beyond standard link activation (Enter). When items are collapsed into an overflow menu, the menu trigger is part of the tab order so keyboard users can access the hidden items.

For example, a keyboard user presses Tab three times to move through Home, then the overflow menu trigger, then the last visible ancestor link, and presses Enter on the overflow trigger to open the dropdown of collapsed items.

---

## 16. Supporting right-to-left text direction

In right-to-left languages, the trail direction mirrors: the root appears on the right and the current page on the left. Directional separator icons (such as chevrons) also reverse to point from parent to child in the correct reading direction.

For example, in an Arabic-language application, the trail reads from right to left as الرئيسية < المنتجات < الإلكترونيات, with the chevron pointing leftward.

---

## 17. Adapting to narrow viewports

On small screens or in narrow containers, the breadcrumb simplifies to show only the immediate parent of the current page as a back-navigation link, giving the user a one-step path to the previous level. This compact presentation preserves orientation and ancestor access without consuming excessive horizontal space.

For example, on a mobile phone viewing a product page nested under Home > Electronics > Laptops, the breadcrumb displays only "Laptops" with a back arrow, allowing the user to return to the Laptops category.

---

## 18. Maintaining readable and tappable targets on small screens

On small viewports, breadcrumb text and interactive elements remain large enough to read comfortably and to tap accurately. Even when the layout is condensed to a compact or mobile presentation, touch targets do not become so small that users struggle to activate them.

For example, on a 320px-wide mobile screen, the back-navigation link in the compact breadcrumb has sufficient height and padding that a user can tap it reliably without accidentally missing the target.
