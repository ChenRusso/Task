import React, { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/lib/languages/javascript';

import './CodeEditor.css';  // Import the updated CSS file
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

const BaseCase = () => {
  const codeRef = useRef(null);

  const code = `
    const numbers = [1, 2, 3, 4, 5];
    let sum = 0;

    for (let i = 0; i < numbers.length; i++) {
      // Add the current element to the sum - Add your code here
    }

    console.log('The sum of the numbers is: ' + sum);
  `;

  const [messageReceived, setMessageReceived] = useState(code);

  const handleUserCodeChange = (event) => {
    const updatedCode = event.target.innerText;
    setMessageReceived(updatedCode);
    hljs.highlightBlock(codeRef.current);
    socket.emit("send_message", updatedCode);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data);
      hljs.highlightBlock(codeRef.current);
    });
  }, [socket]);

  useEffect(() => {
    hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
    hljs.highlightBlock(codeRef.current);
  }, []);

  return (
    <div className="code-editor">
      <pre>
        <code
          ref={codeRef}
          className="language-javascript"
          contentEditable="true"
          suppressContentEditableWarning={true}
          onInput={handleUserCodeChange}
        >
          {messageReceived}
        </code>
      </pre>
    </div>
  );
};

export default BaseCase;
