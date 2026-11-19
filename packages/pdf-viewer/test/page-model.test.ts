import { expect } from '@vaadin/chai-plugins';
import { buildStructure, getContentIndexes, getText, indexText, planLinks } from '../src/pdf-viewer-page-model.js';
import type { PdfViewerStructTreeNode } from '../src/pdf-viewer-structure-layer.js';
import { PdfViewerTextLayer } from '../src/pdf-viewer-text-layer.js';
import { acquireWorker, loadPdfjs, releaseWorker } from '../src/pdfjs-loader.js';
import { fixtureUrl } from './helpers.js';

describe('page model', () => {
  describe('planLinks', () => {
    // An annotation of object `id`, on a line from the top of the page.
    function annotation(id: number, line = 0, overlaidText = '') {
      return { id: `${id}R`, rect: [72, 700 - line * 30, 150, 720 - line * 30], overlaidText };
    }

    function link(children: PdfViewerStructTreeNode[], alt?: string) {
      return { role: 'Root', children: [{ role: 'Link', alt, children }] };
    }

    const annotationNode = (id: number) => ({ type: 'annotation', id: `pdfjs_internal_id_${id}R` });

    const figure = { role: 'Figure', alt: 'Logo', children: [{ type: 'content', id: 'p3R_mc0' }] };

    it('should plan a link for each annotation that renders, in reading order, without a structure', () => {
      const plan = planLinks(null, [annotation(6, 1), annotation(5), annotation(7, 2)], ({ id }) => id !== '7R');
      expect(plan.links.map(({ id }) => id)).to.deep.equal(['pdfjs_internal_id_5R', 'pdfjs_internal_id_6R']);
      expect(plan.links.every(({ ownedByStructure }) => !ownedByStructure)).to.be.true;
    });

    it('should plan the annotations of a link structure element as one link, which owns its text', () => {
      const tree = link([{ type: 'content', id: 'p3R_mc0' }, annotationNode(5), annotationNode(6)], 'Docs');
      const plan = planLinks(tree, [annotation(6, 1), annotation(5)], () => true);
      expect(plan.links).to.have.lengthOf(1);
      const [{ id, annotations, alt, contentIds, ownedByStructure }] = plan.links;
      expect(id).to.equal('pdfjs_internal_id_5R');
      expect(annotations.map((part) => part.id)).to.deep.equal(['5R', '6R']);
      expect(alt).to.equal('Docs');
      expect(contentIds).to.deep.equal(['p3R_mc0']);
      expect(ownedByStructure).to.be.true;
      expect([...plan.linkContents].map((node) => node.id)).to.deep.equal(['p3R_mc0']);
    });

    it('should leave the text to the structure when its link does not render', () => {
      const tree = link([{ type: 'content', id: 'p3R_mc0' }, annotationNode(5)]);
      const plan = planLinks(tree, [annotation(5)], () => false);
      expect(plan.links).to.be.empty;
      expect(plan.linkContents.size).to.equal(0);
      expect([...plan.contentIds]).to.deep.equal(['p3R_mc0']);
    });

    it('should give the text of a link structure element in a link structure element to the inner link', () => {
      const tree = link([
        { type: 'content', id: 'p3R_mc0' },
        { role: 'Link', children: [{ type: 'content', id: 'p3R_mc1' }, annotationNode(6)] },
        annotationNode(5),
      ]);
      const plan = planLinks(tree, [annotation(5), annotation(6, 1)], () => true);
      expect(plan.links.map(({ contentIds }) => contentIds)).to.deep.equal([['p3R_mc0'], ['p3R_mc1']]);
    });

    it('should name a link that shows only a figure by the alternative text of the figure', () => {
      const plan = planLinks(link([figure, annotationNode(5)]), [annotation(5)], () => true);
      expect(plan.links[0].alt).to.equal('Logo');
      expect([...plan.linkFigures]).to.deep.equal([figure]);
    });

    it('should not name a link that also shows text by the alternative text of its figure', () => {
      const tree = link([figure, { type: 'content', id: 'p3R_mc1' }, annotationNode(5)]);
      const plan = planLinks(tree, [annotation(5)], () => true);
      expect(plan.links[0].alt).to.be.undefined;
      expect(plan.linkFigures.size).to.equal(0);
    });

    it('should not plan a link that a table owns, as a table skips its direct content', () => {
      const tree = { role: 'Root', children: [{ role: 'Table', children: [annotationNode(5)] }] };
      const plan = planLinks(tree, [annotation(5)], () => true);
      expect(plan.links[0].ownedByStructure).to.be.false;
    });
  });

  describe('buildStructure', () => {
    const annotation = { id: '5R', rect: [72, 700, 150, 720] };

    function build(children: PdfViewerStructTreeNode[], isRendered = false) {
      const plan = planLinks({ role: 'Root', children }, [annotation], () => isRendered);
      return buildStructure(plan, new Map([['p3R_mc0', ['p3R_mc0_0']]]))!.children;
    }

    it('should give an element the text elements of its marked content', () => {
      const [paragraph] = build([{ role: 'P', children: [{ type: 'content', id: 'p3R_mc0' }] }]);
      expect(paragraph).to.include({ role: 'paragraph', owns: 'p3R_mc0_0' });
    });

    it('should give a figure an image with its alternative text', () => {
      const [figure] = build([{ role: 'Figure', alt: 'Logo', children: [{ type: 'content', id: 'p3R_mc0' }] }]);
      expect(figure).to.include({ role: 'figure', image: 'Logo' });
      expect(figure.label).to.be.undefined;
    });

    it('should leave the text, the figure and the alternative text of a link structure element to its link', () => {
      const figure = { role: 'Figure', alt: 'Logo', children: [{ type: 'content', id: 'p3R_mc0' }] };
      const [link] = build(
        [{ role: 'Link', children: [figure, { type: 'annotation', id: 'pdfjs_internal_id_5R' }] }],
        true,
      );
      const [figureNode, annotationNode] = link.children;
      expect(figureNode).to.include({ role: null });
      expect(figureNode.image).to.be.undefined;
      expect(figureNode.owns).to.be.undefined;
      expect(annotationNode.owns).to.equal('pdfjs_internal_id_5R');
    });

    it('should keep the alternative text of an element whose annotation gets no link', () => {
      const [form] = build([
        { role: 'Form', alt: 'Name', children: [{ type: 'annotation', id: 'pdfjs_internal_id_5R' }] },
      ]);
      expect(form).to.include({ role: 'form', label: 'Name' });
      expect(form.owns).to.be.undefined;
    });
  });

  describe('text index', () => {
    const begin = (id?: string, tag = 'P') => ({ type: 'beginMarkedContentProps', id, tag });
    const end = { type: 'endMarkedContent' };
    const text = (str: string, hasEOL = false) => ({ str, hasEOL });

    it('should give each marked content its text, also in nested marked content that the structure does not own', () => {
      const index = indexText([
        begin('p3R_mc0'),
        text('A', true),
        begin('p3R_mc1'),
        text('B'),
        end,
        begin(),
        text('C'),
        end,
        begin(undefined, 'Artifact'),
        text('Artifact'),
        end,
        text(''),
        end,
      ]);
      const indexes = getContentIndexes(index, new Set(['p3R_mc0', 'p3R_mc1', 'p3R_mc2']));
      expect([...indexes]).to.deep.equal([
        ['p3R_mc0', [0, 2]],
        ['p3R_mc1', [1]],
      ]);
    });

    it('should give no text to a second marked content with the same id, which the text layer does not find', () => {
      const index = indexText([begin('p3R_mc0'), text('A'), end, begin('p3R_mc0'), text('B'), end]);
      expect([...getContentIndexes(index, new Set(['p3R_mc0']))]).to.deep.equal([['p3R_mc0', [0]]]);
    });

    it('should give the text with a space after a line break, also after empty text that ends a line', () => {
      const index = indexText([text('Vaadin'), text('', true), text('docs', true), text('and'), text('more')]);
      expect(getText(index, [0, 2, 3, 4, undefined])).to.equal('Vaadin docs andmore');
    });

    it('should stop where the text layer of pdf.js stops', () => {
      const index = indexText(Array.from({ length: 100005 }, () => text('A')));
      expect(index.texts).to.have.lengthOf(100001);
    });

    it('should index the text as the text layer of pdf.js renders it', async () => {
      const pdfjs = await loadPdfjs();
      const handle = acquireWorker(pdfjs);
      const task = pdfjs.getDocument({ url: fixtureUrl('tagged.pdf'), worker: handle.worker! });
      try {
        const pdfPage = await (await task.promise).getPage(1);
        const textLayer = new PdfViewerTextLayer();
        await textLayer.render(pdfPage, pdfPage.getViewport({ scale: 1 }), new AbortController().signal);
        const contents = [...textLayer.element.querySelectorAll('.markedContent[id]')];
        const contentSpans = textLayer.getContentSpans(new Set(contents.map(({ id }) => id)));
        contents.forEach((content) => {
          // The text elements of the marked content, without the marked content and the artifacts in it.
          const expected = [...content.querySelectorAll('span:not(.markedContent)')].filter(
            (span) => span.parentElement!.closest('.markedContent:is([id], [aria-hidden="true"])') === content,
          );
          expect(contentSpans.get(content.id)!.map((id) => textLayer.element.querySelector(`#${id}`))).to.deep.equal(
            expected,
          );
        });
        expect(contentSpans.size).to.equal(contents.length);
      } finally {
        await task.destroy();
        releaseWorker(handle);
      }
    });
  });
});
