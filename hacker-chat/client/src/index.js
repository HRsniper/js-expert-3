import Events from "events";
import CliConfig from "./cliConfig.js";
import TerminalController from "./terminalController.js";
import SocketClient from "./socket.js";

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);
// console.log(config);

const componentEmitter = new Events();
const controller = new TerminalController();
const socketClient = new SocketClient(config);

await socketClient.initialize();
await controller.initializeTable(componentEmitter);
