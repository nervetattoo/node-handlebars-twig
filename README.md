node-handlebars-twig
====================

**WIP**

Transpile Handlebars templates to Twig templates

## Rationale

In optimising initial rendering of SPAs we saw the need to duplicate small hbs templates into PHP Twig templates on the server.
But since Handlebars core is made up of such a small feature set we figured we could be rigorous in writing simple hbs templates
and then transpile those to twig templates.

Look at `fixtures/$fixture/in.hbs` vs `out.twig` to see what is run through the tests.
Get started with contributing by cloning and running:

```
npm install
npm install -g mocha
mocha
```

## WORK IN PROGRESS

This is very much WIP and most of the code looks like, and is, a hack. Use at your own risk.

## TODO

* helpers
* if-else
* each-else
* <del>if</del>
* <del>unless</del>
* <del>each</del>
  * <del>@index</del>
  * <del>@key</del>
  * <del>basic scoping</del>
* <del>variables</del>
* <del>content</del>
