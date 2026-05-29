import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  addToCart as addToCartAPI,
  updateCartItem,
  deleteCartItem,
  clearCart as clearCartAPI,
  getCartByUser,
} from "../api/cart.api.js";

import { useAuth } from "./AuthContext";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  const { user, isAuthenticated, isAdmin, isCustomer } = useAuth();

  // =========================
  // LOAD CART
  // =========================

  useEffect(() => {

    const loadCart = async () => {

      try {

        // NOT LOGGED IN
        if (!isAuthenticated ||!user) {
          setCart([]);
          return;
        }

        

        if (isAdmin) {
          setCart([]);
          return;
        }
        if (isCustomer) {
          const dbCart =
          await getCartByUser(user.id);

          setCart(
            dbCart?.data?.cartItems || []
          );
        }
        

      } catch (error) {

        console.error(
          "Failed to load cart",
          error
        );

        setCart([]);
      }
    };

    loadCart();

  }, [user?.id, isAuthenticated, isAdmin, isCustomer]);

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = async (product) => {

    if (!product || !user) return;

    setCart((prev) => {

      const existingItem = prev.find(
      (item) =>
        String(item._id) === String(product._id)
    );

      if (existingItem) {

        return prev.map((item) =>
          String(item._id) === String(product._id)
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          _id: product._id,
          productId: product._id,
          productName: product.name,
          productImage:
            product.images?.[0],
          price: product.basePrice,
          quantity: 1,
        },
      ];
    });

    try {

      await addToCartAPI({
        userId: user.id,
        productId: product._id,
        productName: product.name,
        productImage:
          product.images?.[0],
        price: product.basePrice,
        quantity: 1,
      });

    } catch (error) {

      console.error(
        "Failed to add to cart",
        error
      );
    }
  };

  // =========================
  // REMOVE FROM CART
  // =========================

  const removeFromCart = async (
    productId
  ) => {

    setCart((prev) =>
      prev.filter(
        (item) =>
          String(item._id) !== String(productId)
      )
    );

    try {

      await deleteCartItem(productId);

    } catch (error) {

      console.error(
        "Failed to remove cart item",
        error
      );
    }
  };

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = async (
    productId,
    quantity
  ) => {

    if (quantity <= 0) {

      removeFromCart(productId);

      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        String(item._id) === String(productId)
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );

    try {

      await updateCartItem(
        productId,
        quantity
      );

    } catch (error) {

      console.error(
        "Failed to update quantity",
        error
      );
    }
  };

  // =========================
  // CLEAR CART
  // =========================

  const clearCart = async () => {

    setCart([]);

    try {

      if (user?.id) {
        await clearCartAPI(user.id);
      }

    } catch (error) {

      console.error(
        "Failed to clear cart",
        error
      );
    }
  };

  // =========================
  // HELPERS
  // =========================

  const getCartTotal = () =>
    cart.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    );

  const getCartCount = () =>
    cart.reduce(
      (count, item) =>
        count + Number(item.quantity),
      0
    );

  const isInCart = (productId) =>
    cart.some(
      (item) =>
        String(item._id) === String(productId)
    );

  const getProductQuantity = (
    productId
  ) => {

    const item = cart.find(
      (item) =>
        String(item._id) === String(productId)
    );

    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        getCartTotal,
        getCartCount,
        isInCart,
        getProductQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {

  const context =
    useContext(CartContext);

  if (!context) {

    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return context;
};
