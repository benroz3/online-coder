import { createSlice } from "@reduxjs/toolkit";

const codeBlocksSlice = createSlice({
  name: "codeBlocks",
  initialState: {
    codeBlocks: [],
    isMentor: false,
  },
  reducers: {
    setCodeBlocks: (state, action) => {
      state.codeBlocks = action.payload;
    },
    setIsMentor: (state, action) => {
      state.isMentor = action.payload;
    },
  },
});

export const { setCodeBlocks, setIsMentor } = codeBlocksSlice.actions;

export default codeBlocksSlice.reducer;
