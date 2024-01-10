import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DetailsSummaryElement } from '../../src/vaadin-details-summary-element.js';
import { detailsSummary } from './vaadin-details-summary-styles.js';

class MaterialDetailsSummary extends DetailsSummaryElement {
  static registerStyles(is) {
    registerStyles(is, detailsSummary, { moduleId: `material-${is}` });
  }
}

export default MaterialDetailsSummary;
