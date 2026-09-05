# Masked Field Problem Statement

## Problem

People type structured values into text fields all day: bank account numbers, phone numbers, card
numbers, product codes, times. The value has a shape, but a plain text field shows none of it. Users
have to count digits, guess separators, and retype when the server rejects what they entered.
Applications that want to help today reach for add-ons that patch the field from the outside, and
those break in the places that matter: the value the server receives, paste, caret position, and
changing the format at runtime.

Masked Field is a text field that presents a value in its expected shape while the model value
stays clean. The user sees the separators, the constant characters and the letter case the value
needs, and the application receives the plain value.

## Target Users

- **End users of business applications** entering identifiers with a known shape: IBANs and
  national account numbers in banking and payroll, phone numbers in CRM and support tools, card
  numbers in checkout, serial and reference numbers in logistics and manufacturing, times in
  scheduling.
- **Application developers** who need the model value the server stores to be the plain value,
  not the decorated one, and who configure the shape declaratively from Java, TypeScript or HTML.
- **Users of legacy desktop applications being migrated to Vaadin**, where fixed-shape masks with
  embedded constant characters are an established part of the data entry workflow.
- **Later adopters inside the Vaadin component set** — text field itself, text area and number
  field — once the experimental component proves the behaviour.

## Differentiation

### Text Field

Masked Field is the same field with the same API, plus the `format*` properties. A plain text field
shows exactly the characters the user typed and never changes them. Choose Masked Field when the
value has a shape the user should see while typing, and Text Field when it does not.

### `pattern` and `allowedCharPattern`

These validate or reject what the user types. They never change what is shown. Masked Field
presents the value in its shape and leaves validation to the existing constraints, which apply to
the plain model value.

### Number field

Number field parses numbers and knows about steps, minimum and maximum, and locale-specific
decimal separators. Numeral and currency formatting stay with number field. Masked Field handles
text shapes only.

### Date picker and time picker

These parse dates and times according to the configured formats and open a picker. Masked Field
does not parse dates. Deriving a typing mask from the configured date format is a possible later
adoption, not part of this scope.

### Binder converters and server-side parsing

Converters run on commit and turn one type into another. Masked Field runs on every keystroke in
the browser and never changes the type of the value. The two compose: the field presents the shape,
the converter still parses the plain value.

### Add-ons that wrap a field

Existing add-ons attach a formatter or mask engine to the field from the outside. They cannot run
before the field reads its value, so eager value synchronisation, paste and runtime format changes
all need workarounds. Masked Field runs inside the field's own input handling.

### Placeholder text

A placeholder disappears as soon as typing starts, and says nothing about the shape of what is
expected. A masked field can instead show the shape itself, drawn after the text and shrinking as
the user types. The two do not stack: while a placeholder is showing, the shape is not. The shape is
a visual aid only, and a screen reader is told nothing about it.

## Use Cases

1. **Typing a value that is easier to read in groups.** A user types a long identifier and sees it
   grouped as they go, with separators inserted for them; the application receives the plain value
   without separators.

   _Example: A user types `FI2112345600000785` into an IBAN field and sees `FI21 1234 5600 0007 85`.
   The application stores `FI2112345600000785`._

2. **Typing into a fixed shape with constant characters.** A user types only the variable
   characters of a value whose shape is fixed; punctuation and constant characters appear on their
   own, and characters that do not fit are not accepted.

   _Example: A user types `9002011122` into a phone field shaped `+7 (000) 000-00-00` and sees
   `+7 (900) 201-11-22`. Typing a letter does nothing._

3. **Entering legacy codes with embedded constants.** A user migrating from a desktop application
   types a code where a constant part sits in the middle of the value, and expects the constant to
   appear without typing it.

   _Example: A user types `C10476001374` into a field shaped `*\08\0\0\0-00-**-000000-0` and sees
   `C08000-10-47-600137-4`._

4. **Pasting a value in whatever shape it arrives.** A user pastes a value copied from an email,
   a document or another system, with or without separators, sometimes with extra characters, into
   an empty field or into the middle of an existing value.

   _Example: A user pastes `FI21 1234 5600 0007 85` from an invoice into an IBAN field; the field
   shows it grouped and the application receives the plain value._

5. **Correcting a value in place.** A user moves the caret into the middle of a value, deletes a
   character next to a separator, or types one, and expects the caret to stay where they are
   working and the separators to fall back into place.

   _Example: In `FI21 5678` the user places the caret after the space and presses Backspace; the
   `1` disappears and the value regroups to `FI25 678` with the caret still after `FI2`._

6. **Typing separators out of habit.** A user types the separator themselves at the position where
   the field would have inserted it, or elsewhere, and expects nothing to go wrong.

   _Example: A user types `FI21 1234` with a space into an IBAN field. The space where a group
   ends is accepted as the separator; a space typed inside a group is ignored._

7. **Entering a value whose letters must be in one case.** A user types letters in any case and
   the field shows them in the case the value requires.

   _Example: A user types `fi21` and the IBAN field shows `FI21`._

8. **Changing the expected shape while a value is present.** The application changes the format
   because of another selection the user made, and the value already typed is re-presented in the
   new shape without being lost.

   _Example: A user picks a different country in a phone form; the digits already typed are
   regrouped for that country's format._

9. **Setting a value from the application.** The application loads a value from the server into a
   field that has a format, possibly while the user is focused on it, and the user sees it in shape
   with the caret where it was.

   _Example: A form loads `9002011122` into the `+7 (000) 000-00-00` phone field and the user sees
   `+7 (900) 201-11-22`._

10. **Entering a value whose last part is optional.** A user types a value that has a shorter and a
    longer accepted form, and is not asked to fill the part they do not need.

    _Example: A user types a 5-digit ZIP code into a `00000[-0000]` field and stops; another user
    types the ZIP+4 form and the `-` appears with the sixth digit. A support agent types a phone
    number and, only when there is one, an extension after it._

11. **Seeing the shape that is expected before typing it.** A user looks at an empty field and sees
    how much they are about to type and where the separators fall, instead of counting digits or
    guessing from the label.

    _Example: An empty phone field reads `(___) ___-____`, and the underscores disappear one by one
    as the user types. The shape is a visual aid; the value and what a screen reader reads are
    unchanged by it._

## Discussion

**Q: Is number and currency formatting in scope?**

No. Number field is moving to a text input first; numeral and currency formatting return with that
work. Masked Field covers text shapes, and number field is a later adopter of its core.

**Q: Is full international phone formatting in scope?**

No. It needs libphonenumber-sized data. Grouping a known national format is in scope; resolving the
country from the digits is not.

**Q: Is a visible placeholder mask (`__ __ ____`) in scope?**

Yes, as a visual aid. The shape is drawn beside the input rather than typed into it, so the value,
the caret and the deletions are unaffected and the accessibility question that blocked it does not
arise: the drawing is hidden from screen readers. What is still out is telling a screen reader user
what shape is expected, which needs wording per character class and is recorded as a follow-up for
the API review.

**Q: Are value-dependent groups (AMEX 4-6-5, German area codes) in scope?**

Deferred. The engine can carry them as a dynamic shape; the declarative way to select one shape
from the value is an open API question.

**Q: Why a separate experimental component rather than adding the format properties to Text Field?**

To keep the impact at zero for text field and every component built on it — email field, password
field, the grid-pro editor — while the behaviour is proven. The feature flag keeps the new component
opt-in. Integrating the capability into text field stays a future option once the API is stable.
