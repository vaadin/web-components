export const makeFixture = (tpl, type) => {
  if (type === 'slotted') {
    const tag = '<input slot="input">';
    tpl = tpl.replace(/<\/vaadin/g, `${tag}</vaadin`);
  }
  return tpl;
};
