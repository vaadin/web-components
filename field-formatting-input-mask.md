# Field formatting / Input Mask

### Relevant issues

Feature request: https://github.com/vaadin/platform/issues/9364 - see comments for use cases.

WC issues:
https://github.com/vaadin/web-components/issues/1267
https://github.com/vaadin/web-components/issues/1271
https://github.com/vaadin/flow-components/issues/1144

### Slack threads

**Johannes**

We have the vcf-input-mask add-on, but recent customer cases have shown the wrap-it-from-outside approach is fragile (value sync in eager mode, paste handling, runtime mask changes).

Swing has had this built in since forever: JFormattedTextField + MaskFormatter.
https://docs.oracle.com/javase/8/docs/api/javax/swing/text/MaskFormatter.html

In legacy apps, masks are in many cases alpha numeric and complex. For example mask like this `*\08\0\0\0-00-**-000000-0` where there are embedded constant parts (e.g. `08000` ) in the middle of the value. In that example allowed value could be like this `C08000-10-47-600137-4` In practice you type "C10476001374" and get that formatted value as a result.

**Juuso**

Ideal scenario would be that the Vaadin Text Field and co would have some sort of API for using custom parsing logic.

Cleave.js has worked reasonably well. It doesn’t parse values or display a visual mask which sometimes would be nice to have in addition to formatting.

Formatting, parsing and visible masks are all nice things and with current addons using one technique rules out the others AFAIK.

I am not suggesting that we should have formatting, parsing and visible masks for all inputs. Those can conflict with each other.

Missing in DatePicker: Visible mask and or formatting as you type. Our [Date Format example](https://vaadin.com/docs/latest/components/date-picker#show-the-date-format) uses placeholder + helper text (which probably no one does). Once you type, the placeholder is hidden an you lose the hint of date format. You need to guess the right separator character where as in formatting the separator is added for you and you just type in numbers.

The main difference is that any formatting or parsing that DatePicker does happens after inserting the value, not during typing. Both are pretty minor issues, but at the same time not ideal UX and things that the customers have requested.

Chunking” is not trouble free either. In the [cleave.js demo](https://nosir.github.io/cleave.js/) the credit card value becomes formatted and after that there are spaces in the value and not only the presentation. Hitting backspace only removes a number if the cursor is next to number, not a space etc. etc

Use cases
**Formatting**
FI2112345600000785 -> FI21 1234 5600 0007 85
0401234567 -> [040 123 4567](tel:0401234567)
5.1.2027 -> 05.01.2027

**Parsing**
211234-56785 -> FI2112345600000785
0401234567 -> +358401234567
5/1/27 -> 05.01.2027

**Visible masks**
FI################ -> FI21123########### -> FI2112345600000785
___ ___ ____ -> 040 ___ ____ -> 040 123 4567
DD-MM-YYYY -> 05.MM.YYYY -> 05.01.2027

**Olli**
Sometimes it is possible have variable-length groups or alternative but limited characters; for example, a Finnish social security number is something like `[8 digits]` `[one of -, +, A]` `[three numbers and a fourth checksum character that is calculated based on the rest of the string]`

German landline phone numbers also have a local area code part which is either three or four numbers, such as `[+49 030 1234567](tel:+490301234567)`  (Berlin) or `[+49 0211 1234567](tel:+4902111234567)` (Dusseldorf). So where to put the space after the second group depends on the value of the second group

**Rolf**

TextField already has allowed-chars (that prevents entering disallowed chars) and pattern validation (that validates the full value on commit), so phone numbers can be at least enforced that way. Phone number masking is notoriously tricky business.

Visible masks are a PITA to implement. But.

- The _chunking_ (i.e. space-based segmentation) for e.g. IBAN or phone numbers should IMO be easily doable as a feature.
- I'm not convinced IBAN is common enough to warrant a separate component.
- A PhoneNumberField would face the same challenges as a masking/formatter feature because phone numbers are messy.

**Jean-Christophe**

They are mainly 2 usecases: the string formatting ( iban , social security...) and the number formatting. They seem similar but I guess the number formatting covers less case. Phone format is probably a beast that can't be covered. Not being able to have a number field with `500,000.34` euros is annoying. (see numeral formatting https://nosir.github.io/cleave-zen/ for a example)

For the phone number, it was handled by Cleave js. https://github.com/nosir/cleave.js/blob/master/doc/phone-lib-addon.md

> Why separate phone lib as an addon
> Phone lib uses google [libphonenumber](https://github.com/googlei18n/libphonenumber/) `AsYouTypeFormatter` feature to format phone numbers.
> Since the original i18n lib includes patterns for all the countries, the file size is relatively large (minified: 254K, gzipped 50K).
> In order to reduce the size, Cleave.js helped you separate the module based on countries, so that you can include any of them as an addon (minified: 14K, gzipped 5KB each).

Pattern validation is different what I expect, because I need to type the separators 044-787-90-90 or allow bad data in the backend like 04478790-90 or revalidate/reparse it.

### Relevant links

Add-ons:
https://github.com/vaadin-component-factory/input-mask/tree/v25/vcf-input-mask
https://github.com/vaadin-component-factory/textfieldformatter-zen/tree/v25
https://github.com/vaadin-miki/super-fields/tree/596-vaadin-25.3-preps

Mentioned libraries:
https://github.com/nosir/cleave.js
https://github.com/nosir/cleave-zen
https://github.com/uNmAnNeR/imaskjs

Forum:
https://vaadin.com/forum/t/how-to-mask-a-field-with-inputmask-in-vaadin-14/136601
