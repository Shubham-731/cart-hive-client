import { useContext, createContext, useReducer, useEffect } from "react";
import axios, { AxiosError } from "axios";
import shortid from "shortid";
import { useRouter } from "next/router";

// Types
interface CartContextType {
  cart: Cart[];
  addToCart: (product: Cart) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  createCheckout: () => Promise<void>;
  clearCart: () => void;
}

// Checkout request body
interface CheckoutReqBody {
  orderId: string;
  products: Cart[];
  authToken: string;
}

type Action =
  | { type: "set"; cart: Cart[] }
  | { type: "updated_qty"; id: number; qty: number }
  | {
      type: "added";
      product: Cart;
    }
  | {
      type: "removed";
      id: number;
    };

const serverUrl = process.env.SERVER_URL || "http://localhost:3001";

// Cart context
const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
  createCheckout: async () => {},
  clearCart: () => {},
});

// Cart reducer
const initialCart: Cart[] = [];

function cartReducer(state: Cart[], action: Action) {
  switch (action.type) {
    case "set": {
      return action.cart;
    }

    case "updated_qty": {
      const product = state.find((value) => value.id === action.id);
      if (product) {
        product.quantity = action.qty;
        const updatedCart = state.filter((value) => value.id !== action.id);
        return [...updatedCart, product];
      }

      return state;
    }

    case "added": {
      return [...state, action.product];
    }

    case "removed": {
      return state.filter((val) => val.id !== action.id);
    }

    default:
      throw Error("Unknown action");
  }
}

function CartContextProvider({ children }: { children: JSX.Element }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  const router = useRouter();

  // Add to cart
  const addToCart = (product: Cart) => {
    dispatch({ type: "added", product });
    alert("Added to cart!");
  };

  // Remove from cart
  const removeFromCart = (id: number) => {
    dispatch({ type: "removed", id });
    alert("Removed from cart!");
  };

  // Update quantity
  const updateQty = (id: number, qty: number) => {
    dispatch({ type: "updated_qty", id, qty });
  };

  // Clear cart
  const clearCart = () => {
    localStorage.setItem("cart", JSON.stringify([]));
    dispatch({ type: "set", cart: [] });
  };

  // Set cart stored in localstorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    if (!cart.length && storedCart) {
      dispatch({ type: "set", cart: JSON.parse(storedCart) });
    }
  }, []);

  // Store updated cart
  useEffect(() => {
    if (cart.length) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Create checkout session
  const createCheckout = async () => {
    try {
      const authToken =
        localStorage.getItem("auth-token") ||
        sessionStorage.getItem("auth-token");

      if (!authToken) {
        return alert(`You're not authenticated yet. Please signin!`);
      }

      const reqBody: CheckoutReqBody = {
        orderId: `order_${shortid.generate()}`,
        products: cart,
        authToken,
      };
      const res = await axios.post(
        `${serverUrl}/api/checkout/create-session`,
        reqBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        router.push(res.data.checkoutUrl);
      }
    } catch (error) {
      const errorRes = error instanceof AxiosError && error.response;
      if (errorRes && errorRes.status === 401) {
        router.push("/auth/login");
      } else {
        alert(error instanceof Error && error.message);
        console.log(error);
      }
    }
  };

  const contextValues: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    createCheckout,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValues}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContextProvider;
export const useCart = () => useContext(CartContext);
