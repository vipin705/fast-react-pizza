import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cart: [],
};
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            state.cart = [...state.cart, action.payload];
        },
        deleteItem(state, action) {
            state.cart = state.cart.filter(
                (item) => item.pizzaId !== action.payload,
            );
        },
        increaseItemQuantity(state, action) {
            const item = state.cart.find(
                (item) => item.pizzaId === action.payload,
            );
            item.quantity++;
            item.totalPrice = item.quantity * item.unitPrice;
        },
        decreaseItemQuantity(state, action) {
            const item = state.cart.find(
                (item) => item.pizzaId === action.payload,
            );
            item.quantity--;
            item.totalPrice = item.quantity * item.unitPrice;
            if (item.quantity === 0) {
                cartSlice.caseReducers.deleteItem(state, action);
            }
        },
        clearCart(state) {
            state.cart = [];
        },
    },
});

export const {
    addItem,
    deleteItem,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state) => state.cart.cart;

export const getTotalQuantity = (state) =>
    state.cart.cart.reduce((total, item) => total + item.quantity, 0);

export const getTotalPrice = (state) =>
    state.cart.cart.reduce((total, item) => total + item.totalPrice, 0);

export const isItemInCart = (id) => (state) =>
    state.cart.cart.some((item) => item.pizzaId === id);

export const getCurrentQuantityById = (id) => (state) =>
    state.cart.cart.find((item) => item.pizzaId === id).quantity;
