import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea, Rating } from "@mui/material";
import Link from "next/link";

export default function ProductCard({
  id,
  title,
  price,
  description,
  image,
  rating,
}: Product) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Link href={`/products/${id}`} style={{ textDecoration: "none" }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={image}
            alt="green iguana"
          />
          <CardContent>
            <Typography
              variant="h6"
              component="div"
              color="text.primary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </Typography>
            <Typography color="secondary" fontWeight={"bold"} my={0.25}>
              Price: ${price}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography component="legend" color={"text.primary"}>
                Ratings:
              </Typography>
              <Rating
                name="read-only"
                value={rating?.rate}
                precision={0.1}
                readOnly
              />
              <Typography
                component="legend"
                variant="body2"
                color="text.secondary"
              >
                ({rating?.count})
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
