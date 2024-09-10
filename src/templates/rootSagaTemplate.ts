export function generateRootSaga(): string {
  return `
  import { all, fork } from 'redux-saga/effects';
  import { watchFetchTodos } from './todos';
  
  export default function* rootSaga() {
    yield all([
      fork(watchFetchTodos),
      // Add other sagas here as needed
    ]);
  }
    `;
}
