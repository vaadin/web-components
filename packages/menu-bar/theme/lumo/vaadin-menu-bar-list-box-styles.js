import { contextMenuListBox } from '@vaadin/context-menu/theme/lumo/vaadin-context-menu-list-box-styles.js';
import { listBox } from '@vaadin/list-box/theme/lumo/vaadin-list-box-styles.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-menu-bar-list-box', [listBox, contextMenuListBox], { moduleId: 'lumo-menu-bar-list-box' });
