---
description: Orchestrate the spec-driven component creation pipeline — detects progress and asks the user which step to run next
allowed-tools: Read,Glob,Bash(ls packages/*/spec),Bash(test -f *),Skill,AskUserQuestion
argument-hint: ComponentName
---

You orchestrate the spec-driven component creation pipeline. Given a ComponentName, you detect how far the pipeline has progressed, show the user a dashboard, and ask which step to run next.

Arguments: [ComponentName]

## Pipeline Steps

All output files live under `packages/{kebab-name}/spec/` unless noted otherwise.

### Shared

| Step | Skill | Output | Prerequisites |
|------|-------|--------|---------------|
| 1 | `create-component-problem-statement` | `problem-statement.md` | none |
| 2 | `create-component-requirements` | `requirements.md` | `problem-statement.md` |

### Web Component Track

| Step | Skill | Output | Prerequisites |
|------|-------|--------|---------------|
| 3 | `create-component-web-component-api` | `web-component-api.md` | `requirements.md` |
| 4 | `create-component-web-component-spec` | `web-component-spec.md` | `web-component-api.md` |
| 5 | `create-component-web-component-figma-design` | `figma-design.md` | `web-component-spec.md` | 
| 6 | `create-component-web-component-tasks` | `web-component-tasks.md` | `web-component-spec.md` |
| 7 | `create-component-web-component-implementation` | `.js` files in `packages/{kebab-name}/src/` | `web-component-tasks.md` |

### Flow Track

| Step | Skill | Output | Prerequisites |
|------|-------|--------|---------------|
| 3b | `create-component-flow-api` | `flow-api.md` | `requirements.md` + `web-component-api.md` |
| 4b | `create-component-flow-spec` | `flow-spec.md` | `flow-api.md` |
| 5b | `create-component-flow-tasks` | `flow-tasks.md` | `flow-spec.md` |
| 6b | `create-component-flow-implementation` | Java source in `flow-components` repo | `flow-tasks.md` |

### Optional

| Step | Skill | Output | Prerequisites |
|------|-------|--------|---------------|
| 8 | `create-component-demo` | project directory | `flow-api.md` |

## Behavior

Follow these steps exactly, in order.

### Step 1 — Parse argument

Extract ComponentName from the argument. Derive `kebab-name` by converting to lowercase kebab-case (e.g., `Breadcrumb` → `breadcrumb`, `ComboBox` → `combo-box`). The spec directory is `packages/{kebab-name}/spec/`.

### Step 2 — Check state

Use Glob to list existing files in the spec directory: `packages/{kebab-name}/spec/*`.

For implementation steps (7 and 6b), check whether `packages/{kebab-name}/src/` contains `.js` files — if it does, consider step 7 done. For step 6b, check whether the `flow-components` or `../flow-components` directory has relevant Java source files for the component.

### Step 3 — Print dashboard

Determine the status of every step from the Pipeline Steps tables above by checking whether its output file exists (done) and whether its prerequisites are met (ready).

Print the dashboard in this format:

```
## Component Pipeline: {kebab-name}

### Shared
  [done] 1. Problem Statement
  [ready] 2. Requirements

### Web Component
  [    ] 3. API Design
  [    ] 4. Specification
  [    ] 5. Figma Design
  [    ] 6. Tasks
  [    ] 7. Implementation

### Flow
  [    ] 3b. API Design
  [    ] 4b. Specification
  [    ] 5b. Tasks
  [    ] 6b. Implementation

### Optional
  [    ] 8. Demo
```

Status markers:
- `[done]` — output file exists (step is complete)
- `[ready]` — all prerequisites are met, step can be run now
- `[    ]` — prerequisites not yet met

If all steps are done, print the dashboard and stop. Do not invoke any skill.

### Step 4 — Ask the user

Use AskUserQuestion to ask the user which step to run. List the `[ready]` steps as options. The user picks one.

Do NOT assume which step the user wants. Do NOT auto-pick a step. Always ask.

### Step 5 — Invoke the chosen skill

Call `Skill` with the skill name from the Pipeline Steps table and args set to `ComponentName`.

For example, if the user picks step 2 and ComponentName is `Breadcrumb`:
- skill: `create-component-requirements`
- args: `Breadcrumb`

Invoke exactly ONE skill per conversation. Do not invoke more than one.

## What NOT to do

- Do NOT pick the next step automatically — always ask the user.
- Do NOT use `context: fork` — it breaks AskUserQuestion in the invoked skill.
- Do NOT use the Agent tool — it does not propagate per-skill `allowed-tools`.
- Do NOT invoke more than one skill per conversation — context isolation.
