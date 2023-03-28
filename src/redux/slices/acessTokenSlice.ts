import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios"


// export const getUser = createAsyncThunk(
//   "acessToken/getData",
//   async (arg, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.post("https://###########", {

//         grant_type: "password",
//         redirect_uri: "########",
//         username: "######",
//         password: "###",
//         scope: "openid profile email offline_access",
//         client_id: "#########"


//       }, {
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/x-www-form-urlencoded",
//           Cookie: "########"
//         }
//       })
//       console.log(data)
//       return data

//     } catch (err) {
//       rejectWithValue(err)
//     }
//   }
// )

export interface acessTokenState {
  loading: boolean;
  data?: string;
  isAuthenticated: boolean;
  auth: {
    token?: string;
    refreshToken?:string;
    expiry?: string | undefined;
  };
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
      state.auth.token = action.payload?.token;
      state.auth.refreshToken= action.payload?.refreshToken
      state.auth.expiry = action.payload?.expiry
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(getUser.pending, (state: typeof initialState) => {
  //     state.loading = true
  //   });
  //   builder.addCase(getUser.fulfilled, (state: typeof initialState) => {
  //     state.loading = false

  //   }); builder.addCase(getUser.rejected, (state: typeof initialState) => {
  //     state.loading = false
  //   });
  // }
});

export const { UpdateToken } = acessTokenSlice.actions;
export default acessTokenSlice.reducer;
