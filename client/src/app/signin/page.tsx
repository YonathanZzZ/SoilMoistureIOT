"use client";

import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import Link from "@mui/material/Link";
import { signIn } from "../http/http";
import { getErrorMessage } from "../utils/ErrorMessages";
import { UserContext } from "../components/UserContext";
import cookies from 'js-cookie';
export default function Signup() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const router = useRouter();

  const userContext = useContext(UserContext);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }

  function validate(values: { email: string; password: string }) {
    const errors = { email: "", password: "" };

    if (
      !values.email ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Password is required";
    }

    return errors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setMessage("");
    event.preventDefault();
    const validationErrors = validate(formValues);
    setFormErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== "",
    );
    if (hasErrors) {
      return;
    }

    const res = await signIn(formValues);
    if (!res.success) {
      setMessage(getErrorMessage(res.status));
    } else {
      userContext?.setUser(res.data);
      cookies.set('user', JSON.stringify(res.data));
      router.push("/dashboard");
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Welcome back!
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            error={Boolean(formErrors.email)}
            helperText={formErrors.email}
            autoFocus
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={handleChange}
            value={formValues.email}
          />
          <TextField
            error={Boolean(formErrors.password)}
            helperText={formErrors.password}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            value={formValues.password}
          />

          {message && (
            <Box sx={{ mt: 2 }}>
              <Alert
                severity="error"
                onClose={() => {
                  setMessage("");
                }}
              >
                {message}
              </Alert>
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography color="textSecondary">
              Don't have an account?{" "}
              <Link href="/signup" component={NextLink} variant="body2">
                {"Sign Up"}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
