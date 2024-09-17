/**
 * Generates a string representation of a root reducer for a Redux store.
 *
 * @returns {string} A string containing the code for a root reducer that combines
 *                   the todos reducer and allows for additional reducers to be added.
 */
export function generateRootReducer() {
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
