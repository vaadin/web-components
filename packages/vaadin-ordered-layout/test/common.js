function positionEquals(node, top, right, bottom, left) {
  var rect = node.getBoundingClientRect();
  return rect.top === top && rect.bottom === bottom &&
          rect.left === left && rect.right === right;
}