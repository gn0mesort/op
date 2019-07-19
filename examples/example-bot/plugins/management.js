'use strict';

const std = {
  path: require('path')
};

const OP = require(std.path.join(__dirname, '../../../index.js'));

class ListPluginsCmd extends OP.Command {
  constructor(bot) {
    super({
      name: 'list-plugins',
      description: 'Lists all plugins and their state.',
      version: '1.0.0',
      help: 'USAGE: list-plugins',
      path: '',
      roles: null,
      permissions: [ 'ADMINISTRATOR' ]
    });
    this.bot = bot;
  }

  async exec(argv, message, logger) {
    let resp = '```\n';
    for (let plugin of Object.values(this.bot.plugins)) {
      resp += `${plugin.name} - ${plugin.active}\n`;
    }
    resp += '```\n';
    return message.channel.send(resp);
  }
}

class ActivatePluginCmd extends OP.Command {
  constructor(bot) {
    super({
      name: 'activate-plugin',
      description: 'Activates a plugin.',
      version: '1.0.0',
      help: 'USAGE: activate-plugin <PLUGIN>',
      path: '',
      roles: null,
      permissions: [ 'ADMINISTRATOR' ]
    });
    this.bot = bot;
  }

  async exec(argv, message, logger) {
    if (!argv[1]) {
      let err = `Insuffiencent arguments.`
      message.channel.send(err);
      throw new Error(err);
    }
    let plugin = this.bot.plugins[argv[1]];
    if (plugin) {
      plugin.initialize(this.bot, message.client, logger);
      return message.channel.send(`${plugin.name} activated.`);
    }
    else {
      let err = `Plugin ${plugin.name} not found.`;
      message.channel.send(err);
      throw new Error(err);
    }
  }
}

class DeactivatePluginCmd extends OP.Command {
  constructor(bot) {
    super({
      name: 'deactivate-plugin',
      description: 'Deactivates a plugin.',
      version: '1.0.0',
      help: 'USAGE: deactivate-plugin <PLUGIN>',
      path: '',
      roles: null,
      permissions: [ 'ADMINISTRATOR' ]
    });
    this.bot = bot;
  }

  async exec(argv, message, logger) {
    if (!argv[1]) {
      let err = `Insuffiencent arguments.`
      message.channel.send(err);
      throw new Error(err);
    }
    let plugin = this.bot.plugins[argv[1]];
    if (plugin) {
      plugin.deinitialize(this.bot, message.client, logger);
      return message.channel.send(`${plugin.name} deactivated.`);
    }
    else {
      let err = `Plugin ${plugin.name} not found.`;
      message.channel.send(err);
      throw new Error(err);
    }
  }
}

class ListCommandsCmd extends OP.Command {
  constructor(bot) {
    super({
      name: 'list-commands',
      description: 'List all loaded commands.',
      version: '1.0.0',
      help: 'USAGE: list-commands',
      path: '',
      roles: null,
      permissions: null
    });
    this.bot = bot;
  }

  async exec(argv, message, logger) {
    let resp = '```\n';
    for (let command of Object.values(this.bot.commands)) {
      resp += `${command.name}\n`;
    }
    resp += '```\n';
    return message.channel.send(resp);
  }
}

class DescribeCmd extends OP.Command {
  constructor(bot) {
    super({
      name: 'describe',
      description: 'Provides explanations of commands and plugins.',
      version: '1.0.0',
      help: 'USAGE: describe <COMMAND|PLUGIN>',
      path: '',
      roles: null,
      permissions: null
    });
    this.bot = bot;
  }
  async exec(argv, message, logger) {
    if (!argv[1]) {
      let err = `Insuffiencent arguments.`
      message.channel.send(err);
      throw new Error(err);
    }
    let r = '```\n';
    if (argv[1] in this.bot.commands) {
      let command = this.bot.commands[argv[1]];
      r += `${command.name} - ${command.version}\n` +
           `${command.description}\n` +
           `${command.help}\n`;
    }
    else if (argv[1] in this.bot.plugins) {
      let plugin = this.bot.plugins[argv[1]];
      r += `${plugin.name} - ${plugin.version} - ${plugin.active}\n` +
           `${plugin.description}\n`;
    }
    else {
      let err = `No command or plugin with name ${argv[1]}.`
      message.channel.send(err);
      throw new Error(err);
    }
    r += '```\n';
    return message.channel.send(r);
  }
}

class ManagementPlugin extends OP.Plugin {
  initialize(bot, client, logger) {
    if (this.active !== 'active') {
      super.initialize(bot, client, logger);
      bot.commands['list-plugins'] = new ListPluginsCmd(bot);
      bot.commands['activate-plugin'] = new ActivatePluginCmd(bot);
      bot.commands['deactivate-plugin'] = new DeactivatePluginCmd(bot);
      bot.commands['list-commands'] = new ListCommandsCmd(bot);
      bot.commands['describe'] = new DescribeCmd(bot);
    }
  }

  // If you could deinitialize the management plugin then you would screw up
  // everything!
  deinitialize(bot, client, logger) {
    // if (this.active !== 'active) {
    //   super.deinitialize(bot, client, logger);
    //   delete bot.commands['list-plugins'];
    //   delete bot.commands['activate-plugin'];
    //   delete bot.commands['deactivate-plugin'];
    // }
  }
}

module.exports = ManagementPlugin;
