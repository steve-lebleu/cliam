const { expect } = require('chai');
const { cliamrc, api, apis } = require(process.cwd() + '/test/utils/fixtures');
const { configurationSchema } = require(process.cwd() + '/dist/validations/configuration.validation');

const chance = require('chance').Chance();

describe('Client configuration', () => {

  let payload;

  before(() => {});

  after(() => {});

  describe('.sandbox', () => {

    beforeEach(() => {
      payload = JSON.parse( JSON.stringify(cliamrc) );
    });

    it(`success - let sandbox inactive by default`, (done) => {
      payload.sandbox = undefined;
      const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error).to.be.undefined;
      done();
    });

  });

  describe('.consumer', () => {

    beforeEach(() => {
      payload = JSON.parse( JSON.stringify(cliamrc) );
    });

    it(`error - is required`, (done) => {
      payload.consumer = undefined;
      const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error.details[0].message).to.be.eqls(`"consumer" is required`);
      done();
    });

    describe('.domain', () => {

      it(`error - is required`, (done) => {
        payload.consumer.domain = undefined;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.domain" is required`);
        done();
      });
  
      it(`error - should be a valid uri`, (done) => {
        payload.consumer.domain = 'Yoda';
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.domain" must be a valid uri`);
        done();
      });

    });
    
    describe('.company', () => {

      it(`error - is required`, (done) => {
        payload.consumer.company = undefined;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.company" is required`);
        done();
      });
  
      it(`error - should be a string`, (done) => {
        payload.consumer.company = 777;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.company" must be a string`);
        done();
      });

    });

    describe('.email', () => {

      it(`error - should be a string`, (done) => {
        payload.consumer.email = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.email" must be a string`);
        done();
      });
  
      it(`error - should be a valid email`, (done) => {
        payload.consumer.email = 'Yoda';
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.email" must be a valid email`);
        done();
      });

    });

    describe('.phone', () => {

      it(`error - should be a string`, (done) => {
        payload.consumer.phone = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.phone" must be a string`);
        done();
      });

    });

    describe('.addresses', () => {

      ['from', 'replyTo'].forEach(property => {

        it(`error - ${property}.name is required`, (done) => {
          payload.consumer.addresses = { [property] : { name: null, email : 'example@john.doe.com' } };
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"consumer.addresses.${property}.name" must be a string`);
          done();
        });
    
        it(`error - ${property}.name should be less than or equal to 48 chars`, (done) => {
          payload.consumer.addresses = { [property] : { name: chance.string({ length: 49 }), email : 'example@john.doe.com' } };
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"consumer.addresses.${property}.name" length must be less than or equal to 48 characters long`);
          done();
        });
  
        it(`error - ${property}.email is required`, (done) => {
          payload.consumer.addresses = { [property] : { name: 'Yoda', email : null } };
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"consumer.addresses.${property}.email" must be a string`);
          done();
        });
    
        it(`error - ${property}.email should be a valid email address`, (done) => {
          payload.consumer.addresses = { [property] : { name: 'Yoda', email : 'Yoda' } };
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"consumer.addresses.${property}.email" must be a valid email`);
          done();
        });
  
      });

    });

    describe('.location', () => {

      it(`error - street should be a string`, (done) => {
        payload.consumer.location.street = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.location.street" must be a string`);
        done();
      });

      it(`error - num should be a string`, (done) => {
        payload.consumer.location.num = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.location.num" must be a string`);
        done();
      });

      it(`error - zip should be a string`, (done) => {
        payload.consumer.location.zip = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.location.zip" must be a string`);
        done();
      });

      it(`error - city should be a string`, (done) => {
        payload.consumer.location.city = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.location.city" must be a string`);
        done();
      });

      it(`error - country should be a string`, (done) => {
        payload.consumer.location.country = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.location.country" must be a string`);
        done();
      });

    });

    describe('.socials', () => {

      it(`error - social network must be valid object`, (done) => {
        payload.consumer.socials.push(5);
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.socials[1]" must be of type object`);
        done();
      });

      it(`error - social network must be a well know network`, (done) => {
        payload.consumer.socials.push({ name: 'Yoda', url: 'https://yoda.com' });
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.socials[1].name" must be one of [facebook, twitter, youtube, google, github, linkedin]`);
        done();
      });

    });
    
    describe('.theme', () => {

      it(`error - logo should be a valid uri`, (done) => {
        payload.consumer.theme.logo = 'Yoda';
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"consumer.theme.logo" must be a valid uri`);
        done();
      });

      ['primaryColor', 'secondaryColor', 'tertiaryColor', 'quaternaryColor'].forEach(color => {

        it(`error - ${color} should be a valid hexadecimal value`, (done) => {
          payload.consumer.theme[color] = 'Yoda';
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"consumer.theme.${color}" must only contain hexadecimal characters`);
          done();
        });

      });

    });
  
  });

  describe('.mode', () => {

    beforeEach(() => {
      payload = JSON.parse( JSON.stringify(cliamrc) );
    });

    it(`error - is required`, (done) => {
      payload.mode = undefined;
      const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error.details[0].message).to.be.eqls(`"mode" is required`);
      done();
    });

    it(`error - should have at least one of api or smtp property`, (done) => {
      payload.mode.api = undefined;
      payload.mode.smtp = undefined;
      const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error.details[0].message).to.be.eqls(`"mode" must contain at least one of [api, smtp]`);
      done();
    });

    describe('.api', () => {

      beforeEach(() => {
        payload = JSON.parse( JSON.stringify(cliamrc) );
        delete payload.mode.smtp;
        payload.mode.api = JSON.parse( JSON.stringify( api() ) )
      });

      it(`error - credentials is required`, (done) => {
        payload.mode.api.credentials = undefined;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"mode.api.credentials" is required`);
        done();
      });

      it(`error - credentials.apiKey is required`, (done) => {
        payload.mode.api.credentials.apiKey = undefined;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"mode.api.credentials.apiKey" is required`);
        done();
      });

      ['mailgun', 'mailjet', 'postmark', 'sendinblue', 'sendgrid', 'sparkpost'].forEach(provider => {

        describe(`[${provider}]`, () => {

          it(`error - apiKey bad formed`, (done) => {
            payload.mode.api.name = provider;
            payload.mode.api.credentials.apiKey = `fake.${apis[provider].credentials.apiKey}`;
            const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error.details[0].message.includes('fails to match the required pattern')).to.be.true;
            done();
          });

          it(`success - apiKey well formed`, (done) => {
            payload.mode.api.name = provider;
            payload.mode.api.credentials.apiKey = `${apis[provider].credentials.apiKey}`;
            const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error).to.be.undefined;
            done();
          });

          if (provider === 'mailjet') {

            it(`error - token is required`, (done) => {
              payload.mode.api.name = provider;
              payload.mode.api.credentials.apiKey = `${apis[provider].credentials.apiKey}`;
              payload.mode.api.credentials.token = undefined;
              const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
              expect(error.details[0].message).to.be.eqls(`"mode.api.credentials.token" is required`);
              done();
            });

          }
    
          it(`success - templates well formed`, (done) => {
            payload.mode.api.name = provider;
            payload.mode.api.credentials.apiKey = `${apis[provider].credentials.apiKey}`;
            payload.mode.api.templates = apis[provider].templates;
            const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error).to.be.undefined;
            done();
          });

        });

      });

    });

    describe('.smtp', () => {

      beforeEach(() => {
        payload = JSON.parse( JSON.stringify(cliamrc) );
      });

      it(`error - host is required`, (done) => {
        payload.mode.smtp.host = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"mode.smtp.host" must be a string`);
        done();
      });

      it(`error - host should be a valid smtp string`, (done) => {
        payload.mode.smtp.host = 'Yoda';
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"mode.smtp.host" with value "Yoda" fails to match the required pattern: /^[a-z-0-9\\-]{2,12}\\.[a-z]{2,16}\\.[a-z]{2,8}$/i`);
        done();
      });

      it(`error - port is required`, (done) => {
        payload.mode.smtp.port = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"mode.smtp.port" must be a number`);
        done();
      });

      it(`error - port should be a number`, (done) => {
        payload.mode.smtp.port = 'Yoda';
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"mode.smtp.port" must be a number`);
        done();
      });

      it(`error - port should be a valid port`, (done) => {
        payload.mode.smtp.port = 666666;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"mode.smtp.port" must be a valid port`);
        done();
      });

      it(`error - username is required`, (done) => {
        payload.mode.smtp.username = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"mode.smtp.username" must be a string`);
        done();
      });

      it(`error - username should be less than or equals to 32 chars long`, (done) => {
        payload.mode.smtp.username = chance.string({ length: 128 });
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"mode.smtp.username" length must be less than or equal to 32 characters long`);
        done();
      });

      it(`error - password is required`, (done) => {
        payload.mode.smtp.password = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"mode.smtp.password" must be a string`);
        done();
      });

      it(`error - password should be less than or equals to 24 chars long`, (done) => {
        payload.mode.smtp.password = chance.string({ length: 32 });
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"mode.smtp.password" length must be less than or equal to 24 characters long`);
        done();
      });

    });

  });

});