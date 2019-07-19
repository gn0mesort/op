'use strict';

const std = {
  path: require('path')
};

module.exports = {
  Bot: require(std.path.join(__dirname, 'src/Bot.js')),
  Command: require(std.path.join(__dirname, 'src/Command.js')),
  Plugin: require(std.path.join(__dirname, 'src/Plugin.js')),
  Discord: require('discord.js')
};
