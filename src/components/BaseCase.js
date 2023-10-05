/*import React, { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/lib/languages/javascript';
import './CodeEditor.css';  // Import the updated CSS file
import io from "socket.io-client";
import { useParams} from "react-router-dom";

const socket = io.connect("http://localhost:3001");

const BaseCase = () => {
  const codeRef = useRef(null);
  const { Id } = useParams();
  const requestQuestionCode = () => {
    socket.emit("request_question_code", { Id });
  };
  // const code = `
  //   const numbers = [1, 2, 3, 4, 5];
  //   let sum = 0;
  //
  //   for (let i = 0; i < numbers.length; i++) {
  //     // Add the current element to the sum - Add your code here
  //   }
  //
  //   console.log('The sum of the numbers is: ' + sum);
  // `;

  const [messageReceived, setMessageReceived] = useState();

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
      <div>
        hello!!
      </div>
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

 */
import React, { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/lib/languages/javascript';
import './CodeEditor.css';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const socket = io.connect('http://localhost:3001');

const BaseCase = () => {
  const codeRef = useRef(null);
  const { id } = useParams();

  const [messageReceived, setMessageReceived] = useState('');

  useEffect(() => {
    const requestQuestionCode = async () => {
      // Request the question code based on the extracted question ID
      try {
        const response = await fetch(`http://localhost:3001/request_question_code/${id}`);
        const data = await response.json();
        setMessageReceived(data);
        hljs.highlightBlock(codeRef.current);
        socket.emit('send_message', data);
      } catch (error) {
        console.error('Error fetching question code:', error);
      }
    };
    requestQuestionCode();

    socket.on('receive_message', (data) => {
      setMessageReceived(data);
      hljs.highlightBlock(codeRef.current);
    });

    hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
    hljs.highlightBlock(codeRef.current);
  }, [id]);

  const handleUserCodeChange = (event) => {
    const updatedCode = event.target.innerText;
    setMessageReceived(updatedCode);
    hljs.highlightBlock(codeRef.current);
    socket.emit('send_message', updatedCode);
  };

  return (
    <div className="code-editor">
      <div>
        <h2>Question:</h2>
        <p>{messageReceived}</p>
      </div>
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
