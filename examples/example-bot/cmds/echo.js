'use strict';

class EchoCmd extends OP.Command {
  constructor(config) {
    super(config);
  }

  async exec(argv, message, logger) {
    let msg = message.content.replace(message.client.user, '');
    msg = msg.replace(argv[0], '');
    return message.channel.send(msg);
  }
}

module.exports = EchoCmd;
