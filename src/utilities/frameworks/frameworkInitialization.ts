import chalk from 'chalk';
import { chooseFramework } from '../helpers/utils.js';
import { handleReactInitialization } from './react/reactInitialization.js';

interface InitOptions {
  saga?: boolean;
  thunk?: boolean;
}

/**
 * Handles the framework selection and initialization process.
 * @param options - The command options.
 */
export async function handleFrameworkInitialization(
  options: InitOptions
): Promise<void> {
  const framework =
    options.saga || options.thunk ? 'react' : await chooseFramework();

  if (framework === 'react') {
    await handleReactInitialization(options);
  } else {
    console.log(
      chalk.red(
        'Other frameworks are coming soon. You can only choose React for now.'
      )
    );
    process.exit(1);
  }
}
