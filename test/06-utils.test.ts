import { describe, it } from 'bun:test';
import { expect } from 'chai';
import { readFileSync, statSync, unlinkSync } from 'node:fs';

import { hash, encrypt, decrypt, shuffle, base64Decode, base64Encode } from '../src/utils/string.util';

describe('Utils', () => {

  describe('String', () => {

    describe('::suffle', () => {
      it('should returns a shuffled value', () => {
        const array = [0, 1, 2, 3, 4, 5];
        const phrase = 'Test string';
        expect(shuffle(array)).to.not.eqls(array);
        expect(shuffle(phrase.split(''))).to.be.a('string');
        expect(shuffle(phrase.split(''))).to.not.eqls(phrase);
      });
    });

    describe('::hash', () => {
      it('should returns a shuffled value to n', () => {
        const phrase = 'Test string';
        const h = hash(phrase, 8);
        expect(h).to.be.a('string');
        expect(h).to.not.eqls(phrase);
        expect(h.length).to.eqls(8);
      });
    });

    describe('::base64Encode', () => {
      it('should returns a base64 encoded string', () => {
        const origine = `${process.cwd()}/test/fixtures/files/javascript.jpg`;
        const encoded = base64Encode(origine);
        expect(encoded).to.be.a('string');
        expect(encoded).match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/);
      });
    });

    describe('::base64Decode', () => {
      it('should write ascii file', (done: any) => {
        const origine = `${process.cwd()}/test/fixtures/files/javascript.jpg`;
        const copy = `${process.cwd()}/test/fixtures/files/javascript-rewrited.jpg`;
        const stream = readFileSync(origine);
        base64Decode(stream, copy);
        expect(statSync(copy).isFile()).to.eqls(true);
        expect(statSync(copy).size).to.eqls(statSync(origine).size);
        unlinkSync(copy);
        done();
      });
    });

    describe('::decrypt', () => {
      it('should returns original string', () => {
        const string = 'totowasaheroes';
        const encrypted = encrypt(string);
        expect(decrypt(encrypted)).to.be.eqls(string);
      });
    });

    describe('::encrypt', () => {
      it('should returns encrypted string', () => {
        const string = 'totowasaheroes';
        expect(encrypt(string)).to.be.not.eqls(string);
      });
    });
  });
});
