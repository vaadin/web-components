# {Component name} specification

<!--
How to use this template:

1. Copy this file to `packages/{component-name}/spec/spec.md`.
2. Replace each `{placeholder}` with real text.
3. Use the prototype, the use-case app and the issue research as sources.
4. Delete the sections and groups that do not apply.
5. Delete all HTML comments before you commit the spec.

The spec describes the current state of the component only.
Put rejected options, changes and their reasons in the Discussion section.
-->

<!--
Rules for text (ASD-STE100 and house style):

Sentences
- Write a criterion or an instruction in no more than 20 words.
- Write a descriptive sentence in no more than 25 words.
- Write one criterion or one instruction in each sentence.
- Use no more than 6 sentences in a paragraph.
- Use a vertical list for more than 2 items.
- Write the condition first, then the result: "When the user presses <kbd>Esc</kbd>, the overlay closes."

Verbs
- Use the active voice. Name the actor: the user, the developer, the application or the component.
- Use the present tense for behavior: "the overlay closes", not "the overlay should close".
- Use "can" for an action that the user or the developer is able to do.
- Do not use "should", "may" or "might".
- Do not use -ing words, except in a technical name.
- Do not use phrasal verbs: write "open", not "pop up". Write "find", not "find out".

Words
- Use one term for each concept. Define it in the Terms table.
- Do not use synonyms. Write "overlay" each time, not "popup" and "dropdown".
- Use articles (a, an, the). Do not omit them to make a sentence shorter.
- Do not write noun clusters of more than 3 nouns.
- Do not use contractions, semicolons, em-dashes or Latin abbreviations.
- Write numbers as digits: "3 to 5 items", "about 30 rows".
- Put technical names in backticks: `vaadin-date-picker`, `value`, `--vaadin-input-field-border-width`.
- Write keys as <kbd>Esc</kbd>.

Vague words
- Do not use "properly", "correctly", "appropriate", "user-friendly", "fast", "some" or "and so on".
- Do not write "supports X". Write what the user or the developer can do.
- Replace each vague word with a result that a tester can see or measure.

| Do not use          | Use                                 |
| ------------------- | ----------------------------------- |
| allow, enable       | let                                 |
| display (verb)      | show                                |
| ensure              | make sure                           |
| e.g.                | for example                         |
| i.e.                | that is                             |
| etc.                | the full list of items              |
| prior to            | before                              |
| in order to         | to                                  |
| via                 | with, through                       |
| utilize             | use                                 |
| once (as "after")   | after, when                         |
| click on            | click                               |
| hit (a key)         | press                               |
| should, may, might  | the present tense, "must" or "can"  |
-->

## Summary

<!--
Write 1 or 2 sentences. Tell what the component is and what the user does with it.
Add a screenshot of the prototype.
-->

{Component name} is a {kind of component} that lets the user {main task}.

![{Component name} prototype]({image URL})

## Prototype

<!--
Link the sources of this spec. Delete the rows that do not apply.
-->

| Item              | Link                                                    |
| ----------------- | ------------------------------------------------------- |
| Platform issue    | https://github.com/vaadin/platform/issues/{number}      |
| Web component PR  | https://github.com/vaadin/web-components/pull/{number}  |
| Flow component PR | https://github.com/vaadin/flow-components/pull/{number} |
| Live preview      | {URL}                                                   |
| Use-case app      | {URL of the use-case app}                               |
| API gaps          | {URL of `API-GAPS.md` in the use-case app}              |
| Design            | {URL of the Figma file}                                 |
| Target version    | {Vaadin version, for example 25.1}                      |

### Prototype results

<!--
Tell what the prototype shows and what it does not have.
Link each gap to an acceptance criterion, to Out of scope or to Later enhancements.
-->

- **Works**: {Behavior that a use-case view shows}. See UC{n}.
- **Gap**: {Behavior that the prototype does not have}. See `AC-{group}.{number}`.

## Problem

<!--
Describe the user need. Tell why the current Vaadin components do not meet it.
Do not describe the solution.

Example:
Users often select a start date and an end date, for example to book a hotel stay.
Two Date Pickers do not show the range in one calendar.
The user cannot see the booked nights between the two dates.
-->

{The user need and the problem with the current components.}

## Use cases

<!--
- Start with the core use case. It is the most common task.
- Add 1 use case for each different context or constraint.
- Give each use case an ID (`UC1`) and a short title that starts with a verb.
- Use the same IDs and titles as the views in the use-case app.
- Write `UC1: {title}` in the spec. The use-case app can keep its own form.
- Write 1 sentence for the need. Then write 1 example in italics.
- Name a real business domain in the example.
- Do not describe the API or the behavior of the component.

Example:
### UC1: Book a stay
A guest wants to select the nights of a hotel stay, so that the hotel can reserve a room.
_Example: A guest opens the reservation page of a hotel. The calendar shows the booked nights as not available. The guest selects 12 May as the arrival date and 15 May as the departure date. The page shows "3 nights"._
-->

### UC1: {Verb and object}

A {user role} wants to {goal}, so that {reason}.

_Example: {Domain, user, steps and result. Give enough detail to build a demo view.}_

### UC2: {Verb and object}

A {user role} wants to {goal}, so that {reason}.

_Example: {Domain, user, steps and result.}_

## Scope

### Use other components for

<!--
Write 1 item for each adjacent component or pattern.
Tell the reader the condition to use the other component.
Tell what this component does not do.
-->

- **{Adjacent component}**: When {condition}, use it. {Component name} does not {behavior}.

### Out of scope

<!--
List the behaviors that the component will not have. Give the reason in 1 sentence.
-->

- {Behavior}. {Reason}.

### Later enhancements

<!--
List the behaviors that can come in a later version.
They are not part of the acceptance criteria.
-->

- {Behavior}.

## Terms

<!--
Define each term that the spec uses.
Use the same term in this spec, in the API, in the documentation and in the Flow component.
Add the parts of the component, the states and the actors.
-->

| Term         | Meaning                                                   |
| ------------ | --------------------------------------------------------- |
| user         | The person who uses the application.                      |
| developer    | The person who builds the application with the component. |
| application  | The software that the developer builds and the user uses. |
| {part name}  | {Definition in 1 sentence.}                               |
| {state name} | {Definition in 1 sentence.}                               |

## Acceptance criteria

<!--
Rules for each criterion:
- Write 1 behavior that a tester can check. Give the result that the tester sees.
- Use one of these patterns:
  - Behavior: "When {condition}, {actor} {result}."
  - Negative: "When {condition}, {actor} does not {result}."
  - Option: "The developer can {action}. The default is {value}."
- Give the default value of each option.
- At the end of each criterion, give the use case IDs: `(UC1, UC2)`.
- Give each criterion an ID `AC-{group}.{number}`. Do not change an ID after the review.
- Make sure that each use case has at least 1 criterion.
- Do not repeat the rules in `guidelines/a11y.md` and `guidelines/design.md`.
- When the component adds a default value or a special behavior, add the rule.
- Delete the groups that do not apply. Keep the group numbers when you delete a group.
- Add a group for each other topic.
-->

### 1. Deliverables

- [ ] **AC-1.1**: The web component `vaadin-{name}` is available in the `@vaadin/{package}` package.
- [ ] **AC-1.2**: The Flow component `{ClassName}` is available in the `vaadin-{name}-flow` module.
- [ ] **AC-1.3**: The React component `<{Name}>` is available in the `@vaadin/react-components{-pro}` package.
- [ ] **AC-1.4**: The component has styles for the Lumo theme and the Aura theme.
- [ ] **AC-1.5**: The component is available under the {Apache License 2.0 | Vaadin Commercial License}.
- [ ] **AC-1.6**: The component is available behind the `{flagName}` feature flag.

### 2. Content and value

<!--
Example:
- [ ] **AC-2.1**: When the user selects a start date and an end date, the value contains the 2 dates. (UC1)
- [ ] **AC-2.2**: The developer can set the minimum and the maximum date. The default is no limit. (UC1, UC2)
-->

- [ ] **AC-2.1**: When {condition}, {actor} {result}. (UC{n})

### 3. Pointer and keyboard interaction

<!--
Example:
- [ ] **AC-3.1**: When the user presses <kbd>Esc</kbd>, the overlay closes. (UC1)
- [ ] **AC-3.2**: When the user clicks outside the overlay, the overlay closes. (UC1)
-->

- [ ] **AC-3.1**: When the user {action}, {actor} {result}. (UC{n})

### 4. States and validation

<!--
Write a criterion for each state that applies: disabled, read-only, required and invalid.

Example:
- [ ] **AC-4.1**: When the field is read-only, the user cannot change the value. (UC2)
- [ ] **AC-4.2**: When the field is read-only, the user can move focus to it with <kbd>Tab</kbd>. (UC2)
-->

- [ ] **AC-4.1**: When the component is {state}, {result}. (UC{n})

### 5. Accessibility

<!--
Example:
- [ ] **AC-5.1**: The overlay has the `dialog` role. (UC1)
- [ ] **AC-5.2**: When the user selects a date, screen readers announce the full date. (UC1)
-->

- [ ] **AC-5.1**: {Part} has the `{role}` role. (UC{n})

### 6. Internationalization

<!--
Example:
- [ ] **AC-6.1**: The developer can set the text of each label. The default text is in English. (UC2)
- [ ] **AC-6.2**: The date format follows the locale of the application. (UC2)
-->

- [ ] **AC-6.1**: The developer can set {text}. The default is {value}. (UC{n})

### 7. Styles

<!--
Example:
- [ ] **AC-7.1**: The developer can set the gap between the 2 calendars with `--vaadin-{name}-gap`. (UC1)
-->

- [ ] **AC-7.1**: The developer can set {visual property} with `--vaadin-{name}-{property}`. (UC{n})

### 8. Flow integration

<!--
Add only the criteria that do not apply to the web component.

Example:
- [ ] **AC-8.1**: The developer can bind the value to a bean property with `Binder`. (UC2)
-->

- [ ] **AC-8.1**: The developer can {action} with {Flow API}. (UC{n})

## General criteria

<!--
Replace each placeholder with a link. Delete the items that do not apply.
-->

- [ ] **API review**: {Link to the API review}
- [ ] **Design**: {Link to the Figma file or to the design issue}
- [ ] **Performance**: {Link to the performance requirements or tests}
- [ ] **Documentation**: {Link to the documentation PR}
- [ ] **How to test**: {Link to the test instructions}
- [ ] **Limitations**: {Link to the issues that list the limitations}

## Security

- [ ] **Security implications**: {Describe the implications, or link to the security requirements. When there are none, write "None".}

## Discussion

<!--
Record each decision that changed the scope or a behavior.
When a decision changes, add a new entry. Do not edit the spec body to show history.
Write the answer in 1 to 3 sentences. Give the reason.
-->

**Q: {Question, for example "Can the user select a range across disabled dates?"}**

{Decision and reason.}

<!--
Before the review, make sure that:
- Each use case has at least 1 acceptance criterion.
- Each acceptance criterion has a use case ID, or it is in the Deliverables group.
- Each option has a default value.
- Each criterion has a result that a tester can see or measure.
- Each term in the spec is in the Terms table, and the spec uses no synonyms for it.
- No criterion is also in Out of scope or in Later enhancements.
- No sentence has more than 20 words in a criterion, or more than 25 words in a description.
- The spec has no "should", "may", "might", "etc." or "e.g.".
-->
