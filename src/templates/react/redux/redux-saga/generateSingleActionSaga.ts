/**
 * Generates a Redux Saga for a single action.
 *
 * @param {string} modelName - The name of the model (e.g., 'user', 'product').
 * @param {string} actionName - The name of the action (e.g., 'fetch', 'create').
 * @returns {string} A string containing the generated Redux Saga code.
 *
 * @description
 * This function creates a Redux Saga template for a single action. It includes:
 * - Imports for redux-saga effects, axios, and action creators.
 * - A saga function that handles the API call and dispatches success/failure actions.
 * - A watcher saga that listens for the specified action type.
 *
 * The generated code assumes:
 * - The API endpoint follows the pattern '/api/{modelName}'.
 * - There are corresponding action creators and a slice file for the model.
 * - The action follows a request-success-failure pattern.
 *
 * @example
 * const sagaCode = generateSingleActionSaga('user', 'fetch');
 */
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
