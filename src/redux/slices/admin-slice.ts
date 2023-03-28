import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface alertState {
  pageLoading: boolean;
}

const initialState: alertState = {
  pageLoading: false,
};

export const adminSlice = createSlice({
  name: "adminRedux",
  initialState,
  reducers: {
    setPageLoading: (
      state: typeof initialState,
      action: PayloadAction<alertState["pageLoading"]>
    ) => {
      state.pageLoading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPageLoading } = adminSlice.actions;

export default adminSlice.reducer;
