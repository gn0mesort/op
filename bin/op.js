#!/usr/bin/env node

'use strict';

const std = {
  path: require('path')
};
const program = require('commander');

// Load OP library and make it globally accessible
global.OP = require(std.path.join(__dirname, '../index.js'));

const pkg = require(std.path.join(__dirname, '../package.json'));

program.name(pkg.name)
       .description(pkg.description)
       .version(pkg.version)
       .usage('[OPTIONS] <CONFIG>')
       .parse(process.argv);

if (program.args.length < 1) {
  program.help();
}

let config_path = null;
if (!std.path.isAbsolute(program.args[0])) {
  config_path = std.path.join(process.cwd(), program.args[0]);
}
else {
  config_path = program.args[0];
}
const config = require(config_path);
config.path = std.path.dirname(config_path);
const bot = new OP.Bot(new OP.Discord.Client(), config);
