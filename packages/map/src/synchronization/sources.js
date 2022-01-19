/**
 * @license
 * Copyright (c) 2022 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import Collection from 'ol/Collection';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { createOptions, synchronizeCollection } from './util.js';

function synchronizeSource(target, source, _context) {
  if (!target) {
    throw new Error('Can not instantiate base class: ol/source/Source');
  }
  target.setAttributions(source.attributions);

  return target;
}

function synchronizeTileSource(target, source, context) {
  if (!target) {
    throw new Error('Can not instantiate base class: ol/source/Tile');
  }
  synchronizeSource(target, source, context);

  return target;
}

function synchronizeUrlTileSource(target, source, context) {
  if (!target) {
    throw new Error('Can not instantiate base class: ol/source/UrlTile');
  }
  synchronizeTileSource(target, source, context);
  target.setUrl(source.url || target.getUrl());

  return target;
}

function synchronizeTileImageSource(target, source, context) {
  if (!target) {
    throw new Error('Can not instantiate base class: ol/source/TileImage');
  }
  synchronizeUrlTileSource(target, source, context);

  return target;
}

export function synchronizeXYZSource(target, source, context) {
  if (!target) {
    target = new XYZ(createOptions(source));
  }
  synchronizeTileImageSource(target, source, context);

  return target;
}

export function synchronizeOSMSource(target, source, context) {
  if (!target) {
    target = new OSM(createOptions(source));
  }
  synchronizeXYZSource(target, source, context);

  return target;
}

export function synchronizeVectorSource(target, source, context) {
  if (!target) {
    target = new VectorSource(
      createOptions({
        ...source,
        features: new Collection()
      })
    );
  }
  synchronizeSource(target, source, context);
  synchronizeCollection(target.getFeaturesCollection(), source.features, context);

  return target;
}
