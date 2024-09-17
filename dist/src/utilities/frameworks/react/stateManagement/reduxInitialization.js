import { setupRedux } from '../../../react/redux/setupRedux.js';
import { writeConfigFile } from '../../../helpers/config.js';
/**
 * Handles the initialization of Redux with either Saga or Thunk middleware.
 * @param stateManagement - The chosen state management option ('reduxSaga' or 'reduxThunk').
 */
export async function handleReduxInitialization(stateManagement) {
    const middleware = stateManagement === 'reduxSaga' ? 'reduxSaga' : 'reduxThunk';
    await setupRedux({ middleware }, 'todo');
    writeConfigFile({ framework: 'react', stateManagement });
}
