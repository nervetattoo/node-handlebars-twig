#!/usr/bin/env node

var fs = require('fs');
var Transpiler = require('./lib/transpiler');
var argv = require('optimist')
    .options('f', {
        alias: 'file',
        demand: true,
        describe: 'Handlebars template to load'
    })
    .options('o', {
        alias: 'out',
        describe: 'Output file path, stdout if '
    })
    .argv;

var tp = new Transpiler('fixtures/complex.hbs');

var out = tp
    .file(argv.file)
    .toString();

if (argv.o) {
    fs.writeFileSync(argv.o, out);
}
else {
    console.log(out);
}
