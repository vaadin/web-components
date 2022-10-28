/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export class MessageListUpdater {
  constructor(host, onFocusIn) {
    this.host = host;
    this.onFocusIn = onFocusIn;
    this._items = [];
  }

  get items() {
    return this._items;
  }

  set items(items) {
    this._items = items;
    this.render();
  }

  /** @protected */
  render() {
    const host = this.host;

    render(
      html`
        ${this.items.map(
          (item) =>
            html`
              <vaadin-message
                role="listitem"
                .time="${item.time}"
                .userAbbr="${item.userAbbr}"
                .userName="${item.userName}"
                .userImg="${item.userImg}"
                .userColorIndex="${item.userColorIndex}"
                theme="${ifDefined(item.theme)}"
                @focusin="${this.onFocusIn}"
                >${item.text}</vaadin-message
              >
            `,
        )}
      `,
      host,
      { host },
    );
  }
}
