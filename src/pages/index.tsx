import * as React from "react";
import ProductSection from "@/components/Product/Section";
import Container from "@mui/material/Container";
import { useAuth } from "@/contexts/authContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <ProductSection title="Available products" />
    </Container>
  );
}
