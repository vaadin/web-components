import '../../../packages/pdf-viewer/test/enable-feature-flag.js';
import { useState } from 'react';
import { Button } from '../../../packages/react-components/src/Button.js';
import { PdfViewer } from '../../../packages/react-components-pro/src/PdfViewer.js';

const src = new URL('../../../dev/assets/pdf/05_tagged_accessible_pdf_ua.pdf', import.meta.url).href;

export default function () {
  const [log, setLog] = useState<string[]>([]);
  const addToLog = (entry: string) => setLog((entries) => [...entries, entry]);

  return (
    <>
      <PdfViewer
        src={src}
        style={{ height: '600px' }}
        onDocumentLoad={(event) => addToLog(`document-load: ${event.detail.pageCount} pages`)}
        onPageChanged={(event) => addToLog(`page-changed: ${event.detail.value}`)}
        onFindResult={(event) => addToLog(`find-result: ${event.detail.matchCount} for "${event.detail.query}"`)}
      >
        <Button slot="toolbar-actions" onClick={() => addToLog('Approve clicked')}>
          Approve
        </Button>
      </PdfViewer>
      <pre>{log.join('\n')}</pre>
    </>
  );
}
