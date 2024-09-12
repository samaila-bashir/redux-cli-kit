#!/usr/bin/env node

import { program } from 'commander';
import { setupRedux } from './src/setupRedux.js';
import { generateSliceAndSaga } from './src/generateSliceSaga.js';
import { resetProject } from './src/utilities/helpers/resetProject.js';

// "init" command for Redux setup
program
  .command('init')
  .description('Set up Redux, slices, saga or thunk, and store configuration')
  .option('--saga', 'Include Redux Saga in the setup')
  .option('--thunk', 'Include Redux Thunk in the setup')
  .action(async (options: { saga: boolean; thunk: boolean }) => {
    await setupRedux(options);
  });

// "generate" command for creating slices and sagas or thunks
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
        ? 'saga'
        : options.thunk
          ? 'thunk'
          : 'saga'; // default to saga if not specified
      await generateSliceAndSaga(model, middleware);
    }
  );

// "reset" command for cleaning up the store directory and uninstalling node modules
program
  .command('reset')
  .description(
    'Clean up the existing store structure and uninstall installed node modules'
  )
  .action(async () => {
    await resetProject();
  });

program.parse(process.argv);
