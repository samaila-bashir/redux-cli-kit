#!/usr/bin/env node

import { program } from 'commander';
import { generateSliceAndSaga } from './src/templates/react/redux/common/generateSliceSaga.js';
import { resetProject } from './src/utilities/helpers/resetProject.js';
import initCommand from './src/utilities/command-actions/initCommand.js';

program
  .command('init')
  .description(
    'Set up state management (e.g., Redux with Saga or Thunk) and other configurations.'
  )
  .action(async () => {
    await initCommand();
  });

// Command for generating slices and sagas or thunks
program
  .command('generate <model>')
  .description(
    'Generate a new Redux slice (and optionally saga if Saga is used) for a model'
  )
  .option('--saga', 'Generate a saga for the model (if Saga is being used)')
  .option('--thunk', 'Generate a thunk for the model (if Thunk is being used)')
  .action(
    async (model: string, options: { saga?: boolean; thunk?: boolean }) => {
      const middleware = options.saga
        ? 'reduxSaga'
        : options.thunk
          ? 'reduxThunk'
          : 'reduxSaga'; // default to saga if not specified
      await generateSliceAndSaga(model, middleware);
    }
  );

// Command for resetting the project
program
  .command('reset')
  .description(
    'Clean up the existing store structure and uninstall installed node modules'
  )
  .action(async () => {
    await resetProject();
  });

program.parse(process.argv);
