export function generateStoreConfig(middleware: string): string {
  return `
  import { configureStore } from '@reduxjs/toolkit';
  import rootReducer from './slices';
  import { persistStore, persistReducer } from 'redux-persist';
  import storage from 'redux-persist/lib/storage';
  ${
    middleware === 'saga'
      ? "import createSagaMiddleware from 'redux-saga';\nimport rootSaga from './sagas';"
      : ''
  }
  
  const persistConfig = {
    key: 'root',
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  ${
    middleware === 'saga'
      ? `const sagaMiddleware = createSagaMiddleware();`
      : ''
  }

  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      ${
        middleware === 'saga'
          ? `getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware)`
          : `getDefaultMiddleware({ serializableCheck: false })`
      },
  });

  export const persistor = persistStore(store);
  ${middleware === 'saga' ? 'sagaMiddleware.run(rootSaga);' : ''}

  export type RootState = ReturnType<typeof rootReducer>;
  export type AppDispatch = typeof store.dispatch;
  `;
}
