"use client";

import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

export default function AddDevice() {
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
  });

  const [deviceData, setDeviceData] = useState<{
    deviceID: string;
    secretKey: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }

  function validate(values: { name: string; description: string }) {
    const errors = { name: "", description: "" };

    if (!values.name) {
      errors.name = "Invalid email address";
    }

    return errors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(formValues);
    setFormErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );
    if (hasErrors) {
      return;
    }

    const res = await fetch("http://localhost:8080/devices", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });

    if (!res.ok) {
      console.error("failed to register device on server");
      //TODO handle errors
      return;
    }

    const data: { deviceID: string; secretKey: string } = await res.json();
    setDeviceData(data);
  }

  function handleCopyClick(field: string) {
    if (field === "device-id") {
      navigator.clipboard.writeText(deviceData!.deviceID);
    } else if (field === 'device-secret') {
      navigator.clipboard.writeText(deviceData!.secretKey);
    }

    setCopied(true);
  }

  return !deviceData ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Enter device details
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          error={Boolean(formErrors.name)}
          helperText={formErrors.name}
          autoFocus
          margin="normal"
          required
          fullWidth
          id="name"
          label="Device name"
          name="name"
          autoComplete="name"
          onChange={handleChange}
          value={formValues.name}
        />
        <TextField
          error={Boolean(formErrors.description)}
          helperText={formErrors.description}
          margin="normal"
          fullWidth
          name="description"
          label="Device description"
          id="description"
          autoComplete="current-description"
          onChange={handleChange}
          value={formValues.description}
          multiline
          minRows={3}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Add Device
        </Button>
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Your Device credentials
      </Typography>

      <Box mt="1em">
        <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
        <Typography variant="body1">
          Device ID: {deviceData.deviceID}
        </Typography>

        <IconButton onClick={() => handleCopyClick('device-id')}>
          <ContentCopyIcon />
        </IconButton>
        </Box>

        <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
        <Typography variant="body1">
          Device secret key: {deviceData.secretKey}
        </Typography>

        <IconButton onClick={() => handleCopyClick('device-secret')}>
          <ContentCopyIcon />
        </IconButton>
        </Box>
        

        {/* <Button variant="contained" color="primary" onClick={handleCopyClick}>
          {copied
            ? "Secret key Copied to clipboard!"
            : "Copy secret key to Clipboard"}
        </Button> */}
        <Typography variant="body2" color="error">
          ⚠️ Do not share the secret key with anyone!
        </Typography>

        <Typography variant="body1">
          Use these generated device credentials in the config file
        </Typography>
      </Box>
    </Box>
  );
}
