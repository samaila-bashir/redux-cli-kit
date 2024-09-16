import recast from 'recast';
import * as babelParser from '@babel/parser';
/**
 * Adds a new action to an existing Redux slice using Recast.
 *
 * @param {string} existingCode - The current code of the Redux slice.
 * @param {string} modelName - The name of the model for which the action is being added.
 * @param {string} actionName - The name of the action to be added.
 *
 * @returns {string} - Updated code with the new action added to the slice.
 */
export function addActionToSlice(existingCode, modelName, actionName) {
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
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
            parse(source) {
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
            if (recast.types.namedTypes.Identifier.check(key) &&
                key.name === 'reducers' &&
                recast.types.namedTypes.ObjectExpression.check(path.node.value)) {
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
        console.error('Failed to add action to slice. Could not find reducers object.');
    }
    const updatedCode = recast.print(ast).code;
    return updatedCode;
}
