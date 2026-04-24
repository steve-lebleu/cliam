import { describe, it, beforeEach } from 'bun:test';
import { expect } from 'chai';
import Chance from 'chance';

import { cliamrc } from './fixtures/index';
import { configurationSchema } from '../src/validations/configuration.validation';

const chance = new Chance();

describe('Client configuration', () => {

  let payload: any;

  describe('.sandbox', () => {
    beforeEach(() => { payload = JSON.parse(JSON.stringify(cliamrc)); });

    it('success - let sandbox inactive by default', (done: any) => {
      payload.sandbox = undefined;
      const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error).to.be.undefined;
      done();
    });
  });

  describe('.defaults', () => {
    beforeEach(() => { payload = JSON.parse(JSON.stringify(cliamrc)); });

    describe('.addresses', () => {
      ['from', 'replyTo'].forEach(property => {
        it(`error - ${property}.name is required`, (done: any) => {
          const base = JSON.parse(JSON.stringify(cliamrc));
          Object.assign(base.defaults.addresses, { [property]: { name: null, email: 'example@john.doe.com' } });
          const error = configurationSchema.validate(base, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"defaults.addresses.${property}.name" must be a string`);
          done();
        });

        it(`error - ${property}.name should be less than or equal to 48 chars`, (done: any) => {
          const base = JSON.parse(JSON.stringify(cliamrc));
          Object.assign(base.defaults.addresses, { [property]: { name: chance.string({ length: 49 }), email: 'example@john.doe.com' } });
          const error = configurationSchema.validate(base, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"defaults.addresses.${property}.name" length must be less than or equal to 48 characters long`);
          done();
        });

        it(`error - ${property}.email is required`, (done: any) => {
          const base = JSON.parse(JSON.stringify(cliamrc));
          Object.assign(base.defaults.addresses, { [property]: { name: 'Yoda', email: null } });
          const error = configurationSchema.validate(base, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"defaults.addresses.${property}.email" must be a string`);
          done();
        });

        it(`error - ${property}.email should be a valid email address`, (done: any) => {
          const base = JSON.parse(JSON.stringify(cliamrc));
          Object.assign(base.defaults.addresses, { [property]: { name: 'Yoda', email: 'Yoda' } });
          const error = configurationSchema.validate(base, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"defaults.addresses.${property}.email" must be a valid email`);
          done();
        });
      });
    });
  });

  describe('.placeholders', () => {
    beforeEach(() => { payload = JSON.parse(JSON.stringify(cliamrc)); });

    describe('.company', () => {
      it('error - is required', (done: any) => {
        payload.placeholders.company = undefined;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"placeholders.company" is required');
        done();
      });

      describe('.name', () => {
        it('error - should be a string', (done: any) => {
          payload.placeholders.company.name = 777;
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls('"placeholders.company.name" must be a string');
          done();
        });
      });

      describe('.email', () => {
        it('error - should be a string', (done: any) => {
          payload.placeholders.company.email = null;
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls('"placeholders.company.email" must be a string');
          done();
        });

        it('error - should be a valid email', (done: any) => {
          payload.placeholders.company.email = 'Yoda';
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls('"placeholders.company.email" must be a valid email');
          done();
        });
      });

      describe('.phone', () => {
        it('error - should be a string', (done: any) => {
          payload.placeholders.company.phone = null;
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls('"placeholders.company.phone" must be a string');
          done();
        });
      });

      describe('.location', () => {
        ['street', 'num', 'zip', 'city', 'country'].forEach(field => {
          it(`error - ${field} should be a string`, (done: any) => {
            payload.placeholders.company.location[field] = null;
            const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error.details[0].message).to.be.eqls(`"placeholders.company.location.${field}" must be a string`);
            done();
          });
        });
      });

      describe('.socials', () => {
        it('error - social network must be valid object', (done: any) => {
          payload.placeholders.company.socials.push(5);
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls('"placeholders.company.socials[1]" must be of type object');
          done();
        });

        it('error - social network must be a well know network', (done: any) => {
          payload.placeholders.company.socials.push({ name: 'Yoda', url: 'https://yoda.com' });
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls('"placeholders.company.socials[1].name" must be one of [facebook, twitter, youtube, google, github, linkedin]');
          done();
        });
      });
    });

    describe('.theme', () => {

      it('error - logo should be a valid uri', (done: any) => {
        payload.placeholders.theme.logo = 'Yoda';
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"placeholders.theme.logo" must be a valid uri');
        done();
      });

      ['primaryColor', 'secondaryColor', 'tertiaryColor', 'quaternaryColor'].forEach(color => {
        it(`error - ${color} should be a valid hexadecimal value`, (done: any) => {
          payload.placeholders.theme[color] = 'Yoda';
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.theme.${color}" must only contain hexadecimal characters`);
          done();
        });
      });
    });
  });

  describe('.transporters', () => {

    beforeEach(() => { payload = JSON.parse(JSON.stringify(cliamrc)); });

    it('error - is required', (done: any) => {
      payload.transporters = undefined;
      const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error.details[0].message).to.be.eqls('"transporters" is required');
      done();
    });

    describe('.api', () => {

      beforeEach(() => {
        payload = JSON.parse(JSON.stringify(cliamrc));
        payload.transporters = [payload.transporters[0]];
      });

      it('error - auth is required', (done: any) => {
        payload.transporters[0].auth = undefined;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"transporters[0].auth" is required');
        done();
      });

      it('error - auth.apiKey is required', (done: any) => {
        payload.transporters[0].auth.apiKey = undefined;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"transporters[0].auth.apiKey" is required');
        done();
      });

      ['mailgun', 'mailjet', 'postmark', 'brevo', 'sendgrid', 'sparkpost', 'mailersend'].forEach(provider => {
        describe(`[${provider}]`, () => {

          beforeEach(() => {
            payload = JSON.parse(JSON.stringify(cliamrc));
            payload.transporters = [payload.transporters.find((t: any) => t.provider === provider)];
          });

          it('error - apiKey bad formed', (done: any) => {
            payload.transporters[0].auth.apiKey = 'fake.key';
            const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error.details[0].message.includes('fails to match the required pattern')).to.be.true;
            done();
          });

          it('success - apiKey well formed', (done: any) => {
            const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error).to.be.undefined;
            done();
          });

          if (provider === 'mailjet') {
            it.skip('error - secret is required', (done: any) => {
              delete payload.transporters[0].auth.apiSecret;
              const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
              expect(error.details[0].message).to.be.eqls('"transporters[0].auth.apiSecret" is required');
              done();
            });
          }

          it('success - templates well formed', (done: any) => {
            const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error).to.be.undefined;
            done();
          });
        });
      });
    });

    describe('.smtp', () => {

      beforeEach(() => {
        payload = JSON.parse(JSON.stringify(cliamrc));
        payload.transporters = [payload.transporters.pop()];
      });

      it('error - host is required', (done: any) => {
        payload.transporters[0].options.host = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"transporters[0].options.host" must be a string');
        done();
      });

      it('error - host should be a valid smtp string', (done: any) => {
        payload.transporters[0].options.host = 'Yoda';
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"transporters[0].options.host" with value "Yoda" fails to match the required pattern: /^[a-z-0-9\\-]{2,12}\\.[a-z]{2,16}\\.[a-z]{2,8}$/i');
        done();
      });

      it('error - port is required', (done: any) => {
        payload.transporters[0].options.port = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"transporters[0].options.port" must be a number');
        done();
      });

      it('error - port should be a number', (done: any) => {
        payload.transporters[0].options.port = 'Yoda';
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"transporters[0].options.port" must be a number');
        done();
      });

      it('error - port should be a valid port', (done: any) => {
        payload.transporters[0].options.port = 666666;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"transporters[0].options.port" must be a valid port');
        done();
      });

      it('error - username is required', (done: any) => {
        payload.transporters[0].auth.username = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"transporters[0].auth.username" must be a string');
        done();
      });

      it(`error - username should be less than or equals to 32 chars long`, (done: any) => {
        payload.transporters[0].auth.username = chance.string({ length: 128 });
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"transporters[0].auth.username" length must be less than or equal to 32 characters long');
        done();
      });

      it('error - password is required', (done: any) => {
        payload.transporters[0].auth.password = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"transporters[0].auth.password" must be a string');
        done();
      });

      it('error - password should be less than or equals to 24 chars long', (done: any) => {
        payload.transporters[0].auth.password = chance.string({ length: 32 });
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"transporters[0].auth.password" length must be less than or equal to 24 characters long');
        done();
      });
    });
  });
});
