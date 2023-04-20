import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Badge } from "@mui/material";
import { ShoppingCart, Logout, Login } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/authContext";
import { useCart } from "@/contexts/cartContext";

const pages = [
  /* {
    name: "Dashboard",
    link: "/dashboard",
    role: "seller",
  }, */
  {
    name: "Products",
    link: "/",
  },
  {
    name: "Orders",
    link: "/orders",
  },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const router = useRouter();
  const pathname = router.pathname;

  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Cart-Hive
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => (
                <Link
                  href={page.link}
                  style={{ textDecoration: "none" }}
                  key={index}
                >
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      fontWeight={pathname === page.link ? 600 : 400}
                    >
                      {page.name}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => (
              <Link
                href={page.link}
                style={{ textDecoration: "none" }}
                key={index}
              >
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    fontWeight: pathname === page.link ? 600 : 400,
                  }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Shopping Cart" arrow>
              <Link href="/cart" style={{ color: "inherit" }}>
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <Badge badgeContent={cart.length} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Link>
            </Tooltip>
            {!user && (
              <Tooltip title="Login" arrow>
                <Link href={"/auth/login"} style={{ color: "inherit" }}>
                  <IconButton size="large" color="inherit">
                    <Login />
                  </IconButton>
                </Link>
              </Tooltip>
            )}
            {user && (
              <Tooltip title="Logout" arrow>
                <IconButton size="large" color="inherit" onClick={logout}>
                  <Logout />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
