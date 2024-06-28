"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import DeviceDetails from "../../../components/Device/Device";
import { useSearchParams } from "next/navigation";

export default function Device({params}: {params: {deviceId: string}}) {
  const deviceId = params.deviceId;

  async function fetchDeviceMeasurements() {
    const res = await fetch(`http://localhost:8080/measurements/${deviceId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  }

  async function fetchDeviceData() {
    const res = await fetch(`http://localhost:8080/devices/${deviceId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  }

  const queries = useQueries({
    queries: [
      {
        queryFn: () => fetchDeviceData(),
        queryKey: ["device"],
      },
      {
        queryFn: () => fetchDeviceMeasurements(),
        queryKey: ["deviceMeasurements"],
      },
    ],
  });

  const isLoading = queries.some((query) => query.isLoading);
  const deviceData = queries[0].data;
  const deviceMeasurements = queries[1].data;

  const defaultImage = "https://www.thespruce.com/thmb/d6mlSpKxdAIaOQBaUDH0S6A3e_k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-grow-monstera-deliciosa-5072671-01-a65286b8b3b8402882c7ad2c57756bbe.jpg";

  if (isLoading) {
    return <h1>Loading device data...</h1>; //TODO replace with a proper loading animation
  }
  
  //TODO handle query error

  return (
    <DeviceDetails
      name={deviceData.name}
      image= {deviceData.image ? deviceData.image : defaultImage} 
      description={deviceData.description}
      measurements={deviceMeasurements}
    />
  );
}
