import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';

// Check if the project is configured with TypeScript  by checking for tsconfig.json
export async function checkForTypeScript(): Promise<boolean> {
  return fs.pathExists(path.join(process.cwd(), 'tsconfig.json'));
}

export async function chooseFramework(): Promise<string> {
  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Which Library or Framework are you using?',
      choices: [
        { name: 'React JS', value: 'react', disabled: false },
        { name: 'Angular JS (Coming Soon)', value: 'angular', disabled: true },
        { name: 'Vue JS (Coming Soon)', value: 'vue', disabled: true },
        { name: 'Svelte (Coming Soon)', value: 'svelte', disabled: true },
      ],
    },
  ]);

  return framework;
}

export async function chooseStateManagement(): Promise<string> {
  const { stateManagement } = await inquirer.prompt([
    {
      type: 'list',
      name: 'stateManagement',
      message: 'Which state management setup would you like to configure?',
      choices: [
        { name: 'Redux with Redux Saga', value: 'reduxSaga', disabled: false },
        {
          name: 'Redux with Redux Thunk',
          value: 'reduxThunk',
          disabled: false,
        },
        {
          name: 'React Query (Coming Soon)',
          value: 'reactQuery',
          disabled: true,
        },
        { name: 'Zustand (Coming Soon)', value: 'zustand', disabled: true },
        { name: 'Jotai (Coming Soon)', value: 'jotai', disabled: true },
      ],
    },
  ]);

  return stateManagement;
}

// Check if the tool has been used before in this project
export async function checkForPreviousUsage(framework: string): Promise<void> {
  const checkPaths: { [key: string]: string } = {
    react: './src/store', // For Redux or similar state management in React
    // Future check paths for other frameworks can go here
  };

  const pathToCheck = checkPaths[framework];
  const storeExists = await fs.pathExists(pathToCheck);

  if (storeExists) {
    console.log(
      chalk.yellow(
        'It looks like this tool has already been used in this project. Exiting to avoid conflicts.'
      )
    );
    process.exit(1);
  }
}
