import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { generateTodoSlice } from "./templates/todoSliceTemplate.js";
import { generateTodoSaga } from "./templates/todoSagaTemplate.js";
import { generateStoreConfig } from "./templates/storeConfigTemplate.js";
import { generateRootReducer } from "./templates/rootReducerTemplate.js";
import { generateRootSaga } from "./templates/rootSagaTemplate.js";
import { generateSagaActions } from "./templates/sagaActionsTemplate.js";

interface SetupOptions {
  saga?: boolean;
  thunk?: boolean;
}

// Function to ask the user whether to use Redux Saga or Thunk
async function chooseMiddleware(): Promise<string> {
  const { middleware } = await inquirer.prompt([
    {
      type: "list",
      name: "middleware",
      message: "Which middleware would you like to use?",
      choices: ["Redux Thunk", "Redux Saga"],
    },
  ]);

  return middleware === "Redux Thunk" ? "thunk" : "saga";
}

// Function to install Redux and dependencies based on user choice
async function installDependencies(middleware: string): Promise<void> {
  const basePackages = ["redux", "@reduxjs/toolkit", "redux-persist", "axios"];
  const middlewarePackage =
    middleware === "thunk" ? "redux-thunk" : "redux-saga";

  console.log(
    chalk.green(
      `Installing Redux, Redux Toolkit, redux-persist, and ${middlewarePackage}...`
    )
  );
  await execa("npm", ["install", ...basePackages, middlewarePackage]);
}

// Function to create the Redux store structure and configuration files
async function createStoreStructure(middleware: string): Promise<void> {
  const srcDir = path.join(process.cwd(), "src/store");
  const slicesDir = path.join(srcDir, "slices");
  const sagasDir = path.join(srcDir, "sagas");

  // Ensure the slices and sagas directories are created
  await fs.ensureDir(path.join(slicesDir, "todos"));
  await fs.ensureDir(path.join(sagasDir, "todos"));

  // Create a sample slice for the todo model
  await fs.writeFile(
    path.join(slicesDir, "todos", "index.ts"),
    generateTodoSlice()
  );

  // Create a sample saga for the todo model
  await fs.writeFile(
    path.join(sagasDir, "todos", "index.ts"),
    generateTodoSaga(middleware)
  );

  // Create the root reducer combining all slices
  await fs.writeFile(path.join(slicesDir, "index.ts"), generateRootReducer());

  // Create the root saga combining all sagas
  await fs.writeFile(path.join(sagasDir, "index.ts"), generateRootSaga());

  // Create the actions directory inside sagas, with a sample enum action file
  const actionsDir = path.join(sagasDir, "actions");
  await fs.ensureDir(actionsDir);
  await fs.writeFile(path.join(actionsDir, "index.ts"), generateSagaActions());

  // Create the store configuration file
  await fs.writeFile(
    path.join(srcDir, "index.ts"),
    generateStoreConfig(middleware)
  );

  console.log(chalk.green("Redux store setup complete!"));
}

// Initial setup function for the CLI command
export async function setupRedux(options: SetupOptions): Promise<void> {
  const middleware = options.saga
    ? "saga"
    : options.thunk
    ? "thunk"
    : await chooseMiddleware();

  await installDependencies(middleware);
  await createStoreStructure(middleware);
}
