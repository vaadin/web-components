window.getCoords = (node) => {
  const {top, right, bottom, left} = node.getBoundingClientRect();
  return {top, right, bottom, left};
};

window.getCustomCSSPropertyValue = (element, propertyName) => {
  return window.ShadyCSS
    ? window.ShadyCSS.getComputedStyleValue(element, propertyName)
    : getComputedStyle(element).getPropertyValue(propertyName);
};
