const { describe, it } = require('mocha');
const assume = require('assume');
const help = require('./');

describe('send-help', function () {
  const { writer, longest, block } = help;

  it('is exported as a function', function () {
    assume(help).is.a('function');
  });

  describe('#longest', function () {
    it('is a function', function () {
      assume(longest).is.a('function');
    });

    it('returns the size of the longest string', function () {
      assume(longest(['foo', 'bar', 'lulz'])).equals(4);
      assume(longest(['foo'])).equals(3);
      assume(longest(['what is going', 'on', 'in the club'])).equals(13);
    });
  });

  describe('#writer', function () {
    it('return our write api', function () {
      const api = writer();

      assume(api).is.a('object');
      assume(api).is.length(5);
      assume(api.header).is.a('function');
      assume(api.paint).is.a('function');
      assume(api.write).is.a('function');
      assume(api.example).is.a('function');
      assume(api.output).is.a('function');
    });

    describe('#output', function () {
      it('return a string', function () {
        const { output } = writer();

        assume(output()).equals('');
      });

      it('returns the written output', function () {
        const { write, output } = writer();

        write('foo');
        write('bar');

        assume(output()).equals('foo\nbar');
      });
    });

    describe('#write', function () {
      it('writes a string to the output', function () {
        const { write, output } = writer();

        write('ello');
        assume(output()).equals('ello');
      });

      it('can write multiple lines in a single call', function () {
        const { write, output } = writer();

        write('hello', 'world');
        assume(output()).equals('hello\nworld');
      });
    });

    describe('#example', function () {
      it('generates the example', function () {
        const { example, output } = writer();

        example('npm publish');
        assume(output()).equals('  $ npm publish');
      });
    });

    describe('#header', function () {
      it('generates the header', function () {
        const { header, output } = writer();

        header('hello world');
        assume(output()).equals('HELLO WORLD:\n');
      });
    });

    describe('#paint', function () {
      it('creates red text', function () {
        const { paint } = writer();

        assume(paint('text', 'red')).equals('\x1b[38;5;196mtext\x1b[39;49m');
      });

      it('can disable colors', function () {
        const { paint } = writer(false);

        assume(paint('text', 'red')).equals('text');
      });
    });
  });
});
