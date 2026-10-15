# View Layout

### Description

View Layout is a layout component that lets the developer build a view with a header, a scrollable content area and a footer. The header and the footer stay in place, and only the content area scrolls. The header has a title, a slot for a navigation button and a slot for actions. The component is available as a web component, a React component and a Flow component.

Feature request: https://github.com/vaadin/web-components/issues/224
Prototype: https://github.com/vaadin/web-components/compare/proto/view-layout

![View Layout in StarPass](https://github.com/user-attachments/assets/bf18032b-0ac3-4ccb-8c34-1ca6736870b6)

### Tier

Free

### License

Apache 2.0

### Motivation

#### Background

Business applications show most views as a header, a content area and a footer. Examples:

- A list view with a title, a back button and a grid
- A detail view with a title, an Edit button, tabs and a Save and Cancel row
- A side panel in a master-detail view with a close button and a title
- A chat thread with a message list and a message input row at the bottom
- A placeholder view with a title and a back button

Today, developers build these views from Vertical Layout, Horizontal Layout and Scroller. The StarPass reference application has 3 helper classes for this: `ViewFrame`, `ViewMain` and `ViewHeader`. The application uses them in 18 places. Card and Dialog have a header and a footer, but Card does not fill a view and Dialog is an overlay.

#### Problem

The developer cannot make a view with a fixed header and footer and a scrollable content area in 1 step. Each application makes its own composition, with these problems:

- The developer writes the same layout code and CSS in each application.
- The developer adds CSS class names to connect the parts. When the developer forgets a class name, the view breaks.
- The application cannot hide the bottom overflow indicator without a footer. StarPass uses a `:has()` selector on an empty footer for this.
- The title has no accessible link to the view. Each developer selects a heading level without a default.
- The paddings and the title alignment are different in each application.

The feature request is open since 2021: https://github.com/vaadin/web-components/issues/224

#### Solution

View Layout is a full-height layout with 3 parts: a header, a content area and a footer. The content area uses Scroller. The header has a slot for a navigation button, a title and a slot for other content. The component generates a heading from the `headerTitle` property.

The prototype has the 3 parts, the header slots, the generated heading and the `has-*` state attributes.

#### Notes

- The slot names follow Card. The `headerTitle` and `headingLevel` properties follow Dialog. A developer who knows these components can use View Layout without new terms.
- StarPass is the reference application. The prototype of the Flow component is in StarPass, in `ViewLayout.java` on the `wip/view-layout` branch.

### Use cases

Each use case is a view in StarPass: https://github.com/vaadin/starpass/tree/feat/flow

1. Show a list with a title and a navigation button (`header-prefix` slot, `headerTitle`, content that fills the height)
2. Show a detail view with actions and a footer (`header` slot, content scroll, `footer` slot)
3. Show a side panel in a master-detail view (close button, heading level, nested View Layout)
4. Show a chat thread with an input row at the bottom (`footer` slot, overflow indicators)
5. Show a counter at the end of the header (`header` slot alignment)
6. Show a different item in the same view instance (region updates from Flow)

### API Design Proposal

Java:

```java
var view = new ViewLayout("Booking details");
view.setHeaderPrefix(new Button(VaadinIcon.ARROW_LEFT.create()));
view.setHeader(new Button("Edit"));
view.add(tabSheet);
view.addToFooter(new Button("Cancel"), saveButton);
```

React:

```tsx
<ViewLayout headerTitle="Booking details">
  <Button slot="header-prefix" theme="tertiary icon" aria-label="Back">
    <Icon icon="vaadin:arrow-left" />
  </Button>
  <Button slot="header" theme="tertiary">
    Edit
  </Button>
  <TabSheet>{/* tabs */}</TabSheet>
  <HorizontalLayout slot="footer" theme="spacing">
    <Button>Cancel</Button>
    <Button theme="primary">Save</Button>
  </HorizontalLayout>
</ViewLayout>
```

Web component:

```html
<vaadin-view-layout header-title="Booking details" heading-level="2">
  <vaadin-button slot="header-prefix" theme="tertiary icon" aria-label="Back">
    <vaadin-icon icon="vaadin:arrow-left"></vaadin-icon>
  </vaadin-button>
  <vaadin-button slot="header" theme="tertiary">Edit</vaadin-button>

  <vaadin-tabsheet></vaadin-tabsheet>

  <vaadin-horizontal-layout slot="footer" theme="spacing">
    <vaadin-button>Cancel</vaadin-button>
    <vaadin-button theme="primary">Save</vaadin-button>
  </vaadin-horizontal-layout>
</vaadin-view-layout>
```

The API review must confirm these names:

- The component name: `ViewLayout` or `Panel`
- The `header-prefix` slot name
- The `title` slot

### Requirements

**Component and structure**

- [ ] `vaadin-view-layout` web component, `<ViewLayout>` React component and `ViewLayout` Flow component (`Component`)
- [ ] The component fills the height of its parent (default `height: 100%`).
- [ ] The component has 3 parts in this order: `header`, `content` and `footer`.
- [ ] When the content is taller than the content area, only the content area scrolls. The header and the footer stay in place.
- [ ] The `content` part is a `vaadin-scroller` element.
- [ ] When the developer adds a Grid with `height: 100%` to the content, the Grid fills the content area. The content area does not show a second scroll bar. (not verified in the prototype)
- [ ] When the developer adds a Side Nav or a Message List to the content, it fills the width of the content area. (not verified in the prototype)
- [ ] When the developer puts a View Layout in the content of another View Layout, each View Layout has its own header, content area and footer.
- [ ] When the developer adds a close button to the `header-prefix` slot of a nested View Layout, the button is before the title.

**Header**

- [ ] `headerTitle` property to set the title text (default empty)
- [ ] When `headerTitle` is set, the component adds a `<div role="heading">` element to the `title` slot. The element shows the title text.
- [ ] `headingLevel` property to set the `aria-level` of the generated heading (default `2`)
- [ ] When the developer adds an element to the `title` slot, the component removes the generated heading. The element from the developer stays. (to be confirmed in API review)
- [ ] When the developer clears `headerTitle`, the component removes the generated heading. (broken in the prototype)
- [ ] `header-prefix` slot for a navigation button or an icon before the title (to be confirmed in API review)
- [ ] `header` slot for other header content, for example action buttons or a counter
- [ ] When the title exists, the `header` slot content is at the end edge of the header. (not in the prototype)
- [ ] When the title is empty, the `header` slot content starts after the `header-prefix` slot.
- [ ] When the title and the `header` slot both have content, both are visible. (broken in the prototype)
- [ ] When the title text is longer than the space in the header, the title wraps to a new line. The header content does not overflow the component. (not verified in the prototype)
- [ ] When all header slots are empty, the `header` part is hidden. (not in the prototype)

**Footer**

- [ ] `footer` slot for actions or an input row at the bottom
- [ ] When the `footer` slot is empty, the `footer` part is hidden. (not in the prototype)
- [ ] The developer arranges the footer content with a Horizontal Layout or with CSS.

**Visual feedback**

- [ ] When the content is scrolled down, the top of the content area shows an overflow indicator. (not in the prototype)
- [ ] When the footer has content and the content continues below the content area, the bottom shows an overflow indicator. (not in the prototype)
- [ ] When the `footer` slot is empty, the content area does not show the bottom overflow indicator. (not in the prototype)
- [ ] When the user scrolls to the end of the content, the scroll does not continue to the page (`overscroll-behavior: contain`). (not in the prototype)

**States and accessibility**

- [ ] The component sets these state attributes on the host:
  - [ ] `has-title` when the `title` slot has content
  - [ ] `has-header-prefix` when the `header-prefix` slot has content
  - [ ] `has-header` when the `header` slot has content
  - [ ] `has-footer` when the `footer` slot has content
- [ ] The content area has an accessible name from the title. Screen readers announce the title when the focus moves into the content. (broken in the prototype)
- [ ] The tab order is: the `header-prefix` slot, the `header` slot, the content and the footer.
- [ ] The user can focus the `content` part with the keyboard and scroll it with the arrow keys, the same as in Scroller.
- [ ] Tested with NVDA, JAWS and VoiceOver

**Internationalization**

- [ ] RTL support. In RTL, the `header-prefix` slot is at the right edge and the `header` slot is at the left edge.

**Styles**

- [ ] Lumo and Aura styles
- [ ] The component has no background, border or shadow by default. The parent element gives the surface.
- [ ] The generated heading uses the same font size, font weight and line height as the Dialog title. (not in the prototype)
- [ ] `--vaadin-view-layout-padding` style property to set the padding of the header and the footer (default `var(--vaadin-padding-s)`) (not in the prototype, to be confirmed in API review)
- [ ] `--vaadin-view-layout-gap` style property to set the gap between the header items and between the footer items (default `var(--vaadin-gap-s)`) (not in the prototype, to be confirmed in API review)
- [ ] `--vaadin-view-layout-safe-area-inset-top` and `--vaadin-view-layout-safe-area-inset-bottom` style properties to add a safe-area padding to the header and the footer (default `0`) (not in the prototype, to be confirmed in API review)

**Same features as Card**

- [ ] `headerTitle`, `headingLevel` and the `title` slot work the same as `cardTitle`, `titleHeadingLevel` and the `title` slot in Card.
- [ ] The `header-prefix` and `footer` slots work the same as in Card.

**Flow**

- [ ] `ViewLayout(String title)` constructor
- [ ] `setTitle(String)`, `setTitle(String, Integer)`, `setTitle(Component)` work the same as in Card.
- [ ] `setHeadingLevel(Integer)` sets the heading level of the generated title. (to be confirmed in API review)
- [ ] `setHeaderPrefix(Component)` and `setHeader(Component)` set the header slots. When the argument is `null`, the slot becomes empty.
- [ ] `add(Component...)` adds components to the content. `removeAll()` removes the content components only.
- [ ] `addToFooter(Component...)` adds components to the footer. `getFooterComponents()` returns them.
- [ ] The developer can remove all footer components in 1 call. (to be confirmed in API review)
- [ ] When `beforeEnter` calls the setters again, the view shows the new item without old header or footer content.
- [ ] `HasSize`, `HasStyle` and `HasThemeVariant<ViewLayoutVariant>`
- [ ] Browserless tester `ViewLayoutTester` with methods to get the title text and the slot components

**React**

- [ ] React wrapper with typed properties for `headerTitle` and `headingLevel`

**Release**

- [ ] Documentation (new component page). It tells when to use View Layout, Card, Dialog and App Layout.
- [ ] Documentation example with View Layout in the master and detail areas of Master-Detail Layout
- [ ] Feature flag `viewLayoutComponent`. The component ships first as a preview.
- [ ] StarPass uses View Layout in place of `ViewFrame`, `ViewMain` and `ViewHeader`.

### Visual design

No Figma file yet. These values come from StarPass with the Aura theme.

Default state:

- Header padding: `var(--vaadin-padding-s)`
- Gap between header items: `var(--vaadin-gap-s)`
- Title line height: `2rem`
- Title margin: `0 var(--vaadin-gap-s)`
- Header and footer: no background, no border
- Content area: overflow indicators at the top and the bottom

### Nice-to-haves

- [ ] Below a breakpoint, the whole component scrolls, and the header and the footer scroll with the content. The issue lists this as a bonus criterion.
- [ ] Theme variant for a compact header with less padding, for the master area of Master-Detail Layout
- [ ] Theme variant that adds a surface background, a border and a border radius
- [ ] Theme variant that hides the overflow indicators

### Risks, limitations and breaking changes

#### Risks

- **Nested scroll**: A Grid, a Virtual List or a Message List scrolls by itself. In the Scroller, the content can show 2 scroll bars. The team tests the component with these components and adds a dev page for each.
- **Height**: When the parent has no defined height, the component grows with its content and the content area does not scroll. The documentation shows the parent layouts that give a height, for example App Layout and Master-Detail Layout.
- **Accessibility**: The prototype sets `aria-labelledby` on the host, but the host has no role. Screen readers ignore this name. The team selects a role or a different element for the name before the implementation.
- **Name**: The name "Panel" can make developers expect the Vaadin 8 Panel, with a border and a caption. The team confirms the name in the API review.

#### Limitations

- The footer has 1 slot. The developer arranges the left and the right content in the slot.
- The header and the footer always stay in place. The component has no mode where the whole component scrolls.
- The developer cannot get the internal Scroller from Flow.

#### Breaking changes

None. The component is new.

### Out of scope

- Separate left and right footer slots. One slot with a Horizontal Layout does the same task.
- Back button behavior and visibility. The application controls the navigation, for example with Master-Detail Layout.
- Overlay, modal and drag features. Dialog does these tasks.
- Application navigation and a drawer. App Layout does these tasks.
- A collapsible content area. Details does this task.
- A subtitle slot. The developer can add a title component with 2 lines to the `title` slot.

### Follow-ups

- **Scroll API**: When a view shows a new item, the developer wants to scroll the content to the top.
- **Shared theme rules**: Dialog, Card and View Layout can share the styles of the `header` and `footer` parts.

### Open questions

- Is the component name View Layout or Panel? Other options are View Frame and Header-Content-Footer Layout.
- Is the leading slot name `header-prefix`, as in Card, or `title-prefix`?
- Does the component keep the `title` slot, or does a custom title go to the `header` slot?
- Which element gets the accessible name from the title: the host with the `region` role, or the `content` part?
- Does the component add the safe-area padding by default, or only when the application sets a style property?
- Does the developer need an option to disable the internal Scroller, for content that scrolls by itself?

### Decisions

**Q: Does the header have a separate `header-suffix` slot?**

No. StarPass has a use case for a suffix, but the `header` slot covers it. When a title exists, the `header` slot shows its content at the end edge of the header. The team removed the suffix slot to make the API simpler.

**Q: Does content in the `header` slot replace the title?**

No. The prototype hid the title when the `header` slot had content, the same as Dialog. StarPass needs a title and actions in the same header, so both are visible.

**Q: Why is there a `header-prefix` slot?**

Each StarPass view has a navigation button before the title: a back button, a close button or a drawer toggle. The slot keeps the button outside the title, so `headerTitle` stays a text property.

**Q: Why is the heading level property `headingLevel` and not `titleHeadingLevel`?**

View Layout uses `headerTitle` from Dialog, so the heading level follows Dialog too. Dialog calls this property `headingLevel`.

**Q: Why does the generated title use `<div role="heading">` and not an `<h2>` element?**

Card and Dialog use the same pattern. The `aria-level` attribute changes the level without a new element.

**Q: Why does the component use Scroller for the content?**

The feature request asks for a scrollable content area. Scroller gives the overflow indicators and keyboard focus for the scroll area.

**Q: Why does the footer have 1 slot and not a left slot and a right slot?**

Dialog and StarPass use 1 footer slot. The developer arranges the buttons with a Horizontal Layout.

**Q: Why does the component have no surface styles by default?**

In StarPass, Master-Detail Layout gives the background and the border. A surface in View Layout shows a second border.

### Materials

- Feature request: https://github.com/vaadin/web-components/issues/224
- Prototype: https://github.com/vaadin/web-components/compare/proto/view-layout
- Use-case app and API gaps: https://github.com/vaadin/starpass/tree/feat/flow (no `API-GAPS.md` yet)
- Current helper classes: https://github.com/vaadin/starpass/blob/feat/flow/src/main/java/com/example/application/base/ui/ViewFrame.java
- Design: TBD
- Reference: Vaadin 8 Panel, https://demo.vaadin.com/sampler/#ui/structure/panel
- Reference: an earlier drawer prototype for App Layout, https://github.com/vaadin/vaadin-app-layout/issues/92

### Metrics

- The number of applications that use the component, from usage statistics, 6 months after the release.

### General criteria

- [ ] API reviewed: TBD
- [ ] Design: TBD
- [ ] Performance: TBD
- [ ] How to test: TBD

### Pre-implementation checklist

- [ ] Estimated (estimate entered into Estimate custom field)
- [ ] Product Manager sign-off
- [ ] Engineering Manager sign-off

### Pre-release checklist

- [ ] Documented (link to documentation provided in sub-issue or comment)
- [ ] UX/DX tests conducted and blockers addressed
- [ ] Approved for release by Product Manager

### Security review

Peer reviewed. The component shows `headerTitle` as text content, not as HTML.
