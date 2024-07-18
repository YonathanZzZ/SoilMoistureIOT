"use client";

import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "../http/http";
import { getErrorMessage } from "../utils/ErrorMessages";

export default function Signup() {
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }

  function validate(values: { name: string; email: string; password: string }) {
    const errors = { name: "", email: "", password: "" };
    if (!values.name) {
      errors.name = "Name is required";
    }

    if (
      !values.email ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else {
      if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      }
      if (!/\d/.test(values.password)) {
        errors.password = "Password must include at least one digit";
      }
      if (!/[a-z]/.test(values.password)) {
        errors.password = "Password must include at least one lowercase letter";
      }
      if (!/[A-Z]/.test(values.password)) {
        errors.password = "Password must include at least one uppercase letter";
      }
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

    const res = await signUp(formValues);
    if (!res.success) {
      setMessage(getErrorMessage(res.status));
    } else {
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
          Welcome
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            autoFocus
            name="name"
            onChange={handleChange}
            value={formValues.name}
          />

          <TextField
            error={Boolean(formErrors.email)}
            helperText={formErrors.email}
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
            <Box>
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

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 1 }}>
            Sign Up
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Typography color="textSecondary">
              Already have an account?{" "}
              <Link href="/signin" variant="body2">
                {"Sign In"}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
