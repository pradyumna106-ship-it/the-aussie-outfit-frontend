import { useState } from 'react'
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from "./context/CartContext";
import { FavouriteProvider } from "./context/FavouriteContext"
import { router } from './routes.js';

function App() {
  

  return (
     <AuthProvider>
      <CartProvider>
        <FavouriteProvider>
        <RouterProvider router={router} />
        </FavouriteProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
