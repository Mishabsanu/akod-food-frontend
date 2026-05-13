"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
    addToCart as reduxAddToCart, 
    removeFromCart as reduxRemoveFromCart, 
    updateQuantity as reduxUpdateQuantity, 
    clearCart as reduxClearCart,
    fetchCartFromBackend,
    syncCartToBackend,
    CartItem
} from "@/store/slices/cartSlice";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, variant: any, quantity: number) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartSubtotal: number;
    platformFee: number;
    deliveryFee: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { items, isSynced } = useAppSelector((state) => state.cart);
    const { isAuthenticated, setAuthModalOpen } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCartFromBackend());
        }
    }, [isAuthenticated, dispatch]);

    // Background sync effect
    useEffect(() => {
        if (isAuthenticated && !isSynced) {
            const timer = setTimeout(() => {
                dispatch(syncCartToBackend(items));
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [items, isAuthenticated, isSynced, dispatch]);

    const addToCart = (product: any, variant: any, quantity: number) => {
        if (!isAuthenticated) {
            setAuthModalOpen(true, "IDENTITY");
            toast.error("Please sign in to add items to your cart");
            return;
        }
        dispatch(reduxAddToCart({ product, variant, quantity }));
        toast.success("Item added to cart");
    };

    const removeFromCart = (cartId: string) => {
        dispatch(reduxRemoveFromCart(cartId));
        toast.info("Item removed from cart");
    };

    const updateQuantity = (cartId: string, quantity: number) => {
        dispatch(reduxUpdateQuantity({ cartId, quantity }));
    };

    const clearCart = () => {
        dispatch(reduxClearCart());
        toast.info("Cart cleared");
    };

    const cartSubtotal = items.reduce((total, item) => {
        const price = Number(item.variant?.sellingPrice || item.variant?.price || item.product?.price || 0);
        return total + (price * item.quantity);
    }, 0);

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    
    // User requested NO CHARGES
    const platformFee = 0;
    const deliveryFee = 0;
    const cartTotal = cartSubtotal;

    return (
        <CartContext.Provider value={{ 
            items, addToCart, removeFromCart, updateQuantity, clearCart, 
            cartTotal, itemCount, cartSubtotal, platformFee, deliveryFee 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
