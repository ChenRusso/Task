import React, { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/lib/languages/javascript';
import './CodeEditor.css';
import { useParams } from 'react-router-dom';
import { socket } from "../App";
import SmileyImage from '../images/Smiley.png';

const BaseCase = () => {

  const codeRef = useRef({});
  const { id } = useParams(); //Holds the ID of the question
  const [messageReceived, setMessageReceived] = useState("");
  const [isFirstUser, setIsFirstUser] = useState(false); // State to check first User
  const [userAnswer, setUserAnswer] = useState(""); // State to hold user's answer


  const getQuestionCodeById = async (id) => {
    try {
      return new Promise((resolve, reject) => {
        // Request the question code from the server via socket
        socket.emit('request_question_code', id);

        // Listen for the response from the server
        socket.once('send_question_code', (data) => {
          if (data && data.question) {
            resolve(data.question.code);
          } else {
            reject(new Error('No question code received'));
          }
        });

        // Listen for any errors
        socket.once('error', (error) => {
          reject(new Error(error.message));
        });
      });
    } catch (error) {
      throw error;
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
        // Display the PNG image with caption
        setMessageReceived(
          <div>
            <img src={SmileyImage} alt="Smiley" />
            <p>Well done, correct answer!</p>
          </div>
        );
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
    <div className="page-container">
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
      <button className="enlarged-button" onClick={handleCodeSubmit} disabled={isFirstUser}>
        Submit
      </button>
    </div>
    </div>
  );
};

export default BaseCase;



