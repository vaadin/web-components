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

An employee belongs to both a department and a project. When opened directly by URL, no breadcrumb trail is shown — only the current page.

**Routes:**
- `/departments/engineering/jane-doe`
- `/projects/alpha/jane-doe`

**Navigated from department:** `Org > Engineering > Jane Doe`

**Navigated from project:** `Org > Project Alpha > Jane Doe`

**Opened directly via URL `/departments/engineering/jane-doe`:** `Jane Doe`

The breadcrumb only reflects how the user arrived. Without navigation history, there is no trail to show.

---

## 4. Deep Nested Relationships with Static Prefix

An HR tool where employees report to other employees. Opening a deeply nested employee directly by URL shows only the static organizational prefix, not the chain of managers.

**Routes:**
- `/org/engineering` — Engineering department
- `/org/engineering/employee/alice` — Alice (VP)
- `/org/engineering/employee/alice/employee/bob` — Bob (reports to Alice)
- `/org/engineering/employee/alice/employee/bob/employee/carol` — Carol (reports to Bob)

**Navigated through the chain:** `Org > Engineering > Alice > Bob > Carol`

**Carol opened directly via URL:** `Org > Engineering > Carol`

The static prefix (`Org > Engineering`) is always shown. The dynamic manager chain (`Alice > Bob`) is dropped because it represents navigation history, not fixed structure.

---

## 5. Breadcrumb Scoped to a Section

A department management section of an application. The breadcrumb starts at the department level because the section doesn't need to show higher-level navigation.

**Application routes:**
- `/org/engineering` — Engineering (section root)
- `/org/engineering/teams/frontend` — Frontend team
- `/org/engineering/teams/frontend/alice` — Alice

**Breadcrumb in the department section:** `Engineering > Frontend > Alice`

`Org` is not shown because this breadcrumb operates within the department section. The section root is Engineering.

---

## 6. Breadcrumb Scoped to a High-Level View

An executive dashboard that shows organizational navigation but not individual employee views.

**Application routes:**
- `/org` — Organization
- `/org/engineering` — Engineering
- `/org/engineering/teams/frontend` — Frontend team
- `/org/engineering/teams/frontend/alice` — Alice

**Breadcrumb in the dashboard:** `Org > Engineering`

The deeper routes (teams, employees) are not relevant at this abstraction level. The breadcrumb only shows the levels the dashboard cares about.

---

## 7. Technical Routes Omitted

Some URL segments exist for technical reasons (grouping, layout) and don't represent meaningful pages. These are skipped in the breadcrumb.

**Application routes:**
- `/app` — Home
- `/app/settings/account/profile` — Profile settings
- `/app/settings/account/security` — Security settings

`/app/settings` is a layout route with no content of its own. `/app/settings/account` is a redirect to `/app/settings/account/profile`.

**Breadcrumb:** `Home > Profile`

Both `settings` and `account` are omitted because they have no standalone content.
