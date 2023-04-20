import AuthContextProvider from "./authContext";
import CartContextProvider from "./cartContext";

function Providers({ children }: { children: JSX.Element }) {
  return (
    <AuthContextProvider>
      <CartContextProvider>{children}</CartContextProvider>
    </AuthContextProvider>
  );
}

export default Providers;
