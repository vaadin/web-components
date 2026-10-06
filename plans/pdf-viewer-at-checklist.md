# `vaadin-pdf-viewer` — manual assistive technology checklist

Automated tests and agent reviews cannot run real screen readers or Windows High
Contrast. This checklist is for a person to go through before the component
leaves the experimental stage. Record results in the table at the end.

**Setup:** run `yarn start`, open `dev/pdf-viewer.html` (the select switches between
the fixtures in `packages/pdf-viewer/test/fixtures/`). Test the combinations from
`guidelines/a11y.md`: NVDA + Chrome, NVDA + Firefox, JAWS + Chrome, JAWS + Firefox,
VoiceOver + Safari (macOS), VoiceOver + Safari (iOS).

## 1. Landmarks and names

- [ ] The viewer is announced as a region named after the PDF title ("Multi-page
      fixture"), or "PDF document" for `standard-font.pdf`.
- [ ] The toolbar is announced as a toolbar named "PDF toolbar".
- [ ] The page area is announced as "Pages, document" (or similar), only once, and each page
      as a group "Page N" when reading into it. While a document loads, VoiceOver may say "busy";
      switching documents is not announced half-way.
- [ ] The find bar is announced as a search landmark named "Find in document".

## 2. Toolbar

- [ ] Every button reads its name ("Previous page", "Zoom in", "Sidebar", …) and the
      pressed state of "Sidebar" and "Find in document".
- [ ] Disabled buttons are announced as unavailable / dimmed.
- [ ] The page field reads "Page of 6", its value, and accepts typing + Enter.
- [ ] After previous / next page, "Page N of M" is announced once.
- [ ] After zoom in / out, the new percentage is announced once.
- [ ] The zoom select reads "Zoom" and its value, and works with the keyboard.

## 3. Reading the document

- [ ] In browse / virtual cursor mode, the text of the visible pages is read in a
      sensible order, without reading the same text twice.
- [ ] Links are read once, in place, with their text ("External link to vaadin.com (opens
      in a new tab)"), and work with Enter.
- [ ] `tagged.pdf`: headings are announced with their level and can be navigated with the
      heading keys (H / 1–6), the list is announced with 2 items, the table with rows,
      column headers and cells (table navigation keys work, cells read their column header),
      and the figure reads "A blue square".
- [ ] `tagged.pdf`: the link "Vaadin website" is announced once, as one link.
- [ ] `tagged.pdf`: "Hej världen" is read with a Swedish voice where the screen reader switches
      languages.
- [ ] VoiceOver + Safari: the rotor lists the headings of `tagged.pdf` with their text. (The
      structure uses `aria-owns`, which WebKit supports only partly in shadow DOM. If the rotor
      shows empty headings, the text is still read, but without structure. Note the result.)
- [ ] Known limitation: only pages near the view have text. Check what happens when
      reading past the last rendered page in browse mode (expected: reading stops; scrolling
      with the keyboard in the page area renders the next pages). NVDA may scroll an empty page
      group into view, which renders its text: note whether the virtual buffer then updates, and
      how disruptive this is.
- [ ] The error message of `invalid.pdf` can also be reached in browse mode, not only heard
      as an alert.
- [ ] Text selection with the keyboard (Shift + arrows in caret browsing, where supported)
      and copying gives the right text.

## 4. Find

- [ ] Ctrl/Cmd+F inside the viewer moves focus to the find field; outside the viewer, the
      browser's own find opens.
- [ ] While typing, the result is announced once after a short pause ("1 of 12, page 1"),
      not for every key.
- [ ] Enter / Shift+Enter announce the next / previous result; with no matches, Enter
      announces "No matches".
- [ ] Escape closes the find bar from any of its controls and returns focus to where it was.
- [ ] After closing, with caret browsing (F7 in Chrome / Firefox) the caret is at the current
      match. In NVDA / JAWS browse mode, note where reading continues (focus returns to where it
      was, so reading may continue from there rather than from the match).

## 5. Sidebar

- [ ] Thumbnails are announced as a listbox "Page thumbnails" with options "Page N"; the
      current page is announced as selected; other pages are not announced as "not selected".
- [ ] Arrow keys move between thumbnails, Enter goes to the page and announces it.
- [ ] `outline.pdf`: the view buttons are announced as a group "Sidebar view" with pressed
      states. The outline is a tree "Outline"; items announce level, position ("2 of 3"),
      expanded / collapsed state, and only their own title (not the titles of children).
- [ ] The outline item of the current page is announced as current.
- [ ] Right / Left expand, collapse and move between parent and child (swapped in RTL).
- [ ] On a narrow viewer (sidebar over the pages), Escape closes the sidebar and focus
      returns to the "Sidebar" button. Closing the sidebar while focus is in it never loses focus.

## 6. Download and print

- [ ] "Preparing to print…" is announced when printing starts from the print button, focus
      moves to Cancel, Escape or Cancel stops it, and focus returns to the print button. (Escape
      in the find field or an overlaid sidebar closes those first.)
- [ ] Print preview in Chrome, Firefox and Safari shows all pages at their own size
      (`multi-page.pdf`: 5 portrait + 1 landscape A4), sharp enough to read.
- [ ] Download saves `multi-page.pdf` with the original content.

## 7. Errors

- [ ] `invalid.pdf`, `encrypted.pdf` and the missing file announce their error message
      as an alert, once.

## 8. Windows High Contrast / forced colors

Test in Windows with a dark and a light contrast theme, in Chrome / Edge and Firefox.

- [ ] Toolbar icons, disabled states and pressed states ("Sidebar", "Find in document",
      thumbnails / outline view buttons) are visible.
- [ ] Focus rings are visible on all controls, the page area, links, thumbnails and outline
      items.
- [ ] Pages and thumbnails have a visible border; the current thumbnail stands out.
- [ ] Find highlights (all matches and the current one) are visible and the text stays
      readable.
- [ ] Selected text is visible.
- [ ] Outline chevrons and the current outline item are visible.

## 9. Zoom and reflow

- [ ] At 200% browser zoom and with large text settings, all controls stay usable
      (wrapping, no clipping), and the pages can still be read.
- [ ] Reflow at 320 CSS px (WCAG 1.4.10): the toolbar wraps (up to 3 rows) without horizontal
      scrolling of the page; note how much height it takes.
- [ ] Text spacing (WCAG 1.4.12, e.g. with a text spacing bookmarklet): toolbar, find bar,
      sidebar and outline texts are not clipped.
- [ ] On touch devices, toolbar buttons, thumbnails and outline items are comfortable to tap
      (WCAG 2.5.5 is AAA, so this is advisory).
- [ ] On iOS with VoiceOver, swiping through the toolbar, sidebar and pages works, and
      double-tap activates controls.

## Results

| Combination           | Tester | Date | Result | Notes |
| --------------------- | ------ | ---- | ------ | ----- |
| NVDA + Chrome         |        |      |        |       |
| NVDA + Firefox        |        |      |        |       |
| JAWS + Chrome         |        |      |        |       |
| JAWS + Firefox        |        |      |        |       |
| VoiceOver + Safari    |        |      |        |       |
| VoiceOver + iOS       |        |      |        |       |
| Windows High Contrast |        |      |        |       |
