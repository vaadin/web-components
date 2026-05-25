import '../../vaadin-breadcrumbs.js';
import type { KeyboardDirectionMixinClass } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { Breadcrumbs, BreadcrumbsI18n } from '../../src/vaadin-breadcrumbs.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const breadcrumbs = document.createElement('vaadin-breadcrumbs');

assertType<Breadcrumbs>(breadcrumbs);

// Properties
assertType<BreadcrumbsI18n>(breadcrumbs.i18n);

// I18n
assertType<BreadcrumbsI18n>({});
assertType<BreadcrumbsI18n>({ moreItems: 'Show hidden items' });

// Mixins
assertType<ElementMixinClass>(breadcrumbs);
assertType<I18nMixinClass<BreadcrumbsI18n>>(breadcrumbs);
assertType<KeyboardDirectionMixinClass>(breadcrumbs);
assertType<ResizeMixinClass>(breadcrumbs);
