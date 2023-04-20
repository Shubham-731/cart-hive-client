import { Box, Button, Typography } from "@mui/material";
import ProductCard from "./Card";
import ProductCardSkeleton from "./CardSkeleton";
import axios from "axios";
import { useState, useEffect } from "react";

interface Props {
  title: string;
}

const ProductSection = ({ title }: Props) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<[] | Product[]>([]);
  const [error, setError] = useState<boolean | string>("");
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const getProducts = async () => {
      try {
        // Get sample products from store api
        const res = await axios.get("https://fakestoreapi.com/products", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 200) {
          setProducts(res.data);
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

  return (
    <Box my={4} mb={8} component={"section"}>
      <Typography
        variant="h5"
        fontWeight={"bold"}
        textAlign={"center"}
        gutterBottom
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          my: 4,
        }}
      >
        {loading ? (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        ) : (
          <>
            {products.slice(0, limit).map((prod, i) => (
              <ProductCard
                key={i}
                id={prod.id}
                title={prod.title}
                description={prod.description}
                image={prod.image}
                rating={prod.rating}
                price={prod.price}
              />
            ))}
          </>
        )}

        {error && (
          <Typography color="error" textAlign={"center"} width="100%">
            {error}
          </Typography>
        )}
      </Box>
      {products.length > limit && (
        <Button
          color="secondary"
          variant="outlined"
          sx={{ display: "block", margin: "0 auto" }}
          onClick={() => setLimit((prevLimit) => prevLimit + 5)}
        >
          Show more
        </Button>
      )}
    </Box>
  );
};

export default ProductSection;
