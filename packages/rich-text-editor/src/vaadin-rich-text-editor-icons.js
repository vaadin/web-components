/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `
  <style>
    @font-face {
      font-family: 'vaadin-rte-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,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) format('woff');
      font-weight: normal;
      font-style: normal;
    }

    html {
      --vaadin-rte-icons-align-center: "\\ea01";
      --vaadin-rte-icons-align-left: "\\ea02";
      --vaadin-rte-icons-align-right: "\\ea03";
      --vaadin-rte-icons-clean: "\\ea04";
      --vaadin-rte-icons-image: "\\ea05";
      --vaadin-rte-icons-link: "\\ea06";
      --vaadin-rte-icons-list-bullet: "\\ea07";
      --vaadin-rte-icons-list-ordered: "\\ea08";
      --vaadin-rte-icons-redo: "\\ea09";
      --vaadin-rte-icons-undo: "\\ea0a";
    }
  </style>
`;

document.head.appendChild($_documentContainer.content);

export const iconsStyles = css`
  [part~='toolbar-button-align-center']::before {
    content: var(--vaadin-rte-icons-align-center);
  }

  [part~='toolbar-button-align-left']::before {
    content: var(--vaadin-rte-icons-align-left);
  }

  [part~='toolbar-button-align-right']::before {
    content: var(--vaadin-rte-icons-align-right);
  }

  [part~='toolbar-button-clean']::before {
    content: var(--vaadin-rte-icons-clean);
  }

  [part~='toolbar-button-image']::before {
    content: var(--vaadin-rte-icons-image);
  }

  [part~='toolbar-button-link']::before {
    content: var(--vaadin-rte-icons-link);
  }

  [part~='toolbar-button-list-bullet']::before {
    content: var(--vaadin-rte-icons-list-bullet);
  }

  [part~='toolbar-button-list-ordered']::before {
    content: var(--vaadin-rte-icons-list-ordered);
  }

  [part~='toolbar-button-redo']::before {
    content: var(--vaadin-rte-icons-redo);
  }

  [part~='toolbar-button-undo']::before {
    content: var(--vaadin-rte-icons-undo);
  }

  /* RTL specific styles */
  :host([dir='rtl']) [part~='toolbar-button-redo']::before {
    content: var(--vaadin-rte-icons-undo);
  }

  :host([dir='rtl']) [part~='toolbar-button-undo']::before {
    content: var(--vaadin-rte-icons-redo);
  }
`;

// Register a module with ID for backwards compatibility.
registerStyles('', iconsStyles, { moduleId: 'vaadin-rich-text-editor-icons' });
