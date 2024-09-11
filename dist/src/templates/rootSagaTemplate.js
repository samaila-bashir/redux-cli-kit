export function generateRootSaga() {
    return `
  import { all, fork } from 'redux-saga/effects';
  import { watchTodoActions } from './todos';
  
  export default function* rootSaga() {
    yield all([
      fork(watchTodoActions),
      // Add other sagas here as needed
    ]);
  }
  `;
}
