var fs = require('fs'),
    eyes = require('eyes'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var Transpiler = function() {
    this.wrappers = {
        block: ['{%', '%}'],
        other: ['{{', '}}'],
        none: ['', '']
    };
    this.builtIns = ['if', 'unless', 'each'];
    this.buffer = []
    _.bindAll(this);
};

Transpiler.prototype.op = function(name, wrap) {
    this.buffer.push({
        name: name,
        wrap : wrap || 'none',
        args: [].slice.call(arguments, 2)
    });
    return this;
}

Transpiler.prototype.string = function(string) {
    this.buffer = []
    return this
        .program(Handlebars.parse(string))
        .toString();
};

Transpiler.prototype.toString = function() {
    return _.map(this.buffer, function(op) {
        var wrap = this.wrappers[op.wrap];
        return wrap[0] + op.name + wrap[1];
    }, this).join('\n');
}

Transpiler.prototype.program = function(program, scope) {
    _.each(program.statements, function(node) {
        this[node.type](node, scope);
    }, this);
    return this;
};

// Handler methods for `node.type`
Transpiler.prototype.block = function(block) {
    eyes.inspect(block);
    var type = block.mustache.id.original;
    if (type === 'each') {
        var it = this.parseParam(block.mustache.params[0]);
        var scoped = '_' + it;
        this.op('for ' + scoped + ' in ' + it, 'block');
        if (block.program.statements.length) {
            var t = new Transpiler();
            this.op(t.program(block.program, scoped).toString());
        }
        this.op('endfor', 'block');
    }
    else if (type === 'if') {
        var it = this.parseParam(block.mustache.params[0]);
        this.op('if '  + it, 'block');
        if (block.program.statements.length) {
            var t = new Transpiler();
            this.op(t.program(block.program).toString());
        }
        this.op('endif', 'block');
    }
    else if (type === 'unless') {
        var it = this.parseParam(block.mustache.params[0]);
        this.op('if !'  + it, 'block');
        if (block.program.statements.length) {
            var t = new Transpiler();
            this.op(t.program(block.program).toString());
        }
        this.op('endif', 'block');
    }
};

Transpiler.prototype.content = function(content) {
    this.op(content.string);
};

Transpiler.prototype.mustache = function(mustache, scope) {
    var variable = mustache.id.original;
    if (mustache.isHelper) {
        // Custom helper
        variable = _.reduce(mustache, this.parseHelper, '');
    }
    if (scope) {
        variable = scope + '.' + variable;
    }
    this.op(variable, 'other');
};

Transpiler.prototype.parseParam = function(p) {
    var content = p.string;
    if (p.type === 'STRING') {
        content = "'" + content + "'";
    }
    return content;
};

module.exports = Transpiler;
