import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IinitialStoreState, IProduct } from "../interfaces";

const initialState: IinitialStoreState = {
  cart: [],
  wishlist: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateCart: (state, action: PayloadAction<{ updatedCart: IProduct[] }>) => {
      const { updatedCart } = action.payload;
      state.cart = updatedCart;
    },
    updateWishlist: (
      state,
      action: PayloadAction<{ updatedProductList: any }>
    ) => {
      const { updatedProductList } = action.payload;
      state.wishlist = updatedProductList;
    },
  },
});

export const { updateCart, updateWishlist } = userSlice.actions;
export default userSlice.reducer;
