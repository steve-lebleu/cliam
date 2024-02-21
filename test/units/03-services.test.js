const sinon = require('sinon');
const { expect } = require('chai');

const { requestPayload } = require(process.cwd() + '/test/fixtures');

const { Container } = require(process.cwd() + '/dist/services/container.service');
const { Mailer } = require(process.cwd() + '/dist/services/mailer.service');
const { RenderEngine } = require(process.cwd() + '/dist/services/render-engine.service');

const { mailSchema } = require(process.cwd() + '/dist/validations/mail.validation');
const { SendingError } = require(process.cwd() + '/dist/classes/sending-error.class');
const { SendingResponse } = require(process.cwd() + '/dist/classes/sending-response.class');

describe('Services', () => {

  describe('Container', () => {

    it('as a singleton, Container class can\'t be instanciated', (done) => {
      try {
        new Container();
      } catch (e) {
        expect(e instanceof TypeError).to.be.true;
        expect(e.message).to.be.equals('Container is not a constructor');
        done();
      }
    });

    it('should load cliamrc file and expose validated client configuration', (done) => {
      expect(Container.configuration).to.be.not.null;
      done();
    });

    it('should instanciate and expose transporters', (done) => {
      expect(Container.transporters).to.be.not.null;
      Object.keys(Container.transporters).forEach(key => {
        expect(Container.transporters[key].configuration).to.be.not.null;
        expect(Container.transporters[key].transporter).to.be.not.null;
      });
      done();
    });
  });

  describe('Mailer', () => {

    it('should be coupled to a transporter instance', (done) => {
      const mailer = new Mailer(Container.transporters['hosting-smtp']);
      expect(mailer.transporter).to.be.not.null;
      done();
    });

    describe('::setRenderEngine', () => {
      it('should set the renderEngine as \'self\' when mode is SMTP and payload has a content', (done) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        mailer.setRenderEngine('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('self');
        done();
      });

      it('should set the renderEngine as \'default\' when mode is SMTP and payload has no content', (done) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        delete payload.content;
        mailer.setRenderEngine('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('default');
        done();
      });

      it('should set the renderEngine as \'provider\' when mode is API and a template mapping can be found in the options', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        delete payload.content;
        mailer.setRenderEngine('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('provider');
        done();
      });

      it('should set the renderEngine as \'self\' when mode is API, a template mapping cannot be found in the options and payload has a content', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        mailer.setRenderEngine('user.notfound', payload);
        expect(mailer.renderEngine).to.be.equals('self');
        done();
      });

      it('should set the renderEngine as \'default\' when mode is API, a template mapping cannot be found in the options and payload has no content', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        delete payload.content;
        mailer.setRenderEngine('user.notfound', payload);
        expect(mailer.renderEngine).to.be.equals('default');
        done();
      });

      it('should call ::getTemplateId to determine if there is a template mapping in the transporter options', (done) => {
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
      it('should set from address with the cliamrc one if not present in on fly payload', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        delete payload.meta.from;
        expect(payload.meta.from).to.be.undefined;
        mailer.setAddresses(payload);
        expect(payload.meta.from).to.be.equals(Container.configuration.variables.addresses.from);
        done();
      });

      it('should set from address with the current payload one', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        const from = payload.meta.from;
        mailer.setAddresses(payload);
        expect(payload.meta.from).to.be.equals(from);
        done();
      });

      it('should set reply-to address with the cliamrc one if not present in on fly payload', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        delete payload.meta.replyTo;
        expect(payload.meta.replyTo).to.be.undefined;
        mailer.setAddresses(payload);
        expect(payload.meta.replyTo).to.be.equals(Container.configuration.variables.addresses.replyTo);
        done();
      });

      it('should set reply-to address with the current payload one', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        const replyTo = payload.meta.replyTo;
        mailer.setAddresses(payload);
        expect(payload.meta.replyTo).to.be.equals(replyTo);
        done();
      });
    });

    describe('::getMail', () => {
      it('should throws an error when trying to use cliam template for a non supported event', (done) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        delete payload.content;
        try {
          mailer.setRenderEngine('event.notfound', payload);
          mailer.getMail('event.notfound', payload);
        } catch(e) {
          expect(e).to.be.instanceOf(Error);
          done();
        }
      });

      it('should returns object with payload, templateId, renderEngine, body and origin properties', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = requestPayload();
        const result = mailer.getMail('user.welcome', payload);
        expect(result).to.haveOwnProperty('payload');
        expect(result).to.haveOwnProperty('templateId');
        expect(result).to.haveOwnProperty('renderEngine');
        expect(result).to.haveOwnProperty('body');
        expect(result).to.haveOwnProperty('origin');
        done();
      });

      it('should set text value as body when the render engine is \'self\'', (done) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        mailer.setRenderEngine('user.welcome', payload);
        const result = mailer.getMail('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('self');
        expect(result.body).to.be.not.null;
        done();
      });

      it('should set text value as body when the render engine is \'default\'', (done) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        delete payload.content;
        mailer.setRenderEngine('user.welcome', payload);
        const result = mailer.getMail('user.welcome', payload);
        expect(mailer.renderEngine).to.be.equals('default');
        expect(result.body).to.be.not.null;
        done();
      });

      it('should set null as body when the render engine is \'provider\'', (done) => {
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
    
    describe('::getOrigin', () => {
      it('should return the origin value from Container.configuration.variables.domain', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const origin = mailer.getOrigin();
        expect(origin).to.be.equals(Container.configuration.variables.domain);
        done();
      });
    });

    describe('::getTemplateId', () => {
      it('should returns null', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const templateId = mailer.getTemplateId('user.notfound');
        expect(templateId).to.be.null;
        done();
      });

      it('should returns the mappad value from the transporter configuration', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const templateId = mailer.getTemplateId('user.welcome');
        expect(templateId).to.be.equals(mailer.transporter.configuration.options.templates['user.welcome']);
        done();
      });
    });

    describe('::hasPlainText', () => {
      it('should returns false when payload does no contains a buffer', (done) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        payload.content = [];
        const result = mailer.hasPlainText(payload.content);
        expect(result).to.be.false;
        done();
      });

      it('should returns false when payload do not contains a buffer with a value nor a type text/plain', (done) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        payload.content = [];
        payload.content.push({ type: 'text/html', value: 'avalue' });
        const result = mailer.hasPlainText(payload.content);
        expect(result).to.be.false;
        done();
      });

      it('should returns true when payload contains a buffer with a value and a type text/plain', (done) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        const payload = requestPayload();
        payload.content.push({ type: 'text/plain', value: 'avalue' });
        const result = mailer.hasPlainText(payload.content);
        expect(result).to.be.true;
        done();
      });
    });

    describe('::getCompiled', () => {

      it('should returns text and html from the current payload when the template is rendered by the client (self) and has text and html defined', (done) => {
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

      it('should returns html from the current payload and generates text part from render engine when the template is rendered by the client (self) and exposes only HTML buffer', (done) => {
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

      it('should compile and returns templates when the template is rendered by the client (provider)', (done) => {
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
      it('should be exposed a public method', (done) => {
        const mailer = new Mailer(Container.transporters['hosting-smtp']);
        expect(mailer).to.haveOwnProperty('send');
        expect(mailer.send).to.be.a('function');
        done();
      });

      it('should set the render engine before to send email', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const setRenderEngineSpy = sinon.spy(mailer, 'setRenderEngine');
        const payload = JSON.parse( JSON.stringify( requestPayload() ) );
        delete payload.content;
        mailer.send('user.welcome', payload);
        setRenderEngineSpy.restore();
        sinon.assert.callCount(setRenderEngineSpy, 1);
        done();
      });
  
      it('should set the the addresses before to send email', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const setAddressesSpy = sinon.spy(mailer, 'setAddresses');
        const payload = JSON.parse( JSON.stringify( requestPayload() ) );
        mailer.send('user.welcome', payload);
        setAddressesSpy.restore();
        sinon.assert.callCount(setAddressesSpy, 1);
        done();
      });
  
      it('should validate the payload before to send email', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const validateSpy = sinon.spy(mailSchema, 'validate');
        const payload = JSON.parse( JSON.stringify( requestPayload() ) );
        mailer.send('user.welcome', payload);
        validateSpy.restore();
        sinon.assert.callCount(validateSpy, 1);
        done();
      });

      it('should returns an error if the payload is not valid', async () => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = JSON.parse( JSON.stringify( requestPayload() ) );
        payload.meta.to = undefined;
        const result = await mailer.send('user.welcome', payload);
        expect(result).to.be.instanceOf(SendingError);
      });

      it('should call the transporter.build method', (done) => {
        const payload = JSON.parse( JSON.stringify( requestPayload('provider', 'postmark-api') ) );
        delete payload.content;
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const buildSpy = sinon.spy(mailer.transporter, 'build');
        mailer.send('user.welcome', payload);
        buildSpy.restore();
        sinon.assert.callCount(buildSpy, 1);
        done();
      });

      it('should call the transporter.send method', (done) => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const sendSpy = sinon.spy(mailer.transporter, 'send');
        const payload = JSON.parse( JSON.stringify( requestPayload('provider', 'postmark-api') ) );
        delete payload.content;
        mailer.send('user.welcome', payload);
        sendSpy.restore();
        sinon.assert.callCount(sendSpy, 1);
        done();
      });

      it('should success with a Promise<SendingResponse>', async () => {
        const payload = JSON.parse( JSON.stringify( requestPayload('provider', 'postmark-api') ) );
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const sendStub = sinon.stub(mailer.transporter, 'send').callsFake(() => Promise.resolve(new SendingResponse()));
        payload.meta.to = [ { email: 'john.doe@test.com' } ];
        delete payload.content;
        const result = await mailer.send('user.welcome', payload);
        expect(result).to.be.instanceOf(SendingResponse);
        sendStub.restore();
      });

      it('should fails with a Promise<SendingError>', async () => {
        const mailer = new Mailer(Container.transporters['postmark-api']);
        const payload = JSON.parse( JSON.stringify( requestPayload('provider', 'postmark-api') ) );
        payload.meta.to = undefined;
        const result = await mailer.send('user.welcome', payload);
        expect(result).to.be.instanceOf(SendingError);
      });
    });
  });
  
  describe('RenderEngine', () => {

    describe('::getBanner', () => {

      it('should give the banner related to the current event', (done) => {
        const result = RenderEngine.getBanner('user.welcome');
        expect(result).to.be.eqls('https://cdn.konfer.be/images/cliam/banners/welcome.png');
        done()
      });

      it('should give the default banner when current event has no related template', (done) => {
        const result = RenderEngine.getBanner('event.notfound');
        expect(result).to.be.equals('https://cdn.konfer.be/images/cliam/default/default-thumbnail.jpg');
        done();
      });

    });

    describe('::getSegment', () => {
      it('should returns the default segment related to the current event', (done) => {
        const result = RenderEngine.getSegment('user.welcome');
        expect(result).to.be.equals('default');
        done();
      });

      it('should returns the passed segment', (done) => {
        const result = RenderEngine.getSegment('event.notfound');
        expect(result).to.be.equals('event.notfound');
        done();
      });
    });

    describe('::customize', () => {
      it('should replace colors values in current templates', (done) => {
        const result = RenderEngine.customize('<p color="#111111">customize</p>');
        expect(result).to.contains('5bd1d7');
        expect(result).to.not.contains('111111');
        done();
      });
    });

    describe('::textify', () => {
      it('should returns sanitized string', (done) => {
        const result = RenderEngine.textify('<p color="#111111">customize</p>');
        expect(result).to.equals('customize');
        done();
      });
    });

    describe('::compile', () => {
      it('should returns an object with text and html properties', (done) => {
        const payload = requestPayload();
        const result = RenderEngine.compile('user.welcome', payload.data);
        expect(result).to.haveOwnProperty('text');
        expect(result).to.haveOwnProperty('html');
        done();
      });
    });
  });
});