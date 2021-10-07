export const onceOpened = (element) => {
  return new Promise((resolve) => {
    const listener = (e) => {
      if (e.detail.value) {
        element.removeEventListener('opened-changed', listener);
        resolve();
      }
    };
    element.addEventListener('opened-changed', listener);
  });
};
