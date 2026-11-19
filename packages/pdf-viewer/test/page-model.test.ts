import { expect } from '@vaadin/chai-plugins';
import { planLinks } from '../src/pdf-viewer-page-model.js';
import type { PdfViewerStructTreeNode } from '../src/pdf-viewer-structure-layer.js';

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
});
