export interface SeckConfig {
  framework: string;
  stateManagement: 'reduxSaga' | 'reduxThunk';
  storeDir?: string;
}
