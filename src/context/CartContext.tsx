"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVariant } from "@/data/products";

export interface CartItem {
    cartId: string;
    product: Product;
    variant: ProductVariant;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("luxury_food_cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from local storage", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("luxury_food_cart", JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
        setItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.product.id === product.id && item.variant.weight === variant.weight
            );

            if (existingItemIndex >= 0) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                return [...prevItems, { cartId: `${product.id}-${variant.weight}`, product, variant, quantity }];
            }
        });
    };

    const removeFromCart = (cartId: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
    };

    const updateQuantity = (cartId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(cartId);
            return;
        }
        setItems((prevItems) =>
            prevItems.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartTotal = items.reduce((total, item) => total + item.variant.price * item.quantity, 0);
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount }}>
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
