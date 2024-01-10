import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DetailsElement } from '../../src/vaadin-details-element.js';
import { details } from './vaadin-details-styles.js';

class MaterialDetails extends DetailsElement {
  static registerStyles(is) {
    registerStyles(is, details, { moduleId: `material-${is}` });
  }
}

export default MaterialDetails;
