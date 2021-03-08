import { html } from 'lit-html';
import { UploadElement } from '../packages/vaadin-upload/vaadin-upload.js';
import { MockHttpRequest } from '../packages/vaadin-upload/test/mock-http-request.js';

export default {
  title: 'Components/<vaadin-upload>',
  argTypes: {
    nodrop: { control: 'boolean' }
  }
};

function mockXhrGenerator(file) {
  const xhr = new MockHttpRequest();
  xhr.upload = {};
  xhr.onsend = function () {
    if (xhr.upload.onloadstart) {
      xhr.upload.onloadstart();
    }
    const total = (file && file.size) || 1024;
    let done = 0;

    function start() {
      setTimeout(progress, 1000);
    }

    function progress() {
      xhr.upload.onprogress({ total: total, loaded: done });
      if (done < total) {
        setTimeout(progress, 200);
        done = Math.min(total, done + 254000);
      } else if (!file.abort) {
        setTimeout(finish, 1000);
      }
    }

    function finish() {
      xhr.receive(200, '{"message":"OK"}');
    }

    start();
  };

  return xhr;
}

// Monkey-patch vaadin-upload prototype to use MockHttpRequest
UploadElement.prototype._createXhr = mockXhrGenerator;

const Upload = ({ nodrop = false }) => {
  return html`<vaadin-upload .nodrop="${nodrop}"></vaadin-upload>`;
};

export const Basic = (args) => Upload(args);
