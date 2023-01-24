export const getComputedCSSPropertyValue = (element, propertyName) => {
  const helper = element.cloneNode(true);
  helper.classList.add('helper');
  document.body.appendChild(helper);

  const style = document.createElement('style');
  style.textContent = `.helper { width: var(${propertyName}) !important }`;
  document.body.appendChild(style);

  const result = getComputedStyle(helper).width;
  document.body.removeChild(helper);
  document.body.removeChild(style);

  return result;
};
