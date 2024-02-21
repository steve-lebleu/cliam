const sinon = require('sinon');
const { expect } = require('chai');

const { cliamrc, requestPayload, responsePayload, transporters } = require(process.cwd() + '/test/fixtures');

const { EVENT } = require(process.cwd() + '/dist/types/enums/event.enum');

const { SendingResponse } = require(process.cwd() + '/dist/classes/sending-response.class');

const { Cliam } = require(process.cwd() + '/dist/index');

describe('Cliam', () => {
  let stubs = {};


  before(() => {
    // writeFileSync(`${process.cwd()}/.cliamrc.json`, JSON.stringify(cliamrc, null, 2), { encoding: 'utf-8' });
    transporters.forEach(transporterId => {
      stubs[transporterId] = sinon.stub(Cliam.mailers[transporterId].transporter, 'send').returns(Promise.resolve(new SendingResponse().set('statusCode', 202)));
    });
  });

  it('as a singleton, Cliam class can\'t be instanciated', () => {
    try {
      new Cliam();
    } catch (e) {
      expect(e instanceof TypeError).to.be.true;
      expect(e.message).to.be.equals('Cliam is not a constructor');
    }
  });
  
  transporters.forEach(transporter => {

    describe(`Cliam::mail::${transporter}`, () => {

      describe('RenderEngine::default', () => {
        Object.keys(EVENT).forEach((event, idx) => {
          it(event, async () => {
            const payload = JSON.parse( JSON.stringify( requestPayload('provider', transporter) ) );
            const stub = sinon.stub(Cliam.mailers[transporter], 'getTemplateId').returns(null);
            delete payload.content;
            const response = await Cliam.mail(event, payload);
            expect(response.statusCode).to.be.eqls(202);
            stub.restore()
          });
        });
      });

      describe('RenderEngine::self', () => {
        Object.keys(EVENT).forEach((event, idx) => {
          it(event, async () => {
            const payload = JSON.parse( JSON.stringify( requestPayload('provider', transporter) ) );
            delete payload.data;
            const response = await Cliam.mail(event, payload);
            expect(response.statusCode).to.be.eqls(202);
          });
        });
      });

      describe('RenderEngine::provider', () => {
        if (!['hosting-smtp'].includes(transporter)) {
          Object.keys(EVENT).forEach((event, idx) => {
            it(event, async () => {
              const payload = JSON.parse( JSON.stringify( requestPayload('provider', transporter) ) );
              delete payload.content;
              const response = await Cliam.mail(event, payload);
              expect(response.statusCode).to.be.eqls(202);
            });
          });
        }
      });
    });
  });
});