### Generic

[Won’t fix: this works the same in Lumo at the moment]
- Inconsistent font styles. `<vaadin-button>` sets material font style over contents, while some others (`<vaadin-checkbox>`, `<vaadin-radio-button>`) use inherited font.
- Some elements have `will-change` in the styles, which might slow down the grid scrolling. Especially important for `<vaadin-checkbox>`.

### `<vaadin-button>`

[Won’t fix: this was actually by design like this, so that you can have a colored text button – let’s revise these when we update to the new specs]
- Expected primary button to have white on primary colors. Actual: primary on white.
  - With a `raised` theme variant, works as expected.

### `<vaadin-combo-box>`

- The label floating transition happens on first render (apparently [has-value] is applied after first render). Happens with vaadin-date-picker as well, but not with vaadin-dropdown-menu.

### `<vaadin-context-menu>`

- Last activated item is marked as selected

[Real solution is to implement focus-follows-mouse option for list-box]
- ~~Expected: mouse hover is not confused with focused item. Actual:~~
  - ~~hover and focused items have the same appearance,~~
  - ~~mouse hover on the menu makes the focused item to appear as regular item,
  - ~~keyboard navigation appears broken when mouse is over the menu, and works fine if mouse is outside.~~

Note: see `<vaadin-list-box>`, `<vaadin-item>`.

### `<vaadin-dialog>`

- There is a `.buttons` class exposed for arbitary users’s template. Should we scope it?

### `<vaadin-dropdown-menu>`

[Real solution is to implement focus-follows-mouse option for list-box]
- ~~Expected: mouse hover is not confused with focused item. Actual:~~
  - ~~hover and focused items have the same appearance,~~
  - ~~mouse hover on the menu makes the focused item to appear as regular item,~~
  - ~~keyboard navigation appears broken when mouse is over the menu, and works fine if mouse is outside.~~

### `<vaadin-form-layout>`

- Expected: the column gap is `24px`. Actual: `2em`, which is `32px` with default font size. See: https://material.io/guidelines/layout/responsive-ui.html#responsive-ui-grid

### `<vaadin-grid>`

- Expected: header cells have the same style in different the browsers. Actual: centered bold in Firefox, regular start-aligned in Chrome; borders around header cells in Chrome, no borders in Firefox, no background in Firefox.
- Expected: `<vaadin-grid-filter>` text field does not add vertical spacing in the cell. Actual: margin above and below the filter, same as in material `<vaadin-text-field>`.
- Material `<vaadin-checkbox>` is vertically misaligned in the grid.
  - Expected: `<vaadin-selection-column>` checkbox is on the same line with regular column text content. Actual: it is below the line in Chrome.
  - Similar issue in all browsers when material `<vaadin-checkbox>` is used in a template content.
- Expected: material icons in `<vaadin-grid-tree-toggle>`. Actual: triangles from builtin styles, could be confusing with dropdown menu toggle icon.
- Expected: frozen column’s left and right edges are seamless (as in regular columns), or drops a shadow on the regular column when it is floating above. Actual: frozen column always has a border on the right edge.

### `<vaadin-notification>`

- Missing shadows. By material design guidelines, whenever some thing has higher z position over others, it should cast a shadow, so that the elevation level is indicated with the shadow size/look. Expected: snackbar elevation level: “Snackbars appear above most elements on screen, and they are equal in elevation to the floating action button. However, they are lower in elevation than dialogs, bottom sheets, and navigation drawers.” — https://material.io/guidelines/components/snackbars-toasts.html
  - Also, 6dp elevation level for snackbars is specified in the guide: https://material.io/guidelines/material-design/elevation-shadows.html#elevation-shadows-shadows
- Should probably have dark theme over contents. Currently in notification page, `<vaadin-button>` inside the notification uses dark blue over dark grey notification background. This manifests in low contrast, which is an accessibility issue. Expected behaviour: since the notification background is dark by default, nested Vaadin Elements use dark theme by default, so that the contrast remains high.
  - Would it make sense to include `material-dark` by default here and use default background/text color of the dark theme?
- Nitpick for the demos: second is a SI unit. Conventions tell us to write a space between the number and the symbol, and omit the dot ending. (`2&nbsp;s`, not `2s.`).
- Demo notifications should say `Buttom start`. Actual: `Bottom left` in the notification text.

### `<vaadin-item>`

- Expected: more horizontal padding in the items (at least `16px` from both sides). Actual: horizontal padding is rather small and asymmetric: `8px` on the left, `24px` on the right.
- Expected: icon in the item has horizontal spacing around. Actual: icon touches the item text.

### `<vaadin-password-field>`

- eye-disabled icon is visually larger than the normal eye icon

### `<vaadin-text-field>` and the derived elements

- [Won’t fix: requires a structurlal change.] When floating, the label goes underneath the prefix. Expected: label stays always on top when prefix is in use, same way as with the value and with the placeholder.
