"use client";

import { useRouter } from "next/router";
import DeviceDetails from "../../../components/Device/Device";

interface Params {
  deviceId: string;
}

export default function Device({ deviceId }: Params) {

  //example data. the component should fetch measurement data from server

  return (
    <DeviceDetails
      name="my cool plant"
      image="https://www.thespruce.com/thmb/d6mlSpKxdAIaOQBaUDH0S6A3e_k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-grow-monstera-deliciosa-5072671-01-a65286b8b3b8402882c7ad2c57756bbe.jpg"
      description="a cool description"
    />
  );
}
