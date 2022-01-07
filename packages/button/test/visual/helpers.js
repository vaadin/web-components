import { resetMouse, sendMouse } from '@web/test-runner-commands';

export async function hover(element) {
  const rect = element.getBoundingClientRect();
  const middleX = Math.floor(rect.x + rect.width / 2);
  const middleY = Math.floor(rect.y + rect.height / 2);

  return new Promise((resolve) => {
    element.addEventListener('transitionend', resolve, { once: true });
    sendMouse({ type: 'move', position: [middleX, middleY] });
  });
}

export async function resetHover() {
  await resetMouse();
}
