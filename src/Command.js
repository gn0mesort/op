'use strict';

const PRIVATE = Symbol('PRIVATE');

class Command {
  constructor(config) {
    this[PRIVATE] = {};
    this[PRIVATE].name = config.name;
    this[PRIVATE].description = config.description;
    this[PRIVATE].version = config.version;
    this[PRIVATE].help = config.help;
    this[PRIVATE].path = config.path;
    this[PRIVATE].permissions = config.permissions;
    this[PRIVATE].config = Object.freeze(config.config);
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

  get permissions() {
    return this[PRIVATE].permissions;
  }

  get config() {
    return this[PRIVATE].config;
  }

  async exec(argv, message, logger) {
    throw Error('Not implemented.');
  }
}

module.exports = Command;
