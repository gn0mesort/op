'use strict';

const std = {
  path: require('path')
};

const Bunyan = require('bunyan');

const PRIVATE = Symbol('PRIVATE');

function loadModules(dir, configs, initial = {}) {
  const modules = initial;
  let Mod = null;
  for (let config of configs) {
    if (!config.path) {
      continue;
    }
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

async function directCommandParse(message, bot) {
  const logger = bot[PRIVATE].logger;
  if (
    isOpeningMention(message) &&
    message.author.id !== message.client.user.id &&
    !message.author.bot
  ) {
    const argv = message.content.split(/\s+/g).slice(1),
          command = bot.commands[argv[0]];
    if (!command) {
      throw new Error(`Command ${argv[0]} not found.`);
    }
    if (
      command.isPermitted(message) ||
      bot.config.admins.includes(message.author.id)
    ) {
      logger.log(`Running command ${argv[0]} with args: ${argv}`);
      await command.exec(argv, message, logger);
      logger.debug(`Command ${argv[0]} succeeded.`);
    }
  }
}

/**
 * An OP bot.
 *
 * The Bot class is the core of OP. It provides extremely limited functionality
 * with the intention that users will extend it with Plugins or Commands.
 * Primarily the Bot object provides start up and tear down routines for
 * whatever underlying functionality a configuration has set up. This includes
 * loading Commands/Plugins based on their configurations, activating enabled
 * Plugins, and providing a command parser. After the ready event has been
 * fired by the Bot's Discord.Client the only part of it still hooked into
 * Discord by default is the command parser.
 *
 * An example configuration with comments can be found in
 * examples/bot.config.template.json. This config is intended to be
 * included inline with the Bot configuration.
 */
class Bot {
  /**
   * Bot constructor.
   *
   * @param {Discord.Client} client The underlying client this bot uses.
   * @param {Object} config The bot configuration and command/plugin
   * configurations which depend on it.
   * @param {Object} commands An object containing preloaded commands. Each
   * command's key should be its name. The value should be an object derived
   * from the Command type.
   * @param {Object} plugins An object containing preloaded plugins. Each
   * plugin's key should be its name. The value should be an object derived
   * from the Plugin type.
   */
  constructor(client, config, commands = {}, plugins = {}) {
    this[PRIVATE] = {};
    const token = config.token;
    delete config.token;
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
    this[PRIVATE].plugins = loadModules(config.path, config.plugins, plugins);
    this[PRIVATE].commands = loadModules(
      config.path,
      config.commands,
      commands
    );

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

    this[PRIVATE].client.login(token);
  }

  get plugins() {
    return this[PRIVATE].plugins;
  }

  get commands() {
    return this[PRIVATE].commands;
  }

  get config() {
    return this[PRIVATE].config;
  }
}

module.exports = Bot;
