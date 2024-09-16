export function generateSingleActionSaga(modelName: string): string {
  return `
    import { call, put, takeLatest } from 'redux-saga/effects';
    import axios from 'axios';
    import { fetch${modelName}, fetch${modelName}Success, fetch${modelName}Failure } from '../slices/${modelName.toLowerCase()}';

    function* fetch${modelName}Saga(): Generator<any, void, { data: any }> {
      try {
        const response = yield call(axios.get, '/api/${modelName.toLowerCase()}');
        yield put(fetch${modelName}Success(response.data));
      } catch (error: unknown) {
        if (error instanceof Error) {
          yield put(fetch${modelName}Failure(error.message));
        } else {
          yield put(fetch${modelName}Failure('An unknown error occurred'));
        }
      }
    }

    export default function* ${modelName.toLowerCase()}Saga() {
      yield takeLatest(fetch${modelName}.type, fetch${modelName}Saga);
    }
  `;
}
