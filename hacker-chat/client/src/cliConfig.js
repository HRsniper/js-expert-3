export default class CliConfig {
  constructor({ username, room, hostUrl }) {
    this.username = username;
    this.room = room;

    const { hostname, port, protocol } = new URL(hostUrl);
    this.host = hostname;
    this.port = port;
    this.protocol = protocol.replace(/\W/, "");
  }

  static parseArguments(commands) {
    const cmd = new Map();

    for (const key in commands) {
      const commandPrefix = "--";
      const command = commands[key];
      const index = parseInt(key);

      if (!command.includes(commandPrefix)) continue;

      const commandKey = command.replace(commandPrefix, "");
      const commandValue = commands[index + 1];
      cmd.set(commandKey, commandValue);
    }

    return new CliConfig(Object.fromEntries(cmd));
  }
}
