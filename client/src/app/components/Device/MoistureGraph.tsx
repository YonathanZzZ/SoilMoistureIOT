import { LineChart } from '@mui/x-charts/LineChart';
import { format } from 'date-fns';

interface measurement{
  date: Date;
  value: number; //moisture percentage
}

interface Props{
  measurements: measurement[];
}

export default function MoistureGraph({measurements}: Props) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const filteredMeasurements = measurements.filter((measurement) => measurement.date >= sevenDaysAgo);
  // const formattedDates = filteredMeasurements.map((measurement) => format(measurement.date, 'EEEE'))

  return (
    <LineChart
      xAxis={[{ data: filteredMeasurements.map((measurement) => measurement.date), label: 'Day' }]}
      series={[
        {
          data: filteredMeasurements.map((measurement) => measurement.value),
          label: 'Moisture percent'
        },
      ]}
    />
  );
}