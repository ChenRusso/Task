import React, { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/lib/languages/javascript';
import './CodeEditor.css';
import { useParams } from 'react-router-dom';
import { socket } from "../App";
import SmileyImage from '../images/Smiley.png'; // Adjust the path accordingly

const BaseCase = () => {

  const codeRef = useRef({});
  const { id } = useParams();
  const [messageReceived, setMessageReceived] = useState("");
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [userAnswer, setUserAnswer] = useState(""); // State to hold user's answer

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

  const handleCodeSubmit = () => {
    // Define a function to handle the answer event
    const handleAnswerEvent = (questionsAnswer) => {
      // Compare user's answer with the correct answer
      // Normalize the user's answer and the correct answer for comparison
      const normalizedUserAnswer = userAnswer.toLowerCase().replace(/\s+/g, '');
      const normalizedCorrectAnswer = questionsAnswer.toLowerCase().replace(/\s+/g, '');

      // Compare user's answer with the normalized correct answer
      const isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
      if (isAnswerCorrect) {
        // Display the PNG image
        setMessageReceived(<img src={SmileyImage} alt="Smiley" />);
      } else {
        alert('Your answer is incorrect. Please try again.');
      }
    };

    // Remove any previous event listener for "send_question_answer"
    socket.off("send_question_answer");

    // Listen for the answer event
    socket.on("send_question_answer", handleAnswerEvent);

    // Request the question answer from the server
    socket.emit("question_answer", id);
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageReceived(data);
    });

    socket.emit('is_first_user');

    socket.on('receive_is_first_user', (isFirst) => {
      console.log("is first ? " + isFirst);
      setIsFirstUser(isFirst);
    });

    getQuestionCodeById(id)
      .then((questionCode) => {
        setMessageReceived(questionCode);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
    hljs.highlightBlock(codeRef.current);
  }, [id]);

  const handleUserCodeChange = (event) => {
    const updatedCode = event.target.innerText;
    setMessageReceived(updatedCode);
    hljs.highlightBlock(codeRef.current);
    setUserAnswer(updatedCode);
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
      <button onClick={handleCodeSubmit} disabled={isFirstUser}>
        Submit
      </button>
    </div>
  );
};

export default BaseCase;



