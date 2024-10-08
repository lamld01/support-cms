// src/store/settingsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
    theme: string;
}

const initialState: SettingsState = {
    theme: 'light', // Default theme
};

const settingsReducer = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<string>) {
            state.theme = action.payload;
        },
    },
});

export const { setTheme } = settingsReducer.actions;
export default settingsReducer.reducer;
