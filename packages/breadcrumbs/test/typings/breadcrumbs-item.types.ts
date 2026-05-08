import '../../vaadin-breadcrumbs-item.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const item = document.createElement('vaadin-breadcrumbs-item');

assertType<string | null | undefined>(item.path);
assertType<boolean>(item.current);
