const defineAPI = (elementClass, name, callback) => {
  Object.defineProperty(elementClass.prototype, name, {
    get() {
      return callback(this);
    },
  });
};

export const registerAPI = (tagName, name, callback) => {
  const elementClass = customElements.get(tagName);
  if (elementClass) {
    defineAPI(elementClass, name, callback);
  } else {
    customElements.whenDefined(tagName).then((elementClass) => {
      defineAPI(elementClass, name, callback);
    });
  }
};
