const { expect } = require('chai');
const { writeFileSync } = require('fs');

const { cliamrc, requestPayload } = require(process.cwd() + '/test/fixtures');

const internal =  {
  transporterId: 'hosting-smtp',
	meta: {
		subject: 'Compiled by consumer and sended by SMTP',
		to: [
			{
				name: 'John Doe',
				email: 'info@konfer.be'
			}
		],
		from: {
			email: 'info@konfer.be',
			name : 'Konfer'
		},
		replyTo: {
			email: 'no-reply@konfer.be',
			name : 'Konfer'
		}
	},
	content: [{
		type: 'text/html',
		value: '<h1>Hello Yoda</h1><p>I use SMTP transporter</p>'
	}]
};

describe('SMTP', function() {
  
  let Cliam, mockery, nodemailerMock;

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
    mockery.disable();
  });
  
  after(() => {
    nodemailerMock.mock.reset();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('Default transactions', async() => {

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

        describe('Compilation by client', async () => {

          it(`202 - ${event}`, async() => {
    
            const response = await Cliam.mail(event, internal);
            const sentMail = nodemailerMock.mock.getSentMail();
            expect(response.statusCode).to.be.eqls(202);
            expect(response.statusMessage).to.be.eqls('nodemailer-mock success');
            expect(sentMail.length).to.be.eqls(1);

          });

        });

        it(`417 - ${event}`, async() => {
        
          nodemailerMock.mock.setShouldFailOnce();
          nodemailerMock.mock.setFailResponse(new TypeError());
          
          const params = requestPayload('default', 'hosting-smtp');
          delete params.content;
          
          await Cliam.mail(event, params).catch(err => {
            expect(err).to.be.an('object');
            expect(err).to.haveOwnProperty('statusCode');
            expect(err).to.haveOwnProperty('statusText');
            expect(err).to.haveOwnProperty('errors');
            expect(err.statusCode).to.be.eqls(417);
          });
  
        });
      }

      it(`202 - ${event}`, async() => {
        const params = JSON.parse( JSON.stringify( requestPayload('provider', 'hosting-smtp') ) );
        delete params.content;
        const response = await Cliam.mail(event, params);
        const sentMail = nodemailerMock.mock.getSentMail();
        expect(response.statusCode).to.be.eqls(202);
        expect(response.statusMessage).to.be.eqls('nodemailer-mock success');
        expect(sentMail.length).to.be.eqls(1);
      });

    });

  });

});