import '../../vaadin-app-layout';
import {
  AppLayoutDrawerOpenedChanged,
  AppLayoutOverlayChanged,
  AppLayoutPrimarySectionChanged
} from '../../vaadin-app-layout';

const assertType = <TExpected>(actual: TExpected) => actual;

const layout = document.createElement('vaadin-app-layout');

layout.addEventListener('drawer-opened-changed', (event) => {
  assertType<AppLayoutDrawerOpenedChanged>(event);
});

layout.addEventListener('overlay-changed', (event) => {
  assertType<AppLayoutOverlayChanged>(event);
});

layout.addEventListener('primary-section-changed', (event) => {
  assertType<AppLayoutPrimarySectionChanged>(event);
});
