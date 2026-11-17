import { expect } from '@vaadin/chai-plugins';
import { type PdfViewerStructTreeNode, PdfViewerStructureLayer } from '../src/pdf-viewer-structure-layer.js';

describe('structure layer', () => {
  function create(children: PdfViewerStructTreeNode[]) {
    return new PdfViewerStructureLayer({ role: 'Root', children });
  }

  it('should not take a role from the inherited properties of objects', () => {
    const { element } = create(
      ['constructor', 'toString', '__proto__'].map((role) => ({
        role,
        children: [{ type: 'content', id: 'p3R_mc0' }],
      })),
    );
    expect(element.querySelector('[role]')).to.be.null;
  });

  it('should expose a table of contents as a list', () => {
    const { element } = create([
      {
        role: 'TOC',
        children: [
          { role: 'TOCI', children: [{ type: 'content', id: 'p3R_mc0' }] },
          { role: 'TOCI', children: [{ type: 'content', id: 'p3R_mc1' }] },
        ],
      },
    ]);
    const list = element.querySelector('[role="list"]')!;
    expect(list.querySelectorAll('[role="listitem"]')).to.have.lengthOf(2);
  });

  it('should expose the cells that span rows and columns', () => {
    const { element } = create([
      {
        role: 'Table',
        children: [
          {
            role: 'TR',
            children: [{ role: 'TD', rowSpan: 2, colSpan: 3, children: [{ type: 'content', id: 'p3R_mc0' }] }],
          },
        ],
      },
    ]);
    const cell = element.querySelector('[role="cell"]')!;
    expect(cell.getAttribute('aria-rowspan')).to.equal('2');
    expect(cell.getAttribute('aria-colspan')).to.equal('3');
  });

  it('should expose the headers of the rows of a table body as row headers', () => {
    const { element } = create([
      {
        role: 'Table',
        children: [
          {
            role: 'TBody',
            children: [{ role: 'TR', children: [{ role: 'TH', children: [{ type: 'content', id: 'p3R_mc0' }] }] }],
          },
        ],
      },
    ]);
    expect(element.querySelector('[role="rowheader"]')).to.be.ok;
  });

  it('should expose headers by their scope', () => {
    const header = (scope: 'Column' | 'Row') => ({
      role: 'TH',
      scope,
      children: [{ type: 'content', id: 'p3R_mc0' }],
    });
    const { element } = create([
      {
        role: 'Table',
        children: [
          { role: 'TR', children: [header('Row')] },
          { role: 'TBody', children: [{ role: 'TR', children: [header('Column')] }] },
        ],
      },
    ]);
    const roles = [...element.querySelectorAll('[role="row"] > *')].map((cell) => cell.getAttribute('role'));
    expect(roles).to.deep.equal(['rowheader', 'columnheader']);
  });

  it('should expose a caption only as the caption of a table or a figure', () => {
    const caption = { role: 'Caption', children: [{ type: 'content', id: 'p3R_mc0' }] };
    const { element } = create([
      { role: 'Table', children: [caption] },
      { role: 'Figure', children: [caption] },
      { role: 'P', children: [caption] },
    ]);
    const roles = [...element.querySelectorAll('[aria-owns="p3R_mc0"]')].map((owner) => owner.getAttribute('role'));
    expect(roles).to.deep.equal(['caption', 'caption', null]);
  });

  it('should not own content directly in a list or a row, which have only items or cells', () => {
    const { element } = create([
      {
        role: 'L',
        children: [
          { type: 'content', id: 'p3R_mc0' },
          { role: 'LI', children: [] },
        ],
      },
      {
        role: 'Table',
        children: [
          {
            role: 'TR',
            children: [
              { type: 'content', id: 'p3R_mc1' },
              { role: 'TD', children: [] },
            ],
          },
        ],
      },
    ]);
    expect(element.querySelector('[aria-owns]')).to.be.null;
  });

  it('should not name a paragraph with its alternative text', () => {
    const { element } = create([{ role: 'P', alt: 'Note', children: [{ type: 'content', id: 'p3R_mc0' }] }]);
    const paragraph = element.querySelector('[role="paragraph"]')!;
    expect(paragraph.hasAttribute('aria-label')).to.be.false;
    expect(paragraph.getAttribute('aria-description')).to.equal('Note');
  });

  it('should describe an element without a role by its alternative text', () => {
    const { element } = create([
      { role: 'Span', alt: 'Note', children: [{ type: 'content', id: 'p3R_mc0' }] },
      { role: 'NonStruct', alt: 'Note', children: [{ type: 'content', id: 'p3R_mc1' }] },
    ]);
    const [span, nonStruct] = element.children;
    expect(span.getAttribute('aria-description')).to.equal('Note');
    expect(nonStruct.hasAttribute('role')).to.be.false;
    expect(nonStruct.getAttribute('aria-description')).to.equal('Note');
  });

  it('should own the text in marked content, and in nested marked content once, without artifacts', () => {
    const textLayer = document.createElement('div');
    textLayer.innerHTML = `
      <span class="markedContent" id="p3R_mc0">
        <span>A</span>
        <br>
        <span class="markedContent" id="p3R_mc1"><span>B</span></span>
        <span class="markedContent"><span>C</span></span>
        <span class="markedContent" aria-hidden="true"><span>Artifact</span></span>
      </span>
    `;
    const structure = create([
      { role: 'P', children: [{ type: 'content', id: 'p3R_mc0' }] },
      { role: 'Span', children: [{ type: 'content', id: 'p3R_mc1' }] },
    ]);
    structure.bindText(textLayer);
    const owned = [...structure.element.querySelectorAll('[aria-owns]')].map((owner) =>
      owner
        .getAttribute('aria-owns')!
        .split(' ')
        .map((id) => textLayer.querySelector(`#${id}`)!.textContent),
    );
    expect(owned).to.deep.equal([['A', 'C'], ['B']]);
  });

  it('should only own the elements of content', () => {
    const { element } = create([
      {
        role: 'P',
        children: [
          { type: 'content', id: 'p3R_mc0' },
          { type: 'content', id: 'p12R1_mc7' },
          { type: 'content', id: 'p3R_mcx content pages thumbnails' },
          { type: 'annotation', id: 'pdfjs_internal_id_5R' },
          { type: 'object', id: '15R' },
        ],
      },
    ]);
    const owned = [...element.querySelectorAll('[aria-owns]')].map((owner) => owner.getAttribute('aria-owns'));
    expect(owned).to.deep.equal(['p3R_mc0', 'p12R1_mc7']);
  });

  function createLink(id: string) {
    const link = document.createElement('a');
    link.id = id;
    return link;
  }

  it('should only own the links of annotations that render', () => {
    const structure = create([
      {
        role: 'P',
        children: [
          { type: 'annotation', id: 'pdfjs_internal_id_5R' },
          { type: 'annotation', id: 'pdfjs_internal_id_6R' },
        ],
      },
    ]);
    const link = createLink('pdfjs_internal_id_5R');
    structure.bindLinks([link]);
    expect(structure.hasLink(link)).to.be.true;
    const owners = structure.element.querySelectorAll('[aria-owns]');
    expect([...owners].map((owner) => owner.getAttribute('aria-owns'))).to.deep.equal(['pdfjs_internal_id_5R']);
  });

  it('should not own an annotation directly in a table, which owns no content', () => {
    const structure = create([{ role: 'Table', children: [{ type: 'annotation', id: 'pdfjs_internal_id_5R' }] }]);
    expect(structure.element.querySelector('[aria-owns]')).to.be.null;
    const link = createLink('pdfjs_internal_id_5R');
    structure.bindLinks([link]);
    expect(structure.hasLink(link)).to.be.false;
  });

  it('should name an element by its alternative text when its annotation gets no link, e.g. a form field', () => {
    const structure = create([
      { role: 'Form', alt: 'Name', children: [{ type: 'annotation', id: 'pdfjs_internal_id_5R' }] },
    ]);
    const form = structure.element.querySelector('[role="form"]')!;
    expect(form.getAttribute('aria-label')).to.equal('Name');
    structure.bindLinks([]);
    expect(form.getAttribute('aria-label')).to.equal('Name');
  });

  it('should describe a link structure element by its alternative text when it gets no link', () => {
    const structure = create([
      {
        role: 'Link',
        alt: 'Docs',
        children: [
          { type: 'content', id: 'p3R_mc0' },
          { type: 'annotation', id: 'pdfjs_internal_id_5R' },
        ],
      },
    ]);
    structure.bindLinks([]);
    expect(structure.element.firstElementChild!.getAttribute('aria-description')).to.equal('Docs');
  });

  it('should not expose a link structure element as a link, also with no annotation or several', () => {
    const structure = create([
      { role: 'Link', children: [{ type: 'content', id: 'p3R_mc0' }] },
      {
        role: 'Link',
        children: [
          { type: 'content', id: 'p3R_mc1' },
          { type: 'annotation', id: 'pdfjs_internal_id_5R' },
          { type: 'annotation', id: 'pdfjs_internal_id_6R' },
        ],
      },
    ]);
    structure.bindLinks([createLink('pdfjs_internal_id_5R'), createLink('pdfjs_internal_id_6R')]);
    expect(structure.element.querySelector('[role]')).to.be.null;
  });

  it('should not add an image for a figure with a link, which its alternative text names', () => {
    const structure = create([
      {
        role: 'Figure',
        alt: 'Chart',
        children: [
          { type: 'content', id: 'p3R_mc0' },
          { type: 'annotation', id: 'pdfjs_internal_id_5R' },
        ],
      },
    ]);
    expect(structure.element.querySelector('[role="img"]')).to.be.null;
    expect(structure.getLinkAlt('pdfjs_internal_id_5R')).to.equal('Chart');
  });

  it('should give a link the text of its link structure element', () => {
    const structure = create([
      {
        role: 'Link',
        alt: 'Docs',
        children: [
          { type: 'content', id: 'p3R_mc0' },
          { type: 'annotation', id: 'pdfjs_internal_id_5R' },
        ],
      },
    ]);
    expect(structure.getLinkAlt('pdfjs_internal_id_5R')).to.equal('Docs');
    const link = createLink('pdfjs_internal_id_5R');
    structure.bindLinks([link]);
    expect(structure.hasLink(link)).to.be.true;
    expect(structure.element.firstElementChild!.hasAttribute('aria-description')).to.be.false;
    expect(link.getAttribute('aria-owns')).to.equal('p3R_mc0');
    expect(structure.element.querySelector('[aria-owns="p3R_mc0"]')).to.be.null;
  });
});
