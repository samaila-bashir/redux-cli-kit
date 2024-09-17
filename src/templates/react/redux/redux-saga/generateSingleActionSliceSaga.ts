/**
 * Generates a Redux Toolkit slice with a single action and its corresponding success and failure actions.
 *
 * @param {string} modelName - The name of the model (e.g., 'todo', 'user').
 * @param {string} action - The name of the action (e.g., 'fetch', 'create').
 * @returns {string} A string containing the generated Redux Toolkit slice code.
 * @throws {Error} If the action name is empty or not a valid identifier.
 *
 * @example
 * const sliceCode = generateSingleActionSliceSaga('todo', 'fetch');
 */
export function generateSingleActionSliceSaga(
  modelName: string,
  action: string
): string {
  // Validate action name (optional)
  if (!action) {
    throw new Error('Action name is required.');
  }

  // Optionally, validate that action is a valid identifier
  function isValidIdentifier(name: string): boolean {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);
  }

  if (!isValidIdentifier(action)) {
    throw new Error(`Invalid action name: '${action}'.`);
  }

  const modelNameLowerCase = modelName.toLowerCase();
  const modelNameCapitalized =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

  return `
      import { createSlice, PayloadAction } from '@reduxjs/toolkit';
  
      interface ${modelNameCapitalized} {
        id: number;
        title: string;
        completed: boolean;
      }
  
      interface ${modelNameCapitalized}State {
        ${modelNameLowerCase}: ${modelNameCapitalized}[];
        loading: boolean;
        error: string | null;
      }
  
      const initialState: ${modelNameCapitalized}State = {
        ${modelNameLowerCase}: [],
        loading: false,
        error: null,
      };
  
      const ${modelNameLowerCase}Slice = createSlice({
        name: '${modelNameLowerCase}',
        initialState,
        reducers: {
          ${action}: (state) => {
            state.loading = true;
          },
          ${action}Success: (state, action: PayloadAction<${modelNameCapitalized}[]>) => {
            state.loading = false;
            state.${modelNameLowerCase} = action.payload;
          },
          ${action}Failure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
          },
        },
      });
  
      export const { ${action}, ${action}Success, ${action}Failure } = ${modelNameLowerCase}Slice.actions;
      export default ${modelNameLowerCase}Slice.reducer;
    `;
}
