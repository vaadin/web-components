export function createRenderer(text) {
  return (root) => {
    if (root.firstChild) {
      return;
    }

    const span = document.createElement('div');
    span.textContent = text;
    root.appendChild(span);
  };
}
