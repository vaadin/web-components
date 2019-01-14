window.GridProDemo = superClass => {
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

window.Vaadin.GridDemo = window.Vaadin.GridDemo || {};
window.Vaadin.GridDemo.users = window.Vaadin.GridDemo.users || [];
window.Vaadin.GridDemo.getUsers = () => JSON.parse(JSON.stringify(window.Vaadin.GridDemo.users));
