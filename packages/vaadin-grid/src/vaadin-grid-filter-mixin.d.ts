import { GridFilter } from './interfaces';

declare function FilterMixin<T extends new (...args: any[]) => {}>(base: T): T & FilterMixinConstructor;

interface FilterMixinConstructor {
  new (...args: any[]): FilterMixin;
}

interface FilterMixin {
  _mapFilters(): GridFilter[];
}

export { FilterMixin, FilterMixinConstructor };
