import { describe, it, beforeAll } from 'bun:test';
import sinon from 'sinon';
import { expect } from 'chai';

import { requestPayload, transporters } from './fixtures/index';
import { EVENT } from '../src/types/enums/event.enum';
import { SendingResponse } from '../src/core/sending-response.class';
import { Cliam } from '../src/index';

describe('Cliam', () => {
  const stubs: Record<string, any> = {};

  beforeAll(() => {
    transporters.forEach(transporterId => {
      stubs[transporterId] = sinon.stub((Cliam as any).mailers[transporterId].transporter, 'send').returns(Promise.resolve(new SendingResponse().set('statusCode', 202)));
    });
  });

  it('Cliam.mail() should throw when called before configure()', async () => {
    const originalMailers = (Cliam as any).mailers;
    (Cliam as any).mailers = {};
    try {
      await Cliam.mail('user.welcome', {} as any);
    } catch (e: any) {
      expect(e).to.be.instanceOf(Error);
      expect(e.message).to.include('not configured');
    } finally {
      (Cliam as any).mailers = originalMailers;
    }
  });

  transporters.forEach(transporter => {

    describe(`Cliam::mail::${transporter}`, () => {

      describe('RenderEngine::cliam', () => {
        Object.keys(EVENT).forEach(event => {
          it(event, async () => {
            const payload = JSON.parse(JSON.stringify(requestPayload(transporter)));
            const stub = sinon.stub((Cliam as any).mailers[transporter], 'getTemplateId').returns(null);
            delete payload.content;
            const response = await Cliam.mail(event, payload);
            expect((response as any).statusCode).to.be.eqls(202);
            stub.restore();
          });
        });
      });

      describe('RenderEngine::self', () => {
        Object.keys(EVENT).forEach(event => {
          it(event, async () => {
            const payload = JSON.parse(JSON.stringify(requestPayload(transporter)));
            delete payload.data;
            const response = await Cliam.mail(event, payload);
            expect((response as any).statusCode).to.be.eqls(202);
          });
        });
      });

      describe('RenderEngine::provider', () => {
        if (!['hosting-smtp'].includes(transporter)) {
          Object.keys(EVENT).forEach(event => {
            it(event, async () => {
              const payload = JSON.parse(JSON.stringify(requestPayload(transporter)));
              delete payload.content;
              const response = await Cliam.mail(event, payload);
              expect((response as any).statusCode).to.be.eqls(202);
            });
          });
        }
      });
    });
  });
});
