import { contextMenuListBox } from '@vaadin/context-menu/theme/material/vaadin-context-menu-list-box-styles.js';
import { listBox } from '@vaadin/list-box/theme/material/vaadin-list-box-styles.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-menu-bar-list-box', [listBox, contextMenuListBox], { moduleId: 'material-menu-bar-list-box' });
