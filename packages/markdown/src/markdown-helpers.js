/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import DOMPurify from 'dompurify';
import { marked } from 'marked';

/**
 * Synchronizes the attributes of a target element with those of a source element.
 */
function synchronizeAttributes(targetElement, sourceElement) {
  // Remove attributes from target that are not in source
  for (const { name } of targetElement.attributes) {
    if (!sourceElement.hasAttribute(name)) {
      targetElement.removeAttribute(name);
    }
  }

  // Add/update attributes from source to target
  for (const { name, value } of sourceElement.attributes) {
    targetElement.setAttribute(name, value);
  }
}

/**
 * Synchronizes the child nodes of a target node with those of a source node.
 * It handles the addition, removal, and updating of child nodes.
 */
function synchronizeNodes(targetNode, sourceNode) {
  const sourceChildren = Array.from(sourceNode.childNodes);
  const targetChildren = Array.from(targetNode.childNodes);
  const maxChildren = Math.max(sourceChildren.length, targetChildren.length);

  for (let i = 0; i < maxChildren; i++) {
    const sourceChild = sourceChildren[i];
    const targetChild = targetChildren[i];

    // 1. If source child exists but target child doesn't, append source child clone
    if (sourceChild && !targetChild) {
      targetNode.appendChild(sourceChild.cloneNode(true));
      continue;
    }

    // 2. If target child exists but source child doesn't, remove target child
    if (!sourceChild && targetChild) {
      targetNode.removeChild(targetChild);
      continue;
    }

    // 3. If both exist, compare them
    if (sourceChild && targetChild) {
      // 3a. Different node types or tag names: replace target with source clone
      if (sourceChild.nodeType !== targetChild.nodeType || sourceChild.nodeName !== targetChild.nodeName) {
        targetNode.replaceChild(sourceChild.cloneNode(true), targetChild);
        continue;
      }

      // 3b. Same node type
      if (sourceChild.nodeType === Node.ELEMENT_NODE) {
        // Synchronize attributes
        synchronizeAttributes(targetChild, sourceChild);

        // Recursively synchronize children
        synchronizeNodes(targetChild, sourceChild);
      } else if (sourceChild.nodeType === Node.TEXT_NODE) {
        // Update text content if different
        if (targetChild.nodeValue !== sourceChild.nodeValue) {
          targetChild.nodeValue = sourceChild.nodeValue;
        }
      }
      // Other node types (like comments) are ignored for synchronization
    }
  }
}

/**
 * Updates the content of a target element with the given Markdown parsed as HTML.
 */
export function renderMarkdownToElement(element, markdown) {
  const template = document.createElement('template');
  template.innerHTML = DOMPurify.sanitize(marked.parse(markdown || ''), {
    CUSTOM_ELEMENT_HANDLING: {
      tagNameCheck: (_tagName) => true,
    },
  });
  synchronizeNodes(element, template.content);
}
