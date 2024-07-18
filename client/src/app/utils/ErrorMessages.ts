const statusCodeToMessage: Record<number, string> = {
  401: "Wrong credentials",
  409: "User already exists",
  500: "Internal server error. Please try again later.",
};

//TODO create separate statusCodeToMessage objects for different components

export function getErrorMessage(status: number | undefined) {
  let msg: string;
  const serverError = "Failed to contact server";
  if (!status) {
    msg = serverError;
  } else {
    msg = statusCodeToMessage[status];
    if (!msg) {
      msg = serverError;
    }
  }

  return msg;
}
