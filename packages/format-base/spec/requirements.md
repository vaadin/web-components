# Format Base Requirements

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
that does not fit its position is not accepted.

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

## 15. Fields without a format are unchanged

A field that has no groups and no shape configured behaves exactly as it does without this
infrastructure: same events, same timing, same caret behaviour.

_Example: A plain text field with none of the format settings fires the same value and change
events, in the same order, as before the infrastructure existed._

---

## 16. Configurable from Java

**Applies to:** flow

The groups, delimiter, letter case and fixed shape are set from Java with typed setters, and the
bound value stays the plain value, so existing bindings and converters keep working unchanged.

_Example: A Flow view configures an IBAN field with groups 4, 4, 4, 4, 2 and upper case; a Binder
bound to the field reads `FI2112345600000785`._

---

## 17. Presented text readable from Java

**Applies to:** flow

The presented text is readable on the server for applications that need the decorated form, for
instance to store it as the user saw it.

_Example: After the user types an IBAN, the view reads `FI21 1234 5600 0007 85` from the field while
the value is `FI2112345600000785`._

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
