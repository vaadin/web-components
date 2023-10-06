export function createDataProvider({ size, async }) {
  return ({ page, pageSize, parentItem }, callback) => {
    const items = Array.from({ length: size }, (_, i) => `${parentItem ?? 'Item'}-${i}`);
    const result = items.splice(page * pageSize, pageSize);

    if (async) {
      setTimeout(() => callback(result, size));
    } else {
      callback(result, size);
    }
  };
}
