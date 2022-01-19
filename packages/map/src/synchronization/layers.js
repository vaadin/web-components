import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { createOptions } from './util.js';

function synchronizeLayer(target, source, _context) {
  if (!target) {
    throw new Error('Can not instantiate base class: ol/layer/Layer');
  }

  target.setOpacity(source.opacity);
  target.setVisible(source.visible);
  target.setZIndex(source.zIndex || undefined);
  target.setMinZoom(source.minZoom || -Infinity);
  target.setMaxZoom(source.maxZoom || Infinity);
  target.setBackground(source.background || undefined);

  return target;
}

export function synchronizeTileLayer(target, source, context) {
  if (!target) {
    target = new TileLayer(
      createOptions({
        ...source,
        source: context.synchronize(null, source.source, context)
      })
    );
  }

  synchronizeLayer(target, source);
  target.setSource(context.synchronize(target.getSource(), source.source, context));

  return target;
}

export function synchronizeVectorLayer(target, source, context) {
  if (!target) {
    target = new VectorLayer(
      createOptions({
        ...source,
        source: context.synchronize(null, source.source, context)
      })
    );
  }

  synchronizeLayer(target, source);
  target.setSource(context.synchronize(target.getSource(), source.source, context));

  return target;
}
