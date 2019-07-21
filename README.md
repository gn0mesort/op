# `OP`

`OP` is a common base for Discord bots. It can be used either as a NodeJS library or as an executable command which loads a configured bot for you.

## Installation

```sh
npm -g install gn0mesort/op
```

## Usage

```sh
op /path/to/config.json
```

or

```js
const OP = require('op');
```

## Invoking Commands

```none
@<MY_BOT> <COMMAND> [ARGS...]
```

## Configuration

All configuration data is described in the corresponding `*.config.template.jsonc` files in `examples/`. The simplest possible valid configuration would look like this:

```json
{
  "token": "<YOUR_BOT_TOKEN>"
}
```

where `<YOUR_BOT_TOKEN>` is a valid Discord bot token.

More realistically a valid configuration will look like:

```json
{
  "token": "<YOUR_BOT_TOKEN>",
  "name": "example-bot",
  "version": "1.0.0",
  "permissions": [ "ADMINISTRATOR" ],
  "plugins": [
    {
      "name": "management",
      "description": "Introduces management functions via a command interface.",
      "version": "1.0.0",
      "path": "plugins/management.js",
      "enabled": true
    }
  ],
  "commands": [
    {
      "name": "echo",
      "description": "Echos command arguments.",
      "version": "1.0.0",
      "help": "USAGE: echo <TEXT>",
      "path": "cmds/echo.js"
    },
    {
      "name": "fetch-user",
      "description": "Fetches user data from Discord.",
      "version": "1.0.0",
      "help": "USAGE: fetch-user <USER_ID>"
    }
  ]
}
```

Configuration files are loaded by `require()` in `op` so they must be valid requirable files (Node modules or JSON files).

## Writing Commands and Plugins

When commands are loaded by the `op` executable script there's no need to load the library in each module. Instead the library is made available as a global value called `OP`. To retrieve the underlying `discord.js` library you may reference `OP.Discord`. For examples check out the `examples/` directory.

## Library Usage

`op` can be used as a library if you prefer it over using the executable script.

```js
'use strict';

const OP = require('op'); // Load the library

// Define a command
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

// Define bot configuration
const config = {
  token: "",
  name: "op",
  version: "1.0.0",
  permissions: [ "ADMINISTRATOR" ],
  commands: [
    {
      name: "echo",
      description: "Echos command arguments.",
      version: "1.0.0",
      help: "USAGE: echo <TEXT>"
    }
  ]
},
// Preload commands
commands = {
  echo: new EchoCmd(config.commands[0])
};

// Start the bot
const bot = new Bot(new Discord.Client(), config, commands);
```

## Security

`op` makes no attempts to verify or validate the code that you use in commands or plugins. You should exercise caution loading any module (command, plugin, whatever) that you're not familiar with. The modules `op` loads are just NodeJS modules and so in theory they could do anything to your system that NodeJS can.
