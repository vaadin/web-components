export function updateColumnOrders(columns, scope, order) {
  let c = 0;
  columns.forEach((column, _) => {
    // avoid multiples of 10 because they introduce and extra zero and
    // causes the underlying calculations for child order goes wrong
    if (c !== 0 && c % 9 === 0) {
      c++;
    }
    column._order = order + (c + 1) * scope;
    c++;
  });
}
