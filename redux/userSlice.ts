import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IinitialState {
  cart: Object[];
  wishlist: Object[];
}

const initialState: IinitialState = {
  cart: [],
  wishlist: []
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateCart: (state, action: PayloadAction<{ updatedCart: Object[] }>) => {
      const { updatedCart } = action.payload;
      state.cart = updatedCart;
    },
    updateWishlist: (state, action: PayloadAction<{ updatedProductList: Object[] }>) => {
      const { updatedProductList } = action.payload;
      state.wishlist = updatedProductList;
    }
  }
})

export const { updateCart, updateWishlist } = userSlice.actions;
export default userSlice.reducer;
