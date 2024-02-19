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

  describe('.variables', () => {

     beforeEach(() => {
      payload = JSON.parse( JSON.stringify(cliamrc) );
    });

    describe('.domain', () => {

      it(`error - is required`, (done) => {
        payload.variables.domain = undefined;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"variables.domain" is required`);
        done();
      });
  
      it(`error - should be a valid uri`, (done) => {
        payload.variables.domain = 'Yoda';
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"variables.domain" must be a valid uri`);
        done();
      });
    });

    describe('.addresses', () => {
      let addresses;

      beforeEach(() => {
        addresses = cliamrc.variables.addresses;
      });

      ['from', 'replyTo'].forEach(property => {
        it(`error - ${property}.name is required`, (done) => {
          let base = JSON.parse(JSON.stringify(cliamrc));
          Object.assign(base.variables.addresses, { [property] : { name: null, email : 'example@john.doe.com' } });
          const error = configurationSchema.validate(base, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"variables.addresses.${property}.name" must be a string`);
          done();
        });
    
        it(`error - ${property}.name should be less than or equal to 48 chars`, (done) => {
          let base = JSON.parse(JSON.stringify(cliamrc));
          Object.assign(base.variables.addresses, { [property] : { name: chance.string({ length: 49 }), email : 'example@john.doe.com' } });
          const error = configurationSchema.validate(base, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"variables.addresses.${property}.name" length must be less than or equal to 48 characters long`);
          done();
        });
  
        it(`error - ${property}.email is required`, (done) => {
          let base = JSON.parse(JSON.stringify(cliamrc));
          Object.assign(base.variables.addresses, { [property] : { name: 'Yoda', email : null } });
          const error = configurationSchema.validate(base, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"variables.addresses.${property}.email" must be a string`);
          done();
        });
    
        it(`error - ${property}.email should be a valid email address`, (done) => {
          let base = JSON.parse(JSON.stringify(cliamrc));
          Object.assign(base.variables.addresses, { [property] : { name: 'Yoda', email : 'Yoda' } });
          const error = configurationSchema.validate(base, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"variables.addresses.${property}.email" must be a valid email`);
          done();
        });
      });
    });
  });

  describe('.placeholders', () => {

     beforeEach(() => {
      payload = JSON.parse( JSON.stringify(cliamrc) );
    });
    
    describe('.company', () => {

      it(`error - is required`, (done) => {
        payload.placeholders.company = undefined;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"placeholders.company" is required`);
        done();
      });

      describe('.name', () => {
        
        it(`error - should be a string`, (done) => {
          payload.placeholders.company.name = 777;
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.company.name" must be a string`);
          done();
        });

      }),

      describe('.email', () => {

        it(`error - should be a string`, (done) => {
          payload.placeholders.company.email = null;
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.company.email" must be a string`);
          done();
        });
    
        it(`error - should be a valid email`, (done) => {
          payload.placeholders.company.email = 'Yoda';
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.company.email" must be a valid email`);
          done();
        });

      });

      describe('.phone', () => {

        it(`error - should be a string`, (done) => {
          payload.placeholders.company.phone = null;
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.company.phone" must be a string`);
          done();
        });

      });

      describe('.location', () => {

        it(`error - street should be a string`, (done) => {
          payload.placeholders.company.location.street = null;
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.company.location.street" must be a string`);
          done();
        });
  
        it(`error - num should be a string`, (done) => {
          payload.placeholders.company.location.num = null;
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.company.location.num" must be a string`);
          done();
        });
  
        it(`error - zip should be a string`, (done) => {
          payload.placeholders.company.location.zip = null;
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.company.location.zip" must be a string`);
          done();
        });
  
        it(`error - city should be a string`, (done) => {
          payload.placeholders.company.location.city = null;
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.company.location.city" must be a string`);
          done();
        });
  
        it(`error - country should be a string`, (done) => {
          payload.placeholders.company.location.country = null;
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.company.location.country" must be a string`);
          done();
        });
  
      });
  
      describe('.socials', () => {
  
        it(`error - social network must be valid object`, (done) => {
          payload.placeholders.company.socials.push(5);
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.company.socials[1]" must be of type object`);
          done();
        });
  
        it(`error - social network must be a well know network`, (done) => {
          payload.placeholders.company.socials.push({ name: 'Yoda', url: 'https://yoda.com' });
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.company.socials[1].name" must be one of [facebook, twitter, youtube, google, github, linkedin]`);
          done();
        });
  
      });

    });
    
    describe('.theme', () => {

      it(`error - logo should be a valid uri`, (done) => {
        payload.placeholders.theme.logo = 'Yoda';
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"placeholders.theme.logo" must be a valid uri`);
        done();
      });

      ['primaryColor', 'secondaryColor', 'tertiaryColor', 'quaternaryColor'].forEach(color => {

        it(`error - ${color} should be a valid hexadecimal value`, (done) => {
          payload.placeholders.theme[color] = 'Yoda';
          const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
          expect(error.details[0].message).to.be.eqls(`"placeholders.theme.${color}" must only contain hexadecimal characters`);
          done();
        });

      });

    });
  
  });

  describe('.transporters', () => {

    beforeEach(() => {
      payload = JSON.parse( JSON.stringify(cliamrc) );
    });

    it(`error - is required`, (done) => {
      payload.transporters = undefined;
      const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error.details[0].message).to.be.eqls(`"transporters" is required`);
      done();
    });

    describe('.api', () => {

      beforeEach(() => {
        payload = JSON.parse( JSON.stringify(cliamrc) );
        payload.transporters = [ payload.transporters[0] ]
      });

      it(`error - auth is required`, (done) => {
        payload.transporters[0].auth = undefined;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"transporters[0].auth" is required`);
        done();
      });

      it(`error - auth.apiKey is required`, (done) => {
        payload.transporters[0].auth.apiKey = undefined;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"transporters[0].auth.apiKey" is required`);
        done();
      });

      ['mailgun', 'mailjet', 'postmark', 'brevo', 'sendgrid', 'sparkpost'].forEach(provider => {

        describe(`[${provider}]`, () => {

          beforeEach(() => {
            payload = JSON.parse( JSON.stringify(cliamrc) );
            payload.transporters = [ payload.transporters.find(transporter => transporter.provider === provider) ]
          });

          it(`error - apiKey bad formed`, (done) => {
            payload.transporters[0].auth.apiKey = `fake.key`;
            const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error.details[0].message.includes('fails to match the required pattern')).to.be.true;
            done();
          });

          it(`success - apiKey well formed`, (done) => {
            const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error).to.be.undefined;
            done();
          });

          if (provider === 'mailjet') {

            xit(`error - secret is required`, (done) => {
              delete payload.transporters[0].auth.apiSecret;
              const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
              expect(error.details[0].message).to.be.eqls(`"transporters[0].auth.apiSecret" is required`);
              done();
            });
          }
    
          it(`success - templates well formed`, (done) => {
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
        payload.transporters = [ payload.transporters.pop() ]
      });

      it(`error - host is required`, (done) => {
        payload.transporters[0].options.host = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"transporters[0].options.host" must be a string`);
        done();
      });

      it(`error - host should be a valid smtp string`, (done) => {
        payload.transporters[0].options.host = 'Yoda';
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"transporters[0].options.host" with value "Yoda" fails to match the required pattern: /^[a-z-0-9\\-]{2,12}\\.[a-z]{2,16}\\.[a-z]{2,8}$/i`);
        done();
      });

      it(`error - port is required`, (done) => {
        payload.transporters[0].options.port = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"transporters[0].options.port" must be a number`);
        done();
      });

      it(`error - port should be a number`, (done) => {
        payload.transporters[0].options.port = 'Yoda';
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"transporters[0].options.port" must be a number`);
        done();
      });

      it(`error - port should be a valid port`, (done) => {
        payload.transporters[0].options.port = 666666;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"transporters[0].options.port" must be a valid port`);
        done();
      });

      it(`error - username is required`, (done) => {
        payload.transporters[0].auth.username = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"transporters[0].auth.username" must be a string`);
        done();
      });

      it(`error - username should be less than or equals to 32 chars long`, (done) => {
        payload.transporters[0].auth.username = chance.string({ length: 128 });
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"transporters[0].auth.username" length must be less than or equal to 32 characters long`);
        done();
      });

      it(`error - password is required`, (done) => {
        payload.transporters[0].auth.password = null;
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"transporters[0].auth.password" must be a string`);
        done();
      });

      it(`error - password should be less than or equals to 24 chars long`, (done) => {
        payload.transporters[0].auth.password = chance.string({ length: 32 });
        const error = configurationSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"transporters[0].auth.password" length must be less than or equal to 24 characters long`);
        done();
      });

    });

  });

});