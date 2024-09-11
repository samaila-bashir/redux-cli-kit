export function generateStoreConfig(middleware: string): string {
  return `
  import { configureStore } from '@reduxjs/toolkit';
  import rootReducer from './slices';
  import { persistStore, persistReducer } from 'redux-persist';
  import storage from 'redux-persist/lib/storage';
  ${
    middleware === "saga"
      ? "import createSagaMiddleware from 'redux-saga';\nimport rootSaga from './sagas';"
      : ""
  }
  
  const sagaMiddleware = ${
    middleware === "saga" ? "createSagaMiddleware();" : "null;"
  }
  
  const persistConfig = {
    key: 'root',
    storage,
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false })${
        middleware === "saga" ? ".concat(sagaMiddleware)" : ""
      },
  });
  
  export const persistor = persistStore(store);
  ${middleware === "saga" ? "sagaMiddleware.run(rootSaga);" : ""}

  export type RootState = ReturnType<typeof rootReducer>;
    `;
}
