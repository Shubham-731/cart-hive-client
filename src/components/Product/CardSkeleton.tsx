import { Card, CardContent, Skeleton } from "@mui/material";

function ProductCardSkeleton() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Skeleton
          variant="rectangular"
          height={140}
          width={315}
          animation="wave"
        />
        <Skeleton
          variant="text"
          sx={{ fontSize: "2rem", mt: 1 }}
          animation="wave"
        />

        <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
        <Skeleton
          variant="text"
          sx={{ fontSize: "1rem" }}
          width="75%"
          animation="wave"
        />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />

        <Skeleton
          variant="text"
          sx={{ fontSize: "1rem" }}
          width="50%"
          animation="wave"
        />
        <Skeleton
          variant="text"
          sx={{ fontSize: "1rem" }}
          width="80%"
          animation="wave"
        />
      </CardContent>
    </Card>
  );
}

export default ProductCardSkeleton;
