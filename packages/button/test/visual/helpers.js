import { resetMouse, sendMouse } from '@vaadin/test-runner-commands';

export async function hover(element) {
  const rect = element.getBoundingClientRect();
  const middleX = Math.floor(rect.x + rect.width / 2);
  const middleY = Math.floor(rect.y + rect.height / 2);
  await sendMouse({ type: 'move', position: [middleX, middleY] });
}

export async function resetHover() {
  await resetMouse();
}
