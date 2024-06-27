import { Box, Grid, Paper, Typography } from "@mui/material";
import StaticDeviceData from "./StaticData";
import MoistureGauge from "./MoistureGauge";
import MoistureGraph from "./MoistureGraph";

interface Props {
  name: string;
  description?: string;
  image: string;
}

const exampleMeasurements = [
  { date: new Date("June 18, 2024 03:24:00"), value: 17 },
  { date: new Date("June 19, 2024 03:24:00"), value: 25 },
  { date: new Date("June 20, 2024 03:24:00"), value: 18 },
  { date: new Date("June 21, 2024 03:24:00"), value: 30 },
  { date: new Date("June 22, 2024 03:24:00"), value: 37 },
  { date: new Date("June 23, 2024 03:24:00"), value: 57 },
  { date: new Date("June 24, 2024 03:24:00"), value: 80 },
];

export default function DeviceDetails({ name, description, image }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <StaticDeviceData name={name} description={description} image={image} />
      </Grid>

      <Grid
        item
        xs={12}
        md={2}
        sx={{ display: "flex", justifyContent: "center", alignItems: 'center' }}
      >
        <MoistureGauge moisturePercent={70} />
      </Grid>

      <Grid item xs={12} md={10} sx={{ height: '350px' }}>
        <MoistureGraph measurements={exampleMeasurements} />
      </Grid>
    </Grid>
  );
}
