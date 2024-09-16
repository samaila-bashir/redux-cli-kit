import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as recast from 'recast';
import * as babelParser from '@babel/parser';
import { readConfigFile, writeConfigFile } from '../helpers/config.js';
import { generateModelSagaCRUD } from '../../templates/react/redux/redux-saga/generateModelSagaCRUD.js';
import { generateModelSliceThunk } from '../../templates/react/redux/redux-thunk/generateModelSliceThunk.js';
import { generateModelSliceSaga } from '../../templates/react/redux/redux-saga/generateModelSliceSaga.js';
import { generateSingleActionSliceSaga } from '../../templates/react/redux/redux-saga/generateSingleActionSliceSaga.js';
import { generateSingleActionSaga } from '../../templates/react/redux/redux-saga/generateSingleActionSaga.js';
import { generateSingleActionThunk } from '../../templates/react/redux/redux-thunk/generateSingleActionThunk.js';
import { chooseFramework, chooseStateManagement } from '../helpers/utils.js';
import { generateSingleActionSliceThunk } from '../../templates/react/redux/redux-thunk/generateSingleActionSliceThunk.js';
import { namedTypes } from 'ast-types';

// Function to generate slice, saga, or thunk based on user input
export async function generateCommand(
  modelName: string,
  options: { slice?: boolean; saga?: boolean; thunk?: boolean; action?: string }
): Promise<void> {
  let config = readConfigFile();
  let baseDir: string;

  // Check if config file exists
  if (!config) {
    console.log(
      chalk.yellow("No configuration file found. Let's configure your project.")
    );

    // Prompt the user for framework, state management, and store directory
    const framework = await chooseFramework();
    const stateManagement = await chooseStateManagement();

    const { specifiedDir } = await promptUserForDirectory();
    baseDir = specifiedDir;

    // Add the directory to the config and save
    config = { framework, stateManagement, storeDir: baseDir };
    writeConfigFile(config);
    console.log(chalk.green('Configuration file created.'));
  } else {
    baseDir = config.storeDir || path.join(process.cwd(), 'src/store');
  }

  // Proceed with the rest of the model generation logic
  const sliceDir = path.join(baseDir, `slices/${modelName.toLowerCase()}`);
  const sagaDir = path.join(baseDir, `sagas/${modelName.toLowerCase()}`);

  const sliceFilePath = path.join(sliceDir, 'index.ts');
  const sagaFilePath = path.join(sagaDir, 'index.ts');

  const stateManagement = config.stateManagement;
  const action = options.action;

  // Determine customSlicePath based on the user's directory selection or fallback to default
  const customSlicePath = path.relative(sagaDir, sliceDir);

  // Check if the model (slice file) exists
  const sliceFileExists = await fs.pathExists(sliceFilePath);

  // Generate full CRUD or individual actions based on options
  if (!options.slice && !options.saga && !options.thunk) {
    // Full CRUD generation
    if (!sliceFileExists) {
      // Model does not exist, create it
      await fs.ensureDir(sliceDir);
      await fs.ensureDir(sagaDir);

      if (stateManagement === 'reduxSaga') {
        await fs.writeFile(sliceFilePath, generateModelSliceSaga(modelName));
        await fs.writeFile(
          sagaFilePath,
          generateModelSagaCRUD(modelName, customSlicePath)
        );
        console.log(
          chalk.green(`Full CRUD Slice and Saga for ${modelName} generated.`)
        );
      } else if (stateManagement === 'reduxThunk') {
        await fs.writeFile(sliceFilePath, generateModelSliceThunk(modelName));
        console.log(
          chalk.green(`Full CRUD Slice and Thunk for ${modelName} generated.`)
        );
      }
    } else {
      console.log(chalk.red(`Model ${modelName} already exists.`));
    }
  } else {
    // Individual file generation
    if (options.slice && !options.action) {
      if (!sliceFileExists) {
        // Create new slice
        await fs.ensureDir(sliceDir);
        const sliceContent =
          stateManagement === 'reduxSaga'
            ? generateModelSliceSaga(modelName)
            : generateModelSliceThunk(modelName);
        await fs.writeFile(sliceFilePath, sliceContent);
        console.log(chalk.green(`CRUD Slice for ${modelName} generated.`));
      } else {
        console.log(chalk.red(`Slice for ${modelName} already exists.`));
      }
    }

    if (options.slice && options.action) {
      if (!action) {
        console.error(chalk.red('Action name is required.'));
        return;
      }
      if (sliceFileExists) {
        // Add action to existing slice
        const existingSliceCode = await fs.readFile(sliceFilePath, 'utf8');
        if (stateManagement === 'reduxSaga') {
          const updatedSliceCode = addActionToSlice(
            existingSliceCode,
            modelName,
            action
          );
          await fs.writeFile(sliceFilePath, updatedSliceCode);
        } else if (stateManagement === 'reduxThunk') {
          const { newThunkCode, newExtraReducersCode } =
            generateSingleActionThunk(modelName, action);
          const updatedSliceCode = addThunkActionToSlice(
            existingSliceCode,
            newThunkCode,
            newExtraReducersCode
          );
          await fs.writeFile(sliceFilePath, updatedSliceCode);
        }
        console.log(
          chalk.green(`Action '${action}' added to slice '${modelName}'.`)
        );
      } else {
        // Create new slice with the action only
        await fs.ensureDir(sliceDir);
        if (stateManagement === 'reduxSaga') {
          const sliceContent = generateSingleActionSliceSaga(modelName, action);
          await fs.writeFile(sliceFilePath, sliceContent);
          console.log(
            chalk.green(
              `Slice for ${modelName} with action '${action}' created.`
            )
          );
        } else if (stateManagement === 'reduxThunk') {
          const sliceContent = generateSingleActionSliceThunk(
            modelName,
            action
          );
          await fs.writeFile(sliceFilePath, sliceContent);
          console.log(
            chalk.green(
              `Slice for ${modelName} with action '${action}' created.`
            )
          );
        }
      }
    }

    if (options.saga && options.action) {
      if (!action) {
        console.error(chalk.red('Action name is required.'));
        return;
      }
      if (stateManagement === 'reduxSaga') {
        if (await fs.pathExists(sagaFilePath)) {
          // Add action to existing saga
          const existingSagaCode = await fs.readFile(sagaFilePath, 'utf8');
          const updatedSagaCode = addActionToSaga(
            existingSagaCode,
            modelName,
            action
          );
          await fs.writeFile(sagaFilePath, updatedSagaCode);
          console.log(
            chalk.green(`Action '${action}' added to saga '${modelName}'.`)
          );
        } else {
          // Create new saga with the action
          await fs.ensureDir(sagaDir);
          const sagaContent = generateSingleActionSaga(modelName, action);
          await fs.writeFile(sagaFilePath, sagaContent);
          console.log(
            chalk.green(
              `Saga for ${modelName} with action '${action}' created.`
            )
          );
        }
      } else {
        console.log(chalk.red('Sagas are not used with redux-thunk.'));
      }
    }

    if (options.saga && !options.action) {
      if (stateManagement === 'reduxSaga') {
        if (await fs.pathExists(sagaFilePath)) {
          console.log(chalk.red(`Saga for ${modelName} already exists.`));
        } else {
          await fs.ensureDir(sagaDir);
          const sagaContent = generateModelSagaCRUD(modelName, customSlicePath);
          await fs.writeFile(sagaFilePath, sagaContent);
          console.log(chalk.green(`Saga for ${modelName} generated.`));
        }
      } else {
        console.log(chalk.red('Sagas are not used with redux-thunk.'));
      }
    }

    if (options.thunk && options.action) {
      if (!action) {
        console.error(chalk.red('Action name is required.'));
        return;
      }
      if (stateManagement === 'reduxThunk') {
        if (sliceFileExists) {
          // Add thunk action to existing slice
          const existingSliceCode = await fs.readFile(sliceFilePath, 'utf8');
          const { newThunkCode, newExtraReducersCode } =
            generateSingleActionThunk(modelName, action);
          const updatedSliceCode = addThunkActionToSlice(
            existingSliceCode,
            newThunkCode,
            newExtraReducersCode
          );
          await fs.writeFile(sliceFilePath, updatedSliceCode);
          console.log(
            chalk.green(
              `Thunk action '${action}' added to slice '${modelName}'.`
            )
          );
        } else {
          // Create new slice with the thunk action
          await fs.ensureDir(sliceDir);
          const fullSliceCode = generateModelSliceThunk(modelName);
          await fs.writeFile(sliceFilePath, fullSliceCode);
          console.log(chalk.green(`Slice for ${modelName} created.`));
          // Then add the action
          const existingSliceCode = await fs.readFile(sliceFilePath, 'utf8');
          const { newThunkCode, newExtraReducersCode } =
            generateSingleActionThunk(modelName, action);
          const updatedSliceCode = addThunkActionToSlice(
            existingSliceCode,
            newThunkCode,
            newExtraReducersCode
          );
          await fs.writeFile(sliceFilePath, updatedSliceCode);
          console.log(
            chalk.green(
              `Thunk action '${action}' added to slice '${modelName}'.`
            )
          );
        }
      } else {
        console.log(chalk.red('Thunks are not used with redux-saga.'));
      }
    }
  }

  if (config) {
    // Notify user to update actions and watchers (if applicable)
    console.log(
      chalk.whiteBright(
        'Reminder: Update your actions and watchers as necessary.'
      )
    );
  }
}

// Function to prompt user for directory
async function promptUserForDirectory(): Promise<{ specifiedDir: string }> {
  const { dir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'dir',
      message: 'Enter the directory where you want to generate the files:',
      default: './src/store',
    },
  ]);
  return { specifiedDir: dir };
}

// Function to add a new action to an existing slice using recast
function addActionToSlice(
  existingCode: string,
  modelName: string,
  actionName: string
): string {
  const modelNameCapitalized =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

  const ast = recast.parse(existingCode, {
    parser: {
      parse(source: string) {
        return babelParser.parse(source, {
          sourceType: 'module',
          plugins: ['typescript'],
        });
      },
    },
  });

  const newActionCode = `
  ${actionName}: (state: ${modelNameCapitalized}State) => {
    state.loading = true;
  },
  ${actionName}Success: (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}>) => {
    state.loading = false;
    state.${modelName.toLowerCase()} = action.payload;
  },
  ${actionName}Failure: (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}>) => {
    state.loading = false;
    state.error = action.payload;
  },
  `;

  // Wrap the code in curly braces
  const newActionAst = recast.parse(`({${newActionCode}})`, {
    parser: {
      parse(source: string) {
        return babelParser.parse(source, {
          sourceType: 'module',
          plugins: ['typescript'],
        });
      },
    },
  });

  // Extract the properties from the parsed object
  const newActions = newActionAst.program.body[0].expression.properties;

  // Insert the new actions into the reducers object
  let actionAdded = false;
  recast.visit(ast, {
    visitObjectProperty(path) {
      const key = path.node.key;
      if (
        recast.types.namedTypes.Identifier.check(key) &&
        key.name === 'reducers' &&
        recast.types.namedTypes.ObjectExpression.check(path.node.value)
      ) {
        // Found the reducers object
        const reducersObject = path.node.value;
        reducersObject.properties.push(...newActions);
        actionAdded = true;
        return false; // Stop traversal
      }
      // eslint-disable-next-line react/no-is-mounted
      this.traverse(path);
    },
  });

  if (!actionAdded) {
    console.error(
      'Failed to add action to slice. Could not find reducers object.'
    );
  }

  const updatedCode = recast.print(ast).code;
  return updatedCode;
}

// Function to add a new action to an existing saga using recast

function addActionToSaga(
  existingCode: string,
  modelName: string,
  actionName: string
): string {
  const ast = recast.parse(existingCode, {
    parser: {
      parse(source: string) {
        return babelParser.parse(source, {
          sourceType: 'module',
          plugins: ['typescript'],
        });
      },
    },
  });

  const actionCapitalized =
    actionName.charAt(0).toUpperCase() + actionName.slice(1);
  const modelNameLowerCase = modelName.toLowerCase();
  const modelNameCapitalized =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

  // Generate new saga code
  const newSagaCode = `
function* ${actionCapitalized}${modelNameCapitalized}Saga(): Generator<any, void, { data: any }> {
  try {
    const response = yield call(axios.get, '/api/${modelNameLowerCase}');
    yield put(${actionName}${modelNameCapitalized}Success(response.data));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(${actionName}${modelNameCapitalized}Failure(error.message));
    } else {
      yield put(${actionName}${modelNameCapitalized}Failure('An unknown error occurred'));
    }
  }
}
`;

  const newWatcherCode = `
yield takeLatest(${actionName}${modelNameCapitalized}.type, ${actionCapitalized}${modelNameCapitalized}Saga);
`;

  // Check if the saga function already exists
  let sagaExists = false;
  recast.visit(ast, {
    visitFunctionDeclaration(path) {
      if (
        path.node.id?.name === `${actionCapitalized}${modelNameCapitalized}Saga`
      ) {
        sagaExists = true;
        return false; // Stop traversal once found
      }
      // eslint-disable-next-line react/no-is-mounted
      this.traverse(path);
    },
  });

  // If the saga function already exists, skip adding it
  if (!sagaExists) {
    // Parse the new saga code into AST nodes
    const newSagaAst = recast.parse(newSagaCode, {
      parser: {
        parse(source: string) {
          return babelParser.parse(source, {
            sourceType: 'module',
            plugins: ['typescript'],
          });
        },
      },
    });

    // Insert the new saga function into the AST before the export
    const exportIndex = ast.program.body.findIndex(
      (node: namedTypes.Statement) =>
        recast.types.namedTypes.ExportDefaultDeclaration.check(node)
    );

    if (exportIndex >= 0) {
      ast.program.body.splice(exportIndex, 0, ...newSagaAst.program.body);
    } else {
      ast.program.body.push(...newSagaAst.program.body);
    }
  } else {
    console.log(
      `Saga function '${actionCapitalized}${modelNameCapitalized}Saga' already exists.`
    );
  }

  // Check if the watcher already exists
  let watcherExists = false;
  recast.visit(ast, {
    visitCallExpression(path) {
      const { callee, arguments: args } = path.node;

      if (
        recast.types.namedTypes.Identifier.check(callee) &&
        callee.name === 'takeLatest' &&
        args.length > 0 &&
        recast.types.namedTypes.MemberExpression.check(args[0]) &&
        recast.types.namedTypes.Identifier.check(args[0].property) &&
        args[0].property.name === `${actionName}${modelNameCapitalized}`
      ) {
        watcherExists = true;
        return false; // Stop traversal once found
      }
      // eslint-disable-next-line react/no-is-mounted
      this.traverse(path);
    },
  });

  // If the watcher does not exist, add it
  if (!watcherExists) {
    recast.visit(ast, {
      visitFunctionDeclaration(path) {
        if (
          recast.types.namedTypes.Identifier.check(path.node.id) &&
          (path.node.id.name === `${modelNameLowerCase}Saga` ||
            path.node.id.name === 'rootSaga')
        ) {
          const body = path.node.body.body;

          const newWatcherAst = recast.parse(
            `function* temp() { ${newWatcherCode} }`,
            {
              parser: {
                parse(source: string) {
                  return babelParser.parse(source, {
                    sourceType: 'module',
                    plugins: ['typescript'],
                  });
                },
              },
            }
          );

          const newWatcherStatement =
            newWatcherAst.program.body[0].body.body[0];

          body.push(newWatcherStatement);
          return false; // Stop traversal
        }
        // eslint-disable-next-line react/no-is-mounted
        this.traverse(path);
      },
    });
  } else {
    console.log(
      `Watcher for action '${actionName}${modelNameCapitalized}' already exists.`
    );
  }

  // Move export statement to the end
  const exportNode = ast.program.body.find((node: namedTypes.Statement) =>
    recast.types.namedTypes.ExportDefaultDeclaration.check(node)
  );

  if (exportNode) {
    ast.program.body = ast.program.body.filter(
      (node: namedTypes.Statement) => node !== exportNode
    );
    ast.program.body.push(exportNode);
  }

  const updatedCode = recast.print(ast).code;
  return updatedCode;
}

// Function to add a new thunk action to an existing slice using recast
function addThunkActionToSlice(
  existingCode: string,
  newThunkCode: string,
  newExtraReducersCode: string
): string {
  const ast = recast.parse(existingCode, {
    parser: {
      parse(source: string) {
        return babelParser.parse(source, {
          sourceType: 'module',
          plugins: ['typescript'],
        });
      },
    },
  });

  // Insert the new thunk at the appropriate place
  const newThunkAst = recast.parse(newThunkCode, {
    parser: {
      parse(source: string) {
        return babelParser.parse(source, {
          sourceType: 'module',
          plugins: ['typescript'],
        });
      },
    },
  });

  // Find the last import statement to insert after
  let lastImportIndex = -1;
  ast.program.body.forEach(
    (node: recast.types.namedTypes.Statement, index: number) => {
      if (recast.types.namedTypes.ImportDeclaration.check(node)) {
        lastImportIndex = index;
      }
    }
  );

  // Insert the new thunk after the last import
  ast.program.body.splice(lastImportIndex + 1, 0, ...newThunkAst.program.body);

  // Modify the createSlice call to add new extraReducers
  recast.visit(ast, {
    visitCallExpression(path) {
      if (
        recast.types.namedTypes.Identifier.check(path.node.callee) &&
        path.node.callee.name === 'createSlice' &&
        path.node.arguments.length > 0 &&
        recast.types.namedTypes.ObjectExpression.check(path.node.arguments[0])
      ) {
        const sliceConfig = path.node.arguments[0];
        const extraReducersProperty = sliceConfig.properties.find(
          (prop) =>
            recast.types.namedTypes.ObjectProperty.check(prop) &&
            recast.types.namedTypes.Identifier.check(prop.key) &&
            prop.key.name === 'extraReducers'
        );
        if (
          extraReducersProperty &&
          recast.types.namedTypes.ObjectProperty.check(extraReducersProperty) &&
          recast.types.namedTypes.ArrowFunctionExpression.check(
            extraReducersProperty.value
          )
        ) {
          const builderBody = extraReducersProperty.value.body;
          if (recast.types.namedTypes.BlockStatement.check(builderBody)) {
            const newExtraReducersAst = recast.parse(newExtraReducersCode, {
              parser: {
                parse(source: string) {
                  return babelParser.parse(source, {
                    sourceType: 'module',
                    plugins: ['typescript'],
                  });
                },
              },
            });

            // Append new builder calls
            builderBody.body.push(...newExtraReducersAst.program.body);
          }
        }
      }
      // eslint-disable-next-line react/no-is-mounted
      this.traverse(path);
    },
  });

  const updatedCode = recast.print(ast).code;
  return updatedCode;
}
