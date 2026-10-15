import { expect } from '@vaadin/chai-plugins';
import { defineCE, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, LitElement } from 'lit';
import { PolylitMixin } from '../src/polylit-mixin.js';

describe('PolylitMixin', () => {
  describe('first render', () => {
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

    afterEach(() => {
      readySpy.resetHistory();
    });

    it('should call ready once element is connected to the DOM', () => {
      expect(readySpy.calledOnce).to.be.true;
    });

    it('should not flush updates synchronously when element is reconnected to the DOM', () => {
      const spy = sinon.spy(element, 'performUpdate');
      const { parentElement } = element;
      parentElement.removeChild(element);
      parentElement.appendChild(element);
      expect(spy).to.be.not.called;
    });
  });

  describe('convenience', () => {
    let element;
    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        render() {
          return html`<div>Component</div>`;
        }

        get(path, object) {
          return this._get(path, object);
        }

        set(path, value, object) {
          this._set(path, value, object);
        }
      },
    );

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
    });

    it('should get the nested value', () => {
      expect(element.get('foo.bar', { foo: { bar: 'baz' } })).to.equal('baz');
    });

    it('should return undefined for a non-existent value', () => {
      expect(element.get('foo.bar', {})).to.be.undefined;
    });

    it('should set the nested value', () => {
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

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
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

            opened: {
              type: Boolean,
              value: false,
              readOnly: true,
            },
          };
        }

        render() {
          return html`${this.value}${this.helper}`;
        }
      },
    );

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
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

    it('should set initial value for the property marked as readOnly', () => {
      expect(element.opened).to.equal(false);
    });
  });

  describe('observer', () => {
    let element;

    describe('default', () => {
      const readySpy = sinon.spy();
      const helperChangedSpy = sinon.spy();

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

              helper: {
                type: String,
                value: 'Default Helper',
                observer: '_helperChanged',
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
            return html`
              <div>
                ${this.value}
                <div id="helper"></div>
              </div>
            `;
          }

          ready() {
            readySpy();
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

          _helperChanged(value) {
            helperChangedSpy(value);

            this.$.helper.textContent = value;
          }
        },
      );

      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await element.updateComplete;
      });

      it('should call ready after observers during initialization', () => {
        expect(helperChangedSpy.calledOnce).to.be.true;
        expect(readySpy.calledOnce).to.be.true;
        expect(readySpy.calledAfter(helperChangedSpy)).to.be.true;
      });

      it('should be possible to access the elements id map from observers during initialization', () => {
        expect(element.$.helper.textContent).to.equal('Default Helper');
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

    const readySpy = sinon.spy();
    const helperChangedSpy = sinon.spy();
    const valueOrLoadingChangedSpy = sinon.spy();
    const countOrLoadingChangedSpy = sinon.spy();

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

            helper: {
              type: String,
              value: 'Default Helper',
            },
          };
        }

        static get observers() {
          return [
            '_valueOrLoadingChanged(value, loading)',
            '_countOrLoadingChanged(count, loading)',
            '_idChanged(id)',
            '_helperChanged(helper)',
          ];
        }

        ready() {
          readySpy();
        }

        render() {
          return html`
            <div>
              ${this.value}
              <div id="helper"></div>
            </div>
          `;
        }

        _valueOrLoadingChanged(value, loading) {
          valueOrLoadingChangedSpy(value, loading);
        }

        _countOrLoadingChanged(count, loading) {
          countOrLoadingChangedSpy(count, loading);
        }

        _helperChanged(value) {
          helperChangedSpy(value);

          this.$.helper.textContent = value;
        }
      },
    );

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
    });

    afterEach(() => {
      valueOrLoadingChangedSpy.resetHistory();
      countOrLoadingChangedSpy.resetHistory();
    });

    it('should call ready after observers during initialization', () => {
      expect(helperChangedSpy.calledOnce).to.be.true;
      expect(readySpy.calledOnce).to.be.true;
      expect(readySpy.calledAfter(helperChangedSpy)).to.be.true;
    });

    it('should be possible to access the elements id map from observers during initialization', () => {
      expect(element.$.helper.textContent).to.equal('Default Helper');
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

    it('should not run complex observer whose dependencies have not intialized', () => {
      expect(valueOrLoadingChangedSpy.called).to.be.false;
    });

    it('should run a complex observer whose dependency has a default value', () => {
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

  describe('dynamic property observer', () => {
    let element;
    let valueChangedSpy;
    let complexSpy;

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            value: {
              type: String,
            },
          };
        }

        static get observers() {
          return ['_valueChangedComplex(value)'];
        }

        render() {
          return html`${this.value}`;
        }

        _valueChanged(_value, _oldValue) {}

        _valueChangedOther(_value, _oldValue) {}

        _valueChangedComplex(_value) {}
      },
    );

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
      valueChangedSpy = sinon.spy(element, '_valueChanged');
      complexSpy = sinon.spy(element, '_valueChangedComplex');
    });

    it('should run dynamic property observer once a property value changes', async () => {
      element.value = 'foo';
      await element.updateComplete;
      expect(valueChangedSpy.calledOnce).to.be.false;

      element._createPropertyObserver('value', '_valueChanged');
      element.value = 'bar';
      await element.updateComplete;
      expect(valueChangedSpy.calledOnce).to.be.true;
    });

    it('should pass old and new value to dynamic property observer', async () => {
      element.value = 'foo';
      await element.updateComplete;

      element._createPropertyObserver('value', '_valueChanged');

      element.value = 'bar';
      await element.updateComplete;
      expect(valueChangedSpy.getCall(0).args).to.deep.equal(['bar', 'foo']);
    });

    it('should support creating multiple dynamic property observers', async () => {
      element._createPropertyObserver('value', '_valueChanged');

      const otherObserverSpy = sinon.spy(element, '_valueChangedOther');
      element._createPropertyObserver('value', '_valueChangedOther');

      element.value = 'bar';
      await element.updateComplete;
      expect(valueChangedSpy.calledOnce).to.be.true;
      expect(otherObserverSpy.calledOnce).to.be.true;
    });

    it('should run dynamic property observer after complex observer', async () => {
      element._createPropertyObserver('value', '_valueChanged');
      element.value = 'bar';
      await element.updateComplete;
      expect(complexSpy.calledBefore(valueChangedSpy)).to.be.true;
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

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
      valueOrLoadingChangedSpy = sinon.spy(element, '_valueOrLoadingChanged');
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

    const readySpy = sinon.spy();
    const helperChangedSpy = sinon.spy();

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

            helper: {
              type: String,
              value: 'Default Helper',
              notify: true,
            },
          };
        }

        ready() {
          readySpy();
        }

        render() {
          return html`${this.value}`;
        }

        _valueChanged(value) {
          this.hasValue = !!value;
        }
      },
    );

    describe('during initialization', () => {
      beforeEach(() => {
        element = document.createElement(tag);
        element.addEventListener('helper-changed', helperChangedSpy);
        document.body.appendChild(element);
      });

      afterEach(() => {
        document.body.removeChild(element);
      });

      it('should call ready after notification event', () => {
        expect(helperChangedSpy.calledOnce).to.be.true;
        expect(readySpy.calledOnce).to.be.true;
        expect(readySpy.calledAfter(helperChangedSpy)).to.be.true;
      });
    });

    describe('after initialization', () => {
      beforeEach(() => {
        element = fixtureSync(`<${tag}></${tag}>`);
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

    it('should have a default value', () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      expect(element.value).to.equal(0);
    });

    it('should not override initial value', () => {
      element = fixtureSync(`<${tag} value="1"></${tag}>`);
      expect(element.value).to.equal(1);
    });

    it('should get the default value from a function', () => {
      element = fixtureSync(`<${tag}></${tag}>`);
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

        render() {
          return html`${this.value}`;
        }
      },
    );

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
    });

    it('should compute value', () => {
      expect(element.value).to.equal(1);
    });

    it('should render computed value', () => {
      expect(element.shadowRoot.textContent).to.equal('1');
    });

    it('should update computed value', async () => {
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

    it('should support String as property type', () => {
      const element = fixtureSync(`<${tag} name="foo"></${tag}>`);
      expect(element.name).to.equal('foo');
    });

    it('should support Boolean as property type', () => {
      const element = fixtureSync(`<${tag} opened></${tag}>`);
      expect(element.opened).to.equal(true);
    });

    it('should support Number as property type', () => {
      const element = fixtureSync(`<${tag} count="4"></${tag}>`);
      expect(element.count).to.equal(4);
    });

    it('should support Array as property type', () => {
      const element = fixtureSync(`<${tag} items="[1,2,3]"></${tag}>`);
      expect(element.items).to.eql([1, 2, 3]);
    });
  });

  describe('sync', () => {
    let element;

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            disabled: {
              type: Boolean,
              sync: true,
              reflect: true,
            },

            value: {
              type: String,
              value: 'foo',
              sync: true,
            },

            count: {
              type: Number,
              value: 0,
              sync: true,
            },

            opened: {
              type: Boolean,
              readOnly: true,
              sync: true,
              reflect: true,
            },

            helper: {
              type: String,
              readOnly: true,
              reflect: true,
            },
          };
        }

        ready() {
          super.ready();

          this.count += 1;
        }

        render() {
          return html`${this.value}`;
        }
      },
    );

    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await element.updateComplete;
    });

    it('should re-render immediately when setting sync property', () => {
      expect(element.shadowRoot.textContent).to.equal('foo');

      element.value = 'bar';
      expect(element.shadowRoot.textContent).to.equal('bar');
    });

    it('should reflect immediately when setting sync property', () => {
      element.disabled = true;
      expect(element.hasAttribute('disabled')).to.be.true;

      element.disabled = false;
      expect(element.hasAttribute('disabled')).to.be.false;
    });

    it('should reflect immediately when setting a read-only sync property', () => {
      element._setOpened(true);
      expect(element.hasAttribute('opened')).to.be.true;

      element._setOpened(false);
      expect(element.hasAttribute('opened')).to.be.false;
    });

    it('should not reflect immediately when setting a read-only non-sync property', () => {
      element._setHelper('foo');
      expect(element.hasAttribute('helper')).to.be.false;

      element.performUpdate();
      expect(element.hasAttribute('helper')).to.be.true;
    });

    it('should not reflect immediately when setting a read-only sync property to the same value', () => {
      element._setOpened(true);
      element._setHelper('foo'); // async property
      element._setOpened(true); // sync property
      expect(element.hasAttribute('helper')).to.be.false;
    });

    it('should not reflect immediately when setting sync property to the same value', () => {
      element.disabled = true;
      element._setHelper('foo'); // async property
      element.disabled = true; // sync property
      expect(element.hasAttribute('helper')).to.be.false;
    });

    it('should only call ready callback once during initialization', () => {
      expect(element.count).to.equal(1);
    });
  });

  describe('sync observers', () => {
    let element;
    const readySpy = sinon.spy();
    const openedChangedSpy = sinon.spy();
    const headerChangedSpy = sinon.spy();
    const contentChangedSpy = sinon.spy();

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            opened: {
              type: Boolean,
              sync: true,
            },

            header: {
              type: String,
              sync: true,
            },

            content: {
              type: String,
              sync: true,
            },
          };
        }

        static get observers() {
          return ['openedChanged(opened)', 'headerChanged(opened, header)', 'contentChanged(opened, content)'];
        }

        ready() {
          super.ready();
          readySpy();
        }

        openedChanged(opened) {
          openedChangedSpy();

          if (opened) {
            this.header = 'Header';
            this.content = 'Content';
          }
        }

        headerChanged(_opened, _header) {
          headerChangedSpy();
        }

        contentChanged(_opened, _content) {
          contentChangedSpy();
        }
      },
    );

    beforeEach(async () => {
      element = fixtureSync(`<${tag} opened></${tag}>`);
      await element.updateComplete;
    });

    it('should call ready after observers during initialization', () => {
      expect(openedChangedSpy).to.be.calledOnce;
      expect(headerChangedSpy).to.be.calledTwice;
      expect(contentChangedSpy).to.be.calledTwice;

      expect(readySpy).to.be.calledOnce;
      expect(readySpy).to.be.calledAfter(openedChangedSpy);
      expect(readySpy).to.be.calledAfter(headerChangedSpy);
      expect(readySpy).to.be.calledAfter(contentChangedSpy);
    });
  });

  describe('setProperties()', () => {
    let element;

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get properties() {
          return {
            disabled: {
              type: Boolean,
              sync: true,
            },

            value: {
              type: String,
            },
          };
        }
      },
    );

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
    });

    it('should set property values on the element', () => {
      element.setProperties({ value: 'foo', disabled: true });
      expect(element.value).to.equal('foo');
      expect(element.disabled).to.be.true;
    });

    it('should request update for each passed property', () => {
      const spy = sinon.spy(element, 'requestUpdate');
      element.setProperties({ value: 'foo', disabled: true });
      expect(spy).to.be.calledTwice;
      expect(spy.firstCall.args[0]).to.equal('value');
      expect(spy.secondCall.args[0]).to.equal('disabled');
    });

    it('should only call performUpdate() method once', () => {
      const spy = sinon.spy(element, 'performUpdate');
      element.setProperties({ value: 'foo', disabled: true });
      expect(spy).to.be.calledOnce;
    });

    it('should not throw when calling before first render', () => {
      expect(() => {
        document.createElement(tag).setProperties({ disabled: true });
      }).to.not.throw(Error);
    });
  });

  describe('element id map', () => {
    let element;

    describe('basic', () => {
      const tag = defineCE(
        class extends PolylitMixin(LitElement) {
          render() {
            return html`<div id="title">Title</div>`;
          }
        },
      );

      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await element.updateComplete;
      });

      it('should register elements with id', () => {
        expect(element.$.title).to.be.instanceOf(HTMLDivElement);
        expect(element.$.title.textContent.trim()).to.equal('Title');
      });
    });

    describe('createRenderRoot', () => {
      const tag = defineCE(
        class extends PolylitMixin(LitElement) {
          render() {
            return html`<div id="foo">Component</div>`;
          }

          createRenderRoot() {
            return this;
          }
        },
      );

      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await element.updateComplete;
      });

      it('should register elements with id when rendering to light DOM', () => {
        expect(element.$.foo).to.be.instanceOf(HTMLDivElement);
      });
    });
  });

  describe('async first render', () => {
    let element;

    const readySpy = sinon.spy();
    const valueChangedSpy = sinon.spy();

    const tag = defineCE(
      class extends PolylitMixin(LitElement) {
        static get polylitConfig() {
          return {
            asyncFirstRender: true,
          };
        }

        static get properties() {
          return {
            value: {
              type: String,
              value: 'foo',
              observer: 'valueChanged',
            },
          };
        }

        ready() {
          super.ready();
          readySpy();
        }

        valueChanged() {
          valueChangedSpy();
        }
      },
    );

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
    });

    afterEach(() => {
      readySpy.resetHistory();
      valueChangedSpy.resetHistory();
    });

    it('should call ready after first render', async () => {
      expect(readySpy).to.be.not.called;
      await element.updateComplete;
      expect(readySpy).to.be.calledOnce;
    });

    it('should run observers after first render', async () => {
      expect(valueChangedSpy).to.be.not.called;
      await element.updateComplete;
      expect(valueChangedSpy).to.be.calledOnce;
    });
  });

  describe('createProperty', () => {
    it('should not throw when calling createProperty() without options', () => {
      expect(() => {
        const PolyLitClass = class extends PolylitMixin(LitElement) {};
        PolyLitClass.createProperty('prop');
      }).to.not.throw(Error);
    });
  });
});
