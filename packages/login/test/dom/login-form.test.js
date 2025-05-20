import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../vaadin-login-form.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-login-form', () => {
  let form;

  const I18N_FINNISH = {
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
      username: 'Käyttäjätunnus vaaditaan',
      password: 'Salasana vaaditaan',
    },
    additionalInformation: 'Jos tarvitset lisätietoja käyttäjälle.',
  };

  beforeEach(async () => {
    resetUniqueId();
    form = fixtureSync('<vaadin-login-form></vaadin-login-form>');
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(form).dom.to.equalSnapshot();
    });

    it('required', async () => {
      form.querySelectorAll('[required]').forEach((el) => {
        el.invalid = true;
      });
      await expect(form).dom.to.equalSnapshot();
    });

    it('i18n', async () => {
      form.i18n = I18N_FINNISH;
      await nextUpdate(form);
      await expect(form).dom.to.equalSnapshot();
    });

    it('i18n-partial', async () => {
      form.i18n = { form: { forgotPassword: 'Custom forgot password' } };
      await nextUpdate(form);
      await expect(form).dom.to.equalSnapshot();
    });

    it('i18n-required', async () => {
      form.i18n = I18N_FINNISH;
      form.querySelectorAll('[required]').forEach((el) => {
        el.invalid = true;
      });
      await nextUpdate(form);
      await expect(form).dom.to.equalSnapshot();
    });

    it('noForgotPassword', async () => {
      form.noForgotPassword = true;
      await nextUpdate(form);
      await expect(form).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = form.querySelector('vaadin-login-form-wrapper');
    });

    it('default', async () => {
      await expect(wrapper).shadowDom.to.equalSnapshot();
    });

    it('error', async () => {
      form.error = true;
      await nextUpdate(form);
      await expect(wrapper).shadowDom.to.equalSnapshot();
    });

    it('i18n', async () => {
      form.i18n = I18N_FINNISH;
      await nextUpdate(form);
      await expect(wrapper).shadowDom.to.equalSnapshot();
    });
  });
});
