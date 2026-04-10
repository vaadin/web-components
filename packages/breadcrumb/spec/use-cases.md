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

## 5. Omitting Views from the Trail Start

The breadcrumb is relevant for only part of the application. Parent views preceding that part should be omitted from the trail. Applies to all the use cases above.

In this example, the breadcrumb is used only within the Department level of the application:

**Full hierarchy:** `Org > Department > Employee`

**Breadcrumb:** `Department > Employee`

`Org` is omitted because this breadcrumb is scoped to the Department section of the application.

---

## 6. Omitting Views from the Trail End

A view is displayed side-by-side with its parent view, and the breadcrumb is rendered in the parent view. The children of that parent should be omitted from the trail. Applies to all the use cases above.

In this example, the breadcrumb is displayed in the Employees view. When the user opens an individual employee in a side panel, the current view is still conceptually the Employees list:

**Full hierarchy:** `Org > Department > Employees > Jane Doe`

**Breadcrumb:** `Org > Department > Employees`

The selected employee (`Jane Doe`) is not in the trail because the breadcrumb belongs to the parent view.

---

## 7. Omitting Intermediate Views from the Trail

Some views exist only for technical/structural reasons and are never displayed on their own. These should be omitted from the trail. Applies to all the use cases above.

In this example, the `Employees` view is a layout wrapper that only exists to host employee sub-views — it has no content of its own:

**Full hierarchy:** `Org > Department > Employees > Jane Doe`

**Breadcrumb:** `Org > Department > Jane Doe`

`Employees` is omitted because it cannot be displayed on its own.

---

## 8. Programmatic Customization per Route

The application directly controls the breadcrumb trail. It can show any sequence of
items, independent of routes, hierarchy, or navigation history.

The application decides what appears in the trail. The breadcrumb component renders whatever items it is given.
