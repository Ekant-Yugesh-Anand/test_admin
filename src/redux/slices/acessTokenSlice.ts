import { createSlice,  PayloadAction } from "@reduxjs/toolkit";

export interface acessTokenState {
  loading: boolean;
  data?: string;
  isAuthenticated: boolean;
  auth: {
    token?: string;
    refreshToken?:string;
    expiry?: string | undefined;
  };
  msg:{
    token?: string ;
    refreshToken?:string;
    expiry?: string | undefined;
  }
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

const initialState: acessTokenState = {
  loading: false,
  isAuthenticated: false,
  auth: {
    token: "",
    expiry: "",
    refreshToken:""
  },
  msg: {
    token: "",
    refreshToken:"",
    expiry:""
  }

};

export const acessTokenSlice = createSlice({
  name: "acessToken",
  initialState,
  reducers: {
    UpdateToken: (
      state: typeof initialState,
      action: PayloadAction<acessTokenState["auth"]>
    ) => {
      action.payload?.token ? (state.isAuthenticated = true):(state.isAuthenticated = false);
      state.auth.token = action.payload?.token || state.auth.token;
      state.auth.refreshToken= action.payload?.refreshToken || state.auth.refreshToken
      state.auth.expiry = action.payload?.expiry || state.auth.expiry
    },
    UpdateMsgToken: (
      state: typeof initialState,
      action: PayloadAction<acessTokenState["msg"]>
    ) => {
      state.msg.token = action.payload?.token || state.msg.token;
      state.msg.refreshToken= action.payload?.refreshToken || state.msg.refreshToken
      state.msg.expiry = action.payload?.expiry || state.msg.expiry
    },
  },
});

export const { UpdateToken , UpdateMsgToken  } = acessTokenSlice.actions;
export default acessTokenSlice.reducer;

