# Reproduction: <component> — <short title> (#<issue>)

<!-- Edit any field. This file is committed on the `repro/<issue>` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Issue:** https://github.com/vaadin/<repo>/issues/<issue>
- **Verdict:** reproduced | not reproduced | partially reproduced | works as designed (likely misuse)
- **Hypothesis tested:** The bug is <X>, triggered by <Y>, observable as <Z>.
- **Branch:** `repro/<issue>` — pushed to `vaadin/<repo>`
- **Reproduced on:** <repo> @ <version or branch>
- **Present on main?:** yes (still broken) | no (fixed in <line>) | n/a
- **Theme / Browser:** <theme> / <browser>
- **Demo video:** `repro-<issue>-<symptom>.webm` (on the branch; drag into the comment for inline playback)

## Observed behavior

<What actually happened — cite the DOM snapshot, console output, or screenshot.>

## Expected behavior

<From the issue or the bug description.>

## Steps to reproduce

1. <step>
2. <step>
3. <step>

## Reproduction

How to run: start the server (`yarn start` for web / `mvn … jetty:run` for Flow) and open the route below.

- **Route / page:** `<dev/repro-<issue>.html | http://localhost:8080/repro-<issue>>`
- **Scaffold:** `<path to the dev page or View committed on this branch>`

```
<key markup / View source — the minimal reproduction>
```

## Root cause (suspected)

`<file_path:line>` — <short explanation of the problematic area>.

## Notes

<Anything else: version-specific findings, dependencies added to an IT pom, dead ends, related issues.>
