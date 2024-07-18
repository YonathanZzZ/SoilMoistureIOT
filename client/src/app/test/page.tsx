'use client'

import { Paper } from "@mui/material";
import { LineChart } from "@mui/x-charts";

export default function MoistureGauge() {
  const measurements = [{date: new Date(), moisture_percentage: 50}];

  return (
    <Paper>
      <LineChart
      xAxis={[
        {
          data: measurements.map((measurement) => measurement.date),
          label: "Day",
        },
      ]}
      series={[
        {
          data: measurements.map(
            (measurement) => measurement.moisture_percentage
          ),
          label: "Moisture percent",
        },
      ]}
      height={500}
      width={500}
    />
    </Paper>
    
    
  );
}