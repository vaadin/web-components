/* @polymerMixin */
window.DateTimePickerDemo = superClass => {
  return class extends superClass {
    static get properties() {
      return {
      };
    }
  };
};

window.addEventListener('WebComponentsReady', () => {
  document.body.removeAttribute('unresolved');
});
