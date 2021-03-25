import Event from "events";

export default class SocketClient {
  #serverConnection = {};
  #serverListener = new Event();

  constructor({ host, port, protocol }) {
    this.host = host;
    this.port = port;
    this.protocol = protocol;
  }

  async sendMessage(event, message) {
    const data = JSON.stringify({ event, message });
    // this.#serverConnection.write(`${data}\n`);
    this.#serverConnection.write(data);
  }

  attachEvents(events) {
    this.#serverConnection.on("data", (data) => {
      try {
        data
          .toString()
          .split("\n")
          .filter((line) => !!line)
          .map(JSON.parse)
          .map(({ event, message }) => {
            this.#serverListener.emit(event, message);
          });
      } catch (error) {
        console.log("invalid!", data.toString(), error);
      }
    });

    this.#serverConnection.on("end", () => {
      console.log("I disconnected!!");
    });

    this.#serverConnection.on("error", (error) => {
      console.error("ERROR!", error);
    });

    for (const [key, value] of events) {
      this.#serverListener.on(key, value);
    }
  }

  async createConnection() {
    const options = {
      port: this.port,
      host: this.host,
      headers: {
        Connection: "Upgrade",
        Upgrade: "websocket"
      }
    };

    const http = await import(this.protocol);
    const req = http.request(options);
    req.end();

    return new Promise((resolve) => {
      req.once("upgrade", (res, socket) => resolve(socket));
    });
  }

  async initialize() {
    this.#serverConnection = await this.createConnection();
    console.log("I connected to the server!!");
  }
}
