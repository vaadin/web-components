# Breadcrumb Problem Statement

## Problem

Users navigating deep hierarchical structures in web applications often lose track of where they are and how to get back to a parent level. A breadcrumb component provides a compact, secondary navigation trail that shows the user's current position within the application hierarchy and offers one-click access to any ancestor level. Without breadcrumbs, users must rely on the browser back button, the primary navigation menu, or manual URL editing to retrace their steps -- all of which are slower and more error-prone, especially when the user arrived via a deep link, search result, or shared URL.

## Target Users

Breadcrumbs benefit users of applications with multi-level information architectures: admin consoles, content management systems, e-commerce catalogs, file managers, documentation portals, and enterprise dashboards. They are most valuable when pages are organized into a meaningful hierarchy at least two levels deep and when users frequently need to move between levels -- for example, navigating from a product detail page back to a category listing, or from a nested settings panel back to the top-level configuration view.

## Differentiation

- **Side Navigation** provides the primary persistent navigation structure for an application. It shows the full menu tree and lets users jump to any section. Breadcrumbs do not replace primary navigation; they supplement it by showing the path to the *current* page within that structure and offering quick upward traversal.
- **Tabs** switch between peer-level content views within the same page context. They represent siblings, not ancestors. Breadcrumbs represent a vertical slice through the hierarchy, not horizontal alternatives at one level.
- **Menu Bar** exposes actions and commands, not navigational location. Vaadin's own documentation explicitly states that Menu Bar should not be used for navigation.
- **Progress indicators / Steppers** show sequential progress through a multi-step workflow with a defined start and end. Breadcrumbs reflect position in a content hierarchy, not progress through a linear process. If the user is completing a wizard-like flow, a stepper is the correct pattern, not a breadcrumb.

## Real-World Examples

- **Google Cloud Console** uses breadcrumbs to let users navigate between project, service, and resource levels (e.g., Project > Cloud Storage > Bucket > Object).
- **Jira** displays breadcrumbs showing the project and board context above an issue detail view, allowing quick traversal back to the board or project.
- **Shopify Admin** uses breadcrumbs to navigate between store sections, product categories, and individual product pages.
- **AWS Management Console** shows hierarchical breadcrumbs across services and resource detail pages so users can quickly return to parent resource listings.
