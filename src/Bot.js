'use strict';

const std = {
  path: require('path')
};

const Bunyan = require('bunyan');

const PRIVATE = Symbol('PRIVATE');

function loadModules(dir, configs) {
  let modules = {};
  let Mod = null;
  for (let config of configs) {
    if (std.path.isAbsolute(config.path)) {
      Mod = require(config.path);
    }
    else {
      Mod = require(std.path.join(dir, config.path));
    }
    modules[config.name] = new Mod(config);
  }
  return modules;
}

function isOpeningMention(message) {
  const pattern = new RegExp(`^${message.client.user}`, 'g');
  return message.content.match(pattern);
}

function isGuildMessage(message) {
  return message.type === 'text' ||
         message.type === 'store' ||
         message.type === 'news';
}

async function directCommandParse(message, bot) {
  const logger = bot[PRIVATE].logger;
  if (
    isOpeningMention(message) &&
    message.author.id != message.client.user.id
  )  {
    let argv = message.content.split(/\s+/g).slice(1),
        command = bot[PRIVATE].commands[argv[0]];
    if (!command) {
      throw new Error(`Command ${argv[0]} not found.`);
    }
    let allowCommand = !(command.roles || command.permissions);
    if (command.roles && isGuildMessage(message)) {
      for (let roleName of command.roles) {
       let role = message.guild.roles.find('name', roleName);
       allowCommand |= role.members.get(message.member.id);
      }
    }
    if (command.permissions && isGuildMessage(message)) {
      allowCommand |= message.member.permissions.has(command.permissions);
    }
    if (bot[PRIVATE].config.admins.includes(message.author.id)) {
      allowCommand = true;
    }
    if (allowCommand) {
      logger.debug(`Running command ${argv[0]} with args: ${argv}`);
      await command.exec(argv, message, logger);
      logger.debug(`Command ${argv[0]} succeeded.`);
    }
  }
}

class Bot {
  constructor(client, config) {
    this[PRIVATE] = {};
    config.name = config.name || 'op';
    config.version = config.version || '0.0.0';
    config.loglevel = config.loglevel || 'info';
    config.permissions = config.permissions || [];
    config.admins = config.admins || [];
    config.plugins = config.plugins || [];
    config.commands = config.commands || [];
    this[PRIVATE].logger = Bunyan.createLogger({
      name: config.name,
      level: config.loglevel
    });
    this[PRIVATE].client = client;
    this[PRIVATE].config = Object.freeze(config);
    this[PRIVATE].plugins = loadModules(config.path, config.plugins);

    this[PRIVATE].commands = loadModules(config.path, config.commands);

    this[PRIVATE].client.once('ready', async () => {
      const logger = this[PRIVATE].logger,
            client = this[PRIVATE].client,
            config = this[PRIVATE].config;
      logger.info(
        `${config.name} - ${config.version}`
      );

      const plugins = Object.values(this[PRIVATE].plugins);
      for (let plugin of plugins) {
        logger.debug(
          `${plugin.name} - ${plugin.enabled ? 'enabled' : 'disabled'}`
        );
        if (plugin.enabled) {
          plugin.activate(this, client, logger);
        }
      }

      logger.info(
        `Invite me: ${await client.generateInvite(config.permissions)}`
      );
    });
    this[PRIVATE].client.on('message', async (message) => {
      try {
        await directCommandParse(message, this);
      }
      catch (err) {
        this[PRIVATE].logger.error(err);
      }
    });

    this[PRIVATE].client.login(this[PRIVATE].config.token);
  }

  get plugins() {
    return this[PRIVATE].plugins;
  }

  get commands() {
    return this[PRIVATE].commands;
  }
}

module.exports = Bot;
