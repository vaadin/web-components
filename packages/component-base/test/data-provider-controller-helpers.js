export function createDataProvider({ size, async, generator }) {
  generator ||= (parentItem, i) => `${parentItem ?? 'Item'}-${i}`;

  return ({ page, pageSize, parentItem }, callback) => {
    const items = Array.from({ length: size }, (_, i) => generator(parentItem, i));
    const result = items.splice(page * pageSize, pageSize);

    if (async) {
      setTimeout(() => callback(result, size));
    } else {
      callback(result, size);
    }
  };
}
