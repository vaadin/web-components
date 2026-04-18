# Breadcrumb Problem Statement

## Problem

Users navigating hierarchically structured web applications need a way to understand their current location within the hierarchy and quickly move up to ancestor pages. This is especially important when users arrive deep in a hierarchy via search results, bookmarks, or shared links and have no context for where they are in the application's structure.

## Target Users

End users of business web applications with multi-level hierarchical navigation, such as:

- **Content management systems** where editors navigate folders, categories, and nested content
- **E-commerce admin panels** where operators drill into product catalogs, order details, and customer records
- **Documentation portals** where readers browse topic hierarchies
- **File management interfaces** where users navigate directory structures
- **Enterprise dashboards** where analysts move between organizational units, projects, and detail views

Breadcrumbs are most valuable in applications with three or more navigation levels, where the primary navigation (e.g., side nav) may not fully convey the user's current depth.

## Differentiation

### Side Navigation

Side Navigation displays the full (or expandable) navigation tree persistently in a sidebar. It is the primary navigation mechanism. Breadcrumbs are a lightweight, secondary indicator that complements Side Nav by showing the current path inline above the page content. Breadcrumbs do NOT replace Side Nav or serve as primary navigation.

### Tabs

Tabs switch between peer-level content sections (horizontal siblings). Breadcrumbs show the vertical ancestor path. These are orthogonal: a page reached via tabs may still have a breadcrumb trail showing its position in the broader hierarchy.

### Progress Indicator

Progress indicators show position in a linear, sequential multi-step process (e.g., a checkout wizard). Breadcrumbs show position in a non-linear hierarchy. Sequential step flows are out of scope for breadcrumbs.

### Browser Back Button

The back button navigates through session history (temporal). Breadcrumbs navigate the information architecture (structural). Breadcrumbs should not replicate path-based history trails.

### Sibling Navigation

Some breadcrumb implementations include dropdown menus on items to browse sibling pages at the same hierarchy level. This is explicitly out of scope. Sibling browsing is handled by other navigation components. Breadcrumb items link only to ancestors.

## Use Cases

1. **Navigating up a hierarchy.** A user is viewing a deeply nested page (e.g., a product detail page in an admin panel, a specific document in a knowledge base, or a configuration screen several levels deep) and wants to move up to a parent or grandparent page. The breadcrumb trail shows the full path from the root to the current page, and each ancestor is a link the user can click to jump directly to that level.

2. **Orienting after a deep landing.** A user arrives at a page deep in the application via a search result, a bookmarked URL, or a link shared by a colleague. They have no context for where this page sits in the application structure. The breadcrumb trail immediately communicates the page's position in the hierarchy without requiring the user to explore the navigation.

3. **Navigating a dynamic or user-driven hierarchy.** The hierarchy is not a fixed site map but is constructed from application data. For example, a user browses a product catalog filtered by category, or navigates an organizational chart where the path depends on the data rather than a static page structure. The application provides the trail dynamically, and the breadcrumb reflects whatever hierarchy the application defines.

4. **Working within a long trail in limited space.** A user is deep in a hierarchy with many levels (e.g., a file system path six or more folders deep), and the full breadcrumb trail does not fit the available horizontal space. The breadcrumb must handle overflow gracefully so the user can still see the most relevant parts of the trail and access the hidden items.

5. **Viewing the breadcrumb on a small screen.** A user accesses the application on a mobile device or a narrow viewport. The breadcrumb must remain usable without wrapping to multiple lines or consuming excessive vertical space, even when the trail has several items.

## Discussion

**Q: Should breadcrumb items support sibling navigation (dropdown menus to browse sibling pages at the same level)?**

No. Breadcrumb items are plain links to ancestors only. Sibling browsing is handled by other navigation components such as Side Nav. This keeps the breadcrumb focused on its core purpose of vertical hierarchy navigation.

**Q: Should the breadcrumb scope include attribute-based trails (e.g., e-commerce filter paths), or only location-based hierarchy?**

The breadcrumb should support both a static hierarchy (reflecting the application's information architecture) and a dynamic hierarchy provided by the application. The component does not need to distinguish between the two -- it renders whatever trail the application supplies. This covers location-based paths, data-driven paths, and attribute-based paths alike.
