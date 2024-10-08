/**
 * Generates a string representation of a Redux store configuration.
 *
 * @param {string} middleware - The middleware to be used ('reduxSaga' or other).
 * @returns {string} A string containing the code for configuring a Redux store,
 *                   including persistence and optional Redux Saga setup.
 */
export function generateStoreConfig(middleware: string): string {
  return `
  import { configureStore } from '@reduxjs/toolkit';
  import rootReducer from './slices';
  import { persistStore, persistReducer } from 'redux-persist';
  import storage from 'redux-persist/lib/storage';
  ${
    middleware === 'reduxSaga'
      ? "import createSagaMiddleware from 'redux-saga';\nimport rootSaga from './sagas';"
      : ''
  }
  
  const persistConfig = {
    key: 'root',
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  ${
    middleware === 'reduxSaga'
      ? `const sagaMiddleware = createSagaMiddleware();`
      : ''
  }

  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      ${
        middleware === 'reduxSaga'
          ? `getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware)`
          : `getDefaultMiddleware({ serializableCheck: false })`
      },
  });

  export const persistor = persistStore(store);
  ${middleware === 'reduxSaga' ? 'sagaMiddleware.run(rootSaga);' : ''}

  export type RootState = ReturnType<typeof rootReducer>;
  export type AppDispatch = typeof store.dispatch;
  `;
}
