import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface authState {
  isAuth: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    //permissions
    permissions: {
      isAdmin: boolean;
      isActive: boolean;
    };
  };
}

const initialState: authState = {
  isAuth: false,
  user: {
    id: "",
    email: "",
    username: "",
    permissions: {
      isAdmin: false,
      isActive: false,
    },
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state: typeof initialState,
      action: PayloadAction<authState["user"]>
    ) => {
      state.user = action.payload;
      state.isAuth = true;
    },
    setLogout: (state: typeof initialState) => {
      state.isAuth = false;
      state.user = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAuth, setLogout } = authSlice.actions;

export default authSlice.reducer;
