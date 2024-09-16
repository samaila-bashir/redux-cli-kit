export function generateModelSliceThunk(modelName, action) {
    const modelNameLowerCase = modelName.toLowerCase();
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    const apiBaseUrl = `https://jsonplaceholder.typicode.com/${modelNameLowerCase}s`;
    // Single Action Thunk generation if action is provided
    if (action) {
        const actionCapitalized = action.charAt(0).toUpperCase() + action.slice(1);
        return `
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
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

// Thunk for ${action} ${modelNameLowerCase}
export const ${actionCapitalized}${modelNameCapitalized} = createAsyncThunk(
  '${modelNameLowerCase}/${action}',
  async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  }
);

const ${modelNameLowerCase}Slice = createSlice({
  name: '${modelNameLowerCase}',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<${modelNameCapitalized}State>) => {
    builder
      .addCase(${actionCapitalized}${modelNameCapitalized}.pending, (state: ${modelNameCapitalized}State) => {
        state.loading = true;
      })
      .addCase(${actionCapitalized}${modelNameCapitalized}.fulfilled, (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}[]>) => {
        state.loading = false;
        state.${modelNameLowerCase} = action.payload;
      })
      .addCase(${actionCapitalized}${modelNameCapitalized}.rejected, (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}[]>) => {
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
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
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
    const response = await axios.get(API_BASE_URL);
    return response.data;
  }
);

export const add${modelNameCapitalized} = createAsyncThunk(
  '${modelNameLowerCase}/add${modelNameCapitalized}',
  async (new${modelNameCapitalized}: ${modelNameCapitalized}) => {
    const response = await axios.post(API_BASE_URL, new${modelNameCapitalized});
    return response.data;
  }
);

export const update${modelNameCapitalized} = createAsyncThunk(
  '${modelNameLowerCase}/update${modelNameCapitalized}',
  async (updated${modelNameCapitalized}: ${modelNameCapitalized}) => {
    const response = await axios.put(\`\${API_BASE_URL}/\${updated${modelNameCapitalized}.id}\`, updated${modelNameCapitalized});
    return response.data;
  }
);

export const delete${modelNameCapitalized} = createAsyncThunk(
  '${modelNameLowerCase}/delete${modelNameCapitalized}',
  async (id: number) => {
    await axios.delete(\`\${API_BASE_URL}/\${id}\`);
    return id;
  }
);

const ${modelNameLowerCase}Slice = createSlice({
  name: '${modelNameLowerCase}',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<${modelNameCapitalized}State>) => {
    builder
      // Fetch
      .addCase(fetch${modelNameCapitalized}s.pending, (state: ${modelNameCapitalized}State) => {
        state.loading = true;
      })
      .addCase(fetch${modelNameCapitalized}s.fulfilled, (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}[]>) => {
        state.loading = false;
        state.${modelNameLowerCase} = action.payload;
      })
      .addCase(fetch${modelNameCapitalized}s.rejected, (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}[]>) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ${modelNameLowerCase}s';
      })

      // Add
      .addCase(add${modelNameCapitalized}.fulfilled, (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}>) => {
        state.${modelNameLowerCase}.push(action.payload);
      })

      // Update
      .addCase(update${modelNameCapitalized}.fulfilled, (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}>) => {
        const index = state.${modelNameLowerCase}.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.${modelNameLowerCase}[index] = action.payload;
        }
      })

      // Delete
      .addCase(delete${modelNameCapitalized}.fulfilled, (state: ${modelNameCapitalized}State, action: PayloadAction<number>) => {
        state.${modelNameLowerCase} = state.${modelNameLowerCase}.filter(item => item.id !== action.payload);
      });
  },
});

export default ${modelNameLowerCase}Slice.reducer;
`;
}
