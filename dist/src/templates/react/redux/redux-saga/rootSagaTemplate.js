/**
 * Generates a string representation of a root saga for a Redux-Saga setup.
 *
 * @returns {string} A string containing the code for the root saga function.
 *                   This includes importing necessary dependencies and defining
 *                   the rootSaga generator function that forks the watchTodoActions
 *                   saga and allows for additional sagas to be added as needed.
 */
export function generateRootSaga() {
    return `
  import { all, fork } from 'redux-saga/effects';
  import { watchTodoActions } from './todo';
  
  export default function* rootSaga() {
    yield all([
      fork(watchTodoActions),
      // Add other sagas here as needed
    ]);
  }
  `;
}
