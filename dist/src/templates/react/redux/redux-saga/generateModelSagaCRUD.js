export function generateModelSagaCRUD(modelName, slicePath = '../../slices') {
    const modelNameLowerCase = modelName.toLowerCase();
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    return `
    import { call, put, takeLatest } from 'redux-saga/effects';
    import axios from 'axios';
    import { PayloadAction } from '@reduxjs/toolkit';
    import {
      fetch${modelNameCapitalized},
      fetch${modelNameCapitalized}Success,
      fetch${modelNameCapitalized}Failure,
      add${modelNameCapitalized},
      add${modelNameCapitalized}Success,
      add${modelNameCapitalized}Failure,
      update${modelNameCapitalized},
      update${modelNameCapitalized}Success,
      update${modelNameCapitalized}Failure,
      delete${modelNameCapitalized},
      delete${modelNameCapitalized}Success,
      delete${modelNameCapitalized}Failure,
    } from '${slicePath}/${modelNameLowerCase}';

    // Define the ${modelNameCapitalized} interface
    interface ${modelNameCapitalized} {
      id: number;
      title: string;
      completed: boolean;
    }

    // Fetch
    function* fetch${modelNameCapitalized}Saga() {
      try {
        const response: { data: ${modelNameCapitalized}[] } = yield call(axios.get, '/api/${modelNameLowerCase}');
        yield put(fetch${modelNameCapitalized}Success(response.data));
      } catch (error) {
        if (error instanceof Error) {
          yield put(fetch${modelNameCapitalized}Failure(error.message));
        } else {
          yield put(fetch${modelNameCapitalized}Failure('An unknown error occurred'));
        }
      }
    }

    // Add
    function* add${modelNameCapitalized}Saga(action: PayloadAction<${modelNameCapitalized}>) {
      try {
        const response: { data: ${modelNameCapitalized} } = yield call(axios.post, '/api/${modelNameLowerCase}', action.payload);
        yield put(add${modelNameCapitalized}Success(response.data));
      } catch (error) {
        if (error instanceof Error) {
          yield put(add${modelNameCapitalized}Failure(error.message));
        } else {
          yield put(add${modelNameCapitalized}Failure('An unknown error occurred'));
        }
      }
    }

    // Update
    function* update${modelNameCapitalized}Saga(action: PayloadAction<${modelNameCapitalized}>) {
      try {
        const response: { data: ${modelNameCapitalized} } = yield call(axios.put, \`/api/${modelNameLowerCase}/\${action.payload.id}\`, action.payload);
        yield put(update${modelNameCapitalized}Success(response.data));
      } catch (error) {
        if (error instanceof Error) {
          yield put(update${modelNameCapitalized}Failure(error.message));
        } else {
          yield put(update${modelNameCapitalized}Failure('An unknown error occurred'));
        }
      }
    }

    // Delete
    function* delete${modelNameCapitalized}Saga(action: PayloadAction<number>) {
      try {
        yield call(axios.delete, \`/api/${modelNameLowerCase}/\${action.payload}\`);
        yield put(delete${modelNameCapitalized}Success(action.payload));
      } catch (error) {
        if (error instanceof Error) {
          yield put(delete${modelNameCapitalized}Failure(error.message));
        } else {
          yield put(delete${modelNameCapitalized}Failure('An unknown error occurred'));
        }
      }
    }

    export default function* ${modelNameLowerCase}Saga() {
      yield takeLatest(fetch${modelNameCapitalized}.type, fetch${modelNameCapitalized}Saga);
      yield takeLatest(add${modelNameCapitalized}.type, add${modelNameCapitalized}Saga);
      yield takeLatest(update${modelNameCapitalized}.type, update${modelNameCapitalized}Saga);
      yield takeLatest(delete${modelNameCapitalized}.type, delete${modelNameCapitalized}Saga);
    }
  `;
}
