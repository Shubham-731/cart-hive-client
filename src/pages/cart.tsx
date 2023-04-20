import { ShoppingCartCheckout } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useCart } from "@/contexts/cartContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import runFireworks from "@/utils/runFirewalls";
import axios from "axios";

const CartProduct = ({
  title,
  id,
  image,
  quantity,
  price,
  description,
}: Cart) => {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Box sx={{ position: "relative", width: "100px", height: "100px" }}>
        <Image src={image} alt={title} fill={true} />
      </Box>

      <Box>
        <Link
          href={`/products/${id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography
            variant="h6"
            sx={{
              width: "100%",
              marginBottom: 1,
              ":hover": {
                textDecoration: "underline",
              },
            }}
            maxWidth="20rem"
            noWrap
          >
            {title}
          </Typography>
        </Link>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <Typography color="GrayText">Quantity: {quantity}</Typography>
          <Typography variant="body1" component="p">
            Total Price:{" "}
            <Typography component="span" color="error.main">
              ${quantity * price}
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const Cart = () => {
  const [totalPrice, setTotalPrice] = useState(0);

  const { cart, clearCart, createCheckout } = useCart();
  const router = useRouter();

  // Create order
  const createOrder = async (
    products: Cart[],
    orderId: string
  ): Promise<void> => {
    try {
      // Server url
      const serverUrl: string =
        process.env.SERVER_URL || "http://localhost:3001";

      // Get authToken
      const authToken: string =
        localStorage.getItem("auth-token") ||
        sessionStorage.getItem("auth-token") ||
        "";
      if (!authToken) {
        alert("Failed to create order!");
        router.push("/auth/login");
      }

      // Make the resquest
      const updatedProducts = products.map((product) => ({
        ...product,
        orderId,
        status: "ordered",
      }));
      const res = await axios.post(
        `${serverUrl}/api/orders/create`,
        { authToken, products: updatedProducts },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        clearCart();
        runFireworks();
        router.push("/orders");
      } else {
        alert("Unable to create your order!");
      }
    } catch (error) {
      alert(error instanceof Error && error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    // Extract order_id and success or cancel params
    const orderId: string = router.query.order_id?.toString() || "";
    if (router.query.success && orderId) {
      const storedCart: string = localStorage.getItem("cart") || "";
      const cartProducts: Cart[] = JSON.parse(storedCart);

      if (cartProducts.length) {
        createOrder(cartProducts, orderId);
      }
    }

    if (router.query.canceled && orderId) {
      alert("Order canceled!");
      router.push("/cart");
    }
  }, [router.query]);

  useEffect(() => {
    if (cart.length) {
      const totalPriceArr = cart.map(
        (product) => product.quantity * product.price
      );
      setTotalPrice(
        totalPriceArr.reduce(
          (accumulator, currentValue) => accumulator + currentValue
        )
      );
    }
  }, [cart]);

  return (
    <Container maxWidth="sm" sx={{ paddingTop: 2 }}>
      <Typography variant="h4" component={"h1"} textAlign="center" gutterBottom>
        Your Shopping Cart
      </Typography>

      {cart.length ? (
        <Paper
          elevation={3}
          sx={{
            marginTop: 2.5,
            padding: 2,
            position: "relative",
            marginBottom: 2.5,
            paddingBottom: 1,
          }}
        >
          <Stack
            direction="column"
            divider={<Divider />}
            spacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ maxHeight: "64vh", overflowY: "auto" }}
          >
            {cart.map((product) => (
              <CartProduct
                key={product.id}
                id={product.id}
                title={product.title}
                image={product.image}
                description={product.description}
                quantity={product.quantity}
                price={product.price}
              />
            ))}
          </Stack>

          <Box
            my={2}
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component="p">
              Total Price:{" "}
              <Typography
                component="span"
                color="error.main"
                sx={{ fontSize: "18px", fontWeight: "bold" }}
              >
                ${totalPrice}
              </Typography>
            </Typography>

            <Button
              color="secondary"
              variant="contained"
              size="medium"
              startIcon={<ShoppingCartCheckout />}
              onClick={createCheckout}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Paper>
      ) : (
        <Typography
          variant="body1"
          color={"error"}
          component={"p"}
          textAlign="center"
          gutterBottom
        >
          No Items in your cart!{" "}
          <Link href="/" style={{ fontWeight: "bold" }}>
            Continue Shopping
          </Link>
        </Typography>
      )}
    </Container>
  );
};

export default Cart;
