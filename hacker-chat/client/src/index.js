import Events from "events";
import CliConfig from "./cliConfig.js";
import TerminalController from "./terminalController.js";
import SocketClient from "./socket.js";
import EventManager from "./eventManager.js";

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);
// console.log(config);

const componentEmitter = new Events();
const controller = new TerminalController();
const socketClient = new SocketClient(config);
const eventManager = new EventManager({ componentEmitter, socketClient });

const events = eventManager.getEvents();
socketClient.attachEvents(events);

const data = {
  roomId: config.room,
  username: config.username
};
eventManager.joinRoomAndWaitForMessages(data);

await socketClient.initialize();
await controller.initializeTable(componentEmitter);
