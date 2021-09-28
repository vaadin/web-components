export const dispatchChange = (elem) => elem.dispatchEvent(new CustomEvent('change', { bubbles: true }));

export const changeInputValue = (el, value) => {
  el.value = value;
  dispatchChange(el);
};
