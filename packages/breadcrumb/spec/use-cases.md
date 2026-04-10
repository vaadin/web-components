# Breadcrumb Use Cases

<!--
This file describes use cases for the component from the perspective of a
developer building a web application. It does NOT describe implementation,
API, properties, events, CSS, frameworks, or any technology choices — only
what users want to do with the component.
-->

## 1. Showing where the user is in a hierarchy

A user is browsing a business application that has content organized into
multiple levels — for example a product catalog (`Catalog → Clothing →
Women's → Shirts`), a file system (`Documents → Projects → 2026 → Q1
Report`), a settings screen (`Settings → Users → Permissions → Role
Editor`), or a documentation site (`Docs → Components → Inputs →
Text Field`). At any point the user wants to know which page they are on
and how it relates to the rest of the site, and they want an easy way to
jump back to any of the parent levels without using the browser back
button repeatedly.

The user expects to see a single horizontal trail near the top of the
page that lists each level from the root down to the current page.
Everything except the last entry is a link that navigates straight to
that level. The last entry represents the page they are currently on and
is visually distinct, not clickable, and announced as the current
location to assistive technologies. The separator between entries
(commonly a chevron or slash) is decorative and not read aloud by screen
readers. The trail as a whole is announced as a navigation landmark
called something like "breadcrumb" so screen reader users can jump to it
or skip past it.

This is by far the most common way the component is used and the
baseline that every application starts from.

---

## 2. Deep hierarchies and narrow containers

A user opens a deeply nested page — for example a support ticket buried
seven levels deep (`Home → Support → Cases → 2026 → Enterprise → Acme
Corp → Case #4821`), or the same page on a phone or a narrow side
panel where only two or three entries would fit on one line. The full
trail no longer fits in the available width.

The user still expects the trail to stay on a single line (breadcrumbs
should never wrap or cause horizontal scrolling of the whole page). They
expect the first entry (the root / home) and the last entry (the current
page) to remain visible so they never lose their place, while the
entries in the middle collapse into a single indicator — typically an
ellipsis ("…") — that reveals the hidden entries in a small popup when
activated. From that popup the user can jump to any of the hidden
ancestors. As the container is resized, the breadcrumb re-measures
itself and shows as many entries as will fit, collapsing or expanding
accordingly without flickering. The same behavior kicks in whether the
cause is "too many levels" or "not enough horizontal room".

---

## 3. An entry with a very long label

In the same hierarchy a single entry sometimes has a long title — for
example a document titled "Minutes of the Quarterly Planning Meeting,
March 15 2026 — Draft v3" shown as the current page, or a customer
name longer than the screen. Even after collapsing middle entries as
described above, one individual label can still be too long to fit.

The user expects that specific entry to be truncated with an ellipsis in
the middle or at the end of its own label, while the other entries and
the separators stay fully readable. Hovering or focusing the truncated
entry should still reveal the full label (for example via a tooltip) so
the information is never lost. The trail must still stay on one line.

---

## 4. Entries with icons or other visual content

In a file manager a user expects the first entry in the trail to be a
small home icon instead of the word "Home". In a project tool each
entry might be prefixed with an icon that indicates the type of that
level (a folder icon, a board icon, a task icon). In a visualization
drill-down (for example a treemap or a chart) each entry might carry a
small colored marker that matches the chart segment it came from.

The user expects each entry in the trail to be able to contain more
than plain text — an icon before the label, an icon instead of a
label, or other small visual content — while still being a single
clickable link, still aligning vertically with the rest of the trail,
and still being fully accessible (the icon-only home entry must still
have an accessible name like "Home").

---

## 5. Navigating sideways from an intermediate level

A user is deep inside a product detail page (`Shop → Electronics →
Laptops → ThinkPad X1`) and wants to jump to a sibling category —
say Tablets — without going all the way back up and then down again.
Rather than just clicking "Electronics" and re-navigating, they want
to use one of the intermediate entries in the trail itself to pick
another child of that level.

The user expects to be able to open a small menu attached to an
intermediate breadcrumb entry that lists the siblings at that level,
and selecting one navigates directly there. This is different from the
overflow popup in use case 2: here the menu is attached to a visible
entry and shows related branches, not hidden ancestors. The menu must
be reachable by keyboard and announced correctly to screen readers.

---

## 6. A trail that is built at runtime and changes as the user navigates

The developer of a single-page application wants the breadcrumb to
reflect the current route and update automatically as the user moves
around the app — no manual markup per page. In a charts drill-down
the trail grows as the user drills into segments and shrinks as they
drill back out. In a wizard-like browsing flow the page titles are
loaded asynchronously from the backend, so an entry may first appear
as a placeholder and then update to the real title once it arrives.
In a CRM, when the user opens a contact from the "Accounts" screen
the last entry should read "Back to Accounts", but when they open the
same contact from a search result it should read "Back to Search" —
the trail depends on where the user came from.

The user expects the breadcrumb to work correctly when its entries
are supplied as data and when that data changes at any time — entries
can be added, removed, or have their labels change without the trail
losing its place, its scroll position, or its current page marker.
Clicks on entries should integrate with the application's router so
that navigation does not trigger a full page reload and any
"unsaved changes" warnings still fire.

---

## 7. Non-clickable ancestor entries

A user in a permission-restricted admin application can see the page
they are on — say `Organizations → Acme → Users → Jane Doe` — but
does not have permission to view the Organizations list itself.
Similarly, a documentation site may have "index" levels that exist
only as a grouping and have no real page behind them.

The user expects such entries to still appear in the trail so that the
hierarchy is shown correctly, but to be visually marked as
non-interactive and not be focusable or activatable as links. The rest
of the trail continues to work normally.

---

## 8. Compact back-style navigation on small screens

A user is running the same application on a phone where even a
collapsed breadcrumb (use case 2) takes up too much space next to the
page title and action buttons. What they actually want on mobile is a
simple "back to the parent page" affordance, because that is the one
operation they perform 95% of the time at that screen size.

The user expects that on small screens (or when explicitly requested)
the breadcrumb switches to a compact form showing just a back arrow
and the label of the immediate parent — for example "← Acme Corp" —
that navigates one level up when activated. The full hierarchy is no
longer visible in this form, but the component still identifies itself
as navigation and the back affordance is fully keyboard and screen
reader accessible. When the screen grows again the full trail returns.
