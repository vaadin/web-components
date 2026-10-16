# Panel

### Description

Panel is a layout component that lets the developer build a view with a header, a scrollable content area and a footer. The header and the footer stay in place, and only the content area scrolls. The header has a slot for a navigation button, a title and a slot for actions at the end edge. The component is available as a web component, a React component and a Flow component.

Feature request: https://github.com/vaadin/web-components/issues/224
Prototype: https://github.com/vaadin/web-components/compare/proto/panel

### Tier

Free

### License

Apache 2.0

### Motivation

#### Background

Business applications show most views as a header, a content area and a footer. Examples:

- A list view with a drawer toggle, a title and a grid
- A detail view with a back button, a title, a status badge, tabs and a row of actions at the bottom
- An editor with a close button, a title, and Cancel and Save buttons in the header
- A side panel in Master-Detail Layout with a close button and a title
- A chat thread with a message list and a message input row at the bottom

Today, developers build these views from Vertical Layout, Horizontal Layout and Scroller. The StarPass reference application has 3 helper classes for this task: `ViewFrame`, `ViewMain` and `ViewHeader`. Card and Dialog have a header and a footer, but Card does not fill a view and Dialog is an overlay.

#### Problem

The developer cannot make a view with a fixed header and footer and a scrollable content area in 1 step. Each application makes its own composition, with these problems:

- The developer writes the same layout code and CSS in each application.
- The application cannot hide the bottom overflow indicator without a footer. StarPass uses a `:has()` selector on an empty footer for this.
- The view has no accessible name from its title. Each developer selects a heading level without a default.
- The paddings and the title alignment are different in each application.

The feature request is open since 2021: https://github.com/vaadin/web-components/issues/224

#### Solution

Panel is a full-height layout with 3 parts: a header, a content area and a footer. Each slot has 1 fixed position. The component generates a heading from the `headerTitle` property and labels itself with the title.

The prototype has these features:

- The `header-prefix`, `title`, `header-suffix`, default and `footer` slots
- The generated heading, and the region role with a name from a generated or a slotted title
- The hidden header and footer when they have no content
- Overflow indicators on the header and footer edges, with the same pattern as Dialog
- A content area that is a tab stop only when its content overflows

#### Notes

- The slot names follow Card. The `headerTitle` and `headingLevel` properties follow Dialog.
- StarPass is the reference application. It has 2 families of views. Masters show a Grid or a Side Nav that scrolls by itself. Detail views use a Scroller and a footer.
- This prototype is an alternative to the View Layout prototype on the `proto/view-layout` branch. The Decisions section lists the differences.

### Use cases

Each use case is a section of the dev page `dev/panel.html` on the prototype branch. Each section copies a StarPass view.

1. Show a list with a drawer toggle and a title (`header-prefix` slot, `headerTitle`, a Grid that fills the content area, no footer)
2. Show booking details with a status and a stacked footer (`title` slot with a subtitle line, `header-suffix` slot, tabs, `footer` slot with 2 rows)
3. Show planet details with a favorite button and a hero image (`header-suffix` slot, content without padding, 1 footer button)
4. Show a placeholder view (back button, title, centered text, no footer)
5. Show a chat thread with an input row at the bottom (`header-suffix` slot, message list, `footer` slot)
6. Show a panel in the master area and in the detail area of Master-Detail Layout (close button in the detail panel, region name)
7. Edit a user with Cancel and Save in the header (2 `header-suffix` children, content that loads after 1 second, content tab stop)

### API Design Proposal

Java (sketch, no code in the prototype):

```java
@Tag("vaadin-panel")
@JsModule("@vaadin/panel/src/vaadin-panel.js")
public class Panel extends Component implements HasEnabled, HasSize, HasStyle {
    public Panel();
    public Panel(Component... content);
    public Panel(String title);
    public Panel(String title, Component... content);

    // Title, same shape as Card
    public void setTitle(String title);                  // headerTitle, removes a title component
    public void setTitle(String title, Integer headingLevel);
    public void setTitle(Component title);               // slot="title", clears headerTitle
    public Component getTitle();                         // the title component, or null
    public String getTitleAsText();                      // headerTitle, or ""
    public void setHeadingLevel(Integer level);          // headingLevel, 1 to 6, null resets to 2
    public Integer getHeadingLevel();

    // Single-occupant slot
    public void setHeaderPrefix(Component component);    // null empties the slot
    public Component getHeaderPrefix();

    // Multi-occupant areas
    public HasComponents getContent();
    public HasComponents getHeaderSuffix();
    public HasComponents getFooter();

    // Content shortcuts
    public void add(Component... components);            // getContent().add
    public void add(Collection<Component> components);
    public void add(String text);
    public void remove(Component... components);         // getContent().remove
    public void remove(Collection<Component> components);
    public void removeAll();                             // getContent().removeAll
}
// No HasComponents. getChildren() is not overridden.
// No HasThemeVariant until a variant exists.
```

```java
var panel = new Panel("Edit User", form);
panel.setHeaderPrefix(closeButton);
panel.getHeaderSuffix().add(cancelButton, saveButton);
panel.getFooter().add(deleteButton);
```

React (generated wrapper, sketch only):

```tsx
<Panel headerTitle="Booking Details">
  <Button slot="header-prefix" theme="tertiary icon" aria-label="Back">
    <Icon icon="vaadin:arrow-left" />
  </Button>
  <Badge slot="header-suffix">Confirmed</Badge>
  <TabSheet>{/* tabs */}</TabSheet>
  <Button slot="footer">Refund</Button>
  <Button slot="footer" theme="error">
    Cancel Booking
  </Button>
</Panel>
```

Web component:

```html
<vaadin-panel header-title="Edit User" heading-level="2">
  <vaadin-button slot="header-prefix" theme="tertiary icon" aria-label="Close">...</vaadin-button>
  <vaadin-button slot="header-suffix" theme="tertiary">Cancel</vaadin-button>
  <vaadin-button slot="header-suffix" theme="primary">Save</vaadin-button>
  <form>...</form>
  <vaadin-button slot="footer">Delete</vaadin-button>
</vaadin-panel>
```

The API review must confirm these names:

- The component name `Panel`
- The `header-prefix` and `header-suffix` slot names
- The Flow container accessors `getContent()`, `getHeaderSuffix()` and `getFooter()`, and the `add`, `remove` and `removeAll` shortcuts
- The name of the shared V26 interface for the shortcuts, with `HasContent` as the working name

### Requirements

**Component and structure**

- [ ] `vaadin-panel` web component, `<Panel>` React component and `Panel` Flow component (`Component`)
- [ ] The component fills the height of its parent (default `height: 100%`).
- [ ] The component has 3 parts in this order: `header`, `content` and `footer`.
- [ ] When the content is taller than the content area, only the content area scrolls. The header and the footer stay in place.
- [ ] The `content` part is a plain element. It has no padding.
- [ ] When the developer adds a Grid with `height: 100%` to the content, the Grid fills the content area. The content area does not show a second scroll bar.
- [ ] When the developer adds an image to the content, the image touches the side edges of the component.

**Header**

- [ ] `headerTitle` property to set the title text (default empty)
- [ ] When `headerTitle` is set, the component adds a `<div role="heading">` element to the `title` slot. The element shows the title text.
- [ ] `headingLevel` property to set the `aria-level` of the generated heading (default `2`)
- [ ] When the developer adds an element to the `title` slot, the component removes the generated heading. The `headerTitle` value stays.
- [ ] When `headerTitle` changes while a slotted title exists, the slotted title stays.
- [ ] When the developer removes the slotted title and `headerTitle` is set, the component restores the generated heading.
- [ ] When the developer removes the slotted title, its content stays unchanged.
- [ ] When the developer adds the same title element again, the host is labelled by it again.
- [ ] When the developer clears `headerTitle`, the component removes the generated heading.
- [ ] `header-prefix` slot for a back button, a close button or a drawer toggle before the title
- [ ] `header-suffix` slot for actions, a badge or a counter at the end edge of the header
- [ ] When the `header-suffix` slot has 2 or more children, the children are in a row with a gap.
- [ ] When the title is empty, the `header-suffix` slot content stays at the end edge.
- [ ] When the title text is longer than the space in the header, the title wraps to a new line. The suffix stays inside the header.
- [ ] When all header slots are empty, the `header` part is hidden.

**Footer**

- [ ] `footer` slot for actions or an input row at the bottom
- [ ] When the `footer` slot has 2 or more children, the children are in a row with a gap.
- [ ] When the `footer` slot is empty, the `footer` part is hidden.

**Visual feedback**

- [ ] When the content is scrolled down, the bottom edge of the header shows a line.
- [ ] When the footer has content and the content continues below the content area, the top edge of the footer shows a line.
- [ ] When the `footer` slot is empty, the component does not show the bottom line.
- [ ] When the user scrolls to the end of the content, the scroll does not continue to the page (`overscroll-behavior: contain`).
- [ ] When a child at the top or the bottom edge of the content has focus, the focus ring is fully visible.

**States and accessibility**

- [ ] The component sets these state attributes on the host:
  - [ ] `has-title` when the `title` slot has content
  - [ ] `has-header-prefix` when the `header-prefix` slot has content
  - [ ] `has-header-suffix` when the `header-suffix` slot has content
  - [ ] `has-footer` when the `footer` slot has content
  - [ ] `overflow` with the values `top`, `bottom`, `start` and `end` when the content overflows in that direction
- [ ] The host has the `region` role by default. When the developer sets a different role, the component keeps it.
- [ ] The host has `aria-labelledby` that points to the generated heading or to the slotted title. When no title exists, the component removes `aria-labelledby`.
- [ ] When the host role is `none` or `presentation`, the component does not set `aria-labelledby`.
- [ ] When the slotted title has no `id`, the component generates one.
- [ ] When the content overflows, the `content` part is a tab stop. When the content does not overflow, the `content` part has no `tabindex`.
- [ ] When the user clicks empty space in the content area, the `content` part does not take focus.
- [ ] The tab order is: the `header-prefix` slot, the title, the `header-suffix` slot, the content and the footer.
- [ ] Tested with NVDA, JAWS and VoiceOver (not in the prototype)

**Internationalization**

- [ ] When the page direction is RTL, the `header-prefix` slot is at the right edge and the `header-suffix` slot is at the left edge.

**Styles**

- [ ] Lumo and Aura styles (not in the prototype)
- [ ] The component has no background, border or shadow by default. The parent element gives the surface.
- [ ] The generated heading uses the same font size, font weight and line height as the Dialog title. (not in the prototype)
- [ ] `--vaadin-panel-padding` style property to set the padding of the header and the footer (default `var(--vaadin-padding-s)`)
- [ ] `--vaadin-panel-gap` style property to set the gap between the header items and between the footer items (default `var(--vaadin-gap-s)`)

**Same features as Dialog and Card**

- [ ] `headerTitle` and `headingLevel` work the same as in Dialog.
- [ ] The `title`, `header-prefix`, `header-suffix` and `footer` slot names are the same as in Card.
- [ ] The overflow indicators work the same as in Dialog.

**Flow**

- [ ] `Panel()`, `Panel(Component...)`, `Panel(String title)` and `Panel(String title, Component... content)` constructors
- [ ] `setTitle(String)`, `setTitle(String, Integer)`, `setTitle(Component)`, `getTitle()` and `getTitleAsText()` work the same as in Card.
- [ ] When the developer calls `setTitle(String)`, the component removes the title component. When the developer calls `setTitle(Component)`, the component removes `headerTitle`.
- [ ] `setHeadingLevel(Integer)` sets the `headingLevel` property. When the argument is `null`, the component removes the property and the default level 2 applies. `getHeadingLevel()` returns `null` in that case.
- [ ] `setHeaderPrefix(Component)` sets the `header-prefix` slot. When the argument is `null`, the slot becomes empty.
- [ ] `getContent()`, `getHeaderSuffix()` and `getFooter()` return a `HasComponents` view of their area. Each call returns the same instance.
  - [ ] `getChildren()` on a view lists the children of that area only.
  - [ ] `add` on a view sets the `slot` attribute of the area. A component that moves from another area leaves that area.
  - [ ] `removeAll()` on a view clears that area only.
  - [ ] `remove` on a view throws `IllegalArgumentException` for a child of the panel in another area. For a component with no parent, it does nothing.
  - [ ] `add(String)` on `getHeaderSuffix()` or `getFooter()` throws `IllegalArgumentException`.
- [ ] `add`, `remove` and `removeAll` on the panel act on the content area only.
- [ ] `getContent().bindChildren(...)` binds the content area to a signal. `bindChildren` on a named area throws `UnsupportedOperationException`.
- [ ] `getChildren()` returns all children of all areas. The component does not override it.
- [ ] `HasEnabled`, `HasSize` and `HasStyle`. `setEnabled` on a view throws and names `Panel.setEnabled`.
- [ ] When a view keeps its children as fields, `beforeEnter` updates their data and adds nothing again.
- [ ] Feature flag `panelComponent`. When the flag is off, attaching the component throws `PanelExperimentalFeatureException`.
- [ ] Browserless tester `PanelTester` with methods to get the title text and the components of each area

**React**

- [ ] React wrapper with typed properties for `headerTitle` and `headingLevel`

**Release**

- [ ] Documentation (new component page). It tells when to use Panel, Card, Dialog and App Layout.
- [ ] Documentation example with Panel in the master and detail areas of Master-Detail Layout
- [ ] Feature flag `panelComponent`. The component ships first as a preview.
- [ ] StarPass uses Panel in place of `ViewFrame`, `ViewMain` and `ViewHeader`.

### Visual design

No Figma file yet. The prototype has base styles only.

Default state:

- Header and footer padding: `var(--vaadin-padding-s)`
- Gap between header items and between footer items: `var(--vaadin-gap-s)`
- Header and footer: no background, no border
- Content area: no padding

Scrolled state:

- Header bottom edge and footer top edge: a 1px line in `var(--vaadin-border-color-secondary)`

### Nice-to-haves

- [ ] Below a breakpoint, the whole component scrolls, and the header and the footer scroll with the content. The issue lists this as a bonus criterion.
- [ ] Theme variant that adds a surface background, a border and a border radius
- [ ] Safe-area padding for the header and the footer on mobile devices

### Risks, limitations and breaking changes

#### Risks

- **Landmark noise**: Each panel is a named region. App Layout `main` plus 2 panels in Master-Detail Layout gives 3 landmarks. A screen reader check on use case 6 decides the default role.
- **Name**: "Panel" implies a surface. The prototype has no surface. A surface variant is a follow-up.
- **Content under the header edge**: The header and the footer have no background. About 4px of scrolled content shows under the header bottom edge and above the footer top edge. Dialog has the same effect.
- **Focus lost on shrink**: When the content shrinks while the `content` part has focus, the component removes `tabindex`. The browser then moves focus to the page body.
- **Meta packages**: On the prototype branch, `yarn release:meta --check` fails. The script adds each Apache 2.0 package to `vaadin-core`. The release work regenerates the meta packages. The exact output is:

```
$ node scripts/generateMetaPackages.js --check
The meta packages are out of date: packages/vaadin-core/package.json, packages/vaadin-core/vaadin-core.js
Run `yarn release:meta` and commit the result.
```

- **React package**: The React packages do not include Panel yet. The release work adds the wrapper.

#### Limitations

- The `header-prefix` slot and the Flow title component take 1 component each.
- A full-width custom header layout goes into the `title` slot, between the prefix and the suffix.
- A stacked footer with 2 rows needs a Vertical Layout with `flex: 1` in the `footer` slot.
- Scroller themes and the Scroller style properties do not apply to the content area.
- When the header is hidden, the component shows no top line when the content scrolls.
- The component does not track the growth of a bare text node or a `display: contents` child in the content. When the developer adds or removes a child, the component checks the overflow again.
- The focus ring space is at the top and the bottom only. A focus ring of a child at a side edge is clipped.

#### Breaking changes

None. The component is new.

### Out of scope

- Back button behavior and visibility. The application controls the navigation, for example with Master-Detail Layout.
- Overlay, modal and drag features. Dialog does these tasks.
- Application navigation and a drawer. App Layout does these tasks.
- A collapsible content area. Details does this task.
- A `header` slot that replaces the title. The `title` slot takes custom header content.

### Follow-ups

- **StarPass Flow class**: A StarPass-local Flow `Panel` class replaces `base/ui/ViewLayout.java`. It proves the area views and the shortcuts on 6 detail views and the user editor.
- **Screen reader check**: The team checks the region role on use case 6 with NVDA and VoiceOver.
- **Themes**: Lumo and Aura styles, with indicator lines and a surface variant.
- **Card and Dialog**: Card and Dialog add the same area views in 25.x. In V26 they drop `HasComponents` and implement the shared shortcut interface.
- **Shared class in Flow**: The area views come from an internal `SlotContentManager` class in flow-components. A Flow issue asks to move it to `flow-server`.
- **Tooling**: Copilot and the browserless-test remove helper check for `HasComponents`. Both need a Panel case before the feature flag goes away.
- **Scroll API**: When a view shows a new item, the developer wants to scroll the content to the top.
- **Issue update**: The team posts the prototype link and the decisions in issue #224.

### Open questions

- Does the component keep the default `region` role after the screen reader check on use case 6, or does it remove the role and accept no name?
- Does the component add a `subtitle` slot or a `headerSubtitle` property for the Booking Details case?

### Decisions

**Q: Which header slots does the component have?**

The header has 3 slots: `header-prefix`, `title` and `header-suffix`. Each slot has 1 fixed position, and the suffix is always at the end edge. This shape matches the StarPass views: a navigation button, a title, and 1 or more items at the end edge.

Rejected options:

- A `header` slot that moves to the end edge only when a title exists. The alignment changes with other slots, and "header" is both a slot and a part.
- The 4 slots of the View Layout prototype, with a `header` slot that hides the title. Readers of the issue found the override hard to follow.

**Q: Why does the Flow component not implement `HasComponents`?**

The panel has 3 areas that hold several components: the content, the header suffix and the footer. `HasComponents` on the panel makes `removeAll()`, `addComponentAtIndex()` and `getChildren()` ambiguous across these areas. This is the problem of flow-components#9280.

The Flow API gives each area the API that fits it:

- The title and the header prefix hold 1 component each. They have a setter and a getter, as in Card.
- The content, the header suffix and the footer each have a `HasComponents` view: `getContent()`, `getHeaderSuffix()` and `getFooter()`.
- `add`, `remove` and `removeAll` on the panel are shortcuts for `getContent()`.
- The component does not override `getChildren()`, so the component tree stays true for Copilot and browserless tests.

Rejected options:

- `HasComponents` for the content plus setters for the slots, the Card model. With a `getChildren()` override, the tree is wrong. Without it, `removeAll()` also clears the header.
- A replace setter for each area, for example `setFooter(Component...)` and `getFooterComponents()`. Card and Dialog cannot use this shape without a new idiom. The area views can be the shared shape for Panel, Card and Dialog.

**Q: Why does the Flow API use area views and not replace setters?**

The first draft had replace setters and `clear()`. The issue comment https://github.com/vaadin/web-components/issues/224#issuecomment-6216165803 replaced them with area views, based on the discussion in flow-components#9280. Card and Dialog can add the same views in 25.x and drop `HasComponents` in V26. `add` of a child that is already attached does not duplicate it, so a reused view needs no `clear()`.

**Q: Are the web component properties `headerTitle` and `headingLevel`?**

Yes. The names are the same as in Dialog. `headerTitle` does not clash with the native `title` attribute, which shows a tooltip. The names do not repeat the component name, as `panelTitle` would. The Flow title methods follow Flow Card: `setTitle()`, `getTitle()` and `getTitleAsText()`.

**Q: Why is the Flow heading level method `setHeadingLevel` and not `setTitleHeadingLevel`?**

The name matches the web component property `headingLevel`. Flow Accordion and Login use the same name. Flow Card uses `setTitleHeadingLevel`, but the panel property has no `title` prefix.

**Q: Why does the host have the `region` role by default?**

With no role, there is no name. A screen reader ignores `aria-labelledby` on an element with no role. The View Layout prototype had this problem. The region role makes the title the name of the panel. When the focus moves into the content, screen readers announce the name.

Rejected options:

- `aria-labelledby` on the shadow `content` part. An ID reference does not cross shadow roots. `ariaLabelledByElements` can, but browser support is recent.
- No default role. The panel then has no name.

**Q: Why does the component label the host from a slotted title?**

Booking Details uses a slotted title with a subtitle line. Without the label, that panel has no name. The component gives the slotted element an `id` when it has none. Card does not do this.

**Q: Which title wins when the developer sets `headerTitle` and a slotted title?**

The slotted title wins, and the component keeps the `headerTitle` value. When the developer removes the slotted title, the generated heading comes back. A Flow view can then remove and add the same title component again. Card removes the slotted title instead.

**Q: When is the content area a tab stop?**

The `content` part has `tabindex="0"` only when the content overflows. A Grid or a Side Nav that fills the content area adds no extra tab stop. When the content does not overflow, the `content` part has no `tabindex`, so a click on empty content does not move focus to it.

Rejected options:

- Always `tabindex="0"`, the Scroller default. This adds a tab stop to 8 StarPass master views.
- No `tabindex`. Chromium and Firefox focus a scroll container that has no focusable child, Safari does not. The behavior is then different in each browser.

**Q: Why does the content area not use Scroller?**

The `content` part is a plain element, and the component uses `OverflowController` with this element as the scroll target. The indicators are lines on the header and footer edges, the same as in Dialog. TabSheet and Dialog use the same pattern.

A `vaadin-scroller` inside the shadow DOM needed these workarounds:

- Its overflow check saw only a `<slot>` child, so the `overflow` attribute became stale.
- Its default `tabindex="0"` needed an override.
- Its default padding needed an override for full-width content.
- Its bottom indicator needed a theme switch to hide it without a footer.

The plain element removes all these workarounds. Without a footer, the footer is hidden, so the bottom line is hidden too.

**Q: How is this prototype different from the View Layout prototype?**

- No `header` slot that replaces the title. The `header-suffix` slot is always at the end edge.
- The suffix alignment works. In View Layout, `flex: 1` was on `<slot>` elements, which have `display: contents`.
- The host has the `region` role, so the title gives a name.
- The component labels the host from a slotted title too.
- The content area is a plain element with `OverflowController`, not a `vaadin-scroller`.
- Empty header and footer parts are hidden.

**Q: Does the component have a surface?**

No. In StarPass, Master-Detail Layout gives the background and the border. A surface in the panel shows a second border. A surface variant is a follow-up.

### Materials

- Feature request: https://github.com/vaadin/web-components/issues/224
- Prototype: https://github.com/vaadin/web-components/compare/proto/panel
- Earlier prototype: https://github.com/vaadin/web-components/compare/proto/view-layout
- Use-case app: https://github.com/vaadin/starpass/tree/wip/view-layout
- Flow caveat: https://github.com/vaadin/flow-components/issues/9280
- Design: TBD

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
