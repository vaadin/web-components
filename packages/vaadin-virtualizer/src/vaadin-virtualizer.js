import { IronListAdapter } from './vaadin-virtualizer-iron-list-adapter';

export class Virtualizer {
  constructor(config) {
    this.__adapter = new IronListAdapter(config);
  }

  set size(size) {
    this.__adapter.size = size;
  }

  get size() {
    return this.__adapter.size;
  }

  scrollToIndex(index) {
    this.__adapter.scrollToIndex(index);
  }

  flush() {
    this.__adapter.flush();
  }
}
