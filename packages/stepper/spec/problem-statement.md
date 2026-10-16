# Stepper Problem Statement

## Problem

Users completing a long task that has been split into a linear sequence of steps — a checkout, an onboarding wizard, an application form — need to know how far along they are, what is still ahead, which steps are done, and which ones need attention. Without that overview, multi-step flows feel open-ended, users abandon them, and returning to fix an earlier step requires guesswork.

Today, Vaadin applications build this indicator by hand from layouts, icons and utility classes (for example the hand-rolled stepper in the Reindeer+ starter). Each application reinvents the numbering, the connector lines, the completed / error states, the responsive layout and — most often forgotten — the accessible semantics.

## Target Users

End users of business web applications that guide them through a sequential process, such as:

- **Checkout and ordering flows** — cart, shipping, payment, confirmation
- **Onboarding and setup wizards** — account, organisation, integrations, invite team
- **Long application or registration forms** split into sections — personal details, employment, documents, review
- **Back-office processes** with a fixed lifecycle — draft, review, approval, published

## Differentiation

### Tabs

Tabs switch between peer sections that can be visited in any order and have no notion of progress. A stepper communicates order and progress: steps are numbered, earlier steps can be completed or invalid, later steps are upcoming.

### Breadcrumbs

Breadcrumbs show the position in a hierarchy (ancestors of the current page). A stepper shows the position in a sequence. The breadcrumbs problem statement explicitly leaves sequential step flows out of scope.

### Progress Bar

A progress bar shows a single numeric value. A stepper names each stage, exposes per-step state (completed / invalid / current), and lets users jump back to an earlier step.

### Side Navigation

Side Nav is the application's primary navigation and has no notion of order or progress. A stepper is local to one task.

## Use Cases

1. **Showing progress through a wizard.** The user sees all steps of a process, which step they are on, which steps are already done, and how many remain.

   _Example: A customer on the "Shipping & billing" step of a checkout sees that "Shopping cart" is done and that "Payment method" and "Confirmation" are still ahead._

2. **Returning to an earlier step.** The user can jump back to a completed step to review or change their input, without losing their place.

   _Example: On the "Payment method" step, the customer clicks "Shopping cart" in the stepper to change a quantity._

3. **Seeing which steps need attention.** A step whose data is invalid is visually and audibly marked so the user knows where to go to fix it.

   _Example: After submitting, the "Nebulicious configuration" step is marked with an error icon because a required parameter is missing._

4. **Adapting to the available space.** On wide screens the steps run horizontally above the content; in narrow containers or side panels, they stack vertically with room for a description under each step.

## Discussion

**Q: Should the stepper also host the step content (panels) like Tabsheet does with Tabs?**

No, not in the first version. The stepper is an indicator / navigation component, comparable to Tabs. Applications already own the content area (often one route per step). A "wizard" component that combines a stepper, content panels and next / back buttons can be built on top of it later.

**Q: Should the component enforce linear progression (prevent skipping ahead)?**

No. The component visualises the state that the application gives it. Whether upcoming steps are reachable is expressed by the application, either by not giving them a `path` or by disabling them.
