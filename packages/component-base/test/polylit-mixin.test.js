import { expect } from '@esm-bundle/chai';
import { defineCE, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, LitElement } from 'lit';
import { PolylitMixin } from '../src/polylit-mixin.js';

describe('PolylitMixin', () => {
  describe('ready', () => {
    let element;
    const readySpy = sinon.spy();

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        ready() {
          readySpy();
        }

        render() {
          return html`Ready!`;
        }
      },
    );

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
    });

    it('should call ready when element update is complete', async () => {
      expect(readySpy.calledOnce).to.be.false;
      await element.updateComplete;
      expect(readySpy.calledOnce).to.be.true;
    });
  });

  describe('convenience', () => {
    let element;
    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        render() {
          return html`<div id="foo">Component</div>`;
        }

        get(path, object) {
          return this._get(path, object);
        }

        set(path, value, object) {
          this._set(path, value, object);
        }
      },
    );

    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await element.updateComplete;
    });

    it('should reference elements with id', async () => {
      expect(element.$.foo).to.be.instanceOf(HTMLDivElement);
    });

    it('should get the nested value', async () => {
      expect(element.get('foo.bar', { foo: { bar: 'baz' } })).to.equal('baz');
    });

    it('should return undefined for a non-existent value', async () => {
      expect(element.get('foo.bar', {})).to.be.undefined;
    });

    it('should set the nested value', async () => {
      const object = { foo: {} };
      element.set('foo.bar', 'baz', object);
      expect(object.foo.bar).to.equal('baz');
    });
  });

  describe('reflectToAttribute', () => {
    let element;

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            name: {
              type: String,
              reflectToAttribute: true,
            },

            disabled: {
              type: Boolean,
              reflectToAttribute: true,
            },

            longName: {
              type: Boolean,
              reflectToAttribute: true,
            },
          };
        }

        render() {
          return html`<button ?disabled="${this.disabled}">${this.name}</button>`;
        }
      },
    );

    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await element.updateComplete;
    });

    it('should reflect string property to attribute', async () => {
      element.name = 'foo';
      await element.updateComplete;
      expect(element.getAttribute('name')).to.equal('foo');

      element.name = undefined;
      await element.updateComplete;
      expect(element.hasAttribute('name')).to.be.false;
    });

    it('should reflect boolean property to attribute', async () => {
      element.disabled = true;
      await element.updateComplete;
      expect(element.hasAttribute('disabled')).to.be.true;

      element.disabled = false;
      await element.updateComplete;
      expect(element.hasAttribute('disabled')).to.be.false;
    });

    it('should transfrom camelCase properties as dash-case attributes', async () => {
      element.longName = true;
      await element.updateComplete;
      expect(element.hasAttribute('long-name')).to.be.true;
    });
  });

  describe('readOnly', () => {
    let element;

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            helper: {
              type: String,
            },

            value: {
              type: String,
              readOnly: true,
            },
          };
        }

        render() {
          return html`${this.value}${this.helper}`;
        }
      },
    );

    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await element.updateComplete;
    });

    it('should not set property marked as readOnly using setter', async () => {
      element.value = 'foo';
      await element.updateComplete;
      expect(element.value).to.not.equal('foo');
      expect(element.shadowRoot.textContent).to.not.equal('foo');
    });

    it('should set property marked as readOnly using private method', async () => {
      element._setValue('foo');
      await element.updateComplete;
      expect(element.value).to.equal('foo');
      expect(element.shadowRoot.textContent).to.equal('foo');
    });

    it('should set property not marked as readOnly using setter', async () => {
      element.helper = 'bar';
      await element.updateComplete;
      expect(element.helper).to.equal('bar');
      expect(element.shadowRoot.textContent).to.equal('bar');
    });
  });

  describe('observer', () => {
    let element;

    describe('default', () => {
      const tag = defineCE(
        class extends PolylitMixin(LitElement) {
          static get properties() {
            return {
              value: {
                type: String,
                observer: '_valueChanged',
              },

              label: {
                type: String,
                observer: '_labelChanged',
              },

              hasLabel: {
                type: Boolean,
              },

              text: {
                type: String,
                readOnly: true,
                observer: '_textChanged',
              },

              count: {
                type: Number,
              },

              calls: {
                type: Array,
              },
            };
          }

          constructor() {
            super();
            this.calls = [];
            this.updateCount = 0;
          }

          render() {
            return html`${this.value}`;
          }

          willUpdate(props) {
            super.willUpdate(props);

            this.updateCount += 1;
          }

          _valueChanged(value, oldValue) {
            this.calls.push([value, oldValue]);
          }

          _labelChanged(value) {
            this.hasLabel = !!value;
          }

          _textChanged(value) {
            if (value) {
              this.count = value.length;
            }
          }
        },
      );

      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await element.updateComplete;
      });

      it('should run single property observer on property change', async () => {
        element.value = 'foo';
        await element.updateComplete;
        expect(element.calls[0]).to.deep.equal(['foo', undefined]);
      });

      it('should pass old and new value to single property observer', async () => {
        element.value = 'foo';
        await element.updateComplete;
        expect(element.calls[0]).to.deep.equal(['foo', undefined]);

        element.value = 'bar';
        await element.updateComplete;
        expect(element.calls[1]).to.deep.equal(['bar', 'foo']);
      });

      it('should run single property observer for read-only property', async () => {
        element._setText('abcde');
        await element.updateComplete;
        expect(element.count).to.equal(5);
      });

      it('should include property set in observer to the same update', async () => {
        element.label = 'foo';
        await element.updateComplete;
        expect(element.hasLabel).to.be.true;
      });

      it('should not affect willUpdate method defined by the user', async () => {
        expect(element.updateCount).to.equal(1);
        element.value = 'foo';
        await element.updateComplete;
        expect(element.updateCount).to.equal(2);
      });
    });

    describe('superclass', () => {
      class SuperClass extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            value: {
              type: String,
              observer: '_valueChanged',
            },

            calls: {
              type: Array,
            },

            name: {
              type: String,
              value: 'superclass-name',
            },
          };
        }

        constructor() {
          super();
          this.calls = [];
        }

        _valueChanged(value, oldValue) {
          this.calls.push([value, oldValue]);
        }
      }

      const superClassTag = defineCE(SuperClass);

      const tag = defineCE(
        class extends SuperClass {
          static get properties() {
            return {
              text: {
                type: String,
                observer: '_textChanged',
              },

              count: {
                type: Number,
              },

              name: {
                value: 'subclass-name',
              },
            };
          }

          constructor() {
            super();
            this.count = 0;
          }

          render() {
            return html`${this.value}`;
          }

          _textChanged(value) {
            if (value) {
              this.count = value.length;
            }
          }
        },
      );

      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await element.updateComplete;
      });

      it('should run both own and inherited single property observers', async () => {
        element.value = 'foo';
        element.text = 'abc';
        await element.updateComplete;
        expect(element.calls[0]).to.deep.equal(['foo', undefined]);
        expect(element.count).to.equal(3);
      });

      it('should get a default value defined for the subclass', () => {
        expect(element.name).to.equal('subclass-name');
      });

      it('should not get a default value defined for the subclass', () => {
        const superClassInstance = fixtureSync(`<${superClassTag}></${superClassTag}>`);
        expect(superClassInstance.name).to.equal('superclass-name');
      });
    });

    describe('missing', () => {
      const tag = defineCE(
        class extends PolylitMixin(LitElement) {
          static get properties() {
            return {
              label: {
                type: String,
                observer: '_labelChanged',
              },

              value: {
                type: String,
                observer: '_valueChanged',
              },
            };
          }

          render() {
            return html`${this.value}`;
          }
        },
      );

      before(() => {
        sinon.stub(console, 'warn');
      });

      after(() => {
        console.warn.restore();
      });

      beforeEach(() => {
        element = fixtureSync(`<${tag}></${tag}>`);
      });

      it('should warn for each missing observer', async () => {
        await element.updateComplete;
        expect(console.warn.calledTwice).to.be.true;
        expect(console.warn.firstCall.args[0]).to.include('label');
        expect(console.warn.secondCall.args[0]).to.include('value');
      });
    });
  });

  describe('complex observer', () => {
    let element;
    let valueOrLoadingChangedSpy, countOrLoadingChangedSpy;

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            value: {
              type: String,
            },

            loading: {
              type: Boolean,
            },

            count: {
              type: Number,
              value: 0,
            },

            id: {
              type: Number,
            },
          };
        }

        static get observers() {
          return ['_valueOrLoadingChanged(value, loading)', '_countOrLoadingChanged(count, loading)', '_idChanged(id)'];
        }

        render() {
          return html`${this.value}`;
        }

        _valueOrLoadingChanged(_value, _loading) {}

        _countOrLoadingChanged(_count, _loading) {}
      },
    );

    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      valueOrLoadingChangedSpy = sinon.spy(element, '_valueOrLoadingChanged');
      countOrLoadingChangedSpy = sinon.spy(element, '_countOrLoadingChanged');
      await element.updateComplete;
    });

    it('should run complex observer once a property value changes', async () => {
      element.value = 'foo';
      await element.updateComplete;
      expect(valueOrLoadingChangedSpy.calledOnce).to.be.true;
    });

    it('should run complex observer only once on multiple property changes', async () => {
      element.value = 'foo';
      element.loading = true;
      await element.updateComplete;
      expect(valueOrLoadingChangedSpy.calledOnce).to.be.true;
    });

    it('should pass the dependencies as arguments to the complex observer function', async () => {
      element.value = 'foo';
      element.loading = true;
      await element.updateComplete;
      expect(valueOrLoadingChangedSpy.getCall(0).args).to.eql(['foo', true]);
    });

    it('should not run complex observer whose dependencies have not intialized', async () => {
      expect(valueOrLoadingChangedSpy.called).to.be.false;
    });

    it('should run a complex observer whose dependency has a default value', async () => {
      expect(countOrLoadingChangedSpy.calledOnce).to.be.true;
    });

    describe('missing', () => {
      before(() => {
        sinon.stub(console, 'warn');
      });

      after(() => {
        console.warn.restore();
      });

      it('should warn for each missing observer', async () => {
        element.id = 1;
        await element.updateComplete;
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.firstCall.args[0]).to.include('_idChanged');
      });
    });
  });

  describe('dynamic method observer', () => {
    let element;
    let valueOrLoadingChangedSpy;

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            value: {
              type: String,
            },

            loading: {
              type: Boolean,
            },
          };
        }

        render() {
          return html`${this.value}`;
        }

        _valueOrLoadingChanged(_value, _loading) {}
      },
    );

    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      valueOrLoadingChangedSpy = sinon.spy(element, '_valueOrLoadingChanged');
      await element.updateComplete;
    });

    it('should run dynamic method observer once a property value changes', async () => {
      element.value = 'foo';
      await element.updateComplete;
      expect(valueOrLoadingChangedSpy.calledOnce).to.be.false;

      element._createMethodObserver('_valueOrLoadingChanged(value, loading)');
      element.value = 'bar';
      await element.updateComplete;
      expect(valueOrLoadingChangedSpy.calledOnce).to.be.true;
    });

    it('should pass the dependencies as arguments to the dynamic observer function', async () => {
      element._createMethodObserver('_valueOrLoadingChanged(value, loading)');
      element.value = 'foo';
      element.loading = true;
      await element.updateComplete;
      expect(valueOrLoadingChangedSpy.getCall(0).args).to.eql(['foo', true]);
    });

    it('should not call dynamic method observers for another element instance', async () => {
      element._createMethodObserver('_valueOrLoadingChanged(value, loading)');

      const other = document.createElement(tag);
      element.parentNode.appendChild(other);
      await other.updateComplete;

      valueOrLoadingChangedSpy = sinon.spy(other, '_valueOrLoadingChanged');
      other.value = 'foo';
      other.loading = true;
      await other.updateComplete;

      expect(valueOrLoadingChangedSpy.called).to.be.false;
    });
  });

  describe('notify', () => {
    let element;

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            value: {
              type: String,
              observer: '_valueChanged',
              notify: true,
            },

            hasValue: {
              type: String,
              notify: true,
            },

            loading: {
              type: Boolean,
              readOnly: true,
              notify: true,
            },
          };
        }

        render() {
          return html`${this.value}`;
        }

        _valueChanged(value) {
          this.hasValue = !!value;
        }
      },
    );

    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await element.updateComplete;
    });

    it('should fire notification event on property change', async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);
      element.value = 'foo';
      await element.updateComplete;
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire notification event for property set in observer', async () => {
      const spy = sinon.spy();
      element.addEventListener('has-value-changed', spy);
      element.value = 'foo';
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire notification event for read-only property', async () => {
      const spy = sinon.spy();
      element.addEventListener('loading-changed', spy);
      element._setLoading(true);
      await element.updateComplete;
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('value', () => {
    let element;

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            value: {
              type: Number,
              value: 0,
            },

            count: {
              type: Number,
              value() {
                return this.value;
              },
            },
          };
        }
      },
    );

    it('should have a default value', async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await element.updateComplete;
      expect(element.value).to.equal(0);
    });

    it('should not override initial value', async () => {
      element = fixtureSync(`<${tag} value="1"></${tag}>`);
      await element.updateComplete;
      expect(element.value).to.equal(1);
    });

    it('should get the default value from a function', async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await element.updateComplete;
      expect(element.count).to.equal(0);
    });
  });

  describe('computed', () => {
    let element;

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            loading: {
              type: Boolean,
              value: true,
            },

            value: {
              type: Number,
              computed: '__computeValue(loading)',
            },
          };
        }

        __computeValue(loading) {
          return loading ? 1 : 0;
        }
      },
    );

    it('should compute value', async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await element.updateComplete;
      expect(element.value).to.equal(1);
    });

    it('should update computed value', async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await element.updateComplete;
      element.loading = false;
      await element.updateComplete;
      expect(element.value).to.equal(0);
    });
  });

  describe('type as property', () => {
    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            name: String,

            opened: Boolean,

            count: Number,

            items: Array,
          };
        }
      },
    );

    it('should support String as property type', async () => {
      const element = fixtureSync(`<${tag} name="foo"></${tag}>`);
      await element.updateComplete;
      expect(element.name).to.equal('foo');
    });

    it('should support Boolean as property type', async () => {
      const element = fixtureSync(`<${tag} opened></${tag}>`);
      await element.updateComplete;
      expect(element.opened).to.equal(true);
    });

    it('should support Number as property type', async () => {
      const element = fixtureSync(`<${tag} count="4"></${tag}>`);
      await element.updateComplete;
      expect(element.count).to.equal(4);
    });

    it('should support Array as property type', async () => {
      const element = fixtureSync(`<${tag} items="[1,2,3]"></${tag}>`);
      await element.updateComplete;
      expect(element.items).to.eql([1, 2, 3]);
    });
  });
});
