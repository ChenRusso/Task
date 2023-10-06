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
  const [messageReceived, setMessageReceived] = useState("");
  const [questionReceived, setQuestionReceived] = useState("");


  const getQuestionCodeById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/request_question/${id}`);
      const data = await response.json();
      return data.question.code;  // Assuming the question is in a 'question' property
    } catch (error) {
      console.error('Error retrieving question code:', error);
      throw error;  // Throw the error to handle it in the caller
    }
  };

  useEffect(() => {
    //מאזין לאירוע בשם receive_message
    // הדאטה זה מה שמקבלים מהשרת
    socket.on('receive_message', (data) => {
      //אחראית להצגת ההודעה
      setMessageReceived(data);
      //להדגיש בלוק קוד
      hljs.highlightBlock(codeRef.current);
    });


// Call the function and log the result
    getQuestionCodeById(id)
      .then((questionCode) => {
        console.log('Question Code:', questionCode);
        setQuestionReceived(questionCode);
        setMessageReceived(questionCode);
      })
      .catch((error) => {
        console.error('Error:', error);
      });



    hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));//לציין שהקוד בJS
    hljs.highlightBlock(codeRef.current);//הדגשת קוד ספציפי
  }, [id]);


 //    מגדיר פונקציה המטפלת בשינויי קלט משתמש  הוא מעדכן את ממשק המשתמש כך שישקף את הקוד שהשתנה
  const handleUserCodeChange = (event) => {
    const updatedCode = event.target.innerText;
    // אחראית לעדכון ממשק המשתמש כדי להציג את הקוד המעודכן של המשתמש.
    setMessageReceived(updatedCode);
    setQuestionReceived(updatedCode);
    hljs.highlightBlock(codeRef.current);
    socket.emit('send_message', updatedCode);
  };

  return (
    <div className="code-editor">
      <div>
        <h2>Question:</h2>
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
