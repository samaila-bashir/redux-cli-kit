/**
 * Generates a Redux Toolkit slice with saga-compatible actions for a given model.
 *
 * @param {string} modelName - The name of the model to generate the slice for.
 * @returns {string} A string containing the generated Redux Toolkit slice code.
 *
 * @description
 * This function creates a Redux Toolkit slice with the following features:
 * - A typed state interface for the model
 * - Initial state
 * - Reducers for fetching, adding, updating, and deleting model items
 * - Action creators for all reducers
 *
 * The generated code includes:
 * - Fetch actions (fetch, fetchSuccess, fetchFailure)
 * - Add actions (add, addSuccess, addFailure)
 * - Update actions (update, updateSuccess, updateFailure)
 * - Delete actions (delete, deleteSuccess, deleteFailure)
 *
 * Each action set includes a start action, a success action, and a failure action
 * to handle asynchronous operations and error states.
 */
export function generateModelSliceSaga(modelName: string): string {
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
        // Fetch actions
        fetch${modelNameCapitalized}: (state: ${modelNameCapitalized}State) => {
          state.loading = true;
        },
        fetch${modelNameCapitalized}Success: (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}[]>) => {
          state.loading = false;
          state.${modelNameLowerCase} = action.payload;
        },
        fetch${modelNameCapitalized}Failure: (state: ${modelNameCapitalized}State, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
        },
        // Add actions
        add${modelNameCapitalized}: (state: ${modelNameCapitalized}State) => {
          state.loading = true;
        },
        add${modelNameCapitalized}Success: (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}>) => {
          state.loading = false;
          state.${modelNameLowerCase}.push(action.payload);
        },
        add${modelNameCapitalized}Failure: (state: ${modelNameCapitalized}State, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
        },
        // Update actions
        update${modelNameCapitalized}: (state: ${modelNameCapitalized}State) => {
          state.loading = true;
        },
        update${modelNameCapitalized}Success: (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}>) => {
          state.loading = false;
          const index = state.${modelNameLowerCase}.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state.${modelNameLowerCase}[index] = action.payload;
          }
        },
        update${modelNameCapitalized}Failure: (state: ${modelNameCapitalized}State, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
        },
        // Delete actions
        delete${modelNameCapitalized}: (state: ${modelNameCapitalized}State) => {
          state.loading = true;
        },
        delete${modelNameCapitalized}Success: (state: ${modelNameCapitalized}State, action: PayloadAction<number>) => {
          state.loading = false;
          state.${modelNameLowerCase} = state.${modelNameLowerCase}.filter(item => item.id !== action.payload);
        },
        delete${modelNameCapitalized}Failure: (state: ${modelNameCapitalized}State, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
        },
      },
    });

    export const {
      fetch${modelNameCapitalized},
      fetch${modelNameCapitalized}Success,
      fetch${modelNameCapitalized}Failure,
      add${modelNameCapitalized},
      add${modelNameCapitalized}Success,
      add${modelNameCapitalized}Failure,
      update${modelNameCapitalized},
      update${modelNameCapitalized}Success,
      update${modelNameCapitalized}Failure,
      delete${modelNameCapitalized},
      delete${modelNameCapitalized}Success,
      delete${modelNameCapitalized}Failure,
    } = ${modelNameLowerCase}Slice.actions;

    export default ${modelNameLowerCase}Slice.reducer;
  `;
}
