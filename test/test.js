var assert = require('assert');
var fs = require('fs');
var Transpiler = require('lib/transpiler');

var t = new Transpiler();
var fixtures = fs.readdirSync('./fixtures')
    .map(function(path) {
        var source = ['fixtures', path, 'in.hbs'].join('/');
        var expect = ['fixtures', path, 'out.twig'].join('/');
        return {
            name : path,
            source: fs.readFileSync(source),
            expect: fs.readFileSync(expect)
        }
    });

describe('handlebars-twig compiles', function() {
    fixtures.forEach(function(fixture) {
        it('compiles ' + fixture.name, function() {
            assert.equal(t.string(''+fixture.source), ''+fixture.expect);
        });
    });
});
