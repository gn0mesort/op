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
 */
class Command {
  /**
   * Command constructor.
   *
   * @param {Object} config The config object used to initialize the Command.
   */
  constructor(config) {
    this[PRIVATE] = {};
    this[PRIVATE].name = config.name;
    this[PRIVATE].description = config.description || '';
    this[PRIVATE].version = config.version || '0.0.0';
    this[PRIVATE].help = config.help || '';
    this[PRIVATE].path = config.path || '';
    this[PRIVATE].security = Object.freeze(config.security) || null;
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

  get security() {
    return this[PRIVATE].security;
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
   * Checks whether or not a command is permitted to execute.
   *
   * Permission is granted to use a command using a map of guild ID values and
   * permission/role data as described in command.config.template.jsonc.
   *
   * This method may be overidden to permit command usage based on custom
   * criteria on a per command basis.
   *
   * @param {Discord.Message} message The message that contained the command.
   * @param {Array} admins A list of administrator user IDs.
   */
  isPermitted(message, admins = []) {
    if (admins.includes(message.author.id)) {
      return true;
    }
    if (this.security) {
      if (
        Object.entries(this.security).length === 0 &&
        this.security.constructor === Object
      ) {
        return true;
      }
      if (message.guild && message.guild.id in this.security) {
        const guild = message.guild,
              member = message.member,
              security = this.security[guild.id];
        if (!security.permissions && !security.roles) {
          return true;
        }
        if (security.roles) {
          for (let role of security.roles) {
            const roleID = guild.roles.find(elem => elem.name === role);
            if (member.roles.has(roleID)) {
              return true;
            }
          }
        }
        if (this.security.permissions) {
          return member.permissions.has(security.permissions);
        }
      }
    }
    return false;
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
