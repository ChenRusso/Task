import React from 'react';
import { Link } from 'react-router-dom';

const codeBlocks = [
  'Async Case',
  'Promise Example',
  'Event Handling',
  'Error Handling',
  'Base Case'
];

const Lobby = () => {
  return (
    <div>
      <h1>Choose Code Block</h1>
      <ul>
        {codeBlocks.map((block, index) => (
          <li key={index}>
            <Link to={`/code-block/${encodeURIComponent(block)}`}>{block}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;

