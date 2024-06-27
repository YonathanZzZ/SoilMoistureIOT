'use client'

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Link from "next/link";

interface DeviceData {
  name: string;
  id: string;
  description?: string;
  image: string; //URL to image. provide URL to default image if none provided from server (user's data)
}

export default function DevicePreview(data: DeviceData) {
  return (
    <Card sx={{width: '100%', maxWidth: 375}}>
      <Link href={`/dashboard/devices/${data.id}`}>
      <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={data.image}
            alt="device image"
          ></CardMedia>
        
        <CardContent>
          <Typography gutterBottom variant="h5">{data.name}</Typography>

          {data.description && (
            <Typography variant="body2" color="text.secondary">{data.description}</Typography>
          )}
        </CardContent>
      </CardActionArea>
      </Link>
      
    </Card>
  );
}
