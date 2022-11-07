import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../vaadin-login-overlay.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-form-overlay', () => {
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
    wrapper = document.querySelector('vaadin-login-overlay-wrapper');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(wrapper).dom.to.equalSnapshot();
    });

    it('i18n', async () => {
      overlay.i18n = I18N_FINNISH;
      await expect(wrapper).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(wrapper).shadowDom.to.equalSnapshot();
    });

    it('i18n', async () => {
      overlay.i18n = I18N_FINNISH;
      await expect(wrapper).shadowDom.to.equalSnapshot();
    });
  });
});
