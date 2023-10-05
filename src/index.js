import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/default.css';
import 'highlight.js/styles/github.css';
hljs.initHighlightingOnLoad();
ReactDOM.render(<App />, document.getElementById('root'));
