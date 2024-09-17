import chalk from 'chalk';
import { chooseStateManagement } from '../../helpers/utils.js';
import installDependencies from '../../helpers/installDependencies.js';
import { createStoreStructure } from './helpers/createStoreStructure.js';

interface SetupOptions {
  middleware?: 'reduxSaga' | 'reduxThunk';
}

/**
 * Sets up Redux with the specified options and model name.
 * @param options - The setup options.
 * @param modelName - The name of the model.
 */
export async function setupRedux(
  options: SetupOptions,
  modelName: string
): Promise<void> {
  let { middleware } = options;
  try {
    if (!middleware) {
      middleware = (await chooseStateManagement()) as
        | 'reduxSaga'
        | 'reduxThunk';
    }

    await installDependencies(middleware);
    await createStoreStructure(middleware, modelName);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes('User force closed the prompt')
    ) {
      console.log(chalk.yellow('Process interrupted. Exiting...'));
      process.exit(0);
    } else {
      console.error(
        chalk.red('An error occurred:'),
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}
