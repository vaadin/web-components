/**
 * Facade for `document.location`, can be stubbed for testing.
 *
 * For internal use only.
 *
 */
export const location = {
  get pathname() {
    return document.location.pathname;
  },
  get search() {
    return document.location.search;
  },
};
