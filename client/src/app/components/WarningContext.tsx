'use client'

import { Snackbar, Alert } from "@mui/material";
import { createContext, ReactNode, useState } from "react";

type Severity = "success" | "warning" | "error";

interface Message {
  text: string;
  severity: Severity;
}

interface Props {
  children: ReactNode;
}

interface WarningContextValues{
  setNewMessage: (text: string, severity: Severity) => void;
}

export const WarningContext = createContext<WarningContextValues | null>(null);

export function WarningProvider({ children }: Props) {
  const [message, setMessage] = useState<Message>({
    text: "",
    severity: "success",
  });

  function handleClose(event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") {
      return;
    }

    setMessage({ text: "", severity: "success" });
  }

  function setNewMessage(text: string, severity: Severity) {
    setMessage({ text: text, severity: severity });
  }

  const contextValue: WarningContextValues = {
    setNewMessage
  };

  return (
    <>
      <WarningContext.Provider value={contextValue}>{children}</WarningContext.Provider>

      <Snackbar
        open={Boolean(message.text)}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={message.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </>
  );
}
