"use client";

import { useQueries } from "@tanstack/react-query";
import DeviceDetails from "../../../components/Device/DeviceDetails";
import axios from "axios";
import { getDeviceData, getDeviceMeasurements } from "../../../http/http";
import { getErrorMessage } from "../../../utils/ErrorMessages";
import { useContext, useEffect } from "react";
import { WarningContext } from "../../../components/WarningContext";

interface ServerMeasurement {
  id: number;
  createdAt: string;
  moisture_percentage: number;
}

function Device({ params }: { params: { deviceId: string } }) {
  const deviceId = params.deviceId;

  const warningContext = useContext(WarningContext);

  async function fetchDeviceData(){
    const res = await getDeviceData(deviceId);
    if(!res.success){
      throw new CustomError("Failed to fetch device data", res.status);
    }

    return res.data;
  }

  async function fetchDeviceMeasurements(){
    const res = await getDeviceMeasurements(deviceId);
    if(!res.success){
      throw new CustomError("Failed to fetch device measurements", res.status);
    }

    return res.data;
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
  const deviceDataError = queries[0].error as CustomError;
  const deviceMeasurementsError = queries[1].error as CustomError;
  const deviceData = queries[0].data;
  const deviceMeasurements = queries[1].data;

  useEffect(() => {
    if(deviceDataError){
      const message = getErrorMessage(deviceDataError.status);
      warningContext?.setNewMessage(message + 'while trying to fetch device data', 'error');
    } else if (deviceMeasurementsError){
      const message = getErrorMessage(deviceMeasurementsError.status);
      warningContext?.setNewMessage(message + 'while trying to fetch device measurements', 'error');
    }
  }, [deviceDataError, deviceMeasurementsError]);

  const defaultImage =
    "https://www.thespruce.com/thmb/d6mlSpKxdAIaOQBaUDH0S6A3e_k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-grow-monstera-deliciosa-5072671-01-a65286b8b3b8402882c7ad2c57756bbe.jpg";

  if (isLoading) {
    return <h1>Loading device data...</h1>; //TODO replace with MUI Skeleton component
  }

  if(deviceDataError || deviceMeasurementsError){
    return null;
  }

  function createDateForMeasurements(measurements: ServerMeasurement[]) {
    return measurements.map((measurement) => {
      const { createdAt, ...rest } = measurement;
      return {
        ...rest,
        date: new Date(createdAt),
      };
    });
  }

  return (
    <DeviceDetails
      name={deviceData.name}
      image={deviceData.image ? deviceData.image : defaultImage}
      description={deviceData.description}
      measurements={createDateForMeasurements(deviceMeasurements)}
    />
  );
}

export default Device;
