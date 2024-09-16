import recast from 'recast';
import * as babelParser from '@babel/parser';
/**
 * Adds a new action to an existing saga using Recast.
 *
 * @param {string} existingCode - The current code of the Redux saga.
 * @param {string} modelName - The name of the model for which the action is being added.
 * @param {string} actionName - The name of the action to be added.
 *
 * @returns {string} - Updated code with the new action added to the saga.
 */
export function addActionToSaga(existingCode, modelName, actionName) {
    const ast = recast.parse(existingCode, {
        parser: {
            parse(source) {
                return babelParser.parse(source, {
                    sourceType: 'module',
                    plugins: ['typescript'],
                });
            },
        },
    });
    const actionCapitalized = actionName.charAt(0).toUpperCase() + actionName.slice(1);
    const modelNameLowerCase = modelName.toLowerCase();
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
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
            if (path.node.id?.name === `${actionCapitalized}${modelNameCapitalized}Saga`) {
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
                parse(source) {
                    return babelParser.parse(source, {
                        sourceType: 'module',
                        plugins: ['typescript'],
                    });
                },
            },
        });
        // Insert the new saga function into the AST before the export
        const exportIndex = ast.program.body.findIndex((node) => recast.types.namedTypes.ExportDefaultDeclaration.check(node));
        if (exportIndex >= 0) {
            ast.program.body.splice(exportIndex, 0, ...newSagaAst.program.body);
        }
        else {
            ast.program.body.push(...newSagaAst.program.body);
        }
    }
    else {
        console.log(`Saga function '${actionCapitalized}${modelNameCapitalized}Saga' already exists.`);
    }
    // Check if the watcher already exists
    let watcherExists = false;
    recast.visit(ast, {
        visitCallExpression(path) {
            const { callee, arguments: args } = path.node;
            if (recast.types.namedTypes.Identifier.check(callee) &&
                callee.name === 'takeLatest' &&
                args.length > 0 &&
                recast.types.namedTypes.MemberExpression.check(args[0]) &&
                recast.types.namedTypes.Identifier.check(args[0].property) &&
                args[0].property.name === `${actionName}${modelNameCapitalized}`) {
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
                if (recast.types.namedTypes.Identifier.check(path.node.id) &&
                    (path.node.id.name === `${modelNameLowerCase}Saga` ||
                        path.node.id.name === 'rootSaga')) {
                    const body = path.node.body.body;
                    const newWatcherAst = recast.parse(`function* temp() { ${newWatcherCode} }`, {
                        parser: {
                            parse(source) {
                                return babelParser.parse(source, {
                                    sourceType: 'module',
                                    plugins: ['typescript'],
                                });
                            },
                        },
                    });
                    const newWatcherStatement = newWatcherAst.program.body[0].body.body[0];
                    body.push(newWatcherStatement);
                    return false; // Stop traversal
                }
                // eslint-disable-next-line react/no-is-mounted
                this.traverse(path);
            },
        });
    }
    else {
        console.log(`Watcher for action '${actionName}${modelNameCapitalized}' already exists.`);
    }
    // Move export statement to the end
    const exportNode = ast.program.body.find((node) => recast.types.namedTypes.ExportDefaultDeclaration.check(node));
    if (exportNode) {
        ast.program.body = ast.program.body.filter((node) => node !== exportNode);
        ast.program.body.push(exportNode);
    }
    const updatedCode = recast.print(ast).code;
    return updatedCode;
}
