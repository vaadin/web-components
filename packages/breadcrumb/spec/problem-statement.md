# Breadcrumb Problem Statement

## Problem

In applications with multi-level hierarchical structures, users lose track of where they are and how to get back to a higher level. A breadcrumb trail shows the user's current location within the hierarchy and provides one-click navigation to any ancestor level, reducing the effort needed to move between levels without relying on the browser's back button or the application's primary navigation.

## Target Users

End users of business web applications that organize content hierarchically: file managers, content management systems, e-commerce product catalogs, admin dashboards with nested settings, project management tools with workspace/project/task hierarchies, and ERP systems with deeply nested master data. The component is most valuable when the hierarchy has three or more levels and users frequently move between levels.

## Differentiation

**Tabs / TabSheet** — Tabs switch between peer views at the same level; they do not represent a hierarchy. Breadcrumb shows the vertical path through a hierarchy, not horizontal alternatives within one level.

**Side Navigation** — Side Nav is a primary navigation component that presents the full navigational tree (or a subset of it) persistently. Breadcrumb is secondary navigation: it reflects the user's current position in the hierarchy and offers shortcuts upward, but it does not present the full tree or allow browsing siblings.

**Menu Bar** — Menu Bar exposes a flat or nested set of actions and commands. Breadcrumb exposes a linear path through a content hierarchy. Menu Bar is for triggering actions; Breadcrumb is for navigating to places.

**App Layout** — App Layout is a structural container that arranges the application shell (header, drawer, content area). Breadcrumb is a navigation widget that typically lives inside an App Layout but serves a different purpose.

**Link / Anchor** — A single link navigates to one destination. Breadcrumb is a structured trail of multiple links representing hierarchical levels, with separator visuals and overflow behavior that a standalone link does not provide.

## Use Cases

**Core: Navigating a content hierarchy.** A user is viewing a deeply nested page — for example, a product detail page inside a category inside a department in an e-commerce admin, or a specific configuration screen inside Settings > Security > Roles in an enterprise application. The breadcrumb trail shows each ancestor level, and the user clicks any ancestor to jump directly to that level without backtracking step by step.

**Variant: Long or deeply nested paths that exceed available space.** In a file manager or CMS with many hierarchy levels (e.g., 8+ folders deep) or levels with long names (e.g., "Q4 2025 Marketing Campaign Assets"), the full breadcrumb trail does not fit in the available horizontal space. The user needs the trail to remain usable — able to see where they are and access any ancestor — even when the path is too long to display in full.

**Variant: Navigating on a small viewport.** A user accesses the same hierarchical application on a phone or narrow browser window. The breadcrumb must remain useful despite severely limited horizontal space, letting the user at minimum navigate one level up and understand their current location.
