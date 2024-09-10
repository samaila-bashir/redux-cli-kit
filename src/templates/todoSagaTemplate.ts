export function generateTodoSaga(middleware: string): string {
  if (middleware === "thunk") {
    return "";
  }
  return `
import { call, put, takeEvery } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import { fetchTodos, fetchTodosSuccess, fetchTodosFailure } from '../../slices/todos';
import { SAGA_ACTIONS } from '../actions';

interface ITodoResponse {
  data: any[]; // You can replace this with the actual Todo type/interface
}

function* fetchAllTodos(): Generator<any, void, AxiosResponse<ITodoResponse>> {
  try {
    yield put(fetchTodos());
    
    const response = yield call(axios.get, '/api/todos');
    
    yield put(fetchTodosSuccess(response.data));
  } catch (error: any) {
    yield put(fetchTodosFailure(error.message));
  }
}

export function* watchFetchTodos() {
  yield takeEvery(SAGA_ACTIONS.FETCH_TODOS, fetchAllTodos);
}
  `;
}
