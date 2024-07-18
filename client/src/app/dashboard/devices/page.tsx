'use client'

import { Grid } from "@mui/material";
import DevicePreview from "../../components/DevicePreview/DevicePreview";
import { useQuery } from "@tanstack/react-query";
import { getUserDevices } from "../../http/http";
import { WarningContext } from "../../components/WarningContext";
import { useContext, useEffect } from "react";
import { getErrorMessage } from "../../utils/ErrorMessages";

function Devices() {
  async function fetchUserDevices(){
    const res = await getUserDevices();
    if(!res.success){
      throw new CustomError("Failed to fetch Devices", res.status);
    }

    return res.data;
  }

  const warningContext = useContext(WarningContext);
  
  const {data: devices, isLoading, error} = useQuery({
    queryFn: () => fetchUserDevices(),
    queryKey: ["devices"],
  });

  useEffect(() => {
    if(error){
    const customError = error as CustomError;
    const message = getErrorMessage(customError.status);
    warningContext?.setNewMessage(message, "error");
    }
    
  }, [error]);

  const defaultImage = "https://www.thespruce.com/thmb/d6mlSpKxdAIaOQBaUDH0S6A3e_k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-grow-monstera-deliciosa-5072671-01-a65286b8b3b8402882c7ad2c57756bbe.jpg";

  interface Device{
    uuid: string;
    name: string;
    description?: string;
    image?: string;
  }

  if(error){
    
    return null;
  }

  if(isLoading){
    //TODO use Skeleton component instead of text
    return <h1>Loading devices...</h1>
  }

  return (
    <Grid container spacing={2}>
      {devices?.map((device: Device, index: number) => (
        <Grid key={index} item xs={12} sm={6} md={4} lg={3} sx={{display: 'flex', justifyContent: 'center'}}>
          <DevicePreview
            name={device.name}
            id={device.uuid}
            description={device.description}
            image={device.image ? device.image : defaultImage}
          />
        </Grid>
      ))}
    </Grid>
    
  );
}

export default Devices;
