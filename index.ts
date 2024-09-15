#!/usr/bin/env node

import { program } from 'commander';
import { resetProject } from './src/utilities/helpers/resetProject.js';
import initCommand from './src/utilities/command-actions/initCommand.js';
import { generateModel } from './src/templates/react/redux/common/generate.js';

program
  .command('init')
  .description(
    'Set up state management (e.g., Redux with Saga, Thunk, or other configurations).'
  )
  .option(
    '--saga',
    'Initializes your project with Redux Saga for managing side effects.'
  )
  .option(
    '--thunk',
    'Initializes your project with Redux Thunk for asynchronous logic.'
  )
  // Add more options here as you add more state management setups
  .action(async (options: { saga: boolean; thunk: boolean }) => {
    await initCommand(options);
  });

// Command for generating slices and sagas or thunks
program
  .command('generate <model>')
  .description('Generate a slice, saga, or thunk for the model')
  .option('--slice', 'Generate only the slice for the model')
  .option('--saga', 'Generate only the saga for the model')
  .option('--thunk', 'Generate only the thunk for the model')
  .option(
    '--action <action>',
    'Generate a single action for the model (default: fetch)'
  )
  .action(
    async (
      model: string,
      options: {
        slice?: boolean;
        saga?: boolean;
        thunk?: boolean;
        action?: string;
      }
    ) => {
      await generateModel(model, options);
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
