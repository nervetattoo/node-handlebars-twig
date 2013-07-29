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
    wrap = wrap || 'none';
    this.buffer.push({
        name: name,
        wrap : wrap,
        lf : '',
        args: [].slice.call(arguments, 2)
    });
    return this;
}

Transpiler.prototype.contains = function(type) {
    return _.any(this.buffer, function(op) {
        return _.contains(op.args, type);
    });
};

Transpiler.prototype.file = function(filename) {
    this.buffer = []
    return this
        .program(Handlebars.parse(string))
        .toString();
};

Transpiler.prototype.string = function(string) {
    this.buffer = []
    return this
        .program(Handlebars.parse(string))
        .toString();
};

Transpiler.prototype.toString = function() {
    return _.reduce(this.buffer, function(str, op) {
        var wrap = this.wrappers[op.wrap];
        return str + wrap[0] + op.name + wrap[1] + op.lf;
    }, '', this);
}

Transpiler.prototype.program = function(program, scope) {
    _.each(program.statements, function(node) {
        this[node.type](node, scope);
    }, this);
    return this;
};

// Handler methods for `node.type`
Transpiler.prototype.block = function(block) {
    var type = block.mustache.id.original;
    if (type === 'each') {
        var it = this.parseParam(block.mustache.params[0]);
        var scoped = '_' + it;
        var key = '_key' + scoped;
        var forOp = 'for ' + scoped + ' in ' + it;
        if (block.program.statements.length) {
            var t = new Transpiler();
            var content = t.program(block.program, scoped);
            if (content.contains('@key')) {
                forOp = 'for ' + key + ', ' + scoped + ' in ' + it;
            }
        }
        // Push operators
        this.op(forOp, 'block');
        this.op(content.toString());
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
    var data = mustache.id;
    var type = data.type;
    switch (type) {
        case 'ID':
            var variable = data.original;
            if (mustache.isHelper) {
                // Custom helper
                variable = _.reduce(mustache, this.parseHelper, '');
            }
            if (scope) {
                variable = scope + '.' + variable;
            }
            this.op(variable, 'other', type);
            break;
        case 'DATA':
            data = data.id;
            var type;
            if (data.original === 'index') {
                type = '@index';
                variable = 'loop.' + data.original;
            }
            else if (data.original === 'key') {
                type = '@key';
                variable = '_key' + scope;
            }
            this.op(variable, 'other', type);
            break;
    }
};

Transpiler.prototype.parseParam = function(p) {
    var content = p.string;
    if (p.type === 'STRING') {
        content = "'" + content + "'";
    }
    return content;
};

module.exports = Transpiler;
