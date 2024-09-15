export function generateModelSliceThunk(
  modelName: string,
  action?: string
): string {
  const modelNameLowerCase = modelName.toLowerCase();
  const modelNameCapitalized =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

  const apiBaseUrl = `https://jsonplaceholder.typicode.com/${modelNameLowerCase}s`;

  // If action is provided, generate a single action slice; otherwise, generate full CRUD
  if (action) {
    const actionCapitalized = action.charAt(0).toUpperCase() + action.slice(1);
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

      // Thunk for ${action} ${modelNameLowerCase}
      export const ${actionCapitalized}${modelNameCapitalized} = createAsyncThunk(
        '${modelNameLowerCase}/${action}',
        async () => {
          const response = await axios.get(\`${apiBaseUrl}\`);
          return response.data;
        }
      );

      const ${modelNameLowerCase}Slice = createSlice({
        name: '${modelNameLowerCase}',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
          builder
            .addCase(${actionCapitalized}${modelNameCapitalized}.pending, (state) => {
              state.loading = true;
            })
            .addCase(${actionCapitalized}${modelNameCapitalized}.fulfilled, (state, action) => {
              state.loading = false;
              state.${modelNameLowerCase} = action.payload;
            })
            .addCase(${actionCapitalized}${modelNameCapitalized}.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message || 'Failed to ${action} ${modelNameLowerCase}s';
            });
        },
      });

      export default ${modelNameLowerCase}Slice.reducer;
    `;
  }

  // Full CRUD Thunks if no action is provided
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

    const API_BASE_URL = '${apiBaseUrl}';

    // CRUD Thunks
    export const fetch${modelNameCapitalized}s = createAsyncThunk(
      '${modelNameLowerCase}/fetch${modelNameCapitalized}s',
      async () => {
        const response = await axios.get(\`${apiBaseUrl}\`);
        return response.data;
      }
    );

    export const add${modelNameCapitalized} = createAsyncThunk(
      '${modelNameLowerCase}/add${modelNameCapitalized}',
      async (new${modelNameCapitalized}: ${modelNameCapitalized}) => {
        const response = await axios.post(\`${apiBaseUrl}\`, new${modelNameCapitalized});
        return response.data;
      }
    );

    export const update${modelNameCapitalized} = createAsyncThunk(
      '${modelNameLowerCase}/update${modelNameCapitalized}',
      async (updated${modelNameCapitalized}: ${modelNameCapitalized}) => {
        const response = await axios.put(\`${apiBaseUrl}/\${updated${modelNameCapitalized}.id}\`, updated${modelNameCapitalized});
        return response.data;
      }
    );

    export const delete${modelNameCapitalized} = createAsyncThunk(
      '${modelNameLowerCase}/delete${modelNameCapitalized}',
      async (id: number) => {
        await axios.delete(\`${apiBaseUrl}/\${id}\`);
        return id;
      }
    );

    const ${modelNameLowerCase}Slice = createSlice({
      name: '${modelNameLowerCase}',
      initialState,
      reducers: {},
      extraReducers: (builder) => {
        builder
          // Fetch
          .addCase(fetch${modelNameCapitalized}s.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetch${modelNameCapitalized}s.fulfilled, (state, action) => {
            state.loading = false;
            state.${modelNameLowerCase} = action.payload;
          })
          .addCase(fetch${modelNameCapitalized}s.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch ${modelNameLowerCase}s';
          })

          // Add
          .addCase(add${modelNameCapitalized}.fulfilled, (state, action) => {
            state.${modelNameLowerCase}.push(action.payload);
          })

          // Update
          .addCase(update${modelNameCapitalized}.fulfilled, (state, action) => {
            const index = state.${modelNameLowerCase}.findIndex(${modelNameLowerCase} => ${modelNameLowerCase}.id === action.payload.id);
            if (index !== -1) {
              state.${modelNameLowerCase}[index] = action.payload;
            }
          })

          // Delete
          .addCase(delete${modelNameCapitalized}.fulfilled, (state, action) => {
            state.${modelNameLowerCase} = state.${modelNameLowerCase}.filter(${modelNameLowerCase} => ${modelNameLowerCase}.id !== action.payload);
          });
      },
    });

    export default ${modelNameLowerCase}Slice.reducer;
  `;
}
