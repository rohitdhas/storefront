import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface userDetailsPayload {
  name: string;
  email: string;
  image: string;
}

interface IinitialState {
  name: string;
  email: string;
  image: string;
  cart: Object[];
  wishlist: Object[];
}

const initialState: IinitialState = {
  name: "",
  email: "",
  image: "",
  cart: [],
  wishlist: []
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateDetails: (state, action: PayloadAction<userDetailsPayload>) => {
      const { name, email, image } = action.payload;
      state.name = name;
      state.email = email;
      state.image = image;
    },
    addToCart: (state, action: PayloadAction<Object>) => {
      state.cart.push(action.payload);
    },
    updateWishlist: (state, action: PayloadAction<{ updatedProductList: any }>) => {
      const { updatedProductList } = action.payload;
      state.wishlist = updatedProductList;
    }
  }
})

export const { updateDetails, addToCart, updateWishlist } = userSlice.actions;
export default userSlice.reducer;
