import { Grid, Link, Typography } from "@mui/material";
import StaticDeviceData from "./StaticData";
import MoistureGauge from "./MoistureGauge";
import MoistureGraph from "./MoistureGraph";
import NextLink from 'next/link';

interface Measurement {
  date: Date;
  value: number;
}

interface Props {
  name: string;
  description?: string;
  image: string;
  measurements: Measurement[];
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

export default function DeviceDetails({
  name,
  description,
  image,
  measurements,
}: Props) {
  const lastMeasurement = exampleMeasurements[exampleMeasurements.length - 1];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <StaticDeviceData name={name} description={description} image={image} />
      </Grid>

      {measurements.length !== 0 ? (
        <>
          <Grid
            item
            xs={12}
            md={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MoistureGauge moisturePercent={lastMeasurement.value} />
          </Grid>

          <Grid item xs={12} md={10} sx={{ height: "350px" }}>
            <MoistureGraph measurements={exampleMeasurements} />
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <Typography >
            No data to be shown. {" "}
            <Link href="/device-setup-guide" target="_blank" component={NextLink} variant="body2">
                Need help setting up a device?
              </Link>
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
