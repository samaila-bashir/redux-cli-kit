import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { chooseStateManagement } from '../../helpers/utils.js';
import { generateTodoSaga } from '../../../templates/react/redux/redux-saga/todoSagaTemplate.js';
import { generateStoreConfig } from '../../../templates/react/redux/common/storeConfigTemplate.js';
import { generateRootReducer } from '../../../templates/react/redux/common/rootReducerTemplate.js';
import { generateRootSaga } from '../../../templates/react/redux/redux-saga/rootSagaTemplate.js';
import { generateSagaActions } from '../../../templates/react/redux/redux-saga/sagaActionsTemplate.js';
import { generateTodoComponent } from '../../../templates/react/redux/component/todoComponentTemplate.js';
import { generateTodoCSSModule } from '../../../templates/react/redux/component/todoComponentCSSTemplate.js';
import { generateTodoSliceThunk } from '../../../templates/react/redux/redux-thunk/todoSliceThunkTemplate.js';
import { generateTodoSliceSaga } from '../../../templates/react/redux/redux-saga/todoSliceSagaTemplate.js';
import installDependencies from '../../helpers/installDependencies.js';

interface SetupOptions {
  middleware?: 'reduxSaga' | 'reduxThunk';
}

async function createStoreStructure(stateManagement: string): Promise<void> {
  const srcDir = path.join(process.cwd(), 'src/store');
  const slicesDir = path.join(srcDir, 'slices');
  const todosDir = path.join(srcDir, '../todos');

  await fs.ensureDir(path.join(slicesDir, 'todos'));
  await fs.ensureDir(todosDir);

  // Create the correct slice based on the state management choice
  if (stateManagement === 'reduxThunk') {
    await fs.writeFile(
      path.join(slicesDir, 'todos', 'index.ts'),
      generateTodoSliceThunk()
    );
  } else if (stateManagement === 'reduxSaga') {
    await fs.writeFile(
      path.join(slicesDir, 'todos', 'index.ts'),
      generateTodoSliceSaga()
    );
  }

  // Create sagas if Redux Saga is chosen
  if (stateManagement === 'reduxSaga') {
    const sagasDir = path.join(srcDir, 'sagas');
    await fs.ensureDir(path.join(sagasDir, 'todos'));

    await fs.writeFile(
      path.join(sagasDir, 'todos', 'index.ts'),
      generateTodoSaga(stateManagement)
    );

    await fs.writeFile(path.join(sagasDir, 'index.ts'), generateRootSaga());

    const actionsDir = path.join(sagasDir, 'actions');
    await fs.ensureDir(actionsDir);
    await fs.writeFile(
      path.join(actionsDir, 'index.ts'),
      generateSagaActions()
    );
  }

  await fs.writeFile(path.join(slicesDir, 'index.ts'), generateRootReducer());

  await fs.writeFile(
    path.join(srcDir, 'index.ts'),
    generateStoreConfig(stateManagement)
  );

  await fs.writeFile(
    path.join(todosDir, 'index.tsx'),
    generateTodoComponent(stateManagement)
  );
  await fs.writeFile(
    path.join(todosDir, 'TodoComponent.module.css'),
    generateTodoCSSModule()
  );

  console.log(chalk.green('State management setup complete!'));
}

// Initial setup function for the CLI command
export async function setupRedux(options: SetupOptions): Promise<void> {
  let { middleware } = options;
  try {
    if (!middleware) {
      middleware = (await chooseStateManagement()) as
        | 'reduxSaga'
        | 'reduxThunk';
    }

    await installDependencies(middleware);
    await createStoreStructure(middleware);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message.includes('User force closed the prompt')) {
      console.log(chalk.yellow('Process interrupted. Exiting...'));
      process.exit(0);
    } else {
      console.error(chalk.red('An error occurred:'), error.message);
    }
  }
}
