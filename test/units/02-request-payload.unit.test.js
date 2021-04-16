const { expect } = require('chai');
const { requestPayload } = require(process.cwd() + '/test/utils/fixtures');
const { mailSchema } = require(process.cwd() + '/lib/validations/mail.validation');

const chance = require('chance').Chance();

describe('Request payload', () => {

  let payload;

  describe('.compiler', () => {

    beforeEach(() => {
      payload = JSON.parse( JSON.stringify( requestPayload() ) );
    });

    it(`error - should be provider|self|default`, (done) => {
      payload.compiler = 'Yoda';
      const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error.details[0].message).to.be.eqls(`"compiler" must be one of [provider, default, self]`);
      done();
    });

  });

  describe('.meta', () => {

    beforeEach(() => {
      payload = JSON.parse( JSON.stringify( requestPayload() ) );
    });

    describe('.subject', () => {

      it('error - is required', (done) => {
        payload.meta.subject = undefined;
        const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"meta.subject" is required');
        done();
      });

      it('error - should be a string', (done) => {
        payload.meta.subject = 666;
        const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"meta.subject" must be a string');
        done();
      });

      it('error - length should be less than or equals 128 chars long', (done) => {
        payload.meta.subject = chance.string({ length: 129 });
        const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls('"meta.subject" length must be less than or equal to 128 characters long');
        done();
      });
    });

    ['from', 'replyTo', 'to', 'cc', 'bcc'].forEach(property => {

      describe(`.${property}`, () => {
  
        if ( ['to', 'cc', 'bcc'].includes(property) ) {

          if ( property === 'to' ) {

            it(`error - ${property} is required`, (done) => {
              payload.meta[property] = undefined;
              const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
              expect(error.details[0].message).to.be.eqls(`"meta.${property}" is required`);
              done();
            });

          }

          it(`error - ${property} must be an array`, (done) => {
            payload.meta[property] = {};
            const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error.details[0].message).to.be.eqls(`"meta.${property}" must be an array`);
            done();
          });

          it(`error - ${property}.name is required`, (done) => {
            payload.meta[property] = [ { name: null, email: 'info@example.com' } ];
            const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error.details[0].message).to.be.eqls(`"meta.${property}[0].name" must be a string`);
            done();
          });

          it(`error - ${property}.name should be less than or equal to 48 chars`, (done) => {
            payload.meta[property] = [ { name: chance.string({ length: 49 }), email: 'info@example.com' } ];
            const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error.details[0].message).to.be.eqls(`"meta.${property}[0].name" length must be less than or equal to 48 characters long`);
            done();
          });

          it(`error - ${property}.email is required`, (done) => {
            payload.meta[property] = [ { name: 'Yoda', email : null } ];
            const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error.details[0].message).to.be.eqls(`"meta.${property}[0].email" must be a string`);
            done();
          });

          it(`error - ${property}.email should be a valid email address`, (done) => {
            payload.meta[property] = [ { name: 'Yoda', email : 'Yoda' } ];
            const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error.details[0].message).to.be.eqls(`"meta.${property}[0].email" must be a valid email`);
            done();
          });

        } else {

          it(`error - ${property}.name should be less than or equal to 48 chars`, (done) => {
            payload.meta[property] = { name: chance.string({ length: 49 }), email: 'info@example.com' };
            const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error.details[0].message).to.be.eqls(`"meta.${property}.name" length must be less than or equal to 48 characters long`);
            done();
          });

          it(`error - ${property}.email should be a valid email address`, (done) => {
            payload.meta[property] = { name: 'Yoda', email : 'Yoda' };
            const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            expect(error.details[0].message).to.be.eqls(`"meta.${property}.email" must be a valid email`);
            done();
          });

        }
    
      });

    });

    describe('.attachments', () => {

      it(`error - must not be a sparse array item`, (done) => {
        payload.meta.attachments[0] = undefined;
        const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"meta.attachments[0]" must not be a sparse array item`);
        done();
      });

      it(`error - base64 encoded content is required`, (done) => {
        payload.meta.attachments[0].content = null;
        const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"meta.attachments[0].content" must be one of [string]`);
        done();
      });

      it(`error - should be a valid base64 encoded string`, (done) => {
        payload.meta.attachments[0].content = 'I\'m your father Luke';
        const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"meta.attachments[0].content" does not match any of the allowed types`);
        done();
      });

      it(`error - filename is required`, (done) => {
        payload.meta.attachments[0].filename = null;
        const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"meta.attachments[0].filename" must be a string`);
        done();
      });

      it(`error - filename should be well formed`, (done) => {
        payload.meta.attachments[0].filename = 'filename';
        const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message.includes('fails to match the required pattern')).to.be.true;
        done();
      });

      it(`error - disposition should be one of inline|attachment`, (done) => {
        payload.meta.attachments[0].disposition = 'disposition';
        const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
        expect(error.details[0].message).to.be.eqls(`"meta.attachments[0].disposition" must be one of [inline, attachment]`);
        done();
      });

    });

  });

  describe('.content', () => {

    beforeEach(() => {
      payload = JSON.parse( JSON.stringify( requestPayload() ) );
    });

    it(`error - should be an array`, (done) => {
      payload.content = 'Yoda';
      const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error.details[0].message).to.be.eqls(`"content" must be an array`);
      done();
    });

    it(`error - should match text/plain or text/html`, (done) => {
      payload.content[0].type = 'application/json';
      const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error.details[0].message).to.be.eqls(`"content[0]" does not match any of the allowed types`);
      done();
    });

    it(`error - should have at least an text/html entry`, (done) => {
      payload.content[0].type = 'text/plain';
      const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error.details[0].message).to.be.eqls(`"content" does not contain 1 required value(s)`);
      done();
    });

    it(`error - should have 2 distinct well formed items max`, (done) => {
      payload.content = [ payload.content[0], payload.content[0], payload.content[0] ];
      const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error.details[0].message).to.be.eqls(`"content" must contain less than or equal to 2 items`);
      done();
    });

  });

  describe('.data', () => {

    beforeEach(() => {
      payload = JSON.parse( JSON.stringify( requestPayload() ) );
    });

    it(`error - should be an object`, (done) => {
      payload.data = 'Yoda';
      const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error.details[0].message).to.be.eqls(`"data" must be of type object`);
      done();
    });

    it(`error - cannot coexists with content`, (done) => {
      const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
      expect(error.details[0].message).to.be.eqls(`"value" contains a conflict between exclusive peers [content, data]`);
      done();
    });

  });

});