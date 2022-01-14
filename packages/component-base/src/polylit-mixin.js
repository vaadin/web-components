import { dedupeMixin } from '@open-wc/dedupe-mixin';

const caseMap = {};

const CAMEL_TO_DASH = /([A-Z])/g;

function camelToDash(camel) {
  return caseMap[camel] || (caseMap[camel] = camel.replace(CAMEL_TO_DASH, '-$1').toLowerCase());
}

function upper(name) {
  return name[0].toUpperCase() + name.substring(1);
}

const PolylitMixinImplementation = (superclass) => {
  class PolylitMixinClass extends superclass {
    static createProperty(name, options) {
      if (options.reflectToAttribute) {
        options.reflect = true;
      }

      super.createProperty(name, options);
    }

    /*
     * @protected
     * @override
     */
    static finalize() {
      super.finalize();

      if (Array.isArray(this.observers)) {
        if (!this.__complexObservers) {
          this.__complexObservers = [];

          this.observers.forEach((observer) => {
            const [method, rest] = observer.split('(');
            const observerProps = rest
              .replace(')', '')
              .split(',')
              .map((prop) => prop.trim());

            this.__complexObservers.push({
              method,
              observerProps
            });
          });
        }
      }
    }

    static getPropertyDescriptor(name, key, options) {
      const defaultDescriptor = super.getPropertyDescriptor(name, key, options);

      let result = defaultDescriptor;

      if ('value' in options) {
        // Set the default value
        this.addInitializer((instance) => (instance[name] = options.value));
      }

      if (options.readOnly) {
        const setter = defaultDescriptor.set;

        this.addInitializer((instance) => {
          // This is run during construction of the element
          instance['_set' + upper(name)] = function (value) {
            setter.call(instance, value);
          };
        });

        result = {
          get: defaultDescriptor.get,
          set() {
            // Do nothing, property is read-only.
          },
          configurable: true,
          enumerable: true
        };
      }

      if (options.observer) {
        const method = options.observer;

        if (!this.__observers) {
          this.__observers = new Map();
          // eslint-disable-next-line no-prototype-builtins
        } else if (!this.hasOwnProperty('__observers')) {
          // clone any existing observers (superclasses)
          const observers = this.__observers;
          this.__observers = new Map();
          observers.forEach((v, k) => this.__observers.set(k, v));
        }

        // set this method
        this.__observers.set(name, method);

        this.addInitializer((instance) => {
          if (!instance[method]) {
            console.warn(`observer method ${method} not defined`);
          }
        });
      }

      if (options.notify) {
        if (!this.__notifyProps) {
          this.__notifyProps = new Set();
          // eslint-disable-next-line no-prototype-builtins
        } else if (!this.hasOwnProperty('__notifyProps')) {
          // clone any existing observers (superclasses)
          const notifyProps = this.__notifyProps;
          this.__notifyProps = new Set(notifyProps);
        }

        // set this method
        this.__notifyProps.add(name);
      }

      return result;
    }

    /** @protected */
    ready() {
      if (super.ready) {
        super.ready();
      }
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.ready();
    }

    /** @protected */
    willUpdate(props) {
      if (this.constructor.__observers) {
        this.__runObservers(props, this.constructor.__observers);
      }

      if (this.constructor.__notifyProps) {
        this.__runNotifyProps(props, this.constructor.__notifyProps);
      }

      if (this.constructor.__complexObservers) {
        this.__runComplexObservers(props, this.constructor.__complexObservers);
      }
    }

    /** @private */
    __runComplexObservers(props, observers) {
      observers.forEach(({ method, observerProps }) => {
        if (observerProps.some((prop) => props.has(prop))) {
          if (!this[method]) {
            console.warn(`observer method ${method} not defined`);
          } else {
            this[method](...observerProps.map((prop) => this[prop]));
          }
        }
      });
    }

    /** @private */
    __runObservers(props, observers) {
      props.forEach((v, k) => {
        const observer = observers.get(k);
        if (observer !== undefined && this[observer]) {
          this[observer](this[k], v);
        }
      });
    }

    /** @private */
    __runNotifyProps(props, notifyProps) {
      props.forEach((_, k) => {
        if (notifyProps.has(k)) {
          this.dispatchEvent(
            new CustomEvent(`${camelToDash(k)}-changed`, {
              detail: {
                value: this[k]
              }
            })
          );
        }
      });
    }
  }

  return PolylitMixinClass;
};

export const PolylitMixin = dedupeMixin(PolylitMixinImplementation);
