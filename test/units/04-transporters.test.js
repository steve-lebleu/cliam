const sinon = require('sinon');
const { expect } = require('chai');

const { requestPayload, responsePayload, errorPayload } = require(process.cwd() + '/test/fixtures');
const { transporters } = require(process.cwd() + '/test/fixtures/');

const { Container } = require(process.cwd() + '/dist/services/container.service');
const { Mailer } = require(process.cwd() + '/dist/services/mailer.service');

const { SendingError } = require(process.cwd() + '/dist/classes/sending-error.class');
const { SendingResponse } = require(process.cwd() + '/dist/classes/sending-response.class');

// TODO: Globally, go with more fine regarding each transporter

describe('Transporters', () => {

  transporters.forEach((transporter) => {

    describe(transporter, () => {

      it(`${transporter} should exposes ITransporter interface members`, (done) => {
        const mailer = new Mailer(Container.transporters[transporter]);
        expect(mailer.transporter.build).to.be.a('function');
        expect(mailer.transporter.address).to.be.a('function');
        expect(mailer.transporter.addresses).to.be.a('function');
        expect(mailer.transporter.response).to.be.a('function');
        expect(mailer.transporter.error).to.be.a('function');
        expect(mailer.transporter.send).to.be.a('function');
        done();
      });

      it(`${transporter}::build should returns an object`, () => {
        const mailer = new Mailer(Container.transporters[transporter]);
        const event = 'user.welcome';
        const payload = requestPayload( transporter.lastIndexOf('smtp') !== -1 ? 'smtp' : 'api', transporter );
        mailer.setAddresses(payload);
        mailer.setRenderEngine(event, payload);
        const result = mailer.transporter.build( mailer.getMail('user.welcome', requestPayload() ))
        expect(result).to.be.an('object');
      });

      if (['mailgun-api', 'postmark-api', 'mandrill-api', 'hosting-smtp'].includes(transporter)) {
        it(`${transporter}::address should returns a string`, () => {
          const mailer = new Mailer(Container.transporters[transporter]);
          const event = 'user.welcome';
          const payload = requestPayload( transporter.lastIndexOf('smtp') !== -1 ? 'smtp' : 'api', transporter );
          mailer.setAddresses(payload);
          mailer.setRenderEngine(event, payload);
          const result = mailer.transporter.address(payload.meta.from);
          expect(result).to.be.a('string');
        });
      } else {
        it(`${transporter}::address should returns an object`, () => {
          const mailer = new Mailer(Container.transporters[transporter]);
          const event = 'user.welcome';
          const payload = requestPayload( transporter.lastIndexOf('smtp') !== -1 ? 'smtp' : 'api', transporter );
          mailer.setAddresses(payload);
          mailer.setRenderEngine(event, payload);
          const result = mailer.transporter.address(payload.meta.from);
          expect(result).to.be.an('object');
        });
      }

      if (['brevo-api', 'mailgun-api', 'postmark-api', 'mandrill-api', 'hosting-smtp'].includes(transporter)) {
        it(`${transporter}::addresses should returns an array of strings`, () => {
          const mailer = new Mailer(Container.transporters[transporter]);
          const event = 'user.welcome';
          const payload = requestPayload( transporter.lastIndexOf('smtp') !== -1 ? 'smtp' : 'api', transporter );
          mailer.setAddresses(payload);
          mailer.setRenderEngine(event, payload);
          const result = mailer.transporter.addresses(payload.meta.to);
          expect(result).to.be.an('array');
          result.forEach(entry => expect(entry).to.be.a('string'))
        });
      } else {
        it(`${transporter}::addresses should returns an array of objects`, () => {
          const mailer = new Mailer(Container.transporters[transporter]);
          const event = 'user.welcome';
          const payload = requestPayload( transporter.lastIndexOf('smtp') !== -1 ? 'smtp' : 'api', transporter );
          mailer.setAddresses(payload);
          mailer.setRenderEngine(event, payload);
          const result = mailer.transporter.addresses(payload.meta.to);
          expect(result).to.be.an('array');
          result.forEach(entry => expect(entry).to.be.an('object'))
        });
      }

      it(`${transporter}::response should returns a SendingResponse instance`, () => {
        const mailer = new Mailer(Container.transporters[transporter]);
        const result = mailer.transporter.response( responsePayload(transporter) )
        expect(result).to.be.instanceOf(SendingResponse);
      });

      it(`${transporter}::error should returns a SendingError instance`, () => {
        const mailer = new Mailer(Container.transporters[transporter]);
        const result = mailer.transporter.error( errorPayload(transporter) )
        expect(result).to.be.instanceOf(SendingError);
      });

      it(`${transporter}::send should call internally the sendMail method`, () => {
        const mailer = new Mailer(Container.transporters[transporter]);
        const stub = sinon.stub(mailer.transporter.transporter, 'sendMail').callsFake(() => Promise.resolve(new SendingResponse()));
        const event = 'user.welcome';
        const payload = requestPayload( transporter.lastIndexOf('smtp') !== -1 ? 'smtp' : 'api', transporter );
        payload.meta.to = [ { email: 'john.doe@test.com' } ];
        delete payload.content;
        mailer.setAddresses(payload);
        mailer.setRenderEngine(event, payload);
        mailer.transporter.send( mailer.transporter.build( mailer.getMail('user.welcome', payload) ) );
        stub.restore();
        sinon.assert.callCount(stub, 1);
      });
    });
  });
});