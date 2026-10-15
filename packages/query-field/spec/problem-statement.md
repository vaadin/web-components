# Query Field Problem Statement

## Problem

Business applications often let users narrow down large data sets — issues, orders, customers, log entries, media catalogs — with a combination of free text and structured criteria. Today an application has two options, and both are poor:

- **A plain text field** with an ad-hoc syntax (`status:open priority:high login bug`). Power users love the speed, but nobody discovers the syntax, typos silently produce wrong results, and there is no feedback about which part of the text is a filter.
- **A form of separate inputs** (a text field plus one combo box per criterion). Discoverable, but slow, space-hungry, and impossible to copy, paste, bookmark or share as a single string.

Users need a single-line input that keeps the speed and portability of typed text, while making the structured parts discoverable (autocomplete), visible (highlighting), and checked (validation) — the experience popularized by the GitHub issue search bar.

## Target Users

- **Power users of data-heavy views** (support agents, operators, analysts) who filter grids and lists many times a day and prefer the keyboard.
- **Occasional users** who need to discover which criteria exist without reading documentation.
- **Application developers** who need to turn the user's input into a backend query without writing a parser.

## Differentiation

### Text Field / Search field pattern

`vaadin-text-field` accepts any text but has no notion of structure. The query field is a text field whose value is still a plain string, but which understands, highlights, autocompletes and validates `name:value` filters inside it.

### Combo Box / Multi-Select Combo Box

A combo box selects one (or many) values for **one** criterion from a list. The query field combines **many** criteria plus free text in one editable string. Its autocomplete dropdown reuses the combo-box interaction model (arrow keys, Enter, Escape) but the value is free text, not a selection.

### Rich Text Editor / Message Input

These edit multi-line, formatted content. The query field is single-line, unformatted text; highlighting is purely presentational and never stored in the value.

## Use Cases

1. **Filtering a list with free text and structured filters.** *A support agent types `status:open assignee:me printer` to see their open tickets mentioning a printer.*

2. **Discovering available filters.** *A new user types `s` and sees `status:` and `severity:` suggested, with their human-readable labels, and picks one with the keyboard.*

3. **Picking a filter value.** *After `label:` the user sees the known record labels (optionally with an image), types `"W` and picks `Warp Records`; the field inserts `label:"Warp Records" ` with correct quoting.*

4. **Spotting mistakes.** *The user types `year:twenty` or `colour:red`; once the caret leaves the token it is marked as invalid, and the field reports itself invalid on validation.*

5. **Sharing a query.** *The user copies the field's text into a chat; a colleague pastes it into the same field and gets the same filters, highlighted.*

6. **Consuming the query in code.** *The application reads a parsed `{ text, filters }` object on every change and sends it to the backend, instead of parsing the string itself.*

## Discussion

**Q: Should filters be rendered as chips (non-editable atomic elements)?**

No. Chips break native text editing: caret movement, selection, copy/paste, undo/redo and IME. The value stays a plain string and highlighting is a visual layer only. Chips are what `vaadin-multi-select-combo-box` is for.

**Q: Should @-mentions (as needed by `vaadin-message-input`) be covered?**

Not in the first version, but the design must not prevent it. A mention is the same mechanism (trigger → autocomplete → highlighted, validated token) with a different trigger syntax (`@name` instead of `name:value`). See the "Future" section in `web-component-api.md`.
