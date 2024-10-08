import { SellerAccountStatus } from '@/model/enum';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TokenState {
  accessToken: string | undefined;
  expiresIn: number | undefined;
  refreshToken: string | undefined;
  scope: string | undefined;
  tokenType: string | undefined;
  status: SellerAccountStatus | undefined;
}

const initialState: TokenState = {
  accessToken: undefined,
  expiresIn: undefined,
  refreshToken: undefined,
  scope: undefined,
  tokenType: undefined,
  status: undefined
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<TokenState>) => {
      return { ...state, ...action.payload };
    },
    clearToken: () => initialState,
  },
});

export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
