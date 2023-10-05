import React, { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/lib/languages/javascript';

import './CodeEditor.css';
import io from "socket.io-client"; // Import the updated CSS file


const socket = io.connect("http://localhost:3001");


const BaseCase = () => {
  const codeRef = useRef(null);

  const code = `
    const numbers = [1, 2, 3, 4, 5];
    let sum = 0;

    for (let i = 0; i < numbers.length; i++) {
      // Add the current element to the sum
      sum += numbers[i];
    }

    console.log('The sum of the numbers is: ' + sum);
  `;

  const [messageReceived, setMessageReceived] = useState(code);

  const handleUserCodeChange = (event) => {
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data);
    });
  }, [socket]);

  useEffect(() => {
    hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
    hljs.highlightBlock(codeRef.current);
  }, [code]);

  return (
    <div className="code-editor">
      <pre>
        <code
          ref={codeRef}
          className={`language-javascript`}
          contentEditable="true"
          suppressContentEditableWarning={true}
          onBlur={handleUserCodeChange}
          onInput={(event) => {
            socket.emit("send_message",  event.target.innerText);
          }}
        >
          {messageReceived}
        </code>
      </pre>
    </div>
  );
};

export default BaseCase;
