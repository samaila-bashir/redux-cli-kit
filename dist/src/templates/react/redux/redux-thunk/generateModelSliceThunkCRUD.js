export function generateModelSliceThunk(modelName) {
    const modelNameLowerCase = modelName.toLowerCase();
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    return `
    import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
    import axios from 'axios';

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

    const API_BASE_URL = 'https://jsonplaceholder.typicode.com/${modelNameLowerCase}s';

    export const fetch${modelNameCapitalized} = createAsyncThunk(
      '${modelNameLowerCase}/fetch${modelNameCapitalized}',
      async () => {
        const response = await axios.get(\`\${API_BASE_URL}\`);
        return response.data;
      }
    );

    const ${modelNameLowerCase}Slice = createSlice({
      name: '${modelNameLowerCase}',
      initialState,
      reducers: {
        add${modelNameCapitalized}: (state, action) => {
          state.${modelNameLowerCase}.push(action.payload);
        },
        update${modelNameCapitalized}: (state, action) => {
          const index = state.${modelNameLowerCase}.findIndex(
            (${modelNameLowerCase}) => ${modelNameLowerCase}.id === action.payload.id
          );
          if (index >= 0) {
            state.${modelNameLowerCase}[index] = action.payload;
          }
        },
        delete${modelNameCapitalized}: (state, action) => {
          state.${modelNameLowerCase} = state.${modelNameLowerCase}.filter(
            (${modelNameLowerCase}) => ${modelNameLowerCase}.id !== action.payload
          );
        },
      },
      extraReducers: (builder) => {
        builder
          .addCase(fetch${modelNameCapitalized}.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetch${modelNameCapitalized}.fulfilled, (state, action) => {
            state.loading = false;
            state.${modelNameLowerCase} = action.payload;
          })
          .addCase(fetch${modelNameCapitalized}.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch ${modelNameLowerCase}s';
          });
      },
    });

    export const { add${modelNameCapitalized}, update${modelNameCapitalized}, delete${modelNameCapitalized} } = ${modelNameLowerCase}Slice.actions;

    export default ${modelNameLowerCase}Slice.reducer;
  `;
}
