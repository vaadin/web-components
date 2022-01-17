/**
 * @license
 * Copyright (c) 2022 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import Collection from 'ol/Collection.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import OSM from 'ol/source/OSM.js';
import VectorSource from 'ol/source/Vector.js';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import View from 'ol/View.js';

/**
 * Helper to convert a coordinate object with the shape { x: number, y: number}
 * into a coordinate array used by OpenLayers
 * @param coordinate
 * @returns {*[]}
 */
function convertToCoordinateArray(coordinate) {
  return [coordinate.x, coordinate.y];
}

/**
 * Synchronizes an OpenLayers collection with data from a Javascript array
 * @param collection
 * @param jsonItems
 */
function synchronizeCollection(collection, jsonItems) {
  // Remove items not present new JSON items
  const itemsToRemove = collection
    .getArray()
    .filter((existingItem) => !jsonItems.find((jsonItem) => jsonItem.id === existingItem.id));
  itemsToRemove.forEach((item) => collection.remove(item));

  // Add / update items
  jsonItems.forEach((jsonItem, index) => {
    const existingItem = collection.getArray().find((item) => item.id === jsonItem.id);
    const syncedItem = synchronize(existingItem, jsonItem);
    // Add item if it didn't exist before
    if (!existingItem) {
      collection.insertAt(index, syncedItem);
    }
  });
}

function synchronizeMap(target, source) {
  if (!target) {
    throw new Error('Existing map instance must be provided');
  }

  // Layers
  synchronizeCollection(target.getLayers(), source.layers);

  // View
  if (source.view) {
    synchronizeView(target.getView(), source.view);
  }

  return target;
}

function synchronizeView(target, source) {
  if (!target) {
    target = new View();
  }

  target.setCenter(source.center ? convertToCoordinateArray(source.center) : [0, 0]);
  target.setRotation(source.rotation || 0);
  target.setZoom(source.zoom || 0);

  return target;
}

function synchronizeTileLayer(target, source) {
  if (!target) {
    target = new TileLayer({});
  }

  target.setSource(synchronize(target.getSource(), source.source));
  target.setOpacity(source.opacity || 0);
  target.setVisible(source.visible != null ? source.visible : true);

  return target;
}

function synchronizeOSMSource(target, source) {
  if (!target) {
    target = new OSM({
      opaque: source.opaque !== undefined ? source.opaque : true
    });
  }

  if (source.url) {
    target.setUrl(source.url);
  }

  return target;
}

function synchronizeFill(target, source) {
  if (!target) {
    target = new Fill();
  }

  target.setColor(source.color);

  return target;
}

function synchronizeStroke(target, source) {
  if (!target) {
    target = new Stroke();
  }

  target.setColor(source.color);
  target.setWidth(source.width);

  return target;
}

function synchronizeCircleStyle(target, source) {
  if (!target) {
    target = new CircleStyle({
      fill: synchronize(null, source.fill),
      stroke: synchronize(null, source.stroke)
    });
  }

  target.setRadius(source.radius);

  return target;
}

function synchronizeStyle(target, source) {
  if (!target) {
    target = new Style();
  }

  target.setImage(synchronize(target.getImage(), source.image));

  return target;
}

function synchronizePoint(target, source) {
  if (!target) {
    target = new Point(convertToCoordinateArray(source.coordinates));
  }

  target.setCoordinates(convertToCoordinateArray(source.coordinates));

  return target;
}

function synchronizeFeature(target, source) {
  if (!target) {
    target = new Feature();
  }

  target.setGeometry(synchronize(target.getGeometry(), source.geometry));
  target.setStyle(synchronize(target.getStyle(), source.style));

  return target;
}

function synchronizeVectorSource(target, source) {
  if (!target) {
    target = new VectorSource({ features: new Collection() });
  }

  synchronizeCollection(target.getFeaturesCollection(), source.features);

  return target;
}

function synchronizeVectorLayer(target, source) {
  if (!target) {
    target = new VectorLayer();
  }

  target.setSource(synchronize(target.getSource(), source.source));

  return target;
}

function synchronizeCircleFeature(target, source) {
  if (!target) {
    target = new Feature();
  }

  let point = target.getGeometry();
  if (!point) {
    point = new Point(convertToCoordinateArray(source.coordinates));
  }
  point.setCoordinates(convertToCoordinateArray(source.coordinates));

  let style = target.getStyle();
  if (!style) {
    style = new Style();
  }

  let circleStyle = style.getImage();

  let fill = circleStyle ? circleStyle.getFill() : null;
  if (!fill) {
    fill = new Fill();
  }
  fill.setColor(source.fillColor);

  let stroke = circleStyle ? circleStyle.getStroke() : null;
  if (!stroke) {
    stroke = new Stroke();
  }
  stroke.setColor(source.strokeColor);
  stroke.setWidth(source.strokeWidth);

  if (!circleStyle) {
    circleStyle = new CircleStyle({ fill, stroke });
  }
  circleStyle.setRadius(source.radius);

  style.setImage(circleStyle);
  target.setStyle(style);
  target.setGeometry(point);

  return target;
}

const synchronizerLookup = {
  'ol/Feature': synchronizeFeature,
  'ol/Map': synchronizeMap,
  'ol/View': synchronizeView,
  'ol/layer/Tile': synchronizeTileLayer,
  'ol/layer/Vector': synchronizeVectorLayer,
  'ol/source/OSM': synchronizeOSMSource,
  'ol/source/Vector': synchronizeVectorSource,
  'ol/geom/Point': synchronizePoint,
  'ol/style/Circle': synchronizeCircleStyle,
  'ol/style/Fill': synchronizeFill,
  'ol/style/Stroke': synchronizeStroke,
  'ol/style/Style': synchronizeStyle,
  'vaadin/feature/Circle': synchronizeCircleFeature
};

/**
 * Synchronizes a configuration object into a corresponding OpenLayers class
 * instance. All objects are expected to have:
 * - a type property to specify which OpenLayers class / type to use
 * - an ID property to identify the instance in future syncs
 *
 * If the target instance is null, or if its ID does not match with the source
 * configuration object, then a new target instance will be created.
 *
 * Only specific OpenLayers classes are supported for synchronization.
 *
 * @param target The OpenLayers instance into which to synchronize, or null if a new instance should be created
 * @param source The configuration object to synchronize from
 * @returns {*}
 */
export function synchronize(target, source) {
  const type = source.type;

  if (!type) {
    throw new Error('Configuration object must have a type');
  }
  if (!source.id) {
    throw new Error('Configuration object must have an ID');
  }

  const synchronizer = synchronizerLookup[type];
  if (!synchronizer) {
    throw new Error(`Unsupported configuration object type: ${type}`);
  }

  // If IDs do not match, then we have a new configuration object, and we want
  // a new matching OpenLayers instance
  if (target && target.id !== source.id) {
    target = null;
  }

  // Call the type-specific synchronizer function to either create a new
  // OpenLayers instance, or update the existing one
  const result = synchronizer(target, source);

  // Store ID on the sync result for future updates
  result.id = source.id;

  return result;
}
