import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

const AsyncCase = lazy(() => import('./AsyncCase'));
const PromiseExample = lazy(() => import('./PromiseExample'));
const EventHandling = lazy(() => import('./EventHandling'));
const ErrorHandling = lazy(() => import('./ErrorHandling'));
const BaseCase = lazy(() => import('./BaseCase'));

const CodeBlock = () => {
  const { name } = useParams();

  let selectedComponent;

  switch (name) {
    case 'Async Case':
      selectedComponent = AsyncCase;
      break;
    case 'Promise Example':
      selectedComponent = PromiseExample;
      break;
    case 'Event Handling':
      selectedComponent = EventHandling;
      break;
    case 'Error Handling':
      selectedComponent = ErrorHandling;
      break;
    case 'Base Case':
      selectedComponent = BaseCase;
      break;
    default:
      return <div>No such code block found.</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {React.createElement(selectedComponent)}
    </Suspense>
  );
};

export default CodeBlock;


