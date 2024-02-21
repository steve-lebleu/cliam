const sinon = require('sinon');
const { expect } = require('chai');

const { requestPayload } = require(process.cwd() + '/test/fixtures');

const { Container } = require(process.cwd() + '/dist/services/container.service');
const { Mailer } = require(process.cwd() + '/dist/services/mailer.service');
const { RenderEngine } = require(process.cwd() + '/dist/services/render-engine.service');

const { mailSchema } = require(process.cwd() + '/dist/validations/mail.validation');
const { SendingError } = require(process.cwd() + '/dist/classes/sending-error.class');
const { SendingResponse } = require(process.cwd() + '/dist/classes/sending-response.class');

const { Cliam } = require(process.cwd() + '/dist/classes/cliam.class');

describe('Cliam', () => {

  it('as a singleton, Cliam class can\'t be instanciated', (done) => {
    try {
      new Cliam();
    } catch (e) {
      expect(e instanceof TypeError).to.be.true;
      expect(e.message).to.be.equals('Container is not a constructor');
      done();
    }
  });
  
});