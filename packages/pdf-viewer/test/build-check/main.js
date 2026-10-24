import '../enable-feature-flag.js';
import '@vaadin/pdf-viewer';
import fontsPdfUrl from '../../../../dev/assets/pdf/01_fonts.pdf?url';
import pdfUrl from '../../../../dev/assets/pdf/05_tagged_accessible_pdf_ua.pdf?url';

const viewer = document.querySelector('vaadin-pdf-viewer');
const status = document.querySelector('#status');

viewer.addEventListener('document-load', (event) => {
  status.dataset.state = 'loaded';
  status.textContent = `Loaded, ${event.detail.pageCount} pages`;
});

viewer.addEventListener('document-error', (event) => {
  status.dataset.state = 'error';
  status.dataset.reason = event.detail.reason;
  status.textContent = `Error: ${event.detail.reason}`;
});

// With `?assets`, show a document that needs the pdf.js assets, which check.js copies to `/pdfjs-dist/`.
if (new URLSearchParams(location.search).has('assets')) {
  viewer.assetsUrl = '/pdfjs-dist/';
  viewer.src = fontsPdfUrl;
} else {
  viewer.src = pdfUrl;
}
