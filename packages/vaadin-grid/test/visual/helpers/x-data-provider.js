import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { users } from './users.js';

function getJSON(index) {
  return JSON.parse(JSON.stringify(users[index % users.length])); // clone object
}

class XDataProvider extends PolymerElement {
  static get is() {
    return 'x-data-provider';
  }

  static get properties() {
    return {
      loading: {
        type: Boolean,
        notify: true
      },

      delay: {
        type: Number,
        value: 0
      },

      dataProvider: {
        notify: true,
        value: () => {
          const self = this;
          return (params, callback) => {
            const items = Array.apply(null, { length: params.pageSize }).map((item, index) =>
              getJSON(index + params.page * params.pageSize)
            );
            self.loading = true;
            setTimeout(() => {
              callback(items);
              self.loading = false;
            }, self.delay);
          };
        }
      }
    };
  }
}

customElements.define(XDataProvider.is, XDataProvider);

class XArrayDataProvider extends PolymerElement {
  static get is() {
    return 'x-array-data-provider';
  }

  static get properties() {
    return {
      size: {
        type: Number,
        value: null
      },
      items: {
        notify: true,
        computed: '_computeItems(size)'
      }
    };
  }
  _computeItems(size) {
    if (size !== null) {
      return users.slice(0, size);
    } else {
      return users;
    }
  }
}

customElements.define(XArrayDataProvider.is, XArrayDataProvider);
