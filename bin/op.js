#!/usr/bin/env node

'use strict';

const std = {
  path: require('path')
};
const program = require('commander');
const Discord = require('discord.js');

const OP = require(std.path.join(__dirname, '../index.js'));

const pkg = require(std.path.join(__dirname, '../package.json'));

program.name(pkg.name)
       .description(pkg.description)
       .version(pkg.version)
       .usage('[OPTIONS] <CONFIG>')
       .parse(process.argv);

if (program.args.length < 1) {
  program.help();
}

const config = require(std.path.join(process.cwd(), program.args[0]));
if (!std.path.isAbsolute(program.args[0])) {
  config.path = std.path.dirname(std.path.join(process.cwd(), program.args[0]));
}
else {
  config.path = program.args[0];
}
const bot = new OP.Bot(new Discord.Client(), config);
