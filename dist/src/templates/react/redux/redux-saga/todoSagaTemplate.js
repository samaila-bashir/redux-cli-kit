/**
 * Generates a Redux Saga template for todo operations.
 *
 * @param {string} middleware - The middleware type. If 'reduxThunk', returns an empty string.
 * @returns {string} A string containing the Redux Saga code for todo operations, or an empty string if the middleware is 'reduxThunk'.
 */
export function generateTodoSaga(middleware) {
    if (middleware === 'reduxThunk') {
        return '';
    }
    return `
import { call, put, takeEvery } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import {
  fetchTodos,
  fetchTodosSuccess,
  fetchTodosFailure,
  addTodo,
  updateTodo,
  deleteTodo
} from '../../slices/todo';
import { SAGA_ACTIONS } from '../actions';
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

interface ITodoResponse {
  id: number;
  title: string;
  completed: boolean;
}

// Worker saga for fetching todos (limit to 5)
function* fetchAllTodos(action: { type: string }): Generator<any, void, AxiosResponse<ITodoResponse[]>> {
  try {
    yield put(fetchTodos());

    // Fetch todos from JSONPlaceholder and limit the result to 5
    const response = yield call(axios.get, 'https://jsonplaceholder.typicode.com/todos?_limit=5');
    yield put(fetchTodosSuccess(response.data));
  } catch (error: any) {
    yield put(fetchTodosFailure(error.message));
  }
}

// Worker saga for adding a new todo
function* addNewTodo(action: { type: string; payload: ITodoResponse }): Generator<any, void, AxiosResponse<ITodoResponse>> {
  try {
    const response = yield call(axios.post, \`\${API_BASE_URL}/todos\`, action.payload);
    yield put(addTodo(response.data));
  } catch (error: any) {
    console.error(error);
  }
}

// Worker saga for updating an existing todo
function* updateExistingTodo(action: { type: string; payload: ITodoResponse }): Generator<any, void, AxiosResponse<ITodoResponse>> {
  try {
    const response = yield call(axios.put, \`\${API_BASE_URL}/todos/\${action.payload.id}\`, action.payload);
    yield put(updateTodo(response.data));
  } catch (error: any) {
    console.error(error);
  }
}

// Worker saga for deleting a todo
function* deleteExistingTodo(action: { type: string; payload: number }): Generator<any, void, AxiosResponse<void>> {
  try {
    yield call(axios.delete, \`\${API_BASE_URL}/todos/\${action.payload}\`);
    yield put(deleteTodo(action.payload));
  } catch (error: any) {
    console.error(error);
  }
}

// Watcher saga for all todo-related actions
export function* watchTodoActions(): Generator {
  yield takeEvery(SAGA_ACTIONS.FETCH_TODOS, fetchAllTodos);
  yield takeEvery(SAGA_ACTIONS.ADD_TODO, addNewTodo);
  yield takeEvery(SAGA_ACTIONS.UPDATE_TODO, updateExistingTodo);
  yield takeEvery(SAGA_ACTIONS.DELETE_TODO, deleteExistingTodo);
}
  `;
}
