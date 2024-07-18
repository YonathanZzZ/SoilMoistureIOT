import axios, { AxiosError, AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", //TODO use env var
  withCredentials: true,
});

console.log("baseURL: ", process.env.SERVER_URL);

interface SuccessResponse {
  success: true;
  status: number;
  data: any; //TODO define data type according to types returned from server
}

interface ErrorResponse {
  success: false;
  status: number | undefined;
}

type HttpResponse = SuccessResponse | ErrorResponse;

function errorToResponse(error: AxiosError): ErrorResponse {
  const res: ErrorResponse = { success: false, status: error.response?.status };
  return res;
}

function successToResponse(res: AxiosResponse) {
  const response: SuccessResponse = {
    success: true,
    status: res.status,
    data: res.data,
  };
  return response;
}

export async function getUserDevices() {
  try {
    const res = await axiosInstance.get("/devices");
    return successToResponse(res);
  } catch (error) {
    return errorToResponse(error as AxiosError);
  }
}

export async function getDeviceData(deviceId: string) {
  try {
    const res = await axiosInstance.get(`/devices/${deviceId}`);
    return successToResponse(res);
  } catch (error) {
    return errorToResponse(error as AxiosError);
  }
}

export async function getDeviceMeasurements(deviceId: string) {
  try {
    const res = await axiosInstance.get(`/measurements/${deviceId}`);
    return successToResponse(res);
  } catch (error) {
    return errorToResponse(error as AxiosError);
  }
}

export async function addDevice(name: string, description: string) {
  const data = { name: name, description: description };
  try {
    const res = await axiosInstance.post("/devices", data);
    return successToResponse(res);
  } catch (error) {
    return errorToResponse(error as AxiosError);
  }
}

interface UserData {
  name: string;
  email: string;
  password: string;
}

export async function signUp(data: UserData) {
  try {
    const res = await axiosInstance.post("/users/register/password", data);
    return successToResponse(res);
  } catch (error) {
    return errorToResponse(error as AxiosError);
  }
}

export async function signIn(data: {
  email: string;
  password: string;
}): Promise<HttpResponse> {
  try {
    const res = await axiosInstance.post("/users/login/password", data);
    return successToResponse(res);
  } catch (error) {
    return errorToResponse(error as AxiosError);
  }
}

export async function signOut() {
  try {
    const res = await axiosInstance.post("/users/logout");
    return successToResponse(res);
  } catch (error) {
    return errorToResponse(error as AxiosError);
  }
}
