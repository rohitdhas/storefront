import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IinitialStoreState, CartItem } from "../interfaces";

const initialState: IinitialStoreState = {
  cart: [],
  wishlist: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateCart: (state, action: PayloadAction<{ updatedCart: CartItem[] }>) => {
      const { updatedCart } = action.payload;
      state.cart = updatedCart;
    },
    updateWishlist: (
      state,
      action: PayloadAction<{ updatedProductList: string[] }>
    ) => {
      const { updatedProductList } = action.payload;
      state.wishlist = updatedProductList;
    },
  },
});

export const { updateCart, updateWishlist } = userSlice.actions;
export default userSlice.reducer;
