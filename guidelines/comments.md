# Comments

This chapter covers code comments and the JSDoc of internal code. The JSDoc that generates
the API docs is in [Documenting](documenting.md). The checkable rules are in the `Comments`
section of `CONVENTIONS.md`. This chapter gives the reasons and the examples.

## Default to no comment

A comment is a second copy of what the code says, and no test checks it. It goes stale
when the code changes. Each reviewer reads each line of it.

Before you write a comment, make the code clearer:

- Rename a variable or a method.
- Extract a smaller method.
- Return early.
- Use a constant or a type that names the value.

Write a comment only when such a change is not possible, or when it makes the code worse.

## The deletion test

Apply this test to each comment on internal code:

1. Delete the comment.
2. Read the code again.
3. Write the question that the code no longer answers.

If no question remains, keep the comment deleted. If the answer needs more than one
sentence, keep the comment deleted. Then make the code clearer. Otherwise, the answer to the
question is the comment.

Before you open a pull request, apply the deletion test to each comment that the change adds.

These comments from the repository pass the test. Each one is one line, and each one says why
the code cannot be simpler.

The second call looks redundant. The comment says why it is necessary:

```js
this.__updateDetailsRowPadding(row, cell);
// Ensure the row has correct padding after frame (the resize observer might miss it)
requestAnimationFrame(() => this.__updateDetailsRowPadding(row, cell));
```

The native attribute looks simpler. The comment says why it does not work:

```js
// Use aria-readonly since native checkbox doesn't support readonly
setOrRemoveAttribute(inputElement, 'aria-readonly', readonly);
```

The `hasAttribute()` check looks unnecessary. The comment names the consumer that needs it:

```js
// Respect default theme attribute set by the Flow counterpart
if (node === this.defaultNode && this.theme && !node.hasAttribute('theme')) {
  node.setAttribute('theme', this.theme);
}
```

## Internal and public code

The API docs read the `vaadin-*.js` and `*-mixin.js` modules. The package entry points also
re-export some modules, such as `src/lit/*.js`. A docblock on a public member of these modules
is API documentation. [Documenting](documenting.md) gives its rules.

All other code is internal:

- a member with `@private` or `@protected`
- a member with a `_` or `#` name
- a module-level function or variable that the module does not export
- a helper module, also when it exports the helper

The rules of this chapter apply to internal code and to test spec files.

## Reasons for the rules

- **One sentence for each comment**: The deletion test gives one question and one answer. A second sentence
  usually explains what the code already shows.
- **Not longer than the code**: A long docblock above a short body usually explains an
  algorithm. The reader trusts the code, so the prose adds a second place to read and to update.
- **Tags without prose on internal members**: `CONVENTIONS.md` asks for the visibility tag and the override leading sentence.
  The tags hold the facts that tools read. Prose on an internal member often repeats its name.
- **No narration, justification or investigation**: The reader of the file needs the current
  code. Git holds the history, and the pull request holds the task and the review.
- **One comment for each reason**: A note that repeats the same reason on each function adds
  nothing after the first one. Each workaround for a third-party library has its own reason, so
  it gets its own comment at the code that it changes.
- **No prose in a helper `.d.ts`**: The API docs do not read helper modules. Prose in the
  `.d.ts` is a second copy of the `.js` docblock that nothing checks.
- **No JSDoc in spec files**: The `it()` name says what the test checks. A `//` comment
  explains only a fixture or an environment fact, for example why the test uses fake timers.

## Where the reason goes instead

- The commit message holds why the change exists.
- The pull request description holds the task, the review answers and what you tried.
- The `ARCHITECTURE.md` of a package holds a design that spans several members. `pdf-viewer`,
  `date-picker` and `master-detail-layout` have one. Do not move the same prose there.
