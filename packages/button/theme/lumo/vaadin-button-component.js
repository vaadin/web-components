import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { Button as _Button } from '../../src/vaadin-button-component.js';
import { button } from './vaadin-button-styles.js';

export class Button extends _Button {
  /**
   * @protected
   * @override
   */
  static registerStyles() {
    registerStyles('vaadin-button', button, { moduleId: 'lumo-button' });
  }
}
