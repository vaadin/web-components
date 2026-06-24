/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { createContext } from '@lit/context';

/**
 * The context used by the grid to provide its effective i18n object (the merged
 * `defaultI18n` and `i18n`) to descendant accessibility elements, such as the
 * sorter and the filter. The grid holds a `ContextProvider` and the descendants
 * subscribe via a `ContextConsumer`.
 */
export const gridI18nContext = createContext('vaadin-grid-i18n');
