import { Box, Grid, Link, Paper, Typography } from "@mui/material";
import StaticDeviceData from "./StaticData";
import MoistureGauge from "./MoistureGauge";
import MoistureGraph from "./MoistureGraph";
import NextLink from 'next/link';

interface Measurement {
  id: number;
  date: Date;
  moisture_percentage: number;
}

interface Props {
  name: string;
  description?: string;
  image: string;
  measurements: Measurement[];
}

export default function DeviceDetails({
  name,
  description,
  image,
  measurements,
}: Props) {


  const lastMeasurement = measurements[measurements.length - 1];

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
            <Paper elevation={7} sx={{borderRadius: '1em'}}>
            <MoistureGauge moisturePercent={lastMeasurement.moisture_percentage} />
            </Paper>
            
          </Grid>

          <Grid item xs={12} md={10} sx={{ height: "350px" }}>
            <Paper elevation={7} sx={{height: '100%', borderRadius: '1em'}}>
            <MoistureGraph measurements={measurements} />
            </Paper>
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
