/**
 * @license
 * Copyright (c) 2022 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import View from 'ol/View';
import { synchronizeTileLayer, synchronizeVectorLayer } from './synchronization/layers.js';
import { synchronizeOSMSource, synchronizeVectorSource, synchronizeXYZSource } from './synchronization/sources.js';
import { convertToCoordinateArray, synchronizeCollection } from './synchronization/util.js';

function synchronizeMap(target, source, context) {
  if (!target) {
    throw new Error('Existing map instance must be provided');
  }

  // Layers
  synchronizeCollection(target.getLayers(), source.layers, context);

  // View
  if (source.view) {
    synchronizeView(target.getView(), source.view, context);
  }

  return target;
}

function synchronizeView(target, source, _context) {
  if (!target) {
    target = new View();
  }

  target.setCenter(source.center ? convertToCoordinateArray(source.center) : [0, 0]);
  target.setRotation(source.rotation || 0);
  target.setZoom(source.zoom || 0);

  return target;
}

function synchronizeFill(target, source, _context) {
  if (!target) {
    target = new Fill();
  }

  target.setColor(source.color);

  return target;
}

function synchronizeStroke(target, source, _context) {
  if (!target) {
    target = new Stroke();
  }

  target.setColor(source.color);
  target.setWidth(source.width);

  return target;
}

function synchronizeCircleStyle(target, source, context) {
  if (!target) {
    target = new CircleStyle({
      fill: context.synchronize(null, source.fill, context),
      stroke: context.synchronize(null, source.stroke, context)
    });
  }

  target.setRadius(source.radius);

  return target;
}

function synchronizeStyle(target, source, context) {
  if (!target) {
    target = new Style();
  }

  target.setImage(context.synchronize(target.getImage(), source.image, context));

  return target;
}

function synchronizePoint(target, source, _context) {
  if (!target) {
    target = new Point(convertToCoordinateArray(source.coordinates));
  }

  target.setCoordinates(convertToCoordinateArray(source.coordinates));

  return target;
}

function synchronizeFeature(target, source, context) {
  if (!target) {
    target = new Feature();
  }

  target.setGeometry(context.synchronize(target.getGeometry(), source.geometry, context));
  target.setStyle(context.synchronize(target.getStyle(), source.style, context));

  return target;
}

function synchronizeCircleFeature(target, source, _context) {
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
  // Layers
  'ol/layer/Tile': synchronizeTileLayer,
  'ol/layer/Vector': synchronizeVectorLayer,
  // Sources
  'ol/source/OSM': synchronizeOSMSource,
  'ol/source/Vector': synchronizeVectorSource,
  'ol/source/XYZ': synchronizeXYZSource,
  // Geometry
  'ol/geom/Point': synchronizePoint,
  // Styles
  'ol/style/Circle': synchronizeCircleStyle,
  'ol/style/Fill': synchronizeFill,
  'ol/style/Stroke': synchronizeStroke,
  'ol/style/Style': synchronizeStyle,
  // Vaadin-specific
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
 * @param context The context object providing global context for the synchronization
 * @returns {*}
 */
export function synchronize(target, source, context) {
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
  const result = synchronizer(target, source, context);

  // Store ID on the sync result for future updates
  result.id = source.id;

  return result;
}
