import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

// Function to generate a slice and saga based on user input
export async function generateSliceAndSaga(modelName) {
  const sliceDir = path.join(
    process.cwd(),
    `src/store/slices/${modelName.toLowerCase()}`
  );
  const sagaDir = path.join(
    process.cwd(),
    `src/store/sagas/${modelName.toLowerCase()}`
  );

  // Create the directories for slice and saga
  await fs.ensureDir(sliceDir);
  await fs.ensureDir(sagaDir);

  // Write the slice and saga files using templates
  await fs.writeFile(
    path.join(sliceDir, "index.ts"),
    generateSliceTemplate(modelName)
  );
  await fs.writeFile(
    path.join(sagaDir, "index.ts"),
    generateSagaTemplate(modelName)
  );

  console.log(chalk.green(`${modelName} slice and saga have been created.`));
}

// Sample template for generating a slice
function generateSliceTemplate(modelName) {
  return `
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ${modelName} {
  id: number;
  // Add your model properties here
}

interface ${modelName}State {
  ${modelName.toLowerCase()}s: ${modelName}[];
  loading: boolean;
  error: string | null;
}

const initialState: ${modelName}State = {
  ${modelName.toLowerCase()}s: [],
  loading: false,
  error: null,
};

const ${modelName.toLowerCase()}Slice = createSlice({
  name: '${modelName.toLowerCase()}',
  initialState,
  reducers: {
    fetch${modelName}s: (state) => {
      state.loading = true;
    },
    fetch${modelName}sSuccess: (state, action: PayloadAction<${modelName}[]>) => {
      state.loading = false;
      state.${modelName.toLowerCase()}s = action.payload;
    },
    fetch${modelName}sFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    add${modelName}: (state, action: PayloadAction<${modelName}>) => {
      state.${modelName.toLowerCase()}s.push(action.payload);
    },
    update${modelName}: (state, action: PayloadAction<${modelName}>) => {
      const index = state.${modelName.toLowerCase()}s.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.${modelName.toLowerCase()}s[index] = action.payload;
      }
    },
    delete${modelName}: (state, action: PayloadAction<number>) => {
      state.${modelName.toLowerCase()}s = state.${modelName.toLowerCase()}s.filter(item => item.id !== action.payload);
    },
  },
});

export const { fetch${modelName}s, fetch${modelName}sSuccess, fetch${modelName}sFailure, add${modelName}, update${modelName}, delete${modelName} } = ${modelName.toLowerCase()}Slice.actions;
export default ${modelName.toLowerCase()}Slice.reducer;
  `;
}

// Sample template for generating a saga
function generateSagaTemplate(modelName) {
  return `
import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { fetch${modelName}s, fetch${modelName}sSuccess, fetch${modelName}sFailure } from '../../slices/${modelName.toLowerCase()}s';

function* fetchAll${modelName}s() {
  try {
    yield put(fetch${modelName}s());
    const response = yield call(axios.get, '/api/${modelName.toLowerCase()}s');
    yield put(fetch${modelName}sSuccess(response.data));
  } catch (error) {
    yield put(fetch${modelName}sFailure(error.message));
  }
}

export function* watchFetch${modelName}s() {
  yield takeEvery('${modelName.toLowerCase()}/fetch${modelName}s', fetchAll${modelName}s);
}
  `;
}
