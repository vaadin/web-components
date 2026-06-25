# `component-api-*` — pre-spec API discovery (read me first)

A small set of slash commands for **evolving the developer-facing API of an existing component across the web-components (WC) + flow-components (Flow) boundary**, before any spec is written. They capture the workflow used to make Grid's selection-column and sorter accessibility labels translatable across both repos.

This is the **pre-spec API-discovery phase**. Its output — a conventions map, a decision record, a cross-repo contract table, and a validated proto — is the *input* to SDD's `create-component-web-component-api` / `create-component-flow-api`.

These are plain Claude Code skills. They need only stock tools (`Read`, `Glob`, `Grep`, `Bash`, `Write`, `Edit`, `AskUserQuestion`, and the native `Agent` tool) and the checked-in repo. Teammates get them just by pulling the branch — no plugin or extra install required.

## Why this is upstream of SDD, not part of it

SDD's `create-component-*-api` skills **deliberately forbid reading source code** — they design API from a blank-slate ergonomics view for a *new* component. This workflow is the **inverse**: it *evolves an existing* component, so it must read WC + Flow source to trace mechanisms and sample live conventions. That single difference is why this is a separate, upstream skill family. When this phase finishes, hand its artifacts to the SDD API-design step.

## Run order and I/O

| # | Skill | Input | Output artifact |
| --- | --- | --- | --- |
| 1 | `/component-api-explore` | `<component(s)> <capability>` | `explore.md` — conventions snapshot + end-to-end data-path trace |
| 2 | `/component-api-compare` | `explore.md` + ≥2 viable shapes | `decision.md` — ADR + alternatives considered |
| 3 | `/component-api-contract` | `decision.md` (or `explore.md`) | `contract.md` — WC↔Flow table + naming/placement rules |
| 4 | `/component-api-spike` | `contract.md` | `spike-report.md` — works/awkward + cross-toolchain verify, on a `proto/*` branch |

Flow:

```
explore → compare → contract → spike → hand to SDD
              ↑                    │
              └─── (if shape feels awkward, iterate back)
```

`component-api-compare` is **optional**: skip it when `explore.md` surfaced a single obvious shape and go straight to `component-api-contract`. The spike loops back to compare when the prototype feels awkward.

## Artifact layout (on the `proto/*` branch)

```
packages/{component}/spec/api-design/
  explore.md        # component-api-explore   — conventions + data-path trace
  decision.md       # component-api-compare   — ADR + alternatives
  contract.md       # component-api-contract  — WC↔Flow table + naming rules
  spike-report.md   # component-api-spike     — works/awkward + verify results
```

Each skill writes its artifact to the working tree. They are **committed only on `proto/*`** (the spike step or the user owns the commit). On `main` they remain untracked and are never merged until the real change lands.

Nesting under `api-design/` is deliberate: it keeps these files out of SDD's spec-editing rule (`packages/*/spec/*.md`, which does not match the extra `/api-design/` path level). These are discovery scratch, not formal specs.

## Don't make these a skill (anti-patterns)

From the institutional knowledge that produced this set — three things that look skill-shaped but aren't:

- **Naming bikeshedding** (`…Prefix` → `…Row` → `…SelectRow`) is judgment, not a procedure. The *rule* is captured (the naming-family table in `component-api-contract`); the act of bikeshedding a name is not a skill.
- **Proto git mechanics** as a standalone skill is too thin — it's folded into `component-api-spike`'s graduate-or-teardown step and the repo's existing commit rules.
- **Comparing a single obvious option** is ceremony, not a decision gate. `component-api-compare` only runs when ≥2 genuinely viable shapes exist; with one obvious shape, skip it.
