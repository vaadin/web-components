<!-- Edit any field. This file is committed on the `repro/1616` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** The bug is `vaadin-month-calendar.__computeDisabled()` comparing only the month index of `min`/`max` and ignoring the year, triggered by a `min` and `max` that fall inside the same calendar month (e.g. `2020-11-15` … `2020-11-20`) while viewing that same month in a different year, observable as the `vaadin-month-calendar` for that month missing the `disabled` attribute even though every date in it is disabled, so the month header keeps its normal (non-faded) color.
- **Regression?:** not a regression (broken since the `min`/`max` same-month check was added in 876120b41767949748600db0c0b1a917130bf07a, May 2018 — before the reported 4.4.1)
- **Fixed by:** n/a — still present on `main`
- **Duplicate of:** none found (searched `vaadin/web-components`, `vaadin/flow-components`, `vaadin/flow`)
- **Branch:** `repro/1616` — pushed to `vaadin/web-components`
- **Reproduced on:** vaadin/web-components @ `main` (`@vaadin/date-picker` 25.3.0-alpha9, commit b8810b2a3814843de85a592520e48d4bc4bf868f)
- **Present on main?:** yes (still broken)
- **Theme / Browser:** Lumo / Chromium (Playwright)
- **Screenshot** (static bug): ![November 2018 header not faded while all its dates are disabled; December 2018 header correctly faded](https://raw.githubusercontent.com/vaadin/web-components/<commit-sha>/repro-1616.png)

## Observed behavior

With `min="2020-11-15"` and `max="2020-11-20"`, opening the overlay at November 2018 gives:

| month | `disabled` on `<vaadin-month-calendar>` | all dates disabled | month-header color |
| --- | --- | --- | --- |
| 2018-08 | `true` | yes | `rgba(28, 52, 84, 0.26)` |
| 2018-09 | `true` | yes | `rgba(28, 52, 84, 0.26)` |
| 2018-10 | `true` | yes | `rgba(28, 52, 84, 0.26)` |
| **2018-11** | **`false`** | **yes (0 of 30 selectable)** | **`rgb(25, 36, 52)`** |
| 2018-12 | `true` | yes | `rgba(28, 52, 84, 0.26)` |
| 2019-01 | `true` | yes | `rgba(28, 52, 84, 0.26)` |

November 2018 is the only month whose header renders at full opacity, and it is the only month whose host element is missing the `disabled` attribute — while all 30 of its dates carry `disabled`.

The control picker on the same page (`min="2020-11-15"`, `max="2020-12-20"` — identical except that `min`/`max` span two different months) gets `disabled: true` on 2018-11 as expected, so the trigger is isolated to `min` and `max` sharing a month index.

Scrolling the failing picker to the *real* range confirms the same-month check is otherwise doing its job: 2020-11 reports `disabled: false` with dates 15–20 selectable, which is correct.

Console was clean apart from the usual dev-server noise (favicon 404, Lit dev-mode warning).

## Expected behavior

November 2018 has no selectable date, so its `vaadin-month-calendar` should be `disabled` and its month header should use the disabled (faded) style, like every other fully out-of-range month.

## Steps to reproduce

1. Open a `vaadin-date-picker` whose `min` and `max` are both inside the same calendar month, e.g. `min="2020-11-15"` and `max="2020-11-20"`.
2. Open the overlay and scroll to November of a different year (e.g. November 2018).
3. The month header is rendered without the disabled style, although all dates in it are disabled.

## Reproduction

How to run: start the dev server (`yarn start:lumo`) and open the page below.

- **Route / page:** `http://localhost:8000/dev/repro-1616.html`
- **Scaffold:** `dev/repro-1616.html` (committed on this branch)

```html
<!-- Failing case: min and max are in the SAME calendar month (November 2020). -->
<vaadin-date-picker
  id="failing"
  label="min/max same month (Nov 2020)"
  min="2020-11-15"
  max="2020-11-20"
  initial-position="2018-11-01"
></vaadin-date-picker>

<!-- Control: min and max span TWO different months, everything else identical. -->
<vaadin-date-picker
  id="control"
  label="min/max different months (Nov-Dec 2020)"
  min="2020-11-15"
  max="2020-12-20"
  initial-position="2018-11-01"
></vaadin-date-picker>
```

## Root cause (suspected)

`__computeDisabled()` has an early return for the case where `min` and `max` both sit inside the month being rendered. That check compares `getMonth()` only, so it matches **any** year, and it also compares `getDate()` between two dates that may belong to different years. For November 2018 with `min`/`max` in November 2020 the condition is satisfied and the month is reported as enabled:

https://github.com/vaadin/web-components/blob/b8810b2a3814843de85a592520e48d4bc4bf868f/packages/date-picker/src/vaadin-month-calendar-mixin.js#L171-L186

The early return itself is needed: without it, the generic `!dateAllowed(firstDate) && !dateAllowed(lastDate)` check would wrongly disable the genuine November 2020 (its 1st and 30th are both outside `min`/`max` even though days 15–20 are selectable). A fix has to keep that case working — comparing the year as well, or replacing the whole computation with "no date in this month is selectable", would do it.

## Notes

- The condition was introduced by 876120b41767949748600db0c0b1a917130bf07a ("Updating checks for min and max", May 2018) and has been carried through the Polymer → Lit rewrites unchanged, so the bug predates the reported 4.4.1 and is not a regression.
- `packages/date-picker/test/month-calendar.test.js` (`describe('date limits')`) covers same-month `min`/`max` only within a single year, which is why this has stayed unnoticed.
- Purely client-side: no Flow involvement, the same code path runs for the plain web component.
