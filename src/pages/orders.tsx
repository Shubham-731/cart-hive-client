import {
  Box,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import { NextRouter } from "next/router";
import axios from "axios";

const OrderedProduct = ({
  title,
  description,
  status,
  orderId,
  price,
  quantity,
  image,
}: OrderedProduct) => {
  return (
    <Paper
      elevation={1}
      sx={{
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        flexWrap: "wrap",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: 250,
          width: 250,
        }}
      >
        <Image
          src={image}
          alt={title}
          fill={true}
          style={{ borderRadius: "0.5rem" }}
        />
      </Box>

      <Stack spacing={1} width="100%" position="relative" maxWidth="50rem">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="p" color="Highlight">
            Order ID: {orderId}
          </Typography>
          <Typography
            variant="caption"
            component="div"
            bgcolor="green"
            color="white"
            fontWeight="bold"
            textTransform="uppercase"
            sx={{
              padding: "0.25rem 1.5rem",
              borderRadius: "0.5rem",
              fontSize: "18px",
            }}
          >
            {status}
          </Typography>
        </Box>

        <Typography variant="h5" component="p">
          {title}
        </Typography>
        <Typography
          variant="body2"
          component="p"
          color="GrayText"
          width="fit-content"
        >
          {description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            color="error"
            fontWeight="bold"
            variant="h6"
            component="p"
          >
            Total Price: ${price * quantity}
          </Typography>
          <Typography variant="body1" component="p" color="GrayText">
            Quantity: {quantity}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

const Orders = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderedProduct[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | false>(false);

  const { user } = useAuth();
  const router: NextRouter = useRouter();

  // Verify user
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user]);

  // Get orders
  useEffect(() => {
    const getOrders = async (): Promise<void> => {
      const serverUrl = process.env.SERVER_URL || "http://localhost:3001";

      try {
        const authToken: string =
          localStorage.getItem("auth-token") ||
          sessionStorage.getItem("auth-token") ||
          "";

        const res = await axios.post(
          `${serverUrl}/api/orders`,
          { authToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 200) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        setErrorMsg(error instanceof Error && error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getOrders();
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Orders | Cart Hive</title>
      </Head>

      <Container maxWidth="lg" sx={{ padding: "2rem 0" }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Your Orders
        </Typography>

        <Stack spacing={2} divider={<Divider />}>
          {orders.map((order: OrderedProduct, i: number) => (
            <OrderedProduct
              orderId={order.orderId}
              quantity={order.quantity}
              title={order.title}
              description={order.description}
              price={order.price}
              image={order.image}
              status={order.status}
              key={i}
            />
          ))}
        </Stack>

        <Typography color="error" textAlign={"center"}>
          {loading
            ? "Fetching orders..."
            : !orders.length
            ? "No orders yet!"
            : errorMsg
            ? errorMsg
            : ""}
        </Typography>
      </Container>
    </>
  );
};

export default Orders;
