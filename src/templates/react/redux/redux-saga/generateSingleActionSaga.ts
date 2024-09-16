export function generateSingleActionSaga(
  modelName: string,
  actionName: string
): string {
  const modelNameLowerCase = modelName.toLowerCase();
  const modelNameCapitalized =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);
  const actionCapitalized =
    actionName.charAt(0).toUpperCase() + actionName.slice(1);

  return `
    import { call, put, takeLatest } from 'redux-saga/effects';
    import axios from 'axios';
    import { ${actionCapitalized}${modelNameCapitalized}, ${actionCapitalized}${modelNameCapitalized}Success, ${actionCapitalized}${modelNameCapitalized}Failure } from '../slices/${modelNameLowerCase}';

    function* ${actionCapitalized}${modelNameCapitalized}Saga(): Generator<any, void, { data: any }> {
      try {
        const response = yield call(axios.get, '/api/${modelNameLowerCase}');
        yield put(${actionCapitalized}${modelNameCapitalized}Success(response.data));
      } catch (error: unknown) {
        if (error instanceof Error) {
          yield put(${actionCapitalized}${modelNameCapitalized}Failure(error.message));
        } else {
          yield put(${actionCapitalized}${modelNameCapitalized}Failure('An unknown error occurred'));
        }
      }
    }

    export default function* ${modelNameLowerCase}Saga() {
      yield takeLatest(${actionCapitalized}${modelNameCapitalized}.type, ${actionCapitalized}${modelNameCapitalized}Saga);
    }
  `;
}
