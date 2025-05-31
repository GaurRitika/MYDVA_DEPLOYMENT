


import { configureStore } from '@reduxjs/toolkit'
import authReducer from './AuthSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'] // Only persist auth reducer
}

const rootReducer = combineReducers({
    auth: authReducer,
    // Add other reducers here if needed
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['register']
            },
        })
});

export const persistor = persistStore(store);
