export const down = (node) => {
  node.dispatchEvent(new CustomEvent('down'));
};

export const up = (node) => {
  node.dispatchEvent(new CustomEvent('up'));
};

export const visible = (e) => {
  const rect = e.getBoundingClientRect();
  return !!(rect.width && rect.height);
};
