'use client'

import { Container, Grid } from "@mui/material";
import DevicePreview from "../../components/DevicePreview/DevicePreview";
import { useQuery } from "@tanstack/react-query";

export default function Devices() {
  const exampleDeviceData = [
    {
      name: "balcony monstera",
      id: 'some-device-id',
      description: "My cool plant",
      image:
        "https://www.thespruce.com/thmb/d6mlSpKxdAIaOQBaUDH0S6A3e_k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-grow-monstera-deliciosa-5072671-01-a65286b8b3b8402882c7ad2c57756bbe.jpg",
    },
    {
      name: "balcony monstera",
      id: 'some-device-id',
      description: "My cool plant",
      image:
        "https://www.thespruce.com/thmb/d6mlSpKxdAIaOQBaUDH0S6A3e_k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-grow-monstera-deliciosa-5072671-01-a65286b8b3b8402882c7ad2c57756bbe.jpg",
    },
    {
      name: "balcony monstera",
      id: 'some-device-id',
      description: "My cool plant",
      image:
        "https://www.thespruce.com/thmb/d6mlSpKxdAIaOQBaUDH0S6A3e_k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-grow-monstera-deliciosa-5072671-01-a65286b8b3b8402882c7ad2c57756bbe.jpg",
    },
    {
      name: "balcony monstera",
      id: 'some-device-id',
      description: "My cool plant",
      image:
        "https://www.thespruce.com/thmb/d6mlSpKxdAIaOQBaUDH0S6A3e_k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-grow-monstera-deliciosa-5072671-01-a65286b8b3b8402882c7ad2c57756bbe.jpg",
    },
    {
      name: "balcony monstera",
      id: 'some-device-id',
      description: "My cool plant",
      image:
        "https://www.thespruce.com/thmb/d6mlSpKxdAIaOQBaUDH0S6A3e_k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-grow-monstera-deliciosa-5072671-01-a65286b8b3b8402882c7ad2c57756bbe.jpg",
    },
  ];

  async function fetchDevices(){
    //TODO implement and move to different file
    const res = await fetch("http://localhost:8080/devices/", {
      method: 'GET',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      },
    });

    const data = await res.json();
    console.log('data in fetchDevices: ', data);
    return data;
  }

  const {data: devices, isLoading} = useQuery({
    queryFn: () => fetchDevices(),
    queryKey: ["devices"],
  });

  const defaultImage = "https://www.thespruce.com/thmb/d6mlSpKxdAIaOQBaUDH0S6A3e_k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-grow-monstera-deliciosa-5072671-01-a65286b8b3b8402882c7ad2c57756bbe.jpg";

  interface Device{
    uuid: string;
    name: string;
    description?: string;
    image?: string;
  }

  if(isLoading){
    return <h1>Loading devices...</h1>
  }else{
    console.log('devices: ', devices);
  }

  return (
    <Grid container spacing={2}>
      {devices?.map((device: Device) => (
        <Grid item xs={12} sm={6} md={4} lg={3} sx={{display: 'flex', justifyContent: 'center'}}>
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
