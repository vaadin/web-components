/**
 * The following is copied and adapted from https://github.com/PolymerElements/iron-test-helpers/blob/master/mock-interactions.js
 *
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(global) {
  'use strict';


  var middleOfNode = global.MockInteractions.middleOfNode;


  /**
   * Returns a list of Touch objects that correspond to an array of positions
   * and a target node. The Touch instances will each have a unique Touch
   * identifier.
   *
   * @param {!Array<{ x: number, y: number }>} xyList A list of (x,y) coordinate objects.
   * @param {!HTMLElement} node A target element node.
   */
  function makeTouches(xyList, node) {
    var id = 0;

    if (window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.isWrapper(node)) {
      node = window.ShadowDOMPolyfill.unwrap(node);
    }

    return xyList.map(function(xy) {
      var touchInit = {
        identifier: id++,
        target: node,
        clientX: xy.x,
        clientY: xy.y
      };

      return window.Touch ? new window.Touch(touchInit) : touchInit;
    });
  }


  /**
   * Generates and dispatches a TouchEvent of a given type, at a specified
   * position of a target node.
   *
   * @param {string} type The type of TouchEvent to generate.
   * @param {{ x: number, y: number }} xy An (x,y) coordinate for the generated
   * TouchEvent.
   * @param {!HTMLElement} node The target element node for the generated
   * TouchEvent to be dispatched on.
   */
  function makeSoloTouchEvent(type, xy, node) {
    xy = xy || middleOfNode(node);
    var touches = makeTouches([xy], node);
    var touchEventInit = {
      touches: touches,
      targetTouches: touches,
      changedTouches: touches
    };
    var event;

    event = new CustomEvent(type, {bubbles: true, cancelable: true});
    for (var property in touchEventInit) {
      event[property] = touchEventInit[property];
    }

    node.dispatchEvent(event);
  }


  /**
   * Generate a touchstart event on a given node, optionally at a given coordinate.
   * @param {!HTMLElement} node The node to fire the click event on.
   * @param {{ x: number, y: number }=} xy Optional. The (x,y) coordinates the touch event should
   * be fired from.
   */
  function touchstart(node, xy) {
    xy = xy || middleOfNode(node);
    makeSoloTouchEvent('touchstart', xy, node);
  }


  /**
   * Generate a touchend event on a given node, optionally at a given coordinate.
   * @param {!HTMLElement} node The node to fire the click event on.
   * @param {{ x: number, y: number }=} xy Optional. The (x,y) coordinates the touch event should
   * be fired from.
   */
  function touchend(node, xy) {
    xy = xy || middleOfNode(node);
    makeSoloTouchEvent('touchend', xy, node);
  }


  global.MockTouchInteractions = {
    touchstart: touchstart,
    touchend: touchend,
    makeSoloTouchEvent: makeSoloTouchEvent
  };
})(this);
