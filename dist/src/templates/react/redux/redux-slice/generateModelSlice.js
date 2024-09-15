export function generateModelSlice(modelName) {
    const modelNameLowerCase = modelName.toLowerCase();
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    return `
    import { createSlice, PayloadAction } from '@reduxjs/toolkit';

    interface ${modelNameCapitalized} {
      id: number;
      title: string;
      completed: boolean;
    }

    interface ${modelNameCapitalized}State {
      data: ${modelNameCapitalized}[];
      loading: boolean;
      error: string | null;
    }

    const initialState: ${modelNameCapitalized}State = {
      data: [],
      loading: false,
      error: null,
    };

    const ${modelNameLowerCase}Slice = createSlice({
      name: '${modelNameLowerCase}',
      initialState,
      reducers: {
        fetch${modelNameCapitalized}: (state: ${modelNameCapitalized}State) => {
          state.loading = true;
        },
        fetch${modelNameCapitalized}Success: (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}[]>) => {
          state.loading = false;
          state.data = action.payload;
        },
        fetch${modelNameCapitalized}Failure: (state: ${modelNameCapitalized}State, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
        },
        add${modelNameCapitalized}Success: (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}>) => {
          state.data.push(action.payload);
        },
        update${modelNameCapitalized}Success: (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}>) => {
          const index = state.data.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state.data[index] = action.payload;
          }
        },
        delete${modelNameCapitalized}Success: (state: ${modelNameCapitalized}State, action: PayloadAction<number>) => {
          state.data = state.data.filter(item => item.id !== action.payload);
        }
      },
    });

    export const {
      fetch${modelNameCapitalized},
      fetch${modelNameCapitalized}Success,
      fetch${modelNameCapitalized}Failure,
      add${modelNameCapitalized}Success,
      update${modelNameCapitalized}Success,
      delete${modelNameCapitalized}Success
    } = ${modelNameLowerCase}Slice.actions;

    export default ${modelNameLowerCase}Slice.reducer;
  `;
}
