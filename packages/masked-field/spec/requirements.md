# Masked Field Requirements

## 1. Grouping as the user types

When a field is configured with group lengths, the value is shown in groups separated by a
delimiter as soon as the user types past the end of a group. The user never types the delimiter to
get the grouping.

_Example: With groups 4, 4, 4, 4, 2 the user types `FI2112345` and the field shows `FI21 1234 5`._

---

## 2. The model value is the plain value

The value the field exposes to the application is the plain value: the characters the user typed,
without delimiters or constant characters. Anything that binds, validates or sends the value sees
the plain value. The presented text is available separately, read-only.

_Example: The IBAN field shows `FI21 1234 5600 0007 85`; the bound value is `FI2112345600000785`,
and the presented text `FI21 1234 5600 0007 85` can be read but not set._

---

## 3. Fixed shapes with constant characters

When a field is configured with a fixed shape, each position accepts one class of character
(digit, letter, any) or holds a constant character. Constant characters appear on their own when
the user reaches them; a run of constants in the middle of the shape appears as one. A character
that does not fit its position is not accepted. The end of a shape can be marked as an optional
section with `[` and `]`, which requirement 18 describes.

_Example: Shape `+7 (000) 000-00-00`: typing `9` into the empty field shows `+7 (9`. Shape
`*\08\0\0\0-00-**-000000-0`: typing `C1` shows `C08000-1`._

---

## 4. Typing a delimiter or constant is never an error

When the user types the very character that the shape would insert at that position, it is taken
as that character and the caret moves past it. When the user types a delimiter where none belongs,
it is ignored without any error indication. Only a character that could never belong to the value
counts as rejected.

_Example: Typing `12:` into a `00:00` time field shows `12:` with the caret after the colon.
Typing a space inside an IBAN group is ignored silently._

---

## 5. Rejected characters never reach the value

A character the shape does not accept is not shown, does not change the value, does not fire a
value change, and does not move the caret. The field gives the same brief visual feedback it gives
for a character rejected by an allowed-character pattern.

_Example: Typing `x` into `+7 (900) 211-1` leaves the field, its value and its caret unchanged._

---

## 6. Deleting next to a separator removes a user character

When the user presses Backspace right after a delimiter or constant, or Delete right before one, the
user character on the other side of it is removed; the separator itself is never the target. After
any deletion the remaining characters are laid out again in the shape, and the caret stays next to
the character the user was editing.

_Example: In `FI21 5678` with the caret after the space, Backspace removes the `1` and the field
shows `FI25 678` with the caret after `FI2`. In `+7 (900) 201-11` with the caret after the `2`,
Backspace shows `+7 (900) 011-1`._

---

## 7. Paste and drop in any shape

Pasted or dropped text is accepted whether it already contains separators, contains none, or has
extra characters, and whether it lands in an empty field or inside an existing value. Separators in
the pasted text are not counted against an allowed-character pattern. A grouped value that is longer
than the configured groups is kept in full; a fixed shape keeps only what fits.

_Example: Pasting `+7 (900) 201-11-22 extra` into an empty phone field shows `+7 (900) 201-11-22`
and the value is `9002011122`. Pasting `FI2112345600000785XY` into the IBAN field keeps every
character, the last two in an extra group._

---

## 8. The caret stays with the user's character

When the field inserts or moves separators, the caret ends up right after the character the user
just typed, or right before the character they were about to edit. When the application sets the
value while the field is focused, the caret stays next to the same character.

_Example: The user types the fifth character of an IBAN; the field inserts a space before it and
the caret sits after that character, not before the space._

---

## 9. Changing the shape keeps the value

When the configured groups or shape change while the field holds a value, the value is presented in
the new shape and the plain value is unchanged, unless the new shape is a fixed shape that has no
room for some characters. Removing the configuration shows the plain value.

_Example: Groups change from 4, 4, 4, 4, 2 to 2, 4, 4 while the field shows `FI21 1234 5600`; the
field shows `FI 2112 3456 00` and the value is still `FI2112345600`._

---

## 10. Letter case can be normalised

When a field is configured to use upper or lower case, letters the user types, pastes or the
application sets are shown and stored in that case.

_Example: The user types `fi21` into an upper-case IBAN field and sees `FI21`; the value is `FI21`._

---

## 11. Constraints apply to the plain value

Length and pattern constraints on the field are checked against the plain value, not the presented
text, so a constraint written for the value does not have to account for separators.

_Example: An IBAN field with maximum length 34 accepts `FI21 1234 5600 0007 85` because the plain
value has 18 characters._

---

## 12. A value that does not fit the shape is not lost

When the application sets a value that the fixed shape cannot present in full, the field keeps the
value it was given, shows the part that fits, and reports the mismatch to the developer once. The
next edit by the user makes the value follow what is shown.

_Example: The application sets `90020111223344` on a `+7 (000) 000-00-00` field; the field shows
`+7 (900) 201-11-22`, the value stays `90020111223344`, and a development-time warning is logged._

---

## 13. Edits made by the field still count as changes

When the field applies an edit itself, such as removing the character beyond a separator, and that
was the only edit before the user leaves the field, the field still reports a change on leaving,
exactly once.

_Example: The user focuses `FI21 1234 5`, presses Backspace after the space, and tabs away. One
change event is reported, with the value `FI212345`._

---

## 14. Text composition is not interrupted

While the user is composing text with an input method editor, the field leaves the text being
composed alone and lays it out only when the composition is committed.

_Example: A user composing with a Japanese IME sees the composition string untouched until they
confirm it; the shape is applied once, afterwards._

---

## 15. Other fields are unchanged

Text field, email field, password field and the grid-pro editor have none of the format behaviour,
its events or its properties. A masked field with no groups and no shape configured behaves like a
text field: same events, same timing, same caret behaviour.

_Example: A masked field with none of the format settings fires the same value and change events,
in the same order, as a plain text field._

---

## 16. Configurable from Java

**Applies to:** flow

The groups, delimiter, letter case and fixed shape of a `MaskedField` are set from Java with typed
setters, and the bound value stays the plain value, so existing bindings and converters keep working
unchanged.

_Example: A Flow view configures a `MaskedField` for IBANs with groups 4, 4, 4, 4, 2 and upper case;
a Binder bound to the field reads `FI2112345600000785`._

---

## 17. Presented text readable from Java

**Applies to:** flow

The presented text of a `MaskedField` is readable on the server for applications that need the
decorated form, for instance to store it as the user saw it.

_Example: After the user types an IBAN, the view reads `FI21 1234 5600 0007 85` from the field while
the value is `FI2112345600000785`._

---

## 18. Optional sections at the end of a shape

A fixed shape can end with one or more optional sections. A section is not shown until the user
types the first character of it, and it disappears again when that character is deleted, so a value
that stops before the section is as complete as one that fills it. Sections are enabled from left to
right, so a shape with two of them has three lengths the user can stop at.

_Example: Shape `00000[-0000]` for a ZIP+4 code: typing `12345` shows `12345`; typing a sixth digit
shows `12345-6`; Backspace shows `12345` again._

---

## 19. Requiring a complete shape

A field with a fixed shape can be configured to require the shape to be filled. An incomplete value
makes the field invalid, checked on commit like the other constraints, so the user is told when they
leave the field rather than while they are still typing. An empty value is left to the required
constraint, and a format configured with groups has no fixed length to fill, so the setting does
nothing there. There is no message of its own: the field shows the error message the application
set.

_Example: A time field shaped `00:00` that requires completion: the user types `12:3` and tabs away,
and the field turns invalid; they type the missing digit and tab away again, and it turns valid._

---

## 21. Digits are stored as ASCII digits

A digit position accepts a digit written in any script. What the user types is shown and stored as
the ASCII digit with the same numeric value, so the application always receives `0` to `9`. A value
the application sets is presented with its digits normalised the same way and kept as it was
assigned. Nothing is reported for it: every character of the value is laid out, only shown
differently, so requirement 12 does not apply.

_Example: A user typing `٣٤٥٦` on an Arabic keyboard into a field shaped `0000` sees `3456`, and the
value is `3456`. Setting `٣٤٥٦` from the application shows `3456` and keeps the value `٣٤٥٦`, with
no warning._

---

## 22. Showing the shape while typing

A field with a fixed shape can show the part of the shape the user has not filled yet, drawn after
the text they entered in the same colour as a placeholder. It is a decoration: it is not part of the
value, not part of the text of the input element, and hidden from screen readers. It is shown
whether or not the field is focused, and a placeholder takes its place while the placeholder is
showing. A format configured with groups has no fixed shape to show.

_Example: A phone field shaped `+1 (000) 000-0000` showing the shape with `_` reads
`+1 (___) ___-____` while empty, and `+1 (900) ___-____` once the user has typed `900`._

---

## Discussion

Questions posed while producing this document, with the answers.

**Q: Should the value include the constant characters of a fixed shape, as Swing's `MaskFormatter` does by default?**

No. The value is the plain value in every configuration. Applications that want the decorated form
read the presented text (requirement 17). Including constants per shape is a possible later option.

**Q: Should deleting next to a separator move the caret over it instead of removing the character beyond it?**

No. Removing the user character on the other side is what the grouping behaviour already does,
costs one caret index against the alternative, and does not silently undo an explicit deletion of a
selected separator.

**Q: Should undo (Ctrl/Cmd+Z) be preserved across the field's own edits?**

Not in this scope. Every edit the field makes clears the browser's undo stack; preserving undo needs
either a deprecated browser API or a field-owned history. Recorded as a follow-up.

**Q: Should a value that does not fit the shape be normalised to what is shown, or flagged invalid?**

Neither for now. The value is kept, what fits is shown, and a warning is logged. Normalising or an
invalid state are alternatives for the API review.

**Q: Should a grouped value longer than its groups be truncated?**

No. Groups describe how to read the value, not how long it is, so extra characters go into an extra
group. A fixed shape has a length by definition and keeps only what fits.

**Q: Why a separate component rather than the format properties on Text Field?**

To keep the impact at zero for text field and everything built on it — email field, password field,
the grid-pro editor — while the behaviour is proven. Integrating the capability into text field
stays a future option once the API is stable.

**Q: Is the component gated?**

Yes. It is experimental, behind the `maskedFieldComponent` feature flag, until the API review.

**Q: Why one `[…]` section in the shape rather than a flag on each optional position?**

`[…]` is the optional syntax that IMask and Inputmask share, so a shape written for either of them
reads the same here, and both brackets stay writable as literals with the existing `\` escape. A
per-position flag would need characters the grammar already uses: `9` is a literal in shapes such as
`+7 (000)…`, `a` already means a letter, and `?` and `C` are literals too.

**Q: Why can an optional section only be at the end of the shape?**

Because a section that appends never has to regroup the characters before it, which makes the shape
of a partly filled value exact. A section in the middle changes the position of every character
after it, so the field would have to decide which layout the user meant from the count alone. The
Brazilian phone shape `(99) [9]9999-9999`, an 8-digit landline or a 9-digit mobile written the same
way, is the case that needs that and is deferred with it: no trailing section can express it,
because `(00) 0000-0000[0]` shows `(11) 9876-54321` where the reader expects `(11) 98765-4321`. A
way to select one of several shapes by the value is the follow-up that covers it.

**Q: Should an incomplete value always be invalid?**

No, it is opt-in per field. Making it the default would change the validity of every field that has
a shape, and a shape configured with groups has no completeness to check at all. There is also no
message of its own yet: the field has no per-constraint messages, so inventing a family of them for
this one constraint is left to the API review. A field that fails completeness and a field that
fails `required` therefore show the same message.

**Q: Should a digit position accept only ASCII digits?**

No. Narrowing it would block a user typing on an Arabic or Devanagari keyboard instead of helping
them, so the position accepts any Unicode decimal digit and stores the ASCII one. The two paths
differ in what they leave behind: what the user types normalises the value as well as the text,
while a value the application sets is presented normalised and kept as it was given.

**Q: Why does a normalised value set from the application not warn?**

Because the warning of requirement 12 says that the shape dropped characters, not that the text
shown differs from the value. A value whose digits or case the shape normalises is laid out in full,
so there is nothing lost to report, and warning about it would train developers to ignore the
message. The check counts the characters the shape laid out instead of comparing them one by one.
Comparing them would also have failed the completeness constraint of requirement 19 for a value that
fills the shape exactly.

**Q: Should a `]` with no `[` before it stay a literal?**

No, it is reported as an invalid shape. Every unrecognised character is a literal, so `]` was one
before optional sections existed. `00[-00` and `00-00]` are two halves of the same typing slip, and
warning about the first while silently accepting the second would be inconsistent. `\]` remains the
way to write a literal `]`, so nothing became inexpressible.

**Q: Is a rejected character announced to a screen reader?**

Not in this scope. The brief visual flash of requirement 5 is the only feedback, which a screen
reader user does not get. Announcing the rejection, with a reason for it, is designed and recorded
as the first follow-up for the API review.

**Q: Why is requirement 20 missing?**

The number is reserved for the announcement of rejected input, which is designed but deferred, so
that the follow-up can add it without renumbering the requirements after it.

**Q: Why is the shape shown next to the input rather than typed into it?**

Because the value, the caret and the deletions stay exactly as they are without it. The alternative,
filling the input element with prompt characters, is what forces overwrite typing, a special
deletion rule and a value that has to be stripped before it is read. Drawing the remaining shape
beside the text keeps all of that untouched, at the cost of the shape being decoration only. With
optional sections it shows the shape the value currently resolves to, so `00000[-0000]` shows five
positions while empty, nothing at five digits, and the rest of the section at six, which is the same
shape that requirement 19 asks to be complete.

**Q: What does the shown shape not handle yet?**

Three things, all recorded rather than solved: an input too narrow for its shape scrolls its text
while the shape stays put; a right-to-left shape is not mirrored; and a screen reader is told
nothing about the shape, because the decoration is hidden from it. Describing the accepted shape to
a screen reader is a separate follow-up for the API review.
