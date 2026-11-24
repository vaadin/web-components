# PDF test files

These files support manual testing of `<vaadin-pdf-viewer>` on the `dev/pdf-viewer.html` page.
Each file covers one area of the viewer, such as fonts, forms or accessibility.
Unit tests never read these files.

## `01_fonts.pdf`

**Covers**: Font rendering and text extraction for embedded and non-embedded fonts and scripts
**Notes**: The file does not embed the Standard 14 fonts, so they need `standardFontDataUrl`. Page 1 has invisible text. Page 2 has right-to-left and CJK text.

## `02_images_and_vector_graphics.pdf`

**Covers**: Raster images in several color spaces, plus vector graphics
**Notes**: Page 1 has a CMYK JPEG and an image with a soft mask. Page 2 has a spot color and axial and radial shadings.

## `03_form_with_signatures.pdf`

**Covers**: Every common form field type, plus one signed and one empty signature field
**Notes**: A self-signed test certificate for "Jane Doe" signs the first signature field. Viewers report the signer as not trusted. The second signature field is empty.

## `04_optional_content_help_layer.pdf`

**Covers**: Help texts on an optional content layer that shows on screen only
**Notes**: The "Help texts" layer shows on screen but not in print. The "Detailed instructions" layer is off by default.

## `05_tagged_accessible_pdf_ua.pdf`

**Covers**: Headings, lists, tables, alt text, links and language changes for screen readers
**Notes**: The file declares PDF/UA-1 conformance. It has a 10-entry outline and 14 links, one of them external.
