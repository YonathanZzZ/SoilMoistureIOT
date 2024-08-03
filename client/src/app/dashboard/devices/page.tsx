"use client";

import { Box, Grid, Skeleton, Typography, Link } from "@mui/material";
import DevicePreview from "../../components/DevicePreview/DevicePreview";
import { useQuery } from "@tanstack/react-query";
import { getUserDevices } from "../../http/http";
import { WarningContext } from "../../components/WarningContext";
import { useContext, useEffect } from "react";
import { getErrorMessage } from "../../utils/ErrorMessages";
import NextLink from "next/link";

function Devices() {
  async function fetchUserDevices() {
    const res = await getUserDevices();
    if (!res.success) {
      throw new CustomError("Failed to fetch Devices", res.status);
    }

    res.data.map((deviceData: Device) => {
      if (deviceData.image_url) {
        console.log("found image url");
      }
    });
    console.log("devices fetched: ", res.data);
    return res.data;
  }

  const warningContext = useContext(WarningContext);

  const {
    data: devices,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => fetchUserDevices(),
    queryKey: ["devices"],
  });

  useEffect(() => {
    if (error) {
      const customError = error as CustomError;
      const message = getErrorMessage(customError.status);
      warningContext?.setNewMessage(message, "error");
    }
  }, [error, warningContext]);

  const defaultImage =
    "https://www.thespruce.com/thmb/d6mlSpKxdAIaOQBaUDH0S6A3e_k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-grow-monstera-deliciosa-5072671-01-a65286b8b3b8402882c7ad2c57756bbe.jpg";

  interface Device {
    uuid: string;
    name: string;
    description?: string;
    image_url?: string;
  }

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
      />
    );
  }

  if(devices.length === 0){
    return(
      <Box>
        <Typography>Looks like you haven't added any devices yet. {" "}
          <Link href="/dashboard/add-device" component={NextLink}>
            Click here to add your first device
          </Link>
          .
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={2}>
      {devices?.map((device: Device, index: number) => (
        <Grid
          key={index}
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <DevicePreview
            name={device.name}
            id={device.uuid}
            description={device.description}
            image={device.image_url ? device.image_url : defaultImage}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default Devices;
