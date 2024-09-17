/**
 * Generates a Redux Toolkit slice template for a todo-like model with saga actions.
 *
 * @param {string} modelName - The name of the model (e.g., "todo", "task").
 * @returns {string} A string containing the generated Redux Toolkit slice code.
 *
 * @description
 * This function creates a template for a Redux Toolkit slice with the following features:
 * - Defines interfaces for the model and its state.
 * - Creates an initial state.
 * - Defines reducers for fetching, adding, updating, and deleting items.
 * - Includes actions for handling asynchronous operations (fetch success/failure).
 * - Exports action creators and the reducer.
 *
 * The generated code is customized based on the provided modelName, with proper capitalization
 * and pluralization applied where necessary.
 */
export function generateTodoSliceSaga(modelName) {
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    const modelNameLowerCase = modelName.toLowerCase();
    return `
    import { createSlice, PayloadAction } from '@reduxjs/toolkit';
  
    interface ${modelNameCapitalized} {
      id: number;
      title: string;
      completed: boolean;
    }
  
    interface ${modelNameCapitalized}sState {
      ${modelNameLowerCase}s: ${modelNameCapitalized}[];
      loading: boolean;
      error: string | null;
    }
  
    const initialState: ${modelNameCapitalized}sState = {
      ${modelNameLowerCase}s: [],
      loading: false,
      error: null,
    };
  
    const ${modelNameLowerCase}sSlice = createSlice({
      name: '${modelNameLowerCase}s',
      initialState,
      reducers: {
        fetch${modelNameCapitalized}s: (state) => {
          state.loading = true;
        },
        fetch${modelNameCapitalized}sSuccess: (state, action: PayloadAction<${modelNameCapitalized}[]>) => {
          state.loading = false;
          state.${modelNameLowerCase}s = action.payload;
        },
        fetch${modelNameCapitalized}sFailure: (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
        },
        add${modelNameCapitalized}: (state, action: PayloadAction<${modelNameCapitalized}>) => {
          state.${modelNameLowerCase}s.push(action.payload);
        },
        update${modelNameCapitalized}: (state, action: PayloadAction<${modelNameCapitalized}>) => {
          const index = state.${modelNameLowerCase}s.findIndex(${modelNameLowerCase} => ${modelNameLowerCase}.id === action.payload.id);
          if (index >= 0) {
            state.${modelNameLowerCase}s[index] = action.payload;
          }
        },
        delete${modelNameCapitalized}: (state, action: PayloadAction<number>) => {
          state.${modelNameLowerCase}s = state.${modelNameLowerCase}s.filter(${modelNameLowerCase} => ${modelNameLowerCase}.id !== action.payload);
        },
      },
    });
  
    export const { 
      fetch${modelNameCapitalized}s, 
      fetch${modelNameCapitalized}sSuccess, 
      fetch${modelNameCapitalized}sFailure, 
      add${modelNameCapitalized}, 
      update${modelNameCapitalized}, 
      delete${modelNameCapitalized} 
    } = ${modelNameLowerCase}sSlice.actions;
    export default ${modelNameLowerCase}sSlice.reducer;
  `;
}
