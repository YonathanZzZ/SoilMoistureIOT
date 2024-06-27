import { Container, Grid } from "@mui/material";
import DevicePreview from "../../components/DevicePreview/DevicePreview";

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

  return (
    <Grid container spacing={2}>
      {exampleDeviceData.map((device) => (
        <Grid item xs={12} sm={6} md={4} lg={3} sx={{display: 'flex', justifyContent: 'center'}}>
          <DevicePreview

            name={device.name}
            id={device.id}
            description={device.description}
            image={device.image}
          />
        </Grid>
      ))}
    </Grid>
  );
}
