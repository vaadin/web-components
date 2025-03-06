export class AbstractLayoutController {
  constructor(host) {
    this.host = host;
    this.props = {};
    this.isConnected = false;

    /** @protected */
    this._resizeObserver = new ResizeObserver((entries) => setTimeout(() => this._onResize(entries)));

    /** @protected */
    this._mutationObserver = new MutationObserver((entries) => this._onMutation(entries));
  }

  connect() {
    this.isConnected = true;
  }

  disconnect() {
    this.isConnected = false;
  }

  updateLayout() {
    throw new Error('To be implemented');
  }

  setProps(props) {
    this.props = props;
  }

  /** @protected */
  _onResize(_entries) {}

  /** @protected */
  _onMutation(_entries) {}
}
