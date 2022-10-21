export default async function fromAsync<T, U>(
  asyncIterable: AsyncIterable<T>,
  mapperFn: (value: T) => U,
): Promise<Array<Awaited<U>>> {
  const arr: Array<Awaited<U>> = [];

  for await (const item of asyncIterable) {
    arr.push(await mapperFn(item));
  }

  return arr;
}
