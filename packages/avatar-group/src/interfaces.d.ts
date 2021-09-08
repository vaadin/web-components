import { AvatarI18n } from '@vaadin/avatar/src/interfaces';

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
