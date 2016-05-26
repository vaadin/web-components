// This file is based on DOMLazyTree from React.
// It is modified to use the Polymer.dom API.
// This is necessary if Polymers shady DOM is used.

'use strict';

var createMicrosoftUnsafeLocalFunction = require('react/lib/createMicrosoftUnsafeLocalFunction');
var setTextContent = require('react/lib/setTextContent');

/* global Polymer */
function lightDOMElement (element) {
  if (element.__isPolymerInstance__) {
    return Polymer.dom(element);
  }
  return element;
}

/**
 * In IE (8-11) and Edge, appending nodes with no children is dramatically
 * faster than appending a full subtree, so we essentially queue up the
 * .appendChild calls here and apply them so each node is added to its parent
 * before any children are added.
 *
 * In other browsers, doing so is slower or neutral compared to the other order
 * (in Firefox, twice as slow) so we only do this inversion in IE.
 *
 * See https://github.com/spicyj/innerhtml-vs-createelement-vs-clonenode.
 */
// identical to React
var enableLazy = typeof document !== 'undefined' && typeof document.documentMode === 'number' || typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string' && /\bEdge\/\d/.test(navigator.userAgent);

// Changed from React
function insertTreeChildren (tree) {
  if (!enableLazy) {
    return;
  }
  var node = tree.node;
  var children = tree.children;
  if (children.length) {
    for (var i = 0; i < children.length; i++) {
      insertTreeBefore(node, children[i], null);
    }
  } else if (tree.html != null) {
    lightDOMElement(node).innerHTML = tree.html;
  } else if (tree.text != null) {
    setTextContent(lightDOMElement(node), tree.text);
  }
}

// Changed from React
var insertTreeBefore = createMicrosoftUnsafeLocalFunction(function (parentNode, tree, referenceNode) {
  parentNode = lightDOMElement(parentNode);
  // DocumentFragments aren't actually part of the DOM after insertion so
  // appending children won't update the DOM. We need to ensure the fragment
  // is properly populated first, breaking out of our lazy approach for just
  // this level.
  if (tree.node.nodeType === 11) {
    insertTreeChildren(tree);
    parentNode.insertBefore(tree.node, referenceNode);
  } else {
    parentNode.insertBefore(tree.node, referenceNode);
    insertTreeChildren(tree);
  }
});

// Changed from React
function replaceChildWithTree (oldNode, newTree) {
  lightDOMElement(Polymer.dom(oldNode).parentNode).replaceChild(newTree.node, oldNode);
  insertTreeChildren(newTree);
}

// Changed from React
function queueChild (parentTree, childTree) {
  if (enableLazy) {
    parentTree.children.push(childTree);
  } else {
    lightDOMElement(parentTree.node).insertBefore(childTree.node, null);
  }
}

function queueHTML (tree, html) {
  if (enableLazy) {
    tree.html = html;
  } else {
    lightDOMElement(tree.node).innerHTML = html;
  }
}

// Changed from React
function queueText (tree, text) {
  if (enableLazy) {
    tree.text = text;
  } else {
    setTextContent(lightDOMElement(tree.node), text);
  }
}

// Changed from React
function DOMLazyTree () {}

// identical to React
DOMLazyTree.insertTreeBefore = insertTreeBefore;
DOMLazyTree.replaceChildWithTree = replaceChildWithTree;
DOMLazyTree.queueChild = queueChild;
DOMLazyTree.queueHTML = queueHTML;
DOMLazyTree.queueText = queueText;

// identical to React
module.exports = DOMLazyTree;
