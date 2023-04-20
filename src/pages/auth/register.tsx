import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Register() {
  const { user, register } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  const initialValues: RegisterFormValTypes = {
    fullName: "",
    email: "",
    password: "",
    rememberMe: false,
  };

  const formik = useFormik({
    initialValues,
    async onSubmit(values, formikHelpers) {
      await register(values);
      formikHelpers.setSubmitting(false);
    },
  });

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            "url(https://source.unsplash.com/featured/?e-commerce,cart,marketting,product)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" sx={{ mt: 1 }} onSubmit={formik.handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              placeholder="First and last name"
              autoComplete="fullName"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              label="Password"
              placeholder="Create password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  name="rememberMe"
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              fullWidth
            >
              {formik.isValidating === false && formik.isSubmitting === true ? (
                <CircularProgress sx={{ color: "white" }} size={24} />
              ) : (
                "Sign Up"
              )}
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/auth/login">
                  {"Already have an account? Login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

Register.getLayout = function PageLayout(page: JSX.Element) {
  return <>{page}</>;
};
