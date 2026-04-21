import { describe, it, afterEach } from 'bun:test';
import sinon from 'sinon';
import { expect } from 'chai';

import { requestPayload, cliamrc } from './fixtures/index';
import { Cliam } from '../src/core/cliam.class';
import { Container } from '../src/services/container.service';
import { Mailer } from '../src/services/mailer.service';
import { RenderEngine } from '../src/services/render-engine.service';
import { mailSchema } from '../src/validations/mail.validation';
import { SendingError } from '../src/core/sending-error.class';
import { SendingResponse } from '../src/core/sending-response.class';

describe('Services', () => {
  afterEach(() => sinon.restore());

  describe('Container', () => {
    it('should expose a validated client configuration after Cliam.configure()', (done: any) => {
      expect(Container.configuration).to.be.not.null;
      done();
    });

    it('should expose instantiated transporters after Cliam.configure()', (done: any) => {
      expect(Container.transporters).to.be.not.null;
      Object.keys(Container.transporters).forEach(key => {
        const t = Container.transporters[key] as any;
        expect(t.configuration).to.be.not.null;
        expect(key === 'hosting-smtp' ? t.transport : t.httpClient).to.be.not.null;
      });
      done();
    });

    it('Cliam.configure() should initialise Container from a plain config object', (done: any) => {
      Cliam.configure(cliamrc);
      expect(Container.configuration).to.be.not.null;
      expect(Container.transporters).to.be.not.null;
      done();
    });
  });

  describe('Mailer', () => {

    it('should be coupled to a transporter instance', (done: any) => {
      const mailer = new Mailer(Container.transporters['hosting-smtp']);
      expect(mailer.transporter).to.be.not.null;
      done();
    });

    describe('::setRenderEngine', () => {

      it("should infer 'self' when content is present (SMTP)", (done: any) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        mailer.setRenderEngine('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('self');
        done();
      });

      it("should infer 'cliam' when content is absent and no provider (SMTP)", (done: any) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        delete payload.content;
        mailer.setRenderEngine('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('cliam');
        done();
      });

      it("should infer 'self' when content is present (web API)", (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        mailer.setRenderEngine('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('self');
        done();
      });

      it("should infer 'provider' when content is absent and a template mapping exists in the configuration", (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        delete payload.content;
        mailer.setRenderEngine('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('provider');
        done();
      });

      it("should infer 'self' when content is present even if a template mapping exists", (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        mailer.setRenderEngine('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('self');
        done();
      });

      it("should infer 'cliam' when content is absent and no template mapping exists", (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        delete payload.content;
        mailer.setRenderEngine('user.notfound', payload);
        expect(mailer.renderEngine).to.be.equals('cliam');
        done();
      });

      it('should call ::getTemplateId to check for a template mapping when content is absent', (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const spy = sinon.spy(mailer, 'getTemplateId');
        const payload = requestPayload();
        delete payload.content;
        mailer.setRenderEngine('user.welcome', payload);
        sinon.assert.callCount(spy, 1);
        spy.restore();
        done();
      });
    });

    describe('::setAddresses', () => {
      it('should set from address with the cliamrc one if not present in on fly payload', (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        delete payload.meta.from;
        expect(payload.meta.from).to.be.undefined;
        mailer.setAddresses(payload);
        expect(payload.meta.from).to.be.equals(Container.configuration.variables.addresses.from);
        done();
      });

      it('should set from address with the current payload one', (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        const from = payload.meta.from;
        mailer.setAddresses(payload);
        expect(payload.meta.from).to.be.equals(from);
        done();
      });

      it('should set reply-to address with the cliamrc one if not present in on fly payload', (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        delete payload.meta.replyTo;
        expect(payload.meta.replyTo).to.be.undefined;
        mailer.setAddresses(payload);
        expect(payload.meta.replyTo).to.be.equals(Container.configuration.variables.addresses.replyTo);
        done();
      });

      it('should set reply-to address with the current payload one', (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        const replyTo = payload.meta.replyTo;
        mailer.setAddresses(payload);
        expect(payload.meta.replyTo).to.be.equals(replyTo);
        done();
      });
    });

    describe('::getMail', () => {

      it('should throws an error when trying to use cliam template for a non supported event', (done: any) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        delete payload.content;
        try {
          mailer.setRenderEngine('event.notfound', payload);
          mailer.getMail('event.notfound', payload);
        } catch (e) {
          expect(e).to.be.instanceOf(Error);
          done();
        }
      });

      it('should returns object with payload, templateId, renderEngine, and body properties', (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        const result = mailer.getMail('user.welcome', payload);
        expect(result).to.haveOwnProperty('payload');
        expect(result).to.haveOwnProperty('templateId');
        expect(result).to.haveOwnProperty('renderEngine');
        expect(result).to.haveOwnProperty('body');
        done();
      });

      it("should set text value as body when the render engine is 'self'", (done: any) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        mailer.setRenderEngine('user.welcome', payload);
        const result = mailer.getMail('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('self');
        expect(result.body).to.be.not.null;
        done();
      });

      it("should set text value as body when the render engine is 'cliam'", (done: any) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        delete payload.content;
        mailer.setRenderEngine('user.welcome', payload);
        const result = mailer.getMail('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('cliam');
        expect(result.body).to.be.not.null;
        done();
      });

      it("should set null as body when the render engine is 'provider'", (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        delete payload.content;
        mailer.setRenderEngine('user.welcome', payload);
        const result = mailer.getMail('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('provider');
        expect(result.body).to.be.null;
        done();
      });
    });

    describe('::getTemplateId', () => {
      it('should returns null', (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const templateId = mailer.getTemplateId('user.notfound');
        expect(templateId).to.be.null;
        done();
      });

      it('should returns the mappad value from the transporter configuration', (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const templateId = mailer.getTemplateId('user.welcome');
        expect(templateId).to.be.equals(mailer.transporter.configuration.templates['user.welcome']);
        done();
      });
    });

    describe('::hasPlainText', () => {

      it('should returns false when payload does no contains a buffer', (done: any) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        payload.content = [];
        const result = mailer.hasPlainText(payload.content);
        expect(result).to.be.false;
        done();
      });

      it('should returns false when payload do not contains a buffer with a value nor a type text/plain', (done: any) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        payload.content = [];
        payload.content.push({ type: 'text/html', value: 'avalue' });
        const result = mailer.hasPlainText(payload.content);
        expect(result).to.be.false;
        done();
      });

      it('should returns true when payload contains a buffer with a value and a type text/plain', (done: any) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        payload.content.push({ type: 'text/plain', value: 'avalue' });
        const result = mailer.hasPlainText(payload.content);
        expect(result).to.be.true;
        done();
      });
    });

    describe('::getCompiled', () => {

      it("should returns text and html from the current payload when the template is rendered by the client (self) and has text and html defined", (done: any) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        payload.content = [];
        payload.content.push({ type: 'text/plain', value: 'avalue' }, { type: 'text/html', value: '<p>anothervalue</p>' });
        mailer.setRenderEngine('user.welcome', payload);
        const result = mailer.getCompiled('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('self');
        expect(result.text).to.be.equals('avalue');
        expect(result.html).to.be.equals('<p>anothervalue</p>');
        done();
      });

      it("should returns html from the current payload and generates text part from render engine when the template is rendered by the client (self) and exposes only HTML buffer", (done: any) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        payload.content = [];
        payload.content.push({ type: 'text/html', value: '<p>anothervalue</p>' });
        mailer.setRenderEngine('user.welcome', payload);
        const result = mailer.getCompiled('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('self');
        expect(result.text).to.be.equals('anothervalue');
        expect(result.html).to.be.equals('<p>anothervalue</p>');
        done();
      });

      it("should compile and returns templates when the template is rendered by the client (provider)", (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        delete payload.content;
        mailer.setRenderEngine('user.welcome', payload);
        const result = mailer.getCompiled('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('provider');
        expect(result.text).to.contains('contact@john-doe.com');
        expect(result.html).to.contains('contact@john-doe.com');
        done();
      });
    });

    describe('::send', () => {

      it('should be exposed a public method', (done: any) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        expect(mailer).to.haveOwnProperty('send');
        expect(mailer.send).to.be.a('function');
        done();
      });

      it('should set the render engine before to send email', (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const setRenderEngineSpy = sinon.spy(mailer, 'setRenderEngine');
        const sendStub = sinon.stub(mailer.transporter, 'send').resolves(new SendingResponse());
        const payload = JSON.parse(JSON.stringify(requestPayload()));
        delete payload.content;
        mailer.send('user.welcome', payload);
        setRenderEngineSpy.restore();
        sendStub.restore();
        sinon.assert.callCount(setRenderEngineSpy, 1);
        done();
      });

      it('should set the the addresses before to send email', (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const setAddressesSpy = sinon.spy(mailer, 'setAddresses');
        const sendStub = sinon.stub(mailer.transporter, 'send').resolves(new SendingResponse());
        const payload = JSON.parse(JSON.stringify(requestPayload()));
        mailer.send('user.welcome', payload);
        setAddressesSpy.restore();
        sendStub.restore();
        sinon.assert.callCount(setAddressesSpy, 1);
        done();
      });

      it('should validate the payload before to send email', (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const validateSpy = sinon.spy(mailSchema, 'validate');
        const payload = JSON.parse(JSON.stringify(requestPayload()));
        mailer.send('user.welcome', payload);
        validateSpy.restore();
        sinon.assert.callCount(validateSpy, 1);
        done();
      });

      it('should returns an error if the payload is not valid', async () => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = JSON.parse(JSON.stringify(requestPayload()));
        payload.meta.to = undefined;
        const result = await mailer.send('user.welcome', payload);
        expect(result).to.be.instanceOf(SendingError);
      });

      it('should call the transporter.build method', (done: any) => {
        const payload = JSON.parse(JSON.stringify(requestPayload('postmark-api')));
        delete payload.content;
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const buildSpy = sinon.spy(mailer.transporter, 'build');
        const sendStub = sinon.stub(mailer.transporter, 'send').resolves(new SendingResponse());
        mailer.send('user.welcome', payload);
        buildSpy.restore();
        sendStub.restore();
        sinon.assert.callCount(buildSpy, 1);
        done();
      });

      it('should call the transporter.send method', (done: any) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const sendStub = sinon.stub(mailer.transporter, 'send').resolves(new SendingResponse());
        const payload = JSON.parse(JSON.stringify(requestPayload('postmark-api')));
        delete payload.content;
        mailer.send('user.welcome', payload);
        sendStub.restore();
        sinon.assert.callCount(sendStub, 1);
        done();
      });

      it('should success with a Promise<SendingResponse>', async () => {
        const payload = JSON.parse(JSON.stringify(requestPayload('postmark-api')));
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const sendStub = sinon.stub(mailer.transporter, 'send').callsFake(() => Promise.resolve(new SendingResponse()));
        payload.meta.to = [{ email: 'john.doe@test.com' }];
        delete payload.content;
        const result = await mailer.send('user.welcome', payload);
        expect(result).to.be.instanceOf(SendingResponse);
        sendStub.restore();
      });

      it('should fails with a Promise<SendingError>', async () => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = JSON.parse(JSON.stringify(requestPayload('postmark-api')));
        payload.meta.to = undefined;
        const result = await mailer.send('user.welcome', payload);
        expect(result).to.be.instanceOf(SendingError);
      });
    });
  });

  describe('RenderEngine', () => {

    describe('::getBanner', () => {

      it('should give the banner related to the current event', (done: any) => {
        const result = (RenderEngine as any).getBanner('user.welcome');
        expect(result).to.be.eqls('https://cdn.konfer.be/images/cliam/banners/welcome.png');
        done();
      });

      it('should give the default banner when current event has no related template', (done: any) => {
        const result = (RenderEngine as any).getBanner('event.notfound');
        expect(result).to.be.equals('https://cdn.konfer.be/images/cliam/default/default-thumbnail.jpg');
        done();
      });
    });

    describe('::getSegment', () => {

      it('should returns the default segment related to the current event', (done: any) => {
        const result = (RenderEngine as any).getSegment('user.welcome');
        expect(result).to.be.equals('default');
        done();
      });

      it('should returns the passed segment', (done: any) => {
        const result = (RenderEngine as any).getSegment('event.notfound');
        expect(result).to.be.equals('event.notfound');
        done();
      });
    });

    describe('::getColors', () => {
      it('should return named color map with theme values', (done: any) => {
        const colors = (RenderEngine as any).getColors();
        expect(colors.primaryColor).to.equal('5bd1d7');
        expect(colors.secondaryColor).to.equal('348498');
        expect(colors.tertiaryColor).to.equal('004d61');
        expect(colors.quaternaryColor).to.equal('ff502f');
        expect(colors.primaryColorLight).to.be.a('string').and.not.equal('fffff1');
        expect(colors.primaryColorDark).to.be.a('string').and.not.equal('000001');
        done();
      });
    });

    describe('::textify', () => {
      it('should returns sanitized string', (done: any) => {
        const result = RenderEngine.textify('<p color="#111111">customize</p>');
        expect(result).to.equals('customize');
        done();
      });
    });

    describe('::compile', () => {
      it('should returns an object with text and html properties', (done: any) => {
        const payload = requestPayload();
        const result = RenderEngine.compile('user.welcome', payload.data);
        expect(result).to.haveOwnProperty('text');
        expect(result).to.haveOwnProperty('html');
        done();
      });
    });
  });
});
