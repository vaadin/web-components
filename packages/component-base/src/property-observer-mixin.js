import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

export const PropertyObserverMixin = dedupingMixin(
  (superclass) =>
    class PropertyObserverMixinClass extends superclass {
      /** @protected */
      _addObserver(props, functionName) {
        this.__observers = this.__observers || {};

        props.forEach((prop) => {
          if (!(prop in this.__observers)) {
            this.__observers[prop] = [];
          }

          this.__observers[prop].push({
            functionName,
            props
          });
        });
      }

      /** @protected */
      updated(props) {
        super.updated(props);

        props.forEach((_value, key) => {
          const observers = this.__observers[key];
          if (observers) {
            observers.forEach((observer) => {
              // TODO: Observer function should only get called once
              // if any number of its dependencies change.
              this[observer.functionName](...observer.props.map((prop) => this[prop]));
            });
          }
        });
      }
    }
);
