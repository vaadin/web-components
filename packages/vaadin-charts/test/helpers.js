import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

export const nextRender = (target) => {
  return new Promise((resolve) => {
    afterNextRender(target, () => {
      resolve();
    });
  });
};
