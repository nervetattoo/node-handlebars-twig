var Handlebars = require('handlebars');
var _ = require('lodash');
var eyes = require('eyes');
var fs = require('fs');
var Transpiler = require('./lib/transpiler');

var transpiler = new Transpiler('fixtures/complex.hbs');
transpiler.generateAST(transpiler.processAST);

return;
var rules = [
    [/\{\{#unless ([a-zA-Z.-_]+)\}\}/, '{% if not $1 %}'],
    [/\{\{\/unless\}\}/, '{% endif %}'],
];

var result = _.reduce(rules, function(memo, rule) {
    return memo.replace(rule[0], rule[1]);
}, src);

console.log(src);
console.log('===');
console.log(result);
