const { expect } = require('chai');
const { writeFileSync } = require('fs');


const { cliamrc, apis, requestPayload } = require(process.cwd() + '/test/utils/fixtures');

module.exports = (provider) => {

  let Mailer, Container, mockery, nodemailerMock, rewiremock;

  describe(`[${provider}]`, () => {

    beforeEach( () => {

      mockery = require('mockery');

      nodemailerMock = require('nodemailer-mock');

      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
      });
      mockery.registerMock('nodemailer', nodemailerMock);

      const cfg = JSON.parse( JSON.stringify(cliamrc) );
      delete cfg.mode.smtp;
      cfg.mode.api = apis[provider];

      writeFileSync(`${process.cwd()}/.cliamrc.json`, JSON.stringify(cfg, null, 2), { encoding: 'utf-8' });

      Container = require(process.cwd() + '/dist/services/container.service').Container;
      Container.set();
  
      Mailer = require(process.cwd() + '/dist/services/mailer.service').Mailer;
      Mailer.transporter = Container.transporter;
  
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

          describe('Compilation by provider', async () => {

            it(`202 - ${event}`, async() => {

              const params = requestPayload();
              delete params.content;

              const response = await Mailer.send( event, params ).catch(e => { console.log('err', e);})
              
              expect(response.statusCode).to.be.eqls(202);

              if ( ![ 'mailjet'].includes(provider) ) {
                const sentMail = nodemailerMock.mock.getSentMail();
                expect(sentMail.length).to.be.eqls(1);
              }

            });

          });

          describe('Compilation by client', async () => {

            it(`202 - ${event}`, async() => {
            
              const params = requestPayload();
              delete params.data;

              const response = await Mailer.send( event, params )
              
              expect(response.statusCode).to.be.eqls(202);

              if ( ![ 'mailjet', ].includes(provider) ) {
                const sentMail = nodemailerMock.mock.getSentMail();
                expect(sentMail.length).to.be.eqls(1);
              }

            });

          });
    
        
          it.skip(`400 - ${event}`, async() => {
        
            if ( ![ 'mailjet' ].includes(provider) ) {
              nodemailerMock.mock.setShouldFailOnce();
              nodemailerMock.mock.setFailResponse({ statusCode: 400, errors: [ { message: 'Error message' } ] });
            }
            
            const params = requestPayload();
            delete params.content;
            
            await Mailer.send(event, params).catch(err => {
              expect(err).to.be.an('object');
              expect(err).to.haveOwnProperty('statusCode');
              expect(err).to.haveOwnProperty('statusText');
              expect(err).to.haveOwnProperty('errors');
              expect(err.statusCode).to.be.eqls(400);
            });

            if ( ![ 'mailjet'].includes(provider) ) {
              const sentMail = nodemailerMock.mock.getSentMail();
              expect(sentMail.length).to.be.eqls(1);
            }

          });

        }

        it(`202 - ${event}`, async() => {
          
          Container.configuration.mode.api.templates = {};

          const params = requestPayload();
          delete params.content;
          const response = await Mailer.send(event, params).catch(e => { console.log('err', e); })
      
          expect(response.statusCode).to.be.eqls(202);

          if ( ![ 'mailjet' ].includes(provider) ) {
            const sentMail = nodemailerMock.mock.getSentMail();
            expect(sentMail.length).to.be.eqls(1);
          }

        });

      });

    });

  });

}