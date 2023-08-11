import { configureStore } from "@reduxjs/toolkit";
import codeBlocksReducer from './slices/codeBlockSlice'

const store = configureStore({
  reducer: {
    codeBlocks: codeBlocksReducer,
  },
});

export default store;