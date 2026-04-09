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

## 2. Multiple Paths, Canonical Path Always Shown

A product can be reached from its category or from a promotional page, but the breadcrumb always shows the product's canonical category path — not the path the user took.

**Routes:**
- `/electronics/laptops/thinkpad-x1` — canonical path
- `/deals/black-friday/thinkpad-x1` — promotional path (same product page)

**Navigated via category:** `Home > Electronics > Laptops > ThinkPad X1 Carbon`

**Navigated via deals page:** `Home > Electronics > Laptops > ThinkPad X1 Carbon`

**Opened directly via URL:** `Home > Electronics > Laptops > ThinkPad X1 Carbon`

The breadcrumb always shows the canonical location. The entry path doesn't matter.

---

## 3. Multiple Paths, No Canonical — Only Current Page on Direct Entry

An employee page can be reached from either a department listing or a project listing. There is no single canonical path, so when the page is opened directly by URL, only the current page is shown.

**Routes:**
- `/departments/engineering` — Engineering
- `/departments/engineering/people/123` — Jane Doe (via department)
- `/projects/alpha` — Project Alpha
- `/projects/alpha/people/123` — Jane Doe (via project)

**Navigated from department:** `Engineering > Jane Doe`

**Navigated from project:** `Project Alpha > Jane Doe`

**Opened directly via URL `/departments/engineering/people/123`:** `Jane Doe`

Without navigation context and without a canonical path, only the current page name is shown.

---

## 4. Deep Navigation with Static Prefix

An HR tool where you can drill from one employee to their direct reports. The department part of the path is fixed structure; the employee chain is dynamic navigation. When a deep page is opened directly by URL, only the fixed structure and the current page are shown.

**Routes:**
- `/departments/engineering` — Engineering
- `/departments/engineering/people/alice` — Alice
- `/departments/engineering/people/alice/bob` — Bob (reports to Alice)
- `/departments/engineering/people/alice/bob/carol` — Carol (reports to Bob)

**Navigated through the chain:** `Engineering > Alice > Bob > Carol`

**Carol opened directly via URL:** `Engineering > Carol`

`Engineering` is always shown (fixed structure). The intermediate managers (`Alice > Bob`) are dropped because they are navigation context, not fixed hierarchy.

---

## 5. Breadcrumb Scoped to a Section

An application has a department management section with its own breadcrumb. The breadcrumb starts at the section root, not at the application root.

**Routes:**
- `/departments/engineering` — Engineering (section root)
- `/departments/engineering/frontend` — Frontend team
- `/departments/engineering/frontend/alice` — Alice

**Breadcrumb:** `Engineering > Frontend > Alice`

The application-level prefix (`Departments`) is not part of this section's breadcrumb.

---

## 6. Breadcrumb Showing Only Top Levels

A navigation sidebar shows breadcrumbs for the top-level structure only. Deeper views within a department are not reflected.

**Routes:**
- `/departments` — Departments
- `/departments/engineering` — Engineering
- `/departments/engineering/frontend` — Frontend team

**User is viewing the Frontend team page. Breadcrumb:** `Departments > Engineering`

`Frontend` is not shown because this breadcrumb only tracks the top two levels of the hierarchy.

---

## 7. Technical Route Segments Omitted

Some URL segments exist for routing/layout reasons and don't represent pages a user would navigate to. These are skipped in the breadcrumb.

**Routes:**
- `/` — Home
- `/settings/general` — General Settings
- `/settings/notifications` — Notification Settings

`/settings` is a layout wrapper that renders an inner navigation sidebar. It has no page of its own — visiting `/settings` redirects to `/settings/general`.

**Breadcrumb on the General Settings page:** `Home > General Settings`

`Settings` is omitted because it's not a standalone page.
