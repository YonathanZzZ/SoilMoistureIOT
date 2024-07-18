"use client";

import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useContext, useState } from "react";
import { addDevice } from "../../http/http";
import { WarningContext } from "../../components/WarningContext";
import { getErrorMessage } from "../../utils/ErrorMessages";

function AddDevice() {
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
  });

  const [deviceCredentials, setDeviceCredentials] = useState<{
    deviceID: string;
    secretKey: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const warningContext = useContext(WarningContext);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }

  function validate(values: { name: string; description: string }) {
    const errors = { name: "", description: "" };

    if (!values.name) {
      errors.name = "Please enter a device name";
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

    const res = await addDevice(formValues.name, formValues.description);
    if(!res.success){
      const errorMessage = getErrorMessage(res.status);
      warningContext?.setNewMessage(errorMessage, 'error');

      return;
    }

    const credentials = res.data;

    setDeviceCredentials(credentials);
  }

  function handleCopyClick(field: string) {
    if (field === "device-id") {
      navigator.clipboard.writeText(deviceCredentials!.deviceID);
    } else if (field === 'device-secret') {
      navigator.clipboard.writeText(deviceCredentials!.secretKey);
    }

    setCopied(true);
  }

  return !deviceCredentials ? (
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
          Device ID: {deviceCredentials.deviceID}
        </Typography>

        <IconButton onClick={() => handleCopyClick('device-id')}>
          <ContentCopyIcon />
        </IconButton>
        </Box>

        <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
        <Typography variant="body1">
          Device secret key: {deviceCredentials.secretKey}
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

export default AddDevice;