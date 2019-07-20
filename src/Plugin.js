'use strict';

const PRIVATE = Symbol('PRIVATE');

/**
 * An abstract class describing the functionality of an OP plugin.
 *
 * Plugins allow greater behavioral changes to a Bot than commands. This means
 * they have general access to the Bot object that is passed during activation
 * and deactivation. Generally plugins should be loaded by the bot itself but
 * this is not a requirement.
 *
 * When plugins are loaded via the op executable script the entire OP library is
 * globally accessible.
 *
 * An example configuration with comments can be found in
 * examples/plugin.config.template.json. This config is intended to be
 * included inline with the Bot configuration.
 *
 * @param {Object} config The plugin's configurationd data
 */
class Plugin {
  constructor(config) {
    this[PRIVATE] = {};
    this[PRIVATE].name = config.name;
    this[PRIVATE].description = config.description || '',
    this[PRIVATE].version = config.version || '0.0.0';
    this[PRIVATE].path = config.path || '';
    this[PRIVATE].enabled = config.enabled || false;
    this[PRIVATE].active = false;
    this[PRIVATE].config = Object.freeze(config.config || {});
  }

  get name() {
    return this[PRIVATE].name;
  }

  get description() {
    return this[PRIVATE].description;
  }

  get version() {
    return this[PRIVATE].version;
  }

  get path() {
    return this[PRIVATE].path;
  }

  get enabled() {
    return this[PRIVATE].enabled;
  }

  get active() {
    return this[PRIVATE].active ? "active" : "inactive";
  }

  get config() {
    return this[PRIVATE].config;
  }

  /**
   * Initializes a plugin.
   *
   * This method should only be called by Plugin.prototype.activate() which
   * provides checks for whether or not the plugin is already active. This
   * method must be overriden by any class implementing Plugin.
   *
   * @param {Bot} bot The Bot this Plugin belongs too.
   * @param {Discord.Client} client The Discord.Client corresponding to bot
   * @param {Bunyan.Logger} logger A Bunyan logger corresponding to bot
   */
  initialize(bot, client, logger) {
    throw new Error('Not implemented.');
  }

  /**
   * Deinitializes a plugin.
   *
   * This method should only be called by Plugin.prototype.deactivate() which
   * provides checks for whether or not the plugin is already active. This
   * method must be overriden by any class implementing Plugin.
   *
   * @param {Bot} bot The Bot this Plugin belongs too.
   * @param {Discord.Client} client The Discord.Client corresponding to bot
   * @param {Bunyan.Logger} logger A Bunyan logger corresponding to bot
   */
  deinitialize(bot, client, logger) {
    throw new Error('Not implemented');
  }

  /**
   * Activates a plugin if it is not already active.
   *
   * @param {Bot} bot The Bot this Plugin belongs too.
   * @param {Discord.Client} client The Discord.Client corresponding to bot
   * @param {Bunyan.Logger} logger A Bunyan logger corresponding to bot
   */
  activate(bot, client, logger) {
    if (!this[PRIVATE].active) {
      this[PRIVATE].active = true;
      this.initialize(bot, client, logger);
      logger.debug(`${this.name} - initialized`);
    }
  }

  /**
   * Deactivates a plugin if it is not already inactive.
   *
   * @param {Bot} bot The Bot this Plugin belongs too.
   * @param {Discord.Client} client The Discord.Client corresponding to bot
   * @param {Bunyan.Logger} logger A Bunyan logger corresponding to bot
   */
  deactivate(bot, client, logger) {
    if (this[PRIVATE].active) {
      this[PRIVATE].active = false;
      this.deinitialize(bot, client, logger);
      logger.debug(`${this.name} - deinitialized`);
    }
  }
}

module.exports = Plugin;
