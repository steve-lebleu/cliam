const { expect } = require('chai');

describe('Services', () => {

  describe('Container', () => {

    xit('as a singleton, Container class can\'t be instanciated', (done) => {

    });

    xit('should expose a static get method', (done) => {

    });

    xit('should load the cliamrc file as global configuration reference', (done) => {

    });

    xit('should validate the cliamrc file', (done) => {

    });

    xit('should get an error when the cliamrc file is not found', (done) => {

    });

    xit('should get an error when the cliamrc file content is not found', (done) => {

    });

    xit('should instanciate transporters defined in cliamrc configuration', (done) => {

    });
  });

  describe('Mailer', () => {

    xit('should be coupled to a transporter instance', (done) => {

    });

    describe('::getRenderEngine', () => {
      xit('should set the renderEngine as \'self\' when mode is SMTP and payload has a content', (done) => {

      });

      xit('should set the renderEngine as \'default\' when mode is SMTP and payload has no content', (done) => {

      });

      xit('should never set the renderEngine as \'provider\' when mode is SMTP', (done) => {

      });

      xit('should set the renderEngine as \'provider\' when mode is API and a template mapping can be found in the options', (done) => {

      });

      xit('should set the renderEngine as \'self\' when mode is API, a template mapping cannot be found in the options and payload has a content', (done) => {

      });

      xit('should set the renderEngine as \'default\' when mode is API, a template mapping cannot be found in the options and payload has no content', (done) => {

      });

      xit('should call ::getTemplateId to determine if there is a template mapping in the transporter options', (done) => {

      });

      xit('should set the result on the renderEngine property', (done) => {

      });
    });

    describe('::setAddresses', () => {
      xit('should set from address with the cliamrc one', (done) => {

      });

      xit('should set from address with the current payload one', (done) => {

      });

      xit('should set reply-to address with the cliamrc one', (done) => {

      });

      xit('should set reply-to address with the current payload one', (done) => {

      });
    });

    describe('::getMail', () => {
      xit('should return an IMail object', (done) => {

      });

      xit('should set from address with the current payload one', (done) => {

      });

      xit('should set reply-to address with the cliamrc one', (done) => {

      });

      xit('should set reply-to address with the current payload one', (done) => {

      });
    });
    
    describe('::getOrigin', () => {
      xit('should return the origin value from Container.configuration.variables.domain', (done) => {

      });
    });

    describe('::getTemplateId', () => {
      xit('should returns null', (done) => {

      });

      xit('should returns the mappad value from the transporter configuration', (done) => {

      });
    });

    describe('::hasPlainText', () => {
      xit('should returns false when payload does no contains a buffer with a value and a type text/plain', (done) => {

      });

      xit('should returns true when payload contains a buffer with a value and a type text/plain', (done) => {

      });
    });

    describe('::getCompiled', () => {

      xit('should returns text and html from the current payload when the template is rendered by the client (self) and has text and html defined', (done) => {

      });

      xit('should returns html from the current payload and generates text part from render engine when the template is rendered by the client (self) and expose only HTML buffer', (done) => {
        // call textify
      });

      xit('should compile and returns templates when the template is rendered by the client (provider)', (done) => {
        //call compile
      });
    });

    describe('::send', () => {
      xit('should expose a public send method', (done) => {

      });

      xit('should set the render engine before to send email', (done) => {

      });
  
      xit('should set the the addresses to use before to send email', (done) => {
  
      });
  
      xit('should validate the payload before to send email', (done) => {
  
      });

      xit('should throws an error if the payload is not valid', (done) => {
  
      });

      xit('should call the transporter.build method', (done) => {
  
      });

      xit('should call the transporter.send method', (done) => {
  
      });

      xit('should success with a Promise<SendingResponse>', (done) => {
  
      });

      xit('should fails with a Promise<SendingResponse>', (done) => {
  
      });
    });
  });
  
  describe('RenderEngine', () => {

    describe('::getBanner', () => {

      xit('should give the banner related to the current event', (done) => {

      });

      xit('should give the default banner vhen current event has no related template', (done) => {

      });

    });

    describe('::getSegment', () => {
      xit('should give the segment related to the current event', (done) => {

      });
    });

    describe('::customize', () => {
      xit('should replace colors values in current templates', (done) => {

      });
    });

    describe('::textify', () => {
      xit('should returns sanitized string', (done) => {

      });
    });

    describe('::compile', () => {
      xit('should returns an object with text and html properties', (done) => {

      });
      xit('should returns plain text on text property', (done) => {

      });
      xit('should returns html on html property', (done) => {

      });
    });
  });
});