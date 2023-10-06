import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lobby from "./components/Lobby";
import BaseCase from "./components/BaseCase";

export const socket = io.connect("http://localhost:3001");

const App = () => {

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });
  }, [socket]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/code-block/:id" element={<BaseCase />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

