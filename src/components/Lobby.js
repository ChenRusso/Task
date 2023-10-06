import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import {socket} from "../App";
import './Loby.css';  // Import the CSS file for the Lobby component

const Lobby = () => {

  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const handleSocketConnection = () => {

    socket.emit('get_all_questions', () => {
    });

    socket.on('send_questions', (receivedQuestions) => {
      console.log('Received questions:', receivedQuestions);
      setQuestions(receivedQuestions);
    });

    socket.on('error', (errorMessage) => {
      setError(errorMessage);
    });

    return () => {
      socket.disconnect();
    };
  };

  useEffect(() => {
    handleSocketConnection();
  }, []);

  return (
    <div className="lobby-container">
      <h1>Choose Code Block</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {questions.length > 0 ? (
            questions.map((question) => (
              <li key={question._id}>
                <Link to={{ pathname: `/code-block/${question._id}` }}>
                  {question.question}
                </Link>
              </li>
            ))
          ) : (
            <p>Loading questions...</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Lobby;