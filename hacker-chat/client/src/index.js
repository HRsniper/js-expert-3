import Events from "events";
import CliConfig from "./cliConfig.js";
import EventManager from "./eventManager.js";
import SocketClient from "./socket.js";
import TerminalController from "./terminalController.js";

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);

const componentEmitter = new Events();
const controller = new TerminalController();
const socketClient = new SocketClient(config);

await socketClient.initialize();

const eventManager = new EventManager({ componentEmitter, socketClient });
const events = eventManager.getEvents();
socketClient.attachEvents(events);

const data = {
  roomId: config.room,
  userName: config.username
};

eventManager.joinRoomAndWaitForMessages(data);

await controller.initializeTable(componentEmitter);
