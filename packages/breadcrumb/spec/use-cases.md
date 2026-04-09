# Breadcrumb Use Cases

## 1. Strict Hierarchy

A product catalog with a fixed tree structure. Each node has exactly one parent.

**Routes:**
- `/` — Home
- `/electronics` — Electronics
- `/electronics/laptops` — Laptops
- `/electronics/laptops/thinkpad-x1` — ThinkPad X1 Carbon

**Breadcrumb:** `Home > Electronics > Laptops > ThinkPad X1 Carbon`

The breadcrumb is fully determined by the URL structure.

---

## 2. Multiple Paths, Primary Path Shown

A product appears under both its category and a promotional page. When navigating to the product directly by URL, a predefined primary path is shown.

**Routes:**
- `/electronics/laptops/thinkpad-x1` — primary path
- `/deals/black-friday/thinkpad-x1` — alternative path (same product page)

**Navigated via category:**
`Home > Electronics > Laptops > ThinkPad X1 Carbon`

**Navigated via deals page:**
`Home > Deals > Black Friday > ThinkPad X1 Carbon`

**Opened directly via URL `/electronics/laptops/thinkpad-x1`:**
`Home > Electronics > Laptops > ThinkPad X1 Carbon`

The application defines Electronics > Laptops as the canonical parent for this product.

---

## 3. Multiple Paths, Direct Entry Shows No Ancestors

An employee can be reached from both the department page and the project page. When opened directly by URL, no breadcrumb trail is shown — only the current page.

**Routes:**
- `/departments/engineering` — Engineering
- `/departments/engineering/jane-doe` — Jane Doe (via department)
- `/projects/alpha` — Project Alpha
- `/projects/alpha/jane-doe` — Jane Doe (via project)

**Navigated from department:**
`Departments > Engineering > Jane Doe`

**Navigated from project:**
`Projects > Project Alpha > Jane Doe`

**Opened directly via URL `/departments/engineering/jane-doe`:**
`Jane Doe`

The breadcrumb only reflects how the user arrived. Without navigation history, there is no trail to show.

---

## 4. Deep Nested Relationships with Static Prefix

An HR tool where you can navigate from one employee to their direct reports. Opening a deeply nested employee directly by URL shows only the static organizational prefix, not the chain of managers.

**Routes:**
- `/departments/engineering` — Engineering
- `/departments/engineering/alice` — Alice (VP)
- `/departments/engineering/alice/bob` — Bob (reports to Alice)
- `/departments/engineering/alice/bob/carol` — Carol (reports to Bob)

**Navigated through the chain:**
`Departments > Engineering > Alice > Bob > Carol`

**Carol opened directly via URL:**
`Departments > Engineering > Carol`

The static prefix (`Departments > Engineering`) is always shown. The dynamic manager chain (`Alice > Bob`) is dropped because it represents navigation history, not fixed structure.

---

## 5. Breadcrumb Scoped to a Section

A department management section of an application. The breadcrumb starts at the department level because the section doesn't need to show higher-level navigation.

**Routes:**
- `/departments/engineering` — Engineering (section root)
- `/departments/engineering/frontend` — Frontend team
- `/departments/engineering/frontend/alice` — Alice

**Breadcrumb in the department section:**
`Engineering > Frontend > Alice`

`Departments` is not shown because this breadcrumb operates within the department section.

---

## 6. Breadcrumb Scoped to a High-Level View

An executive dashboard that shows organizational navigation but not individual employee views.

**Routes:**
- `/departments` — Departments
- `/departments/engineering` — Engineering
- `/departments/engineering/frontend` — Frontend team
- `/departments/engineering/frontend/alice` — Alice

**Breadcrumb in the dashboard:**
`Departments > Engineering`

The deeper routes (teams, employees) are not relevant at this abstraction level.

---

## 7. Technical Routes Omitted

Some URL segments exist for technical reasons (grouping, layout) and don't represent meaningful pages. These are skipped in the breadcrumb.

**Routes:**
- `/app` — Home
- `/app/settings/account/profile` — Profile settings
- `/app/settings/account/security` — Security settings

`/app/settings` is a layout route with no content of its own. `/app/settings/account` is a redirect to `/app/settings/account/profile`.

**Breadcrumb:** `Home > Profile`

Both `settings` and `account` are omitted because they have no standalone content.
