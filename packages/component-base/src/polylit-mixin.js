/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupeMixin } from '@open-wc/dedupe-mixin';

const caseMap = {};

const CAMEL_TO_DASH = /([A-Z])/g;

function camelToDash(camel) {
  return caseMap[camel] || (caseMap[camel] = camel.replace(CAMEL_TO_DASH, '-$1').toLowerCase());
}

function upper(name) {
  return name[0].toUpperCase() + name.substring(1);
}

function parseObserver(observerString) {
  const [method, rest] = observerString.split('(');
  const observerProps = rest
    .replace(')', '')
    .split(',')
    .map((prop) => prop.trim());

  return {
    method,
    observerProps
  };
}

function getOrCreateMap(obj, name) {
  if (!obj[name]) {
    obj[name] = new Map();
    // eslint-disable-next-line no-prototype-builtins
  } else if (!obj.hasOwnProperty(name)) {
    // clone any existing entries (superclasses)
    const map = obj[name];
    obj[name] = new Map();
    map.forEach((v, k) => obj[name].set(k, v));
  }
  return obj[name];
}

const PolylitMixinImplementation = (superclass) => {
  class PolylitMixinClass extends superclass {
    static createProperty(name, options) {
      if (options.reflectToAttribute) {
        options.reflect = true;
      }

      super.createProperty(name, options);
    }

    static getOrCreateMap(name) {
      return getOrCreateMap(this, name);
    }

    /*
     * @protected
     * @override
     */
    static finalize() {
      super.finalize();

      if (Array.isArray(this.observers)) {
        const complexObservers = this.getOrCreateMap('__complexObservers');

        this.observers.forEach((observer) => {
          const { method, observerProps } = parseObserver(observer);
          complexObservers.set(method, observerProps);
        });
      }
    }

    static addInitializer(initializer) {
      super.addInitializer((instance) => {
        // TODO: Why is this check needed?
        if (instance instanceof this) {
          initializer(instance);
        }
      });
    }

    static getPropertyDescriptor(name, key, options) {
      if ([String, Boolean, Number, Array].includes(options)) {
        options = {
          type: options
        };
      }

      const defaultDescriptor = super.getPropertyDescriptor(name, key, options);

      let result = defaultDescriptor;

      if ('value' in options) {
        // Set the default value
        this.addInitializer((instance) => {
          if (typeof options.value === 'function') {
            instance[name] = options.value.call(instance);
          } else {
            instance[name] = options.value;
          }
        });
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

        // set this method
        this.getOrCreateMap('__observers').set(name, method);

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

      if (options.computed) {
        const assignComputedMethod = `__assignComputed${name}`;
        const observer = parseObserver(options.computed);
        this.prototype[assignComputedMethod] = function (...props) {
          this[name] = this[observer.method](...props);
        };

        this.getOrCreateMap('__complexObservers').set(assignComputedMethod, observer.observerProps);
      }

      if (!options.attribute) {
        options.attribute = name.replace(/([A-Z])/g, '-$1').toLowerCase();
      }

      return result;
    }

    /** @protected */
    ready() {
      if (super.ready) {
        super.ready();
      }
      this.$ = this.$ || {};
      this.shadowRoot.querySelectorAll('[id]').forEach((node) => {
        this.$[node.id] = node;
      });
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.ready();
    }

    /** @protected */
    // willUpdate(props) {
    updated(props) {
      if (this.constructor.__observers) {
        this.__runObservers(props, this.constructor.__observers);
      }

      if (this.constructor.__notifyProps) {
        this.__runNotifyProps(props, this.constructor.__notifyProps);
      }

      if (this.constructor.__complexObservers) {
        this.__runComplexObservers(props, this.constructor.__complexObservers);
      }

      if (this.__dynamicObservers) {
        this.__runComplexObservers(props, this.__dynamicObservers);
      }
    }

    /** @protected */
    _createMethodObserver(observer) {
      const dynamicObservers = getOrCreateMap(this, '__dynamicObservers');
      const { method, observerProps } = parseObserver(observer);
      dynamicObservers.set(method, observerProps);
    }

    /** @private */
    __runComplexObservers(props, observers) {
      observers.forEach((observerProps, method) => {
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

    /** @protected */
    _get(path, object) {
      return path.split('.').reduce((obj, property) => (obj ? obj[property] : undefined), object);
    }

    /** @protected */
    _set(path, value, object) {
      const pathParts = path.split('.');
      const lastPart = pathParts.pop();
      const target = pathParts.reduce((target, part) => target[part], object);
      target[lastPart] = value;
    }
  }

  return PolylitMixinClass;
};

export const PolylitMixin = dedupeMixin(PolylitMixinImplementation);
