export interface SeckConfig {
  framework: string;
  stateManagement: 'reduxSaga' | 'reduxThunk';
  storeDir?: string;
}

export interface GenerateOptions {
  slice?: boolean;
  saga?: boolean;
  thunk?: boolean;
  action?: string;
}

export interface GenerateContext {
  config: SeckConfig;
  modelName: string;
  sliceDir: string;
  sagaDir: string | undefined;
  sliceFilePath: string;
  sagaFilePath: string | undefined;
  sliceFileExists: boolean;
  sagaFileExists: boolean;
  customSlicePath: string;
}
