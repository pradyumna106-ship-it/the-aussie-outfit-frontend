import { useState } from 'react'
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from "./context/CartContext";
import { router } from './routes.js';

function App() {
  

  return (
     <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
