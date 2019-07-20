'use strict';

const PRIVATE = Symbol('PRIVATE');

/**
 * An abstract class describing the functionality of an OP command.
 *
 * Commands are simple objects that define the behavior of commands exposed by a
 * Bot. Commands know very little about the Bot object to which they belong and
 * are never directly passed a reference to it. They do receive references to
 * the underlying Discord.Client object attached to the Discord.Message objects
 * that they receive during execution.
 *
 * When commands are loaded via the op executable script the entire OP library
 * is globally accessible.
 *
 * An example configuration with comments can be found in
 * examples/command.config.template.json. This config is intended to be
 * included inline with the Bot configuration.
 *
 * @param {Object} config The command's configuration data
 */
class Command {
  constructor(config) {
    this[PRIVATE] = {};
    this[PRIVATE].name = config.name;
    this[PRIVATE].description = config.description || '';
    this[PRIVATE].version = config.version || '0.0.0';
    this[PRIVATE].help = config.help || '';
    this[PRIVATE].path = config.path || '';
    this[PRIVATE].roles = config.roles || [];
    this[PRIVATE].permissions = config.permissions || [];
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

  get help() {
    return this[PRIVATE].help;
  }

  get path() {
    return this[PRIVATE].path;
  }

  get roles() {
    return this[PRIVATE].roles;
  }

  get permissions() {
    return this[PRIVATE].permissions;
  }

  get config() {
    return this[PRIVATE].config;
  }

  /**
   * Executes the command.
   *
   * This method is abstract and must be implemented by any class implementing
   * Command.
   *
   * @param {Array} argv An array of command arguments. argv[0] is the command
   * itself
   * @param {Discord.Message} message The full message that caused this command
   * to be invoked
   * @param {Bunyan.Logger} logger  The Bunyan logger belonging to the parent
   * Bot
   */
  async exec(argv, message, logger) {
    throw Error('Not implemented.');
  }
}

module.exports = Command;
