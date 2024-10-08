import { configureStore } from '@reduxjs/toolkit';
import { settingsReducer, tokenReducer } from '@/config';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'mos-cms',
  storage,
};

export const store = configureStore({
  reducer: {
    token: persistReducer(persistConfig, tokenReducer),
    setting: persistReducer(persistConfig, settingsReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for the check
        ignoredActions: ['persist/PERSIST'],
        // Ignore paths in the state
        ignoredPaths: ['token.register'], // Adjust according to your state structure
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
