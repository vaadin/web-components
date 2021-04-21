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

  update(startIndex = 0, endIndex = this.size - 1) {
    this.__adapter.update(startIndex, endIndex);
  }

  flush() {
    this.__adapter.flush();
  }
}
