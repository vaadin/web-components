/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Upload } from '@vaadin/upload/src/vaadin-upload.js';

/**
 * @deprecated Import `Upload` from `@vaadin/upload` instead.
 */
export const UploadElement = Upload;

export * from '@vaadin/upload/src/vaadin-upload.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-upload" is deprecated. Use "@vaadin/upload" instead.');
