export function generateRootReducer(): string {
  return `
  import { combineReducers } from '@reduxjs/toolkit';
  import todosReducer from './todo';
  
  const rootReducer = combineReducers({
    todos: todosReducer,
    // Add other reducers here as needed
  });
  
  export default rootReducer;
    `;
}
