const { transporters } = require(process.cwd() + '/test/fixtures/');

describe('Transporters factory', () => {

  xit('can\'t be instanciated', (done) => {

  });

  xit('should expose a static get method', (done) => {

  });

  transporters.forEach((transporter) => {
    xit(`should returns a ${transporter} transporter instance`, (done) => {

    });
  });
});