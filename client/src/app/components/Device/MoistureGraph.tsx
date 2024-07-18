import { LineChart } from "@mui/x-charts/LineChart";

interface Measurement {
  id: number;
  date: Date;
  moisture_percentage: number;
}

interface Props {
  measurements: Measurement[];
}

export default function MoistureGraph({ measurements }: Props) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const filteredMeasurements = measurements.filter(
    (measurement) => measurement.date >= sevenDaysAgo
  ); //only show measurements of last week

  // console.log('getDay value: ', measurements[0].date.getDay()));

  function customXAxisormatter(date: number) {
    const actualDate = new Date(date);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = actualDate.getDay();
    return daysOfWeek[dayIndex];
  }

  return (
    <LineChart
      dataset={filteredMeasurements}
      xAxis={[
        {
          valueFormatter: customXAxisormatter,
          disableTicks: true,
          dataKey: "date",
        },
      ]}
      yAxis={[{ min: 0, max: 100 }]}
      series={[
        {
          label: "Moisture percent",
          dataKey: "moisture_percentage",
        },
      ]}
    />
  );
}
