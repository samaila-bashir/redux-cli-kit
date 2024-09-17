import chalk from 'chalk';
import { chooseFramework } from '../helpers/utils.js';
import { handleReactInitialization } from './react/reactInitialization.js';
/**
 * Handles the framework selection and initialization process.
 * @param options - The command options.
 */
export async function handleFrameworkInitialization(options) {
    const framework = options.saga || options.thunk ? 'react' : await chooseFramework();
    if (framework === 'react') {
        await handleReactInitialization(options);
    }
    else {
        console.log(chalk.red('Other frameworks are coming soon. You can only choose React for now.'));
        process.exit(1);
    }
}
