import '../enable-feature-flag.js';
import '@vaadin/pdf-viewer';
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

viewer.src = pdfUrl;
