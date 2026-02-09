import { createSlice } from "@reduxjs/toolkit";

const tweetSlice = createSlice({
  name: "tweet",
  initialState: {
    tweets: [],
    refresh: false,
    isActive: false,
  },
  reducers: {
    getAllTweets: (state, action) => {
      console.log("Reducer received:", action.payload);
      state.tweets = Array.isArray(action.payload) ? action.payload : [];
    },
    getRefresh: (state) => {
      state.refresh = !state.refresh;
    },
    getIsActive: (state, action) => {
      state.isActive = action.payload;
    },
  },
});

export const { getAllTweets, getRefresh, getIsActive } = tweetSlice.actions;
export default tweetSlice.reducer;
