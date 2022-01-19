/**
 * Helper to convert a coordinate object with the shape { x: number, y: number}
 * into a coordinate array used by OpenLayers
 * @param coordinate
 * @returns {*[]}
 */
export function convertToCoordinateArray(coordinate) {
  return [coordinate.x, coordinate.y];
}

/**
 * Synchronizes an OpenLayers collection with data from a Javascript array
 */
export function synchronizeCollection(collection, jsonItems, options) {
  // Remove items not present new JSON items
  const itemsToRemove = collection
    .getArray()
    .filter((existingItem) => !jsonItems.find((jsonItem) => jsonItem.id === existingItem.id));
  itemsToRemove.forEach((item) => collection.remove(item));

  // Add / update items
  jsonItems.forEach((jsonItem, index) => {
    const existingItem = collection.getArray().find((item) => item.id === jsonItem.id);
    const syncedItem = options.synchronize(existingItem, jsonItem, options);
    // Add item if it didn't exist before
    if (!existingItem) {
      collection.insertAt(index, syncedItem);
    }
  });
}

/**
 * Creates an options object from a configuration object.
 * This clones the configuration object and removes any properties that have the
 * value `null`, as OpenLayers requires the use of `undefined` for properties
 * that should not be set.
 * @param configurationObject
 * @returns {*}
 */
export function createOptions(configurationObject) {
  const options = { ...configurationObject };
  Object.keys(configurationObject).forEach((key) => {
    const value = configurationObject[key];

    if (value === null) {
      delete options[key];
    }
  });
  return options;
}
