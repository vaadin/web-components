/**
 * @license
 * Copyright (c) 2020 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

export interface AvatarGroupI18n extends AvatarI18n {
  activeUsers: {
    one: string;
    many: string;
  };
  joined: string;
  left: string;
}

export interface AvatarGroupItem {
  name?: string;
  abbr?: string;
  img?: string;
  colorIndex?: number;
}

export class AvatarGroupUpdater {
  items: AvatarGroupItem[];

  constructor(host: HTMLElement, renderBefore: HTMLElement, i18n: AvatarGroupI18n);
}
