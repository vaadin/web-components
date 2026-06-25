---
name: component-api-contract
description: Lock the chosen API shape into a cross-repo WC-to-Flow contract table with naming-family and placement rules
argument-hint: <component>
disable-model-invocation: true
allowed-tools: Read, Write(packages/*/spec/api-design/*), Bash(ls:*)
---

Turn the chosen API shape for component $0 into the **cross-repo contract** — the single artifact that travels with the change into implementation and into SDD. This is the highest-leverage step: the biggest source of effort and error when evolving a WC + Flow component is keeping the two repos in lockstep. A WC property rename has to reach the Flow `setProperty` key, the Java setter, the connector wiring, the Flow tests, and the Javadoc. The contract table prevents every one of those drift bugs.

## Steps

1. **Read the input.** Read `packages/{component}/spec/api-design/decision.md` (the chosen shape). If it does not exist, read `packages/{component}/spec/api-design/explore.md` instead (single-obvious-shape path). If neither exists, stop and tell the user to run `/component-api-explore` first.

2. **Locate the flow-components repository.** Run `ls flow-components` first; if that fails, run `ls ../flow-components`. Use the first path that exists. If neither exists, stop and tell the user: "Confirming the Flow method-name family needs access to the flow-components repository. Clone it to ./flow-components/ or ../flow-components/ and re-run this skill." Read the relevant Java class declarations only — to confirm the existing setter family, not to copy behavior.

3. **Build the contract table.** For each concept in the chosen shape, fill one row: **Concept · WC property · Flow method · Per-item channel · Wiring · Default**. The **Per-item channel** cell is one of:
   - an **existing JSON key** the connector already carries (e.g. Grid `"selectable"`) — the contract just *maps* it;
   - **`NEW`** — for a component with no existing per-item transport (e.g. a field like date-picker, where `explore.md` found no `DataGenerator`/connector channel). When it is `NEW`, the contract MUST specify the channel concretely: the wire format (e.g. a date-key → token-string map), what triggers a refresh (e.g. visible-range change), and the element property the connector sets — because no existing transport documents it;
   - **`—`** for a plain element property that doesn't travel per-item.

4. **Apply the three rules (these are the encoded institutional knowledge — keep them verbatim in spirit):**

   - **Naming families may differ per repo — verify each side independently.** Match the existing family in *each* repo, not across them. Sometimes they align: value generators are `*Generator` on both sides (WC `cellPartNameGenerator` ↔ Flow `setPartNameGenerator`). Sometimes they diverge: a per-item boolean is `isItemSelectable` (an `is…` name) on the WC but `setItemSelectableProvider` (a `*Provider` suffix) on Flow. Pick the family by what the function returns, and match the convention already used on each side — don't assume the other repo uses the same suffix.

   - **Per-item data path is a 2-repo contract.** A Java `DataGenerator` writes a JSON key; the WC reads the *same* key. Renaming that key is a Java + WC change — it cannot be done in one repo alone. Flag every per-item row in the table as a shared contract so a future rename touches both sides.

   - **Placement asymmetry is legitimate.** Don't force a symmetry the domain doesn't have. One selection column → config lives on the column. N sort-columns → a grid-level default set once makes more sense. Record where each concept's config lives and why; asymmetry between concepts is fine.

5. **Write the artifact.** Write `packages/{component}/spec/api-design/contract.md` in the format below.

## Output format — `contract.md`

```markdown
# Cross-repo API contract — {component}: {capability}

## Contract table

| Concept | WC property | Flow method | Per-item channel | Wiring | Default |
| --- | --- | --- | --- | --- | --- |
| Rows draggable | `rowsDraggable` | `setRowsDraggable` | — | element property | `false` |
| Cell part names | `cellPartNameGenerator` | `setPartNameGenerator` | — | element property (function, runs client-side) | none |
| Item selectable | `isItemSelectable` | `setItemSelectableProvider` | `selectable` (existing) | connector sets `grid.isItemSelectable = item => item.selectable` | all selectable |

(Rows above are worked examples from shipped Grid APIs — replace with this component's concepts. Use `NEW` in the Per-item channel cell when the component has no existing transport, and spell the channel out in the section below.)

## Naming-family rules applied

- Flow `setXxxProvider` / `setXxxGenerator` ↔ WC `isXxx` (predicate) / `xxxGenerator` (value) — matched the existing family in each repo.
- Generators (`*Generator`, return a value) vs predicates (return a boolean): {which family each per-item function uses and why}.

## Shared per-item contracts (2-repo changes)

- **Existing keys:** {JSON key} — written by Java `{DataGenerator}`, read by WC `{consumer}`. Renaming touches both repos.
- **NEW channels (if any):** {channel name} — define the wire format, the refresh trigger, and the element property the connector sets. No existing transport documents this, so this entry *is* its spec; it is the riskiest part of the change and must be re-checked in the spike.

## Placement decisions

- {Concept} → {column-level / grid-level} because {1 column vs N columns / per-item vs default-only}.
```

## Next step

Run **`/component-api-spike`** to prototype the locked contract on a `proto/*` branch and verify it across both toolchains.
