import { describe, it } from 'bun:test';
import sinon from 'sinon';
import { expect } from 'chai';

import { requestPayload, responsePayload, errorPayload, transporters } from './fixtures/index';
import { Container } from '../src/services/container.service';
import { Mailer } from '../src/services/mailer.service';
import { TransporterFactory } from '../src/transporters/transporter.factory';
import { HttpTransporter } from '../src/transporters/http.transporter';
import { SendingError } from '../src/core/sending-error.class';
import { SendingResponse } from '../src/core/sending-response.class';

const HTTP_TRANSPORTERS = ['brevo-api', 'mailersend-api', 'mailgun-api', 'mailjet-api', 'mandrill-api', 'postmark-api', 'sendgrid-api', 'sparkpost-api'];

describe('Transporters', () => {

  transporters.forEach((transporter) => {

    describe(transporter, () => {

      it("transporterFactory can't be instanciated", () => {
        try {
          new (TransporterFactory as any)();
        } catch (e: any) {
          expect(e instanceof TypeError).to.be.true;
          expect(e.message).to.be.equals('TransporterFactory is not a constructor');
        }
      });

      it(`${transporter} should exposes ITransporter interface members`, (done: any) => {
        const mailer = new Mailer(Container.transporters[transporter]);
        expect(mailer.transporter.build).to.be.a('function');
        expect(mailer.transporter.address).to.be.a('function');
        expect(mailer.transporter.addresses).to.be.a('function');
        expect(mailer.transporter.response).to.be.a('function');
        expect(mailer.transporter.error).to.be.a('function');
        expect(mailer.transporter.send).to.be.a('function');
        done();
      });

      it(`${transporter}::build should give the output using self render engine`, () => {
        const mailer = new Mailer(Container.transporters[transporter]);
        const payload = requestPayload(transporter);
        mailer.setAddresses(payload);
        mailer.setRenderEngine('user.welcome', payload);
        const result = mailer.transporter.build(mailer.getMail('user.welcome', payload));
        expect(result).to.be.an('object');
        expect(mailer.renderEngine).to.be.equals('self');
      });

      it(`${transporter}::build should give the output using cliam render engine`, () => {
        const mailer = new Mailer(Container.transporters[transporter]);
        const stub = sinon.stub(mailer, 'getTemplateId').callsFake(() => null);
        const payload = requestPayload(transporter);
        delete payload.content;
        mailer.setAddresses(payload);
        mailer.setRenderEngine('user.welcome', payload);
        const result = mailer.transporter.build(mailer.getMail('user.welcome', payload));
        expect(result).to.be.an('object');
        expect(mailer.renderEngine).to.be.equals('cliam');
        stub.restore();
      });

      if (!['hosting-smtp'].includes(transporter)) {
        it(`${transporter}::build should give the output using provider render engine`, () => {
          const mailer = new Mailer(Container.transporters[transporter]);
          const payload = requestPayload(transporter);
          delete payload.content;
          mailer.setAddresses(payload);
          mailer.setRenderEngine('user.welcome', payload);
          const result = mailer.transporter.build(mailer.getMail('user.welcome', payload));
          expect(result).to.be.an('object');
          expect(mailer.renderEngine).to.be.equals('provider');
        });
      }

      if (['mailgun-api', 'postmark-api', 'mandrill-api', 'hosting-smtp'].includes(transporter)) {
        it(`${transporter}::address should returns a string`, () => {
          const mailer = new Mailer(Container.transporters[transporter]);
          const payload = requestPayload(transporter);
          mailer.setAddresses(payload);
          mailer.setRenderEngine('user.welcome', payload);
          const result = mailer.transporter.address(payload.meta.from);
          expect(result).to.be.a('string');
        });
      } else {
        it(`${transporter}::address should returns an object`, () => {
          const mailer = new Mailer(Container.transporters[transporter]);
          const payload = requestPayload(transporter);
          mailer.setAddresses(payload);
          mailer.setRenderEngine('user.welcome', payload);
          const result = mailer.transporter.address(payload.meta.from);
          expect(result).to.be.an('object');
        });
      }

      if (['mailgun-api', 'postmark-api', 'mandrill-api', 'hosting-smtp'].includes(transporter)) {
        it(`${transporter}::addresses should returns an array of strings`, () => {
          const mailer = new Mailer(Container.transporters[transporter]);
          const payload = requestPayload(transporter);
          mailer.setAddresses(payload);
          mailer.setRenderEngine('user.welcome', payload);
          const result = mailer.transporter.addresses(payload.meta.to);
          expect(result).to.be.an('array');
          result.forEach((entry: any) => expect(entry).to.be.a('string'));
        });
      } else {
        it(`${transporter}::addresses should returns an array of objects`, () => {
          const mailer = new Mailer(Container.transporters[transporter]);
          const payload = requestPayload(transporter);
          mailer.setAddresses(payload);
          mailer.setRenderEngine('user.welcome', payload);
          const result = mailer.transporter.addresses(payload.meta.to);
          expect(result).to.be.an('array');
          result.forEach((entry: any) => expect(entry).to.be.an('object'));
        });
      }

      it(`${transporter}::response should returns a SendingResponse instance`, () => {
        const mailer = new Mailer(Container.transporters[transporter]);
        const result = mailer.transporter.response(responsePayload(transporter));
        expect(result).to.be.instanceOf(SendingResponse);
      });

      it(`${transporter}::error should returns a SendingError instance`, () => {
        const mailer = new Mailer(Container.transporters[transporter]);
        const result = mailer.transporter.error(errorPayload(transporter));
        expect(result).to.be.instanceOf(SendingError);
      });

      it(`${transporter}::send should call internally the send method`, () => {
        const mailer = new Mailer(Container.transporters[transporter]);
        const payload = requestPayload(transporter);
        payload.meta.to = [{ email: 'john.doe@test.com' }];
        delete payload.content;
        mailer.setAddresses(payload);
        mailer.setRenderEngine('user.welcome', payload);

        let stub: sinon.SinonStub;
        if (HTTP_TRANSPORTERS.includes(transporter)) {
          const method = transporter === 'mailgun-api' ? 'postForm' : 'post';
          stub = sinon.stub((mailer.transporter as unknown as HttpTransporter).httpClient, method).resolves({ status: 202, headers: {}, data: {} });
        } else {
          stub = sinon.stub(mailer.transporter.transporter, 'sendMail').callsFake(() => Promise.resolve(new SendingResponse()));
        }

        mailer.transporter.send(mailer.transporter.build(mailer.getMail('user.welcome', payload)));
        stub.restore();
        sinon.assert.callCount(stub, 1);
      });
    });
  });
});
