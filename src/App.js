import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lobby from "./components/Lobby";
import BaseCase from "./components/BaseCase";

const socket = io.connect("http://localhost:3001");

const App = () => {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    socket.emit("send_message", { message });
  };

  const handleStopTyping = () => {
    socket.emit("stop_typing");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });

    socket.on("user_typing", () => {
      setIsTyping(true);
    });

    socket.on("user_stop_typing", () => {
      setIsTyping(false);
    });
  }, [socket]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/code-block/:id" component={BaseCase} />
        </Routes>
      </Router>

      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
          socket.emit("send_message", { message });
        }}
        onBlur={handleStopTyping} // Notify stop typing
      />
      <button onClick={sendMessage}>Send</button>
      {messageReceived}
    </div>
  );
};

export default App;

