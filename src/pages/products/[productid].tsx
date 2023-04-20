import {
  Box,
  Button,
  ButtonGroup,
  Container,
  LinearProgress,
  Paper,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Remove, ShoppingCart } from "@mui/icons-material";
import Image from "next/image";
import ImageContainer from "@/components/ImageContainer";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "@/contexts/cartContext";

const createCartProduct = (product: Product) => ({
  title: product.title,
  description: product.description,
  id: product.id,
  price: product.price,
  image: product.image,
  quantity: 1,
});

export default function Product() {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<boolean | string>("");
  const [prodQty, setProdQty] = useState(1);

  const { updateQty, addToCart, removeFromCart, cart } = useCart();

  const router = useRouter();
  const { productid } = router.query;

  useEffect(() => {
    const getProducts = async () => {
      try {
        // Get sample products from store api
        const res = await axios.get(
          `https://fakestoreapi.com/products/${productid}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 200) {
          setProduct(res.data);
        }
      } catch (error) {
        setError(error instanceof Error && error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Set product quantity
  useEffect(() => {
    if (product) {
      const productInCart = cart.find((value) => value.id === product.id);
      if (productInCart) {
        const productQty = productInCart.quantity;
        setProdQty(productQty);
      }
    }
  }, [cart]);

  // Product quantity
  const decrementQty = (): void => {
    if (product) {
      const productInCart = cart.find((value) => value.id === product.id);
      if (productInCart) {
        const productQty = productInCart.quantity;
        if (productQty === 1) {
          removeFromCart(product.id);
          return;
        }

        updateQty(product.id, productQty - 1);
      }
    }
  };

  const incrementQty = (): void => {
    if (product) {
      const productInCart = cart.find((value) => value.id === product.id);
      if (productInCart) {
        const productQty = productInCart.quantity;
        updateQty(product.id, productQty + 1);
      } else {
        addToCart(createCartProduct(product));
      }
    }
  };

  return (
    <Container maxWidth="lg">
      {loading && <LinearProgress color="secondary" />}

      {product && (
        <Paper
          sx={{
            marginTop: 2.5,
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            position: "relative",
            marginBottom: 2.5,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ position: "relative", width: "100%", maxWidth: "32rem" }}>
            <ImageContainer sx={{ marginBottom: 2 }}>
              <Image
                src={product.image}
                alt={product.title}
                fill={true}
                style={{ borderRadius: "1rem" }}
              />
            </ImageContainer>
          </Box>

          <Box
            sx={{
              width: "fit-content",
              display: "flex",
              gap: 2,
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
              color="Highlight"
              component={"p"}
            >
              {product.category}
            </Typography>
            <Typography
              component={"h4"}
              fontSize={24}
              variant="h4"
              sx={{ maxWidth: "500px" }}
            >
              {product.title}
            </Typography>
            <Typography
              component={"p"}
              variant="body1"
              color="GrayText"
              sx={{ maxWidth: "500px" }}
            >
              {product.description}
            </Typography>
            <Typography
              color="error.main"
              sx={{ fontSize: "20px", fontWeight: "bold" }}
            >
              Price: ${product.price}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography component="legend" color={"text.primary"}>
                Ratings:
              </Typography>
              <Rating
                name="read-only"
                value={product.rating?.rate}
                precision={0.1}
                readOnly
              />
              <Typography
                component="legend"
                variant="body2"
                color="text.secondary"
              >
                ({product.rating?.count})
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: "semibold", fontSize: "18px" }}>
                Quantity:
              </Typography>

              <ButtonGroup variant="outlined" aria-label="Select Qty.">
                <Tooltip title="Remove Qty" arrow>
                  <Button onClick={decrementQty}>
                    <Remove />
                  </Button>
                </Tooltip>
                <Button sx={{ fontWeight: "bold" }} color="primary" disabled>
                  {prodQty}
                </Button>
                <Tooltip title="Add Qty" arrow>
                  <Button onClick={incrementQty}>
                    <Add />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </Box>

            <Button
              color="secondary"
              sx={{
                width: "fit-content",
                fontWeight: "bold",
              }}
              variant="contained"
              startIcon={<ShoppingCart />}
              size="large"
              onClick={() => {
                cart.findIndex((value) => value.id === product.id) > -1
                  ? removeFromCart(product.id)
                  : addToCart(createCartProduct(product));
              }}
              fullWidth
            >
              {cart.findIndex((value) => value.id === product.id) > -1
                ? "Remove from Cart"
                : "Add to Cart"}
            </Button>
          </Box>
        </Paper>
      )}

      {error && (
        <Typography color="error" textAlign={"center"}>
          {error}
        </Typography>
      )}
    </Container>
  );
}
