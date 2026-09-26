export async function nextRender() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        resolve();
      });
    });
  });
}
