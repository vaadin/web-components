import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-message.js';

describe('message', () => {
  let message, tagName;

  beforeEach(() => {
    message = fixtureSync('<vaadin-message>Hello</vaadin-message>');
    tagName = message.tagName.toLowerCase();
  });

  it('should be defined in custom element registry', () => {
    expect(customElements.get(tagName)).to.be.ok;
  });

  it('should have a valid static "is" getter', () => {
    expect(customElements.get(tagName).is).to.equal(tagName);
  });

  describe('attachments', () => {
    describe('rendering', () => {
      it('should not render attachments container when attachments is undefined', () => {
        const attachmentsContainer = message.shadowRoot.querySelector('[part="attachments"]');
        expect(attachmentsContainer).to.be.null;
      });

      it('should not render attachments container when attachments is empty array', async () => {
        message.attachments = [];
        await nextRender();
        const attachmentsContainer = message.shadowRoot.querySelector('[part="attachments"]');
        expect(attachmentsContainer).to.be.null;
      });

      it('should render attachments container when attachments has items', async () => {
        message.attachments = [{ name: 'file.pdf', type: 'application/pdf' }];
        await nextRender();
        const attachmentsContainer = message.shadowRoot.querySelector('[part="attachments"]');
        expect(attachmentsContainer).to.exist;
      });

      it('should render file attachment with name and icon', async () => {
        message.attachments = [{ name: 'document.pdf', type: 'application/pdf' }];
        await nextRender();
        const attachment = message.shadowRoot.querySelector('[part~="attachment-file"]');
        expect(attachment).to.exist;
        expect(attachment.querySelector('[part="attachment-name"]').textContent).to.equal('document.pdf');
        expect(attachment.querySelector('[part="attachment-icon"]')).to.exist;
      });

      it('should render image attachment with preview', async () => {
        const imgUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        message.attachments = [{ name: 'photo.png', url: imgUrl, type: 'image/png' }];
        await nextRender();
        const attachment = message.shadowRoot.querySelector('[part~="attachment-image"]');
        expect(attachment).to.exist;
        const img = attachment.querySelector('[part="attachment-preview"]');
        expect(img).to.exist;
        expect(img.src).to.equal(imgUrl);
      });

      it('should render mixed image and file attachments', async () => {
        const imgUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        message.attachments = [
          { name: 'photo.png', url: imgUrl, type: 'image/png' },
          { name: 'document.pdf', type: 'application/pdf' },
          { name: 'screenshot.jpg', url: imgUrl, type: 'image/jpeg' },
        ];
        await nextRender();
        const imageAttachments = message.shadowRoot.querySelectorAll('[part~="attachment-image"]');
        const fileAttachments = message.shadowRoot.querySelectorAll('[part~="attachment-file"]');
        expect(imageAttachments.length).to.equal(2);
        expect(fileAttachments.length).to.equal(1);
      });

      it('should update attachments when property changes', async () => {
        message.attachments = [{ name: 'file1.pdf', type: 'application/pdf' }];
        await nextRender();
        let attachments = message.shadowRoot.querySelectorAll('[part~="attachment"]');
        expect(attachments.length).to.equal(1);

        message.attachments = [
          { name: 'file1.pdf', type: 'application/pdf' },
          { name: 'file2.pdf', type: 'application/pdf' },
        ];
        await nextRender();
        attachments = message.shadowRoot.querySelectorAll('[part~="attachment"]');
        expect(attachments.length).to.equal(2);
      });

      it('should remove attachments when set to null', async () => {
        message.attachments = [{ name: 'file.pdf', type: 'application/pdf' }];
        await nextRender();
        expect(message.shadowRoot.querySelector('[part="attachments"]')).to.exist;

        message.attachments = null;
        await nextRender();
        expect(message.shadowRoot.querySelector('[part="attachments"]')).to.be.null;
      });
    });

    describe('malformed attachment objects', () => {
      it('should handle attachment with missing name', async () => {
        message.attachments = [{ url: 'http://example.com/file.pdf', type: 'application/pdf' }];
        await nextRender();
        const attachment = message.shadowRoot.querySelector('[part~="attachment-file"]');
        expect(attachment).to.exist;
        const nameSpan = attachment.querySelector('[part="attachment-name"]');
        expect(nameSpan.textContent).to.equal('');
      });

      it('should handle attachment with missing url for image', async () => {
        message.attachments = [{ name: 'photo.png', type: 'image/png' }];
        await nextRender();
        const attachment = message.shadowRoot.querySelector('[part~="attachment-image"]');
        expect(attachment).to.exist;
        const img = attachment.querySelector('[part="attachment-preview"]');
        expect(img).to.exist;
        expect(img.hasAttribute('src')).to.be.false;
      });

      it('should handle attachment with missing type as file', async () => {
        message.attachments = [{ name: 'unknown-file' }];
        await nextRender();
        const fileAttachment = message.shadowRoot.querySelector('[part~="attachment-file"]');
        const imageAttachment = message.shadowRoot.querySelector('[part~="attachment-image"]');
        expect(fileAttachment).to.exist;
        expect(imageAttachment).to.be.null;
      });

      it('should handle empty attachment object', async () => {
        message.attachments = [{}];
        await nextRender();
        const attachment = message.shadowRoot.querySelector('[part~="attachment"]');
        expect(attachment).to.exist;
      });
    });

    describe('click events', () => {
      it('should dispatch attachment-click event when file attachment is clicked', async () => {
        const attachment = { name: 'document.pdf', url: 'http://example.com/doc.pdf', type: 'application/pdf' };
        message.attachments = [attachment];
        await nextRender();

        const spy = sinon.spy();
        message.addEventListener('attachment-click', spy);

        const button = message.shadowRoot.querySelector('[part~="attachment-file"]');
        button.click();

        expect(spy.calledOnce).to.be.true;
        expect(spy.firstCall.args[0].detail.attachment).to.deep.equal(attachment);
      });

      it('should dispatch attachment-click event when image attachment is clicked', async () => {
        const imgUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        const attachment = { name: 'photo.png', url: imgUrl, type: 'image/png' };
        message.attachments = [attachment];
        await nextRender();

        const spy = sinon.spy();
        message.addEventListener('attachment-click', spy);

        const button = message.shadowRoot.querySelector('[part~="attachment-image"]');
        button.click();

        expect(spy.calledOnce).to.be.true;
        expect(spy.firstCall.args[0].detail.attachment).to.deep.equal(attachment);
      });

      it('should dispatch event with correct attachment when multiple attachments exist', async () => {
        const imgUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        const attachments = [
          { name: 'photo.png', url: imgUrl, type: 'image/png' },
          { name: 'document.pdf', url: 'http://example.com/doc.pdf', type: 'application/pdf' },
        ];
        message.attachments = attachments;
        await nextRender();

        const spy = sinon.spy();
        message.addEventListener('attachment-click', spy);

        const fileButton = message.shadowRoot.querySelector('[part~="attachment-file"]');
        fileButton.click();

        expect(spy.calledOnce).to.be.true;
        expect(spy.firstCall.args[0].detail.attachment).to.deep.equal(attachments[1]);
      });

      it('should not include item in standalone message event', async () => {
        message.attachments = [{ name: 'file.pdf', type: 'application/pdf' }];
        await nextRender();

        const spy = sinon.spy();
        message.addEventListener('attachment-click', spy);

        const button = message.shadowRoot.querySelector('[part~="attachment-file"]');
        button.click();

        expect(spy.calledOnce).to.be.true;
        expect(spy.firstCall.args[0].detail).to.not.have.property('item');
      });
    });

    describe('accessibility', () => {
      it('should set aria-label on image attachment button', async () => {
        const imgUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        message.attachments = [{ name: 'photo.png', url: imgUrl, type: 'image/png' }];
        await nextRender();

        const button = message.shadowRoot.querySelector('[part~="attachment-image"]');
        expect(button.getAttribute('aria-label')).to.equal('photo.png');
      });

      it('should set empty aria-label on image attachment without name', async () => {
        const imgUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        message.attachments = [{ url: imgUrl, type: 'image/png' }];
        await nextRender();

        const button = message.shadowRoot.querySelector('[part~="attachment-image"]');
        expect(button.getAttribute('aria-label')).to.equal('');
      });

      it('should set aria-hidden on file attachment icon', async () => {
        message.attachments = [{ name: 'document.pdf', type: 'application/pdf' }];
        await nextRender();

        const icon = message.shadowRoot.querySelector('[part="attachment-icon"]');
        expect(icon.getAttribute('aria-hidden')).to.equal('true');
      });

      it('should set alt="" on image preview for decorative image', async () => {
        const imgUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        message.attachments = [{ name: 'photo.png', url: imgUrl, type: 'image/png' }];
        await nextRender();

        const img = message.shadowRoot.querySelector('[part="attachment-preview"]');
        expect(img.getAttribute('alt')).to.equal('');
      });

      it('should render attachment buttons with type="button"', async () => {
        const imgUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        message.attachments = [
          { name: 'photo.png', url: imgUrl, type: 'image/png' },
          { name: 'document.pdf', type: 'application/pdf' },
        ];
        await nextRender();

        const buttons = message.shadowRoot.querySelectorAll('[part~="attachment"]');
        buttons.forEach((button) => {
          expect(button.getAttribute('type')).to.equal('button');
        });
      });
    });

    describe('type detection', () => {
      it('should detect image/png as image', async () => {
        message.attachments = [{ name: 'test.png', type: 'image/png' }];
        await nextRender();
        expect(message.shadowRoot.querySelector('[part~="attachment-image"]')).to.exist;
      });

      it('should detect image/jpeg as image', async () => {
        message.attachments = [{ name: 'test.jpg', type: 'image/jpeg' }];
        await nextRender();
        expect(message.shadowRoot.querySelector('[part~="attachment-image"]')).to.exist;
      });

      it('should detect image/gif as image', async () => {
        message.attachments = [{ name: 'test.gif', type: 'image/gif' }];
        await nextRender();
        expect(message.shadowRoot.querySelector('[part~="attachment-image"]')).to.exist;
      });

      it('should detect image/webp as image', async () => {
        message.attachments = [{ name: 'test.webp', type: 'image/webp' }];
        await nextRender();
        expect(message.shadowRoot.querySelector('[part~="attachment-image"]')).to.exist;
      });

      it('should detect image/svg+xml as image', async () => {
        message.attachments = [{ name: 'test.svg', type: 'image/svg+xml' }];
        await nextRender();
        expect(message.shadowRoot.querySelector('[part~="attachment-image"]')).to.exist;
      });

      it('should detect application/pdf as file', async () => {
        message.attachments = [{ name: 'test.pdf', type: 'application/pdf' }];
        await nextRender();
        expect(message.shadowRoot.querySelector('[part~="attachment-file"]')).to.exist;
      });

      it('should detect text/plain as file', async () => {
        message.attachments = [{ name: 'test.txt', type: 'text/plain' }];
        await nextRender();
        expect(message.shadowRoot.querySelector('[part~="attachment-file"]')).to.exist;
      });

      it('should detect application/json as file', async () => {
        message.attachments = [{ name: 'data.json', type: 'application/json' }];
        await nextRender();
        expect(message.shadowRoot.querySelector('[part~="attachment-file"]')).to.exist;
      });
    });
  });
});
