import { Box, Typography } from '@mui/material';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';

interface Props {
  moisturePercent: number;
}

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

export default function MoistureGauge({ moisturePercent }: Props) {
  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='flex-start'>
      <GaugeContainer
      width={200}
      height={120}
      startAngle={-110}
      endAngle={110}
      value={moisturePercent}      
    >
      <GaugeReferenceArc />
      <GaugeValueArc />
      <GaugePointer />
    </GaugeContainer>

    <Typography variant='h5'>
    {moisturePercent}%
    </Typography>
    
    </Box>
    
  );
}
