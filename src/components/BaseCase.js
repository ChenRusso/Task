import React, { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/lib/languages/javascript';
import './CodeEditor.css';
import { useParams } from 'react-router-dom';
import {socket} from "../App";

const BaseCase = () => {

  const codeRef = useRef({});
  const { id } = useParams();
  const [messageReceived, setMessageReceived] = useState("");
  const [isFirstUser, setIsFirstUser] = useState(false);

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
      // hljs.highlightBlock(codeRef.current);
    });

    socket.emit('is_first_user');

    socket.on('receive_is_first_user', (isFirst) => {
      console.log( "is first ? " + isFirst)
      setIsFirstUser(isFirst);
    });


    getQuestionCodeById(id)
      .then((questionCode) => {
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
          contentEditable={!isFirstUser}
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


