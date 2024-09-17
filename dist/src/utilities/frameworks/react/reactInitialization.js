import chalk from 'chalk';
import { checkForPreviousUsage, chooseStateManagement, } from '../../helpers/utils.js';
import { handleReduxInitialization } from './stateManagement/reduxInitialization.js';
/**
 * Handles the React framework initialization process.
 * @param options - The command options.
 */
export async function handleReactInitialization(options) {
    await checkForPreviousUsage('react');
    let stateManagement;
    if (options.saga || options.thunk) {
        stateManagement = options.saga ? 'reduxSaga' : 'reduxThunk';
    }
    else {
        stateManagement = await chooseStateManagement();
    }
    if (stateManagement === 'reduxSaga' || stateManagement === 'reduxThunk') {
        await handleReduxInitialization(stateManagement);
    }
    else {
        console.log(chalk.yellow('More state management options are coming soon. Please select Redux Saga or Redux Thunk for now.'));
        process.exit(1);
    }
}
