// eslint-disable-next-line no-unused-vars
class ChartLabelsMapper {

  constructor(mapper) {
    const value = mapper || [];
    if (typeof value === 'string') {
      try {
        this.__tryPassFunction(value);
      } catch (ex) {
        try {
          this.__tryPassArrayOrObject(JSON.parse(value));
        } catch (parseEx) {
          console.warn(`VaadinChartSeries::ChartLabelsMapper: couldn't decode JSON attribute: ${value}`);
          this.__assignMapper([], 'array'); // Pass-through.
        }
      }
    } else if (this.__isFunction(value)) {
      this.__assignMapper(value, 'function');
    } else {
      this.__tryPassArrayOrObject(value);
    }
  }

  __isFunction(value) {
    return value && {}.toString.call(value) === '[object Function]';
  }

  __isObject(item) {
    return !Array.isArray(item) && typeof item === 'object';
  }

  __tryPassFunction(value) {
    const result = eval('(' + value + ')');
    if (!this.__isFunction(result)) {
      throw new SyntaxError(`Invalid function "${result}"`);
    }
    this.mapper = result;
    this.type = 'function';
  }

  __tryPassArrayOrObject(value) {
    if (Array.isArray(value)) {
      this.__assignMapper(value, 'array');
    } else if (typeof value === 'object') {
      this.__assignMapper(value, 'object');
    } else {
      console.warn(`VaadinChartSeries::ChartLabelsMapper: unsupported type for mapping property: 
      ${typeof value} - ${value}. Will use the pass-through mapper instead`);
      this.__assignMapper([], 'array'); // Pass-through.
    }
  }

  __assignMapper(value, type) {
    this.mapper = value;
    this.type = type;
  }

  map(values) {
    if (values) {
      return values.map((item, index) => {
        const result = this.__isObject(item) ? Object.assign({}, item) : {};

        if (Array.isArray(item)) {
          [result.x, result.y] = item;
        } else if (!this.__isObject(item)) {
          result.y = item;
        }

        if (this.type === 'function') {
          result.name = this.mapper(result.y);
        } else if (this.type === 'object' && !!this.mapper[result.y]) {
          result.name = this.mapper[result.y];
        } else if (this.type === 'array' && this.mapper.length > index) {
          result.name = this.mapper[index];
        }

        if (!result.name) {
          result.name = result.y;
        }

        return result;
      });
    }
  }
}
