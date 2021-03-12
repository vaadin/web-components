export const listenOnce = (element, eventName, callback) => {
  const listener = (e) => {
    element.removeEventListener(eventName, listener);
    callback(e);
  };
  element.addEventListener(eventName, listener);
};

export const makeFixture = (tpl, type) => {
  if (type === 'slotted') {
    const tag = tpl.indexOf('text-area') > -1 ? '<textarea slot="textarea"></textarea>' : '<input slot="input">';
    tpl = tpl.replace(/<\/vaadin/g, `${tag}</vaadin`);
  }
  return tpl;
};
