var assert = require('assert');
var Transpiler = require('lib/transpiler');

var t = new Transpiler();

describe('handlebars-twig', function() {
    it('compiles variables', function() {
        assert.equal(t.string('{{foo}}'), '{{foo}}');
        assert.equal(t.string('{{foo.bar}}'), '{{foo.bar}}');
    });

    it('compiles loops', function() {
        var input = '{{#each foo}}{{/each}}';
        var expected = '{%for _foo in foo%}\n{%endfor%}';
        assert.equal(t.string(input), expected);

        var input = '{{#each foo}}{{bar}}{{/each}}';
        var expected = '{%for _foo in foo%}\n{{_foo.bar}}\n{%endfor%}';
        assert.equal(t.string(input), expected);
    });

    it('compiles conditionals', function() {
        var input = '{{#if foo}}{{/if}}';
        var expected = '{%if foo%}\n{%endif%}';
        assert.equal(t.string(input), expected);

        var input = '{{#unless foo}}{{/unless}}';
        var expected = '{%if !foo%}\n{%endif%}';
        assert.equal(t.string(input), expected);
    });
});
