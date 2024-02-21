const { expect } = require('chai');

const { hash, encrypt, decrypt, shuffle, base64Decode, base64Encode } = require(process.cwd() + '/dist/utils/string.util');

var fs = require('fs');

describe('Utils', () => {

  describe('String', () => {
  
    describe('::suffle', () => {

      it('should returns a shuffled value', function() {
        const array = [0,1,2,3,4,5];
        const phrase = 'Test string';
        expect(shuffle(array)).to.not.eqls(array);
        expect(shuffle(phrase.split(''))).to.be.a('string');
        expect(shuffle(phrase.split(''))).to.not.eqls(phrase);
      });

    });

    describe('::hash', () => {

      it('should returns a shuffled value to n', function() {
        const phrase = 'Test string';
        const h = hash(phrase,8);
        expect(h).to.be.a('string');
        expect(h).to.not.eqls(phrase);
        expect(h.length).to.eqls(8);
      });

    });

    describe('::base64Encode', () => {

      it('should returns a base64 encoded string', function() {
        const origine = process.cwd() + '/test/fixtures/files/javascript.jpg';
        const base64Encoded = base64Encode(origine);
        expect(base64Encoded).to.be.a('string');
        expect(base64Encoded).match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/)
      });

    });

    describe('::base64Decode', () => {

      it('should write ascii file', function(done) {
        const origine = process.cwd() + '/test/fixtures/files/javascript.jpg';
        const copy = process.cwd() + '/test/fixtures/files/javascript-rewrited.jpg';
        const stream = fs.readFileSync(origine);
        base64Decode(stream, copy);
        expect( fs.statSync(copy).isFile() ).to.eqls(true);
        expect( fs.statSync(copy).size ).to.eqls( fs.statSync(origine).size );
        fs.unlinkSync(copy);
        done();
      });

    });

    describe('::decrypt', () => {

      it('should returns original string', function() {
        const string = 'totowasaheroes';
        const encrypted = encrypt(string);
        expect(decrypt(encrypted)).to.be.eqls(string)
      });

    });

    describe('::encrypt', () => {

      it('should returns encrypted string', function() {
        const string = 'totowasaheroes';
        expect(encrypt(string)).to.be.not.eqls(string)
      });
    });
  });
});