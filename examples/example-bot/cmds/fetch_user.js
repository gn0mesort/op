'use strict';

const std = {
  path: require('path')
};

const OP = require(std.path.join(__dirname, '../../../index.js'));

class FetchUserCmd extends OP.Command {
  constructor(config) {
    super(config);
  }

  async exec(argv, message, logger) {
    if (!argv[1]) {
      let err = `Insuffiencent arguments.`
      message.channel.send(err);
      throw new Error(err);
    }
    let msg = new OP.Discord.RichEmbed();
    let user = null;
    try {
      if (!argv[1].match(/^\d+/g)) {
        throw new Error(`${argv[1]} is not a valid user ID.`);
      }
      user = await message.client.fetchUser(argv[1]);
    }
    catch (err) {
      message.channel.send(err.message);
      throw err;
    }
    msg.setTitle(user.tag);
    msg.setImage(user.avatarURL);
    msg.addField('ID', user.id, true);
    msg.addField('Created At', user.createdAt.toUTCString());
    msg.addField('Presence', user.presence.status, true);
    return message.channel.send(msg);
  }
}

module.exports = FetchUserCmd;
