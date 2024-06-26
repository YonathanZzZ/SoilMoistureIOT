'use client'

import { Box, Typography } from "@mui/material";
import { GaugeContainer, GaugeReferenceArc, GaugeValueArc, useGaugeState } from "@mui/x-charts";
import { Props } from "next/script";

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

export default function MoistureGauge() {
  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='flex-start'>
      <GaugeContainer
      width={200}
      height={120}
      startAngle={-110}
      endAngle={110}
      value={70}
      margin={{ top: 0, bottom: 0, left: 0, right: 0}}
      
    >
      <GaugeReferenceArc />
      <GaugeValueArc />
      <GaugePointer />
    </GaugeContainer>

    <Typography variant='h5'>
    50%
    </Typography>
    
    </Box>
    
  );
}