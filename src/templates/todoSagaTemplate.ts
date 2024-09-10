export function generateTodoSaga(middleware: string): string {
  if (middleware === "thunk") {
    return "";
  }
  return `
  import { call, put, takeEvery } from 'redux-saga/effects';
  import axios from 'axios';
  import { fetchTodos, fetchTodosSuccess, fetchTodosFailure } from '../../slices/todos';
  
  function* fetchAllTodos() {
    try {
      yield put(fetchTodos());
      const response = yield call(axios.get, '/api/todos');
      yield put(fetchTodosSuccess(response.data));
    } catch (error) {
      yield put(fetchTodosFailure(error.message));
    }
  }
  
  export function* watchFetchTodos() {
    yield takeEvery('todos/fetchTodos', fetchAllTodos);
  }
    `;
}
