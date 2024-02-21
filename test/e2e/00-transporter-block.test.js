const { expect } = require('chai');
const { writeFileSync } = require('fs');

const { cliamrc, requestPayload } = require(process.cwd() + '/test/fixtures');

exports.E2ETransporterBlock = (provider) => {

  let Cliam, mockery, nodemailerMock;

  describe(`[${provider}]`, () => {

    beforeEach( () => {
      mockery = require('mockery');
      nodemailerMock = require('nodemailer-mock');
      
      mockery.enable({
        warnOnUnregistered: false,
      });
      
      /* Once mocked, any code that calls require('nodemailer') will get our nodemailerMock */
      mockery.registerMock('nodemailer', nodemailerMock)

      writeFileSync(`${process.cwd()}/.cliamrc.json`, JSON.stringify(cliamrc, null, 2), { encoding: 'utf-8' });

      /* IMPORTANT Make sure anything that uses nodemailer is loaded here, after it is mocked just above... */
      Cliam = require(process.cwd() + '/dist/classes/cliam.class').Cliam;
    });

    afterEach( () => {
      nodemailerMock.mock.reset();
      mockery.deregisterAll();
      mockery.disable()
    });

    describe('Default transactions', () => {

      [ 
        'default',
        'event.subscribe',
        'event.unsubscribe',
        'event.updated',
        'user.bye',
        'user.confirm',
        'user.contact',
        'user.invite',
        'user.progress',
        'user.survey',
        'user.welcome',
        'order.invoice',
        'order.progress',
        'order.shipped',
        'password.request',
        'password.updated'
      ].forEach( (event, idx) => {

        if (idx === 0) {

          describe('Compilation by web API provider', async () => {

            it(`202 - ${event}`, async() => {
              const params = JSON.parse( JSON.stringify( requestPayload('provider', `${provider}-api`) ) );
              delete params.content;

              const response = await Cliam.mail(event, params);

              expect(response.statusCode).to.be.eqls(202);
            });

          });

          describe('Compilation by client', async () => {

            it(`202 - ${event}`, async() => {
            
              const params = JSON.parse( JSON.stringify( requestPayload('self', `${provider}-api`) ) );
              delete params.data;

              const response = await Cliam.mail(event, params);

              expect(response.statusCode).to.be.eqls(202);
            });

          });
    
        
          it.skip(`400 - ${event}`, async() => {
        
          })

        }

        it(`202 - ${event}`, async() => {
          const params = JSON.parse( JSON.stringify( requestPayload('provider', `${provider}-api`) ) );
          delete params.content;

          const response = await Cliam.mail(event, params);

          expect(response.statusCode).to.be.eqls(202);
        });

      });

    });

  });

}