import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextUpdate } from '@vaadin/testing-helpers';
import '../../vaadin-login-overlay.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-login-overlay', () => {
  let overlay, wrapper;

  const I18N_FINNISH = {
    header: {
      title: 'Sovelluksen nimi',
      description: 'Sovelluksen kuvaus',
    },
    form: {
      title: 'Kirjaudu sisään',
      username: 'Käyttäjänimi',
      password: 'Salasana',
      submit: 'Kirjaudu sisään',
      forgotPassword: 'Unohtuiko salasana?',
    },
    errorMessage: {
      title: 'Väärä käyttäjätunnus tai salasana',
      message: 'Tarkista että käyttäjätunnus ja salasana ovat oikein ja yritä uudestaan.',
    },
    additionalInformation: 'Jos tarvitset lisätietoja käyttäjälle.',
  };

  beforeEach(async () => {
    resetUniqueId();
    overlay = fixtureSync('<vaadin-login-overlay opened></vaadin-login-overlay>');
    await nextFrame();
    wrapper = overlay.$.overlay;
  });

  describe('host', () => {
    it('default', async () => {
      await expect(wrapper).dom.to.equalSnapshot();
    });

    it('i18n', async () => {
      overlay.i18n = I18N_FINNISH;
      await nextUpdate(overlay);
      await expect(wrapper).dom.to.equalSnapshot();
    });

    it('i18n-partial', async () => {
      overlay.i18n = { form: { forgotPassword: 'Custom forgot password' } };
      await nextUpdate(overlay);
      await expect(wrapper).dom.to.equalSnapshot();
    });

    it('overlay class', async () => {
      overlay.overlayClass = 'custom login-overlay';
      await nextUpdate(overlay);
      await expect(wrapper).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(wrapper).shadowDom.to.equalSnapshot();
    });

    it('i18n', async () => {
      overlay.i18n = I18N_FINNISH;
      await nextUpdate(overlay);
      await expect(wrapper).shadowDom.to.equalSnapshot();
    });
  });
});
