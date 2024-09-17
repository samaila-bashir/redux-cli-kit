import fs from 'fs-extra';
import path from 'path';
import { generateTodoSaga } from '../../../../templates/react/redux/redux-saga/todoSagaTemplate.js';
import { generateRootSaga } from '../../../../templates/react/redux/redux-saga/rootSagaTemplate.js';
import { generateSagaActions } from '../../../../templates/react/redux/redux-saga/sagaActionsTemplate.js';

/**
 * Sets up Redux Saga specific files and directories.
 * @param srcDir - The source directory path.
 * @param modelNameLowerCase - The lowercase model name.
 * @param stateManagement - The chosen state management.
 */
export async function setupReduxSaga(
  srcDir: string,
  modelNameLowerCase: string,
  stateManagement: string
) {
  const sagasDir = path.join(srcDir, 'sagas');
  const modelSagaDir = path.join(sagasDir, modelNameLowerCase);

  await fs.ensureDir(modelSagaDir);
  await fs.writeFile(
    path.join(modelSagaDir, 'index.ts'),
    generateTodoSaga(stateManagement)
  );
  await fs.writeFile(path.join(sagasDir, 'index.ts'), generateRootSaga());

  const actionsDir = path.join(sagasDir, 'actions');
  await fs.ensureDir(actionsDir);
  await fs.writeFile(path.join(actionsDir, 'index.ts'), generateSagaActions());
}
