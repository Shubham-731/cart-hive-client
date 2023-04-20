import { Box, styled } from "@mui/material";

const ImageContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: "0",
  paddingBottom: "56.25%", // aspect ratio of 16:9
});

export default ImageContainer;
