import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";

// Function to ask the user whether to use Redux Saga or Thunk
async function chooseMiddleware() {
  const { middleware } = await inquirer.prompt([
    {
      type: "list",
      name: "middleware",
      message: "Which middleware would you like to use?",
      choices: ["Redux Thunk", "Redux Saga"],
    },
  ]);

  return middleware === "Redux Thunk" ? "thunk" : "saga";
}

// Function to install Redux and dependencies based on user choice
async function installDependencies(middleware) {
  const basePackages = ["redux", "@reduxjs/toolkit", "redux-persist"];
  const middlewarePackage =
    middleware === "thunk" ? "redux-thunk" : "redux-saga";

  console.log(
    chalk.green(
      `Installing Redux, Redux Toolkit, redux-persist, and ${middlewarePackage}...`
    )
  );

  await execa("npm", ["install", ...basePackages, middlewarePackage]);
}

// Function to create the Redux store structure and configuration files
async function createStoreStructure(middleware) {
  const srcDir = path.join(process.cwd(), "src/store");

  // Check if the store directory exists and remove it for a fresh start
  if (await fs.pathExists(srcDir)) {
    console.log(chalk.yellow("Cleaning up existing store directory..."));
    await fs.remove(srcDir);
  }

  const slicesDir = path.join(srcDir, "slices/todos"); // Slices directory
  const sagasDir = path.join(srcDir, "sagas/todos"); // Sagas directory

  // Ensure directories are created afresh
  await fs.ensureDir(slicesDir); // Create the slices directory
  await fs.ensureDir(sagasDir); // Create the sagas directory

  // Create a sample slice and saga for a todo model
  await fs.writeFile(path.join(slicesDir, "index.ts"), generateTodoSlice());
  await fs.writeFile(
    path.join(sagasDir, "index.ts"),
    generateTodoSaga(middleware)
  );

  // Create the store configuration file
  await fs.writeFile(
    path.join(srcDir, "index.ts"),
    generateStoreConfig(middleware)
  );

  console.log(chalk.green("Redux store setup complete!"));
}

// Initial setup function for the CLI command
export async function setupRedux(options) {
  const middleware = options.saga
    ? "saga"
    : options.thunk
    ? "thunk"
    : await chooseMiddleware();

  await installDependencies(middleware);
  await createStoreStructure(middleware);
}

// Sample template for creating a todo slice
function generateTodoSlice() {
  return `
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    fetchTodos: (state) => {
      state.loading = true;
    },
    fetchTodosSuccess: (state, action: PayloadAction<Todo[]>) => {
      state.loading = false;
      state.todos = action.payload;
    },
    fetchTodosFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (index >= 0) {
        state.todos[index] = action.payload;
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
  },
});

export const { fetchTodos, fetchTodosSuccess, fetchTodosFailure, addTodo, updateTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;
  `;
}

// Sample template for creating a saga for todos
function generateTodoSaga(middleware) {
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

// Sample template for store configuration
function generateStoreConfig(middleware) {
  return `
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './slices';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
${
  middleware === "saga"
    ? "import createSagaMiddleware from 'redux-saga';\nimport rootSaga from './sagas';"
    : ""
}

const sagaMiddleware = ${
    middleware === "saga" ? "createSagaMiddleware();" : "null;"
  }

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })${
      middleware === "saga" ? ".concat(sagaMiddleware)" : ""
    },
});

export const persistor = persistStore(store);
${middleware === "saga" ? "sagaMiddleware.run(rootSaga);" : ""}
  `;
}
