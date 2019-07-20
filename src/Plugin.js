'use strict';

const PRIVATE = Symbol('PRIVATE');

/**
 * An abstract class describing the functionality of an OP plugin.
 * Accepts a configuration object of the following type:
 * {
 *   "name": "", // The name of the plugin
 *   "description": "", // A description of the plugin's functionality
 *   "version": "", // The plugin's version
 *   "path": "", // The path to the plugin relative to the config path
 *   "enabled": true, // Whether or not to activate the plugin at startup
 *   "config": {} // Arbitrary config information for the plugin
 * }
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

  initialize(bot, client, logger) {
    throw new Error('Not implemented.');
  }

  deinitialize(bot, client, logger) {
    throw new Error('Not implemented');
  }

  activate(bot, client, logger) {
    if (!this[PRIVATE].active) {
      this[PRIVATE].active = true;
      this.initialize(bot, client, logger);
      logger.debug(`${this.name} - initialized`);
    }
  }

  deactivate(bot, client, logger) {
    if (this[PRIVATE].active) {
      this[PRIVATE].active = false;
      this.deinitialize(bot, client, logger);
      logger.debug(`${this.name} - deinitialized`);
    }
  }
}

module.exports = Plugin;
