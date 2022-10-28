/**
 * @license
 * Copyright (c) 2020 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';

export class AvatarGroupUpdater {
  constructor(host, renderBefore, i18n) {
    this.host = host;
    this.renderBefore = renderBefore;
    this._items = [];
    this._i18n = i18n;
  }

  get i18n() {
    return this._i18n;
  }

  set i18n(i18n) {
    this._i18n = i18n;
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
    const { host, renderBefore } = this;

    render(
      html`
        ${this.items.map(
          (item) =>
            html`
              <vaadin-avatar
                .name="${item.name}"
                .abbr="${item.abbr}"
                .img="${item.img}"
                .colorIndex="${item.colorIndex}"
                .i18n="${this.i18n}"
                with-tooltip
              ></vaadin-avatar>
            `,
        )}
      `,
      host,
      { renderBefore },
    );
  }
}
