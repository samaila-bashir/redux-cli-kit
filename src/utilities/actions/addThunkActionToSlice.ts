import recast from 'recast';
import * as babelParser from '@babel/parser';

/**
 * Adds a new thunk action to an existing Redux slice.
 *
 * @param {string} existingCode - The current code of the Redux slice.
 * @param {string} newThunkCode - Code representing the new thunk action.
 * @param {string} newExtraReducersCode - Code for extra reducers.
 *
 * @returns {string} - Updated code with the new thunk action.
 */

export function addThunkActionToSlice(
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
