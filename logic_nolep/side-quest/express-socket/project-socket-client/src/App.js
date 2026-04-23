import React, { Component } from "react";
const io = require("socket.io-client");

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "localhost:4001",
      color: "white",
    };
  }

  send = (value) => {
    var socket = io(`ws://${this.state.endpoint}`, {
      transports: ["websocket"],
    });

    //send color to server
    socket.emit("change color", value);
  };

  setColor = (color) => {
    this.setState({ color });
  };

  componentDidMount = () => {
    var socket = io(`ws://${this.state.endpoint}`, {
      "force new connection": true,
      timeout: 10000,
      transports: ["websocket"],
      autoConnect: true,
      reconnectionDelayMax: 10000,
    });
    // ----------------------------------------------------------------
    // listeeeeeeeennnnnn
    // ----------------------------------------------------------------

    socket.on("connect", function (response) {
      console.log("connected");
    });

    socket.on("change color", (col) => {
      console.log(col);
      document.body.style.backgroundColor = col;
    });

    // ----------------------------------------------------------------
    // emiiiiiiiiitttttttttt
    //----------------------------------------------------------------

    // socket.emit('send', { name: "my name danang", message: "send text" }, function (result) {
    //   console.log(result);
    // });
  };

  render() {
    return (
      <div style={{ width: "100%", height: "100%", position: "fixed" }}>
        <div
          style={{
            textAlign: "center",
            position: "relative",
            top: "40%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h1>Click Me :)</h1>
          <button
            style={{ padding: "10px 15px", margin: "4px" }}
            id="blue"
            onClick={() => this.send("blue")}
          >
            Blue
          </button>
          <button
            style={{ padding: "10px 15px", margin: "4px" }}
            id="red"
            onClick={() => this.send("red")}
          >
            Red
          </button>
          <button
            style={{ padding: "10px 15px", margin: "4px" }}
            id="yellow"
            onClick={() => this.send("yellow")}
          >
            Yellow
          </button>
          <button
            style={{ padding: "10px 15px", margin: "4px" }}
            id="green"
            onClick={() => this.send("green")}
          >
            Green
          </button>
        </div>
      </div>
    );
  }
}
export default App;
