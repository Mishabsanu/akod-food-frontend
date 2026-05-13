import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { customerApi } from '@/lib/api';

export interface CartItem {
  cartId: string;
  product: any;
  variant: any;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isSynced: boolean;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  isSynced: true,
};

// Async thunk to sync cart to backend
export const syncCartToBackend = createAsyncThunk(
  'cart/syncToBackend',
  async (items: CartItem[], { rejectWithValue }) => {
    try {
      const syncItems = items.map(item => ({
        product: item.product?._id || item.product,
        variant: {
          name: item.variant?.name,
          unit: item.variant?.unit,
          sellingPrice: Number(item.variant?.sellingPrice || item.variant?.price || 0)
        },
        quantity: item.quantity
      }));
      await customerApi.syncCart(syncItems);
      return true;
    } catch (error: any) {
      return rejectWithValue('Sync failed');
    }
  }
);

// Async thunk to fetch cart from backend
export const fetchCartFromBackend = createAsyncThunk(
  'cart/fetchFromBackend',
  async (_, { rejectWithValue }) => {
    try {
      const res = await customerApi.getCart();
      return res.data.data.items.map((item: any) => ({
        cartId: `${item.product._id}-${item.variant.name}${item.variant.unit || ""}`,
        product: item.product,
        variant: item.variant,
        quantity: item.quantity
      }));
    } catch (error: any) {
      return rejectWithValue('Fetch failed');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<{ product: any; variant: any; quantity: number }>) => {
      const { product, variant, quantity } = action.payload;
      const variantKey = variant.name + (variant.unit || "");
      const existingItemIndex = state.items.findIndex(
        (item) => (item.product?._id || item.product) === (product?._id || product) && (item.variant?.name + (item.variant?.unit || "")) === variantKey
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          cartId: `${product?._id || product}-${variantKey}`,
          product,
          variant,
          quantity
        });
      }
      state.isSynced = false;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.cartId !== action.payload);
      state.isSynced = false;
    },
    updateQuantity: (state, action: PayloadAction<{ cartId: string; quantity: number }>) => {
      const item = state.items.find(i => i.cartId === action.payload.cartId);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.cartId !== action.payload.cartId);
        }
      }
      state.isSynced = false;
    },
    clearCart: (state) => {
      state.items = [];
      state.isSynced = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartFromBackend.fulfilled, (state, action) => {
        if (action.payload.length > 0) {
          state.items = action.payload;
          state.isSynced = true;
        } else if (state.items.length > 0) {
          // If backend is empty but we have items in state, force a sync to push them to DB
          state.isSynced = false;
        } else {
          state.items = [];
          state.isSynced = true;
        }
        state.isLoading = false;
      })
      .addCase(fetchCartFromBackend.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartFromBackend.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(syncCartToBackend.fulfilled, (state) => {
        state.isSynced = true;
      });
  }
});

export const { setCartItems, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
